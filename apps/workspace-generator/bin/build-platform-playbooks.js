#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const {
  buildPlatformPlaybooks,
  writePlatformPlaybooks
} = require("../../../packages/platform-intel/platform-playbooks");

const root = path.resolve(__dirname, "../../..");

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/build-platform-playbooks.js <workspace>");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspaceRoot}`);
    process.exit(1);
  }

  const report = buildPlatformPlaybooks(workspaceRoot);
  writePlatformPlaybooks(workspaceRoot, report);
  console.log(`Platform playbooks ready for ${workspace}: ${report.platforms.join(", ")}`);
}

main();
