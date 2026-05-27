#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { runSystemBenchmark } = require("../../../packages/benchmarks/system-benchmark");

const root = path.resolve(__dirname, "../../..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "system-benchmark-check-"));
try {
  const workspaceRoot = path.join(tempRoot, "workspace");
  fs.mkdirSync(path.join(workspaceRoot, "drafts"), { recursive: true });
  fs.mkdirSync(path.join(workspaceRoot, "research"), { recursive: true });
  fs.mkdirSync(path.join(workspaceRoot, "assets"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "drafts/posts.md"), "Instagram hook with approval and do not invent claims.\n");
  fs.writeFileSync(path.join(workspaceRoot, "drafts/reels.md"), "Hook first 3 seconds for Instagram, Facebook, LinkedIn, X and Reddit.\n");
  fs.writeFileSync(path.join(workspaceRoot, "drafts/carousels.md"), "Caption and platform variants.\n");
  fs.writeFileSync(path.join(workspaceRoot, "research/live-trend-report.md"), "NYC networking trend evidence ".repeat(30));
  fs.writeFileSync(path.join(workspaceRoot, "assets/asset-library.json"), JSON.stringify({ assets: [{ path: "a" }, { path: "b" }] }));
  const report = runSystemBenchmark({ root, workspaceRoot });
  assert.strictEqual(report.status, "passed");
  assert.ok(report.metrics.some((metric) => metric.id === "model-routing-speed"));
  assert.ok(report.metrics.some((metric) => metric.id === "consensus-overhead"));
  assert.ok(report.heavyMedia.realImageGeneration);
  console.log("system benchmark ok");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
