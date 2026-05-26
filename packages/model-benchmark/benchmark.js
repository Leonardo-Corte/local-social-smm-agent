const fs = require("fs");
const path = require("path");
const { listOllamaModels, runOllamaGenerate } = require("../local-runtime/model-client");

const benchmarkTasks = [
  {
    id: "messy-italian-cleanup",
    role: "business-profile",
    prompt: "Ripulisci questo input senza chiedere all'utente di correggere errori: 'eventi netwoking nyc corporate gente che vuole connessioni, ticket con drink e food forse'. Restituisci: positioning, target, offer, missing questions.",
    requiredTerms: ["positioning", "target", "offer", "missing"]
  },
  {
    id: "reel-caption",
    role: "copywriter",
    prompt: "Create 3 Instagram Reel hooks and 1 caption for a premium NYC networking event. Do not invent attendance numbers, VIP guests, or ticket inclusions.",
    requiredTerms: ["hook", "caption", "NYC"]
  },
  {
    id: "safety-critique",
    role: "critic-qa",
    prompt: "Review this claim for publishing risk: 'The best networking event in New York with 200 elite guests guaranteed.' Return blockers, safer rewrite, and questions.",
    requiredTerms: ["block", "rewrite", "questions"]
  },
  {
    id: "persona-simulation",
    role: "persona-simulator",
    prompt: "Simulate reactions from a corporate professional, a founder, and a venue manager to an NYC networking event reel. Return objections and conversion triggers.",
    requiredTerms: ["objection", "trigger", "venue"]
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function scoreOutput(output, task, elapsedMs) {
  const text = String(output || "");
  const lower = text.toLowerCase();
  const requiredHits = task.requiredTerms.filter((term) => lower.includes(term.toLowerCase())).length;
  const hasNoInventWarning = /do not invent|non invent|verify|confirm|approval|human/i.test(text);
  const structured = /(^|\n)(#|[-*]|\d+\.)/.test(text);
  const lengthScore = text.length >= 500 ? 2 : text.length >= 250 ? 1 : 0;
  const speedScore = elapsedMs < 30000 ? 2 : elapsedMs < 90000 ? 1 : 0;
  return {
    requiredHits,
    requiredTotal: task.requiredTerms.length,
    hasNoInventWarning,
    structured,
    lengthScore,
    speedScore,
    total: requiredHits + (hasNoInventWarning ? 2 : 0) + (structured ? 1 : 0) + lengthScore + speedScore
  };
}

async function benchmarkModel({ model, timeoutMs }) {
  const results = [];
  for (const task of benchmarkTasks) {
    const started = Date.now();
    let output = "";
    let error = null;
    try {
      output = await runOllamaGenerate({
        model,
        timeoutMs,
        prompt: `You are benchmarking local model capability for a social content agent system.\n\nTask role: ${task.role}\n\n${task.prompt}`
      });
    } catch (caught) {
      error = caught.message;
    }
    const elapsedMs = Date.now() - started;
    const score = error ? { total: 0, error } : scoreOutput(output, task, elapsedMs);
    results.push({
      taskId: task.id,
      role: task.role,
      elapsedMs,
      score,
      error,
      outputPreview: output.slice(0, 1400)
    });
  }
  return {
    model,
    totalScore: results.reduce((sum, result) => sum + (result.score.total || 0), 0),
    totalElapsedMs: results.reduce((sum, result) => sum + result.elapsedMs, 0),
    results
  };
}

function markdown(report) {
  return `# Local Model Benchmark

Generated at: ${report.generatedAt}

Workspace: ${report.workspace}

Timeout per task: ${report.timeoutMs} ms

## Ranked Models
| Rank | Model | Score | Total time |
| --- | --- | ---: | ---: |
${report.models.map((model, index) => `| ${index + 1} | ${model.model} | ${model.totalScore} | ${(model.totalElapsedMs / 1000).toFixed(1)}s |`).join("\n") || "| - | No models tested | 0 | - |"}

## Agent Routing Recommendation
${Object.entries(report.recommendations).map(([role, model]) => `- ${role}: ${model || "no local model available"}`).join("\n")}

## Details
${report.models.map((model) => `### ${model.model}
${model.results.map((result) => `#### ${result.taskId}
- Role: ${result.role}
- Time: ${(result.elapsedMs / 1000).toFixed(1)}s
- Score: ${result.score.total || 0}
- Error: ${result.error || "none"}

\`\`\`text
${result.outputPreview || "No output."}
\`\`\`
`).join("\n")}`).join("\n")}
`;
}

function agentRoutingMarkdown(report) {
  const rows = Object.entries(report.recommendations).map(([agent, model]) => {
    const status = model ? "recommended" : "fallback-required";
    return `| ${agent} | ${model || "none"} | ${status} |`;
  });
  return `# Agent Model Routing From Benchmark

Generated at: ${report.generatedAt}

Workspace: ${report.workspace}

Timeout per task: ${report.timeoutMs} ms

## Routing
| Agent | Recommended local model | Status |
| --- | --- | --- |
${rows.join("\n")}

## Policy
- Use benchmark routing for agent roles only after at least one successful task score.
- If a role has no recommendation, use the default local route with shorter prompts and more human review.
- Slow/timeout roles should run compact prompts first, then escalate only when needed.
- No paid API fallback is enabled by this file.
`;
}

function routeRecommendations(modelReports) {
  const bestByRole = {};
  for (const task of benchmarkTasks) {
    const ranked = modelReports
      .map((modelReport) => {
        const taskResult = modelReport.results.find((result) => result.taskId === task.id);
        return {
          model: modelReport.model,
          score: taskResult?.score?.total || 0,
          elapsedMs: taskResult?.elapsedMs || Number.MAX_SAFE_INTEGER
        };
      })
      .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs);
    bestByRole[task.role] = ranked[0]?.score > 0 ? ranked[0].model : null;
  }
  return {
    "brand-strategist": bestByRole["business-profile"],
    copywriter: bestByRole.copywriter,
    "critic-qa": bestByRole["critic-qa"],
    "persona-simulator": bestByRole["persona-simulator"]
  };
}

async function runBenchmark({ workspaceRoot, workspace, selectedModels = [], timeoutMs = 120000 }) {
  const availableModels = listOllamaModels();
  const modelsToTest = (selectedModels.length > 0 ? selectedModels : availableModels).filter(Boolean);
  const modelReports = [];
  for (const model of modelsToTest) {
    modelReports.push(await benchmarkModel({ model, timeoutMs }));
  }
  modelReports.sort((a, b) => b.totalScore - a.totalScore || a.totalElapsedMs - b.totalElapsedMs);
  const report = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    workspace,
    timeoutMs,
    availableModels,
    models: modelReports,
    recommendations: routeRecommendations(modelReports)
  };
  const outDir = path.join(workspaceRoot, "model-benchmarks");
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "latest.md"), markdown(report));
  fs.writeFileSync(path.join(workspaceRoot, "model-routing-benchmark.json"), `${JSON.stringify({
    generatedAt: report.generatedAt,
    timeoutMs: report.timeoutMs,
    recommendations: report.recommendations,
    source: "model-benchmarks/latest.json"
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "model-routing-benchmark.md"), agentRoutingMarkdown(report));
  return report;
}

module.exports = { benchmarkTasks, markdown, runBenchmark };
