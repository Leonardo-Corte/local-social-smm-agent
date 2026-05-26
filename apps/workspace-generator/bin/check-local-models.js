#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { buildModelRoutingReport } = require("../../../packages/model-router/detect-profile");
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

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: 3000,
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: !result.error && result.status === 0,
    status: result.status,
    error: result.error ? result.error.code || result.error.message : null,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function classifyModel(modelName) {
  const lower = modelName.toLowerCase();
  let role = "general";
  if (lower.includes("qwen") || lower.includes("deepseek") || lower.includes("llama") || lower.includes("mistral")) {
    role = "strong-candidate";
  }
  if (lower.includes("3b") || lower.includes("1.5b") || lower.includes("mini")) {
    role = "fast-candidate";
  }
  if (/vision|llava|bakllava|moondream|qwen2\.5vl|qwen2-vl|minicpm|gemma3/i.test(lower)) {
    role = "vision-candidate";
  }
  return {
    name: modelName,
    role,
    licensePosture: "audit exact model license before client/commercial use"
  };
}

function markdown(report) {
  return `# Local Model Readiness Report

Generated at: ${report.generatedAt}

Profile: ${report.modelRouting.profile.label}

## Backend Status
${report.modelRouting.profile.availableBackends.map((backend) => `- ${backend.label}: ${backend.available ? `available (${backend.command})` : "missing"}`).join("\n")}

## Ollama
- CLI available: ${report.ollama.cli.ok ? "yes" : "no"}
- Models found: ${report.ollama.models.length}
- Selected default: ${report.ollama.selectedModel || "none"}
- Selected vision: ${report.ollama.selectedVisionModel || "none"}
- Recommended vision install: ${report.ollama.recommendedVisionInstall.command}

${report.ollama.models.length > 0 ? report.ollama.models.map((model) => `### ${model.name}
- Role: ${model.role}
- License: ${model.licensePosture}
`).join("\n") : "No Ollama models were found. Install/pull a local model before running workflow execution."}

## Next Actions
${report.nextActions.map((item) => `- ${item}`).join("\n")}
`;
}

function main() {
  const modelRouting = buildModelRoutingReport(
    readJson("packages/model-router/profiles/model-profiles.json"),
    readJson("packages/model-router/model-catalog.json")
  );
  const ollamaCli = run("ollama", ["--version"]);
  const ollamaModels = listOllamaModels();
  const selectedModel = chooseOllamaModel(ollamaModels, null);
  const selectedVisionModel = chooseOllamaVisionModel(ollamaModels, null);
  const recommendedVisionInstall = recommendedOllamaVisionInstall({
    platformProfile: modelRouting.profile.id,
    totalMemoryGb: modelRouting.profile.totalMemoryGb
  });
  const report = {
    generatedAt: new Date().toISOString(),
    modelRouting,
    ollama: {
      cli: ollamaCli,
      models: ollamaModels.map(classifyModel),
      selectedModel,
      selectedVisionModel,
      recommendedVisionInstall
    },
    nextActions: [
      selectedModel
        ? `Run npm run workflow:run sample-local-social-team -- --execute --model ${selectedModel}`
        : "Install or pull at least one Ollama model, then rerun npm run models:check.",
      selectedVisionModel
        ? `Vision ingestion is ready with ${selectedVisionModel}.`
        : `Install local image understanding with: ${recommendedVisionInstall.command}`,
      "Run npm run quality:gate after real model execution.",
      "Snapshot the workspace after reviewing real outputs."
    ]
  };

  const outputDir = path.join(root, "docs/model-routing");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "local-model-readiness.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "local-model-readiness.md"), markdown(report));
  console.log(`Local model readiness: ${ollamaModels.length} Ollama model(s), selected ${selectedModel || "none"}`);
}

main();
