const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { registerArtifact } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");
const { buildImageQualityReport, writeImageQualityReport } = require("./image-quality-report");

const DEFAULT_ENDPOINT = "http://127.0.0.1:8188";
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_POLL_INTERVAL_MS = 1500;
const MAX_IMAGE_BYTES = 80 * 1024 * 1024;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

function nowId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function sha(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 12);
}

function normalizeEndpoint(endpoint = process.env.SMM_COMFYUI_URL || DEFAULT_ENDPOINT) {
  const url = new URL(endpoint);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Unsupported ComfyUI endpoint protocol: ${url.protocol}`);
  }
  const allowRemote = process.env.SMM_ALLOW_REMOTE_COMFYUI === "1";
  if (!allowRemote && !LOCAL_HOSTS.has(url.hostname)) {
    throw new Error(`Remote ComfyUI endpoint blocked by default: ${url.hostname}. Set SMM_ALLOW_REMOTE_COMFYUI=1 only for trusted hosts.`);
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/+$/, "");
}

function endpointUrl(endpoint, route, params = {}) {
  const base = normalizeEndpoint(endpoint);
  const url = new URL(`${base}${route.startsWith("/") ? route : `/${route}`}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

async function requestJson({ endpoint, route, method = "GET", body, timeoutMs = 30000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpointUrl(endpoint, route), {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`ComfyUI ${method} ${route} failed: HTTP ${response.status} ${text.slice(0, 500)}`);
    }
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timeout);
  }
}

async function requestBuffer({ endpoint, route, params, timeoutMs = 60000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpointUrl(endpoint, route, params), { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`ComfyUI file download failed: HTTP ${response.status}`);
    }
    const chunks = [];
    let total = 0;
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_IMAGE_BYTES) {
        throw new Error(`ComfyUI output too large (>${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB)`);
      }
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks);
  } finally {
    clearTimeout(timeout);
  }
}

async function checkComfyUiEndpoint({ endpoint, timeoutMs = 5000 } = {}) {
  try {
    const stats = await requestJson({ endpoint, route: "/system_stats", timeoutMs });
    return { available: true, endpoint: normalizeEndpoint(endpoint), route: "/system_stats", stats };
  } catch (primaryError) {
    try {
      const queue = await requestJson({ endpoint, route: "/queue", timeoutMs });
      return { available: true, endpoint: normalizeEndpoint(endpoint), route: "/queue", queue, warning: primaryError.message };
    } catch (secondaryError) {
      return {
        available: false,
        endpoint: (() => {
          try { return normalizeEndpoint(endpoint); } catch (_error) { return endpoint || DEFAULT_ENDPOINT; }
        })(),
        error: secondaryError.message,
        firstError: primaryError.message
      };
    }
  }
}

function readWorkflowFile(workflowPath) {
  if (!workflowPath) {
    throw new Error("ComfyUI workflow path is required. Export API JSON from ComfyUI and pass --workflow.");
  }
  const absolutePath = path.resolve(workflowPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`ComfyUI workflow file not found: ${absolutePath}`);
  }
  return normalizeWorkflow(JSON.parse(fs.readFileSync(absolutePath, "utf8")));
}

function normalizeWorkflow(input) {
  const workflow = input && input.prompt && looksLikeApiWorkflow(input.prompt) ? input.prompt : input;
  if (!looksLikeApiWorkflow(workflow)) {
    throw new Error("Invalid ComfyUI workflow. Use ComfyUI: Workflow -> Export (API), not the visual UI workflow format.");
  }
  return workflow;
}

function looksLikeApiWorkflow(workflow) {
  return Boolean(
    workflow &&
    typeof workflow === "object" &&
    !Array.isArray(workflow) &&
    Object.values(workflow).some((node) => node && typeof node === "object" && node.class_type && node.inputs)
  );
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyWorkflowOverrides(workflow, {
  prompt,
  negativePrompt,
  width,
  height,
  seed,
  filenamePrefix,
  positiveNode,
  negativeNode
} = {}) {
  const next = cloneJson(workflow);
  const clipNodes = Object.entries(next).filter(([, node]) => node.class_type === "CLIPTextEncode" && node.inputs);

  if (prompt) {
    const target = positiveNode ? next[positiveNode] : clipNodes[0] && clipNodes[0][1];
    if (!target || !target.inputs || typeof target.inputs.text !== "string") {
      throw new Error("Could not find a CLIPTextEncode node for the positive prompt. Pass --positive-node <id>.");
    }
    target.inputs.text = prompt;
  }

  if (negativePrompt) {
    const target = negativeNode ? next[negativeNode] : clipNodes[1] && clipNodes[1][1];
    if (!target || !target.inputs || typeof target.inputs.text !== "string") {
      throw new Error("Could not find a CLIPTextEncode node for the negative prompt. Pass --negative-node <id>.");
    }
    target.inputs.text = negativePrompt;
  }

  const resolvedSeed = seed === "random" ? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) : seed;
  if (resolvedSeed !== undefined && resolvedSeed !== null && resolvedSeed !== "") {
    for (const node of Object.values(next)) {
      if (node && node.inputs && Object.prototype.hasOwnProperty.call(node.inputs, "seed")) {
        node.inputs.seed = Number(resolvedSeed);
      }
    }
  }

  if (width || height) {
    for (const node of Object.values(next)) {
      if (node && node.inputs && node.class_type === "EmptyLatentImage") {
        if (width) node.inputs.width = Number(width);
        if (height) node.inputs.height = Number(height);
      }
    }
  }

  if (filenamePrefix) {
    for (const node of Object.values(next)) {
      if (node && node.inputs && Object.prototype.hasOwnProperty.call(node.inputs, "filename_prefix")) {
        node.inputs.filename_prefix = filenamePrefix;
      }
    }
  }

  return { workflow: next, applied: { prompt: Boolean(prompt), negativePrompt: Boolean(negativePrompt), width, height, seed: resolvedSeed, filenamePrefix } };
}

