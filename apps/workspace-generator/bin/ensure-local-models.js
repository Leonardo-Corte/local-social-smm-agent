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

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    timeout: options.timeoutMs || 0
  });
}

function hasOllama() {
  const result = run("ollama", ["--version"], { timeoutMs: 3000 });
  return !result.error && result.status === 0;
}

function parseArgs(args) {
  return {
    install: args.includes("--install"),
    text: args.includes("--text"),
    vision: args.includes("--vision") || (!args.includes("--text") && !args.includes("--all")),
    all: args.includes("--all")
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!hasOllama()) {
    console.error("Ollama non trovato. Installa/avvia Ollama prima di scaricare modelli locali.");
    process.exit(1);
  }

  const routing = buildModelRoutingReport(
    readJson("packages/model-router/profiles/model-profiles.json"),
    readJson("packages/model-router/model-catalog.json")
  );
  const models = listOllamaModels();
  const selectedText = chooseOllamaModel(models, null);
  const selectedVision = chooseOllamaVisionModel(models, null);
  const visionInstall = recommendedOllamaVisionInstall({
    platformProfile: routing.profile.id,
    totalMemoryGb: routing.profile.totalMemoryGb
  });
  const desiredText = "qwen2.5:14b";

  const actions = [];
  if ((options.all || options.text) && !selectedText) {
    actions.push({ role: "text", model: desiredText, command: ["ollama", "pull", desiredText] });
  }
  if ((options.all || options.vision) && !selectedVision) {
    actions.push({ role: "vision", model: visionInstall.model, command: ["ollama", "pull", visionInstall.model] });
  }

  console.log(`Profile: ${routing.profile.id} (${routing.profile.totalMemoryGb}GB RAM)`);
  console.log(`Text model: ${selectedText || "missing"}`);
  console.log(`Vision model: ${selectedVision || "missing"}`);

  if (actions.length === 0) {
    console.log("Local model setup already satisfies the requested checks.");
    return;
  }

  console.log("Required actions:");
  for (const action of actions) {
    console.log(`- ${action.role}: ${action.command.join(" ")}`);
  }

  if (!options.install) {
    console.log("\nDry run only. Re-run with --install to pull missing models.");
    return;
  }

  for (const action of actions) {
    console.log(`\nInstalling ${action.role} model: ${action.model}`);
    const result = run(action.command[0], action.command.slice(1), { inherit: true });
    if (result.error || result.status !== 0) {
      console.error(`Install failed for ${action.model}.`);
      process.exit(result.status || 1);
    }
  }
}

main();
