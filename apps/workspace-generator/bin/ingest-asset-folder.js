#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  ingestAssetDirectory,
  writeAssetLibraryMarkdown,
  writeAssetWatchManifest
} = require("../../../packages/workspace-runner/asset-library");

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
  const sourceDir = valueAfter(args, "--dir") || args[1];
  if (!workspace || !sourceDir) {
    console.error("Usage: npm run assets:ingest <workspace> -- --dir /path/to/local-or-drive-folder [--label drive-assets] [--watch-plan]");
    process.exit(1);
  }

  const paths = workspacePaths(root, workspace);
  if (!fs.existsSync(paths.generatedFile("workspace-manifest.json"))) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const report = ingestAssetDirectory({
    workspaceRoot: paths.generated,
    sourceDir,
    sourceLabel: valueAfter(args, "--label") || "local-folder",
    maxDepth: valueAfter(args, "--max-depth") ? Number(valueAfter(args, "--max-depth")) : 3
  });
  const mdPath = writeAssetLibraryMarkdown(paths.generated, report);
  const watch = args.includes("--watch-plan")
    ? writeAssetWatchManifest({
      workspaceRoot: paths.generated,
      sourceDir,
      sourceLabel: valueAfter(args, "--label") || "local-folder",
      intervalSeconds: valueAfter(args, "--interval") ? Number(valueAfter(args, "--interval")) : 300
    })
    : null;

  console.log(`Asset folder ingested for ${workspace}`);
  console.log(`Imported: ${report.imported.length}`);
  console.log(`Rejected: ${report.rejected.length}`);
  console.log(`Library: ${path.relative(root, paths.generatedFile("assets/asset-library.json"))}`);
  console.log(`Report: ${path.relative(root, mdPath)}`);
  if (watch) {
    console.log(`Watch manifest: ${path.relative(root, watch.mdPath)}`);
  }
}

main();
