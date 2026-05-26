#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");

const blockedPaths = [
  "apps/dashboard",
  "apps/dashboard/server.js"
];

const blockedPackageScripts = ["dashboard"];

const activeGuidanceRoots = [
  "README.md",
  "docs/USER_QUICKSTART.md",
  "workspaces/client-workspaces"
];

const blockedPatterns = [
  /npm run dashboard/,
  /127\.0\.0\.1:8787/,
  /open-dashboard\.sh/,
  /dashboardUrl/,
  /apps\/dashboard/
];

function walkFiles(targetPath, files = []) {
  if (!fs.existsSync(targetPath)) {
    return files;
  }
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    files.push(targetPath);
    return files;
  }
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.name === "versions" || entry.name === "workflow-runs" || entry.name === "runs") {
      continue;
    }
    walkFiles(path.join(targetPath, entry.name), files);
  }
  return files;
}

function main() {
  const failures = [];

  for (const relativePath of blockedPaths) {
    if (fs.existsSync(path.join(root, relativePath))) {
      failures.push(`Blocked dashboard path still exists: ${relativePath}`);
    }
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  for (const scriptName of blockedPackageScripts) {
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      failures.push(`Blocked package script still exists: ${scriptName}`);
    }
  }

  const files = activeGuidanceRoots.flatMap((relativePath) => walkFiles(path.join(root, relativePath)));
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const pattern of blockedPatterns) {
      if (pattern.test(content)) {
        failures.push(`${path.relative(root, filePath)} matches ${pattern}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("Dashboard removal check failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("OK dashboard surface removed from active product guidance");
}

main();
