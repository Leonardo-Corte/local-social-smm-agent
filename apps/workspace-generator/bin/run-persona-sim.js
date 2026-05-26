#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const {
  regenerationTasksFromSimulation,
  simulateDrafts,
  simulationMarkdown
} = require("../../../packages/persona-sim/persona-engine");

const root = path.resolve(__dirname, "../../..");

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

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const brief = readJson(path.join(workspaceRoot, "project-brief.json"), {});
  const postsPath = path.join(workspaceRoot, "drafts/posts.md");
  const draftMarkdown = fs.existsSync(postsPath) ? fs.readFileSync(postsPath, "utf8") : "";
  const result = simulateDrafts(brief, draftMarkdown);

  fs.mkdirSync(path.join(workspaceRoot, "simulation"), { recursive: true });
  writeJson(path.join(workspaceRoot, "simulation/persona-report.json"), result);
  fs.writeFileSync(path.join(workspaceRoot, "simulation/persona-report.md"), simulationMarkdown(result));

  const queuePath = path.join(workspaceRoot, "memory/regeneration-queue.json");
  const queue = readJson(queuePath, { tasks: [] });
  const existing = new Set(queue.tasks.map((task) => `${task.source}:${task.feedback}:${task.target}`));
  for (const task of regenerationTasksFromSimulation(result)) {
    const key = `${task.source}:${task.feedback}:${task.target}`;
    if (!existing.has(key)) {
      queue.tasks.push(task);
    }
  }
  writeJson(queuePath, queue);

  console.log(`Wrote persona simulation for ${workspace}: ${result.evaluations.length} evaluations`);
}

main();
