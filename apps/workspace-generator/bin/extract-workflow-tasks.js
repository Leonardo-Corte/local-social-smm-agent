#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { extractRegenerationTasks } = require("../../../packages/review-loop/regeneration-extractor");

const root = path.resolve(__dirname, "../../..");

function latestWorkflowRun(workspaceRoot) {
  const runsRoot = path.join(workspaceRoot, "workflow-runs");
  if (!fs.existsSync(runsRoot)) {
    return null;
  }
  const runs = fs.readdirSync(runsRoot)
    .filter((name) => fs.existsSync(path.join(runsRoot, name, "summary.json")))
    .sort();
  return runs.length > 0 ? path.join(runsRoot, runs[runs.length - 1]) : null;
}

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const explicitRun = process.argv[3] || null;
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const workflowRoot = explicitRun
    ? path.resolve(workspaceRoot, explicitRun)
    : latestWorkflowRun(workspaceRoot);
  if (!workflowRoot) {
    console.error(`No workflow run found for ${workspace}`);
    process.exit(1);
  }

  const tasks = extractRegenerationTasks({ workspaceRoot, workflowRoot });
  console.log(`Extracted ${tasks.length} regeneration task(s) from ${path.relative(workspaceRoot, workflowRoot)}`);
}

main();
