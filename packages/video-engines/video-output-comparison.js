const fs = require("fs");
const path = require("path");
const { readArtifactRegistry } = require("../publishing/artifact-registry");
const { resolveInside } = require("../workspace-runner/workspace-paths");

function bytesFor(workspaceRoot, relativePath) {
  const absolute = resolveInside(workspaceRoot, relativePath);
  return fs.existsSync(absolute) ? fs.statSync(absolute).size : null;
}

function sourceLabel(artifact) {
  const agent = artifact.sourceAgent || "unknown-agent";
  if (/pixelle/i.test(agent) || /pixelle/i.test(artifact.intent || "")) return "pixelle";
  if (/capcut/i.test(agent) || /capcut/i.test(artifact.intent || "")) return "capcut";
  if (/openmontage/i.test(agent) || /openmontage/i.test(artifact.intent || "")) return "openmontage-boundary";
  return agent;
}

function scoreVideoArtifact(artifact, sizeBytes) {
  const warnings = [];
  let score = 100;
  if (artifact.status !== "approved") {
    warnings.push("Human approval is still required.");
    score -= 20;
  }
  if (!sizeBytes) {
    warnings.push("Output file is missing or empty.");
    score -= 40;
  } else if (sizeBytes < 1024) {
    warnings.push("Output file is suspiciously small; verify it is a real MP4.");
    score -= 25;
  }
  if (artifact.automaticPublishEnabled !== false) {
    warnings.push("Artifact must keep automatic publishing disabled.");
    score -= 50;
  }
  return {
    score: Math.max(0, score),
    status: score >= 85 ? "strong_candidate" : score >= 60 ? "needs_review" : "blocked_or_placeholder",
    warnings
  };
}

function buildVideoOutputComparison({ workspaceRoot }) {
  const registry = readArtifactRegistry(workspaceRoot);
  const videos = (registry.artifacts || []).filter((artifact) => artifact.type === "video");
  const candidates = videos.map((artifact) => {
    const sizeBytes = bytesFor(workspaceRoot, artifact.path);
    const score = scoreVideoArtifact(artifact, sizeBytes);
    return {
      id: artifact.id,
      path: artifact.path,
      engine: sourceLabel(artifact),
      intent: artifact.intent,
      status: artifact.status,
      sourceAgent: artifact.sourceAgent || null,
      sourceRun: artifact.sourceRun || null,
      sizeBytes,
      automaticPublishEnabled: artifact.automaticPublishEnabled,
      requiredHumanApproval: artifact.requiredHumanApproval,
      score: score.score,
      readiness: score.status,
      warnings: score.warnings
    };
  }).sort((a, b) => b.score - a.score || String(a.path).localeCompare(String(b.path)));

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    status: candidates.length ? "ready_for_human_comparison" : "no_video_artifacts",
    candidates,
    winner: candidates[0] || null,
    guardrails: [
      "This comparison does not publish anything.",
      "AGPL/OpenMontage-style evaluation remains a clean-room report unless a separate service is explicitly configured.",
      "A human must watch the final MP4 before approval."
    ]
  };
}

function comparisonMarkdown(report) {
  return `# Generated Video Output Comparison

Generated: ${report.generatedAt}

Status: ${report.status}

Winner candidate: ${report.winner ? `${report.winner.engine} / \`${report.winner.path}\` (${report.winner.score}/100)` : "-"}

## Candidates
| Engine | Artifact | Status | Score | Size |
| --- | --- | --- | ---: | ---: |
${report.candidates.map((item) => `| ${item.engine} | \`${item.path}\` | ${item.status} / ${item.readiness} | ${item.score} | ${item.sizeBytes || 0} |`).join("\n") || "| - | No video artifacts found | - | 0 | 0 |"}

## Warnings
${report.candidates.flatMap((item) => item.warnings.map((warning) => `- ${item.engine} / \`${item.path}\`: ${warning}`)).join("\n") || "- None."}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}
`;
}

function writeVideoOutputComparison({ workspaceRoot }) {
  const report = buildVideoOutputComparison({ workspaceRoot });
  const outDir = resolveInside(workspaceRoot, "creative", "video-engines");
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "video-output-comparison.json");
  const mdPath = path.join(outDir, "video-output-comparison.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, comparisonMarkdown(report));
  return { report, jsonPath, mdPath };
}

module.exports = {
  buildVideoOutputComparison,
  comparisonMarkdown,
  writeVideoOutputComparison
};
