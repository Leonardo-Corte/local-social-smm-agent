const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const { buildImageQualityReport } = require("../image-workflow/image-quality-report");
const { buildModelRoutingReport } = require("../model-router/detect-profile");
const { runConsensusBenchmark } = require("../orchestration/consensus-benchmark");
const { evaluateCreativePerformance } = require("../review-loop/performance-reviewer");
const { buildVideoQualityReport } = require("../video-intel/video-quality-report");

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function timed(id, label, fn) {
  const started = performance.now();
  try {
    const output = fn();
    return {
      id,
      label,
      status: "passed",
      elapsedMs: Math.round(performance.now() - started),
      output
    };
  } catch (error) {
    return {
      id,
      label,
      status: "failed",
      elapsedMs: Math.round(performance.now() - started),
      error: error.message
    };
  }
}

function fakeReelReport() {
  return {
    asset: { relativePath: "creative/videos/example.mp4" },
    summary: {
      width: 1080,
      height: 1920,
      orientation: "vertical",
      duration: 18,
      audioPresent: true,
      meanVolume: -18,
      silenceEvents: 0,
      keyframesPerSecond: 0.4
    },
    transcription: { status: "completed", backend: "fixture", transcript: "Welcome to a NYC networking dinner." },
    shotQuality: { sampledFrames: 3, brightnessAvg: 118, saturationAvg: 62, blurAvailable: false, warnings: [] },
    frames: [{ second: 1 }, { second: 6 }, { second: 12 }]
  };
}

function runSystemBenchmark({ root, workspaceRoot = null } = {}) {
  if (!root) throw new Error("root is required.");
  const resolvedWorkspaceRoot = workspaceRoot || path.join(root, "workspaces/generated-projects/sample-local-social-team");
  const metrics = [];

  metrics.push(timed("model-routing-speed", "Local model routing control-plane speed", () => {
    const profiles = readJson(path.join(root, "packages/model-router/profiles/model-profiles.json"));
    const catalog = readJson(path.join(root, "packages/model-router/model-catalog.json"));
    const report = buildModelRoutingReport(profiles, catalog);
    return {
      profile: report.profile.id,
      backends: report.profile.availableBackends.map((backend) => ({ id: backend.id, available: backend.available }))
    };
  }));

  metrics.push(timed("image-quality-scorecard", "Image QA and brand-fit scorecard", () => {
    const report = buildImageQualityReport({
      buffer: PNG_1X1,
      relativePath: "creative/images/fixture.png",
      prompt: "NYC corporate networking dinner photo for founders, operators, ambitious professionals, no text",
      platform: "instagram",
      expectedWidth: 1080,
      expectedHeight: 1920,
      brandContext: "Out Of Office hosts NYC corporate networking dinners for founders, operators, and ambitious professionals."
    });
    return {
      status: report.status,
      brandFit: report.brandFit.status,
      platformFit: report.platformFit
    };
  }));

  metrics.push(timed("video-analysis-scorecard", "Video analysis scorecard control-plane", () => {
    const report = buildVideoQualityReport({ reelReport: fakeReelReport() });
    return {
      status: report.status,
      averageScore: report.averageScore,
      platformScores: report.platformScores.map((item) => ({ platform: item.platform, score: item.score }))
    };
  }));

  metrics.push(timed("creative-output-quality", "Creative output quality scorecard", () => {
    if (!fs.existsSync(resolvedWorkspaceRoot)) {
      return { status: "skipped", reason: "sample workspace missing" };
    }
    const report = evaluateCreativePerformance(resolvedWorkspaceRoot);
    return {
      status: report.status,
      percentage: report.percentage,
      nextActions: report.nextActions.length
    };
  }));

  metrics.push(timed("consensus-overhead", "Consensus quality benchmark", () => {
    const report = runConsensusBenchmark();
    return {
      status: report.status,
      cases: report.cases.length,
      averageDelta: Math.round(report.cases.reduce((sum, item) => sum + item.delta, 0) / Math.max(1, report.cases.length))
    };
  }));

  const heavyMedia = {
    realImageGeneration: process.env.SMM_COMFYUI_WORKFLOW
      ? "configured; run `npm run comfyui:run <workspace> -- --workflow $SMM_COMFYUI_WORKFLOW --prompt \"...\"` for real timing"
      : "not configured in fast benchmark; set SMM_COMFYUI_WORKFLOW for real ComfyUI timing",
    realVideoGeneration: process.env.SMM_PIXELLE_URL
      ? "configured; run `npm run video:engines <workspace> -- --run-pixelle --request \"...\"` for real timing"
      : "not configured in fast benchmark; set SMM_PIXELLE_URL for real Pixelle timing",
    realVideoAnalysis: "run `npm run video:intel <workspace> -- /path/video.mp4` for ffprobe/ffmpeg timing on an actual asset"
  };

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    workspaceRoot: resolvedWorkspaceRoot,
    status: metrics.some((metric) => metric.status === "failed") ? "review" : "passed",
    metrics,
    heavyMedia,
    guardrails: [
      "Fast benchmark measures control-plane reliability and scorecard latency without forcing huge local model/media jobs.",
      "Real model speed is measured by npm run models:benchmark.",
      "Real image/video generation remains opt-in because it depends on local hardware and installed engines."
    ]
  };
}

function systemBenchmarkMarkdown(report) {
  return `# System Benchmark Suite

Generated: ${report.generatedAt}

Status: ${report.status}

Workspace root: \`${report.workspaceRoot}\`

## Fast Metrics
| Metric | Status | Time |
| --- | --- | ---: |
${report.metrics.map((metric) => `| ${metric.label} | ${metric.status} | ${metric.elapsedMs} ms |`).join("\n")}

## Metric Outputs
${report.metrics.map((metric) => `### ${metric.label}
\`\`\`json
${JSON.stringify(metric.output || { error: metric.error }, null, 2)}
\`\`\`
`).join("\n")}

## Heavy Media Timing
${Object.entries(report.heavyMedia).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}
`;
}

function writeSystemBenchmark({ root, workspaceRoot = null }) {
  const report = runSystemBenchmark({ root, workspaceRoot });
  const outDir = path.join(root, "docs/benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "system-benchmark.json");
  const mdPath = path.join(outDir, "system-benchmark.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, systemBenchmarkMarkdown(report));
  return { report, jsonPath, mdPath };
}

module.exports = {
  runSystemBenchmark,
  systemBenchmarkMarkdown,
  writeSystemBenchmark
};
