const TRAINING_PACKS = {
  "visual-director": {
    version: "1.0.0",
    purpose: "Turn business context into controlled visual direction, not generic AI aesthetics.",
    outputContract: [
      "name the concrete product/category metaphor",
      "separate generated background from deterministic layout/text",
      "produce 3 prompt variants: safe, bold, experimental",
      "state platform crop and safe-area needs",
      "state why the idea is not generic"
    ],
    rejectionRules: [
      "reject generic cyberpunk, neon city, vague AI dashboard, and faceless futuristic atmosphere unless the business specifically sells that world",
      "reject prompts that rely on readable generated text",
      "reject visuals with no focal subject or no product metaphor",
      "reject anything below platform minimum resolution as final artwork"
    ],
    rubric: {
      productClarity: "0-25: product/category is visible in two seconds",
      brandSpecificity: "0-25: visual belongs to this business, not any AI startup",
      composition: "0-20: focal point, safe area, hierarchy, crop",
      productionControl: "0-20: clear backend/workflow/variant instructions",
      approvalSafety: "0-10: flags claims, logos, text, people, and platform risks"
    },
    goodExamples: [
      "GIGI: central waveform becomes terminal commands and completed task checklist, with empty safe area for headline overlay.",
      "Out Of Office: real event photo contact sheet plus editorial crop map, no fake crowd claims.",
      "Launch visual: no baked text, strong negative space, product metaphor in the center."
    ],
    badExamples: [
      "futuristic neon city, AI vibes, blue/pink lights",
      "glowing dashboard with fake unreadable UI text",
      "beautiful 4K cyberpunk background with no brand or product cue"
    ]
  },
  "critic-qa": {
    version: "1.0.0",
    purpose: "Block weak work before it reaches the user as publishable output.",
    outputContract: [
      "give a pass/block/background-only verdict",
      "name exact reasons",
      "separate deterministic checks from taste judgment",
      "require human approval for anything public"
    ],
    rejectionRules: [
      "block visuals that do not communicate the business in two seconds",
      "block posts where generated text is the main readable message",
      "block generic AI art unless explicitly marked as background-only",
      "block unverifiable claims, fake proof, fake metrics, fake scarcity, or platform-risky actions"
    ],
    rubric: {
      clarity: "0-25: can a stranger understand the offer/product fast",
      platformFit: "0-20: correct format, crop, CTA, audience mode",
      evidence: "0-20: claims are sourced or approval-gated",
      creativeQuality: "0-25: hierarchy, specificity, tension, non-generic execution",
      safety: "0-10: publishing/policy guardrails"
    },
    goodExamples: [
      "Blocked: image looks like generic AI city and does not show GIGI, voice, agent, developer, or execution.",
      "Background-only: good mood, but needs rendered headline and product UI overlay.",
      "Ready for human review: platform crop correct, real text rendered, claims approval-gated."
    ],
    badExamples: [
      "Looks cool, use it",
      "Probably fine for Instagram",
      "The vibe is futuristic so it matches AI"
    ]
  },
  "reel-shorts-producer": {
    version: "1.0.0",
    purpose: "Turn a business objective and assets into a short-form video structure that an editor can build.",
    outputContract: [
      "first 3 seconds hook",
      "scene-by-scene storyboard",
      "asset needs per scene",
      "overlay text max 8 words per beat",
      "sound and pacing direction",
      "approval blockers"
    ],
    rejectionRules: [
      "reject reel scripts without visible beats",
      "reject hooks that explain instead of interrupt",
      "reject unavailable assets unless clearly marked as needed",
      "reject copyrighted music assumptions"
    ],
    rubric: {
      hook: "0-25: first 3 seconds are specific and visual",
      pacing: "0-20: scene timing and cuts are clear",
      assetUse: "0-20: uses real/provided assets before inventing",
      platformFit: "0-20: fits Reels/Shorts/TikTok style and safe areas",
      approvalSafety: "0-15: clear blockers and claim safety"
    },
    goodExamples: [
      "0.0-2.2s: close-up glitch waveform, overlay 'SIRI WAITS.'",
      "2.2-5.5s: terminal task completes, overlay 'GIGI ACTS.'",
      "End card: CTA placeholder pending human-approved link."
    ],
    badExamples: [
      "Start with an intro explaining what the product is",
      "Add trending music",
      "Make it viral and futuristic"
    ]
  },
  "capcut-editor": {
    version: "1.0.0",
    purpose: "Translate a storyboard into an edit manifest a human or local adapter can build.",
    outputContract: [
      "exact overlay text",
      "start/duration timing in seconds",
      "position and animation",
      "caption source",
      "sound direction and volume",
      "adapter readiness notes"
    ],
    rejectionRules: [
      "reject overlay text over 10 words",
      "reject overlapping timings unless intentionally layered",
      "reject live CTA links unless approved",
      "reject edit plans without source asset paths or placeholders"
    ],
    rubric: {
      editability: "0-30: exact enough for CapCut/FFmpeg/adapter",
      readability: "0-20: overlay length and contrast",
      timing: "0-20: hook and pacing",
      audio: "0-15: sound/caption plan",
      approvalSafety: "0-15: blockers and asset rights"
    },
    goodExamples: [
      "{\"at\":0,\"duration\":2.2,\"text\":\"SIRI WAITS.\",\"position\":\"center\",\"animation\":\"cut\"}",
      "{\"at\":2.2,\"duration\":2.4,\"text\":\"GIGI ACTS.\",\"position\":\"center\",\"animation\":\"glitch\"}",
      "{\"at\":5.0,\"duration\":3.0,\"text\":\"VOICE TOOLS. REAL ACTIONS.\",\"position\":\"lower\",\"animation\":\"slide-up\"}"
    ],
    badExamples: [
      "Add some text at the beginning",
      "Use a cool transition",
      "Publish after export"
    ]
  },
  "platform-strategist": {
    version: "1.0.0",
    purpose: "Prevent one generic creative from being pasted across different platforms.",
    outputContract: [
      "platform objective",
      "format recommendation",
      "algorithm/audience fit",
      "CTA style",
      "risk and rule blockers"
    ],
    rejectionRules: [
      "reject Instagram captions pasted into X",
      "reject promotional Reddit posts without community framing and rule blocker",
      "reject platform output without format and crop decision",
      "reject follower/like/DM automation"
    ],
    rubric: {
      platformNativeFit: "0-35: format and tone fit the platform",
      audienceSpecificity: "0-20: audience behavior is reflected",
      CTAFit: "0-15: CTA is native and approved",
      researchUse: "0-20: uses current evidence or says fallback",
      safety: "0-10: platform policy blockers"
    },
    goodExamples: [
      "X: one sharp POV plus GitHub CTA after link approval.",
      "Reddit: discussion-first post asking for feedback, no launch spam.",
      "Instagram: visual-first carousel/reel with readable hook."
    ],
    badExamples: [
      "Use the same copy everywhere",
      "Post this to Reddit with a purchase CTA",
      "Ask people to follow and DM automatically"
    ]
  },
  copywriter: {
    version: "1.0.0",
    purpose: "Write platform-native copy that is specific, sharp, and proof-aware.",
    outputContract: [
      "hook",
      "body",
      "CTA",
      "approval blockers",
      "weakest line to revise"
    ],
    rejectionRules: [
      "reject vague hype like revolutionary, game-changing, next-gen unless proven",
      "reject fake metrics, testimonials, partnerships, discounts, or scarcity",
      "reject typo cleanup requests back to the user when intent is clear",
      "reject copy that ignores platform playbook"
    ],
    rubric: {
      hookStrength: "0-25: first line creates tension or curiosity",
      specificity: "0-25: concrete nouns and business facts",
      platformFit: "0-20: native structure and CTA",
      proofSafety: "0-20: no invented claims",
      editTightness: "0-10: no filler"
    },
    goodExamples: [
      "If your AI can talk but cannot act, it is still Siri.",
      "Voice assistants became timers. GIGI is built as an execution layer.",
      "KILLSIRI starts here. GitHub link after approval."
    ],
    badExamples: [
      "Introducing the future of AI assistants",
      "This will change everything",
      "Download now before it is too late"
    ]
  }
};

function markdownList(items) {
  return (items || []).map((item) => `- ${item}`).join("\n") || "- None.";
}

function rubricMarkdown(rubric) {
  return Object.entries(rubric || {}).map(([key, value]) => `- ${key}: ${value}`).join("\n") || "- None.";
}

function trainingPackMarkdown(agentId) {
  const pack = TRAINING_PACKS[agentId];
  if (!pack) return "";
  return `## Specialist Memory Layer

Version: ${pack.version}

Purpose: ${pack.purpose}

### Output Contract
${markdownList(pack.outputContract)}

### Rejection Rules
${markdownList(pack.rejectionRules)}

### Scoring Rubric
${rubricMarkdown(pack.rubric)}

### Good Examples
${markdownList(pack.goodExamples)}

### Bad Examples
${markdownList(pack.badExamples)}
`;
}

function hasTrainingPack(agentId) {
  return Boolean(TRAINING_PACKS[agentId]);
}

module.exports = {
  TRAINING_PACKS,
  hasTrainingPack,
  trainingPackMarkdown
};
