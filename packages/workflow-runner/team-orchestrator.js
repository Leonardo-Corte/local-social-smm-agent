const fs = require("fs");
const path = require("path");
const { auditContentPolicy, policyReportMarkdown } = require("../review-loop/content-policy");
const { runOllamaGenerate } = require("../local-runtime/model-client");
const { runWorkflow } = require("./pipeline");
const { workspacePaths } = require("../workspace-runner/workspace-paths");
const { registerArtifact } = require("../publishing/artifact-registry");

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

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
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

function collectStepOutputs(workflowRoot) {
  const stepsRoot = path.join(workflowRoot, "steps");
  if (!fs.existsSync(stepsRoot)) {
    return [];
  }
  return fs.readdirSync(stepsRoot)
    .sort()
    .map((stepId) => ({
      stepId,
      output: readText(path.join(stepsRoot, stepId, "output.md"), "").slice(0, 6000),
      metadata: readText(path.join(stepsRoot, stepId, "metadata.json"), "")
    }));
}

const agentByStep = {
  research: "market-researcher",
  strategy: "brand-strategist",
  platform: "platform-strategist",
  calendar: "content-planner",
  copy: "copywriter",
  video: "reel-shorts-producer",
  visuals: "visual-director",
  persona: "persona-simulator",
  qa: "critic-qa",
  publishing: "publishing-operator",
  compliance: "compliance-platform-guardian"
};

function compactStepTask(step, type) {
  const tasks = {
    research: "Find the most useful trend/context angles for this request. Adapt by target platform and cite only provided sources/files.",
    strategy: "Turn the request and business profile into positioning, voice, promise boundaries, platform fit, and content angle.",
    platform: "Choose the right platform logic for this request: audience behavior, format, algorithm-facing content signals, research sources, and approval blockers.",
    calendar: "Place this request into the content system with platform, format, pillar, CTA, and required assets.",
    copy: "Draft the requested social content or message. Adapt format and tone to the platform; keep it specific, premium, and proof-aware.",
    video: "Create hook, shot/beat plan, caption angle, sound/edit notes, and approval blockers for reel/video work.",
    visuals: "Create visual direction, image prompt, size, composition notes, and model/backend constraints.",
    persona: "Simulate likely objections and conversion triggers from target audience and buyer personas.",
    qa: "Review the draft as an adversarial QA reviewer and list exact fixes, blockers, and approval risks.",
    publishing: "Prepare manual publishing/export checklist and approval blockers. Do not publish.",
    compliance: "Audit policy, platform, source, and claim risks. Block unsafe automation."
  };
  return tasks[step] || `Handle this ${type} request within the workspace rules.`;
}

function compactAgentPrompt({ workspaceRoot, request, type, target, step, previousHandoffs }) {
  const agentId = agentByStep[step] || step;
  const agent = readText(path.join(workspaceRoot, "agents", `${agentId}.md`), "");
  const business = readText(path.join(workspaceRoot, "business/business.md"), "").slice(0, 7000);
  const currentRequest = readText(path.join(workspaceRoot, "operations/current-request.md"), "");
  const liveTrends = readText(path.join(workspaceRoot, "research/live-trend-report.md"), "").slice(0, 5000);
  const platformPlaybooks = readText(path.join(workspaceRoot, "platforms/platform-playbooks.md"), "").slice(0, 7000);
  const imageIntel = readText(path.join(workspaceRoot, "assets/analysis/image-intelligence-latest.md"), "").slice(0, 5000);
  const reelIntel = readText(path.join(workspaceRoot, "assets/analysis/reel-intelligence-latest.md"), "").slice(0, 5000);
  const linkIntel = readText(path.join(workspaceRoot, "sources/link-intelligence-latest.md"), "").slice(0, 5000);
  const targetContent = readText(path.join(workspaceRoot, target), "").slice(0, 5000);
  return `# Compact Agent Step

You are one specialist inside a local-first social media team.

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

## Business Profile
${business}

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

## Structured Output Required
After your main response, add these sections EXACTLY as shown:

### Decisions Made
- [one decision per line]

### Risks Identified
- [one risk per line]

### Confidence: N%

### Revision Needed
Target: [agent-name or "none"]
Instructions: [specific revision instructions, or "none"]`;
}

