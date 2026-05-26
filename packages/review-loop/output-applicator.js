const fs = require("fs");
const path = require("path");
const { auditContentPolicy } = require("./content-policy");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function appendText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, content);
}

function extractProposedArtifact(markdown) {
  const text = String(markdown || "");
  const headerMatch = text.match(/^#{2,3}\s+Proposed Artifact\s*$/im);
  if (!headerMatch) {
    return null;
  }

  const afterHeader = text.slice(headerMatch.index + headerMatch[0].length);
  const fenced = afterHeader.match(/```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```/);
  if (fenced && fenced[1].trim().length > 0) {
    return fenced[1].replace(/\s+$/, "\n");
  }

  const nextHeaderIndex = afterHeader.search(/^#{1,3}\s+/m);
  const body = nextHeaderIndex === -1 ? afterHeader : afterHeader.slice(0, nextHeaderIndex);
  const cleaned = body.trim();
  return cleaned.length > 0 ? `${cleaned}\n` : null;
}

function safeTargetPath(workspaceRoot, target) {
  const absolute = path.resolve(workspaceRoot, target);
  if (!absolute.startsWith(path.resolve(workspaceRoot) + path.sep)) {
    throw new Error(`Unsafe target path: ${target}`);
  }
  return absolute;
}

function validateProposedArtifact(content) {
  const audit = auditContentPolicy(content);
  const hits = audit.blockers.map((finding) => finding.id);
  return {
    valid: hits.length === 0,
    blockedPatterns: hits,
    warnings: audit.warnings.map((finding) => finding.id)
  };
}

function backupTarget(workspaceRoot, target, runId) {
  const sourcePath = safeTargetPath(workspaceRoot, target);
  if (!fs.existsSync(sourcePath)) {
    return null;
  }
  const backupPath = path.join(workspaceRoot, "review/applied-patches", runId, target.replace(/[\\/]/g, "__"));
  ensureDir(path.dirname(backupPath));
  fs.copyFileSync(sourcePath, backupPath);
  return path.relative(workspaceRoot, backupPath);
}

function applyTask({ workspaceRoot, task, runId, dryRun }) {
  if (task.status !== "pending" || task.action !== "regenerate_artifact") {
    return { ...task };
  }

  const outputPath = safeTargetPath(workspaceRoot, task.artifact);
  if (!fs.existsSync(outputPath)) {
    return {
      ...task,
      status: "missing_output_artifact",
      processedAt: new Date().toISOString()
    };
  }

  const proposed = extractProposedArtifact(fs.readFileSync(outputPath, "utf8"));
  if (!proposed) {
    return {
      ...task,
      status: "no_applicable_patch",
      processedAt: new Date().toISOString(),
      note: "No Proposed Artifact section with a complete replacement was found."
    };
  }

  const validation = validateProposedArtifact(proposed);
  if (!validation.valid) {
    return {
      ...task,
      status: "blocked_by_artifact_policy",
      processedAt: new Date().toISOString(),
      blockedPatterns: validation.blockedPatterns,
      note: "Proposed Artifact contains unapproved sales claims or CTA language."
    };
  }

  const targetPath = safeTargetPath(workspaceRoot, task.target);
  const backup = backupTarget(workspaceRoot, task.target, runId);
  if (!dryRun) {
    ensureDir(path.dirname(targetPath));
    fs.writeFileSync(targetPath, proposed);
  }

  return {
    ...task,
    status: dryRun ? "patch_preview_ready" : "applied_needs_human_review",
    processedAt: new Date().toISOString(),
    backup,
    patchMode: "full_replace_from_proposed_artifact",
    requiredHumanApproval: true
  };
}

function applyQueuedOutputs({ workspaceRoot, dryRun = false }) {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const queuePath = path.join(workspaceRoot, "memory/regeneration-queue.json");
  const queue = readJson(queuePath, { tasks: [] });
  const nextTasks = queue.tasks.map((task) => applyTask({ workspaceRoot, task, runId, dryRun }));
  if (!dryRun) {
    writeJson(queuePath, { tasks: nextTasks });
  }

  const changed = nextTasks.filter((task) => task.processedAt && ["patch_preview_ready", "applied_needs_human_review", "no_applicable_patch", "missing_output_artifact"].includes(task.status));
  appendText(path.join(workspaceRoot, "review/regeneration-log.md"), `
## ${new Date().toISOString()}
Output applicator run: ${dryRun ? "dry-run" : "apply"}
Processed tasks: ${changed.length}
${changed.map((task) => `- ${task.target}: ${task.status}`).join("\n")}
`);

  return { runId, tasks: nextTasks, processed: changed };
}

module.exports = { applyQueuedOutputs, extractProposedArtifact, validateProposedArtifact };
