const fs = require("fs");
const path = require("path");
const { ingestAssetDirectory } = require("../workspace-runner/asset-library");
const { buildTrendReport, reportMarkdown } = require("../trend-intel/research-engine");
const { collectLiveTrends, writeLiveTrendReport } = require("../trend-intel/live-collector");
const { buildComfyUiPlan, comfyUiPlanMarkdown } = require("../image-workflow/comfyui-plan");
const {
  buildReelIntelligence,
  findDefaultAsset,
  writeReelIntelligence
} = require("../video-intel/reel-intelligence");
const {
  buildEditRecipe,
  runPreviewEdit,
  writeRecipe
} = require("../video-intel/edit-recipe");
const { buildCapCutPlan, writeCapCutPlan } = require("../video-intel/capcut-plan");
const {
  evaluateCreativePerformance,
  writePerformanceReview
} = require("../review-loop/performance-reviewer");
const { buildPublishingPackage, publishingPackageMarkdown } = require("../publishing/export-package");
const { runTeamOrchestration } = require("./team-orchestrator");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function countRequested(request) {
  const match = String(request || "").match(/\b(\d{1,2})\s*(?:reel|post|carousel|caroselli|video|contenut)/i);
  if (!match) {
    return 1;
  }
  return Math.max(1, Math.min(Number(match[1]), 4));
}

function inferCreativeType(request) {
  const text = String(request || "").toLowerCase();
  if (/\breddit\b/.test(text)) return "reddit";
  if (/\bx\b|\btwitter\b|\bthread\b/.test(text)) return "x";
  if (/\bcarousel|carosell/.test(text)) return "carousel";
  if (/\breel|video|monta|edit|capcut/.test(text)) return "reel";
  if (/\bimage|immagine|locandina|poster|visual|thumbnail/.test(text)) return "image";
  return "post";
}

function selectedStepsForType(type) {
  if (type === "reel") {
    return ["research", "platform", "strategy", "video", "copy", "persona", "qa", "publishing"];
  }
  if (type === "image") {
    return ["research", "platform", "strategy", "visuals", "copy", "persona", "qa"];
  }
  if (type === "reddit" || type === "x") {
    return ["research", "platform", "strategy", "copy", "persona", "qa"];
  }
  return ["research", "platform", "strategy", "copy", "persona", "qa", "publishing"];
}

function writeTrendPlan({ root, workspaceRoot }) {
  const brief = readJson(path.join(workspaceRoot, "project-brief.json"), {});
  const businessProfile = readJson(path.join(workspaceRoot, "business/business-profile.json"), {});
  const sourceRegistry = readJson(path.join(root, "packages/trend-intel/registries/source-registry.json"), {});
  const report = buildTrendReport({ ...brief, ...businessProfile }, sourceRegistry);
  writeJson(path.join(workspaceRoot, "research/trend-research-plan.json"), report);
  writeText(path.join(workspaceRoot, "research/trend-report.md"), reportMarkdown(report));
  return report;
}

async function maybeWriteLiveTrends({ workspaceRoot, brief, liveTrends, maxQueries }) {
  if (!liveTrends) {
    return null;
  }
  const projectLinks = readJson(path.join(workspaceRoot, "sources/project-links.json"), { links: [] });
  const report = await collectLiveTrends({ workspaceRoot, brief, projectLinks, maxQueries });
  writeLiveTrendReport({ workspaceRoot, report });
  return report;
}

function writeImagePlan(workspaceRoot) {
  const plan = buildComfyUiPlan(workspaceRoot);
  writeJson(path.join(workspaceRoot, "creative/comfyui-plan.json"), plan);
  writeText(path.join(workspaceRoot, "creative/comfyui-plan.md"), comfyUiPlanMarkdown(plan));
  return plan;
}

function maybeWriteVideoPlans({ workspaceRoot, transcribe = true, preview = true }) {
  const assetPath = findDefaultAsset(workspaceRoot);
  if (!assetPath) {
    return null;
  }
  const reelReport = buildReelIntelligence({ workspaceRoot, assetPath, transcribe });
  const reportPaths = writeReelIntelligence({ workspaceRoot, report: reelReport });
  const recipe = buildEditRecipe({ workspaceRoot, analysis: reelReport });
  const runResult = preview ? runPreviewEdit(recipe) : { ok: false, status: "preview-skipped" };
  writeRecipe({ recipe, runResult });
  const capcut = buildCapCutPlan({ workspaceRoot });
  const capcutPaths = writeCapCutPlan({ workspaceRoot, plan: capcut, sourceRun: "creative-run" });
  return { reelReport, reportPaths, recipe, runResult, capcut, capcutPaths };
}

