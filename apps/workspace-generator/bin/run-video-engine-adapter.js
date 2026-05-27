#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { detectVideoEngines, videoEngineRegistryMarkdown } = require("../../../packages/video-engines/engine-registry");
const { importPixelleOutput, runPixelleServiceJob, writePixelleHandoff } = require("../../../packages/video-engines/pixelle-adapter");
const { writeVideoOutputComparison } = require("../../../packages/video-engines/video-output-comparison");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1] || null;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] && args[0] !== "--status" ? assertSafeWorkspaceSlug(args[0]) : null;
  if (args.includes("--status") || !workspace) {
    const registry = detectVideoEngines();
    console.log(videoEngineRegistryMarkdown(registry));
    if (!workspace) process.exit(0);
  }
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(path.join(workspaceRoot, "workspace-manifest.json"))) {
    throw new Error(`Missing workspace: ${workspace}`);
  }
  if (args.includes("--pixelle-handoff")) {
    const request = valueAfter(args, "--request") || "Generate a short-form social video from this workspace.";
    const result = writePixelleHandoff({ workspaceRoot, request });
    console.log(`Pixelle handoff: ${path.relative(root, result.mdPath)}`);
    return;
  }
  if (args.includes("--run-pixelle")) {
    const request = valueAfter(args, "--request") || "Generate a short-form social video from this workspace.";
    const result = await runPixelleServiceJob({ workspaceRoot, request });
    console.log(`Pixelle service result: ${result.status}`);
    if (result.handoff) console.log(`Handoff: ${path.relative(root, result.handoff.mdPath)}`);
    if (result.imported) console.log(`Imported: ${path.relative(root, result.imported.outputPath)} (${result.imported.artifact.status})`);
    return;
  }
  if (args.includes("--compare")) {
    const result = writeVideoOutputComparison({ workspaceRoot });
    console.log(`Video output comparison: ${result.report.status}`);
    console.log(`Report: ${path.relative(root, result.mdPath)}`);
    return;
  }
  const output = valueAfter(args, "--import-pixelle-output");
  if (output) {
    const imported = importPixelleOutput({ workspaceRoot, mp4Path: output, metadataPath: valueAfter(args, "--metadata") });
    console.log(`Imported Pixelle output: ${path.relative(root, imported.outputPath)} (${imported.artifact.status})`);
    return;
  }
  console.log("Usage:");
  console.log("  npm run video:engines <workspace> -- --pixelle-handoff --request \"...\"");
  console.log("  npm run video:engines <workspace> -- --run-pixelle --request \"...\"");
  console.log("  npm run video:engines <workspace> -- --import-pixelle-output /path/video.mp4");
  console.log("  npm run video:engines <workspace> -- --compare");
  console.log("  npm run video:engines -- --status");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
