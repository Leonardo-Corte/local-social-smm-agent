const { runOllamaGenerate } = require("../local-runtime/model-client");

function divergePrompt({ agent, agentDef, request, taskPlan, roomContext, reflectionsContext }) {
  return `Sei ${agent.label} in una stanza creativa con il tuo team di marketing.

## La richiesta del cliente
${request}

## Il tuo ruolo nel team
${agentDef.slice(0, 1200)}

## Task assegnati a te
${taskPlan.tasksByAgent[agent.id]?.join("\n") || "Contribuisci dal tuo punto di vista."}
${reflectionsContext ? `\n${reflectionsContext}\n` : ""}
## Round 1 — DIVERGE (butta fuori idee, nessun filtro)
Questo è il momento della creatività pura. Non autofiltrarti.
Genera esattamente 3-5 idee originali dal tuo punto di vista specifico.
Sii audace, specifico, creativo. Le idee brutte ora diventano idee geniali dopo.

Formato richiesto — scrivi ESATTAMENTE così per ogni idea:
IDEA: [titolo breve]
[2-4 righe di descrizione concreta — cosa, come, perché funziona]

Dopo le idee, scrivi una riga:
DOMANDA: [una domanda al team che ti blocca o che aprirebbe nuove possibilità]`;
}

function reactPrompt({ agent, agentDef, request, roomContext }) {
  return `Sei ${agent.label} nella stanza creativa del tuo team.

## La richiesta
${request}

## Il tuo ruolo
${agentDef.slice(0, 800)}

## Cosa ha detto il team fino ad ora
${roomContext}

## Round 2 — REACT (reagisci alle idee degli altri)
Hai letto le idee dei tuoi colleghi. Ora il tuo lavoro è:

1. LOVE: Scegli 1-2 idee di un collega che ti accendono. Digli perché e aggiungi qualcosa concreta.
   Formato: LOVE [@collega]: [cosa ami] → [cosa aggiunge/costruisce]

2. CHALLENGE: Sfida 1 idea in modo costruttivo. Non distruggi — migliora.
   Formato: CHALLENGE [@collega - titolo idea]: [cosa non funziona e come risolverlo]

3. BUILD: Prendi la tua idea preferita emersa dal round 1 (tua o altrui) e costruiscila ulteriormente.
   Formato: BUILD: [titolo] → [versione potenziata con dettagli concreti di esecuzione]

Sii diretto, specifico, creativo. Questo è brainstorming vero.`;
}

function convergePrompt({ request, roomContext, taskPlan }) {
  return `Sei il direttore creativo che guida il processo di sintesi.

## La richiesta originale
${request}

## Tutto quello che il team ha detto
${roomContext}

## Il tuo compito — CONVERGE
Leggi tutto il brainstorming e identifica le idee più forti emerse dalla collaborazione.

### 1. Top Ideas (3-5)
Per ogni idea vincente:
TOP IDEA: [titolo]
Proposta da: [agente]
Supportata da: [altri agenti che hanno reagito positivamente]
Perché funziona: [2-3 righe]
Come si esegue: [passi concreti]

### 2. Creative Brief
Scrivi un brief creativo sintetico (max 300 parole) che cattura:
- Il concept centrale emerso dal brainstorming
- Il tono e lo stile concordato dal team
- I messaggi chiave da comunicare
- Gli elementi visivi/testuali prioritari
- I rischi identificati dal team

### 3. Assegnazioni
Per ogni agente del team, scrivi 1-2 righe su cosa deve produrre ora basandosi sul brief:
ASSEGNAZIONE [@agente]: [cosa deve fare concretamente]

Questo brief diventa la guida per la fase di esecuzione.`;
}

function extractIdeas(output) {
  const ideas = [];
  const regex = /^IDEA:\s*(.+)$([\s\S]*?)(?=^IDEA:|^DOMANDA:|$)/gm;
  let match;
  while ((match = regex.exec(output)) !== null) {
    ideas.push({ title: match[1].trim(), description: match[2].trim() });
  }
  return ideas;
}

