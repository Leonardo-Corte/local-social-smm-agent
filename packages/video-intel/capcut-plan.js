const fs = require("fs");
const path = require("path");
const { readAnalysis } = require("./edit-recipe");
const { registerArtifact } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function newestEditRecipe(workspaceRoot) {
  const editedRoot = path.join(workspaceRoot, "assets/edited");
  if (!fs.existsSync(editedRoot)) {
    return null;
  }
  const recipes = [];
  for (const dirName of fs.readdirSync(editedRoot)) {
    const dirPath = path.join(editedRoot, dirName);
    if (!fs.statSync(dirPath).isDirectory()) {
      continue;
    }
    for (const fileName of fs.readdirSync(dirPath)) {
      if (fileName.endsWith("-edit-recipe.json")) {
        const filePath = path.join(dirPath, fileName);
        recipes.push({ filePath, mtimeMs: fs.statSync(filePath).mtimeMs });
      }
    }
  }
  return recipes.sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.filePath || null;
}

function readEditRecipe(workspaceRoot, explicitPath = null) {
  const filePath = explicitPath ? resolveInside(workspaceRoot, explicitPath) : newestEditRecipe(workspaceRoot);
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function transcriptText(analysis) {
  return analysis.transcription && analysis.transcription.transcript
    ? analysis.transcription.transcript.trim()
    : "";
}

function extractCapCutAssemblyPlan(reelsDraft) {
  const match = reelsDraft.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (parsed && Array.isArray(parsed.overlays)) return parsed;
  } catch {
    return null;
  }
  return null;
}

function overlaySuggestions({ analysis, reelsDraft }) {
  const assembled = extractCapCutAssemblyPlan(reelsDraft);
  if (assembled && assembled.overlays.length > 0) {
    return assembled.overlays.map((o) => ({
      at: Number(o.at) || 0,
      duration: Number(o.duration) || 2.5,
      text: String(o.text || ""),
      reason: `position: ${o.position || "lower"}`
    }));
  }

  const duration = analysis.summary?.duration || 30;
  const suggestions = [
    { at: 0, duration: 2.5, text: "[Hook — add from reel script]", reason: "Open hook placeholder; replace with approved copy." }
  ];
  if (duration > 15) {
    suggestions.push({ at: 3, duration: 3, text: "[Body point — add from reel script]", reason: "Body overlay placeholder." });
  }
  suggestions.push({ at: Math.max(duration - 4, 6), duration: 3, text: "[CTA — approval required]", reason: "CTA placeholder; confirm link before publishing." });
  return suggestions;
}

function buildCapCutPlan({ workspaceRoot, analysisPath = null, recipePath = null, adapter = "manual-capcut" }) {
  const analysis = readAnalysis(workspaceRoot, analysisPath ? resolveInside(workspaceRoot, analysisPath) : null);
  const recipe = readEditRecipe(workspaceRoot, recipePath);
  const reelsDraft = readText(path.join(workspaceRoot, "drafts/reels.md"));
  const business = readText(path.join(workspaceRoot, "business/business.md"));
  const trim = recipe && recipe.steps ? recipe.steps.find((step) => step.id === "trim" && step.enabled) : null;
  const vertical = recipe && recipe.steps ? recipe.steps.find((step) => step.id === "vertical-master" && step.enabled) : null;
  const soundNotes = analysis.soundNotes || [];
  const transcript = transcriptText(analysis);

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    status: "needs_human_review",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    adapter,
    compatibleAdapters: ["manual-capcut", "vectcutapi", "capcut-mate"],
    source: {
      assetPath: analysis.asset.absolutePath,
      relativePath: analysis.asset.relativePath,
      sha256: analysis.asset.sha256,
      duration: analysis.summary.duration,
      width: analysis.summary.width,
      height: analysis.summary.height,
      orientation: analysis.summary.orientation
    },
    timeline: {
      targetFormat: "vertical-9x16",
      trim: trim ? { start: trim.start, end: trim.end, reason: trim.reason } : null,
      crop: vertical ? { filter: vertical.filter, reason: vertical.reason } : {
        filter: "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
        reason: "CapCut project should be formatted for Reels/Shorts review."
      },
      overlays: overlaySuggestions({ analysis, reelsDraft }),
      subtitles: {
        status: transcript ? "transcript-ready" : "needs-transcription-or-capcut-auto-captions",
        source: transcript ? "local-transcript" : "capcut-auto-captions/manual",
        transcriptPreview: transcript ? transcript.slice(0, 1200) : ""
      },
      sound: {
        direction: soundNotes,
        musicSearchBrief: "Find an upbeat but premium social/event sound bed. Avoid sounds that make the event feel like a generic nightlife ad."
      }
    },
    agentBrief: {
      reelProducer: "Use this plan to create a CapCut edit with a strong first-three-second hook, fast proof shots, readable captions, and an approval-gated CTA.",
      visualDirector: "Keep overlays minimal, premium, and readable on mobile.",
      criticQa: "Block unverified attendance, VIP, venue performance, ticket inclusion, partnership, or identity claims.",
      publishingOperator: "Do not export as publish-ready until registry approval exists."
    },
    contextPreview: {
      business: business.slice(0, 2000),
      reelsDraft: reelsDraft.slice(0, 3000)
    },
    approvalBlockers: [
      "Human must approve the exact video edit before publishing.",
      "Confirm event date, venue, ticket link, and ticket inclusions before CTA.",
      "Confirm whether original audio, CapCut auto-captions, or added music is allowed for this asset.",
      "Check all visible faces/brand marks/venue details are acceptable for use."
    ]
  };
}

