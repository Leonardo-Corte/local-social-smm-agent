#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildClientReport, buildClientReportHtml } = require("../../../packages/client-report/report");

const root = path.resolve(__dirname, "../../..");

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const outputDir = path.join(workspaceRoot, "client-report");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "report.md"), buildClientReport(workspaceRoot));
  fs.writeFileSync(path.join(outputDir, "report.html"), buildClientReportHtml(workspaceRoot));
  console.log(`Client report ready: ${path.relative(root, path.join(outputDir, "report.md"))}`);
}

main();
