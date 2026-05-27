#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildPublishingDryRun, writePublishingDryRun } = require("../../../packages/publishing/dry-run-publisher");
const { assertSafeWorkspaceSlug, workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] || null;
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] ? assertSafeWorkspaceSlug(args[0]) : null;
  const artifactId = valueAfter(args, "--artifact");
  const platform = valueAfter(args, "--platform") || "instagram";
  if (!workspace || !artifactId) {
    console.error("Usage: npm run publishing:dry-run <workspace> -- --artifact <id-or-path> [--platform instagram|facebook|x|reddit|linkedin]");
    process.exit(1);
  }
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    throw new Error(`Workspace not found: ${workspace}`);
  }
  const report = buildPublishingDryRun({ workspaceRoot, artifactId, platform });
  const paths = writePublishingDryRun({ workspaceRoot, report });
  console.log(`Publishing dry run: ${report.status}`);
  console.log(`Report: ${path.relative(root, paths.mdPath)}`);
  if (report.blockers.length) {
    process.exitCode = 2;
  }
}

main();
