const fs = require("fs");
const path = require("path");
const { registerArtifact } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");
const { detectVideoEngines } = require("./engine-registry");

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function buildPixelleHandoff({ workspaceRoot, request = "" }) {
  const business = readText(path.join(workspaceRoot, "business/business.md")).slice(0, 2500);
  const trends = readText(path.join(workspaceRoot, "research/live-trend-report.md"), readText(path.join(workspaceRoot, "research/trend-report.md"))).slice(0, 2500);
  const reelIntel = readText(path.join(workspaceRoot, "assets/analysis/reel-intelligence-latest.md")).slice(0, 2500);
  const capcut = readText(path.join(workspaceRoot, "creative/capcut-plan.md")).slice(0, 2500);
  return {
    generatedAt: new Date().toISOString(),
    engine: "pixelle-video",
    mode: "handoff-only",
    request,
    constraints: {
      localFirst: true,
      humanApprovalRequired: true,
      automaticPublishEnabled: false,
      preferredAspectRatio: "9:16",
      preferredDurationSeconds: 15,
      outputShouldBeDraft: true
    },
    inputs: {
      business,
      trends,
      reelIntel,
      capcutPlan: capcut
    },
    requiredReturnContract: {
      mp4Path: "absolute or workspace-relative path to generated video",
      metadataPath: "optional path to Pixelle metadata",
      script: "final script used",
      modelNotes: "models/backends used and license notes",
      blockers: "missing models, failed nodes, or manual steps"
    }
  };
}

function pixelleHandoffMarkdown(handoff) {
  return `# Pixelle-Video Handoff

Generated: ${handoff.generatedAt}

Mode: ${handoff.mode}

Request: ${handoff.request || "-"}

## Constraints
${Object.entries(handoff.constraints).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Business
${handoff.inputs.business || "-"}

## Trends
${handoff.inputs.trends || "-"}

## Reel Intelligence
${handoff.inputs.reelIntel || "-"}

## CapCut Plan
${handoff.inputs.capcutPlan || "-"}

## Required Return Contract
${Object.entries(handoff.requiredReturnContract).map(([key, value]) => `- ${key}: ${value}`).join("\n")}
`;
}

function writePixelleHandoff({ workspaceRoot, request }) {
  const handoff = buildPixelleHandoff({ workspaceRoot, request });
  const dir = resolveInside(workspaceRoot, "creative", "video-engines", "pixelle");
  fs.mkdirSync(dir, { recursive: true });
  const jsonPath = path.join(dir, "handoff.json");
  const mdPath = path.join(dir, "handoff.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(handoff, null, 2)}\n`);
  fs.writeFileSync(mdPath, pixelleHandoffMarkdown(handoff));
  return { handoff, jsonPath, mdPath };
}

function normalizeLocalServiceUrl(rawUrl = process.env.SMM_PIXELLE_URL) {
  if (!rawUrl) {
    return null;
  }
  const url = new URL(rawUrl);
  if (!["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname) && process.env.SMM_ALLOW_REMOTE_PIXELLE !== "1") {
    throw new Error(`Remote Pixelle service blocked by default: ${url.hostname}`);
  }
  return url.toString().replace(/\/+$/, "");
}

async function runPixelleServiceJob({ workspaceRoot, request, endpoint = process.env.SMM_PIXELLE_URL, route = process.env.SMM_PIXELLE_GENERATE_PATH || "/generate", timeoutMs = 15 * 60 * 1000 }) {
  const serviceUrl = normalizeLocalServiceUrl(endpoint);
  if (!serviceUrl) {
    return {
      status: "service-not-configured",
      message: "Set SMM_PIXELLE_URL=http://127.0.0.1:<port> to enable direct Pixelle service execution.",
      handoff: writePixelleHandoff({ workspaceRoot, request })
    };
  }
  const handoff = writePixelleHandoff({ workspaceRoot, request });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${serviceUrl}${route.startsWith("/") ? route : `/${route}`}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(handoff.handoff),
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Pixelle service failed: HTTP ${response.status} ${text.slice(0, 500)}`);
    }
    const parsed = text ? JSON.parse(text) : {};
    const mp4Path = parsed.mp4Path || parsed.outputPath || parsed.videoPath || null;
    const imported = mp4Path ? importPixelleOutput({
      workspaceRoot,
      mp4Path,
      metadataPath: parsed.metadataPath || null,
      sourceRun: parsed.runId || `pixelle-service-${Date.now()}`
    }) : null;
    return {
      status: imported ? "completed_needs_human_review" : "completed_no_mp4_returned",
      serviceUrl,
      route,
      response: parsed,
      handoff,
      imported
    };
  } finally {
    clearTimeout(timeout);
  }
}

function importPixelleOutput({ workspaceRoot, mp4Path, metadataPath = null, sourceRun = `pixelle-${Date.now()}` }) {
  if (!mp4Path) {
    throw new Error("Pixelle output mp4 path is required.");
  }
  const absolute = path.isAbsolute(mp4Path) ? mp4Path : path.join(workspaceRoot, mp4Path);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Pixelle output not found: ${absolute}`);
  }
  const outDir = resolveInside(workspaceRoot, "creative", "videos");
  fs.mkdirSync(outDir, { recursive: true });
  const filename = `pixelle-${path.basename(absolute).replace(/[^a-zA-Z0-9._-]+/g, "-")}`;
  const outputPath = path.join(outDir, filename);
  fs.copyFileSync(absolute, outputPath);
  const relativePath = path.relative(workspaceRoot, outputPath).split(path.sep).join("/");
  const artifact = registerArtifact(workspaceRoot, {
    path: relativePath,
    type: "video",
    intent: "pixelle-generated-video",
    platform: "instagram",
    sourceRun,
    sourceAgent: "pixelle-video-adapter",
    status: "needs_human_review",
    metadata: {
      originalPath: absolute,
      metadataPath,
      engine: "pixelle-video",
      automaticPublishEnabled: false
    }
  });
  return { outputPath, relativePath, artifact };
}

function pixelleStatus() {
  const registry = detectVideoEngines();
  return registry.engines.find((engine) => engine.id === "pixelle-video");
}

module.exports = {
  buildPixelleHandoff,
  importPixelleOutput,
  pixelleHandoffMarkdown,
  pixelleStatus,
  runPixelleServiceJob,
  writePixelleHandoff
};
