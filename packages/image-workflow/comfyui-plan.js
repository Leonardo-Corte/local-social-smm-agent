const fs = require("fs");
const os = require("os");
const path = require("path");
const { detectBackends } = require("../model-router/detect-profile");

function readText(workspaceRoot, relativePath) {
  const filePath = path.join(workspaceRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function firstExisting(paths) {
  return paths.find((candidate) => fs.existsSync(candidate)) || null;
}

function listExistingFiles(dirPath, extensions) {
  if (!dirPath || !fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath)
    .filter((name) => extensions.some((extension) => name.toLowerCase().endsWith(extension)))
    .slice(0, 20);
}

function detectComfyUiInstall() {
  const home = os.homedir();
  const roots = [
    path.join(home, "ComfyUI"),
    path.join(home, "Documents", "ComfyUI"),
    path.join(home, "Developer", "ComfyUI"),
    path.join(process.cwd(), "ComfyUI"),
    path.join(process.cwd(), "third_party", "ComfyUI")
  ];
  const root = firstExisting(roots);
  const modelRoot = root ? path.join(root, "models") : null;
  const workflowDirs = [
    root ? path.join(root, "user", "default", "workflows") : null,
    root ? path.join(root, "workflows") : null
  ].filter(Boolean);
  return {
    root,
    searchedRoots: roots,
    modelRoot,
    checkpoints: listExistingFiles(modelRoot ? path.join(modelRoot, "checkpoints") : null, [".safetensors", ".ckpt"]),
    loras: listExistingFiles(modelRoot ? path.join(modelRoot, "loras") : null, [".safetensors", ".ckpt"]),
    vae: listExistingFiles(modelRoot ? path.join(modelRoot, "vae") : null, [".safetensors", ".ckpt"]),
    workflows: workflowDirs.flatMap((dirPath) => listExistingFiles(dirPath, [".json"]).map((name) => path.join(dirPath, name))).slice(0, 20)
  };
}

function hardwareModelRecommendations(backends) {
  const comfy = backends.find((backend) => backend.id === "comfyui");
  return [
    {
      id: "sdxl-lightning-or-turbo",
      fit: "fast poster, thumbnail, story background drafts",
      backendRequired: "ComfyUI",
      installPriority: comfy && comfy.available ? "high" : "install-backend-first",
      licensePosture: "check exact model card before commercial/public use",
      notes: "Good first local workflow for Apple Silicon when speed matters; avoid relying on generated text inside images."
    },
    {
      id: "flux-schnell-compatible-local-workflow",
      fit: "higher quality moodboards and event visuals",
      backendRequired: "ComfyUI",
      installPriority: "medium",
      licensePosture: "check exact weights and commercial terms",
      notes: "Use only if hardware handles it comfortably; keep prompts text-light and add copy separately in design tools."
    },
    {
      id: "sd15-or-sdxl-controlnet",
      fit: "reusable brand layouts and reference-guided variants",
      backendRequired: "ComfyUI",
      installPriority: "later",
      licensePosture: "check checkpoint and ControlNet license",
      notes: "Useful after base generation is stable and brand assets exist."
    }
  ];
}

function promptTemplates() {
  return [
    {
      id: "event-poster",
      purpose: "Event poster background",
      size: "1080x1350",
      prompt: "premium New York networking event, stylish professionals in a warm venue, candid social energy, editorial photography, clean negative space for typography, no readable text, realistic lighting"
    },
    {
      id: "reel-thumbnail",
      purpose: "Reel thumbnail",
      size: "1080x1920",
      prompt: "vertical event recap thumbnail, energetic after-work networking in New York, confident premium social atmosphere, expressive faces, sharp foreground, no readable text"
    },
    {
      id: "carousel-cover",
      purpose: "Carousel cover",
      size: "1080x1350",
      prompt: "modern editorial cover image for professional networking tips, New York evening venue, refined but approachable, strong composition, large clean empty area for headline, no readable text"
    },
    {
      id: "story-background",
      purpose: "Story background",
      size: "1080x1920",
      prompt: "Instagram story background for premium networking event, lively conversation, drinks and warm ambience, elegant New York venue, uncluttered center area, no readable text"
    },
    {
      id: "brand-moodboard",
      purpose: "Brand moodboard",
      size: "1536x1024",
      prompt: "moodboard for premium social networking brand in New York, candid conversations, after-work energy, hospitality venue details, confident warm visual language, editorial grid"
    }
  ];
}

function buildComfyUiPlan(workspaceRoot) {
  const backends = detectBackends();
  const comfy = backends.find((backend) => backend.id === "comfyui");
  const install = detectComfyUiInstall();
  const visualBriefs = readText(workspaceRoot, "creative/visual-briefs.md");
  const calendar = readText(workspaceRoot, "calendar/30-day-calendar.md");
  return {
    generatedAt: new Date().toISOString(),
    status: comfy && comfy.available ? "comfyui-command-detected" : install.root ? "comfyui-folder-detected" : "brief-only",
    backend: comfy || null,
    install,
    modelRecommendations: hardwareModelRecommendations(backends),
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    workflowNotes: [
      "Use local image generation only after exact model/workflow license checks.",
      "Do not generate or publish platform assets without human approval.",
      "Prefer text-light layouts unless the selected image model is proven reliable with text.",
      "Keep brand consistency and avoid misleading claims in generated visuals."
    ],
    prompts: promptTemplates(),
    sourceContext: {
      visualBriefs,
      calendarExcerpt: calendar.split("\n").slice(0, 18).join("\n")
    }
  };
}

function comfyUiPlanMarkdown(plan) {
  return `# Optional ComfyUI Image Plan

Status: ${plan.status}

Human approval required: yes

Automatic publish: disabled

## Local Backend
- Command probe: ${plan.backend && plan.backend.available ? `${plan.backend.label} via ${plan.backend.command}` : "missing"}
- ComfyUI folder: ${plan.install.root || "not found"}
- Model folder: ${plan.install.modelRoot || "not found"}
- Checkpoints found: ${plan.install.checkpoints.join(", ") || "none"}
- LoRAs found: ${plan.install.loras.join(", ") || "none"}
- Workflows found: ${plan.install.workflows.join("\n  - ") || "none"}

## Workflow Notes
${plan.workflowNotes.map((item) => `- ${item}`).join("\n")}

## Recommended Local Model Tracks
${plan.modelRecommendations.map((item) => `### ${item.id}
- Fit: ${item.fit}
- Backend required: ${item.backendRequired}
- Install priority: ${item.installPriority}
- License posture: ${item.licensePosture}
- Notes: ${item.notes}
`).join("\n")}

## Prompt Seeds
${plan.prompts.map((item) => `### ${item.id}
- Purpose: ${item.purpose}
- Size: ${item.size}
- Prompt: ${item.prompt}
`).join("\n")}

## Source Visual Briefs
${plan.sourceContext.visualBriefs}
`;
}

module.exports = { buildComfyUiPlan, comfyUiPlanMarkdown };
