const fs = require("fs");
const path = require("path");
const {
  chooseOllamaVisionModel,
  listOllamaModels,
  recommendedOllamaVisionInstall,
  runOllamaVisionGenerate
} = require("../local-runtime/model-client");
const { resolveInside } = require("../workspace-runner/workspace-paths");

function clampScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function scoreStatus(score) {
  if (score >= 85) return "ready_for_human_review";
  if (score >= 70) return "draft_needs_design_pass";
  if (score >= 50) return "background_only";
  return "blocked_needs_revision";
}

function statusVerdict(status) {
  if (status === "ready_for_human_review") return "Visual passed automated review, but still requires human approval.";
  if (status === "draft_needs_design_pass") return "Visual has potential but needs deterministic layout, typography, and platform export before approval.";
  if (status === "background_only") return "Use only as raw background or concept material. Do not present as a final post.";
  return "Blocked. Do not use as a social post until regenerated or redesigned.";
}

function genericSignals({ prompt, businessContext, qualityReport }) {
  const text = `${prompt || ""}\n${businessContext || ""}`.toLowerCase();
  const promptText = String(prompt || "").toLowerCase();
  const signals = [];
  if (/cyberpunk|neon city|cityscape|futuristic tech interface|sci-fi city|holographic/i.test(promptText)) {
    signals.push("generic AI/cyberpunk visual language");
  }
  if (/gigi|killsiri|siri|voice|assistant|agentic|developer|terminal|workflow/.test(text)
    && !/waveform|microphone|voice|assistant|agent|terminal|workflow|tool call|checklist|command/.test(promptText)) {
    signals.push("missing concrete product metaphor");
  }
  if (qualityReport?.brandFit && ["needs_brand_review", "weak_alignment", "unknown"].includes(qualityReport.brandFit.status)) {
    signals.push("weak brand fit");
  }
  if (qualityReport?.width && qualityReport.width < 1080) signals.push("below social resolution width");
  if (qualityReport?.height && qualityReport.height < 1080) signals.push("below social resolution height");
  if (qualityReport?.textRisk) signals.push("baked-in text risk");
  return [...new Set(signals)];
}

function heuristicScore({ prompt, businessContext, qualityReport }) {
  const signals = genericSignals({ prompt, businessContext, qualityReport });
  let score = 100;
  for (const signal of signals) {
    if (signal.includes("generic")) score -= 30;
    else if (signal.includes("product metaphor")) score -= 25;
    else if (signal.includes("brand")) score -= 25;
    else if (signal.includes("resolution")) score -= 12;
    else score -= 15;
  }
  if (qualityReport?.status === "blocked") score -= 35;
  if (qualityReport?.warnings?.length >= 4) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function buildVisionPrompt({ request, prompt, platform, businessContext, qualityReport }) {
  return `You are a severe professional social media art director and visual QA critic.

Judge the attached image for this social media mission. Be strict. If it looks like generic AI art, block it.

Return only JSON with this schema:
{
  "score": 0-100,
  "twoSecondRead": "what a viewer understands in two seconds",
  "publishability": "ready_for_human_review | draft_needs_design_pass | background_only | blocked_needs_revision",
  "problems": ["specific visual/design problems"],
  "mustChange": ["specific changes required"],
  "usablePlatforms": ["instagram", "x", "reddit", "facebook", "linkedin"],
  "missingSignals": ["missing brand/product/platform cues"],
  "designDirection": "one concise direction for the next iteration"
}

Scoring rules:
- 85-100 only if the image clearly communicates the product/category, has strong hierarchy, and can become a post after human approval.
- 70-84 if the image has a strong base but still needs deterministic layout/text.
- 50-69 if it is only a background or mood reference.
- 0-49 if it is generic, confusing, low-resolution, fake-text-heavy, or not connected to the business.

Business context:
${businessContext || "No business context"}

User request:
${request || "No user request"}

Platform:
${platform || "general"}

Image generation prompt:
${prompt || "No prompt"}

Existing deterministic QA:
${JSON.stringify({
  status: qualityReport?.status || null,
  width: qualityReport?.width || null,
  height: qualityReport?.height || null,
  warnings: qualityReport?.warnings || [],
  brandFit: qualityReport?.brandFit || null
}, null, 2)}`;
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  try {
    return JSON.parse(raw);
  } catch (_error) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (_inner) {
      return null;
    }
  }
}

function normalizeModelReport(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const score = clampScore(parsed.score);
  return {
    score,
    publishability: parsed.publishability || (score === null ? null : scoreStatus(score)),
    twoSecondRead: String(parsed.twoSecondRead || "").trim(),
    problems: Array.isArray(parsed.problems) ? parsed.problems.map(String).filter(Boolean) : [],
    mustChange: Array.isArray(parsed.mustChange) ? parsed.mustChange.map(String).filter(Boolean) : [],
    usablePlatforms: Array.isArray(parsed.usablePlatforms) ? parsed.usablePlatforms.map(String).filter(Boolean) : [],
    missingSignals: Array.isArray(parsed.missingSignals) ? parsed.missingSignals.map(String).filter(Boolean) : [],
    designDirection: String(parsed.designDirection || "").trim()
  };
}

