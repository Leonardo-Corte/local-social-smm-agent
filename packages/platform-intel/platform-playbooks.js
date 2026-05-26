const fs = require("fs");
const path = require("path");

function readJson(workspaceRoot, relativePath, fallback = {}) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizePlatform(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return "";
  }
  if (/^(ig|insta|instagram|intagram)$/.test(text)) {
    return "instagram";
  }
  if (/^(fb|facebook)$/.test(text)) {
    return "facebook";
  }
  if (/^(li|linkedin|linked in)$/.test(text)) {
    return "linkedin";
  }
  if (/^(x|twitter|twitter\/x|x\/twitter)$/.test(text)) {
    return "x";
  }
  if (/^(reddit|subreddit|reddits)$/.test(text)) {
    return "reddit";
  }
  return text.replace(/\s+/g, "-");
}

function normalizePlatforms(platforms) {
  const raw = Array.isArray(platforms) ? platforms : String(platforms || "").split(/[,;/]/);
  return [...new Set(raw.map(normalizePlatform).filter(Boolean))];
}

const basePlaybooks = {
  instagram: {
    name: "Instagram",
    researchFocus: [
      "Reel hook patterns in the first 1-3 seconds",
      "Carousel save/share angles",
      "Creator/competitor visual pacing, thumbnails, and caption CTAs"
    ],
    formatRules: [
      "Prefer Reels, carousels, stories, and strong visual proof.",
      "Lead with a visual or emotional hook before explaining.",
      "Keep claims proof-aware and use real event footage whenever possible."
    ],
    audienceBehavior: [
      "Skims fast, reacts to vibe, saves useful lists, shares social proof.",
      "Needs to feel the room before trusting the ticket CTA."
    ],
    automationPolicy: [
      "No auto likes, comments, follows, DMs, or account scraping.",
      "Publishing stays manual or official Meta route after human approval."
    ],
    draftTargets: ["drafts/reels.md", "drafts/carousels.md", "drafts/posts.md"]
  },
  facebook: {
    name: "Facebook",
    researchFocus: [
      "Event page language, local community questions, venue/event objections",
      "Longer context captions and logistics clarity",
      "Community proof and shareable event recaps"
    ],
    formatRules: [
      "Use clearer logistics and community context than Instagram.",
      "Make the value obvious for attendees and venue buyers.",
      "Avoid automated group posting or comment activity."
    ],
    audienceBehavior: [
      "Responds to event details, social context, trust, and practical clarity.",
      "May share with friends or local groups when the value is obvious."
    ],
    automationPolicy: [
      "No group scraping or automated group posting.",
      "Publishing package is draft-only until human approval."
    ],
    draftTargets: ["drafts/posts.md", "publishing/publishing-checklist.md"]
  },
  linkedin: {
    name: "LinkedIn",
    researchFocus: [
      "Professional networking pain points",
      "Founder/operator/corporate event narratives",
      "Venue/business development angles"
    ],
    formatRules: [
      "Write with professional credibility, not hype.",
      "Use a clear point of view, useful context, and thoughtful CTA.",
      "Keep the event feeling premium and credible."
    ],
    audienceBehavior: [
      "Evaluates status, relevance, credibility, and professional upside.",
      "Responds to thoughtful posts, founder notes, and behind-the-scenes business logic."
    ],
    automationPolicy: [
      "No automated connection requests, DMs, comments, likes, or scraping.",
      "Use manual review and approved copy only."
    ],
    draftTargets: ["drafts/posts.md", "drafts/messages.md"]
  },
  x: {
    name: "X / Twitter",
    researchFocus: [
      "Short text hooks, strong POVs, timely cultural or local conversation angles",
      "Thread structure for event lessons, NYC social observations, and networking takes",
      "Quote-friendly one-liners and reply-worthy questions"
    ],
    formatRules: [
      "Prefer sharp single posts, mini-threads, and conversation prompts.",
      "Open with a point of view, tension, or specific NYC observation.",
      "Do not reuse Instagram captions as-is; X needs text-first velocity and compression."
    ],
    audienceBehavior: [
      "Rewards clarity, wit, novelty, timeliness, and discussion.",
      "Corporate/event audiences need a useful take before a ticket CTA."
    ],
    automationPolicy: [
      "No automated replies, DMs, follows, likes, or login-based scraping.",
      "Use public/manual research links and draft-only posting unless an official approved API path is configured."
    ],
    draftTargets: ["drafts/threads.md", "drafts/platform-adaptations.md"]
  },
  reddit: {
    name: "Reddit",
    researchFocus: [
      "Subreddit-specific rules, pain language, objections, and recurring questions",
      "NYC community discussions around networking, loneliness, professional events, and venues",
      "What sounds helpful versus promotional inside each subreddit"
    ],
    formatRules: [
      "Reddit drafts must be community-first, transparent, and low-promo.",
      "Lead with a genuine question, useful insight, or request for feedback.",
      "Every draft must name the subreddit rule check as an approval blocker."
    ],
    audienceBehavior: [
      "Rejects obvious ads and generic marketing.",
      "Responds to specificity, honesty, usefulness, and respect for subreddit norms."
    ],
    automationPolicy: [
      "No automated posting, commenting, voting, DMs, or subreddit scraping beyond public low-rate research.",
      "A human must check subreddit rules and approve each post before any account action."
    ],
    draftTargets: ["drafts/reddit.md", "drafts/platform-adaptations.md"]
  }
};

