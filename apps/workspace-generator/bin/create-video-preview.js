#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const {
  buildEditRecipe,
  readAnalysis,
  runPreviewEdit,
  writeRecipe
} = require("../../../packages/video-intel/edit-recipe");

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
  if (!workspace) {
    console.error("Usage: npm run video:preview <workspace> -- --analysis assets/analysis/video-reel-intelligence.json");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const analysisArg = valueAfter(args, "--analysis");
  const analysisPath = analysisArg ? path.resolve(workspaceRoot, analysisArg) : null;
  const analysis = readAnalysis(workspaceRoot, analysisPath);
  const recipe = buildEditRecipe({ workspaceRoot, analysis });
  const runResult = args.includes("--recipe-only") ? { ok: false, status: "recipe-only" } : runPreviewEdit(recipe);
  writeRecipe({ recipe, runResult });

  if (!runResult.ok && !args.includes("--recipe-only")) {
    console.error(`Video preview failed. Notes: ${path.relative(root, recipe.output.notesPath)}`);
    process.exit(1);
  }

  console.log(`Video edit recipe ready for ${workspace}`);
  console.log(`Recipe: ${path.relative(root, recipe.output.recipePath)}`);
  console.log(`Notes: ${path.relative(root, recipe.output.notesPath)}`);
  if (runResult.ok) {
    console.log(`Preview: ${path.relative(root, recipe.output.outputPath)}`);
  }
}

main();