function extractQuestion(output) {
  const match = output.match(/^DOMANDA:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

async function runDivergeRound({ agents, agentDefs, request, taskPlan, room, model, timeoutMs, onProgress, reflectionsContext }) {
  room.round = 1;
  const results = [];

  for (const agent of agents) {
    if (onProgress) onProgress({ phase: "diverge", agent: agent.id });
    const agentDef = agentDefs[agent.id] || "";
    const roomContext = room.getRoomContext();
    const prompt = divergePrompt({ agent, agentDef, request, taskPlan, roomContext, reflectionsContext });

    let output = "";
    try {
      output = await runOllamaGenerate({ model, prompt, timeoutMs });
    } catch (err) {
      output = `[${agent.id} non disponibile: ${err.message}]`;
    }

    const ideas = extractIdeas(output);
    const question = extractQuestion(output);

    room.post({ from: agent.id, to: "all", type: "idea", content: output, round: 1 });
    results.push({ agent: agent.id, ideas, question, raw: output });
  }

  return results;
}

async function runReactRound({ agents, agentDefs, request, room, model, timeoutMs, onProgress }) {
  room.round = 2;
  const results = [];

  for (const agent of agents) {
    if (onProgress) onProgress({ phase: "react", agent: agent.id });
    const agentDef = agentDefs[agent.id] || "";
    const roomContext = room.getRoomContext({ maxChars: 6000 });
    const prompt = reactPrompt({ agent, agentDef, request, roomContext });

    let output = "";
    try {
      output = await runOllamaGenerate({ model, prompt, timeoutMs });
    } catch (err) {
      output = `[${agent.id} non ha risposto: ${err.message}]`;
    }

    room.post({ from: agent.id, to: "all", type: "reaction", content: output, round: 2 });
    results.push({ agent: agent.id, raw: output });
  }

  return results;
}

async function runConvergeRound({ request, room, taskPlan, model, timeoutMs, onProgress }) {
  room.round = 3;
  if (onProgress) onProgress({ phase: "converge", agent: "creative-director" });

  const roomContext = room.getRoomContext({ maxChars: 10000 });
  const prompt = convergePrompt({ request, roomContext, taskPlan });

  let synthesis = "";
  try {
    synthesis = await runOllamaGenerate({ model, prompt, timeoutMs });
  } catch (err) {
    synthesis = `[Sintesi fallita: ${err.message}]`;
  }

  room.post({ from: "creative-director", to: "all", type: "synthesis", content: synthesis, round: 3 });
  return synthesis;
}

// Parse @mentions from a message and return list of agent IDs mentioned
function extractMentions(text, knownAgentIds) {
  const mentions = new Set();
  const regex = /@([\w-]+)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const id = m[1].toLowerCase();
    if (knownAgentIds.includes(id)) mentions.add(id);
  }
  return [...mentions];
}

// Round 2.5 — Direct dialogue: agents who were @mentioned respond directly to their caller
async function runDirectDialogueRound({ agents, agentDefs, request, room, model, timeoutMs, onProgress }) {
  room.round = 2;
  const agentIds = agents.map(a => a.id);
  const reactMessages = room.getMessages({ round: 2 });
  const results = [];

  // Build map: addressedAgent -> [{from, content}]
  const pendingReplies = {};
  for (const msg of reactMessages) {
    const mentions = extractMentions(msg.content, agentIds);
    for (const mentionedId of mentions) {
      if (mentionedId === msg.from) continue; // skip self-mentions
      if (!pendingReplies[mentionedId]) pendingReplies[mentionedId] = [];
      pendingReplies[mentionedId].push({ from: msg.from, snippet: msg.content.slice(0, 400) });
    }
  }

  for (const agent of agents) {
    const pending = pendingReplies[agent.id];
    if (!pending || pending.length === 0) continue;

    if (onProgress) onProgress({ phase: "dialogue", agent: agent.id });

    const agentDef = agentDefs[agent.id] || "";
    const callers = pending.map(p => `${p.from} ti ha citato:\n${p.snippet}`).join("\n\n---\n\n");

    const prompt = `Sei ${agent.label} nella stanza creativa del team.

## Richiesta originale
${request}

## Il tuo ruolo
${agentDef.slice(0, 600)}

## Colleghi che ti hanno citato direttamente
${callers}

## Il tuo compito — RISPOSTA DIRETTA
Rispondi brevemente ai colleghi che ti hanno citato. Sii diretto e costruttivo.
Per ogni collega che ti ha citato:
RISPOSTA [@collega]: [la tua risposta concreta — max 3 righe]

Poi aggiungi, se hai qualcosa di nuovo:
AGGIUNTA: [insight o dettaglio che emerge da questo scambio]`;

    let output = "";
    try {
      output = await runOllamaGenerate({ model, prompt, timeoutMs: Math.min(timeoutMs, 60000) });
    } catch (err) {
      output = `[${agent.id} non disponibile per risposta diretta]`;
    }

    room.post({ from: agent.id, to: "all", type: "reaction", content: output, round: 2 });
    results.push({ agent: agent.id, raw: output });
  }

  return results;
}

async function runBrainstorm({ agents, agentDefs, request, taskPlan, room, model, timeoutMs = 240000, onProgress, reflectionsContext }) {
  const divergeResults = await runDivergeRound({ agents, agentDefs, request, taskPlan, room, model, timeoutMs, onProgress, reflectionsContext });
  const reactResults = await runReactRound({ agents, agentDefs, request, room, model, timeoutMs, onProgress });

  // Direct dialogue: agents respond to @mentions from the react round
  const dialogueResults = await runDirectDialogueRound({ agents, agentDefs, request, room, model, timeoutMs, onProgress });

  const synthesis = await runConvergeRound({ request, room, taskPlan, model, timeoutMs, onProgress });

  return { divergeResults, reactResults, dialogueResults, synthesis, roomSummary: room.getRoundSummary(1) };
}

module.exports = { runBrainstorm, runDivergeRound, runReactRound, runConvergeRound, runDirectDialogueRound };
