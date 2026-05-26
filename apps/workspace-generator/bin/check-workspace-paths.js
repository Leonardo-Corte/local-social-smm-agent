#!/usr/bin/env node

const path = require("path");
const {
  assertSafeWorkspaceSlug,
  resolveInside,
  workspacePaths
} = require("../../../packages/workspace-runner/workspace-paths");

const root = path.resolve(__dirname, "../../..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function mustReject(label, fn) {
  try {
    fn();
  } catch (_error) {
    return;
  }
  throw new Error(`Expected rejection: ${label}`);
}

function main() {
  const valid = ["out-of-office", "sample-local-social-team", "a1", "brand-2026"];
  const invalid = [
    "",
    " ",
    "../escape",
    "escape/child",
    "escape\\child",
    "/tmp/escape",
    "brand..escape",
    ".hidden",
    "UpperCase",
    "name_with_underscore",
    "name space",
    "name.",
    "name-",
    "-name",
    "brand\nname",
    "brand:name"
  ];

  for (const slug of valid) {
    assert(assertSafeWorkspaceSlug(slug) === slug, `Expected safe slug: ${slug}`);
    const paths = workspacePaths(root, slug);
    assert(paths.workspace === slug, `Wrong normalized slug for ${slug}`);
    assert(paths.generated.endsWith(path.join("workspaces", "generated-projects", slug)), `Wrong generated path for ${slug}`);
    assert(paths.client.endsWith(path.join("workspaces", "client-workspaces", slug)), `Wrong client path for ${slug}`);
    assert(paths.brief.endsWith(path.join("workspaces", "briefs", `${slug}.json`)), `Wrong brief path for ${slug}`);
    assert(paths.interview.endsWith(path.join("workspaces", "interviews", slug)), `Wrong interview path for ${slug}`);
    assert(paths.reportFile("report.md").endsWith(path.join(slug, "client-report", "report.md")), `Wrong report path for ${slug}`);
  }

  for (const slug of invalid) {
    mustReject(JSON.stringify(slug), () => assertSafeWorkspaceSlug(slug));
  }

  const safeBase = path.join(root, "workspaces/generated-projects/out-of-office");
  assert(resolveInside(safeBase, "drafts", "posts.md").endsWith(path.join("drafts", "posts.md")), "Expected safe nested path");
  mustReject("path traversal out of workspace", () => resolveInside(safeBase, "..", "..", "package.json"));
  mustReject("absolute path escape", () => resolveInside(safeBase, "/tmp/escape"));

  console.log("OK workspace path guard");
}

main();
