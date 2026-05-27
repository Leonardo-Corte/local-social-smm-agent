const fs = require("fs");
const path = require("path");
const { detectComfyUiInstall } = require("./comfyui-plan");

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function detectComfyUiCopilot({ comfyInstall = null } = {}) {
  const install = comfyInstall || detectComfyUiInstall();
  const candidates = [
    install.root ? path.join(install.root, "custom_nodes", "ComfyUI-Copilot") : null,
    install.root ? path.join(install.root, "custom_nodes", "ComfyUI_Copilot") : null,
    path.join(process.cwd(), "ComfyUI-Copilot"),
    path.join(process.cwd(), "reference", "inspiration-only", "ComfyUI-Copilot")
  ].filter(Boolean);
  const root = candidates.find((candidate) => fs.existsSync(candidate)) || null;
  return {
    root,
    searchedRoots: candidates,
    installed: Boolean(root),
    licensePath: root && fs.existsSync(path.join(root, "LICENSE")) ? path.join(root, "LICENSE") : null,
    requirementsPath: root && fs.existsSync(path.join(root, "requirements.txt")) ? path.join(root, "requirements.txt") : null,
    hasBackend: Boolean(root && fs.existsSync(path.join(root, "backend"))),
    hasUi: Boolean(root && fs.existsSync(path.join(root, "ui"))),
    hasDist: Boolean(root && fs.existsSync(path.join(root, "dist")))
  };
}

function buildWorkspaceHandoff(workspaceRoot) {
  const business = readText(path.join(workspaceRoot, "business/business.md")).slice(0, 2500);
  const visualBriefs = readText(path.join(workspaceRoot, "creative/visual-briefs.md")).slice(0, 2500);
  const imageIntel = readText(path.join(workspaceRoot, "assets/analysis/image-intelligence-latest.md")).slice(0, 2000);
  const promptEngineer = readText(path.join(workspaceRoot, "creative/image-prompt-engineer-latest.md")).slice(0, 2000);
  return [
    "# SMM Workspace -> ComfyUI-Copilot Handoff",
    "",
    "Use this as the brief inside ComfyUI-Copilot. Keep outputs draft-only.",
    "",
    "## Business",
    business || "No business profile available.",
    "",
    "## Visual Briefs",
    visualBriefs || "No visual briefs yet.",
    "",
    "## Latest Image Intelligence",
    imageIntel || "No image intelligence yet.",
    "",
    "## Latest Prompt Engineer Output",
    promptEngineer || "No prompt engineer output yet.",
    "",
    "## Required Workflow",
    "- Produce 1:1, 4:5, and 9:16 variants when possible.",
    "- Avoid baked-in text unless the model/workflow is proven reliable.",
    "- Leave typography/CTA as separate overlay guidance for CapCut/design.",
    "- Return model/license notes and missing-node/model blockers.",
    "- Human approval is required before publishing."
  ].join("\n");
}

function buildInstallPlan(install) {
  if (!install.root) {
    return {
      status: "install-comfyui-first",
      commands: [
        "# Install ComfyUI separately first, then rerun this plan.",
        "# Recommended boundary: keep ComfyUI as a separate local app/service, not vendored into this project."
      ]
    };
  }
  return {
    status: "copilot-install-ready",
    commands: [
      `cd "${path.join(install.root, "custom_nodes")}"`,
      "git clone https://github.com/AIDC-AI/ComfyUI-Copilot.git",
      "cd ComfyUI-Copilot",
      "pip install -r requirements.txt",
      "# Restart ComfyUI, open the Copilot panel, then configure a local/OpenAI-compatible Base URL if available."
    ]
  };
}

