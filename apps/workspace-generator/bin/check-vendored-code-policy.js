#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const decisionPath = path.join(root, "docs/research/repo-integration-decisions.json");
const blockedDirs = ["vendor", "vendors", "third_party", "external", "cloned-repos", "repos"];

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function walk(dirPath, depth = 0) {
  if (!fs.existsSync(dirPath) || depth > 4) {
    return [];
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const filePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", ".omx"].includes(entry.name)) {
        return [];
      }
      return [filePath, ...walk(filePath, depth + 1)];
    }
    return [];
  });
}

function hasNonSystemFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return false;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }
    const filePath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      return true;
    }
    if (entry.isDirectory() && hasNonSystemFiles(filePath)) {
      return true;
    }
  }
  return false;
}

function main() {
  const decisions = readJson(decisionPath, []);
  const vendorAllowed = new Set(
    decisions
      .filter((decision) => decision.classification === "vendor-allowed")
      .map((decision) => decision.repo.toLowerCase())
  );
  const dirs = walk(root);
  const violations = dirs.filter((dirPath) => {
    const relative = path.relative(root, dirPath);
    const parts = relative.split(path.sep);
    if (!parts.some((part) => blockedDirs.includes(part))) {
      return false;
    }
    if (!hasNonSystemFiles(dirPath)) {
      return false;
    }
    const lowered = relative.toLowerCase();
    return ![...vendorAllowed].some((repo) => lowered.includes(repo.split("/").pop()));
  });

  if (violations.length > 0) {
    console.error("Unapproved external/vendor directories found:");
    for (const violation of violations.slice(0, 30)) {
      console.error(`- ${path.relative(root, violation)}`);
    }
    console.error("Add a vendor-allowed decision before vendoring external code.");
    process.exit(1);
  }

  console.log("OK no unapproved vendored external code directories");
}

main();
