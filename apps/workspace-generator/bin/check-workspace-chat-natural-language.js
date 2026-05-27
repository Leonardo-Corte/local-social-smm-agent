#!/usr/bin/env node

const assert = require("assert");
const {
  detectContentIntent,
  shouldAutoGenerateVisual,
  visualPresetForIntent,
  wantsCreativeOrchestration,
  wantsDirectImageGeneration,
  routeNaturalLanguage
} = require("./workspace-chat");
const { requestScopeGuard: adaptiveScopeGuard } = require("../../../packages/orchestration/adaptive-orchestrator");
const { requestScopeGuard: teamScopeGuard } = require("../../../packages/workflow-runner/team-orchestrator");

const messyLaunch = "ciao ora creami l annuncio su instagrm per GIGI il nuovo assistente vocale AI https://killsiri.xyz/";
const messyRoute = routeNaturalLanguage(messyLaunch);
const intent = detectContentIntent(messyLaunch);

assert.strictEqual(intent.type, "post");
assert.strictEqual(messyRoute.intent.primaryPlatform, "instagram");
assert.ok(messyRoute.needs.linkAnalysis, "URL should be routed through link analysis");
assert.ok(messyRoute.needs.visual, "Instagram launch post should need a visual");
assert.ok(messyRoute.confidence >= 80, "Messy but clear launch request should have high confidence");
assert.ok(intent.steps.includes("visuals"), "Instagram post should include visual director step");
assert.ok(shouldAutoGenerateVisual(messyLaunch, intent), "Instagram launch post should auto-generate a visual");
assert.strictEqual(visualPresetForIntent(messyLaunch, intent), "square");
assert.strictEqual(wantsDirectImageGeneration(messyLaunch), false, "launch post should trigger auto visual, not direct image-only mode");
assert.strictEqual(wantsCreativeOrchestration(messyLaunch), false, "Simple link post should not jump to full creative video workflow");

const externalGuard = adaptiveScopeGuard({
  request: messyLaunch,
  business: "# Business Profile\n\nProject: Out Of Office\n\nNetworking events in NYC.",
  linkIntel: "# Link Intelligence Report\n\nTitle: KILLSIRI — Jailbreak your life."
});
assert.match(externalGuard, /external product/i);
assert.match(externalGuard, /Do not force the workspace niche/i);
assert.match(externalGuard, /Do not include event-date/i);

const teamGuard = teamScopeGuard({
  request: messyLaunch,
  business: "# Business Profile\n\nProject: Out Of Office\n\nNetworking events in NYC.",
  linkIntel: "# Link Intelligence Report\n\nTitle: KILLSIRI — Jailbreak your life."
});
assert.strictEqual(teamGuard, externalGuard);

const ownedIntent = detectContentIntent("creami un post Instagram per Out Of Office sul prossimo evento");
assert.strictEqual(ownedIntent.type, "post");
assert.ok(shouldAutoGenerateVisual("creami un post Instagram per Out Of Office sul prossimo evento", ownedIntent));

const imageOnly = "generami una immagine premium futuristica per un assistente vocale AI";
assert.strictEqual(detectContentIntent(imageOnly).type, "image");
assert.strictEqual(wantsDirectImageGeneration(imageOnly), true);

const driveReels = "vatti a pescare questa cartella drive /Users/corte/Desktop/assets e generami 4 reel seguendo trend di X e Reddit";
const driveRoute = routeNaturalLanguage(driveReels);
assert.ok(wantsCreativeOrchestration(driveReels), "Drive + reel + trends should route to creative workflow");
assert.strictEqual(driveRoute.intent.type, "reel");
assert.ok(driveRoute.needs.video, "Drive reel request should require video work");
assert.ok(driveRoute.needs.assetIngestion, "Drive request should require asset ingestion");
assert.ok(driveRoute.intent.platforms.includes("x"));
assert.ok(driveRoute.intent.platforms.includes("reddit"));

console.log("workspace chat natural language routing ok");
