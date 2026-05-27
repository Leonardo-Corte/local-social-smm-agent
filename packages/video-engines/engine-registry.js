const fs = require("fs");
const path = require("path");

function exists(candidate) {
  return Boolean(candidate && fs.existsSync(candidate));
}

function candidateRoots(name) {
  const home = process.env.HOME || "";
  return [
    process.env[`SMM_${name.toUpperCase().replace(/-/g, "_")}_ROOT`],
    path.join(process.cwd(), name),
    path.join(process.cwd(), "reference", "external", name),
    path.join(process.cwd(), "third_party", name),
    path.join(home, name),
    path.join(home, "Documents", name),
    path.join(home, "Developer", name)
  ].filter(Boolean);
}

function detectVideoEngines() {
  const pixelleRoots = candidateRoots("Pixelle-Video");
  const openMontageRoots = candidateRoots("OpenMontage");
  const pixelleRoot = pixelleRoots.find(exists) || null;
  const openMontageRoot = openMontageRoots.find(exists) || null;
  return {
    generatedAt: new Date().toISOString(),
    engines: [
      {
        id: "capcut-plan",
        status: "available",
        decision: "native deterministic edit plan and optional local CapCut handoff",
        licenseBoundary: "internal adapter plus external CapCut app"
      },
      {
        id: "pixelle-video",
        status: pixelleRoot ? "detected" : "missing",
        root: pixelleRoot,
        searchedRoots: pixelleRoots,
        decision: "optional separate-service adapter",
        licenseBoundary: "Apache-2.0 external checkout/service"
      },
      {
        id: "openmontage",
        status: openMontageRoot ? "detected-reference-only" : "missing-reference-only",
        root: openMontageRoot,
        searchedRoots: openMontageRoots,
        decision: "reference/separate-service only; do not vendor",
        licenseBoundary: "AGPL-3.0 boundary"
      }
    ]
  };
}

function videoEngineRegistryMarkdown(report) {
  return `# Video Engine Registry

Generated: ${report.generatedAt}

${report.engines.map((engine) => `## ${engine.id}
- Status: ${engine.status}
- Decision: ${engine.decision}
- License boundary: ${engine.licenseBoundary}
${engine.root ? `- Root: \`${engine.root}\`` : ""}
`).join("\n")}
`;
}

module.exports = { detectVideoEngines, videoEngineRegistryMarkdown };