function capCutPlanMarkdown(plan) {
  return `# CapCut Edit Plan

Generated at: ${plan.generatedAt}

Status: ${plan.status}

Adapter: ${plan.adapter}

Human approval required: yes

Automatic publishing: disabled

## Source
- Asset: \`${plan.source.relativePath}\`
- Duration: ${Number(plan.source.duration || 0).toFixed(2)}s
- Format: ${plan.source.width}x${plan.source.height} (${plan.source.orientation})

## Timeline
- Target: ${plan.timeline.targetFormat}
- Trim: ${plan.timeline.trim ? `${plan.timeline.trim.start}s -> ${plan.timeline.trim.end}s` : "manual review"}
- Crop: \`${plan.timeline.crop.filter}\`

## Overlay Suggestions
${plan.timeline.overlays.map((item) => `- ${item.at}s / ${item.duration}s: "${item.text}" — ${item.reason}`).join("\n")}

## Subtitles
- Status: ${plan.timeline.subtitles.status}
- Source: ${plan.timeline.subtitles.source}

${plan.timeline.subtitles.transcriptPreview ? `### Transcript Preview
\`\`\`text
${plan.timeline.subtitles.transcriptPreview}
\`\`\`
` : ""}

## Sound Direction
${plan.timeline.sound.direction.map((item) => `- ${item}`).join("\n") || "- Review original audio and choose sound manually."}
- ${plan.timeline.sound.musicSearchBrief}

## Agent Brief
- Reel producer: ${plan.agentBrief.reelProducer}
- Visual director: ${plan.agentBrief.visualDirector}
- Critic QA: ${plan.agentBrief.criticQa}
- Publishing operator: ${plan.agentBrief.publishingOperator}

## Approval Blockers
${plan.approvalBlockers.map((item) => `- [ ] ${item}`).join("\n")}

## External Adapter Notes
- \`manual-capcut\`: open CapCut and recreate this plan by hand/template.
- \`vectcutapi\`: future local adapter target for Apache-2.0 VectCutAPI.
- \`capcut-mate\`: future local adapter target for MIT CapCut Mate.
`;
}

function writeCapCutPlan({ workspaceRoot, plan, sourceRun = "capcut-plan" }) {
  const creativeDir = path.join(workspaceRoot, "creative");
  ensureDir(creativeDir);
  const jsonPath = path.join(creativeDir, "capcut-plan.json");
  const mdPath = path.join(creativeDir, "capcut-plan.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(plan, null, 2)}\n`);
  fs.writeFileSync(mdPath, capCutPlanMarkdown(plan));
  const artifact = registerArtifact(workspaceRoot, {
    path: "creative/capcut-plan.md",
    type: "edit-plan",
    intent: "capcut",
    platform: "instagram",
    sourceRun,
    sourceAgent: "reel-shorts-producer",
    status: "needs_human_review",
    metadata: {
      adapter: plan.adapter,
      jsonPath: "creative/capcut-plan.json"
    }
  });
  return { jsonPath, mdPath, artifact };
}

function bridgeCapCutPlanFromReels(workspaceRoot, { runId = "pipeline-bridge", overwriteFallback = true } = {}) {
  const reelsDraftPath = path.join(workspaceRoot, "drafts", "reels.md");
  if (!fs.existsSync(reelsDraftPath)) return { bridged: false, reason: "drafts/reels.md not found" };

  const reelsDraft = fs.readFileSync(reelsDraftPath, "utf8");
  const assembled = extractCapCutAssemblyPlan(reelsDraft);
  if (!assembled || !Array.isArray(assembled.overlays)) return { bridged: false, reason: "no CapCut Assembly Plan JSON block in reels.md" };

  const planPath = path.join(workspaceRoot, "creative", "capcut-plan.json");
  if (fs.existsSync(planPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(planPath, "utf8"));
      if (!existing._fallback && !overwriteFallback) return { bridged: false, reason: "capcut-plan.json already exists (non-fallback)" };
    } catch { /* corrupt — overwrite */ }
  }

  const totalDuration = assembled.overlays.reduce((max, o) => Math.max(max, (Number(o.at) || 0) + (Number(o.duration) || 3)), 10);
  const plan = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    _pipelineBridged: true,
    status: "needs_human_review",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    adapter: "capcut-cli",
    source: { assetPath: null, duration: totalDuration },
    timeline: {
      targetFormat: "vertical-9x16",
      trim: null,
      overlays: assembled.overlays.map((o) => ({
        at: Number(o.at) || 0,
        duration: Number(o.duration) || 3,
        text: String(o.text || ""),
        position: o.position || "lower"
      })),
      subtitles: { status: "pending", source: "capcut-auto-captions/manual", transcriptPreview: "" },
      sound: assembled.soundDirection || {}
    },
    approvalBlockers: ["Human must approve the exact video edit before publishing.", "Confirm CTA link before final export."]
  };

  fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
  fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);

  registerArtifact(workspaceRoot, {
    path: "creative/capcut-plan.json",
    type: "edit-plan",
    intent: "capcut",
    platform: "instagram",
    sourceRun: runId,
    sourceAgent: "pipeline-bridge",
    status: "needs_human_review",
    metadata: { bridged: true, overlays: assembled.overlays.length, source: "drafts/reels.md" }
  });

  return { bridged: true, overlays: assembled.overlays.length, planPath };
}

module.exports = {
  buildCapCutPlan,
  capCutPlanMarkdown,
  writeCapCutPlan,
  extractCapCutAssemblyPlan,
  bridgeCapCutPlanFromReels
};
