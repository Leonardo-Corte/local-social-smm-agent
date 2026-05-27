#!/usr/bin/env node

const path = require("path");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { writeSystemBenchmark } = require("../../../packages/benchmarks/system-benchmark");

const root = path.resolve(__dirname, "../../..");
const workspaceArg = process.argv[2] && !process.argv[2].startsWith("-") ? assertSafeWorkspaceSlug(process.argv[2]) : null;
const workspaceRoot = workspaceArg ? workspacePaths(root, workspaceArg).generated : null;
const result = writeSystemBenchmark({ root, workspaceRoot });

console.log("System benchmark suite ready");
console.log(`Status: ${result.report.status}`);
console.log(`Metrics: ${result.report.metrics.length}`);
console.log(`Report: ${path.relative(root, result.mdPath)}`);
