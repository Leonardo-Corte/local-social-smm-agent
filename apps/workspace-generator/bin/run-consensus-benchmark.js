#!/usr/bin/env node

const path = require("path");
const { consensusBenchmarkMarkdown, writeConsensusBenchmark } = require("../../../packages/orchestration/consensus-benchmark");

const root = path.resolve(__dirname, "../../..");
const report = writeConsensusBenchmark(root);
console.log(consensusBenchmarkMarkdown(report));
if (report.status !== "passed") {
  process.exitCode = 2;
}
