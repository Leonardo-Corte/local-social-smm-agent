#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const requiredDocs = [
  "docs/operations/failure-modes.md",
  "docs/operations/clean-install.md",
  "docs/operations/privacy-security-review.md",
  "docs/operations/workspace-examples.md",
  "docs/model-routing/local-model-setup.md",
  "docs/benchmarks/consensus-benchmark.md",
  "docs/benchmarks/system-benchmark.md"
];

for (const relativePath of requiredDocs) {
  const filePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(filePath), `missing operations doc: ${relativePath}`);
  const text = fs.readFileSync(filePath, "utf8");
  assert.ok(text.length > 200, `operations doc too small: ${relativePath}`);
}

const privacy = fs.readFileSync(path.join(root, "docs/operations/privacy-security-review.md"), "utf8");
assert.match(privacy, /Human Approval Gate/i);
assert.match(privacy, /Automatic publishing without preview is out of scope/i);

console.log("operations docs ok");
