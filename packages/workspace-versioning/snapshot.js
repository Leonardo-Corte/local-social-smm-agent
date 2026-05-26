const fs = require("fs");
const path = require("path");

const includePaths = [
  "project-brief.json",
  "workspace-manifest.json",
  "strategy/content-pillars.md",
  "calendar/30-day-calendar.md",
  "drafts/posts.md",
  "drafts/carousels.md",
  "drafts/reels.md",
  "creative/visual-briefs.md",
  "simulation/persona-report.md",
  "review/qa-recap.md",
  "review/quality-gate.md",
  "publishing/export-package.md",
  "client-report/report.md",
  "memory/preferences.json",
  "memory/regeneration-queue.json"
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function copyIfExists(workspaceRoot, snapshotRoot, relativePath) {
  const source = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(source)) {
    return null;
  }
  const target = path.join(snapshotRoot, "files", relativePath);
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return relativePath;
}

function createSnapshot({ workspaceRoot, reason = "manual snapshot" }) {
  const snapshotId = timestampId();
  const snapshotRoot = path.join(workspaceRoot, "versions", snapshotId);
  const copied = includePaths
    .map((relativePath) => copyIfExists(workspaceRoot, snapshotRoot, relativePath))
    .filter(Boolean);

  const manifest = readJson(path.join(workspaceRoot, "workspace-manifest.json"), {});
  const quality = readJson(path.join(workspaceRoot, "review/quality-gate.json"), null);
  const snapshot = {
    snapshotId,
    createdAt: new Date().toISOString(),
    reason,
    workspace: manifest.workspaceSlug || path.basename(workspaceRoot),
    projectName: manifest.projectName,
    lastWorkflowStatus: manifest.lastWorkflowStatus || null,
    qualityStatus: quality ? quality.status : null,
    qualityScore: quality ? quality.score : null,
    copiedFiles: copied
  };
  writeJson(path.join(snapshotRoot, "snapshot.json"), snapshot);

  const indexPath = path.join(workspaceRoot, "versions/index.json");
  const index = readJson(indexPath, { snapshots: [] });
  index.snapshots.push(snapshot);
  writeJson(indexPath, index);
  return { snapshotRoot, snapshot };
}

module.exports = { createSnapshot, includePaths };
