#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { applyQueuedOutputs, validateProposedArtifact } = require("../../../packages/review-loop/output-applicator");

const root = path.resolve(__dirname, "../../..");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const workspace = "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  const target = "review/applicator-smoke-target.md";
  const artifact = "workflow-runs/applicator-smoke/steps/copy/output.md";
  const queuePath = path.join(workspaceRoot, "memory/regeneration-queue.json");
  const originalQueue = fs.existsSync(queuePath) ? fs.readFileSync(queuePath, "utf8") : null;

  write(path.join(workspaceRoot, target), "# Old\n");
  write(path.join(workspaceRoot, artifact), `# Output

## Recommended Fixes
- Replace the scratch target.

## Proposed Artifact
\`\`\`markdown
# New

Human review still required.
\`\`\`
`);

  write(queuePath, `${JSON.stringify({
    tasks: [{
      id: "applicator-smoke",
      createdAt: new Date().toISOString(),
      source: "smoke",
      workflowRun: "workflow-runs/applicator-smoke",
      stepId: "copy",
      agentId: "copywriter",
      artifact,
      feedback: "Replace scratch file.",
      target,
      status: "pending",
      priority: 1,
      action: "regenerate_artifact"
    }]
  }, null, 2)}\n`);

  applyQueuedOutputs({ workspaceRoot, dryRun: false });
  const result = fs.readFileSync(path.join(workspaceRoot, target), "utf8");
  if (!result.includes("Human review still required.")) {
    throw new Error("Applicator did not write proposed artifact.");
  }

  const blocked = validateProposedArtifact("CTA: Try our free trial and sign up now.");
  if (blocked.valid) {
    throw new Error("Applicator policy did not block unapproved CTA language.");
  }

  if (originalQueue !== null) {
    write(queuePath, originalQueue);
  }

  console.log("output applicator ok");
}

main();
