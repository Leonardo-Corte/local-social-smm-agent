#!/usr/bin/env node

const assert = require("assert");
const path = require("path");
const { buildFinalSystemStatus } = require("../../../packages/roadmap/final-system-status");

const root = path.resolve(__dirname, "../../..");
const status = buildFinalSystemStatus(root);

assert.ok(status.totalTasks > 20, "expected a detailed task plan");
assert.ok(status.integrations.length >= 6, "expected integration risk matrix");
assert.ok(status.phases.some((phase) => phase.title.includes("ComfyUI")), "expected ComfyUI phase");
assert.ok(status.nextCriticalTasks.length > 0 || status.status === "complete", "expected next tasks unless complete");

console.log("final system status ok");
