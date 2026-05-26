#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

function main() {
  const workspace = process.argv[2];
  if (!workspace) {
    console.error("Usage: npm run workspace:start <workspace>");
    process.exit(1);
  }

  const generated = workspacePaths(root, workspace).generated;
  const client = path.join(root, "workspaces/client-workspaces", workspace);
  if (!fs.existsSync(path.join(generated, "workspace-manifest.json"))) {
    console.error(`Workspace not found: ${generated}`);
    process.exit(1);
  }

  console.log(`Workspace: ${workspace}`);
  console.log("");
  console.log("1. Start the workspace AI chat:");
  console.log(`   npm run workspace:chat ${workspace} -- --model qwen2.5:14b`);
  console.log("");
  console.log("2. Work folder:");
  console.log(`   ${client}`);
  console.log("");
  console.log("Suggested first chat:");
  console.log("   /agent critic-qa");
  console.log("   Dimmi cosa manca prima di produrre contenuti per questo progetto.");
}

main();
