#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { applyQueuedOutputs } = require("../../../packages/review-loop/output-applicator");

const root = path.resolve(__dirname, "../../..");

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] || "sample-local-social-team";
  const dryRun = args.includes("--dry-run");
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const result = applyQueuedOutputs({ workspaceRoot, dryRun });
  console.log(`Output applicator ${dryRun ? "previewed" : "processed"} ${result.processed.length} task(s) for ${workspace}`);
  console.log(`Run id: ${result.runId}`);
}

main();
