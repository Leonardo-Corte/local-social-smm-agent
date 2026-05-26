#!/usr/bin/env node
/**
 * Full SMM workflow: trend → adaptive pipeline → images → capcut → publishing package
 *
 * Usage: npm run smm:full <workspace> [--type reel|post] [--model <name>] [--no-images] [--no-capcut] [--dry-run]
 */

const fs = require("fs");
const path = require("path");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { runAdaptiveTeamOrchestration } = require("../../../packages/orchestration/adaptive-orchestrator");
const { runLiveFetcher } = require("../../../packages/trend-intel/live-fetcher");
const { generateVisualBrief } = require("../../../packages/image-workflow/pollinations-adapter");
const { buildCapCutDraft } = require("../../../packages/capcut-agent/capcut-adapter");
const { buildReadyGuide } = require("../../../packages/publishing/ready-guide");
const { buildPublishingPackage, publishingPackageMarkdown } = require("../../../packages/publishing/export-package");

const root = path.resolve(__dirname, "../../..");

function flag(args, name) { return args.includes(name); }
function valueAfter(args, name) { const i = args.indexOf(name); return i !== -1 ? args[i + 1] || null : null; }

function step(label) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${label}`);
  console.log("=".repeat(60));
}

function ok(msg) { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ! ${msg}`); }
function fail(msg) { console.log(`  ✗ ${msg}`); }

