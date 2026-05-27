#!/usr/bin/env node

const assert = require("assert");
const { runConsensusBenchmark } = require("../../../packages/orchestration/consensus-benchmark");

const report = runConsensusBenchmark();
assert.strictEqual(report.status, "passed");
assert.ok(report.cases.every((item) => item.delta > 0));
console.log("consensus benchmark ok");
