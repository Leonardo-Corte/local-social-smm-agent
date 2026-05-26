const fs = require("fs");
const path = require("path");

function parseFrontmatter(content) {
  if (!content.startsWith("---")) {
    return {};
  }
  const end = content.indexOf("\n---", 3);
  if (end === -1) {
    return {};
  }
  const block = content.slice(3, end).trim();
  const result = {};
  let currentKey = null;
  for (const line of block.split("\n")) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      result[currentKey] = match[2].replace(/^"|"$/g, "");
      continue;
    }
    const nested = line.match(/^\s+([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nested && currentKey === "metadata") {
      result[`metadata.${nested[1]}`] = nested[2].replace(/^"|"$/g, "");
    }
  }
  return result;
}

function categoryForSkill(id) {
  if (id.includes("context")) return "foundation";
  if (id.includes("strategy") || id.includes("calendar")) return "strategy";
  if (id.includes("writer") || id.includes("repurposer")) return "creation";
  if (id.includes("analyzer") || id.includes("tracker") || id.includes("advisor")) return "analysis";
  return "utility";
}

function agentTargetsForSkill(id) {
  const targets = [];
  if (id.includes("context")) targets.push("intake-strategist", "memory-curator");
  if (id.includes("strategy")) targets.push("brand-strategist", "market-researcher");
  if (id.includes("calendar")) targets.push("content-planner");
  if (id.includes("post") || id.includes("caption") || id.includes("hook")) targets.push("copywriter");
  if (id.includes("carousel")) targets.push("copywriter", "visual-director");
  if (id.includes("thread")) targets.push("copywriter", "reel-shorts-producer");
  if (id.includes("repurposer")) targets.push("content-planner", "copywriter");
  if (id.includes("performance") || id.includes("growth") || id.includes("pattern") || id.includes("optimization")) {
    targets.push("analyst", "critic-qa");
  }
  if (targets.length === 0) targets.push("critic-qa");
  return [...new Set(targets)];
}

function defaultOutputsForSkill(id) {
  if (id.includes("context")) return ["social-context.md", "voice-guide.md"];
  if (id.includes("calendar")) return ["30-day-calendar.md", "batching-plan.md"];
  if (id.includes("strategy")) return ["content-strategy.md", "platform-strategy.md"];
  if (id.includes("post")) return ["posts.md"];
  if (id.includes("caption")) return ["captions.md"];
  if (id.includes("carousel")) return ["carousels.md"];
  if (id.includes("hook")) return ["hook-bank.md"];
  if (id.includes("repurposer")) return ["repurposing-plan.md"];
  if (id.includes("performance")) return ["performance-report.md"];
  if (id.includes("growth")) return ["growth-report.md"];
  if (id.includes("pattern")) return ["content-pattern-report.md"];
  if (id.includes("optimization")) return ["optimization-tasks.md"];
  return ["skill-output.md"];
}

function adaptSkillFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const frontmatter = parseFrontmatter(content);
  const id = frontmatter.name || path.basename(path.dirname(filePath));
  return {
    id,
    source: "blacktwist/social-media-skills",
    sourcePath: filePath,
    license: "MIT",
    version: frontmatter["metadata.version"] || "unknown",
    category: categoryForSkill(id),
    description: frontmatter.description || "",
    targetAgents: agentTargetsForSkill(id),
    expectedOutputs: defaultOutputsForSkill(id),
    integrationStatus: "adapted-taxonomy",
    usePolicy: "Use taxonomy and behavior patterns; do not require BlackTwist or any paid SaaS."
  };
}

function adaptSkills(referenceRoot) {
  const skillsDir = path.join(referenceRoot, "skills");
  if (!fs.existsSync(skillsDir)) {
    return [];
  }
  return fs.readdirSync(skillsDir)
    .map((dir) => path.join(skillsDir, dir, "SKILL.md"))
    .filter((filePath) => fs.existsSync(filePath))
    .map(adaptSkillFile)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function skillCardMarkdown(skill) {
  return `# ${skill.id}

Source: ${skill.source}
License: ${skill.license}
Version: ${skill.version}
Category: ${skill.category}
Integration status: ${skill.integrationStatus}

## Description
${skill.description}

## Assigned Agents
${skill.targetAgents.map((agent) => `- ${agent}`).join("\n")}

## Expected Outputs
${skill.expectedOutputs.map((output) => `- ${output}`).join("\n")}

## Use Policy
${skill.usePolicy}

## Workspace Adaptation Notes
- Use the generated project brief and workspace memory as the source of truth.
- Keep outputs local-first and human-approved.
- Do not assume BlackTwist, SaaS scheduling, or external publishing APIs are available.
`;
}

module.exports = {
  adaptSkills,
  skillCardMarkdown
};
