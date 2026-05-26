#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

const requiredFiles = [
  "workspace-manifest.json",
  "project-brief.json",
  "model-profile.json",
  "model-routing-report.json",
  "model-routing-report.md",
  "memory/user-feedback.md",
  "memory/preferences.json",
  "memory/regeneration-queue.json",
  "agents/intake-strategist.md",
  "agents/market-researcher.md",
  "agents/brand-strategist.md",
  "agents/content-planner.md",
  "agents/copywriter.md",
  "agents/reel-shorts-producer.md",
  "agents/visual-director.md",
  "agents/compliance-platform-guardian.md",
  "agents/publishing-operator.md",
  "agents/analyst.md",
  "agents/persona-simulator.md",
  "agents/critic-qa.md",
  "agents/memory-curator.md",
  "skills/skill-map.md",
  "skills/social-media-context-sms.md",
  "skills/content-calendar-sms.md",
  "skills/post-writer-sms.md",
  "skills/platform-compliance-guardian.md",
  "skills/human-approved-publishing.md",
  "skills/persona-panel-simulation.md",
  "strategy/content-pillars.md",
  "calendar/30-day-calendar.md",
  "drafts/posts.md",
  "drafts/carousels.md",
  "drafts/reels.md",
  "creative/visual-briefs.md",
  "publishing/publishing-checklist.md",
  "publishing/export-package.md",
  "publishing/export-package.json",
  "simulation/persona-report.md",
  "simulation/persona-report.json",
  "review/qa-recap.md",
  "review/quality-gate.md",
  "review/quality-gate.json",
  "sources/source-registry.md"
  ,"operations/task-plan.md",
  "research/trend-report.md",
  "research/trend-research-plan.json",
  "review/regeneration-log.md"
  ,"client-report/report.md"
];

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(workspaceRoot, file)));
  if (missing.length > 0) {
    console.error(`Missing ${missing.length} required files:`);
    for (const file of missing) {
      console.error(`- ${file}`);
    }
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(workspaceRoot, "workspace-manifest.json"), "utf8"));
  if (manifest.automaticPublishEnabled !== false || manifest.requiredHumanApproval !== true) {
    console.error("Publishing safety defaults are not valid.");
    process.exit(1);
  }

  console.log(`OK workspace ${workspace}: ${requiredFiles.length} required files and safe publishing defaults`);
}

main();
