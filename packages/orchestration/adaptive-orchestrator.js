const fs = require("fs");
const path = require("path");
const { runOllamaGenerate } = require("../local-runtime/model-client");
const { runWorkflow } = require("../workflow-runner/pipeline");
const { workspacePaths } = require("../workspace-runner/workspace-paths");
const { auditContentPolicy, policyReportMarkdown } = require("../review-loop/content-policy");
const { registerArtifact } = require("../publishing/artifact-registry");
const {
  writeEntry,
  readEntries,
  getRunSummary,
  writeDecisionLog,
  resolveEntry
} = require("./blackboard");
const {
  extractDecisions,
  extractRisks,
  extractRevisionRequest,
  extractConfidence
} = require("./prompt-extractor");
const { bridgeCapCutPlanFromReels } = require("../video-intel/capcut-plan");
const { runPlatformAdapter, PLATFORM_SPECS } = require("./platform-adapter");
const { runLiveFetcher } = require("../trend-intel/live-fetcher");

const agentByStep = {
  research: "market-researcher",
  strategy: "brand-strategist",
  platform: "platform-strategist",
  calendar: "content-planner",
  copy: "copywriter",
  video: "reel-shorts-producer",
  capcut: "capcut-editor",
  visuals: "visual-director",
  persona: "persona-simulator",
  qa: "critic-qa",
  publishing: "publishing-operator",
  compliance: "compliance-platform-guardian",
  "platform-adapt": "platform-adapter"
};

const targetByIntent = {
  post: "drafts/posts.md",
  caption: "drafts/posts.md",
  copy: "drafts/posts.md",
  carousel: "drafts/carousels.md",
  reel: "drafts/reels.md",
  video: "drafts/reels.md",
  x: "drafts/threads.md",
  twitter: "drafts/threads.md",
  thread: "drafts/threads.md",
  threads: "drafts/threads.md",
  reddit: "drafts/reddit.md",
  subreddit: "drafts/reddit.md",
  platform: "drafts/platform-adaptations.md",
  message: "drafts/messages.md",
  image: "creative/visual-briefs.md",
  visual: "creative/visual-briefs.md",
  workflow: "review/qa-recap.md",
  content: "drafts/posts.md"
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath, fallback) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : (fallback || "");
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function targetForIntent(type) {
  return targetByIntent[type] || targetByIntent.content;
}

function compactStepTask(step, type) {
  const tasks = {
    research: "Find the most useful trend/context angles for this request. Adapt by target platform and cite only provided sources/files.",
    strategy: "Turn the request and business profile into positioning, voice, promise boundaries, platform fit, and content angle.",
    platform: "Choose the right platform logic for this request: audience behavior, format, algorithm-facing content signals, research sources, and approval blockers.",
    calendar: "Place this request into the content system with platform, format, pillar, CTA, and required assets.",
    copy: "Draft the requested social content or message. Adapt format and tone to the platform; keep it specific, premium, and proof-aware.",
    video: "Create hook, shot/beat plan, caption angle, sound/edit notes, and approval blockers for reel/video work.",
    capcut: "Read the reel script and asset intelligence. Produce a precise, second-by-second CapCut Assembly Plan: exact overlay text (max 10 words each), timing in seconds, animation style, sound direction with volume level, caption strategy, template choice, and approval blockers. Output the required JSON block.",
    visuals: "Create visual direction, image prompt, size, composition notes, and model/backend constraints.",
    persona: "Simulate likely objections and conversion triggers from target audience and buyer personas.",
    qa: "Review the draft as an adversarial QA reviewer and list exact fixes, blockers, and approval risks.",
    publishing: "Prepare manual publishing/export checklist and approval blockers. Do not publish.",
    compliance: "Audit policy, platform, source, and claim risks. Block unsafe automation.",
    "platform-adapt": "Adapt the final approved draft for Instagram, X/Twitter, Facebook, Reddit, and LinkedIn."
  };
  return tasks[step] || `Handle this ${type} request within the workspace rules.`;
}

function projectNameFromBusinessProfile(business) {
  const match = String(business || "").match(/^Project:\s*(.+)$/mi);
  return match ? match[1].trim() : null;
}

