#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const referencesRoot = path.join(root, "reference/inspiration-only");

function exists(filePath) {
  return fs.existsSync(filePath);
}

function firstExisting(dir, names) {
  return names.find((name) => exists(path.join(dir, name))) || null;
}

function safeRead(filePath, maxChars = 1200) {
  if (!exists(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8").slice(0, maxChars);
}

function listTopLevel(dir) {
  if (!exists(dir)) {
    return [];
  }
  return fs.readdirSync(dir)
    .filter((name) => name !== ".git")
    .slice(0, 40);
}

function auditRepo(name) {
  const dir = path.join(referencesRoot, name);
  const targetedApiFile = path.join(root, "docs/research/targeted-reference-api", `${name}-contents.json`);
  const licenseFile = firstExisting(dir, ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING"]);
  const readmeFile = firstExisting(dir, ["README.md", "README.rst", "readme.md"]);
  const packageFile = firstExisting(dir, ["package.json", "pyproject.toml", "requirements.txt", "setup.py"]);
  const licenseText = licenseFile ? safeRead(path.join(dir, licenseFile), 500) : "";
  return {
    name,
    path: path.relative(root, dir),
    exists: exists(dir),
    licenseFile,
    readmeFile,
    packageFile,
    topLevel: listTopLevel(dir),
    retrievalMode: exists(path.join(dir, ".git")) ? "git-clone" : exists(targetedApiFile) ? "targeted-api-reference" : "local-files",
    licenseHint: licenseText.includes("MIT License")
      ? "MIT"
      : licenseText.includes("Apache License")
        ? "Apache"
        : licenseText.includes("GNU")
          ? "GPL-family"
          : "unknown",
    recommendedUse: "reference until manual code audit is complete"
  };
}

function main() {
  const names = exists(referencesRoot)
    ? fs.readdirSync(referencesRoot).filter((name) => fs.statSync(path.join(referencesRoot, name)).isDirectory())
    : [];
  const audits = names.map(auditRepo);
const markdown = `# Local Reference Repo Audit

Generated at: ${new Date().toISOString()}

| Repo dir | Retrieval | License hint | Package file | README | Recommended use |
| --- | --- | --- | --- | --- | --- |
${audits.map((audit) => `| \`${audit.name}\` | ${audit.retrievalMode} | ${audit.licenseHint} | ${audit.packageFile || "n/a"} | ${audit.readmeFile || "n/a"} | ${audit.recommendedUse} |`).join("\n")}

## Top-Level File Maps
${audits.map((audit) => `### ${audit.name}
${audit.topLevel.map((item) => `- ${item}`).join("\n") || "- Not available"}
`).join("\n")}
`;

  fs.mkdirSync(path.join(root, "docs/research"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/research/local-reference-audit.json"), `${JSON.stringify(audits, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "docs/research/local-reference-audit.md"), markdown);
  console.log(`Audited ${audits.length} local reference repo(s)`);
}

main();
