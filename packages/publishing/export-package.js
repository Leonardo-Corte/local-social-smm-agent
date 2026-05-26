const fs = require("fs");
const path = require("path");
const {
  partitionArtifactsForPublishing,
  readArtifactRegistry,
  registerArtifact
} = require("./artifact-registry");

function readText(workspaceRoot, relativePath) {
  const filePath = path.join(workspaceRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(workspaceRoot, relativePath, fallback) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const knownDraftArtifacts = [
  { key: "calendar", path: "calendar/30-day-calendar.md", type: "calendar", intent: "content-calendar" },
  { key: "posts", path: "drafts/posts.md", type: "draft", intent: "post" },
  { key: "carousels", path: "drafts/carousels.md", type: "draft", intent: "carousel" },
  { key: "reels", path: "drafts/reels.md", type: "draft", intent: "reel" },
  { key: "threads", path: "drafts/threads.md", type: "draft", intent: "x", platform: "x" },
  { key: "reddit", path: "drafts/reddit.md", type: "draft", intent: "reddit", platform: "reddit" },
  { key: "platformAdaptations", path: "drafts/platform-adaptations.md", type: "draft", intent: "platform" },
  { key: "checklist", path: "publishing/publishing-checklist.md", type: "checklist", intent: "publishing" },
  { key: "metaReadiness", path: "publishing/meta-readiness.md", type: "checklist", intent: "meta-readiness" }
];

function syncKnownDraftArtifacts(workspaceRoot) {
  const existing = readArtifactRegistry(workspaceRoot);
  const existingPaths = new Set(existing.artifacts.map((artifact) => artifact.path));
  for (const artifact of knownDraftArtifacts) {
    if (!fs.existsSync(path.join(workspaceRoot, artifact.path))) {
      continue;
    }
    if (existingPaths.has(artifact.path)) {
      continue;
    }
    registerArtifact(workspaceRoot, {
      ...artifact,
      sourceRun: "workspace-bootstrap",
      sourceAgent: "publishing-operator",
      status: "needs_human_review",
      metadata: {
        reason: "Known workspace artifact discovered by publishing package builder."
      }
    });
  }
}

function buildPublishingPackage(workspaceRoot) {
  syncKnownDraftArtifacts(workspaceRoot);
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const manifest = readJson(workspaceRoot, "workspace-manifest.json", {});
  const quality = readJson(workspaceRoot, "review/quality-gate.json", null);
  const artifactRegistry = readArtifactRegistry(workspaceRoot);
  const publishingArtifacts = partitionArtifactsForPublishing(artifactRegistry);
  const status = publishingArtifacts.approved.length > 0
    ? "approved-artifacts-ready-for-manual-export"
    : "needs-human-approval";
  return {
    generatedAt: new Date().toISOString(),
    projectName: brief.projectName,
    platforms: brief.platforms || [],
    status,
    automaticPublishEnabled: false,
    requiredHumanApproval: true,
    artifactRegistry,
    publishingArtifacts,
    qualityStatus: quality ? quality.status : "missing",
    approvalChecks: [
      "Human approved this exact caption/script/asset.",
      "Claims and proof points are verified.",
      "No DM/comment/like/follow automation is requested.",
      "No X reply/DM/follow/like automation or Reddit posting/commenting/voting automation is requested.",
      "Reddit subreddit rules are checked before any Reddit draft is used.",
      "Platform format and asset dimensions are checked.",
      "Manual or official Meta path is selected."
    ],
    artifacts: {
      calendar: readText(workspaceRoot, "calendar/30-day-calendar.md"),
      posts: readText(workspaceRoot, "drafts/posts.md"),
      carousels: readText(workspaceRoot, "drafts/carousels.md"),
      reels: readText(workspaceRoot, "drafts/reels.md"),
      threads: readText(workspaceRoot, "drafts/threads.md"),
      reddit: readText(workspaceRoot, "drafts/reddit.md"),
      platformAdaptations: readText(workspaceRoot, "drafts/platform-adaptations.md"),
      checklist: readText(workspaceRoot, "publishing/publishing-checklist.md"),
      metaReadiness: readText(workspaceRoot, "publishing/meta-readiness.md")
    },
    manifest
  };
}

function publishingPackageMarkdown(pkg) {
  const approvedArtifacts = pkg.publishingArtifacts?.approved || [];
  const blockedArtifacts = pkg.publishingArtifacts?.blocked || [];
  return `# Publishing Package

Project: ${pkg.projectName}

Status: ${pkg.status}

Automatic publish: disabled

Human approval required: yes

Approved exportable artifacts: ${approvedArtifacts.length}

Blocked draft artifacts: ${blockedArtifacts.length}

Quality status: ${pkg.qualityStatus}

## Approval Checks
${pkg.approvalChecks.map((item) => `- [ ] ${item}`).join("\n")}

## Manual Publishing Path
- Export approved captions/scripts from this package.
- Prepare assets manually or through local generation.
- Review in Meta Business Suite, X, Reddit, LinkedIn, or the platform UI as appropriate.
- Publish only after final human approval.

## Approved Exportable Artifacts
${approvedArtifacts.length > 0 ? approvedArtifacts.map((item) => `- ${item.path} (${item.intent}${item.platform ? ` / ${item.platform}` : ""}) approved by ${item.approval.approver} at ${item.approval.approvedAt}`).join("\n") : "No artifacts are approved for export yet."}

## Draft Artifacts Blocked Until Approval
${blockedArtifacts.length > 0 ? blockedArtifacts.map((item) => `- ${item.path} (${item.intent}${item.platform ? ` / ${item.platform}` : ""}) status: ${item.status}; human approval required`).join("\n") : "No blocked draft artifacts."}

## Meta Readiness
${pkg.artifacts.metaReadiness || "Run `npm run publishing:meta <workspace>` to generate the Meta readiness checklist."}

## Calendar
${pkg.artifacts.calendar}

## Posts
${pkg.artifacts.posts}

## Carousels
${pkg.artifacts.carousels}

## Reels
${pkg.artifacts.reels}

## X / Twitter Drafts
${pkg.artifacts.threads || "No X drafts generated for this workspace."}

## Reddit Drafts
${pkg.artifacts.reddit || "No Reddit drafts generated for this workspace."}

## Platform Adaptations
${pkg.artifacts.platformAdaptations || "No platform adaptation notes generated."}
`;
}

module.exports = { buildPublishingPackage, publishingPackageMarkdown };
