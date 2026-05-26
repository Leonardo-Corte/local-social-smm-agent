#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildModelRoutingReport, modelRoutingMarkdown } = require("../../../packages/model-router/detect-profile");

const root = path.resolve(__dirname, "../../..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${path.relative(root, workspaceRoot)}`);
    process.exit(1);
  }

  const profiles = readJson("packages/model-router/profiles/model-profiles.json");
  const catalog = readJson("packages/model-router/model-catalog.json");
  const report = buildModelRoutingReport(profiles, catalog);

  writeFile(path.join(workspaceRoot, "model-profile.json"), `${JSON.stringify(report.profile, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "model-routing-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "model-routing-report.md"), modelRoutingMarkdown(report));

  console.log(`Updated model routing report for ${workspace}: ${report.profile.id}`);
}

main();