function requestScopeGuard({ business, request, linkIntel }) {
  const projectName = projectNameFromBusinessProfile(business);
  const requestText = String(request || "").toLowerCase();
  const projectMentioned = projectName && requestText.includes(projectName.toLowerCase());
  const hasExternalUrl = /https?:\/\//i.test(request || "");
  const linkTitle = (String(linkIntel || "").match(/Title:\s*(.+)/i) || [])[1] || "";
  const externalBrandLikely = hasExternalUrl || (linkTitle && (!projectName || !linkTitle.toLowerCase().includes(projectName.toLowerCase())));
  if (externalBrandLikely && !projectMentioned) {
    return `The current request appears to be about an external product, brand, or URL rather than the workspace business itself.

- Treat the user's request and Link Intelligence as the primary campaign/product context.
- Use the workspace business profile only for safety rules, approval posture, and operating style.
- Do not force the workspace niche, audience, events, tickets, venues, food/drinks, or networking positioning into the artifact unless the user explicitly asks for it.
- Approval blockers must match the requested product/link. Do not include event-date, venue, ticket, or attendance blockers for non-event/product content.`;
  }
  return `The current request appears to belong to the workspace business. Use the business profile as the primary brand context while still following the user's exact request.`;
}

const STRUCTURED_OUTPUT_INSTRUCTIONS = `
## Structured Output Required
After your main response, add these sections EXACTLY as shown:

### Decisions Made
- [one decision per line]

### Risks Identified
- [one risk per line]

### Confidence: N%

### Revision Needed
Target: [agent-name or "none"]
Instructions: [specific revision instructions, or "none"]
`;

