const fs = require("fs");
const path = require("path");
const { normalizePlatforms } = require("../platform-intel/platform-playbooks");

function readJson(workspaceRoot, relativePath, fallback = {}) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function inferTone(brief) {
  const raw = cleanText(brief.tone).toLowerCase();
  if (!raw || /fallo tu|non lo so|boh|bho|scegli/i.test(raw)) {
    return ["premium", "social", "confident", "warm", "New York energy"];
  }
  return cleanText(brief.tone).split(",").map((item) => cleanText(item)).filter(Boolean);
}

function buildBusinessProfile(workspaceRoot) {
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const platforms = normalizePlatforms(brief.platforms);
  const tone = inferTone(brief);

  const niche = cleanText(brief.niche);
  const targetAudience = cleanText(brief.targetAudience);
  const offer = cleanText(brief.offer);
  const primaryGoal = cleanText(brief.primaryGoal30Days);
  const approvalOwners = cleanText(brief.approvalPolicy) || "Human approval required";
  const constraints = Array.isArray(brief.constraints) ? brief.constraints.filter((c) => typeof c === "string") : [];
  const availableAssets = Array.isArray(brief.availableAssets) ? brief.availableAssets : [];

  const positioningMissing = !niche && !targetAudience && !offer;

  return {
    projectName: brief.projectName || "Untitled Project",
    businessType: niche || "[Business type not yet defined — add niche to project-brief.json]",
    cleanedPositioning: positioningMissing
      ? "[Positioning not yet defined — describe your niche, audience, and offer in the interview]"
      : [niche, offer, targetAudience].filter(Boolean).join(" | "),
    audience: {
      primary: targetAudience || "[Primary audience not yet defined — add targetAudience to project-brief.json]",
      secondary: "[Add secondary audience in the project brief if needed]",
      venueBuyer: "[Add any third-party buyer or distribution channel in the project brief if needed]"
    },
    offer: offer || "[Offer not yet defined — add offer to project-brief.json]",
    valueProposition: offer || "[Value proposition not yet defined — add offer to project-brief.json]",
    currentProofToVerify: availableAssets.length > 0
      ? availableAssets.map((asset) => `Available asset: ${asset} — verify before using in public claims.`)
      : ["No assets listed yet — add availableAssets to project-brief.json."],
    goals30Days: primaryGoal
      ? [primaryGoal]
      : ["[30-day goal not yet defined — add primaryGoal30Days to project-brief.json]"],
    platforms,
    tone,
    approvalOwners,
    publishingRules: [
      "Do not publish automatically.",
      "Do not automate DMs, comments, likes, or follows.",
      "Do not automate X/Reddit replies, votes, follows, DMs, or account-facing scraping.",
      "For Reddit, check subreddit rules and community norms before drafting any public post.",
      "Do not invent attendance numbers, guest identities, partnerships, pricing, food/drink inclusions, or venue claims.",
      ...constraints,
      `All final content must be approved by: ${approvalOwners}.`
    ],
    openQuestions: [
      "What are the confirmed facts vs. aspirational claims in the brief?",
      "What is the exact offer, pricing, or ticket details — confirm before publishing?",
      "Which social handles, pages, or communities should be connected?",
      "What competitors or references should the system research?",
      "What is the next event, launch, or milestone date if applicable?"
    ]
  };
}

function businessProfileMarkdown(profile) {
  return `# Business Profile

Project: ${profile.projectName}

## Clean Positioning
${profile.cleanedPositioning}

## Business Type
${profile.businessType}

## Audiences
- Primary audience: ${profile.audience.primary}
- Secondary audience: ${profile.audience.secondary}
- Venue buyer: ${profile.audience.venueBuyer}

## Offer
${profile.offer}

## Value Proposition
${profile.valueProposition}

## 30-Day Goals
${profile.goals30Days.map((goal) => `- ${goal}`).join("\n")}

## Platforms
${profile.platforms.map((platform) => `- ${platform}`).join("\n")}

## Brand Tone
${profile.tone.map((tone) => `- ${tone}`).join("\n")}

## Proof And Claims To Verify
${profile.currentProofToVerify.map((item) => `- ${item}`).join("\n")}

## Approval Owners
${profile.approvalOwners}

## Publishing Rules
${profile.publishingRules.map((rule) => `- ${rule}`).join("\n")}

## Open Questions The Agent Should Ask Proactively
${profile.openQuestions.map((question) => `- ${question}`).join("\n")}

## Agent Behavior
- First, infer and clean obvious spelling or wording issues from the interview.
- Ask the human only when a missing detail changes facts, claims, pricing, event logistics, or publishing approval.
- If content is too generic, proactively rewrite it with the business profile above.
- If an asset is uploaded, extract what can be safely observed and separate observed facts from assumptions.
- Never tell the human to fix messy wording when the intent is clear; normalize it and continue.
`;
}

module.exports = { buildBusinessProfile, businessProfileMarkdown };
