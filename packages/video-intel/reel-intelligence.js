const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonCommand(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${(result.stderr || result.stdout || "").trim()}`);
  }
  return JSON.parse(result.stdout);
}

function runCommand(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: options.encoding || "utf8",
    maxBuffer: options.maxBuffer || 20 * 1024 * 1024
  });
}

function commandExists(command) {
  const result = spawnSync("which", [command], { encoding: "utf8" });
  return result.status === 0;
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function safeId(filePath) {
  const parsed = path.parse(filePath);
  return parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "video";
}

function newestVideoFile(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return null;
  }
  return fs.readdirSync(dirPath)
    .map((name) => path.join(dirPath, name))
    .filter((filePath) => fs.statSync(filePath).isFile() && VIDEO_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .map((filePath) => ({ filePath, mtimeMs: fs.statSync(filePath).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.filePath || null;
}

function parseRate(value) {
  if (!value || value === "0/0") {
    return null;
  }
  const [num, den] = String(value).split("/").map(Number);
  if (!den) {
    return num || null;
  }
  return num / den;
}

function probeVideo(filePath) {
  return readJsonCommand("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    filePath
  ]);
}

function extractFrames({ filePath, framesDir, duration }) {
  ensureDir(framesDir);
  const interval = duration && duration < 12 ? 1 : 2;
  const pattern = path.join(framesDir, "frame-%03d.jpg");
  const result = runCommand("ffmpeg", [
    "-y",
    "-i", filePath,
    "-vf", `fps=1/${interval},scale=360:-1`,
    "-frames:v", "12",
    "-q:v", "3",
    pattern
  ]);
  const frames = fs.existsSync(framesDir)
    ? fs.readdirSync(framesDir).filter((name) => name.endsWith(".jpg")).sort()
    : [];
  return {
    ok: result.status === 0 && frames.length > 0,
    stderr: result.stderr || "",
    frames: frames.map((name) => path.join(framesDir, name))
  };
}

function runAudioAnalysis(filePath) {
  const result = runCommand("ffmpeg", [
    "-hide_banner",
    "-i", filePath,
    "-af", "volumedetect,silencedetect=noise=-35dB:d=0.35",
    "-f", "null",
    "-"
  ], { maxBuffer: 30 * 1024 * 1024 });
  const text = result.stderr || "";
  const meanVolume = /mean_volume:\s*([-\d.]+)\s*dB/.exec(text)?.[1] || null;
  const maxVolume = /max_volume:\s*([-\d.]+)\s*dB/.exec(text)?.[1] || null;
  const silenceStarts = [...text.matchAll(/silence_start:\s*([-\d.]+)/g)].map((match) => Number(match[1]));
  const silenceEnds = [...text.matchAll(/silence_end:\s*([-\d.]+)/g)].map((match) => Number(match[1]));
  return {
    ok: result.status === 0,
    meanVolume: meanVolume ? Number(meanVolume) : null,
    maxVolume: maxVolume ? Number(maxVolume) : null,
    silenceEvents: Math.max(silenceStarts.length, silenceEnds.length),
    rawAvailable: Boolean(text.trim())
  };
}

function runKeyframeAnalysis(filePath) {
  const result = runCommand("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-skip_frame", "nokey",
    "-show_entries", "frame=best_effort_timestamp_time",
    "-of", "csv=p=0",
    filePath
  ], { maxBuffer: 20 * 1024 * 1024 });
  const timestamps = (result.stdout || "")
    .split(/\r?\n/)
    .map((line) => Number(line.trim()))
    .filter((value) => Number.isFinite(value));
  return {
    ok: result.status === 0,
    keyframeCount: timestamps.length,
    firstKeyframes: timestamps.slice(0, 10)
  };
}

function transcriptionStatus() {
  const candidates = [
    { command: "whisper", label: "openai-whisper CLI" },
    { command: "whisper-cli", label: "whisper.cpp CLI" },
    { command: "mlx_whisper", label: "MLX Whisper" }
  ];
  const available = candidates.find((candidate) => commandExists(candidate.command));
  if (!available) {
    return {
      status: "missing-backend",
      backend: null,
      notes: [
        "No local Whisper-compatible CLI was found.",
        "Install a no-cost local transcription backend to enable automatic transcript generation."
      ]
    };
  }
  return {
    status: "available-not-run",
    backend: available,
    notes: [
      `${available.label} was detected.`,
      "Automatic transcription execution is intentionally separated so large models do not block every video probe."
    ]
  };
}

function findWhisperModel() {
  const candidates = [
    process.env.WHISPER_MODEL,
    path.join(process.env.HOME || "", "models/whisper/ggml-base.bin"),
    path.join(process.env.HOME || "", "models/whisper/ggml-small.bin"),
    path.join(process.env.HOME || "", ".cache/whisper/ggml-base.bin"),
    path.join(process.env.HOME || "", ".cache/whisper/ggml-small.bin")
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function transcribeWithWhisperCpp({ filePath, analysisDir, videoId }) {
  if (!commandExists("whisper-cli")) {
    return transcriptionStatus();
  }
  const modelPath = findWhisperModel();
  if (!modelPath) {
    return {
      status: "missing-model",
      backend: { command: "whisper-cli", label: "whisper.cpp CLI" },
      notes: [
        "whisper-cli is installed, but no local model file was found.",
        "Set WHISPER_MODEL=/absolute/path/to/ggml-model.bin to enable transcription."
      ]
    };
  }

  ensureDir(analysisDir);
  const wavPath = path.join(analysisDir, `${videoId}-audio-16khz.wav`);
  const transcriptBase = path.join(analysisDir, `${videoId}-transcript`);
  const audio = runCommand("ffmpeg", [
    "-y",
    "-i", filePath,
    "-vn",
    "-ac", "1",
    "-ar", "16000",
    wavPath
  ], { maxBuffer: 30 * 1024 * 1024 });
  if (audio.status !== 0) {
    return {
      status: "audio-extract-failed",
      backend: { command: "whisper-cli", label: "whisper.cpp CLI" },
      notes: [(audio.stderr || audio.stdout || "Audio extraction failed.").trim()]
    };
  }

  const result = runCommand("whisper-cli", [
    "-m", modelPath,
    "-f", wavPath,
    "-otxt",
    "-of", transcriptBase
  ], { maxBuffer: 30 * 1024 * 1024 });
  const transcriptPath = `${transcriptBase}.txt`;
  const transcript = fs.existsSync(transcriptPath) ? fs.readFileSync(transcriptPath, "utf8").trim() : "";
  if (result.status !== 0 || !transcript) {
    return {
      status: "transcription-failed",
      backend: { command: "whisper-cli", label: "whisper.cpp CLI" },
      transcriptPath: fs.existsSync(transcriptPath) ? transcriptPath : null,
      notes: [(result.stderr || result.stdout || "Whisper transcription failed.").trim()]
    };
  }
  return {
    status: "completed",
    backend: { command: "whisper-cli", label: "whisper.cpp CLI" },
    modelPath,
    wavPath,
    transcriptPath,
    transcript,
    notes: ["Local transcription completed with whisper.cpp."]
  };
}

function technicalSummary({ probe, keyframes, audio }) {
  const video = probe.streams.find((stream) => stream.codec_type === "video") || {};
  const audioStream = probe.streams.find((stream) => stream.codec_type === "audio") || null;
  const duration = Number(video.duration || probe.format.duration || 0);
  const width = Number(video.width || 0);
  const height = Number(video.height || 0);
  const fps = parseRate(video.avg_frame_rate || video.r_frame_rate);
  const orientation = height > width ? "vertical" : width > height ? "horizontal" : "square";
  const keyframesPerSecond = duration > 0 ? keyframes.keyframeCount / duration : 0;
  return {
    format: probe.format.format_long_name || probe.format.format_name || "unknown",
    duration,
    width,
    height,
    orientation,
    fps,
    videoCodec: video.codec_name || "unknown",
    audioPresent: Boolean(audioStream),
    audioCodec: audioStream ? audioStream.codec_name || "unknown" : null,
    meanVolume: audio.meanVolume,
    maxVolume: audio.maxVolume,
    silenceEvents: audio.silenceEvents,
    keyframeCount: keyframes.keyframeCount,
    keyframesPerSecond
  };
}

function recommendations(summary) {
  const notes = [];
  if (summary.orientation !== "vertical") {
    notes.push("Consider a 9:16 vertical crop for Reels/Stories unless the creative intentionally uses another format.");
  }
  if (summary.duration > 0 && summary.duration <= 15) {
    notes.push("Duration is short enough for a fast recap; make the first three seconds visually explicit.");
  }
  if (summary.duration > 30) {
    notes.push("Create a tighter short-form edit or split into multiple clips.");
  }
  if (!summary.audioPresent) {
    notes.push("No audio stream detected; add music, voiceover, or captions before publishing.");
  }
  if (summary.meanVolume !== null && summary.meanVolume < -28) {
    notes.push("Audio appears quiet; normalize or replace with a clearer sound bed.");
  }
  if (summary.silenceEvents > 3) {
    notes.push("Several silence events were detected; review pacing and remove dead audio zones.");
  }
  if (summary.keyframesPerSecond < 0.3) {
    notes.push("Low keyframe density can indicate few major scene changes; review whether the edit feels dynamic enough.");
  }
  return notes.length > 0 ? notes : ["Technical checks look usable; focus critique on story, hook, and proof safety."];
}

function reportMarkdown(report) {
  const relFrames = report.frames.map((framePath) => path.relative(report.workspaceRoot, framePath));
  return `# Reel Intelligence Report

Generated at: ${report.generatedAt}

Asset: \`${report.asset.relativePath}\`

SHA-256: \`${report.asset.sha256}\`

## Technical Metadata
- Format: ${report.summary.format}
- Duration: ${report.summary.duration.toFixed(2)} seconds
- Orientation: ${report.summary.orientation}
- Resolution: ${report.summary.width}x${report.summary.height}
- Frame rate: ${report.summary.fps ? `${report.summary.fps.toFixed(2)} fps` : "unknown"}
- Video codec: ${report.summary.videoCodec}
- Audio present: ${report.summary.audioPresent ? "yes" : "no"}
- Audio codec: ${report.summary.audioCodec || "-"}
- Mean volume: ${report.summary.meanVolume === null ? "unknown" : `${report.summary.meanVolume} dB`}
- Max volume: ${report.summary.maxVolume === null ? "unknown" : `${report.summary.maxVolume} dB`}
- Silence events: ${report.summary.silenceEvents}
- Keyframes: ${report.summary.keyframeCount}

## Extracted Frames
${relFrames.length > 0 ? relFrames.map((frame) => `- \`${frame}\``).join("\n") : "- No frames extracted."}