function buildStepPrompt({ workspaceRoot, request, type, target, step, previousHandoffs, revisionContext }) {
  const agentId = agentByStep[step] || step;
  const agent = readText(path.join(workspaceRoot, "agents", `${agentId}.md`));
  const business = readText(path.join(workspaceRoot, "business/business.md")).slice(0, 7000);
  const currentRequest = readText(path.join(workspaceRoot, "operations/current-request.md"));
  const liveTrends = readText(path.join(workspaceRoot, "research/live-trend-report.md")).slice(0, 5000);
  const platformPlaybooks = readText(path.join(workspaceRoot, "platforms/platform-playbooks.md")).slice(0, 7000);
  const imageIntel = readText(path.join(workspaceRoot, "assets/analysis/image-intelligence-latest.md")).slice(0, 5000);
  const reelIntel = readText(path.join(workspaceRoot, "assets/analysis/reel-intelligence-latest.md")).slice(0, 5000);
  const linkIntel = readText(path.join(workspaceRoot, "sources/link-intelligence-latest.md")).slice(0, 5000);
  const scopeGuard = requestScopeGuard({ business, request, linkIntel });
  const targetContent = readText(path.join(workspaceRoot, target)).slice(0, 5000);
  const capcutPlan = step === "capcut"
    ? readText(path.join(workspaceRoot, "creative/capcut-plan.json")).slice(0, 3000)
    : "";

  const revisionBlock = revisionContext
    ? `\n## Revision Instructions\nThis is a REVISION pass. The QA agent identified issues with the previous output. Address these specific instructions before proceeding:\n\n${revisionContext}\n`
    : "";

  return `# Adaptive Agent Step

You are one specialist inside a local-first social media team with a shared decision blackboard.

## Agent
${agent}

## User Request
${request}

## Intent
${type}

## Target File
${target}

## Step Task
${compactStepTask(step, type)}
${revisionBlock}
## Business Profile
${business}

## Request Scope Guard
${scopeGuard}

## Current Request File
${currentRequest}

## Live Trend Context
${liveTrends || "No live trend context available."}

## Platform Playbooks
${platformPlaybooks || "No platform playbooks available. Infer platform constraints conservatively."}

## Reel Intelligence Context
${reelIntel || "No reel intelligence context available."}

## Image Intelligence Context
${imageIntel || "No image intelligence context available."}

## Link Intelligence Context
${linkIntel || "No link intelligence context available."}

## Current Target Content
${targetContent || "No existing target content."}
${capcutPlan ? `\n## CapCut Plan (creative/capcut-plan.json)\n\`\`\`json\n${capcutPlan}\n\`\`\`` : ""}
## Previous Handoffs
${previousHandoffs || "No previous handoffs."}

## Output
Return:
- Observed facts
- Assumptions
- Draft/recommendation for this step
- Approval blockers
- Agent Handoff for the next agent

Hard rules: no invented numbers, no superlatives, no outcome promises, no automatic publishing, no DM/comment/like/follow/reply/vote automation. Reddit requires subreddit-rule review before posting. X requires manual/official approved posting only.
${STRUCTURED_OUTPUT_INSTRUCTIONS}`;
}

function extractAgentHandoff(markdown) {
  const text = String(markdown || "");
  const match = text.match(/Agent Handoff\s*:?\s*([\s\S]*)$/i);
  return (match ? match[1] : text).trim().slice(0, 2500);
}

function fallbackOutput({ step, request, type, previousHandoffs, error }) {
  const role = agentByStep[step] || step;
  return `# ${role} Fallback Handoff

Status: fallback_template

The local model step did not complete in time.

## Observed Facts
- User request: ${request}
- Intent: ${type}

## Assumptions
- The final artifact must stay draft-only and require human approval.

## Draft/Recommendation For This Step
${compactStepTask(step, type)}

${previousHandoffs || "No previous handoffs."}

## Approval Blockers
- Confirm factual claims before publishing.
- Confirm the destination link, offer, and product positioning before publishing.

## Agent Handoff
Next agent: keep focused, avoid invented claims.

Fallback reason: ${error}

### Decisions Made
- Fallback template used due to model timeout

### Risks Identified
- Step did not execute; output is template only

### Confidence: 10%

### Revision Needed
Target: none
Instructions: none
`;
}

function persistBlackboardEntries(workspaceRoot, runId, step, output) {
  const agentId = agentByStep[step] || step;
  const decisions = extractDecisions(output);
  const risks = extractRisks(output);
  const revisionReq = extractRevisionRequest(output);
  const confidence = extractConfidence(output) || 50;
  const entries = [];

  for (const content of decisions) {
    const entry = writeEntry(workspaceRoot, runId, {
      agent: agentId,
      step,
      type: "decision",
      content,
      confidence
    });
    entries.push(entry);
  }

  for (const content of risks) {
    const isBlocker = /block|prevent|must not|cannot|hard stop/i.test(content);
    const entry = writeEntry(workspaceRoot, runId, {
      agent: agentId,
      step,
      type: isBlocker ? "blocker" : "risk",
      content,
      confidence
    });
    entries.push(entry);
  }

  if (revisionReq.needed && revisionReq.targetAgent && revisionReq.instructions) {
    const entry = writeEntry(workspaceRoot, runId, {
      agent: agentId,
      step,
      type: "revision_request",
      content: `${agentId} requests revision from ${revisionReq.targetAgent}`,
      targetAgents: [revisionReq.targetAgent],
      requiresRevision: true,
      revisionInstructions: revisionReq.instructions,
      confidence
    });
    entries.push(entry);
  }

  const handoffEntry = writeEntry(workspaceRoot, runId, {
    agent: agentId,
    step,
    type: "handoff",
    content: extractAgentHandoff(output).slice(0, 800),
    confidence
  });
  entries.push(handoffEntry);

  return entries;
}

function getPendingRevisions(workspaceRoot, runId, targetStep) {
  const agentId = agentByStep[targetStep] || targetStep;
  const revisions = readEntries(workspaceRoot, runId, { type: "revision_request", resolved: false });
  return revisions.filter((entry) =>
    entry.targetAgents && entry.targetAgents.some(
      (a) => a === agentId || a === targetStep
    )
  );
}

function resolveRevisions(workspaceRoot, runId, revisions) {
  for (const rev of revisions) {
    resolveEntry(workspaceRoot, runId, rev.entryId);
  }
}

function synthesisPrompt({ workspaceRoot, request, type, target, outputs }) {
  const business = readText(path.join(workspaceRoot, "business/business.md"));
  const policy = readText(path.join(workspaceRoot, "policy/publishing-policy.json"));
  const platformPlaybooks = readText(path.join(workspaceRoot, "platforms/platform-playbooks.md"));
  const linkIntel = readText(path.join(workspaceRoot, "sources/link-intelligence-latest.md"));
  const scopeGuard = requestScopeGuard({ business, request, linkIntel });
  const currentTarget = readText(path.join(workspaceRoot, target));

  return `# Final Social Team Synthesis

You are the final editor for a local-first social media agent team.

## User Request
${request}

## Intent
${type}

## Target File
${target}

## Business Profile
${business}

## Request Scope Guard
${scopeGuard}

## Publishing Policy
\`\`\`json
${policy}
\`\`\`

## Platform Playbooks
${platformPlaybooks || "No platform playbooks available."}

## Current Target File Content
${currentTarget || "Target file does not exist yet."}

## Specialist Outputs
${outputs.map((item) => `### ${item.step}${item.revisionPass ? " (revised)" : ""}
${item.output}
`).join("\n")}

## Required Final Artifact Rules
- Write only the target artifact content, not commentary.
- Use the user's request as the concrete brief.
- Follow the Request Scope Guard. If the user/link is about a different product or brand, do not force the workspace business niche into the final artifact.
- If facts are missing, include a short "Approval Blockers" section instead of inventing.
- No automatic publishing language.
- No DM/comment/like/follow/reply/vote automation.
- X drafts must be text-first and not pasted Instagram-style.
- Reddit drafts must be community-first and include subreddit-rule approval blockers.
- No invented attendance, guest, venue, price, food/drink, scarcity, testimonial, partnership, or performance claims.
- The artifact is draft-only and needs human review.
`;
}

