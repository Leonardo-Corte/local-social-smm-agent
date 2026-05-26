#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { qualityMarkdown, scoreWorkspace } = require("../../../packages/review-loop/quality-gate");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const report = scoreWorkspace(workspaceRoot);
  fs.mkdirSync(path.join(workspaceRoot, "review"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "review/quality-gate.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "review/quality-gate.md"), qualityMarkdown(report));
  console.log(`Quality gate ${workspace}: ${report.score}/${report.maxScore} ${report.status}`);
}

main();
