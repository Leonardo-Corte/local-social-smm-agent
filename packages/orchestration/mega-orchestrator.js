const fs = require("fs");
const path = require("path");
const { runOllamaGenerate } = require("../local-runtime/model-client");
const { registerArtifact } = require("../publishing/artifact-registry");
const { workspacePaths } = require("../workspace-runner/workspace-paths");
const { auditContentPolicy } = require("../review-loop/content-policy");
const { CreativeRoom } = require("./creative-room");
const { runBrainstorm } = require("./brainstorm-engine");
const { runAdaptiveTeamOrchestration } = require("./adaptive-orchestrator");
const { runPromptEngineer } = require("./prompt-engineer");
const { generateImage } = require("../image-workflow/pollinations-adapter");
const { buildReflectionsPrompt, updateReflections } = require("../memory/agent-reflections");

const BRAINSTORM_AGENTS = [
  { id: "brand-strategist",    label: "Brand Strategist",    focus: "posizionamento, voce, promise" },
  { id: "copywriter",          label: "Copywriter",           focus: "copy, hook, caption, CTA" },
  { id: "visual-director",     label: "Visual Director",      focus: "immagini, estetica, composizione" },
  { id: "reel-shorts-producer",label: "Reel Producer",        focus: "script video, ritmo, beat" },
  { id: "market-researcher",   label: "Market Researcher",    focus: "trend, angoli, competitor" },
  { id: "persona-simulator",   label: "Persona Simulator",    focus: "obiezioni, trigger, psicologia target" },
  { id: "critic-qa",           label: "Critic QA",            focus: "rischi, claim, blockers" }
];

const INTENT_AGENTS = {
  reel:     ["brand-strategist", "copywriter", "reel-shorts-producer", "market-researcher", "persona-simulator", "critic-qa"],
  post:     ["brand-strategist", "copywriter", "visual-director", "market-researcher", "persona-simulator", "critic-qa"],
  image:    ["visual-director", "brand-strategist", "copywriter", "critic-qa"],
  carousel: ["brand-strategist", "copywriter", "visual-director", "persona-simulator", "critic-qa"],
  campaign: BRAINSTORM_AGENTS.map((a) => a.id),
  default:  ["brand-strategist", "copywriter", "market-researcher", "persona-simulator", "critic-qa"]
};

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function detectIntent(request) {
  const t = request.toLowerCase();
  if (/\breel|video|script|short\b/.test(t)) return "reel";
  if (/\bimmagin|image|foto|illustra|visual|thumbnail|cover\b/.test(t)) return "image";
  if (/\bcarosel|carousel|slide|carosello\b/.test(t)) return "carousel";
  if (/\bcampaign|campagna|strategia|piano\b/.test(t)) return "campaign";
  if (/\bpost|caption|instagram|facebook\b/.test(t)) return "post";
  return "default";
}

async function buildTaskPlan({ request, intent, agents, model, timeoutMs }) {
  const agentList = agents.map((a) => `- ${a.label} (${a.focus})`).join("\n");

  const prompt = `Sei un mega-orchestratore di un team creativo di marketing.

## Richiesta del cliente
${request}

## Team disponibile
${agentList}

## Il tuo compito
Crea un piano di lavoro strutturato per questo team. Sii specifico e pratico.

### 1. Obiettivo principale
[1-2 righe sull'obiettivo concreto]

### 2. Task per agente
Per ogni agente rilevante, scrivi i task specifici assegnati:
TASK [@agente]: [task concreto e misurabile]

### 3. Domande critiche da risolvere nel brainstorm
[3-5 domande che il team deve rispondere per produrre qualcosa di ottimo]

### 4. Criteri di successo
[Come sappiamo che il risultato finale è buono?]

### 5. Rischi da monitorare
[Cosa potrebbe andare storto?]

Sii diretto e pratico. Questo piano verrà usato per orchestrare il brainstorming.`;

  let output = "";
  try {
    output = await runOllamaGenerate({ model, prompt, timeoutMs: Math.min(timeoutMs, 90000) });
  } catch (err) {
    output = `Piano di fallback per: ${request}`;
  }

  const tasksByAgent = {};
  const taskPattern = /TASK\s*\[@?([\w-]+)\]:\s*(.+)/g;
  let match;
  while ((match = taskPattern.exec(output)) !== null) {
    const agentId = match[1].trim();
    if (!tasksByAgent[agentId]) tasksByAgent[agentId] = [];
    tasksByAgent[agentId].push(match[2].trim());
  }

  return { intent, tasksByAgent, raw: output };
}

async function runExecutionPhase({ request, creativeBrief, intent, workspace, model, timeoutMs, apply, workspaceRoot, root }) {
  const execType = intent === "image" ? "visual" : intent;
  const augmentedRequest = `${request}\n\n## Creative Brief dal brainstorming del team\n${creativeBrief.slice(0, 2000)}`;

  const result = await runAdaptiveTeamOrchestration({
    root,
    workspace,
    request: augmentedRequest,
    type: execType === "campaign" ? "post" : execType,
    model,
    timeoutMs,
    apply,
    maxRevisions: 1
  });

  return result;
}

