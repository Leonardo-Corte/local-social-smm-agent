#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  chooseOllamaModel,
  listOllamaModels,
  runOllamaGenerate
} = require("../../../packages/local-runtime/model-client");
const { auditContentPolicy, policyReportMarkdown } = require("../../../packages/review-loop/content-policy");
const {
  buildReelIntelligence,
  findDefaultAsset,
  writeReelIntelligence
} = require("../../../packages/video-intel/reel-intelligence");
const {
  buildVideoQualityReport,
  writeVideoQualityReport
} = require("../../../packages/video-intel/video-quality-report");
const {
  buildEditRecipe,
  runPreviewEdit,
  writeRecipe
} = require("../../../packages/video-intel/edit-recipe");
const {
  analyzeImage,
  analyzeLink,
  classifyPath,
  extractFilePaths,
  extractUrls,
  ingestTextFile,
  writeImageIntelligence,
  writeLinkIntelligence
} = require("../../../packages/asset-intel/attachment-ingestor");
const { runWorkflow } = require("../../../packages/workflow-runner/pipeline");
const { requestScopeGuard, runAdaptiveTeamOrchestration } = require("../../../packages/orchestration/adaptive-orchestrator");
const { runCreativeWorkflow } = require("../../../packages/workflow-runner/creative-orchestrator");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  assertSafeLocalAssetFile,
  importLocalAsset
} = require("../../../packages/workspace-runner/safe-ingestion");
const { generateImage, PRESETS } = require("../../../packages/image-workflow/pollinations-adapter");
const {
  runComfyUiWorkflow,
  writeComfyUiRunReport
} = require("../../../packages/image-workflow/comfyui-api-client");
const {
  buildImageQualityReport,
  writeImageQualityReport
} = require("../../../packages/image-workflow/image-quality-report");
const {
  buildLaunchCreativePackage,
  writeLaunchCreativePackage
} = require("../../../packages/image-workflow/launch-creative-package");
const {
  runVisionCritic,
  writeVisionCriticReport
} = require("../../../packages/image-workflow/vision-critic");
const {
  buildComfyUiCopilotPlan,
  comfyUiCopilotPlanMarkdown
} = require("../../../packages/image-workflow/comfyui-copilot-plan");
const { renderStaticPost } = require("../../../packages/design-renderer/static-post-renderer");
const { writePixelleHandoff } = require("../../../packages/video-engines/pixelle-adapter");
const { detectVideoEngines, videoEngineRegistryMarkdown } = require("../../../packages/video-engines/engine-registry");
const { buildPublishingDryRun, writePublishingDryRun } = require("../../../packages/publishing/dry-run-publisher");
const { writeFinalSystemStatus, statusMarkdown } = require("../../../packages/roadmap/final-system-status");
const { nextCommandPolicy } = require("../../../packages/workspace-runner/next-commands");
const { runMegaOrchestration } = require("../../../packages/orchestration/mega-orchestrator");
const { runConsensusOrchestration } = require("../../../packages/orchestration/consensus-orchestrator");
const { runPromptEngineer } = require("../../../packages/orchestration/prompt-engineer");
const {
  routeNaturalLanguage,
  intentFromRoute,
  routeNeedsAutoVisual,
  routeWantsDirectImageGeneration,
  routeUsesCreativeWorkflow,
  visualPresetFromRoute,
  routeReportMarkdown
} = require("../../../packages/orchestration/natural-language-router");

const root = path.resolve(__dirname, "../../..");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function readJson(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function appendText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, content);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function copyAssetIntoWorkspace({ workspaceRoot, sourcePath }) {
  return importLocalAsset({ workspaceRoot, sourcePath, allowedKinds: ["video"] }).destination;
}

function listAgentFiles(workspaceRoot) {
  const agentsRoot = path.join(workspaceRoot, "agents");
  if (!fs.existsSync(agentsRoot)) {
    return [];
  }
  return fs.readdirSync(agentsRoot)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .sort();
}

function compactFile(label, content, maxChars = 6000) {
  const text = String(content || "");
  const clipped = text.length > maxChars ? `${text.slice(0, maxChars)}\n\n[clipped: ${text.length - maxChars} chars omitted]` : text;
  return `## ${label}\n\n${clipped}`;
}

function buildWorkspaceContext({ workspaceRoot, activeAgent, attachments }) {
  const brief = readText(path.join(workspaceRoot, "project-brief.json"));
  const businessProfile = readText(path.join(workspaceRoot, "business/business.md"));
  const agentPath = path.join(workspaceRoot, "agents", `${activeAgent}.md`);
  const agent = readText(agentPath, `Agent ${activeAgent} not found.`);
  const skillMap = readText(path.join(workspaceRoot, "skills/skill-map.md"));
  const platformPlaybooks = readText(path.join(workspaceRoot, "platforms/platform-playbooks.md"));
  const publishingPolicy = readText(path.join(workspaceRoot, "policy/publishing-policy.json"));
  const userFeedback = readText(path.join(workspaceRoot, "memory/user-feedback.md"));
  const preferences = readText(path.join(workspaceRoot, "memory/preferences.json"));
  const contentPillars = readText(path.join(workspaceRoot, "strategy/content-pillars.md"));
  const qaRecap = readText(path.join(workspaceRoot, "review/qa-recap.md"));

  const attachedBlocks = attachments.map((attachment) => {
    return compactFile(`Attached File: ${attachment.label}`, attachment.content, 10000);
  });

  return [
    compactFile("Active Agent", agent, 5000),
    compactFile("Business Profile", businessProfile, 7000),
    compactFile("Project Brief", brief, 5000),
    compactFile("Skill Map", skillMap, 5000),
    compactFile("Platform Playbooks", platformPlaybooks, 7000),
    compactFile("Content Pillars", contentPillars, 4000),
    compactFile("QA Recap", qaRecap, 3000),
    compactFile("User Feedback Memory", userFeedback, 3000),
    compactFile("Preferences", preferences, 3000),
    compactFile("Publishing Policy", publishingPolicy, 3000),
    ...attachedBlocks
  ].filter(Boolean).join("\n\n");
}

