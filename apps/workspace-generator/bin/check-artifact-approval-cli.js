#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { spawnSync } = require("child_process");
const {
  readArtifactRegistry,
  registerArtifact
} = require("../../../packages/publishing/artifact-registry");

const root = path.resolve(__dirname, "../../..");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function run(args, options = {}) {
  const result = spawnSync("node", ["apps/workspace-generator/bin/manage-artifact-approval.js", ...args], {
    cwd: root,
    encoding: "utf8",
    ...options
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function main() {
  const slug = `approval-cli-${Date.now()}`;
  const workspaceRoot = workspacePaths(root, slug).generated;
  try {
    write(path.join(workspaceRoot, "workspace-manifest.json"), JSON.stringify({ workspace: slug }, null, 2));
    write(path.join(workspaceRoot, "drafts/posts.md"), "# Draft\n");
    const first = registerArtifact(workspaceRoot, {
      path: "drafts/posts.md",
      type: "draft",
      intent: "post",
      platform: "instagram",
      sourceRun: "approval-cli-check",
      sourceAgent: "copywriter"
    });

    const listed = run([slug, "list"]);
    assert.ok(listed.stdout.includes(first.id));
    assert.ok(listed.stdout.includes("needs_human_review"));

    run([slug, "approve", "--id", first.id, "--approver", "CLI Human", "--note", "Checked exact draft."]);
    let registry = readArtifactRegistry(workspaceRoot);
    assert.strictEqual(registry.artifacts[0].status, "approved");
    assert.strictEqual(registry.artifacts[0].approval.approver, "CLI Human");

    run([slug, "reject", "--id", first.id, "--reason", "Needs rewrite."]);
    registry = readArtifactRegistry(workspaceRoot);
    assert.strictEqual(registry.artifacts[0].status, "rejected");
    assert.strictEqual(registry.artifacts[0].rejection.reason, "Needs rewrite.");

    console.log("artifact approval CLI ok");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
}

main();
