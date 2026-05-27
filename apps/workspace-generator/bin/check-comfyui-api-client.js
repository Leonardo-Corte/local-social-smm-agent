#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const {
  applyWorkflowOverrides,
  runComfyUiWorkflow,
  writeComfyUiRunReport
} = require("../../../packages/image-workflow/comfyui-api-client");
const { readArtifactRegistry } = require("../../../packages/publishing/artifact-registry");

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64"
);

function makeWorkflow() {
  return {
    "3": {
      class_type: "KSampler",
      inputs: { seed: 1, steps: 4, cfg: 7, sampler_name: "euler", scheduler: "normal" }
    },
    "5": {
      class_type: "EmptyLatentImage",
      inputs: { width: 512, height: 512, batch_size: 1 }
    },
    "6": {
      class_type: "CLIPTextEncode",
      inputs: { text: "old prompt" }
    },
    "7": {
      class_type: "CLIPTextEncode",
      inputs: { text: "old negative" }
    },
    "9": {
      class_type: "SaveImage",
      inputs: { filename_prefix: "ComfyUI" }
    }
  };
}

function startFakeComfyServer() {
  let queuedBody = null;
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/system_stats") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ system: { os: "test" }, devices: [] }));
      return;
    }
    if (req.method === "POST" && req.url === "/prompt") {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => {
        queuedBody = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ prompt_id: "test-prompt-id", number: 1 }));
      });
      return;
    }
    if (req.method === "GET" && req.url === "/history/test-prompt-id") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({
        "test-prompt-id": {
          status: { completed: true },
          outputs: {
            "9": {
              images: [{ filename: "fake-output.png", subfolder: "", type: "output" }]
            }
          }
        }
      }));
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/view?")) {
      res.setHeader("content-type", "image/png");
      res.end(PNG_1X1);
      return;
    }
    res.statusCode = 404;
    res.end("not found");
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        endpoint: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(done)),
        queuedBody: () => queuedBody
      });
    });
  });
}

async function main() {
  const fake = await startFakeComfyServer();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "comfyui-client-check-"));
  try {
    const workspaceRoot = path.join(tempRoot, "workspace");
    fs.mkdirSync(path.join(workspaceRoot, "creative"), { recursive: true });
    fs.mkdirSync(path.join(workspaceRoot, "business"), { recursive: true });
    fs.writeFileSync(path.join(workspaceRoot, "workspace-manifest.json"), "{}\n");
    fs.writeFileSync(path.join(workspaceRoot, "business/business.md"), "# Business\nNYC corporate networking events for founders and operators.\n");
    const workflowPath = path.join(tempRoot, "workflow.json");
    fs.writeFileSync(workflowPath, `${JSON.stringify(makeWorkflow(), null, 2)}\n`);

    const { workflow, applied } = applyWorkflowOverrides(makeWorkflow(), {
      prompt: "new prompt",
      negativePrompt: "new negative",
      width: 1080,
      height: 1920,
      seed: 42,
      filenamePrefix: "smm-test"
    });
    assert.strictEqual(workflow["6"].inputs.text, "new prompt");
    assert.strictEqual(workflow["7"].inputs.text, "new negative");
    assert.strictEqual(workflow["5"].inputs.width, 1080);
    assert.strictEqual(workflow["5"].inputs.height, 1920);
    assert.strictEqual(workflow["3"].inputs.seed, 42);
    assert.strictEqual(workflow["9"].inputs.filename_prefix, "smm-test");
    assert.strictEqual(applied.prompt, true);

    const result = await runComfyUiWorkflow({
      workspaceRoot,
      workflowPath,
      endpoint: fake.endpoint,
      prompt: "professional networking event photo",
      negativePrompt: "blurry",
      width: 1080,
      height: 1920,
      seed: 123,
      timeoutMs: 15000
    });
    const report = writeComfyUiRunReport({ workspaceRoot, result });
    assert.strictEqual(result.status, "completed_needs_human_review");
    assert.strictEqual(result.savedOutputs.length, 1);
    assert.ok(fs.existsSync(result.savedOutputs[0].outputPath));
    assert.ok(fs.existsSync(result.savedOutputs[0].qualityPaths.mdPath));
    assert.ok(["passed", "review_with_warnings"].includes(result.savedOutputs[0].quality.status));
    assert.ok(result.savedOutputs[0].quality.brandFit);
    assert.ok(result.savedOutputs[0].quality.ocr);
    assert.ok(fs.existsSync(report.mdPath));
    assert.ok(fake.queuedBody().prompt);

    const registry = readArtifactRegistry(workspaceRoot);
    assert.strictEqual(registry.artifacts.length, 1);
    assert.strictEqual(registry.artifacts[0].status, "needs_human_review");
    assert.strictEqual(registry.artifacts[0].automaticPublishEnabled, false);
    assert.ok(registry.artifacts[0].metadata.qualityReport);
    console.log("comfyui api client ok");
  } finally {
    await fake.close();
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