function revisionPrompt({ artifact, policyMarkdown, request, target }) {
  return `# Revise Blocked Social Artifact

The previous artifact was blocked by the workspace content policy. Rewrite it so it can be saved as a draft for human review.

## User Request
${request}

## Target File
${target}

## Blocked Artifact
${artifact}

## Policy Findings
${policyMarkdown}

## Revision Rules
- Return only the revised target artifact content.
- Remove outcome promises, superlatives, exaggerated claims, and unverified inclusions.
- Avoid attendance numbers unless explicitly confirmed in the request.
- Avoid "best", "top", "guaranteed", "promise", "VIP", "elite", "free trial", "sign up now".
- Keep it premium, useful, and specific.
- Keep clear approval blockers for facts that need confirmation.
- Do not publish or imply approval.
`;
}

function backupTarget({ workspaceRoot, target, runId }) {
  const source = path.join(workspaceRoot, target);
  if (!fs.existsSync(source)) {
    return null;
  }
  const backup = path.join(workspaceRoot, "review/orchestrator-backups", runId, target.replace(/[\\/]/g, "__"));
  ensureDir(path.dirname(backup));
  fs.copyFileSync(source, backup);
  return path.relative(workspaceRoot, backup);
}

function buildOrchestrationReport({ runId, workspaceRoot, stepLog, revisionLog, summary, remainingBlockers }) {
  const lines = [
    `# Orchestration Report`,
    ``,
    `Run ID: ${runId}`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `## Steps Executed`,
    stepLog.map((item) => `- **${item.step}** (${item.agent}): ${item.status}${item.revisionPass ? " [REVISION PASS]" : ""}${item.elapsed ? ` — ${item.elapsed}s` : ""}`).join("\n"),
    ``,
    `## Revision History`,
    revisionLog.length === 0
      ? "No revisions triggered."
      : revisionLog.map((item) => `- Loop ${item.loop}: re-ran **${item.step}** — reason: ${item.reason}`).join("\n"),
    ``,
    `## Key Decisions`,
    summary.decisions.length === 0
      ? "None recorded."
      : summary.decisions.map((d) => `- [${d.step}/${d.agent}] ${d.content}`).join("\n"),
    ``,
    `## Remaining Blockers`,
    remainingBlockers.length === 0
      ? "None."
      : remainingBlockers.map((b) => `- [${b.step}] ${b.content}`).join("\n"),
    ``,
    `## Handoff Summary`,
    summary.handoffs.map((h) => `- ${h.step} → ${h.agent}`).join("\n") || "None.",
    ``,
    `## Human Approval Required`,
    `Yes. This report is for internal traceability only. No artifact has been published.`
  ];
  return lines.join("\n");
}