## Transcription
- Status: ${report.transcription.status}
- Backend: ${report.transcription.backend ? report.transcription.backend.label : "-"}
${report.transcription.notes.map((note) => `- ${note}`).join("\n")}
${report.transcription.transcript ? `
### Transcript
\`\`\`text
${report.transcription.transcript}
\`\`\`
` : ""}

## Pacing And First-Three-Seconds Notes
- First-three-second review required: yes
- Use extracted frames to check whether the opening frame communicates event, venue, people, or offer immediately.
- Do not infer exact attendance, guest identity, partnerships, or ticket inclusions from visuals alone.

## Sound Direction
${report.soundNotes.map((note) => `- ${note}`).join("\n")}

## Editing Recommendations
${report.recommendations.map((note) => `- ${note}`).join("\n")}

## Agent Handoff
- \`reel-shorts-producer\`: use this report for hooks, visual beats, edit notes, and missing asset questions.
- \`copywriter\`: use this report for caption angles, but only claim visible or human-confirmed facts.
- \`critic-qa\`: check unsupported claims, weak hooks, and missing proof.
- \`publishing-operator\`: require human approval and exact event details before export.

## Guardrails
- Do not publish automatically.
- Do not invent attendance numbers, venue sales, VIP guests, sponsor relationships, ticket inclusions, or identities.
- Separate observed video facts from assumptions and human-confirmation questions.
`;
}

