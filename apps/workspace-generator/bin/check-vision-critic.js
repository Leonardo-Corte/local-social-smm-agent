#!/usr/bin/env node

const assert = require("assert");
const {
  buildVisionCriticReport,
  genericSignals,
  heuristicScore,
  scoreStatus
} = require("../../../packages/image-workflow/vision-critic");

const weakQuality = {
  status: "review_with_warnings",
  width: 768,
  height: 768,
  textRisk: false,
  warnings: [
    "Width is below 1080px; may be weak for social crops.",
    "Height is below 1080px; may be weak for vertical placements.",
    "Generated image prompt/output appears weakly connected to the business profile; review brand fit."
  ],
  brandFit: { status: "needs_brand_review", score: 25 }
};

const weakPrompt = "futuristic tech interface, neon city, cyberpunk dashboard, glowing panels";
const businessContext = "# Business Profile\n\nGIGI / KILLSIRI is an agentic voice assistant for developers. It should show voice, terminal, tool calls, workflows, and execution.";

const signals = genericSignals({
  prompt: weakPrompt,
  businessContext,
  qualityReport: weakQuality
});

assert.ok(signals.includes("generic AI/cyberpunk visual language"));
assert.ok(signals.includes("missing concrete product metaphor"));
assert.ok(signals.includes("weak brand fit"));
assert.ok(heuristicScore({ prompt: weakPrompt, businessContext, qualityReport: weakQuality }) < 50);

const blocked = buildVisionCriticReport({
  imagePath: "/tmp/weak.png",
  relativePath: "creative/images/weak.png",
  request: "creami un post di lancio per GIGI/KILLSIRI",
  prompt: weakPrompt,
  platform: "instagram",
  businessContext,
  qualityReport: weakQuality,
  modelStatus: "not-run"
});

assert.strictEqual(blocked.status, "blocked_needs_revision");
assert.ok(blocked.score < 50);
assert.match(blocked.verdict, /Blocked/i);
assert.ok(blocked.mustChange.some((item) => /typography/i.test(item)));

const modelHarsh = buildVisionCriticReport({
  imagePath: "/tmp/weak.png",
  relativePath: "creative/images/weak.png",
  request: "creami un post di lancio per GIGI/KILLSIRI",
  prompt: "central voice waveform, terminal commands, completed task checklist, no readable text",
  platform: "instagram",
  businessContext,
  qualityReport: {
    status: "passed",
    width: 1080,
    height: 1350,
    warnings: [],
    brandFit: { status: "aligned", score: 80 }
  },
  modelStatus: "completed",
  modelOutput: JSON.stringify({
    score: 52,
    publishability: "background_only",
    twoSecondRead: "Generic glowing tech interface",
    problems: ["Too generic", "No strong hierarchy"],
    mustChange: ["Add product-specific layout"],
    usablePlatforms: ["instagram"],
    missingSignals: ["GIGI is not central"],
    designDirection: "Use a poster layout with real type."
  })
});

assert.strictEqual(modelHarsh.status, "background_only");
assert.strictEqual(modelHarsh.score, 52);
assert.strictEqual(scoreStatus(86), "ready_for_human_review");

console.log("vision critic ok");
