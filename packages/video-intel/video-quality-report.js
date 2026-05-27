const fs = require("fs");
const path = require("path");

const PLATFORM_LIMITS = {
  instagram: { preferredOrientation: "vertical", preferredMinSeconds: 5, preferredMaxSeconds: 90, idealRatio: "9:16" },
  facebook: { preferredOrientation: "vertical", preferredMinSeconds: 5, preferredMaxSeconds: 90, idealRatio: "9:16" },
  linkedin: { preferredOrientation: "horizontal-or-square", preferredMinSeconds: 8, preferredMaxSeconds: 120, idealRatio: "1:1 or 16:9" },
  x: { preferredOrientation: "horizontal-or-square", preferredMinSeconds: 5, preferredMaxSeconds: 140, idealRatio: "1:1 or 16:9" },
  reddit: { preferredOrientation: "community-dependent", preferredMinSeconds: 5, preferredMaxSeconds: 180, idealRatio: "subreddit-dependent" }
};

function scoreVideo(summary, platform = "instagram") {
  const limits = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.instagram;
  const blockers = [];
  const warnings = [];
  let score = 100;

  if (!summary.width || !summary.height) {
    blockers.push("Missing video dimensions.");
    score -= 25;
  }
  if (!summary.duration || summary.duration <= 0) {
    blockers.push("Missing duration.");
    score -= 25;
  }
  if (["instagram", "facebook"].includes(platform) && summary.orientation !== "vertical") {
    warnings.push(`${platform} Reels usually need a 9:16 vertical cut.`);
    score -= 15;
  }
  if (summary.duration && summary.duration < limits.preferredMinSeconds) {
    warnings.push(`Video may be too short for ${platform}; target at least ${limits.preferredMinSeconds}s unless it is a punchy teaser.`);
    score -= 8;
  }
  if (summary.duration && summary.duration > limits.preferredMaxSeconds) {
    warnings.push(`Video may be too long for ${platform}; create a tighter cut under ${limits.preferredMaxSeconds}s.`);
    score -= 12;
  }
  if (!summary.audioPresent) {
    warnings.push("No audio stream detected; add sound, voiceover, or strong subtitles.");
    score -= 10;
  }
  if (summary.meanVolume !== null && summary.meanVolume < -28) {
    warnings.push("Audio appears quiet; normalize before publishing.");
    score -= 8;
  }
  if (summary.silenceEvents > 3) {
    warnings.push("Multiple silence events detected; review pacing and dead zones.");
    score -= 6;
  }
  if (summary.keyframesPerSecond < 0.15) {
    warnings.push("Low keyframe density; inspect whether visual rhythm is dynamic enough.");
    score -= 5;
  }

  return {
    platform,
    idealRatio: limits.idealRatio,
    score: Math.max(0, Math.min(100, score)),
    status: blockers.length ? "blocked" : score >= 85 ? "strong" : score >= 70 ? "usable_with_edits" : "needs_recut",
    blockers,
    warnings
  };
}

function buildVideoQualityReport({ reelReport, platforms = ["instagram", "facebook", "linkedin", "x", "reddit"] }) {
  const platformScores = platforms.map((platform) => scoreVideo(reelReport.summary, platform));
  const allBlockers = platformScores.flatMap((item) => item.blockers.map((blocker) => `${item.platform}: ${blocker}`));
  const allWarnings = platformScores.flatMap((item) => item.warnings.map((warning) => `${item.platform}: ${warning}`));
  const averageScore = Math.round(platformScores.reduce((sum, item) => sum + item.score, 0) / Math.max(1, platformScores.length));
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    asset: reelReport.asset,
    technicalSummary: reelReport.summary,
    transcription: {
      status: reelReport.transcription.status,
      backend: reelReport.transcription.backend || null,
      hasTranscript: Boolean(reelReport.transcription.transcript)
    },
    shotQuality: reelReport.shotQuality || null,
    frameCount: reelReport.frames.length,
    platformScores,
    averageScore,
    status: allBlockers.length ? "blocked" : averageScore >= 85 ? "strong" : averageScore >= 70 ? "usable_with_edits" : "needs_recut",
    blockers: allBlockers,
    warnings: allWarnings,
    editDirectives: buildEditDirectives(reelReport, platformScores),
    guardrails: [
      "Do not infer exact attendance, guest identity, partnerships, pricing, or ticket inclusions from video alone.",
      "Use the transcript only if local transcription completed.",
      "Publish only after artifact approval."
    ]
  };
}