function buildVisionCriticReport({
  imagePath,
  relativePath,
  request,
  prompt,
  platform,
  businessContext,
  qualityReport,
  model,
  modelStatus = "not-run",
  modelOutput = "",
  modelError = null
}) {
  const heuristic = heuristicScore({ prompt, businessContext, qualityReport });
  const modelReport = normalizeModelReport(parseJsonObject(modelOutput));
  const modelScore = modelReport && modelReport.score !== null ? modelReport.score : null;
  const finalScore = modelScore === null ? heuristic : Math.min(heuristic, modelScore);
  const status = scoreStatus(finalScore);
  const signals = genericSignals({ prompt, businessContext, qualityReport });
  const problems = [
    ...signals,
    ...(modelReport?.problems || []),
    ...(qualityReport?.warnings || [])
  ].filter(Boolean);
  const mustChange = [
    ...(modelReport?.mustChange || []),
    ...(status !== "ready_for_human_review" ? [
      "Do not treat this as final social artwork.",
      "Create deterministic typography/layout outside the image model.",
      "Regenerate or redesign with stronger product/category cues."
    ] : [])
  ];

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    image: relativePath || imagePath || null,
    platform: platform || null,
    model: model || null,
    modelStatus,
    modelError,
    heuristicScore: heuristic,
    modelScore,
    score: finalScore,
    status,
    verdict: statusVerdict(status),
    twoSecondRead: modelReport?.twoSecondRead || "No semantic model read available.",
    problems: [...new Set(problems)],
    mustChange: [...new Set(mustChange)],
    usablePlatforms: modelReport?.usablePlatforms || [],
    missingSignals: [...new Set([...(modelReport?.missingSignals || []), ...signals])],
    designDirection: modelReport?.designDirection || "Use the image only as raw material; build the real post with layout, copy, and platform-specific exports.",
    checks: [
      "Final score is intentionally pessimistic: it uses the lower value between deterministic heuristic score and local vision model score.",
      "Generated images under 85 are not final-ready.",
      "Human approval is still required for every artifact."
    ]
  };
}

async function runVisionCritic({
  imagePath,
  relativePath,
  request,
  prompt,
  platform,
  businessContext,
  qualityReport,
  preferredModel = null,
  timeoutMs = 240000,
  runModel = process.env.SMM_VISION_CRITIC !== "off"
}) {
  let model = null;
  let modelStatus = "not-run";
  let modelOutput = "";
  let modelError = null;

  if (runModel && imagePath && fs.existsSync(imagePath)) {
    const models = listOllamaModels();
    model = chooseOllamaVisionModel(models, preferredModel);
    if (!model) {
      const install = recommendedOllamaVisionInstall();
      modelStatus = "missing-model";
      modelError = `No local vision model found. Recommended: ${install.command}`;
    } else {
      try {
        modelStatus = "completed";
        modelOutput = await runOllamaVisionGenerate({
          model,
          prompt: buildVisionPrompt({ request, prompt, platform, businessContext, qualityReport }),
          imagePaths: [imagePath],
          timeoutMs,
          options: { temperature: 0.1, top_p: 0.8, num_predict: 500 }
        });
      } catch (error) {
        modelStatus = "failed";
        modelError = error.message;
      }
    }
  }

  return buildVisionCriticReport({
    imagePath,
    relativePath,
    request,
    prompt,
    platform,
    businessContext,
    qualityReport,
    model,
    modelStatus,
    modelOutput,
    modelError
  });
}

function visionCriticMarkdown(report) {
  return `# Vision Critic Report

Status: ${report.status}

Score: ${report.score}/100

Image: \`${report.image || "-"}\`

Platform: ${report.platform || "-"}

Model: ${report.model || "-"} (${report.modelStatus})
${report.modelError ? `\nModel error: ${report.modelError}\n` : ""}

## Verdict
${report.verdict}

## Two Second Read
${report.twoSecondRead}

## Problems
${report.problems.map((item) => `- ${item}`).join("\n") || "- None."}

## Must Change
${report.mustChange.map((item) => `- ${item}`).join("\n") || "- None."}

## Missing Signals
${report.missingSignals.map((item) => `- ${item}`).join("\n") || "- None."}

## Design Direction
${report.designDirection}

## Checks
${report.checks.map((item) => `- ${item}`).join("\n")}
`;
}

function writeVisionCriticReport({ workspaceRoot, report }) {
  const reportDir = resolveInside(workspaceRoot, "creative", "vision-critic");
  fs.mkdirSync(reportDir, { recursive: true });
  const safeName = path.basename(report.image || "image").replace(/[^a-zA-Z0-9._-]+/g, "-");
  const jsonPath = path.join(reportDir, `${safeName}.json`);
  const mdPath = path.join(reportDir, `${safeName}.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, visionCriticMarkdown(report));
  fs.copyFileSync(jsonPath, resolveInside(workspaceRoot, "creative", "vision-critic-latest.json"));
  fs.copyFileSync(mdPath, resolveInside(workspaceRoot, "creative", "vision-critic-latest.md"));
  return {
    jsonPath,
    mdPath,
    relativeJsonPath: path.relative(workspaceRoot, jsonPath).split(path.sep).join("/"),
    relativeMdPath: path.relative(workspaceRoot, mdPath).split(path.sep).join("/")
  };
}

module.exports = {
  buildVisionCriticReport,
  buildVisionPrompt,
  genericSignals,
  heuristicScore,
  runVisionCritic,
  scoreStatus,
  statusVerdict,
  visionCriticMarkdown,
  writeVisionCriticReport
};