function buildChatPrompt({ workspace, workspaceRoot, activeAgent, history, attachments, userMessage }) {
  const context = buildWorkspaceContext({ workspaceRoot, activeAgent, attachments });
  const commandPolicy = nextCommandPolicy({ root, workspace });
  const recentHistory = history.slice(-8).map((item) => {
    return `${item.role.toUpperCase()}: ${item.content}`;
  }).join("\n\n");

  return `# Workspace Chat

You are the local AI social media team chat for this generated social media workspace.

You must stay inside the workspace scope. Behave like a coordinated communications team: strategist, researcher, copywriter, reel producer, visual director, persona simulator, compliance reviewer, and publishing operator. When the active agent is too narrow, explain which agents should be involved and produce the best safe draft anyway.

## Hard Rules
- Do not publish, schedule, DM, comment, like, follow, scrape private data, or ask for risky account credentials.
- Do not automate X replies/likes/follows/DMs or Reddit posting/commenting/voting/DMs.
- Do not invent attendance numbers, guest identities, VIP status, partnerships, prices, testimonials, discounts, scarcity, or performance claims.
- Always adapt format and audience logic to the target platform playbook: Instagram, Facebook, LinkedIn, X, and Reddit are different.
- Reddit drafts must include subreddit-rule approval blockers and should be community-first, not ad-first.
- X drafts must be text-first, sharp, and compressed; do not paste Instagram captions unchanged.
- If a user asks for content, produce draft-only material and state approval blockers.
- Clean and improve obvious messy user wording yourself. Do not send the human back to rewrite typos when the intent is clear.
- Ask proactive follow-up questions only for factual gaps that change claims, event logistics, pricing, ticket inclusions, approvals, or publishing safety.
- Maintain and use business/business.md as the canonical business profile when available.
- If a user asks to modify files, provide an explicit proposed artifact or exact command; do not claim it was applied unless the tool actually applied it.
- If the request needs a different agent, recommend the right agent and still answer what you can.
- Keep answers practical and specific to the brief.
- For content requests, simulate internal agent collaboration: strategist -> specialist producer -> persona objections -> QA -> final artifact.
- End with exactly where the artifact should be saved or which command can apply the deeper workflow.
- When there is a next terminal action, include the exact copy/paste command. Do not tell the user only to "open the workspace" or "run the folder".

## Active Agent
${activeAgent}

## Next Command Policy
${commandPolicy}

## Workspace Context
${context}

## Recent Chat
${recentHistory || "No prior chat in this session."}

## User Message
${userMessage}

## Response Format
Answer in Italian unless the user asks otherwise.
Be direct.
When producing social content, use:
- Hook
- Caption/script
- CTA
- Approval risks
`;
}

function printHelp() {
  console.log(`
Comandi chat:
  /help                         mostra questi comandi
  /agents                       lista agenti disponibili
  /agent <id>                   cambia agente attivo
  /team <brief>                 mega-orchestrator: brainstorming a 3 round + esecuzione
  /brainstorm <brief>          alias di /team
  /consensus <brief>            agenti multipli + giudici + sintesi stile MassGen
  /generate <prompt>            genera un'immagine con Pollinations.ai (zero API key)
  /img <prompt>                 alias di /generate
  /comfyui <prompt>             genera un'immagine con ComfyUI locale usando SMM_COMFYUI_WORKFLOW
  /copilot                      crea handoff prompt per ComfyUI-Copilot
  /pixelle <brief>              crea handoff per Pixelle-Video se vuoi generare video con engine esterno
  /video-engines                mostra stato CapCut/Pixelle/OpenMontage
  /attach <path>                allega un file al contesto della chat
  /link <url>                   importa un link pubblico come contesto
  /image <path>                 importa e analizza un'immagine locale
  /video <path>                 importa e analizza un video/reel, poi crea preview locale
  /make <tipo> <brief>           attiva team agenti: post, carousel, reel, message, image, x, thread, reddit
  /creative <brief>              orchestra asset, trend, immagini/video, CapCut plan, caption e review
  /execute-plan <brief>          esegue un piano multi-step: consensus -> creative workflow -> package review
  /workflow <steps>              genera run agenti: es. /workflow research,strategy,copy,video,persona,qa
  /attachments                  lista file allegati
  /clear                        svuota storico chat e allegati
  /feedback <testo>             salva feedback in memory/user-feedback.md
  /publish-dry-run <artifact>   controlla se un artifact approvato può essere preparato per publishing ufficiale
  /roadmap                      mostra stato mega plan finale
  /where                        mostra cartelle workspace
  /exit                         esci

Scrivi normale per parlare con il copilota workspace-aware.
Esempi:
  generami un carosello per vendere i ticket del prossimo evento
  /make x scrivimi 5 post per X sul prossimo evento
  /make reddit crea un post discussione per r/AskNYC senza promo aggressiva
  ciao, crea un post Instagram basato su questa immagine /Users/corte/Desktop/gigigraph.png
  /comfyui crea una cover 9:16 premium per un evento networking a New York
  analizza questo link https://example.com e trasformalo in 5 idee contenuto
  analizza questo video: /Users/.../reel.mp4
  vatti a pescare questa cartella drive /Users/.../OutOfOffice e generami 4 reel seguendo trend X e Reddit
  fammi un messaggio premium ma non troppo rigido per invitare un venue manager
`);
}

function detectContentIntent(input) {
  return intentFromRoute(routeNaturalLanguage(input));
}

function shouldAutoGenerateVisual(input, intent) {
  const route = intent && intent.route ? intent.route : routeNaturalLanguage(input);
  return routeNeedsAutoVisual(route);
}

function visualPresetForIntent(input, intent) {
  const route = intent && intent.route ? intent.route : routeNaturalLanguage(input);
  return visualPresetFromRoute(route);
}

