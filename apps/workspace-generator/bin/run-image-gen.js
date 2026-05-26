#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { generateImage, generateVisualBrief, PRESETS } = require("../../../packages/image-workflow/pollinations-adapter");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] || null : null;
}

async function main() {
  const args = process.argv.slice(2);
  const rawWorkspace = args[0];

  if (!rawWorkspace || rawWorkspace === "--help") {
    console.log("Usage:");
    console.log("  npm run image:generate <workspace>                        # auto-brief from visual director output");
    console.log("  npm run image:generate <workspace> -- --prompt <text>     # custom prompt");
    console.log("  npm run image:generate <workspace> -- --preset <name>     # thumbnail|cover|reel|story|square");
    console.log("  npm run image:generate <workspace> -- --model <model>     # flux (default)");
    console.log(`\nPresets: ${Object.keys(PRESETS).join(", ")}`);
    process.exit(0);
  }

  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;

  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const customPrompt = valueAfter(args, "--prompt");
  const preset = valueAfter(args, "--preset") || "thumbnail";
  const model = valueAfter(args, "--model") || undefined;
  const filename = valueAfter(args, "--filename") || undefined;

  console.log(`\nGenerating image for workspace: ${workspace}`);

  try {
    if (customPrompt) {
      console.log(`Preset:  ${preset}`);
      console.log(`Prompt:  ${customPrompt.slice(0, 80)}...`);
      console.log(`\nFetching from Pollinations.ai...`);
      const result = await generateImage(customPrompt, { preset, workspaceRoot, model, filename });
      printResult(result);
    } else {
      console.log("Mode:    auto-brief (thumbnail + cover from visual director output)");
      console.log("\nFetching 2 images from Pollinations.ai...");
      const { thumbnail, cover } = await generateVisualBrief(workspaceRoot, { model });
      console.log("\nThumbnail:");
      printResult(thumbnail);
      console.log("\nCover:");
      printResult(cover);
    }
  } catch (err) {
    console.error(`\nFailed: ${err.message}`);
    process.exit(1);
  }
}

function printResult(r) {
  console.log(`  File:   ${r.outputPath}`);
  console.log(`  Size:   ${(r.sizeBytes / 1024).toFixed(1)} KB`);
  console.log(`  Dims:   ${r.width}x${r.height} (${r.label})`);
  if (r.artifact) console.log(`  Artifact: ${r.artifact.id} (${r.artifact.status})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
