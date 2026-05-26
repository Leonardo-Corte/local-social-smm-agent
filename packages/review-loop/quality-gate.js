const fs = require("fs");
const path = require("path");

const checks = [
  {
    id: "brief-complete",
    label: "Brief complete",
    points: 15,
    test: (ctx) => {
      const required = ["projectName", "niche", "targetAudience", "primaryGoal30Days", "offer", "tone"];
      return required.every((field) => String(ctx.brief[field] || "").trim().length > 0);
    }
  },
  {
    id: "calendar-30-days",
    label: "30-day calendar present",
    points: 12,
    test: (ctx) => (ctx.files["calendar/30-day-calendar.md"].match(/^\|\s*\d+\s*\|/gm) || []).length >= 30
  },
  {
    id: "drafts-present",
    label: "Draft artifacts present",
    points: 12,
    test: (ctx) => ["drafts/posts.md", "drafts/carousels.md", "drafts/reels.md"].every((file) => ctx.files[file].length > 80)
  },
  {
    id: "persona-simulation",
    label: "Persona simulation present",
    points: 10,
    test: (ctx) => ctx.files["simulation/persona-report.md"].includes("Persona Simulation Report")
  },
  {
    id: "trend-report",
    label: "Trend report present",
    points: 10,
    test: (ctx) => ctx.files["research/trend-report.md"].includes("Trend") || ctx.files["research/trend-report.md"].length > 200
  },
  {
    id: "model-routing",
    label: "Model routing present",
    points: 10,
    test: (ctx) => ctx.files["model-routing-report.md"].includes("Model Routing Report")
  },
  {
    id: "publishing-safety",
    label: "Publishing safety locked",
    points: 15,
    test: (ctx) => ctx.manifest.automaticPublishEnabled === false && ctx.manifest.requiredHumanApproval === true
  },
  {
    id: "regeneration-loop",
    label: "Regeneration loop exists",
    points: 8,
    test: (ctx) => Array.isArray(ctx.queue.tasks)
  },
  {
    id: "workflow-run",
    label: "Workflow run present",
    points: 8,
    test: (ctx) => Boolean(ctx.manifest.lastWorkflowRun && ctx.manifest.lastWorkflowStatus === "needs-human-review")
  }
];

const requiredFiles = [
  "calendar/30-day-calendar.md",
  "drafts/posts.md",
  "drafts/carousels.md",
  "drafts/reels.md",
  "simulation/persona-report.md",
  "research/trend-report.md",
  "model-routing-report.md"
];

function readText(workspaceRoot, relativePath) {
  const filePath = path.join(workspaceRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(workspaceRoot, relativePath, fallback) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function scoreWorkspace(workspaceRoot) {
  const ctx = {
    brief: readJson(workspaceRoot, "project-brief.json", {}),
    manifest: readJson(workspaceRoot, "workspace-manifest.json", {}),
    queue: readJson(workspaceRoot, "memory/regeneration-queue.json", { tasks: [] }),
    files: Object.fromEntries(requiredFiles.map((file) => [file, readText(workspaceRoot, file)]))
  };

  const results = checks.map((check) => {
    const passed = Boolean(check.test(ctx));
    return {
      id: check.id,
      label: check.label,
      points: check.points,
      passed,
      score: passed ? check.points : 0
    };
  });
  const score = results.reduce((sum, item) => sum + item.score, 0);
  const maxScore = results.reduce((sum, item) => sum + item.points, 0);
  const status = score >= 85 ? "ready_for_human_review" : score >= 65 ? "needs_iteration" : "blocked";

  return {
    generatedAt: new Date().toISOString(),
    workspace: path.basename(workspaceRoot),
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    status,
    automaticPublishEnabled: false,
    requiredHumanApproval: true,
    results,
    blockers: results.filter((item) => !item.passed).map((item) => item.label)
  };
}

function qualityMarkdown(report) {
  return `# Workspace Quality Gate

Workspace: ${report.workspace}

Score: ${report.score}/${report.maxScore} (${report.percentage}%)

Status: ${report.status}

Publishing: automatic publish disabled, human approval required.

| Check | Score | Status |
| --- | --- | --- |
${report.results.map((item) => `| ${item.label} | ${item.score}/${item.points} | ${item.passed ? "pass" : "fail"} |`).join("\n")}

## Blockers
${report.blockers.length > 0 ? report.blockers.map((item) => `- ${item}`).join("\n") : "- none"}
`;
}

module.exports = { qualityMarkdown, scoreWorkspace };
