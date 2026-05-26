const fs = require("fs");
const path = require("path");
const { runOllamaGenerate } = require("../local-runtime/model-client");
const { registerArtifact } = require("../publishing/artifact-registry");
const { auditContentPolicy } = require("../review-loop/content-policy");

const PLATFORM_SPECS = {
  instagram: {
    label: "Instagram (caption + hashtags)",
    maxChars: 2200,
    hashtagCount: "5-10",
    tone: "visual-first, punchy first line, hashtags at end",
    format: "Single caption with line breaks. First line = hook. Hashtags on last line."
  },
  x: {
    label: "X / Twitter (thread)",
    maxChars: 280,
    hashtagCount: "1-2 max",
    tone: "direct, opinionated, conversational",
    format: "Thread of 2-4 tweets. Each tweet max 280 chars. Number them 1/, 2/, etc."
  },
  facebook: {
    label: "Facebook (long post)",
    maxChars: 63206,
    hashtagCount: "2-5",
    tone: "conversational, slightly longer, community-oriented",
    format: "1-3 short paragraphs. Friendly tone. 1-2 questions to drive comments."
  },
  reddit: {
    label: "Reddit (title + body)",
    maxChars: 40000,
    hashtagCount: "none",
    tone: "authentic, no marketing speak, value-first",
    format: "Title: max 300 chars, no clickbait. Body: genuine explanation + subreddit-appropriate tone. Note 2-3 suitable subreddits."
  },
  linkedin: {
    label: "LinkedIn (professional post)",
    maxChars: 3000,
    hashtagCount: "3-5 professional",
    tone: "professional, insight-driven, first-person story OK",
    format: "Hook line. 2-3 insight paragraphs. CTA. Hashtags at end."
  }
};

function buildAdaptationPrompt({ draft, platform, spec, businessContext }) {
  return `You are an expert social media copywriter adapting content for ${spec.label}.

## Platform Rules
- Max chars: ${spec.maxChars}
- Hashtags: ${spec.hashtagCount}
- Tone: ${spec.tone}
- Format: ${spec.format}

## Source Draft
${draft.slice(0, 3000)}

${businessContext ? `## Brand Context\n${businessContext.slice(0, 600)}\n` : ""}

## Task
Adapt the source draft into a ${spec.label} post.
- Preserve the core message and value proposition
- Match the platform's native tone exactly
- Do NOT add fake claims, numbers, or promises not in the source
- Do NOT include placeholder text like "[CTA link]" — write "[LINK]" instead
- Output ONLY the final post content. No explanations, no headers.

${platform === "reddit" ? "End your response with a line: Subreddits: r/example1, r/example2" : ""}
`;
}

async function adaptForPlatform({ draft, platform, businessContext, model = "qwen2.5:14b", timeoutMs = 90000 }) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) throw new Error(`Unknown platform: ${platform}. Valid: ${Object.keys(PLATFORM_SPECS).join(", ")}`);

  const prompt = buildAdaptationPrompt({ draft, platform, spec, businessContext });
  const output = await runOllamaGenerate({ model, timeoutMs, prompt });
  const policy = auditContentPolicy(output);

  return {
    platform,
    label: spec.label,
    content: output.trim(),
    charCount: output.trim().length,
    withinLimit: output.trim().length <= spec.maxChars,
    policyStatus: policy.status,
    policyBlockers: policy.blockers.length
  };
}

async function adaptAllPlatforms({ draft, platforms, businessContext, model, timeoutMs, onProgress }) {
  const targetPlatforms = platforms || Object.keys(PLATFORM_SPECS);
  const results = {};

  for (const platform of targetPlatforms) {
    if (onProgress) onProgress(platform);
    try {
      results[platform] = await adaptForPlatform({ draft, platform, businessContext, model, timeoutMs });
    } catch (err) {
      results[platform] = { platform, label: PLATFORM_SPECS[platform]?.label || platform, error: err.message };
    }
  }

  return results;
}

function buildAdaptationsMarkdown(results, runId) {
  const ts = new Date().toISOString();
  const lines = [
    `# Platform Adaptations`,
    ``,
    `Generated: ${ts}`,
    `Run: ${runId}`,
    ``,
    `> Human approval required before publishing to any platform.`,
    ``
  ];

  for (const [platform, result] of Object.entries(results)) {
    lines.push(`## ${result.label || platform}`);
    lines.push(``);
    if (result.error) {
      lines.push(`> Error: ${result.error}`);
    } else {
      const charInfo = result.withinLimit ? `${result.charCount} chars (within limit)` : `${result.charCount} chars (OVER limit — trim before publishing)`;
      lines.push(`_${charInfo} | Policy: ${result.policyStatus}${result.policyBlockers ? ` (${result.policyBlockers} blockers)` : ""}_`);
      lines.push(``);
      lines.push("```");
      lines.push(result.content);
      lines.push("```");
    }
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  return lines.join("\n");
}

async function runPlatformAdapter({ workspaceRoot, draft, platforms, businessContext, model, timeoutMs, runId }) {
  const resolvedRunId = runId || `platform-adapt-${Date.now()}`;

  console.log(`  platform-adapt — adapting for ${(platforms || Object.keys(PLATFORM_SPECS)).join(", ")}`);
  const results = await adaptAllPlatforms({
    draft, platforms, businessContext, model, timeoutMs,
    onProgress: (p) => console.log(`    adapting → ${p}`)
  });

  const markdown = buildAdaptationsMarkdown(results, resolvedRunId);
  const outputPath = path.join(workspaceRoot, "drafts", "platform-adaptations.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown);

  const artifact = registerArtifact(workspaceRoot, {
    path: "drafts/platform-adaptations.md",
    type: "platform-adaptations",
    intent: "multi-platform",
    platform: null,
    sourceRun: resolvedRunId,
    sourceAgent: "platform-adapter",
    status: "needs_human_review",
    metadata: {
      platforms: Object.keys(results),
      errors: Object.values(results).filter((r) => r.error).length,
      withinLimit: Object.values(results).filter((r) => r.withinLimit).length
    }
  });

  console.log(`  platform-adapt — wrote drafts/platform-adaptations.md`);
  return { results, outputPath, artifact };
}

module.exports = { runPlatformAdapter, adaptForPlatform, adaptAllPlatforms, PLATFORM_SPECS };
