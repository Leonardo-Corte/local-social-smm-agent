#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const candidates = JSON.parse(fs.readFileSync(path.join(root, "packages/repo-auditor/candidates.json"), "utf8"));
const apiDir = path.join(root, "docs/research/github-api");

function fileFor(candidate) {
  return path.join(apiDir, `${candidate.id}.json`);
}

function readMetadata(candidate) {
  const filePath = fileFor(candidate);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (value.message && value.message.includes("Not Found")) {
    return { notFound: true };
  }
  return value;
}

function chooseDecision(candidate, metadata) {
  if (candidate.risk.includes("high")) {
    return "experimental/reference only";
  }
  if (candidate.risk.includes("license-boundary")) {
    return "separate module or reference";
  }
  const license = metadata && metadata.license && metadata.license.spdx_id;
  if (license === "MIT" || license === "Apache-2.0" || license === "BSD-2-Clause" || license === "BSD-3-Clause") {
    return "eligible after code audit";
  }
  if (!license || license === "NOASSERTION") {
    return "inspiration until license is clear";
  }
  return candidate.initialDecision;
}

const rows = candidates.map((candidate) => {
  const metadata = readMetadata(candidate);
  const license = metadata && metadata.license ? metadata.license.spdx_id : candidate.expectedLicense;
  return {
    id: candidate.id,
    repo: candidate.repo,
    category: candidate.category,
    expectedLicense: candidate.expectedLicense,
    detectedLicense: license || "unknown",
    stars: metadata && typeof metadata.stargazers_count === "number" ? metadata.stargazers_count : null,
    forks: metadata && typeof metadata.forks_count === "number" ? metadata.forks_count : null,
    openIssues: metadata && typeof metadata.open_issues_count === "number" ? metadata.open_issues_count : null,
    pushedAt: metadata && metadata.pushed_at ? metadata.pushed_at : null,
    archived: metadata && typeof metadata.archived === "boolean" ? metadata.archived : null,
    risk: candidate.risk,
    recommendedDecision: chooseDecision(candidate, metadata),
    auditStatus: metadata ? "metadata-downloaded" : "metadata-missing",
    htmlUrl: metadata && metadata.html_url ? metadata.html_url : `https://github.com/${candidate.repo}`,
    why: candidate.why
  };
});

const markdown = `# GitHub Metadata Repo Audit

Generated at: ${new Date().toISOString()}

| Repo | License | Stars | Last push | Risk | Decision | Status |
| --- | --- | ---: | --- | --- | --- | --- |
${rows.map((row) => `| [${row.repo}](${row.htmlUrl}) | ${row.detectedLicense} | ${row.stars ?? "n/a"} | ${row.pushedAt || "n/a"} | ${row.risk} | ${row.recommendedDecision} | ${row.auditStatus} |`).join("\n")}

## Notes
- Metadata only is not enough to vendor code.
- Next audit step must inspect dependency files, license files, install path, and code boundaries.
- High-risk account automation remains disabled by default.
`;

fs.writeFileSync(path.join(root, "docs/research/github-metadata-audit.json"), `${JSON.stringify(rows, null, 2)}\n`);
fs.writeFileSync(path.join(root, "docs/research/github-metadata-audit.md"), markdown);
console.log(`Updated GitHub metadata audit for ${rows.length} candidates`);
