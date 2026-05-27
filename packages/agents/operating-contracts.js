const fs = require("fs");
const path = require("path");
const { trainingPackMarkdown } = require("./training-packs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function schemaFor(agent) {
  return {
    agentId: agent.id,
    status: "completed | needs-human-input | blocked",
    observedFacts: ["Only facts found in provided inputs or cited sources."],
    assumptions: ["Clearly labeled assumptions."],
    recommendations: ["Concrete next actions or artifact changes."],
    blockers: ["Missing proof, missing asset, policy issue, or approval gap."],
    handoff: {
      targetAgent: "next agent id or human",
      reason: "why the handoff is needed",
      requiredInputs: ["files or answers needed next"]
    }
  };
}

function contractMarkdown(agents) {
  return `# Agent Operating Contracts

Every agent must stay inside the generated workspace context. The system is human-approved: agents can propose, critique, generate drafts, and prepare exports, but they cannot publish, DM, comment, like, follow, bypass credentials, or invent proof.

## Global Output Rules
- Start from \`business/business.md\` when it exists.
- Separate observed facts, assumptions, recommendations, and blockers.
- Cite source URLs or file paths when using research, trend, repo, video, or publishing evidence.
- Ask a proactive question only when missing information changes facts, event logistics, claims, pricing, or approval.
- Use \`platforms/platform-playbooks.md\` when it exists; Instagram, Facebook, LinkedIn, X, and Reddit require different research, formats, audience assumptions, and approval blockers.
- Treat X and Reddit account-facing actions as blocked unless a human uses a manual or official approved path.
- For Reddit, include subreddit-rule review as a blocker before any draft can be used publicly.
- End with a concrete handoff: next agent, human reviewer, or regeneration task.

${agents.map((agent) => `## ${agent.name} (\`${agent.id}\`)

Mission: ${agent.mission}

### Inputs
${agent.inputs.map((item) => `- ${item}`).join("\n")}

### Outputs
${agent.outputs.map((item) => `- ${item}`).join("\n")}

### Quality Checks
${agent.qualityChecks.map((item) => `- ${item}`).join("\n")}

### Escalation Rules
${agent.escalationRules.map((item) => `- ${item}`).join("\n")}

### Required Response Schema
\`\`\`json
${JSON.stringify(schemaFor(agent), null, 2)}
\`\`\`

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

${trainingPackMarkdown(agent.id)}
`).join("\n")}
`;
}

function buildOperatingContracts({ root, workspaceRoot }) {
  const agents = readJson(path.join(root, "packages/agents/registry/agents.json"));
  const markdown = contractMarkdown(agents);
  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    agentCount: agents.length,
    markdown
  };
}

module.exports = { buildOperatingContracts, contractMarkdown, schemaFor };
