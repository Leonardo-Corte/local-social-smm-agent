#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildCapCutPlan,
  writeCapCutPlan
} = require("../../../packages/video-intel/capcut-plan");
const { readArtifactRegistry } = require("../../../packages/publishing/artifact-registry");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "capcut-plan-check-"));
  const workspaceRoot = path.join(tempRoot, "workspace");
  try {
    write(path.join(workspaceRoot, "workspace-manifest.json"), JSON.stringify({ workspace: "capcut-plan-check" }, null, 2));
    write(path.join(workspaceRoot, "business/business.md"), "# Business\n\nPremium NYC networking event.\n");
    write(path.join(workspaceRoot, "drafts/reels.md"), "# Reel\n\nHook, recap, ticket CTA after approval.\n");
    write(path.join(workspaceRoot, "assets/raw/reel.mp4"), "fake video placeholder");
    const analysis = {
      version: "0.1.0",
      generatedAt: new Date().toISOString(),
      workspaceRoot,
      asset: {
        absolutePath: path.join(workspaceRoot, "assets/raw/reel.mp4"),
        relativePath: "assets/raw/reel.mp4",
        sha256: "abc123"
      },
      summary: {
        duration: 24,
        width: 1920,
        height: 1080,
        orientation: "horizontal",
        audioPresent: true
      },
      transcription: {
        status: "complete",
        transcript: "Welcome to the room. People are meeting and talking."
      },
      soundNotes: ["Use upbeat but premium sound."]
    };
    write(path.join(workspaceRoot, "assets/analysis/reel-reel-intelligence.json"), `${JSON.stringify(analysis, null, 2)}\n`);

    const plan = buildCapCutPlan({ workspaceRoot });
    assert.strictEqual(plan.status, "needs_human_review");
    assert.strictEqual(plan.adapter, "manual-capcut");
    assert.ok(plan.compatibleAdapters.includes("vectcutapi"));
    assert.ok(plan.timeline.overlays.length >= 2);
    assert.strictEqual(plan.timeline.subtitles.status, "transcript-ready");

    const result = writeCapCutPlan({ workspaceRoot, plan, sourceRun: "check" });
    assert.ok(fs.existsSync(result.jsonPath));
    assert.ok(fs.existsSync(result.mdPath));
    const registry = readArtifactRegistry(workspaceRoot);
    assert.ok(registry.artifacts.some((artifact) => artifact.path === "creative/capcut-plan.md" && artifact.status === "needs_human_review"));

    console.log("capcut plan ok");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
