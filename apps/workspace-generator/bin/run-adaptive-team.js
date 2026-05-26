#!/usr/bin/env node

const path = require("path");
const { runAdaptiveTeamOrchestration } = require("../../../packages/orchestration/adaptive-orchestrator");
const { assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { chooseOllamaModelForTask, listOllamaModels } = require("../../../packages/local-runtime/model-client");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function listAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return [];
  }
  const values = [];
  for (let i = index + 1; i < args.length; i++) {
    if (args[i].startsWith("-")) {
      break;
    }
    for (const part of args[i].split(",")) {
      const trimmed = part.trim();
      if (trimmed) {
        values.push(trimmed);
      }
    }
  }
  return values;
}

async function main() {
  const args = process.argv.slice(2);
  const rawWorkspace = args[0];
  if (!rawWorkspace) {
    console.error("Usage: npm run team:adaptive <workspace> -- --type carousel --request \"...\" --model qwen2.5:14b [--max-revisions 2] [--fast]");
    process.exit(1);
  }
  const workspace = assertSafeWorkspaceSlug(rawWorkspace);

  const type = valueAfter(args, "--type") || "content";
  const request = valueAfter(args, "--request") || args.slice(1).join(" ").trim();
  if (!request) {
    console.error("Missing request. Use --request \"...\"");
    process.exit(1);
  }

  const preferredModel = valueAfter(args, "--model");
  const taskType = ["x", "twitter", "thread", "post", "carousel", "reel", "reddit", "message", "image"].includes(type)
    ? "social-copy"
    : "strategy";
  const models = listOllamaModels();
  const model = chooseOllamaModelForTask(models, taskType, preferredModel) || preferredModel || "qwen2.5:14b";
  console.log(`model: ${model} (task: ${taskType})`);

  const fast = args.includes("--fast");
  const maxRevisionsRaw = valueAfter(args, "--max-revisions");
  const maxRevisions = maxRevisionsRaw != null ? Number(maxRevisionsRaw) : 2;
  const timeoutMs = valueAfter(args, "--timeout-ms")
    ? Number(valueAfter(args, "--timeout-ms"))
    : fast ? 60000 : 180000;

  let steps = listAfter(args, "--steps");
  if (steps.length === 0 && fast) {
    steps = ["strategy", "copy", "qa"];
  }

  const apply = !args.includes("--no-apply");

  console.log(`workspace: ${workspace} | type: ${type} | steps: ${steps.join(",") || "default"} | timeout: ${timeoutMs}ms | max-revisions: ${maxRevisions}${fast ? " | fast" : ""}`);

  const run = await runAdaptiveTeamOrchestration({ root, workspace, request, type, steps, model, timeoutMs, apply, maxRevisions });

  console.log(`\nAdaptive team run: ${path.relative(root, run.teamRoot)}`);
  console.log(`Workflow: ${path.relative(root, run.workflowRoot)}`);
  console.log(`Status: ${run.result.status}`);

  if (run.result.status === "failed_needs_model_run") {
    console.log(`\nFailed step: ${run.result.failedStep}`);
    console.log(`Error: ${run.result.synthesisError}`);
    process.exit(2);
  }

  console.log(`Target: ${run.result.target}`);
  if (run.result.agentSteps) {
    const s = run.result.agentSteps;
    console.log(`Agent steps: ${s.completed}/${s.total} completed, ${s.fallback} fallback, ${s.revisionLoops} revision loop(s)`);
  }
  if (run.result.blackboard) {
    const b = run.result.blackboard;
    console.log(`Blackboard: ${b.totalEntries} entries | ${b.decisions} decisions | ${b.risks} risks | ${b.blockers} blockers`);
  }
  console.log(`Orchestration report: ${path.relative(root, path.join(run.teamRoot, "orchestration-report.md"))}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
