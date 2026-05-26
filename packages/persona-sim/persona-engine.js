const DEFAULT_PERSONA_COUNT = 5;

function splitAudience(targetAudience) {
  return String(targetAudience || "")
    .split(/,| and | e /i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPersonaPanel(brief, count = DEFAULT_PERSONA_COUNT) {
  const audienceParts = splitAudience(brief.targetAudience);
  const base = audienceParts.length > 0 ? audienceParts : ["curious prospect"];
  const archetypes = [
    {
      stance: "Skeptical operator",
      motivation: "save time and avoid fragile tools",
      objection: "This sounds like setup complexity disguised as automation.",
      trigger: "clear before/after workflow proof"
    },
    {
      stance: "Cost-sensitive founder",
      motivation: "reduce recurring SaaS costs",
      objection: "Local-first is attractive, but quality and maintenance worry me.",
      trigger: "specific hardware expectations and realistic limits"
    },
    {
      stance: "Creative strategist",
      motivation: "produce better ideas faster",
      objection: "The content may become generic if the system does not learn taste.",
      trigger: "memory from feedback and strong examples"
    },
    {
      stance: "Agency delivery lead",
      motivation: "standardize client delivery",
      objection: "Approval, revisions, and client-specific voice need to be robust.",
      trigger: "clear review states and client-ready artifacts"
    },
    {
      stance: "Technical early adopter",
      motivation: "own the stack and customize agents",
      objection: "I need proof that integrations are modular and not locked to a SaaS.",
      trigger: "repo structure, local commands, and extension points"
    }
  ];

  return archetypes.slice(0, count).map((item, index) => ({
    id: `persona-${String(index + 1).padStart(2, "0")}`,
    label: item.stance,
    segment: base[index % base.length],
    motivation: item.motivation,
    coreObjection: item.objection,
    conversionTrigger: item.trigger,
    contentLens: `${item.stance} evaluating ${brief.offer || brief.niche}`
  }));
}

function extractDraftSections(markdown) {
  const sections = [];
  const parts = String(markdown || "").split(/\n##\s+/).filter(Boolean);
  for (const part of parts) {
    const lines = part.trim().split("\n");
    const title = lines.shift() || "Untitled";
    const body = lines.join("\n").trim();
    if (title.toLowerCase().startsWith("post") || title.toLowerCase().startsWith("carousel") || title.toLowerCase().startsWith("reel")) {
      sections.push({ title, body });
    }
  }
  return sections;
}

function scoreDraftForPersona(draft, persona, brief) {
  const text = `${draft.title}\n${draft.body}`.toLowerCase();
  let interest = 55;
  let trust = 50;
  let clarity = 55;
  const flags = [];

  if (text.includes("local") || text.includes("no subscription") || text.includes("saaS".toLowerCase())) {
    interest += 12;
  }
  if (text.includes("human") || text.includes("approval") || text.includes("review")) {
    trust += 12;
  }
  if (text.includes("proof") || text.includes("example") || text.includes("before/after")) {
    trust += 10;
  } else {
    flags.push("Needs concrete proof or before/after example.");
  }
  if (text.includes("workspace") || text.includes("workflow") || text.includes("calendar")) {
    clarity += 10;
  }
  if (text.length < 180) {
    flags.push("Draft may be too thin to overcome skepticism.");
    trust -= 5;
  }
  if (!text.includes(String(brief.offer || "").toLowerCase().split(" ")[0])) {
    flags.push("Offer connection is weak or implicit.");
    clarity -= 5;
  }

  const objection = flags[0] || persona.coreObjection;
  const likelyComment = buildLikelyComment(persona, interest, trust);
  return {
    personaId: persona.id,
    draftTitle: draft.title,
    scores: {
      interest: clamp(interest),
      trust: clamp(trust),
      clarity: clamp(clarity),
      purchaseIntent: clamp(Math.round((interest + trust + clarity) / 3) - 10)
    },
    likelyReaction: likelyComment,
    mainObjection: objection,
    recommendedFix: recommendFix(flags, persona)
  };
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function buildLikelyComment(persona, interest, trust) {
  if (interest >= 65 && trust >= 60) {
    return `Interesting, but show me how this works in a real ${persona.segment} workflow.`;
  }
  if (interest >= 65) {
    return "This sounds useful, but I need proof it is not another complicated setup.";
  }
  return "I understand the idea, but I do not yet see why I should care now.";
}

function recommendFix(flags, persona) {
  if (flags.some((flag) => flag.includes("proof"))) {
    return `Add a concrete proof point for the ${persona.label}: screenshot, before/after, workflow artifact, or mini case.`;
  }
  if (flags.some((flag) => flag.includes("thin"))) {
    return "Add one specific example, one consequence of inaction, and one sharper CTA.";
  }
  if (flags.some((flag) => flag.includes("Offer"))) {
    return "Name the offer and outcome directly in the body.";
  }
  return `Address objection: ${persona.coreObjection}`;
}

function simulateDrafts(brief, draftMarkdown) {
  const personas = buildPersonaPanel(brief);
  const drafts = extractDraftSections(draftMarkdown);
  const evaluations = [];
  for (const draft of drafts) {
    for (const persona of personas) {
      evaluations.push(scoreDraftForPersona(draft, persona, brief));
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    projectName: brief.projectName,
    personas,
    drafts,
    evaluations,
    dialogue: buildPersonaDialogue(personas, evaluations),
    summary: summarize(evaluations)
  };
}

function buildPersonaDialogue(personas, evaluations) {
  const grouped = new Map();
  for (const evaluation of evaluations) {
    if (!grouped.has(evaluation.draftTitle)) {
      grouped.set(evaluation.draftTitle, []);
    }
    grouped.get(evaluation.draftTitle).push(evaluation);
  }

  return [...grouped.entries()].map(([draftTitle, items]) => {
    const weakest = [...items].sort((a, b) => a.scores.purchaseIntent - b.scores.purchaseIntent)[0];
    const strongest = [...items].sort((a, b) => b.scores.purchaseIntent - a.scores.purchaseIntent)[0];
    const skeptic = personas.find((persona) => persona.id === weakest.personaId) || personas[0];
    const advocate = personas.find((persona) => persona.id === strongest.personaId) || personas[0];
    return {
      draftTitle,
      turns: [
        {
          speaker: skeptic.label,
          message: weakest.mainObjection
        },
        {
          speaker: advocate.label,
          message: strongest.likelyReaction
        },
        {
          speaker: "Panel moderator",
          message: `The draft should first fix: ${weakest.recommendedFix}`
        }
      ],
      likelyDecision: strongest.scores.purchaseIntent >= 60 ? "interested_with_proof" : "not_ready",
      dominantObjection: weakest.mainObjection
    };
  });
}

function summarize(evaluations) {
  if (evaluations.length === 0) {
    return {
      averageInterest: 0,
      averageTrust: 0,
      averageClarity: 0,
      averagePurchaseIntent: 0,
      topFixes: ["No draft sections found to simulate."]
    };
  }
  const averages = ["interest", "trust", "clarity", "purchaseIntent"].reduce((acc, key) => {
    acc[key] = Math.round(evaluations.reduce((sum, item) => sum + item.scores[key], 0) / evaluations.length);
    return acc;
  }, {});
  const fixCounts = new Map();
  for (const evaluation of evaluations) {
    fixCounts.set(evaluation.recommendedFix, (fixCounts.get(evaluation.recommendedFix) || 0) + 1);
  }
  const topFixes = [...fixCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([fix]) => fix);
  return {
    averageInterest: averages.interest,
    averageTrust: averages.trust,
    averageClarity: averages.clarity,
    averagePurchaseIntent: averages.purchaseIntent,
    topFixes
  };
}

function simulationMarkdown(result) {
  return `# Persona Simulation Report

Generated at: ${result.generatedAt}

Project: ${result.projectName}

## Audience Panel
${result.personas.map((persona) => `### ${persona.label}
- Segment: ${persona.segment}
- Motivation: ${persona.motivation}
- Core objection: ${persona.coreObjection}
- Conversion trigger: ${persona.conversionTrigger}
`).join("\n")}

## Summary Scores
- Average interest: ${result.summary.averageInterest}/100
- Average trust: ${result.summary.averageTrust}/100
- Average clarity: ${result.summary.averageClarity}/100
- Average purchase intent: ${result.summary.averagePurchaseIntent}/100

## Top Fixes
${result.summary.topFixes.map((fix) => `- ${fix}`).join("\n")}

## Persona Panel Dialogue
${result.dialogue.map((dialogue) => `### ${dialogue.draftTitle}
- Likely decision: ${dialogue.likelyDecision}
- Dominant objection: ${dialogue.dominantObjection}
${dialogue.turns.map((turn) => `- ${turn.speaker}: ${turn.message}`).join("\n")}
`).join("\n")}

## Draft Evaluations
${result.evaluations.map((evaluation) => `### ${evaluation.draftTitle} / ${evaluation.personaId}
- Interest: ${evaluation.scores.interest}/100
- Trust: ${evaluation.scores.trust}/100
- Clarity: ${evaluation.scores.clarity}/100
- Purchase intent: ${evaluation.scores.purchaseIntent}/100
- Likely reaction: ${evaluation.likelyReaction}
- Main objection: ${evaluation.mainObjection}
- Recommended fix: ${evaluation.recommendedFix}
`).join("\n")}

## Limits
- This is a deterministic local simulation, not market proof.
- Use it to find weak claims, missing proof, unclear CTAs, and likely objections before human approval.
`;
}

function regenerationTasksFromSimulation(result) {
  return result.summary.topFixes.map((fix, index) => ({
    createdAt: new Date().toISOString(),
    artifact: "simulation/persona-report.md",
    feedback: fix,
    target: "drafts/posts.md",
    status: "pending",
    source: "persona-sim",
    priority: index + 1
  }));
}

module.exports = {
  buildPersonaPanel,
  buildPersonaDialogue,
  extractDraftSections,
  regenerationTasksFromSimulation,
  simulateDrafts,
  simulationMarkdown
};
