#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  ingestAssetDirectory,
  readAssetLibrary,
  writeAssetLibraryMarkdown,
  writeAssetWatchManifest
} = require("../../../packages/workspace-runner/asset-library");
const { readArtifactRegistry } = require("../../../packages/publishing/artifact-registry");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "asset-library-check-"));
  const workspaceRoot = path.join(tempRoot, "workspace");
  const sourceDir = path.join(tempRoot, "drive-folder");
  try {
    write(path.join(workspaceRoot, "workspace-manifest.json"), JSON.stringify({ workspace: "asset-library-check" }, null, 2));
    write(path.join(sourceDir, "event photo.JPG"), "fake jpg");
    write(path.join(sourceDir, "nested/reel.mp4"), "fake mp4");
    write(path.join(sourceDir, "notes.md"), "# notes\n");
    write(path.join(sourceDir, ".env"), "TOKEN=secret");
    write(path.join(sourceDir, "script.sh"), "echo no");

    const report = ingestAssetDirectory({
      workspaceRoot,
      sourceDir,
      sourceLabel: "drive-test",
      maxDepth: 3
    });
    const mdPath = writeAssetLibraryMarkdown(workspaceRoot, report);
    const watch = writeAssetWatchManifest({ workspaceRoot, sourceDir, sourceLabel: "drive-test" });

    assert.strictEqual(report.imported.length, 3);
    assert.ok(report.rejected.some((item) => item.path.endsWith(".env")));
    assert.ok(report.rejected.some((item) => item.path.endsWith("script.sh")));
    assert.ok(fs.existsSync(mdPath));
    assert.ok(fs.existsSync(watch.mdPath));

    const library = readAssetLibrary(workspaceRoot);
    assert.strictEqual(library.assets.length, 3);
    assert.strictEqual(library.queue.length, 3);
    assert.ok(library.assets.every((asset) => asset.workspacePath.startsWith("assets/raw/")));
    assert.ok(library.queue.some((item) => item.tasks.includes("reel-intelligence")));

    const registry = readArtifactRegistry(workspaceRoot);
    assert.strictEqual(registry.artifacts.length, 3);
    assert.ok(registry.artifacts.every((artifact) => artifact.type === "source-asset"));
    assert.ok(registry.artifacts.every((artifact) => artifact.status === "needs_human_review"));

    console.log("asset library ok");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
