const { normalizePlatforms } = require("../platform-intel/platform-playbooks");

function unique(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function textBag(brief) {
  return [
    brief.projectName,
    brief.cleanedPositioning,
    brief.businessType,
    brief.niche,
    brief.offer,
    brief.targetAudience,
    brief.valueProposition,
    brief.primaryGoal30Days,
    brief.audience && brief.audience.primary,
    brief.audience && brief.audience.secondary,
    brief.audience && brief.audience.venueBuyer,
    ...(brief.goals30Days || []),
    ...(brief.availableAssets || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function inferLocation(brief) {
  const text = textBag(brief);
  if (/new york|nyc|brooklyn|manhattan/.test(text)) {
    return {
      city: "New York City",
      shortCity: "NYC"
    };
  }
  return {
    city: "",
    shortCity: ""
  };
}

function inferBusinessSeeds(brief) {
  const text = textBag(brief);
  const location = inferLocation(brief);
  const city = location.shortCity || location.city;
  const platforms = normalizePlatforms(brief.platforms);
  const seeds = [];

  if (/network|connession|connect|corporate|event|venue|ticket|luma|profession/.test(text)) {
    seeds.push(
      `${city} networking events`,
      `${city} corporate networking`,
      `${city} professional networking`,
      `${city} business networking events`,
      `${city} founder networking events`,
      `${city} after work networking`,
      `${city} social networking events`,
      `${city} event tickets networking`,
      `${city} venue private events`,
      `${city} hospitality event marketing`,
      "networking event reel hooks",
      "event recap reel hooks",
      "Luma event promotion",
      "professional networking objections",
      "how to make networking events fun"
    );
  }

  if (/instagram|reel|organic|social/.test(text) || platforms.includes("instagram")) {
    seeds.push(
      `${city} Instagram reels events`,
      "event marketing Instagram reels",
      "social event content ideas",
      "community growth Instagram events"
    );
  }

  if (/facebook/.test(text) || platforms.includes("facebook")) {
    seeds.push(`${city} Facebook events networking`, "Facebook event promotion ideas");
  }

  if (/linkedin/.test(text) || platforms.includes("linkedin")) {
    seeds.push(`${city} LinkedIn networking events`, "LinkedIn event promotion for professionals");
  }

  if (/\bx\b|twitter/.test(text) || platforms.includes("x")) {
    seeds.push(
      `${city} networking events X threads`,
      `${city} professional networking Twitter`,
      "X post hooks for events",
      "Twitter thread ideas networking events",
      "timely conversation prompts for professional events"
    );
  }

  if (/reddit|subreddit/.test(text) || platforms.includes("reddit")) {
    seeds.push(
      `${city} networking events reddit`,
      `${city} professional networking reddit`,
      "reddit networking event objections",
      "subreddit self promotion rules event posts",
      "reddit community questions professional networking"
    );
  }

  return unique(seeds.filter((seed) => !seed.startsWith(" ")));
}

function humanReadableSeeds(brief) {
  const rawSeeds = [
    brief.businessType,
    brief.offer,
    brief.valueProposition,
    brief.audience && brief.audience.primary,
    brief.audience && brief.audience.secondary,
    brief.audience && brief.audience.venueBuyer,
    ...(brief.platforms || [])
  ];
  return unique(rawSeeds
    .flatMap((item) => String(item || "").split(/[,;/]/))
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 4 && item.length <= 90));
}

function keywordSeeds(brief) {
  const inferred = inferBusinessSeeds(brief);
  const readable = humanReadableSeeds(brief);
  return unique([...inferred, ...readable]).slice(0, 24);
}

function buildQueries(brief) {
  const seeds = keywordSeeds(brief);
  const platforms = normalizePlatforms(brief.platforms);
  const queries = [];
  for (const seed of seeds.slice(0, 8)) {
    queries.push(`${seed} trend`);
    queries.push(`${seed} content ideas`);
    queries.push(`${seed} problems objections`);
    if (platforms.length === 0 || platforms.includes("instagram")) {
      queries.push(`${seed} instagram reel hooks`);
    }
    if (platforms.length === 0 || platforms.includes("facebook")) {
      queries.push(`${seed} facebook community questions`);
    }
    if (platforms.includes("linkedin")) {
      queries.push(`${seed} linkedin post angles`);
    }
    if (platforms.includes("x")) {
      queries.push(`${seed} X thread hooks`);
      queries.push(`${seed} Twitter conversation prompts`);
    }
    if (platforms.includes("reddit")) {
      queries.push(`${seed} reddit questions objections`);
      queries.push(`${seed} subreddit discussion angle`);
    }
  }
  return [...new Set(queries)].slice(0, 30);
}

function sourceLinksForQuery(query) {
  const encoded = encodeURIComponent(query);
  return [
    {
      source: "google-trends",
      url: `https://trends.google.com/trends/explore?q=${encoded}`,
      action: "Open manually or browser-assisted, record trend direction and related queries."
    },
    {
      source: "youtube-trending-and-search",
      url: `https://www.youtube.com/results?search_query=${encoded}`,
      action: "Review public titles, thumbnails, formats, and hooks with light rate limits."
    },
    {
      source: "reddit-public",
      url: `https://www.reddit.com/search/?q=${encoded}`,
      action: "Review public discussions for pain language, objections, and recurring questions."
    },
    {
      source: "x-public-search-manual",
      url: `https://x.com/search?q=${encoded}&src=typed_query`,
      action: "Open manually for text-first hooks, timely POVs, and conversation angles; do not automate login or account actions."
    }
  ];
}

function classifySources(sourceRegistry) {
  return sourceRegistry.sources.map((source) => ({
    id: source.id,
    name: source.name,
    risk: source.risk,
    method: source.method,
    allowedUse: source.allowedUse,
    refreshCadence: source.refreshCadence,
    enabledByDefault: source.risk === "low" || source.risk === "medium",
    requiresHumanApproval: source.risk === "high" || source.risk === "blocked"
  }));
}

function buildResearchTasks(brief, sourceRegistry) {
  const safeSources = classifySources(sourceRegistry).filter((source) => source.enabledByDefault);
  return buildQueries(brief).map((query, index) => ({
    id: `research-task-${String(index + 1).padStart(2, "0")}`,
    query,
    objective: index % 3 === 0
      ? "Find audience pain language and objections."
      : index % 3 === 1
        ? "Find format, hook, and creative patterns."
        : "Find content gaps and positioning opportunities.",
    suggestedSources: safeSources.map((source) => source.id),
    status: "pending",
    evidenceRequired: true
  }));
}

function buildTrendReport(brief, sourceRegistry) {
  const sources = classifySources(sourceRegistry);
  return {
    generatedAt: new Date().toISOString(),
    projectName: brief.projectName,
    niche: brief.niche,
    targetAudience: brief.targetAudience,
    researchMode: "planned-local-first",
    sourceSummary: {
      lowRisk: sources.filter((source) => source.risk === "low").map((source) => source.id),
      mediumRisk: sources.filter((source) => source.risk === "medium").map((source) => source.id),
      highRiskManualOnly: sources.filter((source) => source.risk === "high").map((source) => source.id)
    },
    queries: buildQueries(brief),
    tasks: buildResearchTasks(brief, sourceRegistry).map((task) => ({
      ...task,
      sourceLinks: sourceLinksForQuery(task.query)
    })),
    guardrails: [
      "Cite every source before using a claim.",
      "Separate observed facts from strategic inference.",
      "Do not automate restricted Meta surfaces.",
      "Treat X and Reddit account-facing actions as manual/approved only.",
      "For Reddit, verify subreddit rules before any public draft becomes publishable.",
      "Use high-risk sources only through human/manual review unless explicitly approved."
    ]
  };
}

function reportMarkdown(report) {
  return `# Trend Research Plan

Generated at: ${report.generatedAt}

Project: ${report.projectName}
Niche: ${report.niche}
Target: ${report.targetAudience}
Mode: ${report.researchMode}

## Source Risk Summary
- Low risk: ${report.sourceSummary.lowRisk.join(", ") || "none"}
- Medium risk: ${report.sourceSummary.mediumRisk.join(", ") || "none"}
- High risk / manual only: ${report.sourceSummary.highRiskManualOnly.join(", ") || "none"}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}

## Query Seeds
${report.queries.map((query) => `- ${query}`).join("\n")}

## Research Tasks
${report.tasks.map((task) => `### ${task.id}
- Query: ${task.query}
- Objective: ${task.objective}
- Suggested sources: ${task.suggestedSources.join(", ")}
- Evidence required: ${task.evidenceRequired ? "yes" : "no"}
- Status: ${task.status}
${task.sourceLinks.map((link) => `- ${link.source}: ${link.url}`).join("\n")}
`).join("\n")}
`;
}

module.exports = {
  buildQueries,
  buildResearchTasks,
  buildTrendReport,
  classifySources,
  reportMarkdown,
  sourceLinksForQuery
};