async function main() {
  const args = process.argv.slice(2);
  if (!args[0] || args[0] === "--help") {
    console.log("Usage: npm run smm:full <workspace> [--type reel|post] [--model <name>] [--no-images] [--no-capcut] [--dry-run]");
    console.log("  --type reel       Run reel pipeline (default)");
    console.log("  --type post       Run post pipeline");
    console.log("  --no-images       Skip Pollinations.ai image generation");
    console.log("  --no-capcut       Skip CapCut draft creation");
    console.log("  --dry-run         Preview steps without executing LLM/external calls");
    process.exit(0);
  }

  const rawWorkspace = args[0];
  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;

  if (!fs.existsSync(workspaceRoot)) {
    fail(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const type = valueAfter(args, "--type") || "reel";
  const model = valueAfter(args, "--model") || "qwen2.5:14b";
  const skipImages = flag(args, "--no-images");
  const skipCapCut = flag(args, "--no-capcut");
  const dryRun = flag(args, "--dry-run");

  const briefPath = path.join(workspaceRoot, "project-brief.json");
  const brief = fs.existsSync(briefPath) ? JSON.parse(fs.readFileSync(briefPath, "utf8")) : {};
  const projectName = brief.projectName || workspace;
  const niche = brief.niche || "AI tools for creators";

  console.log(`\nSMM Full Workflow — ${projectName}`);
  console.log(`Workspace: ${workspace}`);
  console.log(`Type: ${type} | Model: ${model} | Dry-run: ${dryRun}`);
  console.log(`Images: ${skipImages ? "skip" : "Pollinations.ai"} | CapCut: ${skipCapCut ? "skip" : "enabled"}`);

  const summary = { steps: [], artifacts: [], warnings: [] };
  const ts = new Date().toISOString().slice(0, 10);

  // ── 1. Live trend intelligence ──────────────────────────────────────────────
  step("1/5 — Live Trend Intelligence");
  if (dryRun) {
    warn("dry-run: would fetch RSS + HN + Product Hunt");
  } else {
    try {
      const topics = [niche, "content creation", "local AI"];
      const trendReport = await runLiveFetcher({ workspaceRoot, topics });
      ok(`Fetched ${trendReport.itemCount} trend items from ${new Set(trendReport.items.map((i) => i.source)).size} sources`);
      ok("Saved to research/live-trend-report.md");
      summary.steps.push({ step: "trend", status: "ok", items: trendReport.itemCount });
    } catch (err) {
      warn(`Trend fetch failed: ${err.message} — continuing without live trends`);
      summary.steps.push({ step: "trend", status: "warning", error: err.message });
    }
  }

  // ── 2. Adaptive team pipeline ───────────────────────────────────────────────
  step("2/5 — Adaptive Team Pipeline");
  const request = `Create a professional ${type} for ${projectName}. Niche: ${niche}. Use the latest trends and brand strategy. Produce platform-specific adaptations.`;

  let pipelineResult = null;
  if (dryRun) {
    warn(`dry-run: would run adaptive pipeline (${type}, model=${model})`);
  } else {
    try {
      pipelineResult = await runAdaptiveTeamOrchestration({
        root,
        workspace,
        request,
        type,
        model,
        timeoutMs: 120000,
        apply: true,
        maxRevisions: 2
      });
      const r = pipelineResult.result;
      ok(`Pipeline completed: ${r.agentSteps.completed}/${r.agentSteps.total} steps`);
      ok(`Status: ${r.status}`);
      if (r.capcutBridge?.bridged) ok(`CapCut plan auto-bridged (${r.capcutBridge.overlays} overlays)`);
      if (r.agentSteps.revisionLoops > 0) ok(`QA triggered ${r.agentSteps.revisionLoops} revision loop(s)`);
      summary.steps.push({ step: "pipeline", status: r.status, agentSteps: r.agentSteps });
    } catch (err) {
      fail(`Pipeline failed: ${err.message}`);
      summary.steps.push({ step: "pipeline", status: "failed", error: err.message });
      summary.warnings.push("Pipeline failed — subsequent steps may produce empty output");
    }
  }

  // ── 3. Image generation ─────────────────────────────────────────────────────
  step("3/5 — Image Generation (Pollinations.ai)");
  if (skipImages) {
    warn("Skipped (--no-images)");
    summary.steps.push({ step: "images", status: "skipped" });
  } else if (dryRun) {
    warn("dry-run: would generate thumbnail (1080×1080) + cover (1080×1920)");
  } else {
    try {
      const { thumbnail, cover } = await generateVisualBrief(workspaceRoot);
      ok(`Thumbnail: ${thumbnail.filename} (${(thumbnail.sizeBytes / 1024).toFixed(0)} KB)`);
      ok(`Cover: ${cover.filename} (${(cover.sizeBytes / 1024).toFixed(0)} KB)`);
      summary.steps.push({ step: "images", status: "ok", files: [thumbnail.filename, cover.filename] });
      summary.artifacts.push(thumbnail.artifact?.id, cover.artifact?.id);
    } catch (err) {
      warn(`Image generation failed: ${err.message}`);
      summary.steps.push({ step: "images", status: "warning", error: err.message });
    }
  }

  // ── 4. CapCut draft ─────────────────────────────────────────────────────────
  step("4/5 — CapCut Draft");
  if (skipCapCut) {
    warn("Skipped (--no-capcut)");
    summary.steps.push({ step: "capcut", status: "skipped" });
  } else if (dryRun) {
    warn("dry-run: would create CapCut draft from capcut-plan.json");
  } else {
    try {
      const capcutResult = buildCapCutDraft({ workspaceRoot });
      ok(`Draft created: ${capcutResult.draftName}`);
      if (capcutResult.videoPlaceholder) warn("VIDEO PLACEHOLDER — open CapCut and add your video to Track 1");
      ok(`Status: ${capcutResult.status}`);
      summary.steps.push({ step: "capcut", status: capcutResult.status, draftName: capcutResult.draftName, videoPlaceholder: capcutResult.videoPlaceholder });
      summary.artifacts.push(capcutResult.artifact?.id);
    } catch (err) {
      warn(`CapCut draft failed: ${err.message}`);
      summary.steps.push({ step: "capcut", status: "warning", error: err.message });
    }
  }

  // ── 5. Publishing package ────────────────────────────────────────────────────
  step("5/5 — Publishing Package");
  if (dryRun) {
    warn("dry-run: would generate publishing/ready-<date>/ package");
  } else {
    try {
      const guide = buildReadyGuide(workspaceRoot);
      ok(`Ready guide: ${path.relative(workspaceRoot, guide.outputDir)}/`);
      for (const g of guide.generated) {
        const icon = g.hasAdaptedCopy ? "✓" : "!";
        console.log(`    ${icon} ${g.label}`);
      }
      const pkg = buildPublishingPackage(workspaceRoot);
      fs.mkdirSync(path.join(workspaceRoot, "publishing"), { recursive: true });
      fs.writeFileSync(path.join(workspaceRoot, "publishing/export-package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
      ok(`Artifacts: ${pkg.publishingArtifacts.blocked.length} pending review, ${pkg.publishingArtifacts.approved.length} approved`);
      summary.steps.push({ step: "publishing", status: "ok", readyDir: guide.ts });
      summary.artifacts.push(guide.artifact?.id);
    } catch (err) {
      warn(`Publishing package failed: ${err.message}`);
      summary.steps.push({ step: "publishing", status: "warning", error: err.message });
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log(`\n${"=".repeat(60)}`);
  console.log("  WORKFLOW COMPLETE");
  console.log("=".repeat(60));
  const ok_count = summary.steps.filter((s) => s.status === "ok" || s.status === "ready_for_review" || s.status === "applied_needs_human_review").length;
  const warn_count = summary.steps.filter((s) => s.status === "warning" || s.status === "skipped").length;
  const fail_count = summary.steps.filter((s) => s.status === "failed").length;
  console.log(`  Steps: ${ok_count} ok, ${warn_count} warnings, ${fail_count} failed`);
  console.log(`\n  Next steps:`);
  console.log(`  1. Review drafts/reels.md (or posts.md) — approve the copy`);
  console.log(`  2. Review drafts/platform-adaptations.md — approve per-platform text`);
  console.log(`  3. Review creative/images/ — approve thumbnail and cover`);
  console.log(`  4. Open CapCut — review and render the draft`);
  console.log(`  5. Use publishing/ready-${ts}/ guides to post manually`);
  console.log(`\n  NO content has been published. Human approval required for all artifacts.`);

  if (dryRun) {
    console.log(`\n  (dry-run mode — no LLM calls or external requests were made)`);
  }

  const summaryPath = path.join(workspaceRoot, "publishing", `smm-full-${ts}.json`);
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  fs.writeFileSync(summaryPath, `${JSON.stringify({ ...summary, completedAt: new Date().toISOString(), workspace, type, model, dryRun }, null, 2)}\n`);
  console.log(`\n  Run summary: publishing/smm-full-${ts}.json`);
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});
