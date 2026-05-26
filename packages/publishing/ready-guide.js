const fs = require("fs");
const path = require("path");
const { registerArtifact } = require("./artifact-registry");

const PLATFORM_GUIDES = {
  instagram: {
    label: "Instagram",
    optimalTimes: ["Mon–Fri 11am–1pm", "Tue–Fri 7pm–9pm"],
    formats: { post: "JPEG/PNG 1080×1080 (1:1)", reel: "MP4 1080×1920 (9:16) max 90s", story: "MP4/PNG 1080×1920 (9:16)" },
    checklist: [
      "Caption reviewed and approved by human",
      "Hashtags checked (not banned, relevant)",
      "Reel/image asset ready and within size limits",
      "CTA link set (bio link, sticker, or pinned comment)",
      "Accessibility: alt text added for images",
      "Brand voice verified against guidelines"
    ]
  },
  x: {
    label: "X / Twitter",
    optimalTimes: ["Mon–Thu 9am–11am", "Wed 5pm–6pm"],
    formats: { image: "JPEG/PNG 1200×675 (16:9)", video: "MP4 max 2:20, 1920×1200" },
    checklist: [
      "Thread reviewed — each tweet ≤ 280 chars",
      "No automated replies, follows, or likes planned",
      "Image/video attached if applicable",
      "Link included (if applicable — shortener optional)",
      "Thread numbering is correct (1/, 2/, etc.)"
    ]
  },
  facebook: {
    label: "Facebook",
    optimalTimes: ["Wed 11am–1pm", "Thu–Fri 1pm–4pm"],
    formats: { post: "JPEG/PNG 1200×628 (1.91:1) or 1080×1080", video: "MP4 max 240min, 1080p" },
    checklist: [
      "Post text reviewed and approved",
      "Link preview checked (title + image)",
      "Tagged accounts verified if any",
      "Audience targeting configured if boosting",
      "No automated comment/reply bots planned"
    ]
  },
  reddit: {
    label: "Reddit",
    optimalTimes: ["Mon–Fri 6am–8am EST", "Sat–Sun 7am–9am EST"],
    formats: { image: "JPEG/PNG max 20MB", video: "MP4 max 15min" },
    checklist: [
      "Post reviewed for authenticity — no marketing speak",
      "Correct subreddit(s) confirmed and rules read",
      "No vote manipulation planned",
      "No automation for posting, commenting, or voting",
      "Disclosure added if promoting own product/service",
      "Title is within 300 chars and non-clickbait"
    ]
  },
  linkedin: {
    label: "LinkedIn",
    optimalTimes: ["Tue–Thu 7am–8am", "Tue–Thu 12pm–1pm"],
    formats: { image: "PNG/JPEG 1200×627 (1.91:1)", video: "MP4 max 10min, 3–300MB" },
    checklist: [
      "Post text reviewed and approved (professional tone)",
      "Hashtags verified (3–5 relevant professional tags)",
      "CTA is clear and non-spammy",
      "LinkedIn article vs. post decision confirmed",
      "Images or document attached if applicable"
    ]
  }
};

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function extractPlatformAdaptations(workspaceRoot) {
  const mdPath = path.join(workspaceRoot, "drafts", "platform-adaptations.md");
  if (!fs.existsSync(mdPath)) return {};
  const src = readText(mdPath);
  const results = {};

  for (const [platform, guide] of Object.entries(PLATFORM_GUIDES)) {
    const regex = new RegExp(`## ${guide.label}[\\s\\S]*?` + "```" + `([\\s\\S]*?)` + "```", "i");
    const match = src.match(regex);
    if (match) results[platform] = match[1].trim();
  }

  return results;
}

