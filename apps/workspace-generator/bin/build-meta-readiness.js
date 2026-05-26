#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildMetaReadiness, metaReadinessMarkdown } = require("../../../packages/publishing/meta-readiness");

const root = path.resolve(__dirname, "../../..");

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/build-meta-readiness.js <workspace>");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const report = buildMetaReadiness(workspaceRoot);
  fs.mkdirSync(path.join(workspaceRoot, "publishing"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "publishing/meta-readiness.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "publishing/meta-readiness.md"), metaReadinessMarkdown(report));
  console.log(`Meta publishing readiness ready for ${workspace}: ${report.status}`);
}

main();
