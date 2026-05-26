#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  buildCapCutPlan,
  writeCapCutPlan
} = require("../../../packages/video-intel/capcut-plan");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  if (!workspace) {
    console.error("Usage: npm run capcut:plan <workspace> -- --adapter manual-capcut");
    process.exit(1);
  }

  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const plan = buildCapCutPlan({
    workspaceRoot,
    analysisPath: valueAfter(args, "--analysis"),
    recipePath: valueAfter(args, "--recipe"),
    adapter: valueAfter(args, "--adapter") || "manual-capcut"
  });
  const result = writeCapCutPlan({
    workspaceRoot,
    plan,
    sourceRun: `capcut-plan-${new Date().toISOString().replace(/[:.]/g, "-")}`
  });

  console.log(`CapCut plan ready for ${workspace}`);
  console.log(`Plan: ${path.relative(root, result.mdPath)}`);
  console.log(`JSON: ${path.relative(root, result.jsonPath)}`);
  console.log(`Artifact: ${result.artifact.id} (${result.artifact.status})`);
}

main();
