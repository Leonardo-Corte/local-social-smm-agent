#!/usr/bin/env node

const assert = require("assert");
const { TRAINING_PACKS, trainingPackMarkdown } = require("../../../packages/agents/training-packs");

const requiredAgents = [
  "visual-director",
  "critic-qa",
  "reel-shorts-producer",
  "capcut-editor",
  "platform-strategist",
  "copywriter"
];

for (const agentId of requiredAgents) {
  const pack = TRAINING_PACKS[agentId];
  assert.ok(pack, `missing training pack for ${agentId}`);
  assert.ok(pack.purpose && pack.purpose.length > 20, `${agentId} missing purpose`);
  assert.ok(pack.outputContract.length >= 4, `${agentId} output contract too weak`);
  assert.ok(pack.rejectionRules.length >= 3, `${agentId} rejection rules too weak`);
  assert.ok(Object.keys(pack.rubric).length >= 4, `${agentId} rubric too weak`);
  assert.ok(pack.goodExamples.length >= 3, `${agentId} needs good examples`);
  assert.ok(pack.badExamples.length >= 3, `${agentId} needs bad examples`);
  const markdown = trainingPackMarkdown(agentId);
  assert.match(markdown, /Specialist Memory Layer/);
  assert.match(markdown, /Rejection Rules/);
  assert.match(markdown, /Scoring Rubric/);
}

assert.ok(trainingPackMarkdown("unknown-agent") === "");

console.log("agent training packs ok");
