const fs = require("fs");
const path = require("path");
const { runOllamaGenerate } = require("../local-runtime/model-client");

const REFLECTIONS_FILE = "memory/reflections.json";
const MAX_REFLECTIONS = 40;

function loadReflections(workspaceRoot) {
  const filePath = path.join(workspaceRoot, REFLECTIONS_FILE);
  if (!fs.existsSync(filePath)) return { rules: [], history: [] };
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return { rules: [], history: [] }; }
}

function saveReflections(workspaceRoot, data) {
  const filePath = path.join(workspaceRoot, REFLECTIONS_FILE);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function buildReflectionExtractionPrompt({ request, creativeBrief, topIdeas, intent }) {
  return `Sei un meta-analista che impara dai processi creativi del team.

## Sessione appena completata
Richiesta: ${request}
Intent: ${intent}

## Top idee emerse dal brainstorming
${topIdeas.slice(0, 1500)}

## Brief creativo finale
${creativeBrief.slice(0, 1000)}

## Il tuo compito
Analizza questa sessione ed estrai regole di apprendimento per migliorare le sessioni future.

Formato OUTPUT richiesto (ESATTAMENTE questo, nessun testo extra):

RULE: [regola concreta e applicabile, max 1 riga]
CONTEXT: [quando applicare questa regola]
CONFIDENCE: [alta|media|bassa]

---

RULE: [altra regola]
CONTEXT: [quando applicare]
CONFIDENCE: [alta|media|bassa]

Scrivi 3-5 regole. Focalizzati su:
- Pattern visivi che hanno funzionato bene
- Toni e stili preferiti per questo tipo di contenuto
- Errori o rischi identificati dal team
- Cosa distingueva le top idea dalle idee mediocri in questa sessione`;
}

function parseRules(output) {
  const rules = [];
  const blocks = output.split(/---+/).map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const ruleMatch = block.match(/RULE:\s*(.+)/);
    const contextMatch = block.match(/CONTEXT:\s*(.+)/);
    const confMatch = block.match(/CONFIDENCE:\s*(alta|media|bassa)/i);
    if (ruleMatch) {
      rules.push({
        rule: ruleMatch[1].trim(),
        context: contextMatch ? contextMatch[1].trim() : "generale",
        confidence: confMatch ? confMatch[1].toLowerCase() : "media",
        addedAt: new Date().toISOString()
      });
    }
  }
  return rules;
}

async function extractReflections({ workspaceRoot, request, creativeBrief, topIdeas = "", intent, model, timeoutMs = 60000 }) {
  const prompt = buildReflectionExtractionPrompt({ request, creativeBrief, topIdeas, intent });

  let output = "";
  try {
    output = await runOllamaGenerate({ model, prompt, timeoutMs: Math.min(timeoutMs, 60000) });
  } catch { return []; }

  return parseRules(output);
}

async function updateReflections({ workspaceRoot, request, creativeBrief, synthesis, intent, model, timeoutMs }) {
  const topIdeasMatch = synthesis.match(/TOP IDEA:[\s\S]*?(?=### Creative Brief|$)/i);
  const topIdeas = topIdeasMatch ? topIdeasMatch[0] : "";

  const newRules = await extractReflections({ workspaceRoot, request, creativeBrief: synthesis, topIdeas, intent, model, timeoutMs });
  if (newRules.length === 0) return { added: 0, total: 0 };

  const data = loadReflections(workspaceRoot);
  data.rules = [...data.rules, ...newRules].slice(-MAX_REFLECTIONS);
  data.history = [...(data.history || []), {
    runAt: new Date().toISOString(),
    request: request.slice(0, 100),
    intent,
    rulesAdded: newRules.length
  }].slice(-20);

  saveReflections(workspaceRoot, data);
  return { added: newRules.length, total: data.rules.length, rules: newRules };
}

function buildReflectionsPrompt(workspaceRoot, { intent, limit = 10 } = {}) {
  const data = loadReflections(workspaceRoot);
  if (!data.rules || data.rules.length === 0) return "";

  // Filter relevant rules: high confidence first, then contextual match
  const relevant = data.rules
    .filter(r => r.confidence === "alta" || (r.context && r.context.toLowerCase().includes(intent || "")))
    .concat(data.rules.filter(r => r.confidence !== "alta"))
    .slice(0, limit);

  if (relevant.length === 0) return "";

  return `## Memoria del team — cosa ha funzionato nelle sessioni precedenti
${relevant.map(r => `- [${r.confidence.toUpperCase()}] ${r.rule} _(${r.context})_`).join("\n")}

Tieni conto di questi pattern nelle tue idee — sono lezioni apprese da sessioni reali con questo workspace.`;
}

module.exports = { updateReflections, buildReflectionsPrompt, loadReflections };
