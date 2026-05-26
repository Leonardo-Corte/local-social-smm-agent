const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { auditContentPolicy, policyReportMarkdown } = require("../review-loop/content-policy");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function listOllamaModelsFromApi() {
  const result = spawnSync("curl", ["-s", "--max-time", "2", "http://127.0.0.1:11434/api/tags"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });
  if (result.error || result.status !== 0 || !result.stdout) {
    return [];
  }
  try {
    const payload = JSON.parse(result.stdout);
    return (payload.models || []).map((model) => model.name || model.model).filter(Boolean);
  } catch (_error) {
    return [];
  }
}

function listOllamaModelsFromManifestStore() {
  const home = process.env.HOME || "";
  const libraryRoot = path.join(home, ".ollama/models/manifests/registry.ollama.ai/library");
  if (!fs.existsSync(libraryRoot)) {
    return [];
  }
  const models = [];
  for (const family of fs.readdirSync(libraryRoot)) {
    const familyRoot = path.join(libraryRoot, family);
    if (!fs.statSync(familyRoot).isDirectory()) {
      continue;
    }
    for (const tag of fs.readdirSync(familyRoot)) {
      models.push(`${family}:${tag}`);
    }
  }
  return models;
}

function listOllamaModels() {
  const apiModels = listOllamaModelsFromApi();
  if (apiModels.length > 0) {
    return apiModels;
  }

  const result = spawnSync("ollama", ["list"], {
    encoding: "utf8",
    timeout: 2000,
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.error || result.status !== 0) {
    return listOllamaModelsFromManifestStore();
  }

  return result.stdout
    .split("\n")
    .slice(1)
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean);
}

const VISION_PATTERN = /vision|llava|bakllava|moondream|qwen2\.5vl|qwen2-vl|minicpm/i;
const CODER_PATTERN = /coder|code(?!r)/i;

function filterTextModels(models) {
  return models.filter((model) => !VISION_PATTERN.test(model));
}

function chooseOllamaModel(models, preferredModel) {
  if (preferredModel && models.includes(preferredModel)) {
    return preferredModel;
  }
  const textModels = filterTextModels(models);
  const preferenceHints = ["qwen", "deepseek", "llama", "mistral", "gemma"];
  for (const hint of preferenceHints) {
    const match = textModels.find((model) => model.toLowerCase().includes(hint));
    if (match) {
      return match;
    }
  }
  return textModels[0] || models[0] || null;
}

function chooseOllamaModelForTask(models, taskType, preferredModel) {
  if (preferredModel && models.includes(preferredModel)) {
    return preferredModel;
  }
  const textModels = filterTextModels(models);

  if (["social-copy", "strategy", "persona", "chat", "creative"].includes(taskType)) {
    const nonCoderModels = textModels.filter((model) => !CODER_PATTERN.test(model));
    const pool = nonCoderModels.length > 0 ? nonCoderModels : textModels;
    const preferenceHints = ["qwen2.5:14b", "qwen2.5:", "qwen", "deepseek", "llama", "mistral", "gemma"];
    for (const hint of preferenceHints) {
      const match = pool.find((model) => model.toLowerCase().includes(hint));
      if (match) {
        return match;
      }
    }
    return pool[0] || textModels[0] || models[0] || null;
  }

  if (["coding", "extraction", "structured"].includes(taskType)) {
    const coderModels = textModels.filter((model) => CODER_PATTERN.test(model));
    const pool = coderModels.length > 0 ? coderModels : textModels;
    return pool[0] || models[0] || null;
  }

  return chooseOllamaModel(models, preferredModel);
}

function chooseOllamaVisionModel(models, preferredModel) {
  if (preferredModel && models.includes(preferredModel) && /vision|llava|bakllava|moondream|qwen2\.5vl|qwen2-vl|minicpm/i.test(preferredModel)) {
    return preferredModel;
  }
  const preferenceHints = ["qwen2.5vl:7b", "qwen2.5vl", "qwen2-vl", "llama3.2-vision:11b", "llama3.2-vision", "gemma3", "llava:13b", "llava", "bakllava", "minicpm", "moondream"];
  for (const hint of preferenceHints) {
    const match = models.find((model) => model.toLowerCase().includes(hint));
    if (match) {
      return match;
    }
  }
  return null;
}

function recommendedOllamaVisionInstall({ platformProfile = "unknown", totalMemoryGb = 0 } = {}) {
  if (platformProfile === "apple-silicon-pro" || totalMemoryGb >= 16) {
    return {
      model: "qwen2.5vl:7b",
      command: "ollama pull qwen2.5vl:7b",
      reason: "best default balance for local image understanding on Apple Silicon Pro class hardware"
    };
  }
  return {
    model: "moondream:latest",
    command: "ollama pull moondream",
    reason: "lightweight fallback for machines where larger vision models may be too slow"
  };
}

