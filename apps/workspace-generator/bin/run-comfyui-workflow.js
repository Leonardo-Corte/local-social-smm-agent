#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PRESETS } = require("../../../packages/image-workflow/pollinations-adapter");
const {
  checkComfyUiEndpoint,
  runComfyUiWorkflow,
  writeComfyUiRunReport
} = require("../../../packages/image-workflow/comfyui-api-client");
const { assertSafeWorkspaceSlug, workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] || null;
}

function hasFlag(args, flag) {
  return args.includes(flag);
}

function printHelp() {
  console.log(`Usage:
  npm run comfyui:run <workspace> -- --workflow /path/to/api-workflow.json --prompt "visual prompt"
  npm run comfyui:run <workspace> -- --workflow /path/to/api-workflow.json --prompt "..." --preset reel
  npm run comfyui:run <workspace> -- --health

Options:
  --workflow <path>        ComfyUI API workflow JSON. Can also use SMM_COMFYUI_WORKFLOW.
  --endpoint <url>         Default: SMM_COMFYUI_URL or http://127.0.0.1:8188.
  --prompt <text>          Positive prompt override.
  --negative <text>        Negative prompt override.
  --positive-node <id>     Explicit CLIPTextEncode node for positive prompt.
  --negative-node <id>     Explicit CLIPTextEncode node for negative prompt.
  --preset <name>          ${Object.keys(PRESETS).join("|")}; controls width/height override.
  --width <px>             Explicit width override.
  --height <px>            Explicit height override.
  --seed <number|random>   Default: random.
  --prefix <text>          SaveImage filename_prefix override.
  --platform <name>        Artifact platform metadata.
  --timeout-ms <ms>        Default: 600000.
  --no-wait               Queue only; do not wait/download.
`);
}

async function main() {
  const args = process.argv.slice(2);
  const rawWorkspace = args[0];
  if (!rawWorkspace || rawWorkspace === "--help" || hasFlag(args, "--help")) {
    printHelp();
    process.exit(rawWorkspace ? 0 : 1);
  }

  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(path.join(workspaceRoot, "workspace-manifest.json"))) {
    throw new Error(`Missing workspace: ${workspaceRoot}`);
  }

  const endpoint = valueAfter(args, "--endpoint") || process.env.SMM_COMFYUI_URL || undefined;
  if (hasFlag(args, "--health")) {
    const health = await checkComfyUiEndpoint({ endpoint });
    console.log(JSON.stringify(health, null, 2));
    process.exit(health.available ? 0 : 2);
  }

  const preset = valueAfter(args, "--preset");
  const presetDef = preset ? PRESETS[preset] : null;
  if (preset && !presetDef) {
    throw new Error(`Unknown preset: ${preset}. Valid presets: ${Object.keys(PRESETS).join(", ")}`);
  }

  const workflowPath = valueAfter(args, "--workflow") || process.env.SMM_COMFYUI_WORKFLOW;
  const result = await runComfyUiWorkflow({
    workspaceRoot,
    workflowPath,
    endpoint,
    prompt: valueAfter(args, "--prompt"),
    negativePrompt: valueAfter(args, "--negative"),
    positiveNode: valueAfter(args, "--positive-node"),
    negativeNode: valueAfter(args, "--negative-node"),
    width: valueAfter(args, "--width") || (presetDef && presetDef.width),
    height: valueAfter(args, "--height") || (presetDef && presetDef.height),
    seed: valueAfter(args, "--seed") || "random",
    filenamePrefix: valueAfter(args, "--prefix"),
    platform: valueAfter(args, "--platform"),
    timeoutMs: Number(valueAfter(args, "--timeout-ms") || 600000),
    wait: !hasFlag(args, "--no-wait")
  });
  const report = writeComfyUiRunReport({ workspaceRoot, result });

  console.log(`ComfyUI run: ${result.status}`);
  console.log(`Prompt ID: ${result.promptId}`);
  console.log(`Report: ${path.relative(root, report.mdPath)}`);
  if (result.savedOutputs.length > 0) {
    console.log("Images:");
    for (const item of result.savedOutputs) {
      console.log(`- ${path.relative(root, item.outputPath)} (${item.artifact.status})`);
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
