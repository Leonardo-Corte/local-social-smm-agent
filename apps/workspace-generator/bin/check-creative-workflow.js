#!/usr/bin/env node

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const os = require("os");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { runCreativeWorkflow } = require("../../../packages/workflow-runner/creative-orchestrator");

const root = path.resolve(__dirname, "../../..");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "creative-workflow-check-"));
  const workspace = "creative-check";
  const workspaceRoot = path.join(tempRoot, "workspaces/generated-projects", workspace);
  const sourceDir = path.join(tempRoot, "drive");
  try {
    write(path.join(workspaceRoot, "workspace-manifest.json"), JSON.stringify({
      workspace,
      automaticPublishEnabled: false,
      requiredHumanApproval: true
    }, null, 2));
    write(path.join(workspaceRoot, "project-brief.json"), JSON.stringify({
      projectName: "Creative Check",
      niche: "NYC networking",
      targetAudience: "corporate professionals in New York",
      primaryGoal30Days: "sell tickets",
      offer: "networking event ticket",
      tone: "premium, social, warm",
      platforms: ["instagram", "facebook", "x", "reddit"]
    }, null, 2));
    write(path.join(workspaceRoot, "business/business.md"), "# Business\nPremium NYC networking events.\n");
    write(path.join(workspaceRoot, "business/business-profile.json"), JSON.stringify({ city: "New York" }, null, 2));
    write(path.join(workspaceRoot, "drafts/posts.md"), "# Posts\nApproval required. Instagram Facebook X Reddit platform variants need hooks.\n");
    write(path.join(workspaceRoot, "drafts/reels.md"), "# Reels\nHook in first three seconds. Approval blockers before publishing.\n");
    write(path.join(workspaceRoot, "drafts/carousels.md"), "# Carousels\nPlatform-specific approval required.\n");
    write(path.join(workspaceRoot, "calendar/30-day-calendar.md"), Array.from({ length: 30 }, (_, index) => `| ${index + 1} | post | idea |`).join("\n"));
    write(path.join(workspaceRoot, "memory/regeneration-queue.json"), JSON.stringify({ tasks: [] }, null, 2));
    write(path.join(workspaceRoot, "model-routing-report.md"), "# Model Routing Report\n");
    write(path.join(sourceDir, "poster.png"), "fake png");
    write(path.join(sourceDir, "notes.md"), "asset notes");

    const run = await runCreativeWorkflow({
      root,
      workspace,
      workspaceRoot,
      request: "generami un reel basato su questa locandina e prepara distribuzione",
      sourceDir,
      sourceLabel: "check-drive",
      liveTrends: false,
      executeTeam: false,
      preview: false
    });

    assert.strictEqual(run.summary.status, "needs_human_review");
    assert.ok(fs.existsSync(path.join(workspaceRoot, "assets/asset-library.json")));
    assert.ok(fs.existsSync(path.join(workspaceRoot, "research/trend-report.md")));
    assert.ok(fs.existsSync(path.join(workspaceRoot, "creative/comfyui-plan.md")));
    assert.ok(fs.existsSync(path.join(workspaceRoot, "review/creative-performance-review.md")));
    assert.ok(fs.existsSync(path.join(workspaceRoot, "publishing/export-package.md")));
    assert.ok(run.summary.steps.some((step) => step.id === "agent-team" && step.status === "skipped"));

    console.log("creative workflow ok");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
