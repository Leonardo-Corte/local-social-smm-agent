#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

function usage() {
  console.error("Usage: node apps/workspace-generator/bin/record-feedback.js --workspace <slug> --artifact <path> --feedback <text> [--preference <text>] [--target <path>]");
}

function argValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function appendMarkdown(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, content);
}

function main() {
  const args = process.argv.slice(2);
  const workspace = argValue(args, "--workspace");
  const artifact = argValue(args, "--artifact");
  const feedback = argValue(args, "--feedback");
  const preference = argValue(args, "--preference") || "";
  const target = argValue(args, "--target") || artifact;

  if (!workspace || !artifact || !feedback) {
    usage();
    process.exit(2);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const now = new Date().toISOString();
  const feedbackPath = path.join(workspaceRoot, "memory/user-feedback.md");
  appendMarkdown(feedbackPath, `
## ${now}
- Artifact: ${artifact}
- Feedback: ${feedback}
- Preference learned: ${preference || "Not specified"}
- Regeneration target: ${target}
`);

  const preferencesPath = path.join(workspaceRoot, "memory/preferences.json");
  const preferences = readJson(preferencesPath, { preferences: [], rejectedPatterns: [], approvedPatterns: [] });
  if (preference) {
    preferences.preferences.push({
      learnedAt: now,
      artifact,
      preference
    });
  }
  writeJson(preferencesPath, preferences);

  const queuePath = path.join(workspaceRoot, "memory/regeneration-queue.json");
  const queue = readJson(queuePath, { tasks: [] });
  queue.tasks.push({
    createdAt: now,
    artifact,
    feedback,
    target,
    status: "pending"
  });
  writeJson(queuePath, queue);

  console.log(`Recorded feedback for ${workspace}: ${target}`);
}

main();