function extractAgentHandoff(markdown) {
  const text = String(markdown || "");
  const match = text.match(/Agent Handoff\s*:?\s*([\s\S]*)$/i);
  return (match ? match[1] : text).trim().slice(0, 2500);
}

function fallbackAgentOutput({ step, request, type, previousHandoffs, error }) {
  const role = agentByStep[step] || step;
  return `# ${role} Fallback Handoff

Status: fallback_template

The local model step did not complete in time, so this structured fallback keeps the team chain usable.

## Observed Facts
- User request: ${request}
- Intent: ${type}
- Previous handoffs are available and should be preserved.

## Assumptions
- The final artifact must stay draft-only and require human approval.
- Missing facts should become approval blockers, not invented claims.

## Draft/Recommendation For This Step
${compactStepTask(step, type)}

Use the previous handoff context below and keep the artifact concise, proof-aware, and specific:

${previousHandoffs || "No previous handoffs."}

## Approval Blockers
- Confirm event details before publishing.
- Confirm ticket inclusions before mentioning food/drinks.
- Confirm any attendance, venue, guest, or partnership claim before use.

## Agent Handoff
The next agent should keep the request focused, avoid invented numbers or status claims, and verify the final draft against content policy.

Fallback reason: ${error}
`;
}

async function runCompactAgentChain({ workspaceRoot, teamRoot, request, type, target, steps, model, timeoutMs }) {
  const outputs = [];
  const handoffs = [];
  let completedSteps = 0;
  let fallbackSteps = 0;
  for (const [index, step] of steps.entries()) {
    const stepStart = Date.now();
    const agentId = agentByStep[step] || step;
    console.log(`  [${index + 1}/${steps.length}] ${agentId} (${step}) — starting`);
    const stepRoot = path.join(teamRoot, "agent-steps", `${String(index + 1).padStart(2, "0")}-${step}`);
    const previousHandoffs = handoffs.map((handoff) => `## ${handoff.step}
${handoff.handoff}
`).join("\n");
    const prompt = compactAgentPrompt({ workspaceRoot, request, type, target, step, previousHandoffs });
    writeText(path.join(stepRoot, "prompt.md"), prompt);
    let output = "";
    let status = "completed";
    let error = null;
    try {
      output = await runOllamaGenerate({ model, prompt, timeoutMs });
      completedSteps += 1;
    } catch (caught) {
      status = "fallback_template";
      error = caught.message;
      output = fallbackAgentOutput({ step, request, type, previousHandoffs, error });
      fallbackSteps += 1;
    }
    const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
    console.log(`  [${index + 1}/${steps.length}] ${agentId} — ${status} (${elapsed}s)${error ? ` | error: ${error.slice(0, 80)}` : ""}`);
    const handoff = {
      index: index + 1,
      step,
      agentId,
      status,
      error,
      handoff: extractAgentHandoff(output),
      outputPreview: output.slice(0, 1200)
    };
    outputs.push({ stepId: step, output, metadata: JSON.stringify(handoff, null, 2) });
    handoffs.push(handoff);
    writeText(path.join(stepRoot, "output.md"), output.endsWith("\n") ? output : `${output}\n`);
    writeText(path.join(stepRoot, "handoff.json"), `${JSON.stringify(handoff, null, 2)}\n`);
  }
  writeText(path.join(teamRoot, "handoffs.json"), `${JSON.stringify({ handoffs }, null, 2)}\n`);
  return { outputs, completedSteps, fallbackSteps, totalSteps: steps.length };
}