async function runAdaptiveTeam({
  workspaceRoot,
  teamRoot,
  request,
  type,
  target,
  steps,
  model,
  timeoutMs,
  maxRevisions,
  runId
}) {
  const outputs = [];
  const handoffs = [];
  const stepLog = [];
  const revisionLog = [];
  let completedSteps = 0;
  let fallbackSteps = 0;
  let revisionLoops = 0;
  const maxRevisionLoops = maxRevisions != null ? maxRevisions : 2;

  const mainSteps = steps.filter((s) => s !== "qa");
  const hasQa = steps.includes("qa");

  async function runStep(step, revisionContext) {
    const isRevision = Boolean(revisionContext);
    const stepStart = Date.now();
    const agentId = agentByStep[step] || step;
    const label = isRevision ? `${step} [revision]` : step;
    console.log(`  [adaptive] ${agentId} (${label}) — starting`);

    const stepIndex = stepLog.length + 1;
    const stepDirName = `${String(stepIndex).padStart(2, "0")}-${step}${isRevision ? "-rev" : ""}`;
    const stepRoot = path.join(teamRoot, "agent-steps", stepDirName);

    const previousHandoffs = handoffs
      .map((h) => `## ${h.step}\n${h.handoff}\n`)
      .join("\n");

    const prompt = buildStepPrompt({
      workspaceRoot,
      request,
      type,
      target,
      step,
      previousHandoffs,
      revisionContext: revisionContext || null
    });
    writeText(path.join(stepRoot, "prompt.md"), prompt);

    let output = "";
    let status = "completed";
    let error = null;

    if (step === "platform-adapt") {
      try {
        const finalDraft = readText(path.join(workspaceRoot, target));
        const producedDraft = outputs.map((o) => o.output).join("\n\n").slice(0, 5000);
        const businessCtx = readText(path.join(workspaceRoot, "business", "business.md"));
        const adaptResult = await runPlatformAdapter({
          workspaceRoot,
          draft: producedDraft || finalDraft,
          businessContext: businessCtx,
          model,
          timeoutMs,
          runId
        });
        output = `Platform adaptations generated for: ${Object.keys(adaptResult.results).join(", ")}\nArtifact: ${adaptResult.artifact.id}`;
        completedSteps += 1;
      } catch (caught) {
        status = "fallback_template";
        error = caught.message;
        output = `Platform adaptation failed: ${caught.message}`;
        fallbackSteps += 1;
      }
    } else {
      try {
        output = await runOllamaGenerate({ model, prompt, timeoutMs });
        completedSteps += 1;
      } catch (caught) {
        status = "fallback_template";
        error = caught.message;
        output = fallbackOutput({ step, request, type, previousHandoffs, error });
        fallbackSteps += 1;
      }
    }

    const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
    console.log(`  [adaptive] ${agentId} — ${status} (${elapsed}s)${error ? ` | ${error.slice(0, 60)}` : ""}`);

    const handoff = {
      index: stepIndex,
      step,
      agentId,
      status,
      error,
      revisionPass: isRevision,
      handoff: extractAgentHandoff(output),
      outputPreview: output.slice(0, 1200)
    };

    outputs.push({ step, output, revisionPass: isRevision });
    handoffs.push(handoff);
    writeText(path.join(stepRoot, "output.md"), output.endsWith("\n") ? output : `${output}\n`);
    writeText(path.join(stepRoot, "handoff.json"), `${JSON.stringify(handoff, null, 2)}\n`);

    const bbEntries = persistBlackboardEntries(workspaceRoot, runId, step, output);

    stepLog.push({
      step,
      agent: agentId,
      status,
      elapsed,
      revisionPass: isRevision,
      blackboardEntries: bbEntries.length
    });

    writeDecisionLog(workspaceRoot, {
      runId,
      step,
      agent: agentId,
      type: "routing_decision",
      content: `Executed step ${step} (${isRevision ? "revision" : "initial"}) — status: ${status}`,
      metadata: { elapsed, revisionPass: isRevision, error }
    });

    return { output, status, error, handoff };
  }

  for (const step of mainSteps) {
    const pendingRevisions = getPendingRevisions(workspaceRoot, runId, step);
    let revisionContext = null;
    if (pendingRevisions.length > 0) {
      revisionContext = pendingRevisions
        .map((rev) => rev.revisionInstructions)
        .filter(Boolean)
        .join("\n\n");
      resolveRevisions(workspaceRoot, runId, pendingRevisions);
      writeDecisionLog(workspaceRoot, {
        runId,
        step,
        type: "pre_execution_revision_inject",
        content: `Found ${pendingRevisions.length} pending revision(s) for ${step} before execution`,
        metadata: { revisionEntryIds: pendingRevisions.map((r) => r.entryId) }
      });
    }
    await runStep(step, revisionContext);
  }

  if (hasQa) {
    let qaLoop = 0;
    let continueRevision = true;

    while (continueRevision && qaLoop < maxRevisionLoops) {
      qaLoop += 1;
      const { output: qaOutput } = await runStep("qa", null);

      const revisionReq = extractRevisionRequest(qaOutput);
      const pendingAfterQa = getPendingRevisions(workspaceRoot, runId, "copywriter")
        .concat(getPendingRevisions(workspaceRoot, runId, "copy"));

      if (!revisionReq.needed && pendingAfterQa.length === 0) {
        continueRevision = false;
        writeDecisionLog(workspaceRoot, {
          runId,
          step: "qa",
          type: "routing_decision",
          content: `QA loop ${qaLoop}: no revisions needed, proceeding to synthesis`,
          metadata: { loop: qaLoop }
        });
        break;
      }

      if (revisionLoops >= maxRevisionLoops) {
        continueRevision = false;
        writeDecisionLog(workspaceRoot, {
          runId,
          step: "qa",
          type: "routing_decision",
          content: `Max revision loops reached (${maxRevisionLoops}), proceeding to synthesis with open issues`,
          metadata: { loop: qaLoop, maxRevisionLoops }
        });
        break;
      }

      revisionLoops += 1;
      const revInstructions = revisionReq.instructions
        || pendingAfterQa.map((r) => r.revisionInstructions).filter(Boolean).join("\n\n")
        || "Address QA findings before final synthesis.";

      console.log(`  [adaptive] revision loop ${revisionLoops}/${maxRevisionLoops} — re-running copywriter`);
      revisionLog.push({ loop: revisionLoops, step: "copy", reason: revInstructions.slice(0, 200) });

      resolveRevisions(workspaceRoot, runId, pendingAfterQa);
      await runStep("copy", revInstructions);
    }
  }

  writeText(path.join(teamRoot, "handoffs.json"), `${JSON.stringify({ handoffs }, null, 2)}\n`);
  return { outputs, handoffs, completedSteps, fallbackSteps, totalSteps: steps.length, revisionLoops, stepLog, revisionLog };
}