function buildPlatformPlaybooks(workspaceRoot) {
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const profile = readJson(workspaceRoot, "business/business-profile.json", {});
  const platforms = normalizePlatforms(profile.platforms?.length ? profile.platforms : brief.platforms);
  const selected = platforms.length > 0 ? platforms : ["instagram", "facebook"];
  const playbooks = selected.map((platform) => {
    const base = basePlaybooks[platform] || {
      name: platform,
      researchFocus: ["Study public format expectations and audience norms before drafting."],
      formatRules: ["Create draft-only content adapted to this platform after human review."],
      audienceBehavior: ["Audience behavior must be validated with research."],
      automationPolicy: ["No account-facing automation without explicit reviewed integration."],
      draftTargets: ["drafts/platform-adaptations.md"]
    };
    return {
      id: platform,
      ...base
    };
  });
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    projectName: profile.projectName || brief.projectName || "Untitled Project",
    platforms: selected,
    playbooks,
    globalRules: [
      "Every agent must adapt research, format, voice, CTA, and approval blockers to the target platform.",
      "Do not cross-post the same copy unchanged across platforms.",
      "No automatic publishing, DMs, comments, likes, follows, or account-facing scraping.",
      "If a platform has community-specific rules, the human approval gate must verify them before use."
    ]
  };
}

function platformPlaybooksMarkdown(report) {
  return `# Platform Playbooks

Project: ${report.projectName}

Generated at: ${report.generatedAt}

## Global Rules
${report.globalRules.map((rule) => `- ${rule}`).join("\n")}

${report.playbooks.map((platform) => `## ${platform.name} (\`${platform.id}\`)

### Research Focus
${platform.researchFocus.map((item) => `- ${item}`).join("\n")}

### Format Rules
${platform.formatRules.map((item) => `- ${item}`).join("\n")}

### Audience Behavior
${platform.audienceBehavior.map((item) => `- ${item}`).join("\n")}

### Automation Policy
${platform.automationPolicy.map((item) => `- ${item}`).join("\n")}

### Draft Targets
${platform.draftTargets.map((item) => `- ${item}`).join("\n")}
`).join("\n")}
`;
}

function writePlatformPlaybooks(workspaceRoot, report) {
  ensureDir(path.join(workspaceRoot, "platforms"));
  fs.writeFileSync(path.join(workspaceRoot, "platforms/platform-playbooks.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "platforms/platform-playbooks.md"), platformPlaybooksMarkdown(report));
}

module.exports = {
  buildPlatformPlaybooks,
  normalizePlatform,
  normalizePlatforms,
  platformPlaybooksMarkdown,
  writePlatformPlaybooks
};
