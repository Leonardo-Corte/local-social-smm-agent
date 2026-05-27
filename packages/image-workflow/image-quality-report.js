const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { resolveInside } = require("../workspace-runner/workspace-paths");

const STOP_WORDS = new Set([
  "about", "after", "again", "brand", "business", "event", "events", "from", "have", "into", "more", "their",
  "this", "that", "with", "your", "della", "delle", "degli", "come", "sono", "solo", "alla", "allo", "agli",
  "networking", "people"
]);

function readImageDimensions(buffer) {
  if (buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return {
      format: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return readWebpDimensions(buffer);
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return readJpegDimensions(buffer);
  }
  return { format: "unknown", width: null, height: null };
}

function readWebpDimensions(buffer) {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { format: "webp", width, height };
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { format: "webp", width, height };
  }
  return { format: "webp", width: null, height: null };
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        format: "jpeg",
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += 2 + size;
  }
  return { format: "jpeg", width: null, height: null };
}

function ratioLabel(width, height) {
  if (!width || !height) return "unknown";
  const ratio = width / height;
  const candidates = [
    { label: "1:1", value: 1 },
    { label: "4:5", value: 4 / 5 },
    { label: "9:16", value: 9 / 16 },
    { label: "16:9", value: 16 / 9 }
  ];
  const best = candidates
    .map((candidate) => ({ ...candidate, delta: Math.abs(ratio - candidate.value) }))
    .sort((a, b) => a.delta - b.delta)[0];
  return best.delta < 0.04 ? best.label : `${ratio.toFixed(2)}:1`;
}

function runOptionalOcr(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    return {
      status: "not-run",
      reason: "image path unavailable"
    };
  }
  const result = spawnSync("tesseract", [imagePath, "stdout", "--psm", "6"], {
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.error) {
    return {
      status: "unavailable",
      reason: result.error.code || result.error.message
    };
  }
  if (result.status !== 0) {
    return {
      status: "failed",
      reason: (result.stderr || "tesseract failed").slice(0, 500)
    };
  }
  const text = (result.stdout || "").trim();
  return {
    status: "completed",
    text,
    textLength: text.length,
    likelyLegible: text.length > 0
  };
}