async function runAdaptiveTeamOrchestration({
  root,
  workspace,
  request,
  type,
  steps,
  model,
  timeoutMs,
  apply,
  maxRevisions
}) {
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    throw new Error(`Workspace not found: ${workspace}`);
  }
  const target = targetForIntent(type);
  const runId = timestampId();
  const teamRoot = path.join(workspaceRoot, "team-runs", runId);
  const reelIntent = ["reel", "video"].includes(type);
  const defaultSteps = reelIntent
    ? ["strategy", "video", "capcut", "qa", "platform-adapt"]
    : ["research", "strategy", "copy", "persona", "qa", "platform-adapt"];
  const selectedSteps = steps && steps.length > 0 ? steps : defaultSteps;

  writeText(path.join(workspaceRoot, "operations/current-request.md"), `# Current User Request

Created at: ${new Date().toISOString()}

Intent: ${type}

Target: ${target}

Requested steps: ${selectedSteps.join(", ")}

## User Request
${request}
`);

  if (selectedSteps.includes("research")) {
    const briefPath = path.join(workspaceRoot, "project-brief.json");
    const brief = fs.existsSync(briefPath) ? JSON.parse(readText(path.join(workspaceRoot, "project-brief.json"))) : {};
    const niche = brief.niche || "";
    const topics = niche ? [niche, "AI tools", "content creation"] : ["AI tools", "content creation", "local-first"];
    console.log("  live-trend-fetch — fetching RSS + HN + Product Hunt");
    runLiveFetcher({ workspaceRoot, topics }).then((r) => {
      console.log(`  live-trend-fetch — done (${r.itemCount} items)`);
    }).catch((err) => {
      console.log(`  live-trend-fetch — skipped: ${err.message}`);
    });
  }

  const workflow = await runWorkflow({
    root,
    workspace: paths.workspace,
    dryRun: true,
    preferredModel: model,
    selectedStepIds: selectedSteps,
    timeoutMs
  });

  const chainResult = await runAdaptiveTeam({
    workspaceRoot,
    teamRoot,
    request,
    type,
    target,
    steps: selectedSteps,
    model,
    timeoutMs,
    maxRevisions: maxRevisions != null ? maxRevisions : 2,
    runId
  });

  console.log(`  agent steps: ${chainResult.completedSteps}/${chainResult.totalSteps} completed, ${chainResult.fallbackSteps} fallback, ${chainResult.revisionLoops} revision loop(s)`);

  const boardSummary = getRunSummary(workspaceRoot, runId);

  if (chainResult.completedSteps === 0) {
    const result = {
      version: "0.1.0",
      runId,
      generatedAt: new Date().toISOString(),
      workspace: paths.workspace,
      request,
      type,
      target,
      model,
      workflowRun: path.relative(workspaceRoot, workflow.workflowRoot),
      teamRun: path.relative(workspaceRoot, teamRoot),
      status: "failed_needs_model_run",
      failedStep: "agent-chain",
      synthesisError: "All adaptive agent steps fell back before final synthesis.",
      agentSteps: { completed: chainResult.completedSteps, fallback: chainResult.fallbackSteps, total: chainResult.totalSteps, revisionLoops: chainResult.revisionLoops },
      requiredHumanApproval: true,
      automaticPublishEnabled: false,
      blackboard: {
        totalEntries: boardSummary.totalEntries,
        decisions: boardSummary.decisions.length,
        risks: boardSummary.risks.length,
        blockers: boardSummary.blockers.length,
        revisionRequests: boardSummary.revision_requests.length
      }
    };
    const orchestrationReport = buildOrchestrationReport({
      runId,
      workspaceRoot,
      stepLog: chainResult.stepLog,
      revisionLog: chainResult.revisionLog,
      summary: boardSummary,
      remainingBlockers: boardSummary.blockers
    });
    writeText(path.join(teamRoot, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
    writeText(path.join(teamRoot, "orchestration-report.md"), orchestrationReport);
    registerArtifact(workspaceRoot, {
      path: path.relative(workspaceRoot, path.join(teamRoot, "result.json")),
      type: "adaptive-team-run-result",
      intent: type,
      sourceRun: runId,
      sourceAgent: "adaptive-orchestrator",
      status: "rejected",
      metadata: { request, target, synthesisError: result.synthesisError }
    });
    return { result, workflowRoot: workflow.workflowRoot, teamRoot, finalArtifact: null };
  }

  const synth = synthesisPrompt({
    workspaceRoot,
    request,
    type,
    target,
    outputs: chainResult.outputs
  });
  writeText(path.join(teamRoot, "final-synthesis-prompt.md"), synth);

  console.log("  final-synthesis — starting");
  const synthStart = Date.now();
  let finalArtifact = null;
  let synthesisError = null;
  try {
    finalArtifact = await runOllamaGenerate({ model, prompt: synth, timeoutMs });
  } catch (caught) {
    synthesisError = caught.message;
  }
  const synthElapsed = ((Date.now() - synthStart) / 1000).toFixed(1);

  if (synthesisError) {
    const result = {
      version: "0.1.0",
      runId,
      generatedAt: new Date().toISOString(),
      workspace: paths.workspace,
      request,
      type,
      target,
      model,
      workflowRun: path.relative(workspaceRoot, workflow.workflowRoot),
      teamRun: path.relative(workspaceRoot, teamRoot),
      status: "failed_needs_model_run",
      failedStep: "final-synthesis",
      synthesisError,
      agentSteps: { completed: chainResult.completedSteps, fallback: chainResult.fallbackSteps, total: chainResult.totalSteps, revisionLoops: chainResult.revisionLoops },
      requiredHumanApproval: true,
      automaticPublishEnabled: false
    };
    console.log(`  final-synthesis — failed_needs_model_run (${synthElapsed}s)`);
    writeText(path.join(teamRoot, "result.json"), `${JSON.stringify(result, null, 2)}\n`);

    const orchestrationReport = buildOrchestrationReport({
      runId,
      workspaceRoot,
      stepLog: chainResult.stepLog,
      revisionLog: chainResult.revisionLog,
      summary: boardSummary,
      remainingBlockers: boardSummary.blockers
    });
    writeText(path.join(teamRoot, "orchestration-report.md"), orchestrationReport);

    registerArtifact(workspaceRoot, {
      path: path.relative(workspaceRoot, path.join(teamRoot, "result.json")),
      type: "adaptive-team-run-result",
      intent: type,
      sourceRun: runId,
      sourceAgent: "adaptive-orchestrator",
      status: "rejected",
      metadata: { request, target, synthesisError }
    });
    return { result, workflowRoot: workflow.workflowRoot, teamRoot, finalArtifact: null };
  }

  console.log(`  final-synthesis — completed (${synthElapsed}s)`);
  let normalized = finalArtifact.trim().endsWith("\n") ? finalArtifact.trim() : `${finalArtifact.trim()}\n`;
  let audit = auditContentPolicy(normalized);
  let revisionAttempted = false;

  if (audit.blockers.length > 0) {
    revisionAttempted = true;
    const policyMarkdown = policyReportMarkdown(audit);
    console.log(`  policy-revision — starting (${audit.blockers.length} blockers)`);
    const revStart = Date.now();
    try {
      const revised = await runOllamaGenerate({
        model,
        timeoutMs,
        prompt: revisionPrompt({ artifact: normalized, policyMarkdown, request, target })
      });
      normalized = revised.trim().endsWith("\n") ? revised.trim() : `${revised.trim()}\n`;
      audit = auditContentPolicy(normalized);
      console.log(`  policy-revision — completed (${((Date.now() - revStart) / 1000).toFixed(1)}s), policy: ${audit.status}`);
    } catch (revError) {
      console.log(`  policy-revision — failed: ${revError.message}`);
      audit = auditContentPolicy(normalized);
    }
  }

  const blocked = audit.blockers.length > 0;
  const backup = !blocked && apply ? backupTarget({ workspaceRoot, target, runId }) : null;
  if (!blocked && apply) {
    writeText(path.join(workspaceRoot, target), normalized);
  }

  const result = {
    version: "0.1.0",
    runId,
    generatedAt: new Date().toISOString(),
    workspace: paths.workspace,
    request,
    type,
    target,
    model,
    workflowRun: path.relative(workspaceRoot, workflow.workflowRoot),
    teamRun: path.relative(workspaceRoot, teamRoot),
    status: blocked ? "blocked_by_content_policy" : apply ? "applied_needs_human_review" : "draft_ready",
    revisionAttempted,
    agentSteps: { completed: chainResult.completedSteps, fallback: chainResult.fallbackSteps, total: chainResult.totalSteps, revisionLoops: chainResult.revisionLoops },
    backup,
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    contentPolicy: {
      status: audit.status,
      blockers: audit.blockers.length,
      warnings: audit.warnings.length
    },
    blackboard: {
      totalEntries: boardSummary.totalEntries,
      decisions: boardSummary.decisions.length,
      risks: boardSummary.risks.length,
      blockers: boardSummary.blockers.length,
      revisionRequests: boardSummary.revision_requests.length
    }
  };

  const orchestrationReport = buildOrchestrationReport({
    runId,
    workspaceRoot,
    stepLog: chainResult.stepLog,
    revisionLog: chainResult.revisionLog,
    summary: boardSummary,
    remainingBlockers: boardSummary.blockers
  });

  writeText(path.join(teamRoot, "final-artifact.md"), normalized);
  writeText(path.join(teamRoot, "content-policy.md"), policyReportMarkdown(audit));
  writeText(path.join(teamRoot, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeText(path.join(teamRoot, "orchestration-report.md"), orchestrationReport);

  const finalArtifactPath = path.relative(workspaceRoot, path.join(teamRoot, "final-artifact.md"));
  registerArtifact(workspaceRoot, {
    path: finalArtifactPath,
    type: "adaptive-team-final-artifact",
    intent: type,
    platform: ["x", "twitter", "reddit"].includes(type) ? type : null,
    sourceRun: runId,
    sourceAgent: "adaptive-orchestrator",
    status: blocked ? "rejected" : "needs_human_review",
    metadata: {
      request,
      target,
      contentPolicyStatus: audit.status,
      agentSteps: result.agentSteps,
      workflowRun: result.workflowRun,
      teamRun: result.teamRun,
      applied: !blocked && apply,
      blackboard: result.blackboard
    }
  });

  if (!blocked && apply) {
    registerArtifact(workspaceRoot, {
      path: target,
      type: "applied-draft",
      intent: type,
      platform: ["x", "twitter", "reddit"].includes(type) ? type : null,
      sourceRun: runId,
      sourceAgent: "adaptive-orchestrator",
      appliedTarget: target,
      status: "needs_human_review",
      metadata: {
        request,
        sourceArtifact: finalArtifactPath,
        backup
      }
    });
  }

  if (reelIntent && !blocked && apply) {
    const bridge = bridgeCapCutPlanFromReels(workspaceRoot, { runId });
    if (bridge.bridged) {
      console.log(`  capcut-bridge — wrote creative/capcut-plan.json from reels.md (${bridge.overlays} overlays)`);
    }
    result.capcutBridge = bridge;
  }

  return { result, workflowRoot: workflow.workflowRoot, teamRoot, finalArtifact: normalized };
}

module.exports = { requestScopeGuard, runAdaptiveTeamOrchestration, targetForIntent };
