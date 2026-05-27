const fs = require("fs");
const path = require("path");
const { runOllamaGenerate } = require("../local-runtime/model-client");
const { registerArtifact } = require("../publishing/artifact-registry");
const { workspacePaths } = require("../workspace-runner/workspace-paths");

const DEFAULT_CANDIDATES = [
  { id: "strategist", lens: "business goal, positioning, offer clarity" },
  { id: "platform-specialist", lens: "platform-native format and algorithm fit" },
  { id: "creator", lens: "hook, story, emotion, production simplicity" },
  { id: "contrarian", lens: "audience skepticism, safety, weak proof, cringe risk" }
];

const RUBRICS = [
  "business fit",
  "platform fit",
  "hook strength",
  "evidence and claim safety",
  "audience objection handling",
  "production feasibility"
];

function readText(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function buildContext(workspaceRoot) {
  return [
    readText(path.join(workspaceRoot, "business/business.md")).slice(0, 2500),
    readText(path.join(workspaceRoot, "platforms/platform-playbooks.md")).slice(0, 2500),
    readText(path.join(workspaceRoot, "research/live-trend-report.md"), readText(path.join(workspaceRoot, "research/trend-report.md"))).slice(0, 2500),
    readText(path.join(workspaceRoot, "assets/analysis/reel-intelligence-latest.md")).slice(0, 1500),
    readText(path.join(workspaceRoot, "memory/user-feedback.md")).slice(0, 1200)
  ].filter(Boolean).join("\n\n---\n\n");
}

function fallbackCandidate(agent, request) {
  return `# Candidate: ${agent.id}

Angle: ${agent.lens}

Hook: Make the value obvious in the first line.

Draft:
${request}

CTA: Ask the audience to take one clear next action.

Risks:
- Needs factual review before publishing.
- Needs platform-specific formatting.
`;
}

async function generateCandidate({ agent, request, context, model, timeoutMs }) {
  const prompt = `You are ${agent.id}, a specialist in ${agent.lens}.

Workspace context:
${context}

User request:
${request}

Produce one strong candidate social output. Include hook, draft, CTA, production notes, and risks. Do not publish.`;
  try {
    return await runOllamaGenerate({ model, prompt, timeoutMs: Math.min(timeoutMs, 90000) });
  } catch (_error) {
    return fallbackCandidate(agent, request);
  }
}

function heuristicScore(text) {
  let score = 50;
  if (/hook/i.test(text)) score += 8;
  if (/cta|call to action|comment|join|ticket|rsvp/i.test(text)) score += 8;
  if (/risk|blocker|approval|review/i.test(text)) score += 8;
  if (/instagram|facebook|linkedin|\bx\b|reddit|platform/i.test(text)) score += 6;
  if (text.length > 800) score += 5;
  if (/guarantee|guaranteed|vip|celebrity|sold out/i.test(text)) score -= 15;
  return Math.max(0, Math.min(100, score));
}

async function judgeCandidates({ candidates, request, context, model, timeoutMs }) {
  const candidateBlock = candidates.map((candidate, index) => `## Candidate ${index + 1}: ${candidate.agent}
${candidate.output}`).join("\n\n");
  const prompt = `You are the final judge for a social media agent team.

Rubrics:
${RUBRICS.map((rubric) => `- ${rubric}`).join("\n")}

Workspace context:
${context.slice(0, 4000)}

Request:
${request}

Candidates:
${candidateBlock}

Score each candidate 0-100, identify winner, explain objections, and synthesize the final artifact. Keep it draft-only and human-approved.`;
  try {
    const output = await runOllamaGenerate({ model, prompt, timeoutMs: Math.min(timeoutMs, 120000) });
    return { mode: "model-judge", output };
  } catch (_error) {
    const ranked = candidates.map((candidate) => ({ ...candidate, score: heuristicScore(candidate.output) }))
      .sort((a, b) => b.score - a.score);
    return {
      mode: "heuristic-judge",
      output: `# Consensus Result

Winner: ${ranked[0].agent} (${ranked[0].score}/100)

## Scores
${ranked.map((item) => `- ${item.agent}: ${item.score}/100`).join("\n")}

## Final Draft
${ranked[0].output}

## Human Approval Blockers
- Verify factual claims, dates, prices, ticket inclusions, venue details, and platform rules before publishing.
`
    };
  }
}

async function runConsensusOrchestration({ root, workspace, request, model, timeoutMs = 240000, candidateAgents = DEFAULT_CANDIDATES }) {
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    throw new Error(`Workspace not found: ${workspace}`);
  }
  const runId = timestampId();
  const runRoot = path.join(workspaceRoot, "consensus-runs", runId);
  const context = buildContext(workspaceRoot);
  const candidates = [];

  for (const agent of candidateAgents) {
    const output = await generateCandidate({ agent, request, context, model, timeoutMs });
    candidates.push({ agent: agent.id, lens: agent.lens, output, heuristicScore: heuristicScore(output) });
  }
  const judge = await judgeCandidates({ candidates, request, context, model, timeoutMs });
  const report = {
    runId,
    generatedAt: new Date().toISOString(),
    request,
    model,
    rubrics: RUBRICS,
    candidates,
    judge,
    convergence: {
      candidateCount: candidates.length,
      threshold: 70,
      heuristicWinner: candidates.slice().sort((a, b) => b.heuristicScore - a.heuristicScore)[0]?.agent || null,
      needsHumanReview: true
    }
  };
  writeText(path.join(runRoot, "consensus.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeText(path.join(runRoot, "consensus.md"), consensusMarkdown(report));
  const artifact = registerArtifact(workspaceRoot, {
    path: `consensus-runs/${runId}/consensus.md`,
    type: "consensus-output",
    intent: "agentic-social-content",
    sourceRun: runId,
    sourceAgent: "consensus-orchestrator",
    status: "needs_human_review",
    metadata: { request: request.slice(0, 300), mode: judge.mode, candidateCount: candidates.length }
  });
  return { runId, runRoot, report, artifact };
}

function consensusMarkdown(report) {
  return `# MassGen-Style Consensus Run

Run: ${report.runId}

Request: ${report.request}

Mode: ${report.judge.mode}

Human approval required: yes

## Rubrics
${report.rubrics.map((item) => `- ${item}`).join("\n")}

## Candidates
${report.candidates.map((candidate) => `### ${candidate.agent} (${candidate.heuristicScore}/100)
Lens: ${candidate.lens}

${candidate.output}
`).join("\n")}

## Judge And Final Synthesis
${report.judge.output}

## Convergence
- Candidate count: ${report.convergence.candidateCount}
- Threshold: ${report.convergence.threshold}
- Heuristic winner: ${report.convergence.heuristicWinner}
- Needs human review: yes
`;
}

module.exports = {
  DEFAULT_CANDIDATES,
  RUBRICS,
  consensusMarkdown,
  heuristicScore,
  runConsensusOrchestration
};
