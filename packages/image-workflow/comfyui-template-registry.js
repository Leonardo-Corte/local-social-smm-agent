const fs = require("fs");
const path = require("path");

const TEMPLATES = [
  {
    id: "reel-cover-9x16",
    purpose: "High-energy vertical reel cover",
    preset: "reel",
    expectedAspectRatio: "9:16",
    positiveNodeRole: "main visual prompt",
    negativeNodeRole: "quality/safety negative prompt",
    bestFor: ["instagram", "facebook", "x"],
    promptGuidance: "Keep the visual text-free, with strong subject/background separation and space for external overlay."
  },
  {
    id: "carousel-cover-4x5",
    purpose: "Instagram/LinkedIn carousel cover background",
    preset: "cover",
    expectedAspectRatio: "4:5",
    positiveNodeRole: "editorial cover prompt",
    negativeNodeRole: "bad anatomy, unreadable text, logos",
    bestFor: ["instagram", "linkedin", "facebook"],
    promptGuidance: "Use clean negative space for typography that will be added outside the model."
  },
  {
    id: "square-social-1x1",
    purpose: "General square post visual",
    preset: "square",
    expectedAspectRatio: "1:1",
    positiveNodeRole: "social post prompt",
    negativeNodeRole: "watermark, logo, broken text",
    bestFor: ["instagram", "facebook", "x"],
    promptGuidance: "Prefer simple composition and avoid visual clutter."
  },
  {
    id: "story-background-9x16",
    purpose: "Story background with center-safe copy area",
    preset: "story",
    expectedAspectRatio: "9:16",
    positiveNodeRole: "story background prompt",
    negativeNodeRole: "text, watermark, third-party logo",
    bestFor: ["instagram", "facebook"],
    promptGuidance: "Leave the middle third clean for overlays, poll stickers, or CTA."
  }
];

function templateById(id) {
  return TEMPLATES.find((template) => template.id === id) || null;
}

function buildTemplateRegistryReport() {
  return {
    generatedAt: new Date().toISOString(),
    status: "template-contracts-ready",
    note: "These are template contracts for exported ComfyUI API workflows. The user still provides the actual workflow JSON because model filenames and nodes differ per machine.",
    templates: TEMPLATES
  };
}

function templateRegistryMarkdown(report) {
  return `# ComfyUI Workflow Template Registry

Status: ${report.status}

${report.note}

## Templates
${report.templates.map((template) => `### ${template.id}
- Purpose: ${template.purpose}
- Preset: ${template.preset}
- Aspect ratio: ${template.expectedAspectRatio}
- Best for: ${template.bestFor.join(", ")}
- Positive node role: ${template.positiveNodeRole}
- Negative node role: ${template.negativeNodeRole}
- Prompt guidance: ${template.promptGuidance}
`).join("\n")}
`;
}

function writeTemplateRegistry(root) {
  const report = buildTemplateRegistryReport();
  const outDir = path.join(root, "docs/model-routing");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "comfyui-template-registry.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "comfyui-template-registry.md"), templateRegistryMarkdown(report));
  return report;
}

module.exports = {
  TEMPLATES,
  buildTemplateRegistryReport,
  templateById,
  templateRegistryMarkdown,
  writeTemplateRegistry
};
