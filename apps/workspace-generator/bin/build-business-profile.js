#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildBusinessProfile, businessProfileMarkdown } = require("../../../packages/business-profile/profile");

const root = path.resolve(__dirname, "../../..");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/build-business-profile.js <workspace>");
    process.exit(1);
  }
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(path.join(workspaceRoot, "project-brief.json"))) {
    console.error(`Missing project brief for ${workspace}`);
    process.exit(1);
  }
  const profile = buildBusinessProfile(workspaceRoot);
  ensureDir(path.join(workspaceRoot, "business"));
  fs.writeFileSync(path.join(workspaceRoot, "business/business-profile.json"), `${JSON.stringify(profile, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "business/business.md"), businessProfileMarkdown(profile));
  console.log(`Business profile ready: workspaces/generated-projects/${workspace}/business/business.md`);
}

main();