function extractHashtags(text) {
  return (text.match(/#\w+/g) || []).slice(0, 15);
}

function buildPlatformSection(platform, guide, adaptedText, reelsDraft, projectName) {
  const text = adaptedText || `[No adapted ${platform} copy found — run platform-adapt step first]`;
  const hashtags = extractHashtags(text);

  const lines = [
    `# ${guide.label} — Publishing Guide`,
    ``,
    `> Human approval required before posting. This is NOT an automated publish.`,
    ``,
    `## Approved Content`,
    ``,
    "```",
    text,
    "```",
    ``,
    `## Hashtags`,
    hashtags.length > 0
      ? hashtags.map((h) => `- \`${h}\``).join("\n")
      : `- [Add relevant ${platform} hashtags]`,
    ``,
    `## Optimal Posting Times`,
    guide.optimalTimes.map((t) => `- ${t}`).join("\n"),
    ``,
    `## Asset Formats`,
    Object.entries(guide.formats).map(([type, spec]) => `- **${type}**: ${spec}`).join("\n"),
    ``,
    `## Pre-Publish Checklist`,
    guide.checklist.map((item) => `- [ ] ${item}`).join("\n"),
    ``,
    `## CTA`,
    `- [ ] Confirm CTA link/action before posting`,
    `- [ ] CTA: [LINK] — replace with real URL`,
    ``,
    `## Final Approval`,
    `- [ ] Human reviewer sign-off`,
    `- [ ] Post approved for ${projectName || "this project"}`
  ];

  return lines.join("\n");
}

function buildReadyGuide(workspaceRoot, { platforms, runId } = {}) {
  const briefPath = path.join(workspaceRoot, "project-brief.json");
  const brief = fs.existsSync(briefPath) ? JSON.parse(readText(briefPath)) : {};
  const projectName = brief.projectName || path.basename(workspaceRoot);

  const adaptations = extractPlatformAdaptations(workspaceRoot);
  const reelsDraft = readText(path.join(workspaceRoot, "drafts", "reels.md"));

  const ts = new Date().toISOString().slice(0, 10);
  const resolvedRunId = runId || `ready-${ts}`;
  const outputDir = path.join(workspaceRoot, "publishing", `ready-${ts}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const targetPlatforms = platforms || Object.keys(PLATFORM_GUIDES);
  const generated = [];

  for (const platform of targetPlatforms) {
    const guide = PLATFORM_GUIDES[platform];
    if (!guide) continue;
    const text = buildPlatformSection(platform, guide, adaptations[platform], reelsDraft, projectName);
    const outFile = path.join(outputDir, `${platform}.md`);
    fs.writeFileSync(outFile, text);
    generated.push({ platform, label: guide.label, file: path.relative(workspaceRoot, outFile), hasAdaptedCopy: Boolean(adaptations[platform]) });
  }

  const indexLines = [
    `# Publishing Package — ${projectName}`,
    ``,
    `Date: ${ts}`,
    `Run: ${resolvedRunId}`,
    ``,
    `> All items require human approval before publishing.`,
    ``,
    `## Platform Guides`,
    generated.map((g) => `- [${g.label}](./${path.basename(g.file)})${g.hasAdaptedCopy ? "" : " ⚠ no adapted copy"}`).join("\n"),
    ``,
    `## Status`,
    generated.map((g) => `- [ ] ${g.label}: approved`).join("\n"),
    ``,
    `## Assets Needed`,
    `- [ ] Video file (MP4, 1080×1920 for Reels)`,
    `- [ ] Thumbnail image (JPEG, 1080×1080)`,
    `- [ ] Cover image (JPEG, 1080×1920)`,
    ``
  ];
  fs.writeFileSync(path.join(outputDir, "index.md"), indexLines.join("\n"));

  const artifact = registerArtifact(workspaceRoot, {
    path: `publishing/ready-${ts}/index.md`,
    type: "publishing-package",
    intent: "publishing",
    platform: null,
    sourceRun: resolvedRunId,
    sourceAgent: "ready-guide",
    status: "needs_human_review",
    metadata: {
      platforms: generated.map((g) => g.platform),
      hasAdaptedCopy: generated.filter((g) => g.hasAdaptedCopy).map((g) => g.platform),
      outputDir: path.relative(workspaceRoot, outputDir)
    }
  });

  return { outputDir, generated, artifact, ts };
}

module.exports = { buildReadyGuide, PLATFORM_GUIDES };
