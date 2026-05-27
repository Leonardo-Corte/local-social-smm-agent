#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildOperatingContracts } = require("../../../packages/agents/operating-contracts");
const { trainingPackMarkdown } = require("../../../packages/agents/training-packs");

const root = path.resolve(__dirname, "../../..");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function agentMarkdown(agent, brief) {
  return `# ${agent.name}

## Mission
${agent.mission}

## Project Context
- Project: ${brief.projectName || "Untitled Project"}
- Niche: ${brief.niche || "-"}
- Target: ${brief.targetAudience || "-"}
- 30-day goal: ${brief.primaryGoal30Days || "-"}
- Tone: ${brief.tone || "-"}

## Inputs
${agent.inputs.map((item) => `- ${item}`).join("\n")}

## Outputs
${agent.outputs.map((item) => `- ${item}`).join("\n")}

## Allowed Tools
${agent.tools.map((item) => `- ${item}`).join("\n")}

## Quality Checks
${agent.qualityChecks.map((item) => `- ${item}`).join("\n")}

## Escalation Rules
${agent.escalationRules.map((item) => `- ${item}`).join("\n")}
${agent.customSection ? `\n${agent.customSection}` : ""}
${trainingPackMarkdown(agent.id) ? `\n${trainingPackMarkdown(agent.id)}` : ""}`;
}

function syncAgentFiles(workspaceRoot) {
  const agents = readJson(path.join(root, "packages/agents/registry/agents.json"));
  const brief = readJson(path.join(workspaceRoot, "project-brief.json"));
  const agentsDir = path.join(workspaceRoot, "agents");
  fs.mkdirSync(agentsDir, { recursive: true });
  for (const agent of agents) {
    fs.writeFileSync(path.join(agentsDir, `${agent.id}.md`), agentMarkdown(agent, brief));
  }
  return agents.length;
}

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/build-agent-contracts.js <workspace>");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  syncAgentFiles(workspaceRoot);
  const contracts = buildOperatingContracts({ root, workspaceRoot });
  const operationsDir = path.join(workspaceRoot, "operations");
  fs.mkdirSync(operationsDir, { recursive: true });
  fs.writeFileSync(path.join(operationsDir, "agent-operating-contracts.md"), contracts.markdown);
  fs.writeFileSync(path.join(operationsDir, "agent-operating-contracts.json"), `${JSON.stringify({
    generatedAt: contracts.generatedAt,
    agentCount: contracts.agentCount,
    source: "packages/agents/registry/agents.json"
  }, null, 2)}\n`);
  console.log(`Agent operating contracts ready for ${workspace}: ${contracts.agentCount} agents`);
}

main();
