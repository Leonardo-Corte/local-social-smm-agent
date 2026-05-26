#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const { runCreativeWorkflow } = require("../../../packages/workflow-runner/creative-orchestrator");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  if (!workspace) {
    console.error("Usage: npm run creative:run <workspace> -- --request \"creami 4 reel\" [--dir /asset/folder] [--live] [--model qwen2.5:14b]");
    process.exit(1);
  }

  const paths = workspacePaths(root, workspace);
  if (!fs.existsSync(paths.generatedFile("workspace-manifest.json"))) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const request = valueAfter(args, "--request") || args.slice(1).filter((item) => !item.startsWith("--")).join(" ").trim();
  if (!request) {
    console.error("Missing --request \"...\"");
    process.exit(1);
  }

  const run = await runCreativeWorkflow({
    root,
    workspace,
    workspaceRoot: paths.generated,
    request,
    sourceDir: valueAfter(args, "--dir"),
    sourceLabel: valueAfter(args, "--label") || "creative-run",
    liveTrends: args.includes("--live"),
    maxQueries: valueAfter(args, "--max-queries") ? Number(valueAfter(args, "--max-queries")) : 3,
    model: valueAfter(args, "--model") || null,
    executeTeam: !args.includes("--no-team"),
    preview: !args.includes("--no-preview")
  });

  console.log(`Creative workflow complete: ${workspace}`);
  console.log(`Run: ${path.relative(root, run.creativeRunRoot)}`);
  console.log(`Status: ${run.summary.status}`);
  console.log(`Steps: ${run.summary.steps.map((step) => `${step.id}:${step.status}`).join(", ")}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