async function queuePrompt({ endpoint, workflow, clientId, promptId, extraData, timeoutMs = 30000 }) {
  const body = { prompt: normalizeWorkflow(workflow) };
  if (clientId) body.client_id = clientId;
  if (promptId) body.prompt_id = promptId;
  if (extraData) body.extra_data = extraData;
  return requestJson({ endpoint, route: "/prompt", method: "POST", body, timeoutMs });
}

async function getHistory({ endpoint, promptId, timeoutMs = 30000 }) {
  return requestJson({ endpoint, route: `/history/${encodeURIComponent(promptId)}`, timeoutMs });
}

async function waitForHistory({ endpoint, promptId, timeoutMs = DEFAULT_TIMEOUT_MS, pollIntervalMs = DEFAULT_POLL_INTERVAL_MS }) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const history = await getHistory({ endpoint, promptId, timeoutMs: Math.min(30000, timeoutMs) });
      const entry = history[promptId];
      if (entry && entry.outputs) {
        return { history, entry };
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(`Timed out waiting for ComfyUI prompt ${promptId}${lastError ? `: ${lastError.message}` : ""}`);
}

function outputImagesFromHistoryEntry(entry) {
  const images = [];
  for (const [nodeId, output] of Object.entries(entry.outputs || {})) {
    for (const image of output.images || []) {
      images.push({
        nodeId,
        filename: image.filename,
        subfolder: image.subfolder || "",
        type: image.type || "output"
      });
    }
  }
  return images;
}

function safeOutputName(file, index) {
  const ext = path.extname(file.filename || "").toLowerCase() || ".png";
  const base = path.basename(file.filename || `image-${index}${ext}`, ext)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `image-${index}`;
  return `${base}-${sha(`${file.nodeId}|${file.filename}|${file.subfolder}|${index}`)}${ext}`;
}

function readWorkspaceBrandContext(workspaceRoot) {
  const candidates = [
    path.join(workspaceRoot, "business", "business.md"),
    path.join(workspaceRoot, "brief.json"),
    path.join(workspaceRoot, "workspace-manifest.json")
  ];
  return candidates
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => fs.readFileSync(filePath, "utf8").slice(0, 3000))
    .join("\n\n");
}

async function downloadOutputImages({ endpoint, workspaceRoot, promptId, images, sourceRun, metadata = {} }) {
  const outputDir = resolveInside(workspaceRoot, "creative", "images");
  fs.mkdirSync(outputDir, { recursive: true });
  const saved = [];

  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const buffer = await requestBuffer({
      endpoint,
      route: "/view",
      params: {
        filename: image.filename,
        subfolder: image.subfolder,
        type: image.type
      }
    });
    const filename = safeOutputName(image, i);
    const outputPath = resolveInside(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);
    const relativePath = path.relative(workspaceRoot, outputPath).split(path.sep).join("/");
    const quality = buildImageQualityReport({
      buffer,
      relativePath,
      prompt: metadata.prompt,
      platform: metadata.platform,
      expectedWidth: metadata.width,
      expectedHeight: metadata.height,
      imagePath: outputPath,
      brandContext: metadata.brandContext || readWorkspaceBrandContext(workspaceRoot)
    });
    const qualityPaths = writeImageQualityReport({ workspaceRoot, report: quality });
    const artifact = registerArtifact(workspaceRoot, {
      path: relativePath,
      type: "image",
      intent: "comfyui-generated",
      platform: metadata.platform || null,
      sourceRun,
      sourceAgent: "comfyui-api-runner",
      status: "needs_human_review",
      metadata: {
        ...metadata,
        promptId,
        comfyNodeId: image.nodeId,
        comfyFilename: image.filename,
        comfySubfolder: image.subfolder,
        comfyType: image.type,
        sizeBytes: buffer.length,
        qualityStatus: quality.status,
        qualityReport: qualityPaths.relativeMdPath
      }
    });
    saved.push({ ...image, outputPath, relativePath, sizeBytes: buffer.length, quality, qualityPaths, artifact });
  }

  return saved;
}