async function runCreativeWorkflow({
  root,
  workspace,
  workspaceRoot,
  request,
  sourceDir = null,
  sourceLabel = "chat-source",
  liveTrends = false,
  maxQueries = 3,
  model = null,
  executeTeam = true,
  preview = true
}) {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const creativeRunRoot = path.join(workspaceRoot, "creative-runs", runId);
  ensureDir(creativeRunRoot);
  writeText(path.join(workspaceRoot, "operations/current-request.md"), `# Current Creative Request

Created at: ${new Date().toISOString()}

${request}
`);

  const summary = {
    version: "0.1.0",
    runId,
    workspace,
    request,
    generatedAt: new Date().toISOString(),
    status: "needs_human_review",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    steps: []
  };

  if (sourceDir) {
    const assetReport = ingestAssetDirectory({ workspaceRoot, sourceDir, sourceLabel });
    summary.steps.push({ id: "asset-library", status: "completed", imported: assetReport.imported.length, rejected: assetReport.rejected.length });
  }

  const brief = readJson(path.join(workspaceRoot, "project-brief.json"), {});
  const trendPlan = writeTrendPlan({ root, workspaceRoot });
  summary.steps.push({ id: "trend-plan", status: "completed", tasks: trendPlan.tasks ? trendPlan.tasks.length : 0 });

  const liveTrendReport = await maybeWriteLiveTrends({ workspaceRoot, brief, liveTrends, maxQueries });
  if (liveTrendReport) {
    summary.steps.push({ id: "live-trends", status: "completed", items: liveTrendReport.items.length, failures: liveTrendReport.failures.length });
  }

  const imagePlan = writeImagePlan(workspaceRoot);
  summary.steps.push({ id: "image-plan", status: imagePlan.status });

  const video = maybeWriteVideoPlans({ workspaceRoot, preview });
  if (video) {
    summary.steps.push({
      id: "video-editing",
      status: video.runResult.ok ? "preview_created" : "plan_created",
      capcutPlan: path.relative(workspaceRoot, video.capcutPaths.mdPath)
    });
  } else {
    summary.steps.push({ id: "video-editing", status: "skipped_no_video_asset" });
  }

  const type = inferCreativeType(request);
  const count = countRequested(request);
  const teamRuns = [];
  if (executeTeam) {
    for (let index = 1; index <= count; index += 1) {
      const team = await runTeamOrchestration({
        root,
        workspace,
        request: count > 1 ? `${request}\n\nVariant ${index}/${count}: make this distinct in hook, angle, and platform framing.` : request,
        type,
        steps: selectedStepsForType(type),
        model,
        timeoutMs: 180000,
        apply: true
      });
      teamRuns.push({
        index,
        status: team.result.status,
        target: team.result.target,
        teamRun: path.relative(workspaceRoot, team.teamRoot),
        workflowRun: path.relative(workspaceRoot, team.workflowRoot)
      });
    }
  }
  summary.steps.push({ id: "agent-team", status: executeTeam ? "completed" : "skipped", type, count, teamRuns });

  const performance = evaluateCreativePerformance(workspaceRoot);
  const performancePaths = writePerformanceReview(workspaceRoot, performance);
  summary.steps.push({ id: "performance-review", status: performance.status, score: performance.score, report: path.relative(workspaceRoot, performancePaths.mdPath) });

  const publishingPackage = buildPublishingPackage(workspaceRoot);
  writeJson(path.join(workspaceRoot, "publishing/export-package.json"), publishingPackage);
  writeText(path.join(workspaceRoot, "publishing/export-package.md"), publishingPackageMarkdown(publishingPackage));
  summary.steps.push({ id: "publishing-package", status: publishingPackage.status });

  writeJson(path.join(creativeRunRoot, "summary.json"), summary);
  writeText(path.join(creativeRunRoot, "summary.md"), creativeSummaryMarkdown(summary));
  return { creativeRunRoot, summary };
}

function creativeSummaryMarkdown(summary) {
  return `# Creative Run Summary

Workspace: ${summary.workspace}

Run ID: ${summary.runId}

Status: ${summary.status}

Human approval required: yes

Automatic publishing: disabled

## Request
${summary.request}

## Steps
${summary.steps.map((step) => `- ${step.id}: ${step.status}${step.score ? ` (${step.score})` : ""}`).join("\n")}
`;
}

module.exports = {
  countRequested,
  inferCreativeType,
  runCreativeWorkflow,
  selectedStepsForType
};
