const fs = require("fs");
const path = require("path");

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

function buildClientReport(workspaceRoot) {
  const brief = readJson(workspaceRoot, "project-brief.json", {});
  const quality = readJson(workspaceRoot, "review/quality-gate.json", {});
  const manifest = readJson(workspaceRoot, "workspace-manifest.json", {});
  return `# Client Workspace Report

Project: ${brief.projectName}

## Executive Summary
- Niche: ${brief.niche}
- Target: ${brief.targetAudience}
- Offer: ${brief.offer}
- 30-day goal: ${brief.primaryGoal30Days}
- Quality gate: ${quality.score || 0}/${quality.maxScore || 100} ${quality.status || "missing"}
- Workflow status: ${manifest.lastWorkflowStatus || "not-run"}

## Safety
- Automatic publishing is disabled.
- Human approval is required.
- DM/comment/like/follow automation is not included.

## Strategy
${readText(workspaceRoot, "strategy/content-pillars.md")}

## Platform Playbooks
${readText(workspaceRoot, "platforms/platform-playbooks.md")}

## Calendar
${readText(workspaceRoot, "calendar/30-day-calendar.md")}

## Drafts
${readText(workspaceRoot, "drafts/posts.md")}

${readText(workspaceRoot, "drafts/threads.md")}

${readText(workspaceRoot, "drafts/reddit.md")}

## Persona Simulation
${readText(workspaceRoot, "simulation/persona-report.md")}

## Quality Gate
${readText(workspaceRoot, "review/quality-gate.md")}
`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownishToHtml(markdown) {
  return String(markdown || "")
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) {
        return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      }
      if (line.startsWith("## ")) {
        return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      }
      if (line.startsWith("- ")) {
        return `<p class="bullet">${escapeHtml(line)}</p>`;
      }
      if (line.trim() === "") {
        return "";
      }
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("\n");
}

function buildClientReportHtml(workspaceRoot) {
  const report = buildClientReport(workspaceRoot);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Workspace Report</title>
  <style>
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:#24313d; background:#f7fafc; }
    main { max-width: 900px; margin: 0 auto; padding: 40px 22px; background:#fff; min-height:100vh; }
    h1 { font-size: 30px; margin: 0 0 18px; letter-spacing:0; }
    h2 { font-size: 20px; margin: 28px 0 10px; border-top:1px solid #d9e2ec; padding-top:20px; letter-spacing:0; }
    h3 { font-size: 16px; margin: 18px 0 8px; letter-spacing:0; }
    p { line-height:1.55; margin: 7px 0; }
    .bullet { padding-left: 12px; }
    table { width:100%; border-collapse: collapse; font-size: 14px; }
    td, th { border:1px solid #d9e2ec; padding:7px; vertical-align:top; }
  </style>
</head>
<body><main>${markdownishToHtml(report)}</main></body>
</html>`;
}

module.exports = { buildClientReport, buildClientReportHtml };
