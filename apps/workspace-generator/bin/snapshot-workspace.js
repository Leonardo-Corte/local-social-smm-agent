#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { createSnapshot } = require("../../../packages/workspace-versioning/snapshot");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] || null;
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] || "sample-local-social-team";
  const reason = valueAfter(args, "--reason") || "manual snapshot";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const result = createSnapshot({ workspaceRoot, reason });
  console.log(`Snapshot created: ${path.relative(root, result.snapshotRoot)}`);
  console.log(`Files: ${result.snapshot.copiedFiles.length}`);
}

main();
