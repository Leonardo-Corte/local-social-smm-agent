#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const candidates = JSON.parse(fs.readFileSync(path.join(root, "packages/repo-auditor/candidates.json"), "utf8"));

function riskDecision(candidate) {
  if (candidate.risk.includes("high")) {
    return "experimental/reference only";
  }
  if (candidate.risk.includes("license-boundary")) {
    return "separate module or reference";
  }
  if (candidate.expectedLicense === "MIT") {
    return "eligible after audit";
  }
  return candidate.initialDecision;
}

const audited = candidates.map((candidate) => ({
  ...candidate,
  recommendedDecision: riskDecision(candidate),
  auditStatus: "pending"
}));

const markdownRows = audited.map((candidate) => {
  return `| \`${candidate.repo}\` | ${candidate.category} | ${candidate.expectedLicense} | ${candidate.risk} | ${candidate.recommendedDecision} | ${candidate.auditStatus} |`;
});

const markdown = `# Generated Repo Audit Matrix

Generated at: ${new Date().toISOString()}

| Repo | Category | License posture | Risk | Recommended decision | Audit |
| --- | --- | --- | --- | --- | --- |
${markdownRows.join("\n")}
`;

fs.mkdirSync(path.join(root, "docs/research"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/research/generated-repo-audit.md"), markdown);
fs.writeFileSync(path.join(root, "docs/research/generated-repo-audit.json"), `${JSON.stringify(audited, null, 2)}\n`);

console.log(`Rendered ${audited.length} repo audit candidates`);