function extractKeywords(text, limit = 18) {
  const counts = new Map();
  for (const token of String(text || "").toLowerCase().match(/[a-z0-9][a-z0-9'-]{3,}/g) || []) {
    const clean = token.replace(/^['-]+|['-]+$/g, "");
    if (clean.length < 4 || STOP_WORDS.has(clean)) continue;
    counts.set(clean, (counts.get(clean) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

function buildBrandFit({ prompt, brandContext, ocrText, relativePath }) {
  const keywords = extractKeywords(brandContext);
  if (keywords.length === 0) {
    return {
      status: "not_configured",
      score: null,
      matchedKeywords: [],
      expectedKeywords: [],
      note: "No business or brand context was provided for brand-fit scoring."
    };
  }
  const haystack = `${prompt || ""}\n${ocrText || ""}\n${relativePath || ""}`.toLowerCase();
  const matchedKeywords = keywords.filter((keyword) => haystack.includes(keyword));
  const score = Math.round((matchedKeywords.length / Math.max(4, Math.min(8, keywords.length))) * 100);
  return {
    status: score >= 60 ? "aligned" : score >= 30 ? "weak_alignment" : "needs_brand_review",
    score: Math.min(100, score),
    matchedKeywords,
    expectedKeywords: keywords.slice(0, 10),
    note: "Heuristic score from business/profile keywords, prompt, optional OCR text, and output filename."
  };
}

function buildImageQualityReport({ buffer, relativePath, prompt, platform, expectedWidth, expectedHeight, imagePath, brandContext }) {
  const dimensions = readImageDimensions(buffer);
  const warnings = [];
  const blockers = [];
  const textRisk = /\b(text|headline|lettering|typography|words|caption|logo)\b/i.test(prompt || "")
    && !/\b(no text|without text|no readable text)\b/i.test(prompt || "");
  const ocr = textRisk ? runOptionalOcr(imagePath) : { status: "not-needed", reason: "prompt does not request baked-in text" };
  const brandFit = buildBrandFit({ prompt, brandContext, ocrText: ocr.text, relativePath });

  if (!dimensions.width || !dimensions.height) {
    warnings.push("Could not read image dimensions.");
  }
  if (dimensions.width && dimensions.width < 1080) {
    warnings.push("Width is below 1080px; may be weak for social crops.");
  }
  if (dimensions.height && dimensions.height < 1080) {
    warnings.push("Height is below 1080px; may be weak for vertical placements.");
  }
  if (expectedWidth && dimensions.width && Number(expectedWidth) !== dimensions.width) {
    warnings.push(`Width ${dimensions.width}px differs from expected ${expectedWidth}px.`);
  }
  if (expectedHeight && dimensions.height && Number(expectedHeight) !== dimensions.height) {
    warnings.push(`Height ${dimensions.height}px differs from expected ${expectedHeight}px.`);
  }
  if (textRisk) {
    warnings.push("Prompt may ask for baked-in text; verify legibility manually before approval.");
  }
  if (textRisk && ocr.status === "unavailable") {
    warnings.push("OCR is not installed; baked-in text needs manual legibility review.");
  }
  if (textRisk && ocr.status === "completed" && !ocr.likelyLegible) {
    warnings.push("OCR did not detect readable text; regenerate with no baked text or add text in the editor.");
  }
  if (brandFit.status === "needs_brand_review") {
    warnings.push("Generated image prompt/output appears weakly connected to the business profile; review brand fit.");
  }
  const aspectRatio = ratioLabel(dimensions.width, dimensions.height);
  const platformFit = platformImageFit({ platform, aspectRatio, width: dimensions.width, height: dimensions.height });
  warnings.push(...platformFit.warnings);
  if (!relativePath) {
    blockers.push("Missing workspace relative path.");
  }

  return {
    generatedAt: new Date().toISOString(),
    relativePath,
    platform: platform || null,
    format: dimensions.format,
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio,
    sizeBytes: buffer.length,
    textRisk,
    ocr,
    brandFit,
    cropSafety: platformFit.cropSafety,
    platformFit: platformFit.fit,
    status: blockers.length ? "blocked" : warnings.length ? "review_with_warnings" : "passed",
    blockers,
    warnings,
    checks: [
      "Dimensions parsed from image bytes when format is PNG, JPEG, or WebP.",
      "Optional local OCR runs through tesseract when baked-in text is requested and the binary is installed.",
      "Brand-fit is scored heuristically from business/profile keywords and must be human-reviewed.",
      "Human approval is still required before publishing."
    ]
  };
}

function platformImageFit({ platform, aspectRatio, width, height }) {
  const warnings = [];
  const platformName = String(platform || "general").toLowerCase();
  const ideal = {
    instagram: ["1:1", "4:5", "9:16"],
    facebook: ["1:1", "4:5", "9:16", "16:9"],
    linkedin: ["1:1", "4:5", "16:9"],
    x: ["1:1", "16:9"],
    reddit: ["1:1", "16:9"]
  }[platformName] || ["1:1", "4:5", "9:16", "16:9"];
  if (aspectRatio !== "unknown" && !ideal.includes(aspectRatio)) {
    warnings.push(`Aspect ratio ${aspectRatio} is not a preferred ${platformName} format (${ideal.join(", ")}).`);
  }
  const cropSafety = {
    topBottomSafeZone: aspectRatio === "9:16" ? "keep key subject away from top/bottom UI zones" : "standard",
    centerSafeCopyArea: aspectRatio === "9:16" || aspectRatio === "4:5",
    minimumRecommendedWidth: 1080,
    minimumRecommendedHeight: aspectRatio === "9:16" ? 1920 : 1080
  };
  if (width && height && aspectRatio === "9:16" && height < 1920) {
    warnings.push("Vertical asset is below 1920px height; upscale or regenerate for cleaner Reels/Stories.");
  }
  return {
    fit: ideal.includes(aspectRatio) ? "preferred" : "usable_with_manual_crop_review",
    cropSafety,
    warnings
  };
}

function writeImageQualityReport({ workspaceRoot, report }) {
  const safeName = path.basename(report.relativePath || "image").replace(/[^a-zA-Z0-9._-]+/g, "-");
  const reportDir = resolveInside(workspaceRoot, "creative", "image-quality");
  fs.mkdirSync(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, `${safeName}.json`);
  const mdPath = path.join(reportDir, `${safeName}.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, imageQualityMarkdown(report));
  return {
    jsonPath,
    mdPath,
    relativeJsonPath: path.relative(workspaceRoot, jsonPath).split(path.sep).join("/"),
    relativeMdPath: path.relative(workspaceRoot, mdPath).split(path.sep).join("/")
  };
}

function imageQualityMarkdown(report) {
  return `# Image Quality Report

Status: ${report.status}

Artifact: \`${report.relativePath}\`

Platform: ${report.platform || "-"}

Dimensions: ${report.width || "unknown"}x${report.height || "unknown"} (${report.aspectRatio})

Format: ${report.format}

Size: ${Math.round(report.sizeBytes / 1024)} KB

Platform fit: ${report.platformFit}

Crop safety: ${report.cropSafety ? JSON.stringify(report.cropSafety) : "-"}

OCR: ${report.ocr ? `${report.ocr.status}${report.ocr.reason ? ` (${report.ocr.reason})` : ""}` : "-"}

Brand fit: ${report.brandFit ? `${report.brandFit.status}${report.brandFit.score === null ? "" : ` (${report.brandFit.score}/100)`}` : "-"}

Matched brand keywords: ${report.brandFit && report.brandFit.matchedKeywords.length ? report.brandFit.matchedKeywords.join(", ") : "-"}

## Blockers
${report.blockers.map((item) => `- ${item}`).join("\n") || "- None."}

## Warnings
${report.warnings.map((item) => `- ${item}`).join("\n") || "- None."}

## Checks
${report.checks.map((item) => `- ${item}`).join("\n")}
`;
}

module.exports = {
  buildBrandFit,
  buildImageQualityReport,
  extractKeywords,
  imageQualityMarkdown,
  platformImageFit,
  readImageDimensions,
  runOptionalOcr,
  writeImageQualityReport
};