function buildReelIntelligence({ workspaceRoot, assetPath, transcribe = false }) {
  const absoluteAssetPath = path.isAbsolute(assetPath) ? assetPath : path.join(workspaceRoot, assetPath);
  if (!fs.existsSync(absoluteAssetPath)) {
    throw new Error(`Video asset not found: ${absoluteAssetPath}`);
  }
  const videoId = safeId(absoluteAssetPath);
  const framesDir = path.join(workspaceRoot, "assets/frames", videoId);
  const analysisDir = path.join(workspaceRoot, "assets/analysis");
  const probe = probeVideo(absoluteAssetPath);
  const audio = runAudioAnalysis(absoluteAssetPath);
  const keyframes = runKeyframeAnalysis(absoluteAssetPath);
  const summary = technicalSummary({ probe, keyframes, audio });
  const framesResult = extractFrames({ filePath: absoluteAssetPath, framesDir, duration: summary.duration });
  const transcription = transcribe
    ? transcribeWithWhisperCpp({ filePath: absoluteAssetPath, analysisDir, videoId })
    : transcriptionStatus();
  const soundNotes = summary.audioPresent
    ? [
      "Review whether original audio should stay, be ducked under music, or be replaced by a trending sound.",
      "If people are speaking, generate captions after transcription is available."
    ]
    : [
      "Add a sound bed or voiceover; current file has no detected audio stream.",
      "Use on-screen captions for context if publishing as a Reel."
    ];

  const report = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    asset: {
      absolutePath: absoluteAssetPath,
      relativePath: path.relative(workspaceRoot, absoluteAssetPath),
      sha256: sha256(absoluteAssetPath)
    },
    summary,
    frames: framesResult.frames,
    transcription,
    soundNotes,
    recommendations: recommendations(summary),
    raw: {
      probe,
      framesExtractionOk: framesResult.ok,
      audioAnalysisOk: audio.ok,
      keyframeAnalysisOk: keyframes.ok
    }
  };
  return report;
}

function findDefaultAsset(workspaceRoot) {
  return newestVideoFile(path.join(workspaceRoot, "assets/raw"));
}

function writeReelIntelligence({ workspaceRoot, report }) {
  const analysisDir = path.join(workspaceRoot, "assets/analysis");
  ensureDir(analysisDir);
  const videoId = safeId(report.asset.absolutePath);
  const jsonPath = path.join(analysisDir, `${videoId}-reel-intelligence.json`);
  const mdPath = path.join(analysisDir, `${videoId}-reel-intelligence.md`);
  const latestPath = path.join(analysisDir, "reel-intelligence-latest.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, reportMarkdown(report));
  fs.writeFileSync(latestPath, reportMarkdown(report));
  return { jsonPath, mdPath, latestPath };
}

module.exports = {
  buildReelIntelligence,
  findDefaultAsset,
  reportMarkdown,
  writeReelIntelligence
};
