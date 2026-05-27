const fs = require("fs");
const path = require("path");
const { resolveInside } = require("../workspace-runner/workspace-paths");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeBasename(value) {
  return path.basename(value || "launch-creative").replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function isGigiLike({ request, businessContext }) {
  const text = `${request || ""}\n${businessContext || ""}`.toLowerCase();
  return /\bgigi\b|killsiri|kill siri|\bsiri\b|voice assistant|assistente vocal/.test(text);
}

function genericVisualSignals(prompt) {
  const text = String(prompt || "").toLowerCase();
  const signals = [];
  if (/cyberpunk|neon-lit city|neon city|cityscape|futuristic tech interface/.test(text)) signals.push("generic cyber/AI atmosphere");
  if (!/\bgigi\b|killsiri|voice|vocal|assistant|agent|terminal|workflow|task|waveform|microphone/.test(text)) signals.push("missing product/category cue");
  if (!/subject|central|focal|poster|interface|terminal|waveform|microphone|avatar|orb/.test(text)) signals.push("weak focal subject");
  return signals;
}

function launchAngle({ request, businessContext }) {
  if (isGigiLike({ request, businessContext })) {
    return {
      promise: "Siri waits. GIGI acts.",
      enemy: "passive voice assistants that answer but do not execute",
      audience: "developers and AI-native builders",
      claimBoundary: "Say GIGI is being built to execute workflows; do not imply it already replaces every Siri feature unless verified."
    };
  }
  return {
    promise: "Make the product outcome visible in two seconds.",
    enemy: "generic AI visuals that do not explain the product",
    audience: "the audience defined in the business profile",
    claimBoundary: "Keep all product claims factual and approval-gated."
  };
}

function buildHeadlines({ request, businessContext }) {
  if (isGigiLike({ request, businessContext })) {
    return [
      "SIRI WAITS. GIGI ACTS.",
      "KILL THE ASSISTANT. BUILD THE AGENT.",
      "VOICE AGENTS SHOULD DO THINGS.",
      "NOT A VOICE BOT. AN EXECUTION LAYER.",
      "IF IT CAN TALK BUT CAN'T ACT, IT'S STILL SIRI."
    ];
  }
  return [
    "SHOW THE OUTCOME.",
    "MAKE THE PRODUCT VISIBLE.",
    "LESS AI AESTHETIC. MORE REASON TO CARE.",
    "TURN THE VISUAL INTO A CLAIM.",
    "MAKE THE CTA OBVIOUS."
  ];
}

function buildPlatformDrafts({ request, businessContext }) {
  if (isGigiLike({ request, businessContext })) {
    return {
      x: [
        "Siri waits for commands.\n\nGIGI executes them.\n\nWe're building an agentic voice assistant for developers: talk to it, and it can reason, use tools, run workflows, and verify outcomes.\n\nVoice assistants should do things.\n\nKILLSIRI starts here.",
        "Voice assistants became timers, weather widgets, and apology machines.\n\nGIGI is different: an agentic voice interface built to execute.\n\nNot \"I found this on the web.\"\n\nDone.",
        "If your AI can talk but can't act, it's still Siri.\n\nGIGI is our bet that the next voice assistant is not an assistant at all.\n\nIt's an agent."
      ],
      instagram: {
        caption: "Siri answers. GIGI acts.\n\nWe're building an agentic voice assistant for developers and AI-native workflows: a voice layer that can reason, use tools, run tasks, and verify outcomes.\n\nThis is not another polite assistant.\n\nKILLSIRI starts here.",
        carousel: [
          "SIRI WAITS. GIGI ACTS.",
          "Voice assistants failed because they only answer.",
          "GIGI listens, reasons, uses tools, executes.",
          "Built for developers and AI-native workflows.",
          "KILLSIRI"
        ]
      }
    };
  }
  return {
    x: [
      "Most launch visuals say \"AI\" and nothing else.\n\nThis one needs to show the product outcome, the audience, and the reason to care."
    ],
    instagram: {
      caption: "Launch visual draft. Needs a clearer product promise, stronger focal subject, and platform-native text treatment before approval.",
      carousel: [
        "WHAT IS THIS?",
        "WHO IS IT FOR?",
        "WHAT DOES IT CHANGE?",
        "WHY NOW?",
        "TRY IT / FOLLOW THE BUILD"
      ]
    }
  };
}

function buildRegenerationPrompts({ request, businessContext }) {
  if (isGigiLike({ request, businessContext })) {
    return [
      "high-contrast launch poster for GIGI, agentic voice assistant for developers, central glowing voice waveform transforming into terminal commands and completed task checklist, dark hacker interface, sharp black white red palette, product UI fragments, command log, rebellious tech manifesto, strong focal subject, mobile-first composition, no third-party logos, no Apple logo, no readable text inside generated image, cinematic lighting, ultra sharp, professional poster",
      "split-screen concept visual, old passive voice assistant orb fading on left, GIGI agentic command shell active on right, waveform becomes action pipeline listen reason execute verify, developer terminal UI, task cards completed, gritty anti-corporate launch aesthetic, black background with acid green and red accents, no third-party logos, no readable text inside generated image, 4K, sharp focus",
      "minimal brutalist launch key art for KILLSIRI, central abstract microphone cracked open into code branches and tool calls, voice waveform shaped like a command prompt, developer AI product aesthetic, black white red, high contrast, poster composition, no brand logos, no readable text, clean safe area for headline overlay"
    ];
  }
  return [
    `${request}, product launch poster with clear central subject, visible product metaphor, audience-specific UI details, strong negative space for headline overlay, no generic cyberpunk city, no readable text inside generated image, high contrast, professional social campaign visual`,
    `${request}, platform-native launch creative, focal product symbol, proof of outcome, clean safe area for typography, editorial tech art direction, no stock AI atmosphere, no readable text inside generated image`
  ];
}

function buildEditDirectives({ request, businessContext, genericSignals, qualityReport, visionCritic }) {
  const headlines = buildHeadlines({ request, businessContext });
  const platformWarnings = qualityReport?.warnings || [];
  const visionMustChange = visionCritic?.mustChange || [];
  return [
    `Use the current image only as background if needed; current weak points: ${genericSignals.join(", ") || "none detected"}.`,
    `Add one large headline in the editor, not baked into generation: "${headlines[0]}".`,
    "Add product/category cues: waveform, terminal, tool calls, task checklist, agent execution state.",
    "Create platform exports: Instagram 4:5, Instagram 1:1, X 16:9, and a clean no-text background.",
    "Check mobile crop and contrast before approval.",
    ...platformWarnings.map((warning) => `Quality warning: ${warning}`),
    ...visionMustChange.map((warning) => `Vision critic: ${warning}`)
  ];
}

function statusFromSignals({ baseScore, visionCritic }) {
  if (visionCritic?.status === "blocked_needs_revision") return "needs_revision";
  if (visionCritic?.status === "background_only") return "usable_as_background_only";
  if (visionCritic?.status === "draft_needs_design_pass") return "needs_design_pass";
  return baseScore >= 75 ? "usable_after_human_review" : baseScore >= 55 ? "usable_as_background_only" : "needs_revision";
}

function verdictForStatus(status, visionCritic) {
  if (status === "needs_revision") return "Do not use as the main launch asset without redesign. Treat as rejected or raw concept material.";
  if (status === "usable_as_background_only") return "Can be used only as a background or mood reference after design review. Not a final post.";
  if (status === "needs_design_pass") return "Has potential, but requires deterministic layout, typography, CTA, and platform exports before human review.";
  return visionCritic?.verdict || "Can be used after platform QA and human approval.";
}

function buildLaunchCreativePackage({ workspaceRoot, request, imageResult, prompt, promptEngineer, qualityReport, visionCritic, businessContext }) {
  const relativePath = imageResult?.outputPath && imageResult.outputPath.startsWith(workspaceRoot)
    ? path.relative(workspaceRoot, imageResult.outputPath).split(path.sep).join("/")
    : imageResult?.filename || "unknown";
  const genericSignals = [...new Set([
    ...genericVisualSignals(prompt),
    ...(visionCritic?.missingSignals || [])
  ])];
  const brandFitStatus = qualityReport?.brandFit?.status || "unknown";
  const weakBrandFit = ["needs_brand_review", "weak_alignment", "unknown"].includes(brandFitStatus);
  const heuristicScore = Math.max(10, 100 - (genericSignals.length * 20) - (weakBrandFit ? 20 : 0));
  const score = typeof visionCritic?.score === "number" ? Math.min(heuristicScore, visionCritic.score) : heuristicScore;
  const status = statusFromSignals({ baseScore: score, visionCritic });
  const angle = launchAngle({ request, businessContext });
  const packageData = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    status,
    score,
    image: relativePath,
    prompt,
    promptEngineer: {
      styleTag: promptEngineer?.styleTag || null,
      fallback: Boolean(promptEngineer?.fallback),
      rationale: promptEngineer?.rationale || null
    },
    visionCritic: visionCritic ? {
      status: visionCritic.status,
      score: visionCritic.score,
      verdict: visionCritic.verdict,
      twoSecondRead: visionCritic.twoSecondRead,
      problems: visionCritic.problems || [],
      mustChange: visionCritic.mustChange || []
    } : null,
    verdict: verdictForStatus(status, visionCritic),
    angle,
    genericSignals,
    editDirectives: buildEditDirectives({ request, businessContext, genericSignals, qualityReport, visionCritic }),
    headlines: buildHeadlines({ request, businessContext }),
    platformDrafts: buildPlatformDrafts({ request, businessContext }),
    regenerationPrompts: buildRegenerationPrompts({ request, businessContext }),
    qaChecklist: [
      "Can someone understand what the product does in two seconds?",
      "Is GIGI/KILLSIRI visually or verbally central?",
      "Does the visual show execution, not just generic AI atmosphere?",
      "Is the hook legible on mobile?",
      "Are all claims verifiable before publishing?",
      "Is there a clear CTA: follow, GitHub, waitlist, demo, or install?"
    ]
  };
  return packageData;
}

