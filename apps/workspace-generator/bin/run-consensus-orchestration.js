#!/usr/bin/env node

const path = require("path");
const { runConsensusOrchestration } = require("../../../packages/orchestration/consensus-orchestrator");
const { assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1] || null;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] ? assertSafeWorkspaceSlug(args[0]) : null;
  if (!workspace) {
    console.error("Usage: npm run consensus:run <workspace> -- --request \"create a reel/post\" [--model qwen2.5:14b]");
    process.exit(1);
  }
  const request = valueAfter(args, "--request") || args.slice(1).join(" ") || "Create a social draft for this workspace.";
  const model = valueAfter(args, "--model") || "qwen2.5:14b";
  const result = await runConsensusOrchestration({ root, workspace, request, model });
  console.log(`Consensus run ready: ${path.relative(root, result.runRoot)}`);
  console.log(`Artifact: ${result.artifact.id} (${result.artifact.status})`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
