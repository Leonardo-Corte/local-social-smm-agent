const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function blackboardPath(workspaceRoot, runId) {
  return path.join(workspaceRoot, "team-runs", runId, "blackboard.json");
}

function decisionLogPath(workspaceRoot) {
  return path.join(workspaceRoot, "memory", "decision-log.json");
}

function makeEntryId() {
  return crypto.randomBytes(8).toString("hex");
}

function writeEntry(workspaceRoot, runId, entry) {
  const filePath = blackboardPath(workspaceRoot, runId);
  const board = readJson(filePath, { runId, entries: [] });
  const full = Object.assign(
    {
      entryId: makeEntryId(),
      runId,
      timestamp: new Date().toISOString(),
      agent: "",
      step: "",
      type: "handoff",
      content: "",
      confidence: 50,
      targetAgents: [],
      requiresRevision: false,
      revisionOf: null,
      revisionInstructions: null,
      resolved: false,
      metadata: {}
    },
    entry
  );
  board.entries.push(full);
  writeJson(filePath, board);
  return full;
}

function readEntries(workspaceRoot, runId, filters) {
  const filePath = blackboardPath(workspaceRoot, runId);
  const board = readJson(filePath, { runId, entries: [] });
  let entries = board.entries || [];
  if (!filters) {
    return entries;
  }
  if (filters.agent) {
    entries = entries.filter((entry) => entry.agent === filters.agent);
  }
  if (filters.type) {
    entries = entries.filter((entry) => entry.type === filters.type);
  }
  if (filters.step) {
    entries = entries.filter((entry) => entry.step === filters.step);
  }
  if (filters.resolved !== undefined) {
    entries = entries.filter((entry) => entry.resolved === filters.resolved);
  }
  return entries;
}

function getRunSummary(workspaceRoot, runId) {
  const entries = readEntries(workspaceRoot, runId);
  const blockers = entries.filter((entry) => entry.type === "blocker" && !entry.resolved);
  const revision_requests = entries.filter((entry) => entry.type === "revision_request" && !entry.resolved);
  const decisions = entries.filter((entry) => entry.type === "decision");
  const risks = entries.filter((entry) => entry.type === "risk");
  const handoffs = entries.filter((entry) => entry.type === "handoff");
  const approval_notes = entries.filter((entry) => entry.type === "approval_note");
  const agents = [...new Set(entries.map((entry) => entry.agent))].filter(Boolean);
  const steps = [...new Set(entries.map((entry) => entry.step))].filter(Boolean);
  return {
    runId,
    totalEntries: entries.length,
    agents,
    steps,
    blockers: blockers.map((entry) => ({ entryId: entry.entryId, agent: entry.agent, step: entry.step, content: entry.content })),
    revision_requests: revision_requests.map((entry) => ({
      entryId: entry.entryId,
      agent: entry.agent,
      step: entry.step,
      content: entry.content,
      targetAgents: entry.targetAgents,
      revisionInstructions: entry.revisionInstructions
    })),
    decisions: decisions.map((entry) => ({ entryId: entry.entryId, agent: entry.agent, step: entry.step, content: entry.content, confidence: entry.confidence })),
    risks: risks.map((entry) => ({ entryId: entry.entryId, agent: entry.agent, step: entry.step, content: entry.content })),
    handoffs: handoffs.map((entry) => ({ entryId: entry.entryId, agent: entry.agent, step: entry.step })),
    approval_notes: approval_notes.map((entry) => ({ entryId: entry.entryId, agent: entry.agent, content: entry.content }))
  };
}

function writeDecisionLog(workspaceRoot, entry) {
  const filePath = decisionLogPath(workspaceRoot);
  const log = readJson(filePath, { entries: [] });
  const full = Object.assign(
    {
      entryId: makeEntryId(),
      timestamp: new Date().toISOString(),
      runId: null,
      step: null,
      agent: null,
      type: "decision",
      content: "",
      metadata: {}
    },
    entry
  );
  log.entries.push(full);
  writeJson(filePath, log);
  return full;
}

function readDecisionLog(workspaceRoot, limit) {
  const filePath = decisionLogPath(workspaceRoot);
  const log = readJson(filePath, { entries: [] });
  const entries = log.entries || [];
  if (!limit) {
    return entries;
  }
  return entries.slice(-limit);
}

function resolveEntry(workspaceRoot, runId, entryId) {
  const filePath = blackboardPath(workspaceRoot, runId);
  const board = readJson(filePath, { runId, entries: [] });
  for (const entry of board.entries) {
    if (entry.entryId === entryId) {
      entry.resolved = true;
    }
  }
  writeJson(filePath, board);
}

module.exports = {
  writeEntry,
  readEntries,
  getRunSummary,
  writeDecisionLog,
  readDecisionLog,
  resolveEntry
};
