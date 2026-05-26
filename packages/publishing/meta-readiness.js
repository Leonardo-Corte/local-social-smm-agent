const fs = require("fs");
const path = require("path");

function readJson(workspaceRoot, relativePath, fallback = {}) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildMetaReadiness(workspaceRoot) {
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const profile = readJson(workspaceRoot, "business/business-profile.json", {});
  const platforms = profile.platforms || brief.platforms || [];
  return {
    generatedAt: new Date().toISOString(),
    projectName: profile.projectName || brief.projectName,
    status: "manual-export-ready-api-not-configured",
    automaticPublishEnabled: false,
    supportedModes: [
      "manual-export",
      "official-meta-api-assisted-after-explicit-setup"
    ],
    blockedModes: [
      "automatic publishing without human approval",
      "DM/comment/like/follow automation",
      "credential storage in generated workspace files",
      "browser bot publishing"
    ],
    platformTargets: platforms,
    officialDocs: [
      {
        label: "Instagram Graph API Content Publishing",
        url: "https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing/"
      },
      {
        label: "Pages API posts",
        url: "https://developers.facebook.com/docs/pages-api/posts/"
      },
      {
        label: "Meta permissions reference",
        url: "https://developers.facebook.com/docs/permissions/reference/"
      }
    ],
    setupChecklist: [
      "Create or choose a Meta developer app owned by the business.",
      "Connect the Facebook Page and Instagram professional account in Meta Business settings.",
      "Confirm the Instagram account is eligible for Graph API publishing.",
      "Request only the permissions required for the selected official publishing path.",
      "Keep tokens outside the generated workspace, for example in local environment variables.",
      "Run publish checks only after the exact caption, asset, and platform are human-approved.",
      "Log approver, timestamp, asset path, caption path, and platform before any official publish attempt."
    ],
    likelyPermissionAreas: [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts"
    ],
    manualExportSteps: [
      "Open the approved publishing package.",
      "Copy the approved caption and hashtags.",
      "Attach only approved media assets.",
      "Check event link, date, venue, ticket inclusions, and claims.",
      "Publish manually through Meta Business Suite, Instagram, Facebook, or LinkedIn.",
      "Record the published URL in the workspace publishing log."
    ],
    envContract: {
      META_ACCESS_TOKEN: "optional; never write token into repo files",
      META_PAGE_ID: "optional official adapter target",
      META_IG_USER_ID: "optional official adapter target",
      META_DRY_RUN: "default true until explicit human setup"
    }
  };
}

function metaReadinessMarkdown(report) {
  return `# Meta Publishing Readiness

Generated at: ${report.generatedAt}

Project: ${report.projectName}

Status: ${report.status}

Automatic publish: disabled

## Supported Modes
${report.supportedModes.map((item) => `- ${item}`).join("\n")}

## Blocked Modes
${report.blockedModes.map((item) => `- ${item}`).join("\n")}

## Official Docs To Verify During Setup
${report.officialDocs.map((item) => `- [${item.label}](${item.url})`).join("\n")}

## Setup Checklist
${report.setupChecklist.map((item) => `- [ ] ${item}`).join("\n")}

## Likely Permission Areas
These must be verified against current Meta documentation before implementation:
${report.likelyPermissionAreas.map((item) => `- ${item}`).join("\n")}

## Manual Export Steps
${report.manualExportSteps.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Environment Contract For Future Official Adapter
${Object.entries(report.envContract).map(([key, value]) => `- \`${key}\`: ${value}`).join("\n")}

## Current Decision
Manual export is the production path. The official adapter can be built later, but it must stay behind approval state, dry-run mode, and local environment variables.
`;
}

module.exports = { buildMetaReadiness, metaReadinessMarkdown };