async function runMegaOrchestration({
  root,
  workspace,
  request,
  model = "qwen2.5:14b",
  timeoutMs = 240000,
  apply = true,
  onProgress
}) {
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) throw new Error(`Workspace non trovato: ${workspace}`);

  const runId = timestampId();
  const megaRoot = path.join(workspaceRoot, "mega-runs", runId);
  fs.mkdirSync(megaRoot, { recursive: true });

  const intent = detectIntent(request);
  const agentIds = INTENT_AGENTS[intent] || INTENT_AGENTS.default;
  const agents = BRAINSTORM_AGENTS.filter((a) => agentIds.includes(a.id));

  if (onProgress) onProgress({ phase: "planning", message: `Intent: ${intent}, ${agents.length} agenti selezionati` });

  // ── Task planning ──────────────────────────────────────────────────────────
  const taskPlan = await buildTaskPlan({ request, intent, agents, model, timeoutMs });
  writeText(path.join(megaRoot, "task-plan.md"), `# Task Plan\n\n${taskPlan.raw}`);
  if (onProgress) onProgress({ phase: "planning", message: "Task plan creato" });

  // ── Load agent definitions ─────────────────────────────────────────────────
  const agentDefs = {};
  for (const agent of agents) {
    const defPath = path.join(workspaceRoot, "agents", `${agent.id}.md`);
    agentDefs[agent.id] = readText(defPath);
  }

  // ── Creative room ──────────────────────────────────────────────────────────
  const room = new CreativeRoom({ runId, workspaceRoot, agents });

  // ── Reflections — inject team memory into brainstorm ──────────────────────
  const reflectionsContext = buildReflectionsPrompt(workspaceRoot, { intent });
  if (reflectionsContext && onProgress) onProgress({ phase: "brainstorm", message: "Memoria del team caricata — iniettata nel brainstorm" });

  // ── Brainstorm ─────────────────────────────────────────────────────────────
  if (onProgress) onProgress({ phase: "brainstorm", message: "Apertura creative room..." });

  const brainstormResult = await runBrainstorm({
    agents,
    agentDefs,
    request,
    taskPlan,
    room,
    model,
    timeoutMs,
    reflectionsContext,
    onProgress: ({ phase, agent: agentId }) => {
      const labels = {
        council: "Fast council — team completo in un solo pass",
        diverge: "Round 1 — idee",
        react: "Round 2 — reazioni",
        dialogue: "Round 2.5 — dialogo diretto",
        converge: "Round 3 — sintesi"
      };
      if (onProgress) onProgress({ phase: "brainstorm", message: `${labels[phase] || phase}: ${agentId}` });
    }
  });

  room.persist(megaRoot);

  const creativeBrief = brainstormResult.synthesis;
  writeText(path.join(megaRoot, "creative-brief.md"), `# Creative Brief\n\n${creativeBrief}`);
  if (onProgress) onProgress({ phase: "brainstorm", message: "Brainstorm completato — brief creativo pronto" });

  // ── Update reflections — learn from this run ───────────────────────────────
  updateReflections({ workspaceRoot, request, creativeBrief, synthesis: brainstormResult.synthesis, intent, model, timeoutMs })
    .then(r => { if (r.added > 0 && onProgress) onProgress({ phase: "memory", message: `+${r.added} regole apprese (totale: ${r.total})` }); })
    .catch(() => {}); // non-blocking

  // ── Prompt Engineer ────────────────────────────────────────────────────────
  const VISUAL_INTENTS = ["post", "image", "carousel", "campaign", "default"];
  let promptEngineerResult = null;
  let generatedImages = [];

  if (VISUAL_INTENTS.includes(intent)) {
    if (onProgress) onProgress({ phase: "prompt-engineer", message: "Prompt Engineer — ottimizzazione prompt per generazione visiva" });
    try {
      promptEngineerResult = await runPromptEngineer({
        creativeBrief,
        request,
        intent,
        model,
        timeoutMs,
        onProgress
      });
      writeText(path.join(megaRoot, "prompt-engineer.md"),
        `# Prompt Engineer Output\n\n## IMAGE_PROMPT\n${promptEngineerResult.imagePrompt}\n\n## COVER_PROMPT\n${promptEngineerResult.coverPrompt}\n\n## RATIONALE\n${promptEngineerResult.rationale}\n\n## STYLE_TAG\n${promptEngineerResult.styleTag}\n\n## Raw Output\n${promptEngineerResult.raw}`
      );

      if (onProgress) onProgress({ phase: "prompt-engineer", message: `Generando immagini (stile: ${promptEngineerResult.styleTag})...` });

      const [squareResult, coverResult] = await Promise.allSettled([
        generateImage(promptEngineerResult.imagePrompt, {
          preset: "square",
          workspaceRoot,
          saveToDesktop: true
        }),
        generateImage(promptEngineerResult.coverPrompt || promptEngineerResult.imagePrompt, {
          preset: "cover",
          workspaceRoot,
          saveToDesktop: true
        })
      ]);

      if (squareResult.status === "fulfilled") {
        generatedImages.push({ type: "square", ...squareResult.value });
        if (onProgress) onProgress({ phase: "prompt-engineer", message: `Immagine quadrata generata — ${(squareResult.value.sizeBytes / 1024).toFixed(0)} KB` });
      }
      if (coverResult.status === "fulfilled") {
        generatedImages.push({ type: "cover", ...coverResult.value });
        if (onProgress) onProgress({ phase: "prompt-engineer", message: `Cover verticale generata — ${(coverResult.value.sizeBytes / 1024).toFixed(0)} KB` });
      }
    } catch (err) {
      if (onProgress) onProgress({ phase: "prompt-engineer", message: `Errore: ${err.message}` });
    }
  }

  // ── Execution ──────────────────────────────────────────────────────────────
  if (onProgress) onProgress({ phase: "execution", message: "Fase di esecuzione — produzione copy e deliverable" });

  let executionResult = null;
  try {
    executionResult = await runExecutionPhase({
      request, creativeBrief, intent, workspace, model, timeoutMs, apply, workspaceRoot, root
    });
  } catch (err) {
    if (onProgress) onProgress({ phase: "execution", message: `Errore esecuzione: ${err.message}` });
  }

  // ── Artifact ───────────────────────────────────────────────────────────────
  const artifact = registerArtifact(workspaceRoot, {
    path: `mega-runs/${runId}/creative-brief.md`,
    type: "mega-orchestration",
    intent,
    platform: null,
    sourceRun: runId,
    sourceAgent: "mega-orchestrator",
    status: "needs_human_review",
    metadata: {
      request: request.slice(0, 200),
      agents: agents.map((a) => a.id),
      brainstormMessages: room.messages.length,
      creativeBriefLength: creativeBrief.length,
      generatedImages: generatedImages.map((i) => ({ type: i.type, path: i.outputPath, desktopPath: i.desktopPath })),
      promptStyle: promptEngineerResult?.styleTag || null,
      executionStatus: executionResult?.result?.status || "skipped"
    }
  });

  writeText(path.join(megaRoot, "run-summary.md"), buildSummaryMarkdown({
    runId, request, intent, agents, taskPlan, room, brainstormResult, promptEngineerResult, generatedImages, executionResult
  }));

  return {
    runId,
    megaRoot,
    intent,
    agents,
    taskPlan,
    room,
    creativeBrief,
    brainstormResult,
    promptEngineerResult,
    generatedImages,
    executionResult,
    artifact
  };
}

