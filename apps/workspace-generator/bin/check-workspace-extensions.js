#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

function mustExist(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required extension file: ${path.relative(root, filePath)}`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  const required = [
    "client-report/report.html",
    "creative/comfyui-plan.md",
    "creative/comfyui-plan.json",
    "versions/index.json"
  ];
  for (const relativePath of required) {
    mustExist(path.join(workspaceRoot, relativePath));
  }

  const versions = readJson(path.join(workspaceRoot, "versions/index.json"));
  if (!Array.isArray(versions.snapshots) || versions.snapshots.length === 0) {
    throw new Error("No workspace snapshots found.");
  }

  const persona = readJson(path.join(workspaceRoot, "simulation/persona-report.json"));
  if (!Array.isArray(persona.dialogue) || persona.dialogue.length === 0) {
    throw new Error("Persona dialogue is missing.");
  }

  const imagePlan = readJson(path.join(workspaceRoot, "creative/comfyui-plan.json"));
  if (imagePlan.automaticPublishEnabled !== false || imagePlan.requiredHumanApproval !== true) {
    throw new Error("Image plan safety defaults are invalid.");
  }

  console.log(`OK workspace extensions for ${workspace}`);
}

main();
