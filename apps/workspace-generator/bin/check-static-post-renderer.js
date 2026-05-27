#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  EXPORTS,
  buildManifest,
  convertSvgToPng,
  detectMimeFromBuffer,
  normalizeCopy,
  renderStaticPost,
  renderSvg,
  wrapText
} = require("../../../packages/design-renderer/static-post-renderer");
const { readArtifactRegistry } = require("../../../packages/publishing/artifact-registry");

const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "static-render-check-"));
fs.mkdirSync(path.join(workspaceRoot, "business"), { recursive: true });
fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
fs.mkdirSync(path.join(workspaceRoot, "creative/images"), { recursive: true });
fs.mkdirSync(path.join(workspaceRoot, "publishing"), { recursive: true });

fs.writeFileSync(path.join(workspaceRoot, "business/business.md"), "# Business Profile\n\nProject: GIGI\n\nKILLSIRI is an agentic voice assistant for developers.");
const jpegNamedPng = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00, 0xff, 0xd9]);
fs.writeFileSync(path.join(workspaceRoot, "creative/images/background.png"), jpegNamedPng);
fs.writeFileSync(path.join(workspaceRoot, "creative/launch-package-latest.json"), `${JSON.stringify({
  status: "background_only",
  image: "creative/images/background.png",
  angle: {
    promise: "Siri waits. GIGI acts."
  },
  headlines: [
    "SIRI WAITS. GIGI ACTS.",
    "KILL THE ASSISTANT. BUILD THE AGENT."
  ]
}, null, 2)}\n`);

const manifest = buildManifest({ workspaceRoot, request: "create a GIGI launch post" });
assert.strictEqual(manifest.project, "KILLSIRI");
assert.strictEqual(manifest.copy.headline, "SIRI WAITS. GIGI ACTS.");
assert.notStrictEqual(normalizeCopy(manifest.copy.subheadline), normalizeCopy(manifest.copy.headline));
assert.strictEqual(manifest.copy.cta, "Follow the build on GitHub");
assert.ok(Object.keys(manifest.exports).includes("instagram-4x5"));

const svg = renderSvg({ manifest, exportId: "instagram-4x5" });
assert.match(svg, /width="1080"/);
assert.match(svg, /height="1350"/);
assert.match(svg, /SIRI WAITS/);
assert.match(svg, /Follow the build/);
assert.match(svg, /Voice commands/);
assert.match(svg, /data:image\/jpeg;base64/);
assert.strictEqual(detectMimeFromBuffer(jpegNamedPng, "background.png"), "image/jpeg");
assert.ok(wrapText("SIRI WAITS. GIGI ACTS.", 12).length > 1);

const result = renderStaticPost({
  workspaceRoot,
  request: "create a launch post",
  exportIds: ["instagram-4x5", "x-card"],
  sourceRun: "static-render-check",
  writePng: false
});

assert.strictEqual(result.rendered.length, 2);
for (const item of result.rendered) {
  assert.ok(fs.existsSync(item.outputPath), `missing ${item.outputPath}`);
  const exportDef = EXPORTS[item.exportId];
  const output = fs.readFileSync(item.outputPath, "utf8");
  assert.match(output, new RegExp(`width="${exportDef.width}"`));
  assert.match(output, new RegExp(`height="${exportDef.height}"`));
  assert.strictEqual(item.artifact.status, "needs_human_review");
  assert.strictEqual(item.artifact.automaticPublishEnabled, false);
}

const registry = readArtifactRegistry(workspaceRoot);
assert.strictEqual(registry.artifacts.length, 2);
assert.ok(fs.existsSync(path.join(workspaceRoot, "creative/static-render-quality-latest.md")));

const simpleSvgPath = path.join(workspaceRoot, "simple.svg");
fs.writeFileSync(simpleSvgPath, `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#050506"/><text x="4" y="20" fill="#fff" font-size="12">ok</text></svg>`);
const pngConversion = convertSvgToPng(simpleSvgPath);
assert.ok(["created", "skipped"].includes(pngConversion.status), pngConversion.reason || pngConversion.status);
if (pngConversion.status === "created") {
  assert.ok(fs.existsSync(pngConversion.outputPath));
}

fs.rmSync(workspaceRoot, { recursive: true, force: true });
console.log("static post renderer ok");
