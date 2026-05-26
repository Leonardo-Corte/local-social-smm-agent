#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");
const { buildCapCutDraft, buildCommandPlan, readCapCutPlan, findDraftsDir } = require("../../../packages/capcut-agent/capcut-adapter");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function main() {
  const args = process.argv.slice(2);
  const rawWorkspace = args[0];
  if (!rawWorkspace) {
    console.error("Usage: npm run capcut:generate <workspace> -- [--name <draft-name>] [--drafts <dir>] [--dry-run]");
    process.exit(1);
  }
  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;

  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const name = valueAfter(args, "--name");
  const draftsDir = valueAfter(args, "--drafts");
  const dryRun = args.includes("--dry-run");

  if (dryRun) {
    let result;
    try {
      result = buildCapCutDraft({ workspaceRoot, name, draftsDir, dryRun: true });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    const detected = findDraftsDir();
    console.log(`\nDry run — CapCut draft generation plan for ${workspace}\n`);
    console.log(`CapCut Drafts: ${detected || "(not found — install CapCut first)"}`);
    console.log(`Draft name:    ${name || "(auto-generated)"}`);
    if (result.fallbackPlan) {
      console.log(`\n  NOTE: capcut-plan.json was auto-generated from drafts/reels.md (no existing plan found).`);
    }
    if (result.videoPlaceholder) {
      console.log(`\n  WARNING: No video source found.`);
      console.log(`  After creation, open CapCut and drag your video file onto Track 1.`);
    }
    console.log(`\nCommands to execute (${result.commandPlan.length} steps):`);
    for (let i = 0; i < result.commandPlan.length; i++) {
      const cmd = result.commandPlan[i];
      const prefix = cmd.warning ? "  !" : `  ${i + 1}.`;
      console.log(`${prefix} [${cmd.op}] ${cmd.label}`);
      if (cmd.warningNote) console.log(`       ^ ${cmd.warningNote}`);
    }
    console.log("\nRun without --dry-run to create the draft.");
    return;
  }

  console.log(`\nBuilding CapCut draft for workspace: ${workspace}`);

  let result;
  try {
    result = buildCapCutDraft({ workspaceRoot, name, draftsDir });
  } catch (err) {
    console.error(`\nFailed: ${err.message}`);
    process.exit(1);
  }

  console.log(`\nStatus:     ${result.status}`);
  console.log(`Draft name: ${result.draftName}`);
  console.log(`Location:   ${result.projectDir}`);
  if (result.videoPlaceholder) {
    console.log(`\n  !! VIDEO PLACEHOLDER — no source video was added.`);
    console.log(`  !! Open CapCut, drag your video onto Track 1, then adjust overlay timing.`);
  }
  console.log(`\nSteps (${result.log.length}):`);
  for (const step of result.log) {
    const icon = step.status === "ok" ? "✓" : step.status === "warning" ? "!" : step.status === "skipped" ? "–" : "✗";
    console.log(`  ${icon} [${step.op}] ${step.status}${step.reason ? ` — ${step.reason}` : ""}${step.text ? ` — "${step.text}"` : ""}`);
    if (step.warning) console.log(`      ^ WARNING: ${step.warning}`);
  }

  console.log(`\nArtifact: ${result.artifact.id} (${result.artifact.status})`);
  console.log(`\nOpen CapCut — the draft "${result.draftName}" should appear in your project list.`);
  console.log(`Review, adjust, and render before publishing.`);
}

main();
