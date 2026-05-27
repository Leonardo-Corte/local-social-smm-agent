#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { formatNextCommands, writeNextCommandFiles } = require("../../../packages/workspace-runner/next-commands");

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

  const next = writeNextCommandFiles({ root, workspace, state: "chat" });
  console.log(`Workspace: ${workspace}`);
  console.log("");
  console.log(formatNextCommands({ root, workspace, state: "chat" }));
  console.log("");
  console.log("Work folder:");
  console.log(`  ${client}`);
  console.log("");
  console.log(`Next command file: ${path.relative(root, next.generatedNextCommands)}`);
  console.log(`Continue script: ${path.relative(root, next.generatedContinueScript)}`);
  console.log("");
  console.log("Suggested first chat:");
  console.log("  Dimmi cosa manca prima di produrre contenuti per questo progetto.");
}

main();
