#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  approveArtifact,
  isArtifactPublishable,
  readArtifactRegistry,
  registerArtifact
} = require("../../../packages/publishing/artifact-registry");
const { requirePublishAllowed } = require("../../../packages/publishing/approval-state-machine");
const { buildPublishingPackage, publishingPackageMarkdown } = require("../../../packages/publishing/export-package");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "artifact-registry-check-"));
  const workspaceRoot = path.join(tempRoot, "workspace");
  try {
    write(path.join(workspaceRoot, "project-brief.json"), JSON.stringify({
      projectName: "Artifact Registry Check",
      platforms: ["instagram", "facebook"]
    }, null, 2));
    write(path.join(workspaceRoot, "workspace-manifest.json"), JSON.stringify({
      workspace: "artifact-registry-check"
    }, null, 2));
    write(path.join(workspaceRoot, "drafts/posts.md"), "# Draft post\n\nHuman review required.\n");

    const draft = registerArtifact(workspaceRoot, {
      path: "drafts/posts.md",
      type: "draft",
      intent: "post",
      platform: "instagram",
      sourceRun: "check-run",
      sourceAgent: "copywriter"
    });

    assert.strictEqual(draft.status, "needs_human_review");
    assert.strictEqual(draft.requiredHumanApproval, true);
    assert.strictEqual(draft.automaticPublishEnabled, false);
    assert.strictEqual(isArtifactPublishable(draft), false);

    let blocked = false;
    try {
      requirePublishAllowed({ ...draft, status: "approved" });
    } catch (error) {
      blocked = /approval metadata|approver|approval timestamp/.test(error.message);
    }
    assert.strictEqual(blocked, true, "approval without metadata must be blocked");

    const unapprovedPackage = buildPublishingPackage(workspaceRoot);
    assert.strictEqual(unapprovedPackage.publishingArtifacts.approved.length, 0);
    assert.ok(unapprovedPackage.publishingArtifacts.blocked.some((item) => item.path === "drafts/posts.md"));
    assert.ok(publishingPackageMarkdown(unapprovedPackage).includes("No artifacts are approved for export yet."));

    const approved = approveArtifact(workspaceRoot, draft.id, {
      approver: "Human QA",
      note: "Approved exact draft for manual export."
    });
    assert.strictEqual(approved.status, "approved");
    assert.strictEqual(approved.approval.approvalMethod, "human");
    assert.strictEqual(approved.approval.approver, "Human QA");
    assert.ok(approved.approval.approvedAt);
    assert.strictEqual(isArtifactPublishable(approved), true);
    requirePublishAllowed(approved);

    const approvedPackage = buildPublishingPackage(workspaceRoot);
    assert.strictEqual(approvedPackage.publishingArtifacts.approved.length, 1);
    assert.strictEqual(approvedPackage.publishingArtifacts.approved[0].path, "drafts/posts.md");
    assert.strictEqual(approvedPackage.publishingArtifacts.approved[0].approval.approver, "Human QA");
    assert.ok(publishingPackageMarkdown(approvedPackage).includes("approved by Human QA"));

    const registry = readArtifactRegistry(workspaceRoot);
    assert.strictEqual(registry.artifacts.length, 1);
    console.log("artifact registry approval gate ok");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
