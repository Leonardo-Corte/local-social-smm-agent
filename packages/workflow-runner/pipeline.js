const fs = require("fs");
const path = require("path");
const {
  buildPromptPacket,
  chooseOllamaModel,
  listOllamaModels,
  runOllamaGenerate
} = require("../local-runtime/model-client");
const { extractRegenerationTasks, targetByStep } = require("../review-loop/regeneration-extractor");
const { workspacePaths } = require("../workspace-runner/workspace-paths");

const defaultPipeline = [
  {
    id: "intake",
    agentId: "intake-strategist",
    task: "Review the project brief and identify missing context, contradictions, and personalization tasks before content work starts.",
    inputs: ["project-brief.json", "business/business.md", "operations/current-request.md", "operations/agent-operating-contracts.md", "memory/preferences.json", "memory/user-feedback.md"]
  },
  {
    id: "research",
    agentId: "market-researcher",
    task: "Review the trend report and source registry. Produce research gaps, source-risk notes, and concrete trend-research tasks.",
    inputs: ["project-brief.json", "business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "operations/agent-operating-contracts.md", "sources/source-registry.md", "research/trend-report.md", "research/live-trend-report.md", "research/trend-items.json", "sources/link-intelligence-latest.md"]
  },
  {
    id: "strategy",
    agentId: "brand-strategist",
    task: "Turn the brief and research into sharper positioning, voice rules, and content-pillar improvements.",
    inputs: ["project-brief.json", "business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "operations/agent-operating-contracts.md", "research/trend-report.md", "research/live-trend-report.md", "strategy/content-pillars.md"]
  },
  {
    id: "platform",
    agentId: "platform-strategist",
    task: "Adapt the request to each selected platform's algorithm, format expectations, audience behavior, research sources, and approval blockers.",
    inputs: ["project-brief.json", "business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "sources/source-registry.md", "research/trend-report.md", "research/live-trend-report.md", "drafts/platform-adaptations.md"]
  },
  {
    id: "calendar",
    agentId: "content-planner",
    task: "Review the 30-day calendar for cadence, format variety, platform fit, and missing proof points.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "strategy/content-pillars.md", "calendar/30-day-calendar.md", "drafts/platform-adaptations.md"]
  },
  {
    id: "copy",
    agentId: "copywriter",
    task: "Review the requested draft target. Improve clarity, specificity, platform fit, proof-awareness, and CTA quality without inventing offers, free trials, signups, discounts, testimonials, or claims not present in the brief.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "calendar/30-day-calendar.md", "drafts/posts.md", "drafts/threads.md", "drafts/reddit.md", "drafts/platform-adaptations.md", "assets/analysis/video-asset-report.md", "assets/analysis/reel-intelligence-latest.md", "assets/analysis/image-intelligence-latest.md", "sources/link-intelligence-latest.md"]
  },
  {
    id: "video",
    agentId: "reel-shorts-producer",
    task: "Review reel scripts for first-three-second strength, visual beats, editability, and missing assets.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "calendar/30-day-calendar.md", "drafts/reels.md", "assets/analysis/video-asset-report.md", "assets/analysis/reel-intelligence-latest.md"]
  },
  {
    id: "visuals",
    agentId: "visual-director",
    task: "Review visual briefs against the local model route. Produce practical image prompt and ComfyUI readiness improvements.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "model-routing-report.md", "model-routing-benchmark.md", "creative/comfyui-plan.md", "creative/visual-briefs.md", "calendar/30-day-calendar.md", "assets/analysis/video-asset-report.md", "assets/analysis/image-intelligence-latest.md"]
  },
  {
    id: "compliance",
    agentId: "compliance-platform-guardian",
    task: "Audit the workspace for platform, source, license, and publishing risks. Block unsafe automation and list approval blockers.",
    inputs: ["operations/current-request.md", "platforms/platform-playbooks.md", "policy/publishing-policy.json", "sources/source-registry.md", "publishing/meta-readiness.md", "publishing/publishing-checklist.md", "drafts/posts.md", "drafts/threads.md", "drafts/reddit.md"]
  },
  {
    id: "publishing",
    agentId: "publishing-operator",
    task: "Prepare a human-review publishing package. Do not publish. List exact manual/export steps and missing approvals.",
    inputs: ["operations/current-request.md", "platforms/platform-playbooks.md", "publishing/publishing-checklist.md", "publishing/meta-readiness.md", "publishing/export-package.md", "drafts/posts.md", "drafts/carousels.md", "drafts/reels.md", "drafts/threads.md", "drafts/reddit.md", "assets/analysis/reel-intelligence-latest.md"]
  },
  {
    id: "persona",
    agentId: "persona-simulator",
    task: "Use the existing persona report and drafts to identify likely objections, drop-off points, and content improvements.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "simulation/persona-report.md", "drafts/posts.md", "drafts/threads.md", "drafts/reddit.md"]
  },
  {
    id: "qa",
    agentId: "critic-qa",
    task: "Run a final adversarial QA pass. Decide what is not good enough for human approval and convert it into regeneration tasks.",
    inputs: ["business/business.md", "platforms/platform-playbooks.md", "operations/current-request.md", "review/workspace-quality-rubric.json", "simulation/persona-report.md", "review/qa-recap.md", "drafts/posts.md", "drafts/threads.md", "drafts/reddit.md", "assets/analysis/video-asset-report.md", "assets/analysis/reel-intelligence-latest.md"]
  },
  {
    id: "memory",
    agentId: "memory-curator",
    task: "Summarize reusable preferences, rejected patterns, and regeneration tasks learned from this workflow run.",
    inputs: ["operations/current-request.md", "memory/user-feedback.md", "memory/preferences.json", "memory/regeneration-queue.json", "review/qa-recap.md"]
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function existingInputs(workspaceRoot, inputs) {
  return inputs.filter((inputPath) => fs.existsSync(path.join(workspaceRoot, inputPath)));
}

function planMarkdown(plan) {
  return `# Workflow Plan

Workspace: ${plan.workspace}

Mode: ${plan.mode}

Final state is always \`needs-human-review\`. This runner does not publish, DM, comment, reply, vote, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
${plan.steps.map((step) => `| ${step.id} | ${step.agentId} | ${step.inputs.join(", ") || "-"} |`).join("\n")}
`;
}

function stepMarkdown(step, metadata) {
  return `# ${step.id}

Agent: ${step.agentId}

Task: ${step.task}

Backend: ${metadata.backend}

Model: ${metadata.model || "-"}

Status: ${metadata.status}

Inputs:
${metadata.inputs.map((inputPath) => `- ${inputPath}`).join("\n") || "- none"}
`;
}

function finalMarkdown(summary) {
  return `# Workflow Run Summary

Workspace: ${summary.workspace}

Run ID: ${summary.runId}

Status: ${summary.status}

Mode: ${summary.mode}

## Steps
| Step | Agent | Backend | Status |
| --- | --- | --- | --- |
${summary.steps.map((step) => `| ${step.id} | ${step.agentId} | ${step.backend} | ${step.status} |`).join("\n")}

## Human Review Required
${summary.humanReviewRequired.map((item) => `- ${item}`).join("\n")}

## Regeneration Queue
- Tasks added: ${summary.regenerationTaskCount || 0}
- Candidate file: regeneration-candidates.md

## Next Actions
- Review every step output before changing campaign artifacts.
- Convert QA and persona findings into regeneration tasks.
- Approve individual drafts manually before any account-facing action.
`;
}

async function executeStep({ workspaceRoot, workflowRoot, step, dryRun, preferredModel, availableModels, timeoutMs }) {
  const inputs = existingInputs(workspaceRoot, step.inputs);
  const stepRoot = path.join(workflowRoot, "steps", step.id);
  const prompt = buildPromptPacket({
    workspaceRoot,
    agentId: step.agentId,
    task: step.task,
    inputPaths: inputs,
    targetPath: targetByStep[step.id] || null,
    handoffContext: step.handoffContext || ""
  });
  writeText(path.join(stepRoot, "prompt.md"), prompt);

  const model = chooseOllamaModel(availableModels, preferredModel);
  const metadata = {
    id: step.id,
    agentId: step.agentId,
    status: "saved_prompt_packet",
    backend: "prompt-packet",
    model,
    inputs,
    generatedAt: new Date().toISOString()
  };

  let output = "Prompt packet saved. Run with --execute to use a detected local Ollama model.\n";
  if (!dryRun && model) {
    metadata.backend = "ollama";
    try {
      output = await runOllamaGenerate({ model, prompt, timeoutMs });
      metadata.status = "completed";
    } catch (error) {
      metadata.backend = "prompt-packet";
      metadata.status = "fallback_saved_prompt_packet";
      metadata.error = error.message;
      output = `Local execution failed, so this step was saved as a prompt packet.\n\nError: ${error.message}\n`;
    }
  }

  writeText(path.join(stepRoot, "step.md"), stepMarkdown(step, metadata));
  writeText(path.join(stepRoot, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  writeText(path.join(stepRoot, "output.md"), output.endsWith("\n") ? output : `${output}\n`);
  return metadata;
}

function handoffEnvelope({ step, metadata, output, index }) {
  const outputText = String(output || "");
  const handoffMatch = outputText.match(/^#{2,3}\s+Agent Handoff\s*([\s\S]*)$/im);
  const handoffText = handoffMatch ? handoffMatch[1].trim().slice(0, 3000) : outputText.slice(0, 1800);
  return {
    version: "0.1.0",
    index,
    createdAt: new Date().toISOString(),
    stepId: step.id,
    agentId: step.agentId,
    status: metadata.status,
    backend: metadata.backend,
    model: metadata.model,
    target: targetByStep[step.id] || null,
    handoff: handoffText,
    outputPreview: outputText.slice(0, 1200)
  };
}

function handoffContext(envelopes) {
  return envelopes.map((envelope) => `## Handoff From ${envelope.agentId} (${envelope.stepId})
Status: ${envelope.status}
Target: ${envelope.target || "-"}

${envelope.handoff}
`).join("\n");
}

function selectPipelineSteps({ steps, selectedStepIds = [], maxSteps = null }) {
  const selected = selectedStepIds.length > 0
    ? steps.filter((step) => selectedStepIds.includes(step.id))
    : steps;
  return maxSteps ? selected.slice(0, maxSteps) : selected;
}

async function runWorkflow({ root, workspace, dryRun = true, preferredModel = null, selectedStepIds = [], maxSteps = null, timeoutMs = 180000 }) {
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    throw new Error(`Workspace not found: ${workspace}`);
  }

  const runId = timestampId();
  const workflowRoot = path.join(workspaceRoot, "workflow-runs", runId);
  const mode = dryRun ? "dry-run-prompt-packets" : "local-model-execution";
  const pipelineSteps = selectPipelineSteps({ steps: defaultPipeline, selectedStepIds, maxSteps });
  const plan = {
    version: "0.1.0",
    workspace: paths.workspace,
    runId,
    mode,
    steps: pipelineSteps.map((step) => ({
      ...step,
      inputs: existingInputs(workspaceRoot, step.inputs)
    })),
    selectedStepIds,
    maxSteps,
    timeoutMs
  };

  writeText(path.join(workflowRoot, "plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
  writeText(path.join(workflowRoot, "plan.md"), planMarkdown(plan));

  const availableModels = listOllamaModels();
  const steps = [];
  const handoffs = [];
  for (const [index, step] of pipelineSteps.entries()) {
    const stepWithHandoff = {
      ...step,
      handoffContext: handoffContext(handoffs)
    };
    const metadata = await executeStep({
      workspaceRoot,
      workflowRoot,
      step: stepWithHandoff,
      dryRun,
      preferredModel,
      availableModels,
      timeoutMs
    });
    steps.push(metadata);
    const outputPath = path.join(workflowRoot, "steps", step.id, "output.md");
    const output = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
    const envelope = handoffEnvelope({ step, metadata, output, index: index + 1 });
    handoffs.push(envelope);
    writeText(path.join(workflowRoot, "handoffs", `${String(index + 1).padStart(2, "0")}-${step.id}.json`), `${JSON.stringify(envelope, null, 2)}\n`);
  }

  const summary = {
    version: "0.1.0",
    workspace: paths.workspace,
    runId,
    generatedAt: new Date().toISOString(),
    mode,
    status: "needs-human-review",
    automaticPublishEnabled: false,
    requiredHumanApproval: true,
    steps,
    humanReviewRequired: [
      "Review generated step outputs and approve only specific artifacts.",
      "Run regeneration tasks before treating drafts as client-ready.",
      "Use official/manual publishing paths only after approval."
    ]
  };

  writeText(path.join(workflowRoot, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  writeText(path.join(workflowRoot, "summary.md"), finalMarkdown(summary));

  const regenerationTasks = extractRegenerationTasks({ workspaceRoot, workflowRoot });
  summary.regenerationTaskCount = regenerationTasks.length;
  writeText(path.join(workflowRoot, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  writeText(path.join(workflowRoot, "summary.md"), finalMarkdown(summary));

  const manifestPath = path.join(workspaceRoot, "workspace-manifest.json");
  const manifest = readJson(manifestPath, {});
  writeText(path.join(workspaceRoot, "workspace-manifest.json"), `${JSON.stringify({
    ...manifest,
    lastWorkflowRun: path.relative(workspaceRoot, workflowRoot),
    lastWorkflowStatus: summary.status,
    automaticPublishEnabled: false,
    requiredHumanApproval: true
  }, null, 2)}\n`);

  return { workflowRoot, summary };
}

module.exports = { defaultPipeline, runWorkflow, selectPipelineSteps };
