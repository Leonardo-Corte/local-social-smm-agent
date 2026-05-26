#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { runBenchmark } = require("../../../packages/model-benchmark/benchmark");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function listAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return [];
  }
  const values = [];
  for (let i = index + 1; i < args.length; i++) {
    if (args[i].startsWith("-")) {
      break;
    }
    for (const part of args[i].split(",")) {
      const trimmed = part.trim();
      if (trimmed) {
        values.push(trimmed);
      }
    }
  }
  return values;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] || "sample-local-social-team";
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const timeoutMs = valueAfter(args, "--timeout-ms") ? Number(valueAfter(args, "--timeout-ms")) : 120000;
  const selectedModels = listAfter(args, "--models");
  const report = await runBenchmark({ workspaceRoot, workspace, selectedModels, timeoutMs });
  console.log(`Model benchmark ready for ${workspace}`);
  console.log(`Models tested: ${report.models.length}`);
  console.log(`Report: ${path.relative(root, path.join(workspaceRoot, "model-benchmarks/latest.md"))}`);
  for (const [agent, model] of Object.entries(report.recommendations)) {
    console.log(`${agent}: ${model || "no recommendation"}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