function extractVideoPath(input) {
  const match = input.match(/(?:video|reel|file|analizza questo video)\s*:?\s+(.+\.(?:mp4|mov|m4v|webm|mkv|avi))/i)
    || input.match(/(\/[^\n]+\.(?:mp4|mov|m4v|webm|mkv|avi))/i);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

function extractAssetDirectory(input) {
  const quoted = input.match(/(?:drive|cartella|folder|dir|directory)\s*:?\s+["']([^"']+)["']/i);
  if (quoted) {
    return quoted[1].trim();
  }
  const absolute = input.match(/(?:drive|cartella|folder|dir|directory)\s*:?\s+(\/[^\n]+?)(?:\s+(?:e|poi|gener|crea|fammi|seguendo|con|per)\b|$)/i);
  return absolute ? absolute[1].trim() : null;
}

function wantsCreativeOrchestration(input) {
  return routeUsesCreativeWorkflow(routeNaturalLanguage(input));
}

function wantsDirectImageGeneration(input) {
  return routeWantsDirectImageGeneration(routeNaturalLanguage(input));
}

function extractImageStyleFromInput(input) {
  const styleMap = [
    [/\bup\b|\bpalloncin/i, "Pixar Up movie style, colorful balloons, heartwarming illustration"],
    [/pixar|disney/i, "Pixar/Disney 3D animation style"],
    [/anime|manga/i, "anime illustration style, vibrant colors"],
    [/minimalista|minimal/i, "flat minimalist vector illustration"],
    [/fotorealist|realistic|foto/i, "photorealistic, DSLR quality"],
    [/vintage|retro/i, "vintage poster illustration style"],
    [/watercolor|acquerello/i, "watercolor painting style"]
  ];
  for (const [pattern, style] of styleMap) {
    if (pattern.test(input)) return style;
  }
  return "professional digital illustration, high quality";
}

function buildImagePromptFromInput(input) {
  const style = extractImageStyleFromInput(input);
  const scene = input
    .replace(/^(crea|genera|fammi|disegna|illustra|make|draw|generate)\s*(mi|un[ao]?)?\s*/i, "")
    .replace(/\b(post|promozional\w*|instagram|facebook|social)\b/gi, "")
    .replace(/\b(in stile|stile|come nel film|nello stile di)\b.*/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return `${scene}, ${style}, high detail, vibrant colors, professional quality, no watermark`;
}

function imageGenerationMessage(imgResult) {
  const desktopNote = imgResult.desktopPath ? `\n  Desktop: ${imgResult.desktopPath}` : "";
  const styleNote = imgResult.promptEngineer?.styleTag ? `\n  Prompt style: ${imgResult.promptEngineer.styleTag}` : "";
  const comfyReport = imgResult.reportPath ? `\n  ComfyUI report: ${path.relative(root, imgResult.reportPath)}` : "";
  const qualityNote = imgResult.qualityReportPath ? `\n  Quality report: ${path.relative(root, imgResult.qualityReportPath)}` : "";
  const visionNote = imgResult.visionCriticPath
    ? `\n  Vision critic: ${path.relative(root, imgResult.visionCriticPath)} (${imgResult.visionCritic.status}, ${imgResult.visionCritic.score}/100)`
    : "";
  const launchNote = imgResult.launchPackagePath ? `\n  Launch package: ${path.relative(root, imgResult.launchPackagePath)}` : "";
  const artifactNote = imgResult.artifact ? `\n  Artifact: ${imgResult.artifact.id} (${imgResult.artifact.status})` : "";
  const blockedNote = imgResult.visionCritic && imgResult.visionCritic.score < 85
    ? `\n\nNota: non e un asset finale. Il vision critic lo ha marcato come ${imgResult.visionCritic.status}.`
    : "";
  const openNote = imgResult.desktopPath ? "\n\nAprila dal Desktop -> cartella smm-images" : "\n\nAprila dal workspace in creative/images.";
  return `Immagine generata e salvata:\n  Backend: ${imgResult.backend || "pollinations"}\n  Workspace: ${imgResult.outputPath}${desktopNote}${styleNote}${comfyReport}${qualityNote}${visionNote}${launchNote}${artifactNote}\n  Dimensioni: ${imgResult.width}x${imgResult.height} — ${(imgResult.sizeBytes / 1024).toFixed(0)} KB\n  Prompt report: ${path.relative(root, path.join(imgResult.workspaceRoot || "", "creative/image-prompt-engineer-latest.md"))}${blockedNote}${openNote}`;
}

function staticRenderMessage(result) {
  const lines = [
    "Static post renderer completato.",
    `Run: ${path.relative(root, result.renderRoot)}`,
    `Manifest: ${path.relative(root, result.manifestPath)}`,
    `Quality: ${path.relative(root, result.reportMdPath)}`
  ];
  for (const item of result.rendered) {
    const png = item.png?.outputPath ? ` | PNG: ${path.relative(root, item.png.outputPath)}` : ` | PNG: ${item.png?.status || "not_requested"}`;
    lines.push(`- ${item.exportId}: ${path.relative(root, item.outputPath)}${png}`);
  }
  lines.push("");
  lines.push("Nota: questi sono asset finali di layout, ma restano draft-only e richiedono approvazione umana.");
  return lines.join("\n");
}

function renderStaticPostFromChat({ workspaceRoot, input, sourceRun = null }) {
  return renderStaticPost({
    workspaceRoot,
    request: input,
    sourceRun: sourceRun || `chat-static-${timestampId()}`
  });
}

function workspaceRelativePath(workspaceRoot, filePath) {
  if (!filePath || !workspaceRoot || !filePath.startsWith(workspaceRoot)) {
    return filePath ? path.basename(filePath) : "unknown";
  }
  return path.relative(workspaceRoot, filePath).split(path.sep).join("/");
}

async function generateComfyUiImageFromPrompt({ workspaceRoot, prompt, preset = "square", platform = "instagram" }) {
  const workflowPath = process.env.SMM_COMFYUI_WORKFLOW;
  if (!workflowPath) {
    throw new Error("SMM_COMFYUI_WORKFLOW non impostato. Esporta un workflow API JSON da ComfyUI e metti il path in questa variabile.");
  }
  const presetDef = PRESETS[preset] || PRESETS.square;
  const result = await runComfyUiWorkflow({
    workspaceRoot,
    workflowPath,
    prompt,
    width: presetDef.width,
    height: presetDef.height,
    seed: process.env.SMM_COMFYUI_SEED || "random",
    filenamePrefix: `smm-${preset}`,
    platform,
    timeoutMs: Number(process.env.SMM_COMFYUI_TIMEOUT_MS || 600000)
  });
  const reportPaths = writeComfyUiRunReport({ workspaceRoot, result });
  const first = result.savedOutputs[0];
  if (!first) {
    throw new Error(`ComfyUI ha completato la run ma non ha restituito immagini. Report: ${path.relative(root, reportPaths.mdPath)}`);
  }
  return {
    backend: "comfyui",
    outputPath: first.outputPath,
    desktopPath: null,
    width: presetDef.width,
    height: presetDef.height,
    sizeBytes: first.sizeBytes,
    artifact: first.artifact,
    reportPath: reportPaths.mdPath,
    promptId: result.promptId
  };
}

async function generateImageFromChat({ workspaceRoot, input, model, preset = "square" }) {
  const business = readText(path.join(workspaceRoot, "business/business.md")).slice(0, 3000);
  const imageIntel = readText(path.join(workspaceRoot, "assets/analysis/image-intelligence-latest.md")).slice(0, 3000);
  const linkIntel = readText(path.join(workspaceRoot, "sources/link-intelligence-latest.md")).slice(0, 2000);
  const scopeGuard = requestScopeGuard({ business, request: input, linkIntel });
  const creativeBrief = [
    "## Request Scope Guard",
    scopeGuard,
    "## Business Profile",
    business || "No business profile available.",
    "## Latest Image Context",
    imageIntel || "No image context available.",
    "## Latest Link Context",
    linkIntel || "No link context available.",
    "## User Request",
    input
  ].join("\n\n");

  const promptEngineerResult = await runPromptEngineer({
    creativeBrief,
    request: input,
    intent: "image",
    model,
    timeoutMs: 90000
  });
  const prompt = promptEngineerResult.imagePrompt || buildImagePromptFromInput(input);
  const promptReport = [
    "# Image Prompt Engineer",
    "",
    `Generated at: ${new Date().toISOString()}`,
    "",
    `Style: ${promptEngineerResult.styleTag || "n/a"}`,
    `Fallback: ${promptEngineerResult.fallback ? "yes" : "no"}`,
    "",
    "## Image Prompt",
    prompt,
    "",
    "## Cover Prompt",
    promptEngineerResult.coverPrompt || "-",
    "",
    "## Rationale",
    promptEngineerResult.rationale || "-"
  ].join("\n");
  writeText(path.join(workspaceRoot, "creative/image-prompt-engineer-latest.md"), promptReport);

  const wantsComfyUi = process.env.SMM_IMAGE_BACKEND === "comfyui" || Boolean(process.env.SMM_COMFYUI_WORKFLOW);
  if (wantsComfyUi) {
    try {
      console.log(`  Generando immagine con ComfyUI locale...`);
      console.log(`  Prompt: ${prompt.slice(0, 120)}`);
      const result = await generateComfyUiImageFromPrompt({ workspaceRoot, prompt, preset });
      result.promptEngineer = promptEngineerResult;
      result.workspaceRoot = workspaceRoot;
      return await finalizeImageGeneration({ workspaceRoot, input, result, prompt, promptEngineerResult, business });
    } catch (error) {
      if (process.env.SMM_IMAGE_BACKEND === "comfyui") {
        throw error;
      }
      console.log(`  ComfyUI non disponibile (${error.message}). Uso fallback no-cost Pollinations.`);
    }
  }

  console.log(`  Generando immagine con Pollinations.ai...`);
  console.log(`  Prompt: ${prompt.slice(0, 120)}`);
  const result = await generateImage(prompt, { preset, workspaceRoot, saveToDesktop: true });
  result.promptEngineer = promptEngineerResult;
  result.workspaceRoot = workspaceRoot;
  return await finalizeImageGeneration({ workspaceRoot, input, result, prompt, promptEngineerResult, business });
}

async function finalizeImageGeneration({ workspaceRoot, input, result, prompt, promptEngineerResult, business }) {
  const relativePath = workspaceRelativePath(workspaceRoot, result.outputPath);
  const platform = routeNaturalLanguage(input).intent.primaryPlatform || "instagram";
  const buffer = fs.readFileSync(result.outputPath);
  const qualityReport = buildImageQualityReport({
    buffer,
    relativePath,
    prompt,
    platform,
    expectedWidth: result.width,
    expectedHeight: result.height,
    imagePath: result.outputPath,
    brandContext: business
  });
  const qualityPaths = writeImageQualityReport({ workspaceRoot, report: qualityReport });
  const visionCritic = await runVisionCritic({
    imagePath: result.outputPath,
    relativePath,
    request: input,
    prompt,
    platform,
    businessContext: business,
    qualityReport,
    preferredModel: process.env.SMM_VISION_MODEL || null,
    timeoutMs: Number(process.env.SMM_VISION_CRITIC_TIMEOUT_MS || 240000)
  });
  const visionPaths = writeVisionCriticReport({ workspaceRoot, report: visionCritic });
  const launchPackage = buildLaunchCreativePackage({
    workspaceRoot,
    request: input,
    imageResult: result,
    prompt,
    promptEngineer: promptEngineerResult,
    qualityReport,
    visionCritic,
    businessContext: business
  });
  const launchPaths = writeLaunchCreativePackage({ workspaceRoot, packageData: launchPackage });
  result.qualityReport = qualityReport;
  result.qualityReportPath = qualityPaths.mdPath;
  result.visionCritic = visionCritic;
  result.visionCriticPath = visionPaths.mdPath;
  result.launchPackage = launchPackage;
  result.launchPackagePath = launchPaths.mdPath;
  return result;
}

function extractImagePromptFromBrief(creativeBrief, originalRequest) {
  const lines = [];

  // Extract top idea execution steps
  const topIdeaMatch = creativeBrief.match(/TOP IDEA:\s*(.+)\n[\s\S]*?Come si esegue:([\s\S]*?)(?=\n\*\*TOP IDEA|\n###|$)/i);
  if (topIdeaMatch) {
    const title = topIdeaMatch[1].trim();
    const steps = topIdeaMatch[2].trim().split("\n").slice(0, 3).map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
    lines.push(title, ...steps);
  }

  // Extract "Concept Centrale"
  const conceptMatch = creativeBrief.match(/Concept Centrale[*:\s]+([\s\S]*?)(?=\n\*\*|$)/i);
  if (conceptMatch) lines.push(conceptMatch[1].trim().slice(0, 200));

  // Extract visual elements
  const visualMatch = creativeBrief.match(/Elementi Visivi[^:]*:([\s\S]*?)(?=\n\*\*|$)/i);
  if (visualMatch) lines.push(visualMatch[1].trim().slice(0, 150));

  const clean = (s) => s.replace(/\*+/g, "").replace(/\n[-•]\s*/g, ", ").replace(/\s+/g, " ").trim();
  const basePrompt = lines.filter(Boolean).map(clean).join(", ").slice(0, 600);

  return basePrompt
    ? `${basePrompt}, Instagram post, vibrant colors, photorealistic, high quality, 4K, no text overlay`
    : `${originalRequest}, Instagram post, vibrant colors, photorealistic, high quality, 4K`;
}

function summarizeMegaRun(result) {
  const lines = [
    `Team creativo completato — ${result.agents.length} agenti, 3 round di brainstorming`,
    ``,
    `Run: mega-runs/${result.runId}/`,
    `Intent rilevato: ${result.intent}`,
    `Modalita brainstorm: ${result.brainstormResult?.mode || "full"}`,
    `Messaggi in creative room: ${result.room.messages.length}`,
    `  Round 1 (Diverge): ${result.room.getMessages({ round: 1 }).length} contributi`,
    `  Round 2 (React + Dialogue): ${result.room.getMessages({ round: 2 }).length} messaggi`,
    `  Round 3 (Converge): brief creativo sintetizzato`,
    ``
  ];

  if (result.promptEngineerResult) {
    const pe = result.promptEngineerResult;
    lines.push(`Prompt Engineer — stile: ${pe.styleTag || "n/a"}${pe.fallback ? " (fallback)" : ""}`);
    lines.push(`  Prompt: ${(pe.imagePrompt || "").slice(0, 100)}...`);
    lines.push(``);
  }

  if (result.generatedImages && result.generatedImages.length > 0) {
    lines.push(`Immagini generate (${result.generatedImages.length}):`);
    for (const img of result.generatedImages) {
      if (img.desktopPath) lines.push(`  [${img.type}] Desktop: ${img.desktopPath}`);
      else lines.push(`  [${img.type}] ${img.outputPath}`);
    }
    lines.push(``);
  }

  lines.push(`Esecuzione: ${result.executionResult?.result?.status || "completata"}`);
  lines.push(``);
  lines.push(`File:`);
  lines.push(`  mega-runs/${result.runId}/creative-room.md`);
  lines.push(`  mega-runs/${result.runId}/creative-brief.md`);
  if (result.promptEngineerResult) lines.push(`  mega-runs/${result.runId}/prompt-engineer.md`);
  if (result.executionResult?.result?.target) {
    lines.push(`  ${result.executionResult.result.target} (draft — approvazione umana richiesta)`);
  }
  return lines.join("\n");
}

async function runCreativeFromChat({ workspace, workspaceRoot, input, model }) {
  const sourceDir = extractAssetDirectory(input);
  const run = await runCreativeWorkflow({
    root,
    workspace,
    workspaceRoot,
    request: input,
    sourceDir,
    sourceLabel: sourceDir ? "chat-drive-folder" : "chat-request",
    liveTrends: /\b(live|trend|trends|reddit|x|twitter)\b/i.test(input),
    maxQueries: 3,
    model,
    executeTeam: true,
    preview: true
  });
  return `Creative workflow avviato.

Run: ${path.relative(root, run.creativeRunRoot)}
Status: ${run.summary.status}
Steps:
${run.summary.steps.map((step) => `- ${step.id}: ${step.status}`).join("\n")}

Output principali:
- Asset library: ${path.relative(root, path.join(workspaceRoot, "assets/asset-library.md"))}
- Trend report: ${path.relative(root, path.join(workspaceRoot, "research/trend-report.md"))}
- ComfyUI-Copilot plan: ${path.relative(root, path.join(workspaceRoot, "creative/comfyui-copilot-plan.md"))}
- Video engine plan: ${path.relative(root, path.join(workspaceRoot, "creative/video-engine-plan.md"))}
- CapCut plan: ${path.relative(root, path.join(workspaceRoot, "creative/capcut-plan.md"))}
- Performance review: ${path.relative(root, path.join(workspaceRoot, "review/creative-performance-review.md"))}
- Publishing package: ${path.relative(root, path.join(workspaceRoot, "publishing/export-package.md"))}

Niente pubblicazione automatica: tutto resta in review umana.`;
}

async function runTaskPlanFromChat({ workspace, workspaceRoot, input, model }) {
  const consensus = await runConsensusOrchestration({
    root,
    workspace,
    request: input,
    model,
    timeoutMs: 240000
  });
  const creativeSummary = await runCreativeFromChat({
    workspace,
    workspaceRoot,
    input,
    model
  });
  const planDir = path.join(workspaceRoot, "chat-task-plans");
  ensureDir(planDir);
  const planPath = path.join(planDir, `${timestampId()}.md`);
  const content = `# Chat Task Plan Execution

Request: ${input}

## Steps
- Consensus run: ${path.relative(workspaceRoot, consensus.runRoot)}
- Creative workflow: completed; see summary below.
- Publishing remains human-approved only.

## Creative Summary
${creativeSummary}
`;
  writeText(planPath, content);
  return {
    consensus,
    creativeSummary,
    planPath
  };
}

async function analyzeImageAsset({ workspaceRoot, sourcePath, model }) {
  if (!sourcePath) {
    throw new Error("Nessuna immagine indicata. Usa /image /percorso/file.png");
  }
  const report = await analyzeImage({ workspaceRoot, filePath: sourcePath, model, timeoutMs: 120000 });
  const reportPaths = writeImageIntelligence({ workspaceRoot, report });
  return { report, reportPaths };
}

function summarizeImageRun(result) {
  return `Immagine analizzata.

Report:
- ${path.relative(root, result.reportPaths.mdPath)}
- ${path.relative(root, result.reportPaths.latestPath)}

Vision model: ${result.report.vision.model || "non rilevato"}
Vision status: ${result.report.vision.status}
Formato: ${result.report.metadata.format || "-"}
Risoluzione: ${result.report.metadata.width && result.report.metadata.height ? `${result.report.metadata.width}x${result.report.metadata.height}` : "unknown"}

Prossimo uso naturale in chat:
"creami un post Instagram basato su questa immagine"
"fammi 3 caption LinkedIn e Instagram diverse"
"trasformala in un brief visual per carosello"`;
}

async function analyzeLinkAsset({ workspaceRoot, url }) {
  const report = await analyzeLink({ workspaceRoot, url });
  const reportPaths = writeLinkIntelligence({ workspaceRoot, report });
  return { report, reportPaths };
}

function summarizeLinkRun(result) {
  return `Link analizzato.

Report:
- ${path.relative(root, result.reportPaths.mdPath)}
- ${path.relative(root, result.reportPaths.latestPath)}

Title: ${result.report.signals.title || "-"}
Risk: ${result.report.risk}
Status: ${result.report.ok ? "ok" : "failed"}

Prossimo uso naturale in chat:
"creami 5 idee contenuto basate su questo link"
"adattalo per X, Reddit e LinkedIn"
"fammi un post Instagram senza copiare il testo del link"`;
}

async function ingestLocalPathForChat({ workspaceRoot, sourcePath, model }) {
  const safeAsset = assertSafeLocalAssetFile(sourcePath);
  const filePath = safeAsset.absolutePath;
  const kind = safeAsset.kind;
  if (kind === "video") {
    const result = analyzeVideoAsset({ workspaceRoot, sourcePath: filePath });
    return {
      kind,
      summary: summarizeVideoRun(result),
      attachment: {
        label: sourcePath,
        path: result.reportPaths.latestPath,
        content: readText(result.reportPaths.latestPath)
      }
    };
  }
  if (kind === "image") {
    const result = await analyzeImageAsset({ workspaceRoot, sourcePath: filePath, model });
    return {
      kind,
      summary: summarizeImageRun(result),
      attachment: {
        label: sourcePath,
        path: result.reportPaths.latestPath,
        content: readText(result.reportPaths.latestPath)
      }
    };
  }
  const attachment = ingestTextFile({ workspaceRoot, filePath });
  return {
    kind,
    summary: `File allegato: ${sourcePath}\nTipo: ${kind}\nPath workspace: ${path.relative(root, attachment.path)}`,
    attachment
  };
}

async function ingestUrlForChat({ workspaceRoot, url }) {
  const result = await analyzeLinkAsset({ workspaceRoot, url });
  return {
    kind: "link",
    summary: summarizeLinkRun(result),
    attachment: {
      label: url,
      path: result.reportPaths.latestPath,
      content: readText(result.reportPaths.latestPath)
    }
  };
}

async function runAgentTeam({ workspace, input, intent, model }) {
  if (intent.type !== "custom-workflow") {
    const team = await runAdaptiveTeamOrchestration({
      root,
      workspace,
      request: input,
      type: intent.type,
      steps: intent.steps,
      model,
      timeoutMs: 120000,
      apply: true,
      maxRevisions: 1
    });
    return {
      teamRoot: team.teamRoot,
      workflowRoot: team.workflowRoot,
      result: team.result,
      selectedStepIds: intent.steps,
      type: intent.type,
      input
    };
  }

  const selectedStepIds = intent.steps;
  const workflow = await runWorkflow({
    root,
    workspace,
    dryRun: false,
    preferredModel: model,
    selectedStepIds,
    timeoutMs: 120000
  });
  return {
    workflowRoot: workflow.workflowRoot,
    summary: workflow.summary,
    selectedStepIds,
    type: intent.type,
    input
  };
}

function summarizeTeamRun(teamRun) {
  if (teamRun.teamRoot) {
    const artifactLine = teamRun.result.status === "failed_needs_model_run"
      ? `- ${path.relative(root, path.join(teamRun.teamRoot, "result.json"))}`
      : `- ${path.relative(root, path.join(teamRun.teamRoot, "final-artifact.md"))}`;
    return `Team agenti avviato per: ${teamRun.type}
Steps: ${teamRun.selectedStepIds.join(", ")}
Workflow: ${path.relative(root, teamRun.workflowRoot)}
Team run: ${path.relative(root, teamRun.teamRoot)}
Target scritto: ${teamRun.result.target}
Status: ${teamRun.result.status}
${teamRun.result.agentSteps ? `Agent steps: ${teamRun.result.agentSteps.completed}/${teamRun.result.agentSteps.total} completed, ${teamRun.result.agentSteps.fallback} fallback, ${teamRun.result.agentSteps.revisionLoops} revision loop(s)` : ""}
${teamRun.result.blackboard ? `Blackboard: ${teamRun.result.blackboard.totalEntries} entries, ${teamRun.result.blackboard.decisions} decisions, ${teamRun.result.blackboard.risks} risks` : ""}

Leggi:
- ${path.relative(root, path.join(teamRun.teamRoot, "orchestration-report.md"))}
${artifactLine}

Nota: il file target è draft-only e richiede approvazione umana. Non pubblica nulla.`;
  }
  return `Team agenti avviato per: ${teamRun.type}
Steps: ${teamRun.selectedStepIds.join(", ")}
Run: ${path.relative(root, teamRun.workflowRoot)}
Status: ${teamRun.summary.status}

Leggi prima:
- ${path.relative(root, path.join(teamRun.workflowRoot, "summary.md"))}
- ${path.relative(root, path.join(teamRun.workflowRoot, "regeneration-candidates.md"))}

Nota: la run genera output e review in modalità human-approved. Non pubblica nulla.`;
}

function analyzeVideoAsset({ workspaceRoot, sourcePath }) {
  const assetPath = sourcePath ? copyAssetIntoWorkspace({ workspaceRoot, sourcePath }) : findDefaultAsset(workspaceRoot);
  if (!assetPath) {
    throw new Error("Nessun video trovato. Metti un file in assets/raw o usa /video /percorso/file.mp4");
  }
  const report = buildReelIntelligence({ workspaceRoot, assetPath, transcribe: true });
  const reportPaths = writeReelIntelligence({ workspaceRoot, report });
  const quality = buildVideoQualityReport({ reelReport: report });
  const qualityPaths = writeVideoQualityReport({ workspaceRoot, report: quality });
  const recipe = buildEditRecipe({ workspaceRoot, analysis: report });
  const runResult = runPreviewEdit(recipe);
  writeRecipe({ recipe, runResult });
  return { report, reportPaths, quality, qualityPaths, recipe, runResult };
}

function summarizeVideoRun(result) {
  return `Video analizzato.

Report:
- ${path.relative(root, result.reportPaths.mdPath)}
- ${path.relative(root, result.reportPaths.latestPath)}
- Quality: ${path.relative(root, result.qualityPaths.mdPath)} (${result.quality.status}, ${result.quality.averageScore}/100)

Frame estratti: ${result.report.frames.length}
Trascrizione: ${result.report.transcription.status}

Preview edit:
- ${result.runResult.ok ? path.relative(root, result.recipe.output.outputPath) : "preview non creata"}
- Recipe: ${path.relative(root, result.recipe.output.recipePath)}
- Notes: ${path.relative(root, result.recipe.output.notesPath)}

Prossimo uso naturale in chat:
"fammi 5 hook e caption per questo reel"
"creami una versione più premium del copy"
"preparami publishing package human-approved"`;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  if (!workspace) {
    console.error("Usage: npm run workspace:chat <workspace> -- --model qwen2.5:14b");
    process.exit(1);
  }

  const preferredModel = valueAfter(args, "--model");
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  const clientWorkspaceRoot = paths.client;
  if (!fs.existsSync(path.join(workspaceRoot, "workspace-manifest.json"))) {
    console.error(`Missing workspace: ${workspaceRoot}`);
    process.exit(1);
  }

  const models = listOllamaModels();
  const model = chooseOllamaModel(models, preferredModel);
  if (!model) {
    console.error("No Ollama model found. Start Ollama and pull a local model first.");
    process.exit(1);
  }

  const runId = timestampId();
  const chatRoot = path.join(workspaceRoot, "chat-runs", runId);
  const transcriptPath = path.join(chatRoot, "transcript.md");
  const metadata = {
    runId,
    workspace,
    model,
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    clientWorkspaceRoot
  };
  writeText(path.join(chatRoot, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  writeText(transcriptPath, `# Workspace Chat Transcript\n\nWorkspace: ${workspace}\nModel: ${model}\nStarted: ${metadata.generatedAt}\n`);

  let activeAgent = "critic-qa";
  let history = [];
  let attachments = [];
  let closeRequested = false;
  let processing = false;

  console.log(`Workspace chat ready: ${workspace}`);
  console.log(`Model: ${model}`);
  console.log(`Active agent: ${activeAgent}`);
  console.log(`Transcript: ${path.relative(root, transcriptPath)}`);
  console.log("Type /help for commands.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "workspace> "
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    try {
      if (input === "/exit" || input === "/quit") {
        closeRequested = true;
        if (!processing) {
          rl.close();
        }
        return;
      }
      if (input === "/help") {
        printHelp();
        rl.prompt();
        return;
      }
      if (input === "/agents") {
        console.log(listAgentFiles(workspaceRoot).join("\n"));
        rl.prompt();
        return;
      }
      if (input.startsWith("/agent ")) {
        const nextAgent = input.slice("/agent ".length).trim();
        if (!listAgentFiles(workspaceRoot).includes(nextAgent)) {
          console.log(`Agente non trovato: ${nextAgent}`);
        } else {
          activeAgent = nextAgent;
          console.log(`Active agent: ${activeAgent}`);
        }
        rl.prompt();
        return;
      }
      if (input.startsWith("/attach ")) {
        const rawPath = input.slice("/attach ".length).trim();
        const ingested = await ingestLocalPathForChat({ workspaceRoot, sourcePath: rawPath, model });
        attachments.push(ingested.attachment);
        console.log(`\n${ingested.summary}\n`);
        appendText(transcriptPath, `\n## Attachment Analysis\n\n${ingested.summary}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/image ")) {
        const rawPath = input.slice("/image ".length).trim();
        const ingested = await ingestLocalPathForChat({ workspaceRoot, sourcePath: rawPath, model });
        attachments.push(ingested.attachment);
        activeAgent = "visual-director";
        console.log(`\n${ingested.summary}\n`);
        appendText(transcriptPath, `\n## Image Analysis\n\n${ingested.summary}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/link ")) {
        const url = input.slice("/link ".length).trim();
        const ingested = await ingestUrlForChat({ workspaceRoot, url });
        attachments.push(ingested.attachment);
        activeAgent = "market-researcher";
        console.log(`\n${ingested.summary}\n`);
        appendText(transcriptPath, `\n## Link Analysis\n\n${ingested.summary}\n`);
        rl.prompt();
        return;
      }
      if (input === "/attachments") {
        console.log(attachments.length > 0 ? attachments.map((item, index) => `${index + 1}. ${item.label}`).join("\n") : "Nessun allegato.");
        rl.prompt();
        return;
      }
      if (input === "/roadmap") {
        const status = writeFinalSystemStatus(root);
        const msg = statusMarkdown(status);
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## Roadmap Status\n\n${msg}\n`);
        rl.prompt();
        return;
      }
      if (input === "/video-engines") {
        const msg = videoEngineRegistryMarkdown(detectVideoEngines());
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## Video Engines\n\n${msg}\n`);
        rl.prompt();
        return;
      }
      if (input === "/copilot") {
        const plan = buildComfyUiCopilotPlan(workspaceRoot);
        const dir = path.join(workspaceRoot, "creative");
        ensureDir(dir);
        const jsonPath = path.join(dir, "comfyui-copilot-plan.json");
        const mdPath = path.join(dir, "comfyui-copilot-plan.md");
        writeText(jsonPath, `${JSON.stringify(plan, null, 2)}\n`);
        writeText(mdPath, comfyUiCopilotPlanMarkdown(plan));
        const msg = `ComfyUI-Copilot handoff pronto.

Status: ${plan.status}
File:
- ${path.relative(root, mdPath)}
- ${path.relative(root, jsonPath)}

Usa la sezione "Handoff Prompt" dentro Copilot. Il core resta no-cost/local-first e draft-only.`;
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## ComfyUI-Copilot Handoff\n\n${msg}\n`);
        rl.prompt();
        return;
      }
      if (input === "/clear") {
        history = [];
        attachments = [];
        console.log("Chat history e allegati svuotati.");
        rl.prompt();
        return;
      }
      if (input.startsWith("/feedback ")) {
        const feedback = input.slice("/feedback ".length).trim();
        appendText(path.join(workspaceRoot, "memory/user-feedback.md"), `\n## ${new Date().toISOString()}\n${feedback}\n`);
        appendText(path.join(clientWorkspaceRoot, "memory/user-feedback.md"), `\n## ${new Date().toISOString()}\n${feedback}\n`);
        console.log("Feedback salvato nella memoria del workspace.");
        rl.prompt();
        return;
      }
      if (input.startsWith("/video")) {
        const rawPath = input.slice("/video".length).trim();
        const result = analyzeVideoAsset({ workspaceRoot, sourcePath: rawPath || null });
        console.log(`\n${summarizeVideoRun(result)}\n`);
        appendText(transcriptPath, `\n## Video Analysis\n\n${summarizeVideoRun(result)}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/pixelle ")) {
        const request = input.slice("/pixelle ".length).trim();
        const result = writePixelleHandoff({ workspaceRoot, request });
        const msg = `Pixelle-Video handoff creato.

File:
- ${path.relative(root, result.mdPath)}
- ${path.relative(root, result.jsonPath)}

Questo non esegue Pixelle da solo: prepara il contratto pulito per un checkout/service separato e poi importa l'MP4 generato come artifact da approvare.`;
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## Pixelle Handoff\n\n${msg}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/publish-dry-run ")) {
        const parts = input.slice("/publish-dry-run ".length).trim().split(/\s+/);
        const artifactId = parts[0];
        const platformIndex = parts.indexOf("--platform");
        const platform = platformIndex >= 0 ? parts[platformIndex + 1] || "instagram" : "instagram";
        const report = buildPublishingDryRun({ workspaceRoot, artifactId, platform });
        const reportPaths = writePublishingDryRun({ workspaceRoot, report });
        const msg = `Publishing dry-run: ${report.status}

Report: ${path.relative(root, reportPaths.mdPath)}
Blockers: ${report.blockers.length}
Warnings: ${report.warnings.length}

Nessuna pubblicazione eseguita.`;
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## Publishing Dry Run\n\n${msg}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/workflow ")) {
        const selectedStepIds = input.slice("/workflow ".length).split(",").map((item) => item.trim()).filter(Boolean);
        const teamRun = await runAgentTeam({
          workspace,
          input,
          intent: { type: "custom-workflow", steps: selectedStepIds },
          model
        });
        console.log(`\n${summarizeTeamRun(teamRun)}\n`);
        appendText(transcriptPath, `\n## Agent Workflow\n\n${summarizeTeamRun(teamRun)}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/creative ")) {
        processing = true;
        const summary = await runCreativeFromChat({
          workspace,
          workspaceRoot,
          input: input.slice("/creative ".length).trim(),
          model
        });
        console.log(`\n${summary}\n`);
        appendText(transcriptPath, `\n## Creative Workflow\n\n${summary}\n`);
        processing = false;
        rl.prompt();
        return;
      }
      if (input.startsWith("/execute-plan ")) {
        processing = true;
        const request = input.slice("/execute-plan ".length).trim();
        console.log("\n  Task-plan executor avviato — consensus + creative workflow\n");
        const result = await runTaskPlanFromChat({ workspace, workspaceRoot, input: request, model });
        const msg = `Task plan eseguito.

Plan: ${path.relative(root, result.planPath)}
Consensus: ${path.relative(root, result.consensus.runRoot)}

${result.creativeSummary}`;
        console.log(`\n${msg}\n`);
        appendText(transcriptPath, `\n## Task Plan Execution\n\n${msg}\n`);
        processing = false;
        rl.prompt();
        return;
      }
      if (input.startsWith("/make ")) {
        const request = input.slice("/make ".length).trim();
        const intent = detectContentIntent(request) || { type: "content", steps: ["research", "strategy", "copy", "persona", "qa"], agent: "copywriter" };
        activeAgent = intent.agent || activeAgent;
        const teamRun = await runAgentTeam({ workspace, input: request, intent, model });
        console.log(`\n${summarizeTeamRun(teamRun)}\n`);
        appendText(transcriptPath, `\n## Agent Team Run\n\nRequest: ${request}\n\n${summarizeTeamRun(teamRun)}\n`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/team ") || input.startsWith("/brainstorm ")) {
        const prefix = input.startsWith("/team ") ? "/team " : "/brainstorm ";
        const request = input.slice(prefix.length).trim();
        processing = true;
        console.log("\n  Mega-orchestrator avviato — brainstorming creativo del team\n");
        try {
          const result = await runMegaOrchestration({
            root,
            workspace,
            request,
            model,
            timeoutMs: 240000,
            apply: true,
            onProgress: ({ phase, message }) => {
              const icons = { planning: "📋", brainstorm: "💡", "prompt-engineer": "🎨", execution: "⚙️" };
              console.log(`  ${icons[phase] || "•"} [${phase}] ${message}`);
            }
          });
          const msg = summarizeMegaRun(result);
          console.log(`\n${msg}\n`);
          appendText(transcriptPath, `\n## Mega Orchestration\n\n${msg}\n`);
          history.push({ role: "user", content: input });
          history.push({ role: "assistant", content: msg });
        } catch (err) {
          console.log(`  Errore mega-orchestrator: ${err.message}`);
        }
        processing = false;
        rl.prompt();
        return;
      }
      if (input.startsWith("/consensus ")) {
        const request = input.slice("/consensus ".length).trim();
        processing = true;
        console.log("\n  Consensus orchestrator avviato — candidati, giudici, sintesi\n");
        try {
          const result = await runConsensusOrchestration({ root, workspace, request, model, timeoutMs: 240000 });
          const msg = `Consensus completato.

Run: ${path.relative(root, result.runRoot)}
Artifact: ${result.artifact.id} (${result.artifact.status})
Mode: ${result.report.judge.mode}

Leggi:
- ${path.relative(root, path.join(result.runRoot, "consensus.md"))}

Niente pubblicazione automatica: richiede review umana.`;
          console.log(`\n${msg}\n`);
          appendText(transcriptPath, `\n## Consensus Orchestration\n\n${msg}\n`);
          history.push({ role: "user", content: input });
          history.push({ role: "assistant", content: msg });
        } catch (err) {
          console.log(`Errore consensus: ${err.message}`);
        }
        processing = false;
        rl.prompt();
        return;
      }
      if (input === "/where") {
        console.log(`Factory workspace: ${workspaceRoot}`);
        console.log(`Client workspace: ${clientWorkspaceRoot}`);
        console.log(`Transcript: ${transcriptPath}`);
        rl.prompt();
        return;
      }
      if (input.startsWith("/generate ") || input.startsWith("/img ")) {
        const prompt = input.startsWith("/generate ") ? input.slice("/generate ".length).trim() : input.slice("/img ".length).trim();
        processing = true;
        console.log("Generando immagine con Pollinations.ai...");
        try {
          const result = await generateImage(prompt, { preset: "square", workspaceRoot, saveToDesktop: true });
          const desktopNote = result.desktopPath ? `\n  Desktop: ${result.desktopPath}` : "";
          const msg = `Immagine salvata:\n  Workspace: ${result.outputPath}${desktopNote}\n  ${result.width}x${result.height} — ${(result.sizeBytes / 1024).toFixed(0)} KB`;
          console.log(`\n${msg}\n`);
          appendText(transcriptPath, `\n## Image Generated\n\n${msg}\n`);
        } catch (err) {
          console.log(`Errore generazione immagine: ${err.message}`);
        }
        processing = false;
        rl.prompt();
        return;
      }
      if (input.startsWith("/comfyui ")) {
        const prompt = input.slice("/comfyui ".length).trim();
        processing = true;
        console.log("Generando immagine con ComfyUI locale...");
        try {
          const result = await generateComfyUiImageFromPrompt({ workspaceRoot, prompt, preset: "square" });
          const msg = `Immagine ComfyUI salvata:
  Workspace: ${result.outputPath}
  Report: ${path.relative(root, result.reportPath)}
  Prompt ID: ${result.promptId}
  Artifact: ${result.artifact.id} (${result.artifact.status})`;
          console.log(`\n${msg}\n`);
          appendText(transcriptPath, `\n## ComfyUI Image Generated\n\n${msg}\n`);
        } catch (err) {
          console.log(`Errore ComfyUI: ${err.message}`);
          console.log(`Setup richiesto: esporta un workflow API JSON da ComfyUI e avvia la chat con SMM_COMFYUI_WORKFLOW=/path/workflow.json`);
        }
        processing = false;
        rl.prompt();
        return;
      }

      processing = true;
      console.log("thinking...");
      const naturalRoute = routeNaturalLanguage(input);
      writeText(path.join(workspaceRoot, "operations/nlu-router-latest.json"), `${JSON.stringify(naturalRoute, null, 2)}\n`);
      writeText(path.join(workspaceRoot, "operations/nlu-router-latest.md"), routeReportMarkdown(naturalRoute));
      appendText(transcriptPath, `\n## Natural Language Router\n\n${routeReportMarkdown(naturalRoute)}\n`);
      const naturalPaths = [...new Set([
        ...extractFilePaths(input),
        ...(extractVideoPath(input) ? [extractVideoPath(input)] : [])
      ])];
      const naturalUrls = [...new Set(extractUrls(input))];
      for (const sourcePath of naturalPaths) {
        const ingested = await ingestLocalPathForChat({ workspaceRoot, sourcePath, model });
        attachments.push(ingested.attachment);
        if (ingested.kind === "image") {
          activeAgent = "visual-director";
        }
        if (ingested.kind === "video") {
          activeAgent = "reel-shorts-producer";
        }
        console.log(`\n${ingested.summary}\n`);
        appendText(transcriptPath, `\n## Natural Attachment Analysis\n\n${ingested.summary}\n`);
      }
      for (const url of naturalUrls) {
        const ingested = await ingestUrlForChat({ workspaceRoot, url });
        attachments.push(ingested.attachment);
        console.log(`\n${ingested.summary}\n`);
        appendText(transcriptPath, `\n## Natural Link Analysis\n\n${ingested.summary}\n`);
      }
      const intent = intentFromRoute(naturalRoute);
      let teamRunSummary = "";
      const wantsImage = routeWantsDirectImageGeneration(naturalRoute) || (intent && intent.type === "image");
      const autoVisual = routeNeedsAutoVisual(naturalRoute);

      if (wantsImage) {
        try {
          const imgResult = await generateImageFromChat({ workspaceRoot, input, model, preset: visualPresetForIntent(input, intent) });
          const msg = imageGenerationMessage(imgResult);
          let outputMsg = msg;
          if (routeNeedsAutoVisual(naturalRoute)) {
            const renderResult = renderStaticPostFromChat({ workspaceRoot, input, sourceRun: `chat-static-${timestampId()}` });
            const renderMsg = staticRenderMessage(renderResult);
            outputMsg = `${msg}\n\n${renderMsg}`;
            appendText(transcriptPath, `\n## Static Post Rendered\n\n${renderMsg}\n`);
          }
          console.log(`\n${outputMsg}\n`);
          appendText(transcriptPath, `\n## Image Generated\n\n${outputMsg}\n`);
          history.push({ role: "user", content: input });
          history.push({ role: "assistant", content: outputMsg });
          processing = false;
          rl.prompt();
          return;
        } catch (err) {
          console.log(`  Generazione immagine fallita: ${err.message}`);
          console.log(`  Riprova con: /generate <descrizione in inglese>`);
        }
      } else if (routeUsesCreativeWorkflow(naturalRoute)) {
        const creativeRunSummary = await runCreativeFromChat({ workspace, workspaceRoot, input, model });
        console.log(`\n${creativeRunSummary}\n`);
        appendText(transcriptPath, `\n## Creative Workflow\n\n${creativeRunSummary}\n`);
        teamRunSummary = creativeRunSummary;
      } else if (intent && /gener|crea|fammi|prepara|scrivi|build|make|produce/i.test(input)) {
        activeAgent = intent.agent || activeAgent;
        const teamRun = await runAgentTeam({ workspace, input, intent, model });
        teamRunSummary = summarizeTeamRun(teamRun);
        if (autoVisual) {
          try {
            console.log("  visual-generation — starting");
            const visualInput = `${input}\n\nGenera anche il visual principale del post. Usa il link/brand della richiesta come contesto se diverso dal workspace. Non mettere testo leggibile dentro l'immagine.`;
            const imgResult = await generateImageFromChat({
              workspaceRoot,
              input: visualInput,
              model,
              preset: visualPresetForIntent(input, intent)
            });
            const imageMsg = imageGenerationMessage(imgResult);
            const renderResult = renderStaticPostFromChat({ workspaceRoot, input, sourceRun: `chat-static-${timestampId()}` });
            const renderMsg = staticRenderMessage(renderResult);
            teamRunSummary = `${teamRunSummary}\n\n${imageMsg}\n\n${renderMsg}`;
            appendText(transcriptPath, `\n## Auto Visual Generated\n\n${imageMsg}\n`);
            appendText(transcriptPath, `\n## Static Post Rendered\n\n${renderMsg}\n`);
          } catch (err) {
            const failMsg = `Visual automatico non generato: ${err.message}\nPrompt/handoff salvato se disponibile in creative/image-prompt-engineer-latest.md.`;
            teamRunSummary = `${teamRunSummary}\n\n${failMsg}`;
            appendText(transcriptPath, `\n## Auto Visual Failed\n\n${failMsg}\n`);
          }
        }
        console.log(`\n${teamRunSummary}\n`);
        appendText(transcriptPath, `\n## Agent Team Run\n\n${teamRunSummary}\n`);
      }
      if (teamRunSummary) {
        history.push({ role: "user", content: input });
        history.push({ role: "assistant", content: teamRunSummary });
        processing = false;
        rl.prompt();
        return;
      }
      const prompt = buildChatPrompt({ workspace, workspaceRoot, activeAgent, history, attachments, userMessage: input });
      const output = await runOllamaGenerate({ model, prompt, timeoutMs: 180000 });
      const audit = auditContentPolicy(output);

      console.log(`\n${output.trim()}\n`);
      if (audit.status !== "passed") {
        console.log(`[content-policy: ${audit.status}, blockers=${audit.blockers.length}, warnings=${audit.warnings.length}]`);
      }

      history.push({ role: "user", content: input });
      history.push({ role: "assistant", content: output.trim() });
      appendText(transcriptPath, `\n## User\n\n${input}\n\n## Assistant\n\n${output.trim()}\n`);
      writeText(path.join(chatRoot, "latest-content-policy.md"), policyReportMarkdown(audit));
    } catch (error) {
      console.log(`Errore: ${error.message}`);
      appendText(transcriptPath, `\n## Error\n\n${error.stack || error.message}\n`);
    } finally {
      processing = false;
    }

    if (closeRequested) {
      rl.close();
      return;
    }
    rl.prompt();
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = {
  detectContentIntent,
  renderStaticPostFromChat,
  staticRenderMessage,
  shouldAutoGenerateVisual,
  wantsCreativeOrchestration,
  wantsDirectImageGeneration,
  visualPresetForIntent,
  routeNaturalLanguage
};
