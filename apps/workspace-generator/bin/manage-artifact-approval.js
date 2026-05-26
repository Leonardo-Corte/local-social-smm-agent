#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const {
  approveArtifact,
  readArtifactRegistry,
  rejectArtifact
} = require("../../../packages/publishing/artifact-registry");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function printUsage() {
  console.log(`Usage:
  npm run publishing:artifacts <workspace> -- list
  npm run publishing:artifacts <workspace> -- approve --id <artifact-id> --approver "Name" [--note "..."]
  npm run publishing:artifacts <workspace> -- reject --id <artifact-id> --reason "..."

This command only changes local approval metadata. It never publishes.`);
}

function requireWorkspace(workspace) {
  if (!workspace) {
    printUsage();
    process.exit(1);
  }
  const paths = workspacePaths(root, workspace);
  if (!fs.existsSync(paths.generatedFile("workspace-manifest.json"))) {
    throw new Error(`Workspace not found: ${workspace}`);
  }
  return paths.generated;
}

function artifactLine(artifact) {
  const approval = artifact.approval && artifact.approval.approver
    ? ` approved by ${artifact.approval.approver}`
    : "";
  return [
    artifact.id,
    artifact.status,
    artifact.intent || artifact.type || "artifact",
    artifact.platform || "-",
    artifact.path,
    approval
  ].join(" | ");
}

function listArtifacts(workspaceRoot) {
  const registry = readArtifactRegistry(workspaceRoot);
  if (!registry.artifacts.length) {
    console.log("No artifacts registered yet.");
    return;
  }
  console.log("id | status | intent | platform | path | approval");
  console.log("--- | --- | --- | --- | --- | ---");
  for (const artifact of registry.artifacts) {
    console.log(artifactLine(artifact));
  }
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  const command = args[1] || "list";
  const workspaceRoot = requireWorkspace(workspace);

  if (command === "list") {
    listArtifacts(workspaceRoot);
    return;
  }

  const id = valueAfter(args, "--id");
  if (!id) {
    throw new Error("Missing --id <artifact-id>.");
  }

  if (command === "approve") {
    const approver = valueAfter(args, "--approver");
    if (!approver) {
      throw new Error("Missing --approver \"Name\" for human approval.");
    }
    const artifact = approveArtifact(workspaceRoot, id, {
      approver,
      note: valueAfter(args, "--note") || null
    });
    console.log(`Approved artifact: ${artifactLine(artifact)}`);
    return;
  }

  if (command === "reject") {
    const artifact = rejectArtifact(workspaceRoot, id, valueAfter(args, "--reason") || "Rejected by human reviewer.");
    console.log(`Rejected artifact: ${artifactLine(artifact)}`);
    return;
  }

  printUsage();
  throw new Error(`Unknown command: ${command}`);
}

main();
