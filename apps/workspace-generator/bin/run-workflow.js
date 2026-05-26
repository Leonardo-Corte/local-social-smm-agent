#!/usr/bin/env node

const path = require("path");
const { runWorkflow } = require("../../../packages/workflow-runner/pipeline");
const { assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function listAfter(args, flag) {
  const value = valueAfter(args, flag);
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = assertSafeWorkspaceSlug(args[0] || "sample-local-social-team");
  const execute = args.includes("--execute");
  const preferredModel = valueAfter(args, "--model");
  const selectedStepIds = listAfter(args, "--steps");
  const maxSteps = valueAfter(args, "--max-steps") ? Number(valueAfter(args, "--max-steps")) : null;
  const timeoutMs = valueAfter(args, "--timeout-ms") ? Number(valueAfter(args, "--timeout-ms")) : 180000;

  const result = await runWorkflow({
    root,
    workspace,
    dryRun: !execute,
    preferredModel,
    selectedStepIds,
    maxSteps,
    timeoutMs
  });

  console.log(`Workflow run saved: ${path.relative(root, result.workflowRoot)}`);
  console.log(`Status: ${result.summary.status}`);
  console.log(`Mode: ${result.summary.mode}`);
  console.log(`Steps: ${result.summary.steps.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
