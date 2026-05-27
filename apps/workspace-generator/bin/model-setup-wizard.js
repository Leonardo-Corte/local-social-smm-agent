#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildModelRoutingReport, modelRoutingMarkdown } = require("../../../packages/model-router/detect-profile");
const {
  chooseOllamaModel,
  chooseOllamaVisionModel,
  listOllamaModels,
  recommendedOllamaVisionInstall
} = require("../../../packages/local-runtime/model-client");

const root = path.resolve(__dirname, "../../..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function setupMarkdown(report) {
  const ollama = report.profile.availableBackends.find((backend) => backend.id === "ollama");
  const comfy = report.profile.availableBackends.find((backend) => backend.id === "comfyui");
  const ollamaModels = listOllamaModels();
  const textModel = chooseOllamaModel(ollamaModels, null);
  const visionModel = chooseOllamaVisionModel(ollamaModels, null);
  const visionInstall = recommendedOllamaVisionInstall({
    platformProfile: report.profile.id,
    totalMemoryGb: report.profile.totalMemoryGb
  });
  return `# Local Model Setup Wizard

${modelRoutingMarkdown(report)}

## Recommended Setup
- Text backend: ${ollama && ollama.available ? `Ollama detected${textModel ? `, selected ${textModel}` : ""}` : "Install/start Ollama or configure llama.cpp/MLX."}
- Vision backend: ${visionModel ? `ready with ${visionModel}` : `missing; install with \`${visionInstall.command}\``}
- Image backend: ${comfy && comfy.available ? "ComfyUI detected; use exported API workflow JSON with `npm run comfyui:run`." : "ComfyUI not detected; keep image generation as visual briefs until installed."}
- ComfyUI-Copilot: optional MIT custom node for workflow generation/debugging; install inside ComfyUI only if you want visual workflow assistance.
- Pixelle-Video: optional Apache-2.0 separate video engine candidate; use later as a separate adapter, not as a required core dependency.
- Exact model weights must be chosen after license and hardware checks.

## Recommended Local Pulls For This Machine
\`\`\`bash
${textModel ? `# Text model already available: ${textModel}` : "ollama pull qwen2.5:14b"}
${visionModel ? `# Vision model already available: ${visionModel}` : visionInstall.command}
\`\`\`

## No-Cost Boundary
- This project does not require paid APIs.
- Local model quality depends on machine RAM/VRAM.
- Do not add paid fallback keys to generated workspaces by default.

## Smoke Commands
\`\`\`bash
npm run models:route sample-local-social-team
npm run workflow:run sample-local-social-team -- --execute
npm run comfyui:run sample-local-social-team -- --health
npm run quality:gate sample-local-social-team
\`\`\`
`;
}

function main() {
  const report = buildModelRoutingReport(
    readJson("packages/model-router/profiles/model-profiles.json"),
    readJson("packages/model-router/model-catalog.json")
  );
  const outputDir = path.join(root, "docs/model-routing");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "local-model-setup.md"), setupMarkdown(report));
  fs.writeFileSync(path.join(outputDir, "local-model-setup.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Model setup wizard wrote docs/model-routing/local-model-setup.md for ${report.profile.id}`);
}

main();
