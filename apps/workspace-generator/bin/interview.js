#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const readline = require("readline");
const { spawnSync } = require("child_process");
const { applyTemplate, buildBriefFromAnswers } = require("../../../packages/interview-engine/brief");
const { writeNextCommandFiles } = require("../../../packages/workspace-runner/next-commands");

const root = path.resolve(__dirname, "../../..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ask(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(`${prompt}\n> `, (answer) => resolve(answer.trim()));
  });
}

function argValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function interviewMarkdown({ questionBank, answers, brief, validation }) {
  return `# Deep Interview Transcript

Project: ${brief.projectName || "unknown"}

Generated at: ${new Date().toISOString()}

## Validation
- Valid: ${validation.valid ? "yes" : "no"}
- Missing: ${validation.missing.length > 0 ? validation.missing.join(", ") : "none"}

## Answers
${questionBank.questions.map((question) => `### ${question.prompt}
${answers[question.field] || ""}
`).join("\n")}
`;
}

function personalizationTaskPlan(brief) {
  return `# Personalization Task Plan

Project: ${brief.projectName}

## Workspace Setup
- [ ] Confirm niche: ${brief.niche}
- [ ] Confirm target audience: ${brief.targetAudience}
- [ ] Confirm offer: ${brief.offer}
- [ ] Confirm tone rules: ${brief.tone}
- [ ] Confirm approval owner: ${brief.approvalPolicy}

## Agent Personalization
- [ ] Intake Strategist: convert missing context into follow-up questions.
- [ ] Market Researcher: build sources and competitor watchlist for ${brief.niche}.
- [ ] Brand Strategist: sharpen positioning and proof points.
- [ ] Content Planner: adapt cadence to assets and constraints.
- [ ] Copywriter: produce platform-specific hooks and CTAs.
- [ ] Visual Director: adapt image briefs to available assets and local model route.
- [ ] Compliance Guardian: block unsafe account actions and risky sources.
- [ ] Persona Simulator: build personas from ${brief.targetAudience}.
- [ ] Critic/QA: reject generic outputs before human approval.
- [ ] Memory Curator: store feedback and convert it into regeneration tasks.

## First Workflow
- [ ] Run model routing.
- [ ] Run workflow in dry-run mode.
- [ ] Review regeneration candidates.
- [ ] Run local model execution only after backend/model check.
- [ ] Apply only explicit Proposed Artifact patches.
`;
}

function runNodeScript(scriptRelativePath, args) {
  const script = path.join(root, scriptRelativePath);
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function bootstrapWorkspace(slug) {
  runNodeScript("apps/workspace-generator/bin/bootstrap-workspace.js", [slug]);
}

async function main() {
  const args = process.argv.slice(2);
  const questionBank = readJson("packages/interview-engine/question-bank.json");
  const templateBank = readJson("packages/interview-engine/templates/niche-templates.json");
  const answers = {};
  const templateId = argValue(args, "--template");
  const template = templateId ? templateBank.templates.find((item) => item.id === templateId) : null;

  const answersPath = argValue(args, "--answers");
  if (answersPath) {
    Object.assign(answers, readJsonFile(answersPath));
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Deep interview iniziale per creare il workspace social AI.\n");
    for (const question of questionBank.questions) {
      answers[question.field] = await ask(rl, question.prompt);
    }
    rl.close();
  }

  const templatedAnswers = applyTemplate(answers, template);
  const { brief, validation } = buildBriefFromAnswers(templatedAnswers, questionBank);
  if (!validation.valid) {
    console.error(`Brief incompleto. Campi mancanti: ${validation.missing.join(", ")}`);
    process.exit(1);
  }

  const slug = slugify(brief.projectName);
  const briefDir = path.join(root, "workspaces/briefs");
  ensureDir(briefDir);
  const briefPath = path.join(briefDir, `${slug}.json`);
  fs.writeFileSync(briefPath, `${JSON.stringify(brief, null, 2)}\n`);

  const interviewDir = path.join(root, "workspaces/interviews", slug);
  ensureDir(interviewDir);
  fs.writeFileSync(path.join(interviewDir, "answers.json"), `${JSON.stringify(templatedAnswers, null, 2)}\n`);
  fs.writeFileSync(path.join(interviewDir, "transcript.md"), interviewMarkdown({ questionBank, answers: templatedAnswers, brief, validation }));
  fs.writeFileSync(path.join(interviewDir, "personalization-task-plan.md"), personalizationTaskPlan(brief));

  runNodeScript("apps/workspace-generator/bin/generate-workspace.js", ["--brief", briefPath]);

  if (args.includes("--bootstrap") || args.includes("--full")) {
    bootstrapWorkspace(slug);
  } else if (args.includes("--route-models")) {
    runNodeScript("apps/workspace-generator/bin/route-models.js", [slug]);
  }
  if (args.includes("--workflow") || args.includes("--full")) {
    runNodeScript("apps/workspace-generator/bin/run-workflow.js", [slug]);
  }

  console.log(`Brief salvato: ${path.relative(root, briefPath)}`);
  console.log(`Intervista salvata: ${path.relative(root, interviewDir)}`);
  console.log(`Workspace: workspaces/generated-projects/${slug}`);
  const next = writeNextCommandFiles({
    root,
    workspace: slug,
    state: args.includes("--bootstrap") || args.includes("--full") ? "chat" : "needs-bootstrap"
  });
  console.log("");
  console.log(next.markdown);
  console.log("");
  console.log(`Next command file: ${path.relative(root, next.generatedNextCommands)}`);
  console.log(`Continue script: ${path.relative(root, next.generatedContinueScript)}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
