#!/usr/bin/env node

const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const { writeVideoOutputComparison } = require("../../../packages/video-engines/video-output-comparison");

const root = path.resolve(__dirname, "../../..");
const workspace = process.argv[2] || "sample-local-social-team";
const workspaceRoot = workspacePaths(root, workspace).generated;
const result = writeVideoOutputComparison({ workspaceRoot });

console.log(`Video output comparison ready for ${workspace}`);
console.log(`Status: ${result.report.status}`);
console.log(`Candidates: ${result.report.candidates.length}`);
console.log(`Report: ${path.relative(root, result.mdPath)}`);
