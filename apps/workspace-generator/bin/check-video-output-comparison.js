#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { registerArtifact } = require("../../../packages/publishing/artifact-registry");
const { buildVideoOutputComparison, writeVideoOutputComparison } = require("../../../packages/video-engines/video-output-comparison");

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-output-comparison-check-"));
try {
  const workspaceRoot = path.join(tempRoot, "workspace");
  fs.mkdirSync(path.join(workspaceRoot, "creative/videos"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "workspace-manifest.json"), "{}\n");
  fs.writeFileSync(path.join(workspaceRoot, "creative/videos/a.mp4"), "fake mp4");
  registerArtifact(workspaceRoot, {
    path: "creative/videos/a.mp4",
    type: "video",
    intent: "pixelle-generated-video",
    sourceRun: "test",
    sourceAgent: "pixelle-video-adapter",
    status: "needs_human_review"
  });
  const report = buildVideoOutputComparison({ workspaceRoot });
  assert.strictEqual(report.candidates.length, 1);
  assert.strictEqual(report.candidates[0].engine, "pixelle");
  assert.ok(report.candidates[0].warnings.some((warning) => /approval/i.test(warning)));
  const written = writeVideoOutputComparison({ workspaceRoot });
  assert.ok(fs.existsSync(written.mdPath));
  console.log("video output comparison ok");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