function synthesisPrompt({ workspaceRoot, request, type, target, workflowRoot, compactOutputs = [] }) {
  const business = readText(path.join(workspaceRoot, "business/business.md"), "");
  const policy = readText(path.join(workspaceRoot, "policy/publishing-policy.json"), "");
  const platformPlaybooks = readText(path.join(workspaceRoot, "platforms/platform-playbooks.md"), "");
  const currentTarget = readText(path.join(workspaceRoot, target), "");
  const outputs = compactOutputs.length > 0 ? compactOutputs : collectStepOutputs(workflowRoot);
  return `# Final Social Team Synthesis

You are the final editor for a local-first social media agent team.

The team has already run specialist agents. Your job is to synthesize their work into the final target file.

## User Request
${request}

## Intent
${type}

## Target File
${target}

## Business Profile
${business}

## Publishing Policy
\`\`\`json
${policy}
\`\`\`

## Platform Playbooks
${platformPlaybooks || "No platform playbooks available."}

## Current Target File Content
${currentTarget || "Target file does not exist yet."}

## Specialist Outputs
${outputs.map((item) => `### ${item.stepId}
${item.output}
`).join("\n")}

## Required Final Artifact Rules
- Write only the target artifact content, not commentary.
- Use the user's request as the concrete brief.
- Keep it specific to the business profile.
- If facts are missing, include a short "Approval Blockers" section instead of inventing.
- No automatic publishing language.
- No DM/comment/like/follow/reply/vote automation.
- X drafts must be text-first and not pasted Instagram-style.
- Reddit drafts must be community-first and include subreddit-rule approval blockers.
- No invented attendance, guest, venue, price, food/drink, scarcity, testimonial, partnership, or performance claims.
- Do not include any attendance number unless the current user request explicitly confirms it for this exact artifact.
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

async function runTeamOrchestration({
  root,
  workspace,
  request,
  type = "content",
  steps,
  model,
  timeoutMs = 180000,
  apply = true
}) {
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    throw new Error(`Workspace not found: ${workspace}`);
  }
  const target = targetForIntent(type);
  const runId = timestampId();
  const teamRoot = path.join(workspaceRoot, "team-runs", runId);
  const selectedSteps = steps && steps.length > 0 ? steps : ["research", "strategy", "copy", "persona", "qa"];

  writeText(path.join(workspaceRoot, "operations/current-request.md"), `# Current User Request

Created at: ${new Date().toISOString()}

Intent: ${type}

Target: ${target}

Requested steps: ${selectedSteps.join(", ")}

## User Request
${request}
`);

  const workflow = await runWorkflow({
    root,
    workspace: paths.workspace,
    dryRun: true,
    preferredModel: model,
    selectedStepIds: selectedSteps,
    timeoutMs
  });

  const chainResult = await runCompactAgentChain({
    workspaceRoot,
    teamRoot,
    request,
    type,
    target,
    steps: selectedSteps,
    model,
    timeoutMs
  });
  const compactOutputs = chainResult.outputs;

  console.log(`  agent steps: ${chainResult.completedSteps}/${chainResult.totalSteps} completed, ${chainResult.fallbackSteps} fallback`);

  const prompt = synthesisPrompt({ workspaceRoot, request, type, target, workflowRoot: workflow.workflowRoot, compactOutputs });
  writeText(path.join(teamRoot, "final-synthesis-prompt.md"), prompt);

  console.log("  final-synthesis — starting");
  const synthStart = Date.now();
  let finalArtifact = null;
  let synthesisError = null;
  try {
    finalArtifact = await runOllamaGenerate({ model, prompt, timeoutMs });
  } catch (caught) {
    synthesisError = caught.message;
  }
  const synthElapsed = ((Date.now() - synthStart) / 1000).toFixed(1);

  if (synthesisError) {
    const retrySteps = selectedSteps.join(",");
    const retryTimeoutMs = Math.round(timeoutMs * 2);
    const retryCommand = `npm run team:run ${paths.workspace} -- --type ${type} --request "${request.replace(/"/g, '\\"').replace(/\n/g, " ")}" --steps ${retrySteps} --model ${model} --timeout-ms ${retryTimeoutMs}`;
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
      retryCommand,
      agentSteps: { completed: chainResult.completedSteps, fallback: chainResult.fallbackSteps, total: chainResult.totalSteps },
      requiredHumanApproval: true,
      automaticPublishEnabled: false
    };
    console.log(`  final-synthesis — failed_needs_model_run (${synthElapsed}s)`);
    console.log(`  retry: ${retryCommand}`);
    writeText(path.join(teamRoot, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
    writeText(path.join(teamRoot, "summary.md"), `# Social Team Run — FAILED

Request: ${request}

Intent: ${type}

Status: failed_needs_model_run

Failed step: final-synthesis

Error: ${synthesisError}

Agent steps: ${chainResult.completedSteps}/${chainResult.totalSteps} completed (${chainResult.fallbackSteps} fallback)

Prompt saved: ${path.relative(workspaceRoot, path.join(teamRoot, "final-synthesis-prompt.md"))}

Retry command:
\`\`\`
${retryCommand}
\`\`\`
`);
    registerArtifact(workspaceRoot, {
      path: path.relative(workspaceRoot, path.join(teamRoot, "result.json")),
      type: "team-run-result",
      intent: type,
      sourceRun: runId,
      sourceAgent: "social-team-orchestrator",
      status: "rejected",
      metadata: { request, target, synthesisError, retryCommand }
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
    console.log(`  revision — starting (${audit.blockers.length} policy blockers)`);
    const revStart = Date.now();
    try {
      const revised = await runOllamaGenerate({
        model,
        timeoutMs,
        prompt: revisionPrompt({ artifact: normalized, policyMarkdown, request, target })
      });
      normalized = revised.trim().endsWith("\n") ? revised.trim() : `${revised.trim()}\n`;
      audit = auditContentPolicy(normalized);
      console.log(`  revision — completed (${((Date.now() - revStart) / 1000).toFixed(1)}s), policy now: ${audit.status}`);
    } catch (revError) {
      console.log(`  revision — failed (${((Date.now() - revStart) / 1000).toFixed(1)}s): ${revError.message}`);
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
    agentSteps: { completed: chainResult.completedSteps, fallback: chainResult.fallbackSteps, total: chainResult.totalSteps },
    backup,
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    contentPolicy: {
      status: audit.status,
      blockers: audit.blockers.length,
      warnings: audit.warnings.length
    }
  };

  writeText(path.join(teamRoot, "final-artifact.md"), normalized);
  writeText(path.join(teamRoot, "content-policy.md"), policyReportMarkdown(audit));
  writeText(path.join(teamRoot, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeText(path.join(teamRoot, "summary.md"), `# Social Team Run

Request: ${request}

Intent: ${type}

Target: ${target}

Status: ${result.status}

Agent steps: ${chainResult.completedSteps}/${chainResult.totalSteps} completed (${chainResult.fallbackSteps} fallback)

Workflow run: ${result.workflowRun}

Final artifact: ${path.relative(workspaceRoot, path.join(teamRoot, "final-artifact.md"))}

Applied to target: ${!blocked && apply ? "yes" : "no"}

Human approval required: yes
`);

  const finalArtifactPath = path.relative(workspaceRoot, path.join(teamRoot, "final-artifact.md"));
  registerArtifact(workspaceRoot, {
    path: finalArtifactPath,
    type: "team-final-artifact",
    intent: type,
    platform: ["x", "twitter", "reddit"].includes(type) ? type : null,
    sourceRun: runId,
    sourceAgent: "social-team-orchestrator",
    status: blocked ? "rejected" : "needs_human_review",
    metadata: {
      request,
      target,
      contentPolicyStatus: audit.status,
      agentSteps: result.agentSteps,
      workflowRun: result.workflowRun,
      teamRun: result.teamRun,
      applied: !blocked && apply
    }
  });

  if (!blocked && apply) {
    registerArtifact(workspaceRoot, {
      path: target,
      type: "applied-draft",
      intent: type,
      platform: ["x", "twitter", "reddit"].includes(type) ? type : null,
      sourceRun: runId,
      sourceAgent: "social-team-orchestrator",
      appliedTarget: target,
      status: "needs_human_review",
      metadata: {
        request,
        sourceArtifact: finalArtifactPath,
        backup
      }
    });
  }

  return { result, workflowRoot: workflow.workflowRoot, teamRoot, finalArtifact: normalized };
}

module.exports = { runTeamOrchestration, targetForIntent };
