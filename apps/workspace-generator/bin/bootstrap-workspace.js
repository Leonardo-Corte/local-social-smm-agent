#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

function run(script, args) {
  const result = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/bootstrap-workspace.js <workspace>");
    process.exit(1);
  }

  run("apps/workspace-generator/bin/route-models.js", [workspace]);
  run("apps/workspace-generator/bin/build-business-profile.js", [workspace]);
  run("apps/workspace-generator/bin/build-platform-playbooks.js", [workspace]);
  run("apps/workspace-generator/bin/build-agent-contracts.js", [workspace]);
  run("apps/workspace-generator/bin/refresh-profile-content.js", [workspace]);
  run("apps/workspace-generator/bin/run-trend-research.js", [workspace]);
  run("apps/workspace-generator/bin/run-persona-sim.js", [workspace]);
  run("apps/workspace-generator/bin/build-image-plan.js", [workspace]);
  run("apps/workspace-generator/bin/run-quality-gate.js", [workspace]);
  run("apps/workspace-generator/bin/build-meta-readiness.js", [workspace]);
  run("apps/workspace-generator/bin/build-publishing-package.js", [workspace]);
  run("apps/workspace-generator/bin/export-client-report.js", [workspace]);
  run("apps/workspace-generator/bin/snapshot-workspace.js", [workspace, "--reason", "bootstrap"]);
  run("apps/workspace-generator/bin/export-client-workspace.js", [workspace]);

  console.log(`Workspace bootstrap complete: workspaces/generated-projects/${workspace}`);
  console.log(`Clean client workspace: workspaces/client-workspaces/${workspace}`);
  console.log(`Start file: workspaces/client-workspaces/${workspace}/START_HERE.md`);
}

main();
