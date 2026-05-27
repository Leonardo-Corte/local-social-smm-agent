const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { registerArtifact } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");

const EXPORTS = {
  "instagram-4x5": { width: 1080, height: 1350, platform: "instagram", label: "Instagram 4:5" },
  "instagram-square": { width: 1080, height: 1080, platform: "instagram", label: "Instagram 1:1" },
  "x-card": { width: 1600, height: 900, platform: "x", label: "X 16:9" },
  "reddit-card": { width: 1200, height: 675, platform: "reddit", label: "Reddit 16:9" }
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function slugify(value) {
  return String(value || "static-post")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "static-post";
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxChars, maxLines = 4) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function normalizeCopy(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function detectMimeFromBuffer(buffer, filePath = "") {
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a
  ) return "image/png";
  if (buffer.length >= 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (buffer.slice(0, 256).toString("utf8").trimStart().startsWith("<svg")) return "image/svg+xml";
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "image/png";
}

function fileDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  const mime = detectMimeFromBuffer(buffer, filePath);
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function inferProjectName({ businessContext, launchPackage }) {
  const text = `${businessContext || ""}\n${launchPackage?.angle?.promise || ""}\n${launchPackage?.prompt || ""}`;
  if (/killsiri/i.test(text)) return "KILLSIRI";
  if (/\bgigi\b/i.test(text)) return "GIGI";
  const match = text.match(/Project:\s*([^\n]+)/i);
  return match ? match[1].trim().slice(0, 30).toUpperCase() : "LAUNCH";
}

function buildManifest({ workspaceRoot, launchPackagePath = null, request = "" }) {
  const resolvedLaunchPath = launchPackagePath
    ? path.resolve(launchPackagePath)
    : resolveInside(workspaceRoot, "creative", "launch-package-latest.json");
  const launchPackage = readJson(resolvedLaunchPath, {});
  const businessContext = readText(resolveInside(workspaceRoot, "business", "business.md"), "");
  const project = inferProjectName({ businessContext, launchPackage });
  const headline = launchPackage?.headlines?.[0] || (project === "KILLSIRI" ? "SIRI WAITS. GIGI ACTS." : "SHOW THE OUTCOME.");
  const defaultSubheadline = project === "KILLSIRI"
    ? "Voice commands that actually execute developer workflows."
    : "A platform-native launch asset built from business context.";
  const rawSubheadline = launchPackage?.angle?.promise || "";
  const subheadline = rawSubheadline && normalizeCopy(rawSubheadline) !== normalizeCopy(headline)
    ? rawSubheadline
    : defaultSubheadline;
  const cta = project === "KILLSIRI" ? "Follow the build on GitHub" : "Review, approve, then publish";
  const imageRelativePath = launchPackage?.image || null;
  const imagePath = imageRelativePath ? resolveInside(workspaceRoot, imageRelativePath) : null;
  const backgroundSafeStatuses = new Set(["background_only", "usable_as_background_only", "needs_design_pass", "usable_after_human_review"]);
  const sourceImage = imagePath && fs.existsSync(imagePath) ? {
    relativePath: imageRelativePath,
    absolutePath: imagePath,
    usage: backgroundSafeStatuses.has(launchPackage?.status) ? "background_only" : "reference_only"
  } : null;

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    request,
    project,
    family: "launch-manifesto",
    sourceLaunchPackage: path.relative(workspaceRoot, resolvedLaunchPath).split(path.sep).join("/"),
    sourceImage,
    copy: {
      eyebrow: project,
      headline,
      subheadline,
      proofLine: project === "KILLSIRI"
        ? "Voice -> tools -> workflows -> verified outcomes"
        : "Built from business context, platform rules, and human approval.",
      cta
    },
    tokens: {
      colors: {
        background: "#050506",
        panel: "#0d0f12",
        text: "#f6f4ef",
        muted: "#a8b0b8",
        red: "#ff174f",
        cyan: "#00d8ff",
        green: "#00ff85",
        border: "#2a2f35"
      },
      fonts: {
        display: "Arial Black, Impact, Helvetica, Arial, sans-serif",
        body: "Inter, Helvetica, Arial, sans-serif",
        mono: "SFMono-Regular, Menlo, Consolas, monospace"
      }
    },
    exports: EXPORTS,
    approval: {
      status: "needs_human_review",
      blockers: [
        "Confirm final CTA/link before publishing.",
        "Human must approve visual tone and any competitor/Siri reference.",
        "Do not claim full Siri replacement unless product capabilities are verified."
      ]
    }
  };
}

function backgroundLayer({ manifest, width, height }) {
  const colors = manifest.tokens.colors;
  const imageUri = manifest.sourceImage?.usage === "background_only" ? fileDataUri(manifest.sourceImage.absolutePath) : null;
  const gridStep = Math.round(width / 20);
  const defs = `
  <defs>
    <filter id="background-soften">
      <feGaussianBlur stdDeviation="3"/>
      <feColorMatrix type="saturate" values="0.55"/>
    </filter>
    <pattern id="grid" width="${gridStep}" height="${gridStep}" patternUnits="userSpaceOnUse">
      <path d="M ${gridStep} 0 L 0 0 0 ${gridStep}" fill="none" stroke="${colors.border}" stroke-width="1" opacity="0.34"/>
    </pattern>
  </defs>`;
  const image = imageUri ? `
  <image href="${imageUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="0.22" filter="url(#background-soften)"/>
  <rect width="${width}" height="${height}" fill="${colors.background}" opacity="0.72"/>` : `
  <rect width="${width}" height="${height}" fill="${colors.background}"/>
  <path d="M0 ${height * 0.24} C ${width * 0.22} ${height * 0.12}, ${width * 0.46} ${height * 0.34}, ${width} ${height * 0.18}" fill="none" stroke="${colors.cyan}" stroke-width="${Math.max(3, width * 0.004)}" opacity="0.55"/>
  <path d="M0 ${height * 0.64} C ${width * 0.18} ${height * 0.48}, ${width * 0.58} ${height * 0.82}, ${width} ${height * 0.58}" fill="none" stroke="${colors.red}" stroke-width="${Math.max(3, width * 0.004)}" opacity="0.58"/>`;
  return `${defs}
${image}
  <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.42"/>
  <rect x="${width * 0.035}" y="${height * 0.035}" width="${width * 0.93}" height="${height * 0.93}" rx="${Math.max(14, width * 0.02)}" fill="none" stroke="${colors.border}" stroke-width="${Math.max(2, width * 0.002)}"/>`;
}

function textBlock({ x, y, lines, size, lineHeight, color, fontFamily, weight = "800", letterSpacing = "0" }) {
  return lines.map((line, index) => {
    return `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-family="${fontFamily}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${escapeXml(line)}</text>`;
  }).join("\n");
}

function terminalPanel({ manifest, x, y, width, height }) {
  const colors = manifest.tokens.colors;
  const mono = manifest.tokens.fonts.mono;
  const rows = [
    "$ gigi listen",
    "intent: book, browse, call, verify",
    "$ gigi execute workflow",
    "status: done, with receipt"
  ];
  const rowSize = Math.max(22, Math.round(width * 0.038));
  return `
  <g>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${Math.max(12, width * 0.03)}" fill="${colors.panel}" opacity="0.88" stroke="${colors.border}" stroke-width="2"/>
    <circle cx="${x + 28}" cy="${y + 26}" r="7" fill="${colors.red}"/>
    <circle cx="${x + 52}" cy="${y + 26}" r="7" fill="${colors.green}"/>
    <circle cx="${x + 76}" cy="${y + 26}" r="7" fill="${colors.cyan}"/>
    ${rows.map((row, index) => `<text x="${x + 28}" y="${y + 78 + index * rowSize * 1.45}" fill="${index % 2 === 0 ? colors.green : colors.muted}" font-family="${mono}" font-size="${rowSize}" font-weight="700">${escapeXml(row)}</text>`).join("\n")}
  </g>`;
}

function ctaBlock({ manifest, x, y, width, subSize, isWide }) {
  const colors = manifest.tokens.colors;
  const body = manifest.tokens.fonts.body;
  const ctaSize = Math.round(subSize * 0.84);
  const ctaLines = wrapText(manifest.copy.cta, isWide ? 34 : 26, 2);
  const lineHeight = Math.round(ctaSize * 1.24);
  const paddingX = Math.round(subSize * 0.82);
  const paddingY = Math.round(subSize * 0.58);
  const buttonHeight = paddingY * 2 + lineHeight * ctaLines.length;
  const buttonWidth = Math.min(width, Math.round((isWide ? 0.62 : 0.84) * width + paddingX * 2));
  return `
  <g data-copy-cta="${escapeXml(manifest.copy.cta)}">
    <rect x="${x}" y="${y}" width="${buttonWidth}" height="${buttonHeight}" rx="${Math.round(subSize * 0.65)}" fill="${colors.red}" opacity="0.96"/>
    ${ctaLines.map((line, index) => `<text x="${x + paddingX}" y="${y + paddingY + ctaSize + index * lineHeight}" fill="${colors.text}" font-family="${body}" font-size="${ctaSize}" font-weight="900">${escapeXml(line)}</text>`).join("\n")}
  </g>`;
}

function convertSvgToPng(svgPath) {
  const pngPath = svgPath.replace(/\.svg$/i, ".png");
  const result = spawnSync("sips", ["-s", "format", "png", svgPath, "--out", pngPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  if (result.error && result.error.code === "ENOENT") {
    return {
      status: "skipped",
      reason: "macOS sips command not available",
      outputPath: null
    };
  }
  if (result.error) {
    return {
      status: "failed",
      reason: result.error.message,
      outputPath: null
    };
  }
  if (result.status !== 0 || !fs.existsSync(pngPath)) {
    return {
      status: "failed",
      reason: (result.stderr || result.stdout || "sips did not create output").trim(),
      outputPath: null
    };
  }
  return {
    status: "created",
    reason: null,
    outputPath: pngPath
  };
}

function conversionRelativePath(workspaceRoot, conversion) {
  return conversion?.outputPath
    ? path.relative(workspaceRoot, conversion.outputPath).split(path.sep).join("/")
    : null;
}

function renderSvg({ manifest, exportId }) {
  const exportDef = manifest.exports[exportId];
  if (!exportDef) throw new Error(`Unknown static export: ${exportId}`);
  const { width, height } = exportDef;
  const colors = manifest.tokens.colors;
  const display = manifest.tokens.fonts.display;
  const body = manifest.tokens.fonts.body;
  const isWide = width / height > 1.3;
  const margin = Math.round(width * 0.075);
  const headlineSize = isWide ? Math.round(width * 0.064) : Math.round(width * 0.082);
  const subSize = isWide ? Math.round(width * 0.025) : Math.round(width * 0.038);
  const eyebrowSize = isWide ? Math.round(width * 0.024) : Math.round(width * 0.034);
  const maxHeadlineChars = isWide ? 27 : 16;
  const headlineLines = wrapText(manifest.copy.headline, maxHeadlineChars, 4);
  const subLines = wrapText(manifest.copy.subheadline, isWide ? 58 : 34, 2);
  const proofLines = wrapText(manifest.copy.proofLine, isWide ? 62 : 34, 2);
  const panelWidth = isWide ? Math.round(width * 0.38) : Math.round(width * 0.78);
  const panelHeight = isWide ? Math.round(height * 0.36) : Math.round(height * 0.24);
  const panelX = isWide ? Math.round(width * 0.56) : margin;
  const panelY = isWide ? Math.round(height * 0.34) : Math.round(height * 0.62);
  const headlineY = isWide ? Math.round(height * 0.28) : Math.round(height * 0.23);
  const proofY = isWide ? Math.round(height * 0.53) : Math.round(height * 0.47);
  const ctaY = Math.round(height - margin * 1.52);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(manifest.copy.headline)}">
${backgroundLayer({ manifest, width, height })}
  <text x="${margin}" y="${Math.round(height * 0.105)}" fill="${colors.red}" font-family="${body}" font-size="${eyebrowSize}" font-weight="900" letter-spacing="0">${escapeXml(manifest.copy.eyebrow)}</text>
  ${textBlock({
    x: margin,
    y: headlineY,
    lines: headlineLines,
    size: headlineSize,
    lineHeight: Math.round(headlineSize * 1.02),
    color: colors.text,
    fontFamily: display,
    weight: "900"
  })}
  ${textBlock({
    x: margin,
    y: headlineY + headlineLines.length * Math.round(headlineSize * 1.02) + Math.round(subSize * 1.05),
    lines: subLines,
    size: subSize,
    lineHeight: Math.round(subSize * 1.25),
    color: colors.muted,
    fontFamily: body,
    weight: "700"
  })}
  <g transform="translate(${margin}, ${proofY})">
    <path d="M 0 28 C 42 2, 76 54, 118 28 S 194 2, 236 28 S 312 54, 354 28" fill="none" stroke="${colors.cyan}" stroke-width="${Math.max(5, width * 0.006)}" stroke-linecap="round"/>
    <text x="0" y="${Math.round(subSize * 3.05)}" fill="${colors.green}" font-family="${manifest.tokens.fonts.mono}" font-size="${Math.round(subSize * 0.78)}" font-weight="800">${escapeXml(proofLines.join(" "))}</text>
  </g>
  ${terminalPanel({ manifest, x: panelX, y: panelY, width: panelWidth, height: panelHeight })}
  ${ctaBlock({ manifest, x: margin, y: ctaY, width: width - margin * 2, subSize, isWide })}
</svg>`;
}

function staticQualityReport({ manifest, rendered }) {
  const reports = {};
  for (const item of rendered) {
    const exportDef = manifest.exports[item.exportId];
    const svg = fs.readFileSync(item.outputPath, "utf8");
    const blockers = [];
    const warnings = [];
    if (!svg.includes(escapeXml(manifest.copy.headline))) blockers.push("Headline missing from rendered SVG.");
    if (!svg.includes(escapeXml(manifest.copy.cta))) blockers.push("CTA missing from rendered SVG.");
    if (normalizeCopy(manifest.copy.subheadline) === normalizeCopy(manifest.copy.headline)) blockers.push("Subheadline duplicates headline; add a second layer of information.");
    if (exportDef.width < 1080 && ["instagram", "reddit"].includes(exportDef.platform)) warnings.push("Width below common social minimum.");
    if (exportDef.platform === "instagram" && exportDef.height < 1080) warnings.push("Instagram export height below 1080.");
    reports[item.exportId] = {
      platform: exportDef.platform,
      width: exportDef.width,
      height: exportDef.height,
      status: blockers.length ? "blocked" : warnings.length ? "review_with_warnings" : "ready_for_human_review",
      blockers,
      warnings,
      output: item.relativePath,
      pngOutput: conversionRelativePath(item.workspaceRoot, item.png),
      pngStatus: item.png?.status || "not_requested",
      pngReason: item.png?.reason || null
    };
  }
  return {
    generatedAt: new Date().toISOString(),
    family: manifest.family,
    headline: manifest.copy.headline,
    exports: reports,
    checks: [
      "Text is deterministic SVG text, not generated inside the background image.",
      "Every export is still draft-only and requires human approval.",
      "PNG bitmap exports are generated when the local converter is available."
    ]
  };
}

function qualityMarkdown(report) {
  const rows = Object.entries(report.exports).map(([id, item]) => {
    return `| ${id} | ${item.platform} | ${item.width}x${item.height} | ${item.status} | ${item.output} | ${item.pngOutput || item.pngStatus} |`;
  });
  return `# Static Render Quality Report

Generated: ${report.generatedAt}

Family: ${report.family}

Headline: ${report.headline}

| Export | Platform | Size | Status | SVG Output | PNG Output |
| --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Checks
${report.checks.map((item) => `- ${item}`).join("\n")}
`;
}

function renderStaticPost({ workspaceRoot, launchPackagePath = null, request = "", exportIds = Object.keys(EXPORTS), sourceRun = null, writePng = true }) {
  const manifest = buildManifest({ workspaceRoot, launchPackagePath, request });
  const runId = sourceRun || `static-render-${Date.now()}`;
  const renderRoot = resolveInside(workspaceRoot, "creative", "renders", runId);
  ensureDir(renderRoot);
  const manifestPath = path.join(renderRoot, "design-manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const rendered = [];
  for (const exportId of exportIds) {
    const exportDef = manifest.exports[exportId];
    if (!exportDef) throw new Error(`Unknown export id: ${exportId}`);
    const svg = renderSvg({ manifest, exportId });
    const filename = `${slugify(manifest.project)}-${exportId}.svg`;
    const outputPath = path.join(renderRoot, filename);
    fs.writeFileSync(outputPath, svg);
    const relativePath = path.relative(workspaceRoot, outputPath).split(path.sep).join("/");
    const artifact = registerArtifact(workspaceRoot, {
      path: relativePath,
      type: "static-render",
      intent: "social-static-post",
      platform: exportDef.platform,
      sourceRun: runId,
      sourceAgent: "static-designer",
      status: "needs_human_review",
      metadata: {
        exportId,
        width: exportDef.width,
        height: exportDef.height,
        format: "svg",
        deterministicText: true,
        launchPackage: manifest.sourceLaunchPackage
      }
    });
    let png = { status: "not_requested", reason: null, outputPath: null, artifact: null };
    if (writePng) {
      png = convertSvgToPng(outputPath);
      if (png.status === "created") {
        const pngRelativePath = path.relative(workspaceRoot, png.outputPath).split(path.sep).join("/");
        png.artifact = registerArtifact(workspaceRoot, {
          path: pngRelativePath,
          type: "static-render-png",
          intent: "social-static-post",
          platform: exportDef.platform,
          sourceRun: runId,
          sourceAgent: "static-designer",
          status: "needs_human_review",
          metadata: {
            exportId,
            width: exportDef.width,
            height: exportDef.height,
            format: "png",
            deterministicText: true,
            sourceSvg: relativePath,
            launchPackage: manifest.sourceLaunchPackage
          }
        });
      }
    }
    rendered.push({ exportId, outputPath, relativePath, artifact, png, workspaceRoot });
  }
  const report = staticQualityReport({ manifest, rendered });
  const reportJsonPath = path.join(renderRoot, "static-render-quality.json");
  const reportMdPath = path.join(renderRoot, "static-render-quality.md");
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, qualityMarkdown(report));
  fs.copyFileSync(manifestPath, resolveInside(workspaceRoot, "creative", "static-design-manifest-latest.json"));
  fs.copyFileSync(reportMdPath, resolveInside(workspaceRoot, "creative", "static-render-quality-latest.md"));
  return {
    runId,
    renderRoot,
    manifest,
    manifestPath,
    rendered,
    report,
    reportJsonPath,
    reportMdPath
  };
}

module.exports = {
  EXPORTS,
  buildManifest,
  convertSvgToPng,
  detectMimeFromBuffer,
  normalizeCopy,
  renderStaticPost,
  renderSvg,
  staticQualityReport,
  wrapText
};
