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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(workspaceRoot, relativePath, content) {
  const filePath = path.join(workspaceRoot, relativePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function profileContext(workspaceRoot) {
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const profile = readJson(workspaceRoot, "business/business-profile.json", {});
  return {
    projectName: profile.projectName || brief.projectName || "Untitled Project",
    positioning: profile.cleanedPositioning || brief.niche || "",
    primaryAudience: profile.audience?.primary || brief.targetAudience || "",
    secondaryAudience: profile.audience?.secondary || "",
    venueBuyer: profile.audience?.venueBuyer || "",
    offer: profile.offer || brief.offer || "",
    valueProposition: profile.valueProposition || "",
    goals: profile.goals30Days || [brief.primaryGoal30Days].filter(Boolean),
    platforms: normalizePlatforms(profile.platforms || brief.platforms || []),
    tone: profile.tone || [brief.tone].filter(Boolean),
    proofToVerify: profile.currentProofToVerify || [],
    approvalOwners: profile.approvalOwners || brief.approvalPolicy || "Human approval required",
    openQuestions: profile.openQuestions || []
  };
}

function contentAngles(ctx) {
  return [
    "Why networking feels easier when the room is curated",
    "What a better after-work networking night looks like in NYC",
    "The difference between stiff conferences and real social connection",
    "A night designed for corporate people who still want actual fun",
    "What venues gain when the right professional crowd shows up",
    "How to walk into the room without feeling awkward",
    "Why food, drinks, and warm energy make networking more natural",
    "Behind the scenes of building a room people want to stay in",
    "A recap angle built from real event footage",
    "A direct ticket CTA for the next confirmed event"
  ].map((angle) => `${ctx.projectName}: ${angle}`);
}

function buildCalendar(ctx) {
  const formats = ["Reel", "Carousel", "Static post", "Story sequence"];
  if (ctx.platforms.includes("facebook")) {
    formats.push("Facebook event/community post");
  }
  if (ctx.platforms.includes("linkedin")) {
    formats.push("LinkedIn authority post");
  }
  if (ctx.platforms.includes("x")) {
    formats.push("X single post", "X mini-thread");
  }
  if (ctx.platforms.includes("reddit")) {
    formats.push("Reddit discussion prompt");
  }
  const pillars = ["Desire", "Proof", "Education", "Behind the scenes", "Offer", "Venue buyer"];
  const angles = contentAngles(ctx);
  const rows = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const format = formats[index % formats.length];
    const pillar = pillars[index % pillars.length];
    const topic = angles[index % angles.length];
    return `| ${day} | ${pillar} | ${format} | ${topic} | Draft -> QA -> human approval |`;
  });
  return `# 30-Day Content Calendar

Goal: ${ctx.goals.join(" ")}

Audience: ${ctx.primaryAudience}

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function buildPosts(ctx) {
  return `# Draft Posts

## Post 1: The Room
Hook: Networking in New York should not feel like a conference lobby.

Body: ${ctx.projectName} is built for people who want useful professional connections without losing the social energy of a good night out. The promise is simple: a curated room, interesting people, food and drinks when confirmed for the event, and a setting that makes starting conversations easier.

CTA: Join the community or grab a ticket for the next confirmed event.

Safety note: Confirm event date, venue, ticket inclusions, and link before publishing.

## Post 2: Venue Angle
Hook: A strong event is not just traffic. It is the right room.

Body: For New York venues, ${ctx.projectName} can position events around qualified professional attendance, social energy, and food and drink spend. Any attendance number or venue result must be verified before it becomes a public claim.

CTA: Ask about hosting a future ${ctx.projectName} event.

Safety note: Do not publish attendance claims unless a human confirms the exact proof.
`;
}

function buildCarousels(ctx) {
  return `# Carousel Drafts

## Carousel 1: Why This Room Works
1. Networking is easier when the room is curated.
2. People stay longer when the event feels social, not transactional.
3. Food, drinks, and a strong venue make conversation more natural.
4. The best events create both professional value and a good night out.
5. ${ctx.projectName} is built for New York people who want both.

CTA slide: Join the community or check the next event link.

## Carousel 2: Before You Buy A Ticket
1. Who is this for? Corporate professionals, founders, operators, creatives, and ambitious people in NYC.
2. What is the vibe? Premium, warm, confident, and social.
3. What is included? Confirm the exact event details before publishing.
4. Why come? Meet interesting people in a setting designed to make connection easier.
5. Final CTA: Save the date once venue, time, and ticket details are confirmed.
`;
}

function buildReels(ctx) {
  return `# Reel Scripts

## Reel 1: Event Recap
Opening hook: "This is what networking in New York should feel like."
Beat 1: Fast cuts of people arriving, greetings, venue energy.
Beat 2: Show conversations, food/drinks if visible and confirmed.
Beat 3: Show the room feeling active and curated.
Caption angle: A better room for people who want real-life connections after work.
CTA: Join the community or get the next ticket.
Safety note: Only mention food/drink inclusions if confirmed for that event.

## Reel 2: Anti-Stiff Networking
Opening hook: "No stiff conference energy. Just the right people in the right room."
Beat 1: Show relaxed conversations.
Beat 2: Cut to venue atmosphere.
Beat 3: End with next-event CTA card.
Caption angle: Professional networking can feel warm, social, and genuinely worth showing up for.
CTA: Link in bio / Luma link after human approval.

## Reel 3: Venue Buyer
Opening hook: "What if your venue could host a room people actually want to stay in?"
Beat 1: Show full-room energy if available.
Beat 2: Show hospitality details.
Beat 3: Mention verified event traffic only after approval.
CTA: Contact ${ctx.projectName} about hosting.
Safety note: Keep attendance and spend claims out unless proof is attached.
`;
}

function buildVisualBriefs(ctx) {
  return `# Visual Briefs

## Brand Feel
- Premium but not cold.
- New York evening energy.
- Warm hospitality lighting.
- Candid professional conversations.
- Social proof through real room energy, not exaggerated claims.

## Asset Priorities
1. Real event video clips and photos.
2. Clean reel thumbnails with short human-added text.
3. Carousel backgrounds with large empty typography zones.
4. Venue and crowd detail shots.

## Local Image Generation Prompts
Use these only as drafts and keep generated text out of the image:
- Premium New York networking event, stylish professionals in a warm venue, candid social energy, editorial photography, no readable text.
- After-work professional social event in NYC, drinks, conversation, polished hospitality atmosphere, realistic lighting, no readable text.
- Editorial carousel background for networking tips, elegant venue details, clean negative space, no readable text.

## Review Rules
- Prefer real event footage over synthetic imagery when selling tickets.
- Generated imagery must be labeled internally with model/source metadata.
- Human approval is required before use in publishing packages.
`;
}

function buildThreads(ctx) {
  return `# X / Twitter Drafts

## Single Post 1: NYC Networking POV
Hook: Most networking events in New York feel like work after work. The room has to earn your evening.

Body: ${ctx.projectName} should position each event around a simple tension: corporate people want useful connections, but they also want a night that feels alive. The best X angle is a sharp observation first, ticket CTA second.

CTA: Join the community when the next event link is approved.

Approval blockers:
- Confirm next event date, venue, and link before CTA.
- Do not imply guaranteed outcomes or unverified attendee quality.

## Mini-Thread 1: Why The Room Matters
1. Networking works better when the room is curated and the energy is social.
2. People do not just buy access. They buy the chance to walk into a room where conversation feels easier.
3. For NYC professionals, after-work time is expensive. The event has to feel worth leaving the office for.
4. ${ctx.projectName} should show the vibe, the people, and the reason to come back.
5. CTA after approval: next event link / community signup.

Approval blockers:
- Confirm any ticket inclusions before mentioning food or drinks.
- Keep attendance numbers out unless human-confirmed for this exact post.
`;
}

function buildRedditDrafts(ctx) {
  return `# Reddit Drafts

## Community-First Post Template
Target subreddit: [human selects subreddit]

Title option: NYC professionals: what makes a networking event actually worth showing up to?

Body:
I am working on ${ctx.projectName}, a New York event concept for professionals who want networking to feel less stiff and more social.

Before pushing harder on promotion, I want to understand what people here actually dislike about networking events in NYC:

- What makes an event feel worth the time?
- What makes it feel like a waste?
- Do food, drinks, venue, or attendee curation change whether you would go?

Not trying to spam a link here. Looking for honest feedback before shaping the next event.

Approval blockers:
- Human must check subreddit rules before posting.
- Remove or rewrite if the subreddit does not allow market research, events, or self-reference.
- Do not include ticket links unless that subreddit explicitly allows promotion.

## Reddit Research Notes
- Use Reddit mainly for objections, language, and community truth.
- Drafts should feel like a real conversation, not an ad.
- When in doubt, ask for feedback instead of selling.
`;
}

function buildPlatformAdaptations(ctx) {
  return `# Platform Adaptations

## Instagram
- Lead with real event footage, fast hook, social proof through vibe.
- Best draft files: drafts/reels.md, drafts/carousels.md, drafts/posts.md.

## Facebook
- Add clearer logistics, event context, and shareable community framing.
- Best draft files: drafts/posts.md and publishing/publishing-checklist.md.

${ctx.platforms.includes("linkedin") ? `## LinkedIn
- Use professional credibility, founder/operator logic, and venue buyer value.
- Avoid hype; write like a sharp business note.
` : ""}
${ctx.platforms.includes("x") ? `## X / Twitter
- Compress the idea into POV, tension, or timely observation.
- Use single posts and short threads; do not paste Instagram captions unchanged.
- Best draft file: drafts/threads.md.
` : ""}
${ctx.platforms.includes("reddit") ? `## Reddit
- Community-first, rule-aware, transparent, and low-promo.
- Use discussion prompts and feedback requests before ticket CTAs.
- Best draft file: drafts/reddit.md.
` : ""}
`;
}

function refreshContentFromProfile(workspaceRoot) {
  const ctx = profileContext(workspaceRoot);
  writeFile(workspaceRoot, "calendar/30-day-calendar.md", buildCalendar(ctx));
  writeFile(workspaceRoot, "drafts/posts.md", buildPosts(ctx));
  writeFile(workspaceRoot, "drafts/carousels.md", buildCarousels(ctx));
  writeFile(workspaceRoot, "drafts/reels.md", buildReels(ctx));
  writeFile(workspaceRoot, "drafts/platform-adaptations.md", buildPlatformAdaptations(ctx));
  if (ctx.platforms.includes("x")) {
    writeFile(workspaceRoot, "drafts/threads.md", buildThreads(ctx));
  }
  if (ctx.platforms.includes("reddit")) {
    writeFile(workspaceRoot, "drafts/reddit.md", buildRedditDrafts(ctx));
  }
  writeFile(workspaceRoot, "creative/visual-briefs.md", buildVisualBriefs(ctx));
  const files = [
    "calendar/30-day-calendar.md",
    "drafts/posts.md",
    "drafts/carousels.md",
    "drafts/reels.md",
    "drafts/platform-adaptations.md",
    "creative/visual-briefs.md"
  ];
  if (ctx.platforms.includes("x")) {
    files.push("drafts/threads.md");
  }
  if (ctx.platforms.includes("reddit")) {
    files.push("drafts/reddit.md");
  }
  return {
    generatedAt: new Date().toISOString(),
    projectName: ctx.projectName,
    files
  };
}

module.exports = {
  refreshContentFromProfile,
  profileContext,
  buildCalendar,
  buildPosts,
  buildCarousels,
  buildReels,
  buildThreads,
  buildRedditDrafts,
  buildPlatformAdaptations,
  buildVisualBriefs
};
