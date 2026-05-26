#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { adaptSkills } = require("../../../packages/agents/skill-adapter");

const root = path.resolve(__dirname, "../../..");
const referenceRoot = path.join(root, "reference/inspiration-only/social-media-skills");
const outputPath = path.join(root, "packages/agents/registry/social-skills.json");
const docsPath = path.join(root, "docs/research/social-skills-adaptation.md");

function main() {
  const skills = adaptSkills(referenceRoot);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify({ version: "0.1.0", skills }, null, 2)}\n`);

  const markdown = `# Social Skills Adaptation

Generated at: ${new Date().toISOString()}

Source: \`blacktwist/social-media-skills\`
License posture: MIT, still manual-audit before vendoring full files.

| Skill | Category | Target agents | Outputs |
| --- | --- | --- | --- |
${skills.map((skill) => `| \`${skill.id}\` | ${skill.category} | ${skill.targetAgents.join(", ")} | ${skill.expectedOutputs.join(", ")} |`).join("\n")}

## Policy
- This adaptation uses taxonomy and metadata, not a full core import.
- Generated workspaces receive local skill cards under \`skills/\`.
- No BlackTwist/SaaS dependency is required by the core.
`;
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });
  fs.writeFileSync(docsPath, markdown);
  console.log(`Adapted ${skills.length} social media skills`);
}

main();
