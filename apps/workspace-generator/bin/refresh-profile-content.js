#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { refreshContentFromProfile } = require("../../../packages/content-planner/profile-content");

const root = path.resolve(__dirname, "../../..");

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/refresh-profile-content.js <workspace>");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(path.join(workspaceRoot, "business/business-profile.json"))) {
    console.error(`Missing business profile for ${workspace}. Run npm run business:profile ${workspace} first.`);
    process.exit(1);
  }

  const result = refreshContentFromProfile(workspaceRoot);
  fs.writeFileSync(
    path.join(workspaceRoot, "strategy/profile-content-refresh.json"),
    `${JSON.stringify(result, null, 2)}\n`
  );
  console.log(`Profile-based content refreshed for ${workspace}: ${result.files.length} files`);
}

main();
