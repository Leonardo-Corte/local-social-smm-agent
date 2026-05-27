#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  buildComfyUiCopilotPlan,
  comfyUiCopilotPlanMarkdown
} = require("../../../packages/image-workflow/comfyui-copilot-plan");

const root = path.resolve(__dirname, "../../..");

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const plan = buildComfyUiCopilotPlan(workspaceRoot);
  fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "creative/comfyui-copilot-plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "creative/comfyui-copilot-plan.md"), comfyUiCopilotPlanMarkdown(plan));
  console.log(`ComfyUI-Copilot plan ready for ${workspace}: ${plan.status}`);
}

main();