function buildEditDirectives(reelReport, platformScores) {
  const summary = reelReport.summary;
  const directives = [
    "Open with the clearest event/social proof frame in the first 1.5 seconds.",
    "Keep overlay text short and crop-safe; prefer separate overlays over baked-in AI text.",
    "Create separate 9:16 and square/horizontal exports when platform scores disagree."
  ];
  if (summary.orientation !== "vertical") {
    directives.push("Create a dedicated 9:16 vertical crop for Instagram/Facebook Reels.");
  }
  if (!summary.audioPresent) {
    directives.push("Add a music bed or voiceover plus captions before review.");
  }
  if (summary.duration > 30) {
    directives.push("Cut a 12-20 second teaser and keep the longer edit as secondary.");
  }
  if (reelReport.shotQuality && reelReport.shotQuality.warnings && reelReport.shotQuality.warnings.length) {
    directives.push(...reelReport.shotQuality.warnings.map((warning) => `Shot quality: ${warning}`));
  }
  const lowPlatforms = platformScores.filter((item) => item.score < 75).map((item) => item.platform);
  if (lowPlatforms.length) {
    directives.push(`Prioritize recut for: ${lowPlatforms.join(", ")}.`);
  }
  return directives;
}

function videoQualityMarkdown(report) {
  return `# Video Quality Report

Generated: ${report.generatedAt}

Asset: \`${report.asset.relativePath}\`

Status: ${report.status}

Average score: ${report.averageScore}/100

## Platform Scores
${report.platformScores.map((item) => `- ${item.platform}: ${item.score}/100 (${item.status}); ideal ${item.idealRatio}`).join("\n")}

## Blockers
${report.blockers.map((item) => `- ${item}`).join("\n") || "- None."}

## Warnings
${report.warnings.map((item) => `- ${item}`).join("\n") || "- None."}

## Shot Quality
${report.shotQuality ? `- Sampled frames: ${report.shotQuality.sampledFrames}
- Brightness avg: ${report.shotQuality.brightnessAvg === null ? "unknown" : report.shotQuality.brightnessAvg.toFixed(1)}
- Saturation avg: ${report.shotQuality.saturationAvg === null ? "unknown" : report.shotQuality.saturationAvg.toFixed(1)}
- Blur analysis: ${report.shotQuality.blurAvailable ? "available" : "unavailable"}
${report.shotQuality.warnings.map((item) => `- ${item}`).join("\n") || "- No automatic shot-quality warnings."}` : "- Not available."}

## Edit Directives
${report.editDirectives.map((item) => `- ${item}`).join("\n")}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}
`;
}

function writeVideoQualityReport({ workspaceRoot, report }) {
  const analysisDir = path.join(workspaceRoot, "assets/analysis");
  fs.mkdirSync(analysisDir, { recursive: true });
  const base = path.basename(report.asset.relativePath || "video").replace(/[^a-zA-Z0-9._-]+/g, "-");
  const jsonPath = path.join(analysisDir, `${base}-video-quality.json`);
  const mdPath = path.join(analysisDir, `${base}-video-quality.md`);
  const latestPath = path.join(analysisDir, "video-quality-latest.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, videoQualityMarkdown(report));
  fs.writeFileSync(latestPath, videoQualityMarkdown(report));
  return { jsonPath, mdPath, latestPath };
}

module.exports = {
  buildVideoQualityReport,
  scoreVideo,
  videoQualityMarkdown,
  writeVideoQualityReport
};
