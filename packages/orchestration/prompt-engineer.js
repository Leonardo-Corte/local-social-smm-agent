const { runOllamaGenerate } = require("../local-runtime/model-client");

// Flux/Pollinations prompt syntax reference injected into every call
const FLUX_SYNTAX_GUIDE = `
## Flux Image Prompt Syntax (machine language for image generation)

Structure: [SUBJECT] + [SETTING/ENVIRONMENT] + [LIGHTING] + [STYLE] + [MOOD] + [CAMERA/COMPOSITION] + [QUALITY TAGS]

Rules:
- Comma-separated descriptors, NO full sentences
- Be extremely specific and visual — describe what you SEE, not what you FEEL
- Every launch image needs a clear focal subject, product/category cue, and visual metaphor; never output only a background.
- Adjectives first: "vibrant colorful balloons" not "balloons that are colorful and vibrant"
- Style modifiers go at the end: "cinematic lighting, 4K, ultra-detailed, photorealistic"
- Avoid negatives — describe what IS there, not what isn't
- For animated/illustrated style: add "digital illustration, concept art, vibrant colors"
- For photorealistic: add "DSLR photo, f/2.8 aperture, golden hour, photorealistic render"
- For Pixar/animated style: add "Pixar 3D render, CGI animation, soft lighting, Disney-Pixar style"
- Max effective length: ~200 words

## Quality tail (always append):
"high detail, 4K resolution, sharp focus, professional photography, award-winning composition"
`.trim();

function buildPromptEngineerSystemPrompt() {
  return `Sei un Prompt Engineer specializzato in generazione di immagini con modelli AI (Flux, Stable Diffusion, DALL-E).

Il tuo unico compito: leggere un creative brief prodotto da un team creativo e trasformarlo in prompt precisi, ottimizzati per il linguaggio macchina del modello generativo.

${FLUX_SYNTAX_GUIDE}

## Output richiesto

Produci ESATTAMENTE questo formato (nessun testo extra prima o dopo):

IMAGE_PROMPT: [prompt ottimizzato per immagine quadrata Instagram 1:1, max 200 parole, solo virgole e descrittori, NO frasi complete]

COVER_PROMPT: [variante verticale 9:16 per Instagram Reel cover/Story, adatta la composizione al formato verticale]

RATIONALE: [2-3 righe spiegando le scelte chiave del prompt: perché questi elementi, questo stile, questa composizione]

STYLE_TAG: [una parola: photorealistic | illustrated | pixar3d | cinematic | anime | minimalist]`;
}

function buildPromptEngineerUserPrompt({ creativeBrief, request, intent }) {
  return `## Creative Brief dal team
${creativeBrief.slice(0, 3000)}

## Richiesta originale del cliente
${request}

## Intent del contenuto
${intent} (Instagram post/visual content)

## Regole anti-output generico
- Non generare solo "neon city", "futuristic cityscape", "futuristic tech interface" o sfondi cyberpunk generici.
- Se è un lancio, il prompt deve contenere: soggetto centrale, metafora del prodotto, categoria, audience cue, spazio sicuro per headline da aggiungere in editor.
- Per prodotti voice/agentic/developer: includi waveform, terminale, tool calls, task checklist, command logs, execution pipeline, non solo città futuristica.
- Non usare loghi o marchi di terzi dentro l'immagine. Se il brief cita un competitor, rappresenta il contrasto come metafora astratta.
- Non chiedere testo leggibile dentro l'immagine generata; la typography va aggiunta dopo in editor.

---

Trasforma questo brief in prompt ottimizzati per la generazione di immagini. Segui ESATTAMENTE il formato richiesto.`;
}

function parsePromptEngineerOutput(output) {
  const imageMatch = output.match(/IMAGE_PROMPT:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
  const coverMatch = output.match(/COVER_PROMPT:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
  const rationaleMatch = output.match(/RATIONALE:\s*(.+?)(?=\n[A-Z_]+:|$)/s);
  const styleMatch = output.match(/STYLE_TAG:\s*(\w+)/);

  const clean = (s) => s ? s.trim().replace(/\n+/g, " ").replace(/\s+/g, " ") : null;

  return {
    imagePrompt: clean(imageMatch?.[1]) || null,
    coverPrompt: clean(coverMatch?.[1]) || null,
    rationale: clean(rationaleMatch?.[1]) || null,
    styleTag: styleMatch?.[1]?.trim() || "photorealistic",
    raw: output
  };
}

function fallbackPromptFromBrief(creativeBrief, request) {
  const topIdeaMatch = creativeBrief.match(/TOP IDEA:\s*(.+)\n[\s\S]*?Come si esegue:([\s\S]*?)(?=\n\*\*TOP IDEA|\n###|$)/i);
  if (topIdeaMatch) {
    const title = topIdeaMatch[1].replace(/\*+/g, "").trim();
    const steps = topIdeaMatch[2].trim().split("\n").slice(0, 3)
      .map(s => s.replace(/^\d+\.\s*/, "").replace(/\*+/g, "").trim())
      .filter(Boolean);
    const base = [title, ...steps].join(", ");
    return `${base}, Instagram post, vibrant colors, photorealistic, high quality, 4K, no text overlay`;
  }
  return `${request}, clear central product metaphor, strong focal subject, platform-safe negative space for headline overlay, audience-specific visual cues, no readable text inside generated image, no third-party logos, high contrast launch poster, professional social campaign visual, high quality, 4K`;
}

async function runPromptEngineer({ creativeBrief, request, intent, model, timeoutMs = 60000, onProgress }) {
  if (onProgress) onProgress({ phase: "prompt-engineer", message: "Strutturando prompt per generazione visiva..." });

  const systemPrompt = buildPromptEngineerSystemPrompt();
  const userPrompt = buildPromptEngineerUserPrompt({ creativeBrief, request, intent });

  // Combined prompt since Ollama uses single-turn format
  const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;

  let output = "";
  try {
    output = await runOllamaGenerate({ model, prompt: fullPrompt, timeoutMs: Math.min(timeoutMs, 90000) });
  } catch (err) {
    output = "";
  }

  const parsed = parsePromptEngineerOutput(output);

  // Fallback if LLM didn't produce parseable output
  if (!parsed.imagePrompt) {
    parsed.imagePrompt = fallbackPromptFromBrief(creativeBrief, request);
    parsed.coverPrompt = parsed.imagePrompt.replace("Instagram post", "vertical 9:16 Instagram Story cover");
    parsed.rationale = "Fallback automatico dal brief (LLM non ha prodotto output strutturato)";
    parsed.fallback = true;
  }

  if (onProgress) onProgress({ phase: "prompt-engineer", message: `Prompt pronto — stile: ${parsed.styleTag}` });

  return parsed;
}

module.exports = { runPromptEngineer, fallbackPromptFromBrief };
