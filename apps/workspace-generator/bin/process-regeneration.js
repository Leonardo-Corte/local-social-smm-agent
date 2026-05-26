#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');

const root = path.resolve(__dirname, "../../..");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function append(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, content);
}

function regeneratePosts(workspaceRoot, brief, preferences, task) {
  const preferenceLines = preferences.preferences
    .map((item) => `- ${item.preference}`)
    .join("\n") || "- Nessuna preferenza aggiuntiva.";

  const proofLine = task.source === "persona-sim"
    ? "Proof point: In the sample workspace, one feedback loop turns a generic post into a founder-specific draft, records the preference, and queues regeneration automatically."
    : "Proof point: The workspace keeps feedback memory and regeneration tasks tied to each draft.";

  const content = `# Draft Posts

Regenerated at: ${new Date().toISOString()}
Reason: ${task.feedback}

## Learned Preferences
${preferenceLines}

## Post 1
Hook: Founder italiani: prima di automatizzare i social, sistemate il vostro sistema contenuti.

Body: Se ogni settimana riparti da zero, non ti serve un altro tool. Ti serve un workspace che contiene target, offerta, tono, calendario, bozze, review e memoria dei feedback.

${proofLine}

CTA: Salva questo post e controlla se il tuo processo ha almeno questi 6 pezzi.

## Post 2
Hook: Il problema non e pubblicare poco. E pubblicare senza una macchina editoriale.

Body: Per ${brief.targetAudience}, la differenza la fa un ciclo semplice: ricerca, calendario, bozza, critica, approvazione umana, apprendimento dal feedback.

${proofLine}

CTA: Scrivi "workspace" nella tua lista idee e trasformalo in processo.

## Post 3
Hook: Zero subscription non significa zero metodo.

Body: Il software puo essere locale e gratuito, ma la qualita arriva da brief chiaro, modelli scelti in base all'hardware e una review severa prima di pubblicare.

CTA: Prima di comprare un altro SaaS, definisci il tuo brief operativo.
`;

  fs.writeFileSync(path.join(workspaceRoot, "drafts/posts.md"), content);
}

function processTask(workspaceRoot, brief, preferences, task) {
  if (task.status === "pending_model_execution") {
    return {
      ...task,
      status: "needs_local_model_run",
      completedAt: new Date().toISOString(),
      processor: "workflow-task-router-v0.1",
      note: "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    };
  }

  if (task.target === "drafts/posts.md") {
    regeneratePosts(workspaceRoot, brief, preferences, task);
    return {
      ...task,
      status: "done",
      completedAt: new Date().toISOString(),
      processor: "deterministic-post-regenerator-v0.1"
    };
  }

  return {
    ...task,
    status: "needs_manual_or_model_support",
    completedAt: new Date().toISOString(),
    processor: "no-supported-regenerator-yet"
  };
}

function main() {
  const workspace = process.argv[2] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const brief = readJson(path.join(workspaceRoot, "project-brief.json"), {});
  const preferencesPath = path.join(workspaceRoot, "memory/preferences.json");
  const queuePath = path.join(workspaceRoot, "memory/regeneration-queue.json");
  const preferences = readJson(preferencesPath, { preferences: [] });
  const queue = readJson(queuePath, { tasks: [] });

  const processed = [];
  const remaining = [];
  for (const task of queue.tasks) {
    if (task.status !== "pending" && task.status !== "pending_model_execution") {
      remaining.push(task);
      continue;
    }
    processed.push(processTask(workspaceRoot, brief, preferences, task));
  }

  writeJson(queuePath, { tasks: [...remaining, ...processed] });
  append(path.join(workspaceRoot, "review/regeneration-log.md"), `
## ${new Date().toISOString()}
Processed tasks: ${processed.length}
${processed.map((task) => `- ${task.target}: ${task.status}`).join("\n")}
`);

  console.log(`Processed ${processed.length} regeneration task(s) for ${workspace}`);
}

main();
