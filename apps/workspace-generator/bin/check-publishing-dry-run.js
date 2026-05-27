#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { approveArtifact, registerArtifact } = require("../../../packages/publishing/artifact-registry");
const { buildPublishingDryRun, writePublishingDryRun } = require("../../../packages/publishing/dry-run-publisher");

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "publishing-dry-run-check-"));
try {
  const workspaceRoot = path.join(tempRoot, "workspace");
  fs.mkdirSync(path.join(workspaceRoot, "drafts"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "workspace-manifest.json"), "{}\n");
  fs.writeFileSync(path.join(workspaceRoot, "drafts/post.md"), "# Post\n");

  const artifact = registerArtifact(workspaceRoot, {
    path: "drafts/post.md",
    type: "draft",
    intent: "post",
    status: "needs_human_review",
    sourceRun: "check",
    sourceAgent: "test"
  });
  const blocked = buildPublishingDryRun({ workspaceRoot, artifactId: artifact.id, platform: "instagram" });
  assert.strictEqual(blocked.status, "blocked");
  assert.ok(blocked.blockers.some((item) => item.includes("human-approved")));

  approveArtifact(workspaceRoot, artifact.id, { approver: "Human QA" });
  const passed = buildPublishingDryRun({ workspaceRoot, artifactId: artifact.id, platform: "instagram" });
  assert.strictEqual(passed.status, "dry_run_passed");
  assert.strictEqual(passed.automaticPublishEnabled, false);
  const paths = writePublishingDryRun({ workspaceRoot, report: passed });
  assert.ok(fs.existsSync(paths.mdPath));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("publishing dry run ok");
