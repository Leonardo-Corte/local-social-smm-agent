const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  chooseOllamaVisionModel,
  listOllamaModels,
  recommendedOllamaVisionInstall,
  runOllamaVisionGenerate
} = require("../local-runtime/model-client");
const { buildModelRoutingReport } = require("../model-router/detect-profile");
const {
  IMAGE_EXTENSIONS,
  TEXT_EXTENSIONS,
  VIDEO_EXTENSIONS,
  classifyAssetPath,
  fetchPublicText,
  importLocalAsset
} = require("../workspace-runner/safe-ingestion");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function safeId(value) {
  return String(value || "asset").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "asset";
}

function safeFileName(filePath) {
  const parsed = path.parse(filePath);
  return `${safeId(parsed.name)}${parsed.ext.toLowerCase()}`;
}

function classifyPath(filePath) {
  return classifyAssetPath(filePath);
}

function run(command, args) {
  return spawnSync(command, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
}

function sipsMetadata(filePath) {
  const result = run("sips", ["-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", "-g", "dpiWidth", "-g", "dpiHeight", filePath]);
  if (result.status !== 0) {
    return { available: false, error: (result.stderr || result.stdout || "").trim() };
  }
  const metadata = {};
  for (const line of result.stdout.split(/\r?\n/)) {
    const match = line.match(/^\s*([a-zA-Z]+):\s*(.+)$/);
    if (match) {
      metadata[match[1]] = match[2].trim();
    }
  }
  return {
    available: true,
    width: Number(metadata.pixelWidth) || null,
    height: Number(metadata.pixelHeight) || null,
    format: metadata.format || null,
    dpiWidth: Number(metadata.dpiWidth) || null,
    dpiHeight: Number(metadata.dpiHeight) || null
  };
}

function fileCommand(filePath) {
  const result = run("file", ["-b", filePath]);
  return result.status === 0 ? result.stdout.trim() : "";
}

function imageFitNotes(metadata) {
  const notes = [];
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  if (width && height) {
    const ratio = width / height;
    if (Math.abs(ratio - 1) < 0.08) {
      notes.push("Square image: good candidate for Instagram feed, Facebook post, LinkedIn image, and carousel slide base.");
    } else if (height > width) {
      notes.push("Vertical image: good candidate for Stories/Reels cover, Pinterest-like vertical asset, or mobile-first crop.");
    } else {
      notes.push("Horizontal image: likely needs crop or layout adaptation for Instagram/Reels; can work for LinkedIn/Facebook.");
    }
  }
  notes.push("Do not infer identities, attendance numbers, partnerships, or ticket details from the image alone.");
  notes.push("If the image contains text, verify legibility manually before publishing.");
  return notes;
}

async function tryVisionSummary({ filePath, model, timeoutMs }) {
  const models = listOllamaModels();
  const visionModel = chooseOllamaVisionModel(models, model);
  if (!visionModel) {
    let install = recommendedOllamaVisionInstall();
    try {
      const root = path.resolve(__dirname, "../..");
      const profiles = JSON.parse(fs.readFileSync(path.join(root, "packages/model-router/profiles/model-profiles.json"), "utf8"));
      const catalog = JSON.parse(fs.readFileSync(path.join(root, "packages/model-router/model-catalog.json"), "utf8"));
      const routing = buildModelRoutingReport(profiles, catalog);
      install = recommendedOllamaVisionInstall({
        platformProfile: routing.profile.id,
        totalMemoryGb: routing.profile.totalMemoryGb
      });
    } catch (_error) {
      // Keep the generic fallback if routing files are unavailable.
    }
    return {
      status: "missing-vision-model",
      model: null,
      summary: "",
      recommendedInstall: install,
      notes: [
        "No local Ollama vision model was detected.",
        `Recommended install for this machine: ${install.command}.`,
        `Reason: ${install.reason}.`
      ]
    };
  }
  try {
    const prompt = `Analyze this image for a human-approved social media workspace.

Return:
- visible elements
- possible social content angles
- platform fit for Instagram, Facebook, LinkedIn, X, Reddit
- what must not be claimed without human confirmation

Do not identify private people. Do not invent facts.`;
    const summary = await runOllamaVisionGenerate({
      model: visionModel,
      prompt,
      imagePaths: [filePath],
      timeoutMs
    });
    return {
      status: "completed",
      model: visionModel,
      summary,
      notes: ["Local Ollama vision analysis completed."]
    };
  } catch (error) {
    return {
      status: "failed",
      model: visionModel,
      summary: "",
      notes: [error.message]
    };
  }
}

function imageMarkdown(report) {
  return `# Image Intelligence Report

Generated at: ${report.generatedAt}

Asset: \`${report.asset.relativePath}\`

SHA-256: \`${report.asset.sha256}\`

## Technical Metadata
- Kind: ${report.asset.kind}
- File type: ${report.fileDescription || "-"}
- Format: ${report.metadata.format || "-"}
- Resolution: ${report.metadata.width && report.metadata.height ? `${report.metadata.width}x${report.metadata.height}` : "unknown"}
- DPI: ${report.metadata.dpiWidth && report.metadata.dpiHeight ? `${report.metadata.dpiWidth}x${report.metadata.dpiHeight}` : "-"}

## Visual Analysis
- Status: ${report.vision.status}
- Model: ${report.vision.model || "-"}
${report.vision.notes.map((note) => `- ${note}`).join("\n")}
${report.vision.summary ? `
### Model Summary
${report.vision.summary}
` : ""}

## Platform Fit Notes
${report.fitNotes.map((note) => `- ${note}`).join("\n")}

## Agent Handoff
- \`visual-director\`: use this for crop, composition, thumbnail, and image-generation direction.
- \`copywriter\`: write captions only from observed or human-confirmed facts.
- \`platform-strategist\`: adapt the image differently for Instagram, Facebook, LinkedIn, X, and Reddit.
- \`critic-qa\`: block unsupported claims and weak platform fit.

## Guardrails
- Do not publish automatically.
- Do not identify private people from the image.
- Do not invent event details, attendance, venue claims, guest status, or ticket inclusions.
`;
}

async function analyzeImage({ workspaceRoot, filePath, model = null, timeoutMs = 120000 }) {
  const imported = importLocalAsset({ workspaceRoot, sourcePath: filePath, allowedKinds: ["image"] });
  const destination = imported.destination;
  const metadata = sipsMetadata(destination);
  const report = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    asset: {
      kind: "image",
      absolutePath: destination,
      relativePath: path.relative(workspaceRoot, destination),
      originalPath: imported.absolutePath,
      sha256: imported.sha256
    },
    metadata,
    fileDescription: fileCommand(destination),
    vision: await tryVisionSummary({ filePath: destination, model, timeoutMs }),
    fitNotes: imageFitNotes(metadata)
  };
  return report;
}

