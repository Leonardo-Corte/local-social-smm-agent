#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { EXPORTS, renderStaticPost } = require("../../../packages/design-renderer/static-post-renderer");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] || null;
}

function parseList(value, fallback) {
  if (!value) return fallback;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function main() {
  const args = process.argv.slice(2);
  const rawWorkspace = args[0];
  if (!rawWorkspace || rawWorkspace === "--help") {
    console.log("Usage:");
    console.log("  npm run static:render <workspace>");
    console.log("  npm run static:render <workspace> -- --request \"launch post\" --exports instagram-4x5,x-card");
    console.log(`\nExports: ${Object.keys(EXPORTS).join(", ")}`);
    process.exit(0);
  }

  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const launchPackagePath = valueAfter(args, "--launch-package");
  const request = valueAfter(args, "--request") || "Render platform-native static social launch assets.";
  const exportIds = parseList(valueAfter(args, "--exports"), Object.keys(EXPORTS));
  const result = renderStaticPost({
    workspaceRoot,
    launchPackagePath,
    request,
    exportIds
  });

  console.log(`Static renders ready for ${workspace}`);
  console.log(`Run: ${path.relative(root, result.renderRoot)}`);
  console.log(`Manifest: ${path.relative(root, result.manifestPath)}`);
  console.log(`Quality: ${path.relative(root, result.reportMdPath)}`);
  for (const item of result.rendered) {
    const png = item.png?.outputPath ? ` | png: ${path.relative(root, item.png.outputPath)}` : ` | png: ${item.png?.status || "not_requested"}`;
    console.log(`- ${item.exportId}: ${path.relative(root, item.outputPath)}${png} (${item.artifact.status})`);
  }
  console.log("\nNota: sono draft SVG/PNG con testo reale. Richiedono approvazione umana prima di pubblicare.");
}

main();