function launchCreativePackageMarkdown(pkg) {
  return `# Launch Creative Package

Status: ${pkg.status}

Score: ${pkg.score}/100

Image: \`${pkg.image}\`

## Verdict
${pkg.verdict}

## Launch Angle
- Promise: ${pkg.angle.promise}
- Enemy: ${pkg.angle.enemy}
- Audience: ${pkg.angle.audience}
- Claim boundary: ${pkg.angle.claimBoundary}

## Why It Needs Work
${pkg.genericSignals.length ? pkg.genericSignals.map((item) => `- ${item}`).join("\n") : "- No major generic-signal heuristic found."}

## Vision Critic
${pkg.visionCritic ? [
  `- Status: ${pkg.visionCritic.status}`,
  `- Score: ${pkg.visionCritic.score}/100`,
  `- Two-second read: ${pkg.visionCritic.twoSecondRead || "-"}`,
  `- Verdict: ${pkg.visionCritic.verdict || "-"}`
].join("\n") : "- Not run."}

## Edit Directives
${pkg.editDirectives.map((item) => `- ${item}`).join("\n")}

## Headline Options
${pkg.headlines.map((item) => `- ${item}`).join("\n")}

## X Drafts
${pkg.platformDrafts.x.map((item, index) => `### X Variant ${index + 1}\n${item}`).join("\n\n")}

## Instagram Caption
${pkg.platformDrafts.instagram.caption}

## Instagram Carousel
${pkg.platformDrafts.instagram.carousel.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Regeneration Prompts
${pkg.regenerationPrompts.map((item, index) => `### Prompt ${index + 1}\n${item}`).join("\n\n")}

## QA Checklist
${pkg.qaChecklist.map((item) => `- [ ] ${item}`).join("\n")}
`;
}

function writeLaunchCreativePackage({ workspaceRoot, packageData }) {
  const packageDir = resolveInside(workspaceRoot, "creative", "launch-packages");
  ensureDir(packageDir);
  const safeName = safeBasename(packageData.image).replace(/\.[a-z0-9]+$/i, "");
  const jsonPath = path.join(packageDir, `${safeName}.json`);
  const mdPath = path.join(packageDir, `${safeName}.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(packageData, null, 2)}\n`);
  fs.writeFileSync(mdPath, launchCreativePackageMarkdown(packageData));
  fs.copyFileSync(jsonPath, resolveInside(workspaceRoot, "creative", "launch-package-latest.json"));
  fs.copyFileSync(mdPath, resolveInside(workspaceRoot, "creative", "launch-package-latest.md"));
  return {
    jsonPath,
    mdPath,
    relativeJsonPath: path.relative(workspaceRoot, jsonPath).split(path.sep).join("/"),
    relativeMdPath: path.relative(workspaceRoot, mdPath).split(path.sep).join("/")
  };
}

module.exports = {
  buildLaunchCreativePackage,
  genericVisualSignals,
  launchCreativePackageMarkdown,
  writeLaunchCreativePackage
};