function writeImageIntelligence({ workspaceRoot, report }) {
  const analysisDir = path.join(workspaceRoot, "assets/analysis");
  ensureDir(analysisDir);
  const id = safeId(path.parse(report.asset.absolutePath).name);
  const jsonPath = path.join(analysisDir, `${id}-image-intelligence.json`);
  const mdPath = path.join(analysisDir, `${id}-image-intelligence.md`);
  const latestPath = path.join(analysisDir, "image-intelligence-latest.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, imageMarkdown(report));
  fs.writeFileSync(latestPath, imageMarkdown(report));
  return { jsonPath, mdPath, latestPath };
}

function extractUrls(text) {
  return [...String(text || "").matchAll(/\bhttps?:\/\/[^\s<>"')]+/gi)]
    .map((match) => match[0].replace(/[.,;:!?]+$/, ""));
}

function extractFilePaths(text) {
  const matches = [...String(text || "").matchAll(/(?:^|\s)(\/[^\n]+?\.(?:png|jpe?g|webp|gif|heic|heif|tiff|bmp|mp4|mov|m4v|webm|mkv|avi|txt|md|json|csv|pdf|docx|pptx|xlsx))(?:\s|$)/gi)];
  return matches.map((match) => match[1].trim().replace(/^["']|["']$/g, ""));
}

function htmlSignals(html) {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || "";
  const description = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1]
    || /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i.exec(html)?.[1]
    || "";
  const ogTitle = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1] || "";
  const ogDescription = /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1] || "";
  const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 10);
  return {
    title: cleanHtml(ogTitle || title),
    description: cleanHtml(ogDescription || description),
    headings: headings.map(cleanHtml)
  };
}

function cleanHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function riskForUrl(url) {
  const host = new URL(url).hostname.toLowerCase();
  if (/instagram\.com|facebook\.com|x\.com|twitter\.com|linkedin\.com/.test(host)) {
    return "high-manual-review";
  }
  if (/reddit\.com/.test(host)) {
    return "medium-public-community-review";
  }
  return "low-public-page";
}

async function analyzeLink({ workspaceRoot, url }) {
  let result;
  try {
    result = await fetchPublicText(url, { timeoutMs: 10000 });
  } catch (error) {
    if (/Invalid URL|Unsupported URL scheme|embedded credentials|Private|local URL host|too many redirects/i.test(error.message)) {
      throw error;
    }
    result = {
      ok: false,
      status: null,
      finalUrl: url,
      contentType: "",
      text: "",
      error: error.message
    };
  }
  const signals = result.text ? htmlSignals(result.text) : { title: "", description: "", headings: [] };
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    url,
    finalUrl: result.finalUrl,
    ok: result.ok,
    status: result.status,
    contentType: result.contentType,
    risk: riskForUrl(url),
    error: result.error || null,
    signals,
    guardrails: [
      "Use links as context and cite the URL.",
      "Do not bypass login, paywalls, robots, captchas, or private areas.",
      "For social links, treat observations as manual-review context unless an official approved API path exists."
    ]
  };
}

function linkMarkdown(report) {
  return `# Link Intelligence Report

Generated at: ${report.generatedAt}

URL: ${report.url}

Final URL: ${report.finalUrl}

Status: ${report.ok ? "ok" : "failed"} ${report.status || ""}

Risk: ${report.risk}

Content type: ${report.contentType || "-"}

${report.error ? `Error: ${report.error}\n` : ""}
## Signals
- Title: ${report.signals.title || "-"}
- Description: ${report.signals.description || "-"}

## Headings
${report.signals.headings.length > 0 ? report.signals.headings.map((heading) => `- ${heading}`).join("\n") : "- None extracted."}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}

## Agent Handoff
- \`market-researcher\`: use this as cited context only.
- \`platform-strategist\`: adapt output by source/platform risk.
- \`copywriter\`: do not copy source wording too closely; summarize and transform.
- \`critic-qa\`: block unsupported claims.
`;
}

function writeLinkIntelligence({ workspaceRoot, report }) {
  const linkDir = path.join(workspaceRoot, "sources/link-snapshots");
  ensureDir(linkDir);
  const id = safeId(new URL(report.url).hostname + "-" + (report.signals.title || report.url));
  const jsonPath = path.join(linkDir, `${id}.json`);
  const mdPath = path.join(linkDir, `${id}.md`);
  const latestPath = path.join(workspaceRoot, "sources/link-intelligence-latest.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, linkMarkdown(report));
  fs.writeFileSync(latestPath, linkMarkdown(report));
  return { jsonPath, mdPath, latestPath };
}

function ingestTextFile({ workspaceRoot, filePath }) {
  const imported = importLocalAsset({ workspaceRoot, sourcePath: filePath });
  const destination = imported.destination;
  const content = TEXT_EXTENSIONS.has(path.extname(destination).toLowerCase())
    ? fs.readFileSync(destination, "utf8").slice(0, 25000)
    : "";
  return {
    label: path.basename(destination),
    path: destination,
    kind: classifyPath(destination),
    content: `# Attached File Context

Path: ${destination}
Kind: ${classifyPath(destination)}
SHA-256: ${sha256(destination)}
File type: ${fileCommand(destination)}

${content ? `## Content Preview\n\n${content}` : "Content preview unavailable for this file type. Use as an asset reference and ask for human-confirmed details."}
`
  };
}

module.exports = {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  TEXT_EXTENSIONS,
  analyzeImage,
  analyzeLink,
  classifyPath,
  extractFilePaths,
  extractUrls,
  ingestTextFile,
  linkMarkdown,
  writeImageIntelligence,
  writeLinkIntelligence
};
