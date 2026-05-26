#!/usr/bin/env node


const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const path = require("path");
const { runAgentTask } = require("../../../packages/local-runtime/model-client");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function valuesAfter(args, flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) {
      values.push(args[index + 1]);
    }
  }
  return values;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] || "sample-local-social-team";
  const agent = valueAfter(args, "--agent") || "critic-qa";
  const task = valueAfter(args, "--task") || "Review the current workspace outputs and produce a concise QA recap.";
  const dryRun = args.includes("--dry-run");
  const preferredModel = valueAfter(args, "--model");
  const inputPaths = valuesAfter(args, "--input");
  const workspaceRoot = workspacePaths(root, workspace).generated;

  const result = await runAgentTask({
    workspaceRoot,
    agentId: agent,
    task,
    inputPaths,
    dryRun,
    preferredModel
  });

  console.log(`Agent run saved: ${path.relative(root, result.runRoot)}`);
  console.log(`Backend: ${result.metadata.backend}`);
  if (result.metadata.model) {
    console.log(`Model: ${result.metadata.model}`);
  }
  if (result.metadata.error) {
    console.log(`Fallback reason: ${result.metadata.error}`);
  }
  if (result.metadata.contentPolicy) {
    console.log(`Content policy: ${result.metadata.contentPolicy.status} (${result.metadata.contentPolicy.blockers} blockers, ${result.metadata.contentPolicy.warnings} warnings)`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
