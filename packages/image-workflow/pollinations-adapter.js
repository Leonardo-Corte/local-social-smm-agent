const fs = require("fs");
const https = require("https");
const path = require("path");
const { registerArtifact } = require("../publishing/artifact-registry");

const POLLINATIONS_HOST = "image.pollinations.ai";
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB safety cap

const PRESETS = {
  thumbnail: { width: 1080, height: 1080, label: "instagram-thumbnail-1x1" },
  cover:     { width: 1080, height: 1920, label: "instagram-cover-9x16" },
  reel:      { width: 1080, height: 1920, label: "reel-cover-9x16" },
  story:     { width: 1080, height: 1920, label: "story-9x16" },
  square:    { width: 1080, height: 1080, label: "square-1x1" }
};

function buildUrl(prompt, { width = 1080, height = 1080, seed, model = "flux", nologo = true } = {}) {
  const encoded = encodeURIComponent(prompt.slice(0, 1500));
  const params = new URLSearchParams({ width, height, nologo, model });
  if (seed != null) params.set("seed", seed);
  return `https://${POLLINATIONS_HOST}/prompt/${encoded}?${params}`;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    if (parsed.hostname !== POLLINATIONS_HOST) {
      return reject(new Error(`SSRF block: only ${POLLINATIONS_HOST} is allowed`));
    }
    https.get(url, { timeout: 60000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return reject(new Error(`Unexpected redirect from ${POLLINATIONS_HOST}`));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${POLLINATIONS_HOST}`));
      }
      const chunks = [];
      let total = 0;
      res.on("data", (chunk) => {
        total += chunk.length;
        if (total > MAX_BYTES) {
          res.destroy();
          reject(new Error(`Response too large (>${MAX_BYTES / 1024 / 1024}MB)`));
        } else {
          chunks.push(chunk);
        }
      });
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject).on("timeout", function () {
      this.destroy();
      reject(new Error("Request timed out after 60s"));
    });
  });
}

async function generateImage(prompt, { preset = "thumbnail", width, height, seed, model, workspaceRoot, filename, saveToDesktop = false } = {}) {
  const presetDef = PRESETS[preset] || PRESETS.thumbnail;
  const w = width || presetDef.width;
  const h = height || presetDef.height;
  const label = presetDef.label;

  const url = buildUrl(prompt, { width: w, height: h, seed, model });
  const imageBuffer = await httpsGet(url);

  const ts = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
  const resolvedFilename = filename || `${label}-${ts}.png`;

  // Always save to workspace
  const outputDir = workspaceRoot ? path.join(workspaceRoot, "creative", "images") : path.join(require("os").homedir(), "Desktop", "smm-images");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, resolvedFilename);
  fs.writeFileSync(outputPath, imageBuffer);

  // Also save to Desktop if requested
  let desktopPath = null;
  if (saveToDesktop) {
    const desktopDir = path.join(require("os").homedir(), "Desktop", "smm-images");
    fs.mkdirSync(desktopDir, { recursive: true });
    desktopPath = path.join(desktopDir, resolvedFilename);
    fs.copyFileSync(outputPath, desktopPath);
  }

  let artifact = null;
  if (workspaceRoot) {
    artifact = registerArtifact(workspaceRoot, {
      path: `creative/images/${resolvedFilename}`,
      type: "image",
      intent: preset,
      platform: "instagram",
      sourceRun: `pollinations-${Date.now()}`,
      sourceAgent: "image-gen",
      status: "needs_human_review",
      metadata: { prompt: prompt.slice(0, 200), width: w, height: h, preset, label, model: model || "flux", url, desktopPath }
    });
  }

  return { outputPath, desktopPath, filename: resolvedFilename, width: w, height: h, preset, label, sizeBytes: imageBuffer.length, artifact };
}

async function generateVisualBrief(workspaceRoot, { model } = {}) {
  const visualBriefPath = path.join(workspaceRoot, "runs");
  let briefText = "";
  if (fs.existsSync(visualBriefPath)) {
    const runs = fs.readdirSync(visualBriefPath)
      .filter((d) => fs.statSync(path.join(visualBriefPath, d)).isDirectory())
      .sort().reverse();
    for (const run of runs) {
      const out = path.join(visualBriefPath, run, "output.md");
      if (fs.existsSync(out)) { briefText = fs.readFileSync(out, "utf8"); break; }
    }
  }

  const stratPath = path.join(workspaceRoot, "strategy", "brand-strategy.md");
  const brandStrategy = fs.existsSync(stratPath) ? fs.readFileSync(stratPath, "utf8").slice(0, 600) : "";

  const basePrompt = buildBasePrompt(briefText, brandStrategy);
  const thumbPrompt = `${basePrompt}, square 1:1 composition, Instagram thumbnail format`;
  const coverPrompt = `${basePrompt}, vertical 9:16 composition, Instagram Reel cover format`;

  const [thumbnail, cover] = await Promise.all([
    generateImage(thumbPrompt, { preset: "thumbnail", workspaceRoot, model }),
    generateImage(coverPrompt, { preset: "cover", workspaceRoot, model })
  ]);

  return { thumbnail, cover };
}

function buildBasePrompt(briefText, brandStrategy) {
  const styleMatch = briefText.match(/\*\*Visual Style[:\*]*\**([\s\S]*?)(?=\n##|\n\*\*|$)/i);
  const toneMatch = briefText.match(/\*\*Tone[:\*]*\**([\s\S]*?)(?=\n-|\n\*\*|$)/i);
  const style = styleMatch ? styleMatch[1].trim().slice(0, 200) : "minimalist, clean, modern";
  const tone = toneMatch ? toneMatch[1].trim().slice(0, 100) : "sharp and professional";

  const brandHint = brandStrategy
    ? brandStrategy.split("\n").find((l) => l.toLowerCase().includes("niche") || l.toLowerCase().includes("audience"))?.trim() || ""
    : "";

  return [
    `Professional social media visual, ${tone} tone`,
    style,
    brandHint,
    "no human faces, no third-party logos, no text overlay",
    "high contrast, photorealistic render, 4K quality"
  ].filter(Boolean).join(", ");
}

module.exports = { generateImage, generateVisualBrief, buildUrl, PRESETS };
