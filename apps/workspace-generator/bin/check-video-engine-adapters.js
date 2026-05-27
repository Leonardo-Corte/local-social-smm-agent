#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { detectVideoEngines } = require("../../../packages/video-engines/engine-registry");
const { buildPixelleHandoff, importPixelleOutput, runPixelleServiceJob, writePixelleHandoff } = require("../../../packages/video-engines/pixelle-adapter");
const { readArtifactRegistry } = require("../../../packages/publishing/artifact-registry");

async function main() {
  const registry = detectVideoEngines();
  assert.ok(registry.engines.some((engine) => engine.id === "capcut-plan"));
  assert.ok(registry.engines.some((engine) => engine.id === "pixelle-video"));

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-engine-check-"));
  try {
    const workspaceRoot = path.join(tempRoot, "workspace");
    fs.mkdirSync(path.join(workspaceRoot, "business"), { recursive: true });
    fs.writeFileSync(path.join(workspaceRoot, "workspace-manifest.json"), "{}\n");
    fs.writeFileSync(path.join(workspaceRoot, "business/business.md"), "# Business\nNYC networking events\n");
    const handoff = buildPixelleHandoff({ workspaceRoot, request: "make a reel" });
    assert.strictEqual(handoff.constraints.humanApprovalRequired, true);
    const handoffPaths = writePixelleHandoff({ workspaceRoot, request: "make a reel" });
    assert.ok(fs.existsSync(handoffPaths.mdPath));

    const fakeMp4 = path.join(tempRoot, "fake.mp4");
    fs.writeFileSync(fakeMp4, "fake mp4 bytes");
    const imported = importPixelleOutput({ workspaceRoot, mp4Path: fakeMp4 });
    assert.ok(fs.existsSync(imported.outputPath));
    const artifacts = readArtifactRegistry(workspaceRoot).artifacts;
    assert.strictEqual(artifacts[0].status, "needs_human_review");

    const service = await runPixelleServiceJob({ workspaceRoot, request: "make a reel", endpoint: null });
    assert.strictEqual(service.status, "service-not-configured");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("video engine adapters ok");
}).catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