async function runComfyUiWorkflow({
  workspaceRoot,
  workflowPath,
  workflow,
  endpoint,
  prompt,
  negativePrompt,
  width,
  height,
  seed = "random",
  filenamePrefix,
  positiveNode,
  negativeNode,
  platform,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
  wait = true
}) {
  if (!workspaceRoot) {
    throw new Error("workspaceRoot is required.");
  }
  const sourceWorkflow = workflow ? normalizeWorkflow(workflow) : readWorkflowFile(workflowPath);
  const runId = `comfyui-${nowId()}`;
  const prefix = filenamePrefix || `smm-${runId}`;
  const { workflow: runnableWorkflow, applied } = applyWorkflowOverrides(sourceWorkflow, {
    prompt,
    negativePrompt,
    width,
    height,
    seed,
    filenamePrefix: prefix,
    positiveNode,
    negativeNode
  });
  const health = await checkComfyUiEndpoint({ endpoint, timeoutMs: 5000 });
  if (!health.available) {
    throw new Error(`ComfyUI is not reachable at ${health.endpoint}: ${health.error}`);
  }
  const queued = await queuePrompt({
    endpoint,
    workflow: runnableWorkflow,
    clientId: `local-social-smm-agent-${runId}`,
    timeoutMs: 30000
  });
  const promptId = queued.prompt_id || queued.promptId || queued.number;
  if (!promptId) {
    throw new Error(`ComfyUI did not return a prompt_id: ${JSON.stringify(queued).slice(0, 500)}`);
  }

  const result = {
    runId,
    generatedAt: new Date().toISOString(),
    endpoint: normalizeEndpoint(endpoint),
    status: wait ? "queued" : "queued_no_wait",
    promptId,
    queued,
    health: { available: health.available, route: health.route },
    workflowPath: workflowPath ? path.resolve(workflowPath) : null,
    applied,
    prompt: prompt || null,
    negativePrompt: negativePrompt || null,
    savedOutputs: []
  };

  if (!wait) {
    return result;
  }

  const { entry } = await waitForHistory({ endpoint, promptId, timeoutMs, pollIntervalMs });
  const outputImages = outputImagesFromHistoryEntry(entry);
  const savedOutputs = await downloadOutputImages({
    endpoint,
    workspaceRoot,
    promptId,
    images: outputImages,
    sourceRun: runId,
    metadata: {
      platform,
      prompt: prompt ? prompt.slice(0, 1000) : null,
      negativePrompt: negativePrompt ? negativePrompt.slice(0, 1000) : null,
      width,
      height,
      seed: applied.seed,
      workflowPath: result.workflowPath
    }
  });

  return {
    ...result,
    status: savedOutputs.length > 0 ? "completed_needs_human_review" : "completed_no_images_found",
    historyStatus: entry.status || null,
    outputImageCount: outputImages.length,
    savedOutputs
  };
}

function writeComfyUiRunReport({ workspaceRoot, result }) {
  const runDir = resolveInside(workspaceRoot, "creative", "comfyui-runs", result.runId);
  fs.mkdirSync(runDir, { recursive: true });
  const jsonPath = path.join(runDir, "run.json");
  const mdPath = path.join(runDir, "run.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(mdPath, comfyUiRunMarkdown(result));
  fs.copyFileSync(jsonPath, resolveInside(workspaceRoot, "creative", "comfyui-run-latest.json"));
  fs.copyFileSync(mdPath, resolveInside(workspaceRoot, "creative", "comfyui-run-latest.md"));
  return { runDir, jsonPath, mdPath };
}

function comfyUiRunMarkdown(result) {
  return `# ComfyUI Image Run

Status: ${result.status}

Prompt ID: ${result.promptId}

Human approval required: yes

Automatic publish: disabled

## Outputs
${result.savedOutputs && result.savedOutputs.length
    ? result.savedOutputs.map((item) => `- \`${item.relativePath}\` (${Math.round(item.sizeBytes / 1024)} KB, artifact ${item.artifact.id}, ${item.artifact.status}, QA ${item.quality?.status || "unknown"})`).join("\n")
    : "- No images saved."}

## Quality Reports
${result.savedOutputs && result.savedOutputs.length
    ? result.savedOutputs.map((item) => `- \`${item.qualityPaths?.relativeMdPath || "missing"}\``).join("\n")
    : "- None."}

## Prompt
${result.prompt || "-"}

## Negative Prompt
${result.negativePrompt || "-"}

## Applied Overrides
\`\`\`json
${JSON.stringify(result.applied || {}, null, 2)}
\`\`\`

## Safety
- Draft only.
- Review model/workflow/license metadata before commercial use.
- Approve the artifact manually before export or publishing.
`;
}

module.exports = {
  applyWorkflowOverrides,
  checkComfyUiEndpoint,
  comfyUiRunMarkdown,
  downloadOutputImages,
  getHistory,
  normalizeEndpoint,
  normalizeWorkflow,
  outputImagesFromHistoryEntry,
  queuePrompt,
  readWorkflowFile,
  runComfyUiWorkflow,
  waitForHistory,
  writeComfyUiRunReport
};
