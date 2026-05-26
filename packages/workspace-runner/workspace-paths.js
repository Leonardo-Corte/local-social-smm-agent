const path = require("path");

const SAFE_WORKSPACE_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

function assertSafeWorkspaceSlug(slug) {
  if (typeof slug !== "string") {
    throw new Error("Workspace slug must be a string.");
  }
  if (!slug.trim()) {
    throw new Error("Workspace slug is required.");
  }
  if (slug !== slug.trim()) {
    throw new Error(`Unsafe workspace slug: ${slug}`);
  }
  if (path.isAbsolute(slug) || slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    throw new Error(`Unsafe workspace slug: ${slug}`);
  }
  if (/[\u0000-\u001f\u007f]/.test(slug)) {
    throw new Error("Workspace slug contains control characters.");
  }
  if (!SAFE_WORKSPACE_SLUG.test(slug)) {
    throw new Error(`Unsafe workspace slug: ${slug}`);
  }
  return slug;
}

function resolveInside(baseDir, ...segments) {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(base, ...segments);
  if (resolved !== base && !resolved.startsWith(`${base}${path.sep}`)) {
    throw new Error(`Resolved path escapes allowed directory: ${resolved}`);
  }
  return resolved;
}

function workspacePaths(root, slug) {
  const workspace = assertSafeWorkspaceSlug(slug);
  const workspacesRoot = resolveInside(root, "workspaces");
  const generatedRoot = resolveInside(workspacesRoot, "generated-projects");
  const clientRoot = resolveInside(workspacesRoot, "client-workspaces");
  const briefsRoot = resolveInside(workspacesRoot, "briefs");
  const interviewsRoot = resolveInside(workspacesRoot, "interviews");
  const generated = resolveInside(generatedRoot, workspace);
  const client = resolveInside(clientRoot, workspace);
  const brief = resolveInside(briefsRoot, `${workspace}.json`);
  const interview = resolveInside(interviewsRoot, workspace);
  const clientReport = resolveInside(generated, "client-report");

  return {
    workspace,
    workspacesRoot,
    generatedRoot,
    clientRoot,
    briefsRoot,
    interviewsRoot,
    generated,
    client,
    brief,
    interview,
    clientReport,
    generatedFile: (...segments) => resolveInside(generated, ...segments),
    clientFile: (...segments) => resolveInside(client, ...segments),
    interviewFile: (...segments) => resolveInside(interview, ...segments),
    reportFile: (...segments) => resolveInside(clientReport, ...segments)
  };
}

module.exports = {
  SAFE_WORKSPACE_SLUG,
  assertSafeWorkspaceSlug,
  resolveInside,
  workspacePaths
};
