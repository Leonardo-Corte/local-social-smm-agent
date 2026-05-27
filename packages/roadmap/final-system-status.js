const fs = require("fs");
const path = require("path");

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parsePhaseStatuses(planText) {
  const phases = [];
  const blocks = planText.split(/\n## Phase /).slice(1);
  for (const block of blocks) {
    const titleLine = block.split(/\n/)[0].trim();
    const title = `Phase ${titleLine}`;
    const checks = [...block.matchAll(/- \[(x| )\]\s+(.+)/g)].map((match) => ({
      done: match[1] === "x",
      task: match[2].trim()
    }));
    const done = checks.filter((item) => item.done).length;
    phases.push({
      title,
      done,
      total: checks.length,
      percent: checks.length ? Math.round((done / checks.length) * 100) : 0,
      next: checks.find((item) => !item.done)?.task || null
    });
  }
  return phases;
}

function parseActiveCreativePlan(root) {
  const planPath = path.join(root, ".omx", "plans", "prd-creative-intelligence-engine-2026-05-27.md");
  const text = readText(planPath);
  if (!text) return null;
  const nextMatch = text.match(/Next open goal:\s*\n\s*- ([^\n]+)/);
  return {
    planPath,
    status: nextMatch ? "in_progress" : "complete",
    next: nextMatch ? nextMatch[1].trim() : null
  };
}

function buildFinalSystemStatus(root) {
  const planPath = path.join(root, "docs/roadmap/final-agentic-smm-system-task-plan.md");
  const matrixPath = path.join(root, "docs/roadmap/integration-risk-matrix.json");
  const planText = readText(planPath);
  const matrix = readJson(matrixPath, { integrations: [] });
  const phases = parsePhaseStatuses(planText);
  const activeCreativePlan = parseActiveCreativePlan(root);
  const totals = phases.reduce((acc, phase) => {
    acc.done += phase.done;
    acc.total += phase.total;
    return acc;
  }, { done: 0, total: 0 });
  const roadmapComplete = totals.total > 0 && totals.done === totals.total;
  const nextCriticalTasks = phases.filter((phase) => phase.next).slice(0, 6).map((phase) => ({
    phase: phase.title,
    task: phase.next
  }));
  if (activeCreativePlan?.next) {
    nextCriticalTasks.unshift({
      phase: "Creative Intelligence Engine",
      task: activeCreativePlan.next
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    planPath,
    matrixPath,
    status: roadmapComplete && (!activeCreativePlan || activeCreativePlan.status === "complete") ? "complete" : "in_progress",
    totalDone: totals.done,
    totalTasks: totals.total,
    percent: totals.total ? Math.round((totals.done / totals.total) * 100) : 0,
    phases,
    activeCreativePlan,
    integrations: matrix.integrations || [],
    nextCriticalTasks
  };
}

function statusMarkdown(status) {
  return `# Final SMM System Status

Generated: ${status.generatedAt}

Overall: ${status.status}

Progress: ${status.totalDone}/${status.totalTasks} tasks (${status.percent}%)

## Phases
${status.phases.map((phase) => `- ${phase.title}: ${phase.done}/${phase.total} (${phase.percent}%)${phase.next ? ` — next: ${phase.next}` : ""}`).join("\n")}

${status.activeCreativePlan ? `## Active Creative Hardening Plan
- Status: ${status.activeCreativePlan.status}
- Plan: ${status.activeCreativePlan.planPath}
- Next: ${status.activeCreativePlan.next || "None"}
` : ""}

## Integration Risk Matrix
${status.integrations.map((item) => `- ${item.id}: ${item.decision}; license risk ${item.licenseRisk}; setup ${item.setupWeight}; fallback: ${item.fallback}`).join("\n")}

## Next Critical Tasks
${status.nextCriticalTasks.map((item) => `- ${item.phase}: ${item.task}`).join("\n") || "- None."}
`;
}

function writeFinalSystemStatus(root) {
  const status = buildFinalSystemStatus(root);
  const outDir = path.join(root, "docs/roadmap");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "final-system-status.json"), `${JSON.stringify(status, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "final-system-status.md"), statusMarkdown(status));
  return status;
}

module.exports = { buildFinalSystemStatus, statusMarkdown, writeFinalSystemStatus };