function buildPromptPacket({ workspaceRoot, agentId, task, inputPaths, targetPath = null, handoffContext = "" }) {
  const agentPath = path.join(workspaceRoot, "agents", `${agentId}.md`);
  if (!fs.existsSync(agentPath)) {
    throw new Error(`Agent file not found: ${agentPath}`);
  }

  const projectBrief = readText(path.join(workspaceRoot, "project-brief.json"));
  const businessProfile = fs.existsSync(path.join(workspaceRoot, "business/business.md"))
    ? readText(path.join(workspaceRoot, "business/business.md"))
    : "";
  const modelRouting = fs.existsSync(path.join(workspaceRoot, "model-routing-report.md"))
    ? readText(path.join(workspaceRoot, "model-routing-report.md"))
    : "";
  const publishingPolicy = fs.existsSync(path.join(workspaceRoot, "policy/publishing-policy.json"))
    ? readText(path.join(workspaceRoot, "policy/publishing-policy.json"))
    : "";

  const inputBlocks = inputPaths.map((inputPath) => {
    const absolutePath = path.resolve(workspaceRoot, inputPath);
    return `## Input: ${inputPath}\n\n${readText(absolutePath)}`;
  });

  return `# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
${readText(agentPath)}

## Project Brief
\`\`\`json
${projectBrief}
\`\`\`

## Business Profile
${businessProfile || "No business profile yet. Infer carefully from the brief and ask only for fact-critical gaps."}

## Model Routing Context
${modelRouting}

## Publishing Policy
\`\`\`json
${publishingPolicy}
\`\`\`

## Task
${task}

## Target Artifact
${targetPath || "No direct write target. Produce recommendations only."}

## Inputs
${inputBlocks.length > 0 ? inputBlocks.join("\n\n") : "No extra input files were provided."}

## Previous Agent Handoffs
${handoffContext || "No previous handoffs for this run."}

## Output Contract
- Be specific to this workspace.
- Clean obvious messy wording from user input yourself; do not ask the human to correct typos when intent is clear.
- Ask proactive follow-up questions only for factual gaps that affect claims, event logistics, pricing, tickets, approvals, or publishing safety.
- Flag assumptions and risks.
- Do not invent product claims, free trials, signups, discounts, testimonials, case studies, or CTAs that are not present in the brief.
- Prefer practical, proof-aware language over aggressive sales language.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- Include a section named "Agent Handoff" with what the next agent should keep, challenge, and verify.
- End with concrete next regeneration or approval steps.
`;
}

async function runOllamaGenerate({ model, prompt, timeoutMs = 180000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Ollama HTTP ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.response || "";
}

async function runOllamaVisionGenerate({ model, prompt, imagePaths = [], timeoutMs = 180000 }) {
  const images = imagePaths.map((imagePath) => fs.readFileSync(imagePath, "base64"));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, images, stream: false }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Ollama vision HTTP ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.response || "";
}

async function runAgentTask({ workspaceRoot, agentId, task, inputPaths = [], dryRun = false, preferredModel = null }) {
  const prompt = buildPromptPacket({ workspaceRoot, agentId, task, inputPaths });
  const runId = `${timestampId()}-${agentId}`;
  const runRoot = path.join(workspaceRoot, "runs", runId);
  writeText(path.join(runRoot, "prompt.md"), prompt);

  const models = listOllamaModels();
  const model = chooseOllamaModel(models, preferredModel);
  const metadata = {
    runId,
    agentId,
    generatedAt: new Date().toISOString(),
    dryRun,
    backend: model && !dryRun ? "ollama" : "prompt-packet",
    model,
    inputPaths
  };

  let output = "No local model execution happened. Review prompt.md and run after installing/starting a local backend.\n";
  if (!dryRun && model) {
    try {
      output = await runOllamaGenerate({ model, prompt });
    } catch (error) {
      metadata.backend = "prompt-packet";
      metadata.error = error.message;
      output = `Local execution failed, so this run was saved as a prompt packet.\n\nError: ${error.message}\n`;
    }
  }

  const contentPolicy = auditContentPolicy(output);
  metadata.contentPolicy = {
    status: contentPolicy.status,
    blockers: contentPolicy.blockers.length,
    warnings: contentPolicy.warnings.length
  };

  writeText(path.join(runRoot, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  writeText(path.join(runRoot, "output.md"), output.endsWith("\n") ? output : `${output}\n`);
  writeText(path.join(runRoot, "content-policy.md"), policyReportMarkdown(contentPolicy));
  return { runRoot, metadata };
}

module.exports = {
  buildPromptPacket,
  chooseOllamaModel,
  chooseOllamaModelForTask,
  chooseOllamaVisionModel,
  recommendedOllamaVisionInstall,
  listOllamaModels,
  listOllamaModelsFromApi,
  listOllamaModelsFromManifestStore,
  runAgentTask,
  runOllamaGenerate,
  runOllamaVisionGenerate
};
