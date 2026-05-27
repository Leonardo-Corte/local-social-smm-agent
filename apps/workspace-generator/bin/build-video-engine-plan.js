#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  buildVideoEnginePlan,
  videoEnginePlanMarkdown
} = require("../../../packages/video-intel/video-engine-plan");

const root = path.resolve(__dirname, "../../..");

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const plan = buildVideoEnginePlan(workspaceRoot);
  fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "creative/video-engine-plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "creative/video-engine-plan.md"), videoEnginePlanMarkdown(plan));
  console.log(`Video engine plan ready for ${workspace}: ${plan.status}`);
}

main();
