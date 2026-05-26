const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const { registerArtifact } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");

const CAPCUT_CLI = path.resolve(__dirname, "../../vendor/capcut-cli/dist/index.js");
const REELS_TEMPLATE = path.resolve(__dirname, "../../vendor/capcut-cli/templates/_init-reels");

const CAPCUT_DRAFTS_CANDIDATES = [
  path.join(os.homedir(), "Movies", "CapCut", "User Data", "Projects", "com.lveditor.draft"),
  path.join(os.homedir(), "Library", "Containers", "com.lveditor.CapCut", "Data", "Library", "Application Support", "CapCut", "User Data", "Projects", "com.lveditor.draft"),
  path.join(os.homedir(), "Documents", "CapCut", "User Data", "Projects", "com.lveditor.draft")
];

function findDraftsDir() {
  for (const dir of CAPCUT_DRAFTS_CANDIDATES) {
    if (fs.existsSync(dir)) return dir;
  }
  return null;
}

function capcut(args, cwd) {
  const result = spawnSync("node", [CAPCUT_CLI, ...args], {
    encoding: "utf8",
    cwd: cwd || process.cwd(),
    timeout: 30000
  });
  if (result.error) throw new Error(`capcut-cli: ${result.error.message}`);
  return {
    ok: result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    status: result.status
  };
}

function parseJsonOutput(stdout) {
  try {
    return JSON.parse(stdout.trim());
  } catch {
    return null;
  }
}

function secToStr(seconds) {
  return `${Number(seconds).toFixed(3)}s`;
}

function transcriptToSrt(transcript) {
  const sentences = transcript.split(/(?<=[.!?])\s+/).filter(Boolean);
  let srt = "";
  let index = 1;
  let cursor = 0;
  for (const sentence of sentences) {
    const wordsPerSecond = 2.5;
    const duration = Math.max(1.5, sentence.split(" ").length / wordsPerSecond);
    const start = cursor;
    const end = cursor + duration;
    srt += `${index}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${sentence}\n\n`;
    cursor = end + 0.1;
    index += 1;
  }
  return srt;
}

function formatSrtTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function readCapCutPlan(workspaceRoot) {
  const planPath = path.join(workspaceRoot, "creative", "capcut-plan.json");
  if (fs.existsSync(planPath)) {
    return JSON.parse(fs.readFileSync(planPath, "utf8"));
  }
  const fallback = buildFallbackPlanFromReels(workspaceRoot);
  if (fallback) {
    fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
    fs.writeFileSync(planPath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  throw new Error(
    `capcut-plan.json not found at ${planPath}.\n` +
    `Run the adaptive pipeline first (npm run team:adaptive), or add a ### CapCut Assembly Plan JSON block to drafts/reels.md.`
  );
}

function buildFallbackPlanFromReels(workspaceRoot) {
  const reelsPath = path.join(workspaceRoot, "drafts", "reels.md");
  if (!fs.existsSync(reelsPath)) return null;
  const src = fs.readFileSync(reelsPath, "utf8");
  const match = src.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  let parsed;
  try { parsed = JSON.parse(match[1]); } catch { return null; }
  if (!parsed.overlays || !Array.isArray(parsed.overlays)) return null;
  const totalDuration = parsed.overlays.reduce((max, o) => Math.max(max, (o.at || 0) + (o.duration || 3)), 10);
  return {
    _fallback: true,
    source: { assetPath: null, duration: totalDuration },
    timeline: {
      overlays: parsed.overlays.map((o) => ({
        at: o.at || 0,
        duration: o.duration || 3,
        text: o.text || "",
        position: o.position || "lower"
      }))
    },
    sound: parsed.soundDirection || {},
    captionStyle: parsed.captionStyle || "auto"
  };
}

function draftName(workspaceRoot, suffix) {
  const slug = path.basename(workspaceRoot).slice(0, 30);
  const ts = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
  return `${slug}-${suffix || "reel"}-${ts}`;
}

function buildCommandPlan(plan) {
  const cmds = [];

  cmds.push({ op: "init", label: "create 9:16 Reels project" });

  const asset = plan.source?.assetPath;
  const assetExists = asset && fs.existsSync(asset);

  if (asset && assetExists) {
    const dur = plan.source?.duration || 30;
    cmds.push({ op: "add-video", asset, start: "0s", duration: secToStr(dur), label: `add source video (${dur.toFixed(1)}s)` });
  } else {
    const reason = !asset ? "no assetPath in plan" : `file not found: ${asset}`;
    cmds.push({ op: "video-placeholder", label: `VIDEO PLACEHOLDER — ${reason}`, warning: true });
  }

  if (plan.timeline?.trim) {
    const { start, end } = plan.timeline.trim;
    cmds.push({ op: "trim", segIndex: 0, start: secToStr(start), duration: secToStr(end - start), label: `trim ${start}s → ${end}s` });
  }

  for (const overlay of (plan.timeline?.overlays || [])) {
    const text = overlay.text || "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    const truncationWarning = words.length > 0 && words.length <= 2 && text.length < 15;
    cmds.push({
      op: "add-text",
      text,
      start: secToStr(overlay.at),
      duration: secToStr(overlay.duration),
      y: "0.72",
      label: `overlay at ${overlay.at}s: "${text.slice(0, 40)}"`,
      ...(truncationWarning ? { warning: true, warningNote: `Only ${words.length} word(s) — may be truncated` } : {})
    });
  }

  const subtitles = plan.timeline?.subtitles;
  if (subtitles?.source === "local-transcript" && subtitles.transcriptPreview) {
    cmds.push({ op: "import-srt", label: "import transcript as captions" });
  }

  return cmds;
}

function hasVideoPlaceholder(commandPlan) {
  return commandPlan.some((c) => c.op === "video-placeholder");
}

function executePlan({ plan, projectDir, workspaceRoot, log }) {
  for (const cmd of buildCommandPlan(plan)) {
    switch (cmd.op) {
      case "video-placeholder": {
        log.push({ op: cmd.op, status: "warning", reason: cmd.label });
        break;
      }
      case "add-video": {
        const r = capcut(["add-video", projectDir, cmd.asset, cmd.start, cmd.duration]);
        log.push({ op: cmd.op, status: r.ok ? "ok" : "failed", stderr: r.stderr.slice(0, 200) });
        break;
      }
      case "trim": {
        const segsResult = capcut(["segments", projectDir, "--track", "video"]);
        const segs = parseJsonOutput(segsResult.stdout);
        if (segs && segs.length > 0) {
          const segId = segs[0].id.slice(0, 8);
          const r = capcut(["trim", projectDir, segId, cmd.start, cmd.duration]);
          log.push({ op: cmd.op, status: r.ok ? "ok" : "failed", segId });
        } else {
          log.push({ op: cmd.op, status: "skipped", reason: "no video segments found" });
        }
        break;
      }
      case "add-text": {
        const words = cmd.text.trim().split(/\s+/).filter(Boolean);
        const r = capcut([
          "add-text", projectDir, cmd.text, cmd.start, cmd.duration,
          "--font-size", "72",
          "--align", "center",
          "--y", cmd.y || "0.72",
          "--color", "#FFFFFF",
          "--shadow", "--shadow-color", "#000000"
        ]);
        const entry = { op: cmd.op, status: r.ok ? "ok" : "failed", text: cmd.text.slice(0, 40) };
        if (words.length <= 2 && cmd.text.length < 15) {
          entry.warning = `Only ${words.length} word(s) — verify the script generated complete overlay text`;
        }
        log.push(entry);
        break;
      }
      case "import-srt": {
        const subtitles = plan.timeline?.subtitles;
        const srtPath = path.join(workspaceRoot, "creative", "capcut-captions.srt");
        const srtContent = transcriptToSrt(subtitles.transcriptPreview);
        fs.mkdirSync(path.dirname(srtPath), { recursive: true });
        fs.writeFileSync(srtPath, srtContent);
        const r = capcut(["import-srt", projectDir, srtPath, "--track-name", "captions"]);
        log.push({ op: cmd.op, status: r.ok ? "ok" : "failed" });
        break;
      }
      default:
        break;
    }
  }
}

function buildCapCutDraft({ workspaceRoot, name, draftsDir, dryRun = false }) {
  const plan = readCapCutPlan(workspaceRoot);
  const resolvedDraftsDir = draftsDir || findDraftsDir();
  const resolvedName = name || draftName(workspaceRoot, "reel");
  const log = [];
  const commandPlan = buildCommandPlan(plan);
  const videoPlaceholder = hasVideoPlaceholder(commandPlan);

  if (dryRun) {
    return {
      status: "dry_run",
      draftName: resolvedName,
      draftsDir: resolvedDraftsDir || "(CapCut not installed)",
      capCutInstalled: Boolean(resolvedDraftsDir),
      videoPlaceholder,
      fallbackPlan: Boolean(plan._fallback),
      commandPlan
    };
  }

  if (!resolvedDraftsDir) {
    throw new Error(
      "CapCut Drafts folder not found. Install CapCut, open it once to create the folder, or pass --drafts <path>."
    );
  }

  const initResult = capcut([
    "init", resolvedName,
    "--template", REELS_TEMPLATE,
    "--drafts", resolvedDraftsDir
  ]);
  if (!initResult.ok) {
    throw new Error(`capcut-cli init failed: ${initResult.stderr}`);
  }
  log.push({ op: "init", status: "ok", draftName: resolvedName });

  const projectDir = path.join(resolvedDraftsDir, resolvedName);
  executePlan({ plan, projectDir, workspaceRoot, log });

  const lintResult = capcut(["lint", projectDir, "--no-check-paths"]);
  const lintOk = lintResult.status === 0;
  log.push({ op: "lint", status: lintOk ? "ok" : "warnings", output: lintResult.stdout.slice(0, 500) });

  const artifact = registerArtifact(workspaceRoot, {
    path: "creative/capcut-plan.json",
    type: "capcut-draft",
    intent: "reel",
    platform: "instagram",
    sourceRun: `capcut-draft-${Date.now()}`,
    sourceAgent: "capcut-agent",
    status: "needs_human_review",
    metadata: {
      draftName: resolvedName,
      projectDir,
      capCutDraftsDir: resolvedDraftsDir,
      log,
      lintOk,
      steps: log.length,
      stepsOk: log.filter((l) => l.status === "ok").length,
      videoPlaceholder,
      fallbackPlan: Boolean(plan._fallback),
      ...(videoPlaceholder ? {
        videoPlaceholderNote: "No video file found. Open CapCut, drag your video onto Track 1, then adjust overlay timing if needed."
      } : {})
    }
  });

  return {
    status: lintOk ? "ready_for_review" : "ready_with_warnings",
    draftName: resolvedName,
    projectDir,
    draftsDir: resolvedDraftsDir,
    videoPlaceholder,
    log,
    artifact
  };
}

module.exports = { buildCapCutDraft, buildCommandPlan, readCapCutPlan, buildFallbackPlanFromReels, findDraftsDir };
