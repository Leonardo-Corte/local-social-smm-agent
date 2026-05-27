const fs = require("fs");
const path = require("path");

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function buildVideoEnginePlan(workspaceRoot) {
  const business = readText(path.join(workspaceRoot, "business/business.md")).slice(0, 2500);
  const reelIntel = readText(path.join(workspaceRoot, "assets/analysis/reel-intelligence-latest.md")).slice(0, 2500);
  const capcutPlan = readText(path.join(workspaceRoot, "creative/capcut-plan.md")).slice(0, 2500);
  return {
    generatedAt: new Date().toISOString(),
    status: "adapter-roadmap",
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    productContract: {
      brain: "this SMM workspace remains the marketing/orchestration brain",
      artifactGate: "all video outputs must be registered as needs_human_review",
      sourceOfTruth: [
        "business/business.md",
        "research/trend-report.md",
        "assets/analysis/reel-intelligence-latest.md",
        "creative/capcut-plan.json",
        "creative/video-engine-plan.json"
      ]
    },
    candidates: [
      {
        id: "openmontage",
        repo: "calesthio/OpenMontage",
        license: "AGPL-3.0",
        decision: "separate-service-or-reference-only",
        value: "Pipeline manifests, stage skills, real-footage sourcing, Remotion/HyperFrames composition, ffprobe/frame/audio/subtitle validation, provider scoring.",
        integrationPath: "Do not vendor. Build an OpenMontage-inspired validation/reporting layer and optionally call a separate local OpenMontage checkout later.",
        blocker: "AGPL network-copyleft boundary and provider-heavy runtime."
      },
      {
        id: "pixelle-video",
        repo: "AIDC-AI/Pixelle-Video",
        license: "Apache-2.0",
        decision: "optional-adapter-spike",
        value: "Topic-to-video engine, script generation, image/video generation, TTS, BGM, Streamlit UI, ComfyUI workflow architecture, custom media analysis.",
        integrationPath: "Keep as separate Python service first. Feed it our script/visual plan; import final MP4 plus metadata back into artifact registry.",
        blocker: "Heavy runtime and many model/backend choices; must prove it runs on the target Mac before core integration."
      },
      {
        id: "capcut-cli",
        repo: "renezander030/capcut-cli",
        license: "MIT",
        decision: "active-local-adapter",
        value: "Local CapCut draft construction from explicit command plans.",
        integrationPath: "Use current capcut-plan.json and capcut:generate route for deterministic draft handoff.",
        blocker: "CapCut final export/opening remains human-reviewed."
      }
    ],
    implementationPhases: [
      "Phase 1: strengthen current reel intelligence and CapCut plan quality.",
      "Phase 2: add OpenMontage-style video QA: ffprobe validation, frame sampling, audio loudness, subtitle/overlay checks, delivery checklist.",
      "Phase 3: add Pixelle adapter spike as a separate optional Python service; do not block chat workflow if missing.",
      "Phase 4: add OpenMontage separate-checkout bridge only if license boundary and install test are acceptable.",
      "Phase 5: compare outputs against human QA and platform performance rubric before making any engine default."
    ],
    workspaceContext: {
      business,
      reelIntel,
      capcutPlan
    }
  };
}

function videoEnginePlanMarkdown(plan) {
  return `# Video Engine Integration Plan

Status: ${plan.status}

Human approval required: yes

Automatic publish: disabled

## Product Contract

- Brain: ${plan.productContract.brain}
- Artifact gate: ${plan.productContract.artifactGate}
- Source of truth:
${plan.productContract.sourceOfTruth.map((item) => `  - \`${item}\``).join("\n")}

## Candidate Engines

${plan.candidates.map((candidate) => `### ${candidate.id}
- Repo: ${candidate.repo}
- License: ${candidate.license}
- Decision: ${candidate.decision}
- Value: ${candidate.value}
- Integration path: ${candidate.integrationPath}
- Blocker: ${candidate.blocker}
`).join("\n")}

## Implementation Phases

${plan.implementationPhases.map((item) => `- ${item}`).join("\n")}

## Workspace Context Snapshot

### Business
${plan.workspaceContext.business || "-"}

### Reel Intelligence
${plan.workspaceContext.reelIntel || "-"}

### CapCut Plan
${plan.workspaceContext.capcutPlan || "-"}
`;
}

module.exports = { buildVideoEnginePlan, videoEnginePlanMarkdown };
