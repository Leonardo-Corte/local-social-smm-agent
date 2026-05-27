#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { buildVideoQualityReport, scoreVideo, writeVideoQualityReport } = require("../../../packages/video-intel/video-quality-report");

const summary = {
  duration: 24,
  width: 1080,
  height: 1920,
  orientation: "vertical",
  audioPresent: true,
  meanVolume: -18,
  silenceEvents: 0,
  keyframesPerSecond: 0.5
};

assert.strictEqual(scoreVideo(summary, "instagram").status, "strong");
assert.ok(scoreVideo({ ...summary, orientation: "horizontal" }, "instagram").warnings.length > 0);

const report = buildVideoQualityReport({
  reelReport: {
    asset: { relativePath: "assets/raw/reel.mp4" },
    summary,
    transcription: { status: "completed", transcript: "hello" },
    frames: ["frame.jpg"]
  }
});
assert.ok(report.averageScore >= 80);
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-quality-check-"));
try {
  const paths = writeVideoQualityReport({ workspaceRoot: tempRoot, report });
  assert.ok(fs.existsSync(paths.mdPath));
  assert.ok(fs.existsSync(paths.latestPath));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("video quality report ok");
