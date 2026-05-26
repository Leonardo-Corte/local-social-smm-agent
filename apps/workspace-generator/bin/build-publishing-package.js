#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { buildPublishingPackage, publishingPackageMarkdown } = require("../../../packages/publishing/export-package");
const { buildReadyGuide } = require("../../../packages/publishing/ready-guide");
const { workspacePaths, assertSafeWorkspaceSlug } = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function main() {
  const rawWorkspace = process.argv[2] || "sample-local-social-team";
  const workspace = assertSafeWorkspaceSlug(rawWorkspace);
  const paths = workspacePaths(root, workspace);
  const workspaceRoot = paths.generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }
  const pkg = buildPublishingPackage(workspaceRoot);
  fs.mkdirSync(path.join(workspaceRoot, "publishing"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "publishing/export-package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "publishing/export-package.md"), publishingPackageMarkdown(pkg));
  console.log(`Publishing package ready for ${workspace}: ${pkg.status}`);
  console.log(`Approved exportable artifacts: ${pkg.publishingArtifacts.approved.length}`);
  console.log(`Blocked draft artifacts: ${pkg.publishingArtifacts.blocked.length}`);

  const guide = buildReadyGuide(workspaceRoot);
  console.log(`\nReady guide: ${path.relative(workspaceRoot, guide.outputDir)}/`);
  for (const g of guide.generated) {
    const flag = g.hasAdaptedCopy ? "✓" : "!";
    console.log(`  ${flag} ${g.label}: ${g.file}`);
  }
  if (guide.generated.some((g) => !g.hasAdaptedCopy)) {
    console.log(`\n  NOTE: Some platforms lack adapted copy. Run npm run team:adaptive with platform-adapt step.`);
  }
}

main();
