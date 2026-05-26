const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { resolveInside } = require("../workspace-runner/workspace-paths");
const { canTransition, requirePublishAllowed } = require("./approval-state-machine");

const REGISTRY_RELATIVE_PATH = "publishing/artifact-registry.json";
const DEFAULT_STATUS = "needs_human_review";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeRelativePath(workspaceRoot, relativePath) {
  if (!relativePath || typeof relativePath !== "string") {
    throw new Error("Artifact path is required.");
  }
  if (path.isAbsolute(relativePath) || relativePath.includes("\0")) {
    throw new Error(`Unsafe artifact path: ${relativePath}`);
  }
  const absolutePath = resolveInside(workspaceRoot, relativePath);
  return path.relative(workspaceRoot, absolutePath).split(path.sep).join("/");
}

function artifactIdFor({ path: artifactPath, sourceRun = "workspace", intent = "artifact" }) {
  return crypto
    .createHash("sha256")
    .update(`${artifactPath}|${sourceRun}|${intent}`)
    .digest("hex")
    .slice(0, 16);
}

function registryPath(workspaceRoot) {
  return resolveInside(workspaceRoot, REGISTRY_RELATIVE_PATH);
}

function emptyRegistry() {
  return {
    version: "1.0.0",
    updatedAt: nowIso(),
    artifacts: []
  };
}

function readArtifactRegistry(workspaceRoot) {
  const filePath = registryPath(workspaceRoot);
  if (!fs.existsSync(filePath)) {
    return emptyRegistry();
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return {
    version: parsed.version || "1.0.0",
    updatedAt: parsed.updatedAt || nowIso(),
    artifacts: Array.isArray(parsed.artifacts) ? parsed.artifacts : []
  };
}

function writeArtifactRegistry(workspaceRoot, registry) {
  const filePath = registryPath(workspaceRoot);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify({
    version: registry.version || "1.0.0",
    updatedAt: nowIso(),
    artifacts: Array.isArray(registry.artifacts) ? registry.artifacts : []
  }, null, 2)}\n`);
}

function normalizeArtifact(input, workspaceRoot, existing = null) {
  const artifactPath = normalizeRelativePath(workspaceRoot, input.path || input.artifactPath);
  const createdAt = existing?.createdAt || input.createdAt || nowIso();
  const sourceRun = input.sourceRun || existing?.sourceRun || "manual";
  const intent = input.intent || input.type || existing?.intent || "artifact";
  const id = input.id || existing?.id || artifactIdFor({ path: artifactPath, sourceRun, intent });
  const status = input.status || existing?.status || DEFAULT_STATUS;

  return {
    id,
    path: artifactPath,
    type: input.type || existing?.type || "draft",
    intent,
    platform: input.platform || existing?.platform || null,
    sourceRun,
    sourceAgent: input.sourceAgent || existing?.sourceAgent || null,
    appliedTarget: input.appliedTarget ? normalizeRelativePath(workspaceRoot, input.appliedTarget) : existing?.appliedTarget || null,
    status,
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    approval: input.approval || existing?.approval || null,
    metadata: {
      ...(existing?.metadata || {}),
      ...(input.metadata || {})
    },
    createdAt,
    updatedAt: nowIso()
  };
}

function registerArtifact(workspaceRoot, artifact) {
  const registry = readArtifactRegistry(workspaceRoot);
  const normalizedPath = normalizeRelativePath(workspaceRoot, artifact.path || artifact.artifactPath);
  const existingIndex = registry.artifacts.findIndex((item) => (
    item.path === normalizedPath &&
    (artifact.sourceRun ? item.sourceRun === artifact.sourceRun : true) &&
    (artifact.intent ? item.intent === artifact.intent : true)
  ));
  const existing = existingIndex >= 0 ? registry.artifacts[existingIndex] : null;
  const next = normalizeArtifact({ ...artifact, path: normalizedPath }, workspaceRoot, existing);
  if (next.status === "approved") {
    requirePublishAllowed(next);
  }
  if (existingIndex >= 0) {
    registry.artifacts[existingIndex] = next;
  } else {
    registry.artifacts.push(next);
  }
  writeArtifactRegistry(workspaceRoot, registry);
  return next;
}

function approveArtifact(workspaceRoot, artifactId, approval) {
  if (!approval || typeof approval.approver !== "string" || !approval.approver.trim()) {
    throw new Error("Human approver is required to approve an artifact.");
  }
  const registry = readArtifactRegistry(workspaceRoot);
  const index = registry.artifacts.findIndex((artifact) => artifact.id === artifactId);
  if (index < 0) {
    throw new Error(`Artifact not found: ${artifactId}`);
  }
  const current = registry.artifacts[index];
  if (!canTransition(current.status, "approved") && current.status !== "approved") {
    throw new Error(`Cannot approve artifact from status ${current.status}.`);
  }
  const next = {
    ...current,
    status: "approved",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    approval: {
      approvalMethod: "human",
      approver: approval.approver.trim(),
      approvedAt: approval.approvedAt || nowIso(),
      note: approval.note || null
    },
    updatedAt: nowIso()
  };
  requirePublishAllowed(next);
  registry.artifacts[index] = next;
  writeArtifactRegistry(workspaceRoot, registry);
  return next;
}

function rejectArtifact(workspaceRoot, artifactId, reason) {
  const registry = readArtifactRegistry(workspaceRoot);
  const index = registry.artifacts.findIndex((artifact) => artifact.id === artifactId);
  if (index < 0) {
    throw new Error(`Artifact not found: ${artifactId}`);
  }
  registry.artifacts[index] = {
    ...registry.artifacts[index],
    status: "rejected",
    rejection: {
      reason: reason || "Rejected during review.",
      rejectedAt: nowIso()
    },
    updatedAt: nowIso()
  };
  writeArtifactRegistry(workspaceRoot, registry);
  return registry.artifacts[index];
}

function isArtifactPublishable(artifact) {
  try {
    requirePublishAllowed(artifact);
    return true;
  } catch (_error) {
    return false;
  }
}

function partitionArtifactsForPublishing(registry) {
  const approved = [];
  const blocked = [];
  for (const artifact of registry.artifacts || []) {
    if (isArtifactPublishable(artifact)) {
      approved.push({ ...artifact, publishable: true });
    } else {
      blocked.push({ ...artifact, publishable: false });
    }
  }
  return { approved, blocked };
}

module.exports = {
  REGISTRY_RELATIVE_PATH,
  approveArtifact,
  isArtifactPublishable,
  partitionArtifactsForPublishing,
  readArtifactRegistry,
  registerArtifact,
  rejectArtifact,
  writeArtifactRegistry
};
