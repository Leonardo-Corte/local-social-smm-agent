const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function newestAnalysis(workspaceRoot) {
  const analysisDir = path.join(workspaceRoot, "assets/analysis");
  if (!fs.existsSync(analysisDir)) {
    return null;
  }
  return fs.readdirSync(analysisDir)
    .filter((name) => name.endsWith("-reel-intelligence.json"))
    .map((name) => path.join(analysisDir, name))
    .map((filePath) => ({ filePath, mtimeMs: fs.statSync(filePath).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.filePath || null;
}

function readAnalysis(workspaceRoot, analysisPath) {
  const filePath = analysisPath || newestAnalysis(workspaceRoot);
  if (!filePath) {
    throw new Error("No reel intelligence JSON found. Run npm run video:intel <workspace> first.");
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeId(filePath) {
  return path.parse(filePath).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "video";
}

function buildEditRecipe({ workspaceRoot, analysis }) {
  const assetPath = analysis.asset.absolutePath;
  const videoId = safeId(assetPath);
  const editedDir = path.join(workspaceRoot, "assets/edited", videoId);
  const outputPath = path.join(editedDir, `${videoId}-preview-social.mp4`);
  const recipePath = path.join(editedDir, `${videoId}-edit-recipe.json`);
  const notesPath = path.join(editedDir, `${videoId}-edit-notes.md`);
  const duration = analysis.summary.duration || 0;
  const trimEnd = duration > 28 ? 28 : duration;
  const firstThreeSecondFocus = duration <= 12
    ? "Keep full clip; strengthen the hook with caption/copy rather than cutting too much."
    : "Trim dead air before second 3 if visual action is slow.";
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    status: "preview-recipe",
    humanApprovalRequired: true,
    destructiveEdits: false,
    source: {
      assetPath,
      sha256: analysis.asset.sha256,
      duration,
      width: analysis.summary.width,
      height: analysis.summary.height,
      orientation: analysis.summary.orientation
    },
    output: {
      editedDir,
      outputPath,
      recipePath,
      notesPath
    },
    steps: [
      {
        id: "trim",
        enabled: trimEnd > 0,
        start: 0,
        end: Number(trimEnd.toFixed(2)),
        reason: "Keep the first preview short and platform-friendly."
      },
      {
        id: "vertical-master",
        enabled: true,
        filter: "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
        reason: "Normalize to 9:16 social preview dimensions."
      },
      {
        id: "visual-polish",
        enabled: true,
        filter: "eq=contrast=1.05:saturation=1.08",
        reason: "Small contrast/saturation lift only; avoid changing the reality of the event."
      },
      {
        id: "audio-normalize",
        enabled: Boolean(analysis.summary.audioPresent),
        filter: "loudnorm=I=-16:TP=-1.5:LRA=11",
        reason: "Make preview audio easier to review without clipping."
      }
    ],
    captionPlan: {
      status: analysis.transcription?.status === "complete" ? "ready" : "waiting-for-transcription",
      notes: analysis.transcription?.status === "complete"
        ? "Use transcript to create subtitles in a future pass."
        : "No transcript available yet; install/set WHISPER_MODEL to generate captions locally."
    },
    strategicNotes: [
      firstThreeSecondFocus,
      "Use real event footage as the primary proof layer.",
      "Do not add attendance, venue, food, drink, or ticket claims unless confirmed for this exact event."
    ]
  };
}

function ffmpegArgs(recipe) {
  const trim = recipe.steps.find((step) => step.id === "trim" && step.enabled);
  const videoFilters = recipe.steps
    .filter((step) => ["vertical-master", "visual-polish"].includes(step.id) && step.enabled)
    .map((step) => step.filter)
    .join(",");
  const audio = recipe.steps.find((step) => step.id === "audio-normalize" && step.enabled);
  const args = ["-y"];
  if (trim) {
    args.push("-ss", String(trim.start), "-to", String(trim.end));
  }
  args.push("-i", recipe.source.assetPath, "-vf", videoFilters, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p");
  if (audio) {
    args.push("-af", audio.filter, "-c:a", "aac", "-b:a", "160k");
  } else {
    args.push("-an");
  }
  args.push("-movflags", "+faststart", recipe.output.outputPath);
  return args;
}

function runPreviewEdit(recipe) {
  ensureDir(recipe.output.editedDir);
  const result = spawnSync("ffmpeg", ffmpegArgs(recipe), {
    encoding: "utf8",
    maxBuffer: 40 * 1024 * 1024
  });
  return {
    ok: result.status === 0 && fs.existsSync(recipe.output.outputPath),
    status: result.status,
    stderr: result.stderr || "",
    stdout: result.stdout || ""
  };
}

function recipeMarkdown(recipe, runResult) {
  return `# Video Edit Preview

Generated at: ${recipe.generatedAt}

Status: ${runResult.ok ? "preview-created" : "preview-failed"}

Human approval required: yes

Original untouched: yes

## Source
- Asset: ${recipe.source.assetPath}
- Duration: ${recipe.source.duration}s
- Size: ${recipe.source.width}x${recipe.source.height}
- Orientation: ${recipe.source.orientation}

## Output
- Preview: ${recipe.output.outputPath}
- Recipe: ${recipe.output.recipePath}

## Recipe Steps
${recipe.steps.map((step) => `### ${step.id}
- Enabled: ${step.enabled ? "yes" : "no"}
- Reason: ${step.reason}
${step.filter ? `- Filter: \`${step.filter}\`` : ""}
${typeof step.start === "number" ? `- Range: ${step.start}s -> ${step.end}s` : ""}
`).join("\n")}

## Caption Plan
- Status: ${recipe.captionPlan.status}
- Notes: ${recipe.captionPlan.notes}

## Strategic Notes
${recipe.strategicNotes.map((item) => `- ${item}`).join("\n")}

## Review Before Use
- [ ] Preview watched by a human.
- [ ] Hook feels clear in the first three seconds.
- [ ] No unverified claim appears in caption, overlay, or CTA.
- [ ] Original asset remains available.
`;
}

function writeRecipe({ recipe, runResult }) {
  ensureDir(recipe.output.editedDir);
  fs.writeFileSync(recipe.output.recipePath, `${JSON.stringify(recipe, null, 2)}\n`);
  fs.writeFileSync(recipe.output.notesPath, recipeMarkdown(recipe, runResult));
}

module.exports = {
  buildEditRecipe,
  readAnalysis,
  runPreviewEdit,
  writeRecipe,
  recipeMarkdown
};