function buildComfyUiCopilotPlan(workspaceRoot) {
  const comfyInstall = detectComfyUiInstall();
  const copilot = detectComfyUiCopilot({ comfyInstall });
  const installPlan = buildInstallPlan(comfyInstall);
  const handoffPrompt = buildWorkspaceHandoff(workspaceRoot);
  const status = copilot.installed
    ? "copilot-detected"
    : comfyInstall.root
      ? "comfyui-detected-copilot-missing"
      : "comfyui-missing";

  return {
    generatedAt: new Date().toISOString(),
    sourceRepo: "AIDC-AI/ComfyUI-Copilot",
    sourceUrl: "https://github.com/AIDC-AI/ComfyUI-Copilot",
    license: "MIT",
    status,
    integrationBoundary: "optional local ComfyUI custom node; do not vendor or require for core workspace generation",
    noCostPolicy: "Prefer local/OpenAI-compatible model endpoint. Do not require paid API keys. If Copilot API/service is unavailable, keep using local prompt briefs.",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    comfyInstall,
    copilot,
    installPlan,
    workspaceContracts: [
      "creative/comfyui-plan.json",
      "creative/comfyui-plan.md",
      "creative/image-prompt-engineer-latest.md",
      "creative/visual-briefs.md",
      "assets/analysis/image-intelligence-latest.md"
    ],
    copilotUseCases: [
      {
        id: "workflow-generation",
        value: "Generate a first ComfyUI workflow from the workspace visual brief.",
        acceptance: "Workflow can be imported and run locally without paid-only nodes."
      },
      {
        id: "workflow-debug",
        value: "Debug missing nodes, missing models, invalid parameters, and broken graph edges.",
        acceptance: "Report exact blockers and installation steps without hiding failures."
      },
      {
        id: "workflow-rewrite",
        value: "Rewrite the current workflow for platform variants such as 1:1, 4:5, and 9:16.",
        acceptance: "Variant differences are explicit and crop-safe."
      },
      {
        id: "model-node-recommendations",
        value: "Recommend models, LoRAs, nodes, and parameter ranges for brand-fit visuals.",
        acceptance: "Every recommendation includes license/model-card review reminder."
      }
    ],
    riskControls: [
      "ComfyUI-Copilot API service may be suspended or require user-provided Base URL/API key; keep local fallback.",
      "ComfyUI itself is GPL-3.0; keep it a separate local service/process.",
      "Audit exact checkpoint, LoRA, node, and workflow licenses before commercial/public use.",
      "Do not embed final caption text into generated images unless legibility is verified.",
      "Generated images must enter artifact registry as needs_human_review."
    ],
    handoffPrompt
  };
}

function comfyUiCopilotPlanMarkdown(plan) {
  return `# ComfyUI-Copilot Integration Plan

Status: ${plan.status}

Source repo: ${plan.sourceUrl}

License: ${plan.license}

Boundary: ${plan.integrationBoundary}

Human approval required: yes

Automatic publish: disabled

## Why This Matters

ComfyUI-Copilot is the strongest candidate for the layer where the SMM team asks for a visual asset and the image system builds, debugs, rewrites, and tunes a ComfyUI workflow.

This file is the safe bridge: our workspace stays the marketing brain; ComfyUI-Copilot stays an optional visual workflow assistant.

## Detection

- ComfyUI folder: ${plan.comfyInstall.root || "not found"}
- Copilot folder: ${plan.copilot.root || "not found"}
- Copilot backend folder: ${plan.copilot.hasBackend ? "yes" : "no"}
- Copilot UI folder: ${plan.copilot.hasUi ? "yes" : "no"}

## Install / Setup Commands

\`\`\`bash
${plan.installPlan.commands.join("\n")}
\`\`\`

## Workspace Contracts

${plan.workspaceContracts.map((item) => `- \`${item}\``).join("\n")}

## Use Cases

${plan.copilotUseCases.map((item) => `### ${item.id}
- Value: ${item.value}
- Acceptance: ${item.acceptance}
`).join("\n")}

## Risk Controls

${plan.riskControls.map((item) => `- ${item}`).join("\n")}

## Handoff Prompt

\`\`\`markdown
${plan.handoffPrompt}
\`\`\`
`;
}

module.exports = {
  buildComfyUiCopilotPlan,
  comfyUiCopilotPlanMarkdown,
  detectComfyUiCopilot
};
