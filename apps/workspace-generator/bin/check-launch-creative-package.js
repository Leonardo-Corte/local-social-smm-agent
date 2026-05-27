#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildLaunchCreativePackage,
  writeLaunchCreativePackage
} = require("../../../packages/image-workflow/launch-creative-package");

const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "launch-package-check-"));
const imagePath = path.join(workspaceRoot, "creative/images/test.png");
fs.mkdirSync(path.dirname(imagePath), { recursive: true });
fs.writeFileSync(imagePath, Buffer.from("fake"));

const pkg = buildLaunchCreativePackage({
  workspaceRoot,
  request: "creami un post Instagram per GIGI/KILLSIRI, assistente vocale agentico per developer",
  imageResult: {
    outputPath: imagePath,
    filename: "test.png"
  },
  prompt: "futuristic tech interface, neon-lit cityscape background, soft blue lighting",
  promptEngineer: {
    styleTag: "photorealistic",
    fallback: false
  },
  qualityReport: {
    brandFit: { status: "needs_brand_review" },
    warnings: ["Generated image prompt/output appears weakly connected to the business profile; review brand fit."]
  },
  visionCritic: {
    status: "blocked_needs_revision",
    score: 42,
    verdict: "Blocked. Do not use as a social post until regenerated or redesigned.",
    twoSecondRead: "Generic neon tech background",
    problems: ["generic AI/cyberpunk visual language"],
    mustChange: ["Create deterministic typography/layout outside the image model."]
  },
  businessContext: "# Business Profile\n\nProject: GIGI\n\nAgentic voice assistant for developers. KILLSIRI."
});

assert.strictEqual(pkg.status, "needs_revision");
assert.strictEqual(pkg.score, 40);
assert.match(pkg.verdict, /Do not use as the main launch asset/i);
assert.strictEqual(pkg.visionCritic.status, "blocked_needs_revision");
assert.ok(pkg.genericSignals.includes("generic cyber/AI atmosphere"));
assert.ok(pkg.headlines.includes("SIRI WAITS. GIGI ACTS."));
assert.ok(pkg.platformDrafts.x.length >= 2);
assert.ok(pkg.regenerationPrompts.some((prompt) => /waveform|terminal|task/i.test(prompt)));

const paths = writeLaunchCreativePackage({ workspaceRoot, packageData: pkg });
assert.ok(fs.existsSync(paths.mdPath));
assert.ok(fs.existsSync(path.join(workspaceRoot, "creative/launch-package-latest.md")));

fs.rmSync(workspaceRoot, { recursive: true, force: true });
console.log("launch creative package ok");
