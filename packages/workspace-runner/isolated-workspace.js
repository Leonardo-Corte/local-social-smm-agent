const fs = require("fs");
const path = require("path");

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function readJson(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function createIsolatedWorkspace({ root, sourceWorkspace }) {
  const generatedRoot = path.join(root, "workspaces/generated-projects");
  const sourceRoot = path.join(generatedRoot, sourceWorkspace);
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source workspace not found: ${sourceWorkspace}`);
  }

  const isolatedWorkspace = `${sourceWorkspace}--workflow-${timestampId()}`;
  const isolatedRoot = path.join(generatedRoot, isolatedWorkspace);
  fs.cpSync(sourceRoot, isolatedRoot, {
    recursive: true,
    filter(source) {
      const relativePath = path.relative(sourceRoot, source);
      const firstSegment = relativePath.split(path.sep)[0];
      return !["workflow-runs", "versions"].includes(firstSegment);
    }
  });

  const manifestPath = path.join(isolatedRoot, "workspace-manifest.json");
  const manifest = readJson(manifestPath);
  writeJson(manifestPath, {
    ...manifest,
    workspaceSlug: isolatedWorkspace,
    workspaceKind: "workflow-sandbox",
    sourceWorkspace,
    isolatedCreatedAt: new Date().toISOString(),
    lastWorkflowRun: null,
    lastWorkflowStatus: null
  });

  return {
    sourceWorkspace,
    isolatedWorkspace,
    sourceRoot,
    isolatedRoot
  };
}

module.exports = { createIsolatedWorkspace };