function buildSummaryMarkdown({ runId, request, intent, agents, taskPlan, room, brainstormResult, promptEngineerResult, generatedImages, executionResult }) {
  const lines = [
    `# Mega Orchestration — ${runId}`,
    ``,
    `## Richiesta`,
    request,
    ``,
    `## Intent: ${intent}`,
    `Agenti: ${agents.map((a) => a.label).join(", ")}`,
    `Modalita brainstorm: ${brainstormResult.mode || "full"}`,
    ``,
    `## Brainstorm`,
    `- Round 1 (Diverge): ${room.getMessages({ round: 1 }).length} messaggi`,
    `- Round 2 (React + Dialogue): ${room.getMessages({ round: 2 }).length} messaggi`,
    `- Round 3 (Converge): sintesi creata`,
    ``
  ];

  if (promptEngineerResult) {
    lines.push(`## Prompt Engineer`);
    lines.push(`- Stile: ${promptEngineerResult.styleTag || "n/a"}`);
    lines.push(`- Fallback: ${promptEngineerResult.fallback ? "sì" : "no"}`);
    lines.push(`- IMAGE_PROMPT: ${(promptEngineerResult.imagePrompt || "").slice(0, 120)}...`);
    lines.push(``);
  }

  if (generatedImages && generatedImages.length > 0) {
    lines.push(`## Immagini Generate`);
    for (const img of generatedImages) {
      lines.push(`- [${img.type}] ${img.outputPath}`);
      if (img.desktopPath) lines.push(`  Desktop: ${img.desktopPath}`);
    }
    lines.push(``);
  }

  lines.push(`## Execution`);
  lines.push(executionResult ? `Status: ${executionResult.result?.status || "completato"}` : "Saltata");
  lines.push(``);
  lines.push(`## File generati`);
  lines.push(`- task-plan.md`);
  lines.push(`- creative-room.md`);
  lines.push(`- creative-room.json`);
  lines.push(`- creative-brief.md`);
  if (promptEngineerResult) lines.push(`- prompt-engineer.md`);
  lines.push(`- run-summary.md`);

  return lines.join("\n");
}

module.exports = { runMegaOrchestration, detectIntent, BRAINSTORM_AGENTS, INTENT_AGENTS };
