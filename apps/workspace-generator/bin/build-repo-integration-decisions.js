#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function decisionFor(candidate, metadata) {
  const license = metadata?.license || metadata?.detectedLicense || candidate.expectedLicense || "unknown";
  const risk = candidate.risk || "unknown";
  if (candidate.initialDecision === "vendor-allowed") {
    return {
      classification: "vendor-allowed",
      boundary: "Vendored code is allowed only for the named repo path and must retain its license, attribution, and isolated adapter boundary.",
      reason: "A written vendor decision exists for this specific dependency."
    };
  }
  if (/GramAddict/i.test(candidate.repo) || risk.includes("account-tos")) {
    return {
      classification: "do-not-use",
      boundary: "Reference only for risk awareness. Do not integrate account automation.",
      reason: "Account-facing bot behavior conflicts with project guardrails."
    };
  }
  if (/AGPL/i.test(license)) {
    return {
      classification: "reference-only",
      boundary: "Study architecture and product patterns only. Do not copy/vend code into this repo.",
      reason: "AGPL boundary requires careful separation."
    };
  }
  if (/GPL/i.test(license)) {
    return {
      classification: "adapter",
      boundary: "Use as an optional separate local service/process with license notes; do not embed copied code.",
      reason: "GPL dependency can be useful, but direct vendoring would constrain the main project."
    };
  }
  if (/MIT|Apache|BSD/i.test(license)) {
    return {
      classification: "adapter",
      boundary: "Eligible for adapter or clean-room pattern reuse after file-level code audit.",
      reason: "Permissive license, still requires dependency/security review."
    };
  }
  return {
    classification: "reference-only",
    boundary: "No code use until license and dependency audit is complete.",
    reason: "License or maintenance status is not clear enough."
  };
}

function markdown(rows) {
  return `# Repo Integration Decisions

Generated at: ${new Date().toISOString()}

## Rules
- Do not copy or vendor external code without a written license decision.
- AGPL/GPL repos can inform architecture or run as separate optional services only after review.
- Account automation bots are blocked by product guardrails.
- Every integration must preserve no-cost/local-first operation and human approval.

## Decision Matrix
| Repo | License | Category | Classification | Boundary |
| --- | --- | --- | --- | --- |
${rows.map((row) => `| [${row.repo}](https://github.com/${row.repo}) | ${row.license} | ${row.category} | ${row.classification} | ${row.boundary} |`).join("\n")}

## Details
${rows.map((row) => `### ${row.repo}
- Candidate ID: ${row.id}
- Category: ${row.category}
- License: ${row.license}
- Risk: ${row.risk}
- Stars: ${row.stars || "-"}
- Last push: ${row.lastPush || "-"}
- Classification: ${row.classification}
- Boundary: ${row.boundary}
- Reason: ${row.reason}
- Integration next step: ${row.nextStep}
`).join("\n")}
`;
}

function main() {
  const candidates = readJson(path.join(root, "packages/repo-auditor/candidates.json"), []);
  const metadata = readJson(path.join(root, "docs/research/github-metadata-audit.json"), []);
  const metadataByRepo = new Map(metadata.map((item) => [String(item.repo || item.full_name || "").toLowerCase(), item]));
  const rows = candidates.map((candidate) => {
    const meta = metadataByRepo.get(candidate.repo.toLowerCase()) || {};
    const resolvedLicense = meta.detectedLicense && meta.detectedLicense !== "NOASSERTION"
      ? meta.detectedLicense
      : candidate.expectedLicense || meta.license || "unknown";
    const decision = decisionFor(candidate, { ...meta, detectedLicense: resolvedLicense });
    return {
      id: candidate.id,
      repo: candidate.repo,
      category: candidate.category,
      license: resolvedLicense,
      risk: candidate.risk,
      stars: meta.stars,
      lastPush: meta.pushed_at || meta.pushedAt || meta.lastPush,
      ...decision,
      nextStep: decision.classification === "do-not-use"
        ? "Keep blocked and document risk."
        : decision.classification === "adapter"
          ? "Inspect dependency files and design a small adapter boundary."
          : "Extract product/architecture lessons without code reuse."
    };
  });
  const outPath = path.join(root, "docs/research/repo-integration-decisions.md");
  fs.writeFileSync(outPath, markdown(rows));
  fs.writeFileSync(path.join(root, "docs/research/repo-integration-decisions.json"), `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`Repo integration decisions ready: ${path.relative(root, outPath)}`);
}

main();
