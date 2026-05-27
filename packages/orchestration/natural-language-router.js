const FORMAT_STEPS = {
  post: ["research", "platform", "strategy", "copy", "persona", "qa"],
  carousel: ["research", "platform", "strategy", "visuals", "copy", "persona", "qa"],
  reel: ["research", "platform", "strategy", "video", "persona", "qa"],
  video: ["research", "platform", "strategy", "video", "persona", "qa"],
  image: ["strategy", "visuals", "qa"],
  message: ["strategy", "copy", "qa"],
  x: ["research", "platform", "strategy", "copy", "persona", "qa"],
  thread: ["research", "platform", "strategy", "copy", "persona", "qa"],
  reddit: ["research", "platform", "strategy", "copy", "persona", "qa"],
  content: ["research", "strategy", "copy", "persona", "qa"]
};

const AGENT_BY_FORMAT = {
  post: "copywriter",
  carousel: "copywriter",
  reel: "reel-shorts-producer",
  video: "reel-shorts-producer",
  image: "visual-director",
  message: "copywriter",
  x: "platform-strategist",
  thread: "platform-strategist",
  reddit: "platform-strategist",
  content: "copywriter"
};

const PLATFORM_ALIASES = [
  ["instagram", /\b(instagram|instagrm|intagram|insta|ig)\b/i],
  ["facebook", /\b(facebook|facebok|fb)\b/i],
  ["linkedin", /\b(linkedin|linkedn)\b/i],
  ["x", /\b(x|twitter|tweet|tweets)\b/i],
  ["reddit", /\b(reddit|subreddit|sub)\b/i],
  ["tiktok", /\b(tiktok|tik tok|tt)\b/i]
];

function stripAccents(text) {
  return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeText(input) {
  return stripAccents(input)
    .toLowerCase()
    .replace(/\binstagrm\b|\bintagram\b|\binstragram\b/g, "instagram")
    .replace(/\bfacebok\b/g, "facebook")
    .replace(/\breal\b/g, "reel")
    .replace(/\breels\b/g, "reel")
    .replace(/\bcarosell[oi]\b|\bcarousell?\b/g, "carousel")
    .replace(/\bimmgane\b|\bimmagine\b|\bimmagini\b|\bimg\b/g, "image")
    .replace(/\bfotto\b|\bfoto\b/g, "image")
    .replace(/\bpublica\b|\bpubblica\b|\bpubblicare\b|\bpostare\b/g, "publish")
    .replace(/\bannucio\b|\bannuncio\b|\bannunciare\b/g, "announcement")
    .replace(/\blancio\b|\blanciare\b|\blaunc?h\b/g, "launch")
    .replace(/\bcrtella\b|\bcartella\b|\bfolder\b|\bdrive\b/g, "asset-folder")
    .replace(/\blink\b|\bsito\b|\bwebsite\b/g, "url")
    .replace(/\s+/g, " ")
    .trim();
}

function matchEvidence(text, patterns) {
  const found = [];
  for (const [label, pattern] of patterns) {
    if (pattern.test(text)) {
      found.push(label);
    }
  }
  return found;
}

function detectPlatforms(input, normalized) {
  const platforms = [];
  for (const [platform, pattern] of PLATFORM_ALIASES) {
    if (pattern.test(input) || pattern.test(normalized)) {
      platforms.push(platform);
    }
  }
  return [...new Set(platforms)];
}

function detectActions(normalized) {
  const hasLocalPath = /(^|\s)\/(?!\/)[^\s]+/.test(normalized);
  return {
    create: /\b(crea|creami|gener|genera|fammi|prepara|scrivi|build|make|produce|sviluppa|announcement|launch)\b/.test(normalized),
    research: /\b(ricerca|trend|analizza|studia|competitor|benchmark|reddit|x|twitter|product hunt|hacker news)\b/.test(normalized),
    analyzeLink: /\bhttps?:\/\//.test(normalized) || /\burl\b/.test(normalized),
    ingestAssets: /\basset-folder\b/.test(normalized) || hasLocalPath,
    generateImage: /\b(image|visual|thumbnail|poster|copertina|cover|locandina|foto)\b/.test(normalized),
    generateVideo: /\b(reel|video|short|monta|edit|edita|capcut|pixelle|openmontage)\b/.test(normalized),
    publish: /\bpublish|pubblic[ao]|posta|metti online|schedule|programma\b/.test(normalized),
    iterate: /\b(itera|migliora|rifai|correggi|revision|feedback)\b/.test(normalized)
  };
}

function detectFormat(normalized, platforms, actions) {
  if (/\b(carousel|carosello)\b/.test(normalized)) return "carousel";
  if (/\b(reel|short)\b/.test(normalized)) return "reel";
  if (/\b(video)\b/.test(normalized)) return "video";
  if (/\b(thread|threads)\b/.test(normalized)) return "thread";
  if (/\b(reddit|subreddit)\b/.test(normalized)) return "reddit";
  if (/\b(tweet|tweets)\b/.test(normalized) || (platforms.includes("x") && !/\b(reel|video|image|carousel)\b/.test(normalized))) return "x";
  if (/\b(messaggio|message|dm|email|whatsapp)\b/.test(normalized)) return "message";
  if (/\b(post|caption|didascalia|copy|announcement|launch)\b/.test(normalized)) return "post";
  if (actions.generateImage && !platforms.length) return "image";
  if (actions.generateImage && platforms.some((p) => ["instagram", "facebook", "linkedin"].includes(p))) return "post";
  if (actions.create && platforms.length) return "post";
  return actions.create ? "content" : null;
}

function stepsForRoute(format, platforms, actions) {
  const steps = [...(FORMAT_STEPS[format] || FORMAT_STEPS.content)];
  const visualPlatform = platforms.some((p) => ["instagram", "facebook", "linkedin", "tiktok"].includes(p));
  const needsVisual = format === "image" || format === "carousel" || actions.generateImage || (visualPlatform && ["post", "content"].includes(format));
  const needsVideo = ["reel", "video"].includes(format) || actions.generateVideo;

  if ((actions.research || actions.analyzeLink) && !steps.includes("research")) steps.unshift("research");
  if (platforms.length && !steps.includes("platform")) steps.splice(Math.min(1, steps.length), 0, "platform");
  if (needsVisual && !steps.includes("visuals")) {
    const copyIndex = steps.indexOf("copy");
    steps.splice(copyIndex === -1 ? Math.max(steps.length - 1, 0) : copyIndex, 0, "visuals");
  }
  if (needsVideo && !steps.includes("video")) {
    const qaIndex = steps.indexOf("qa");
    steps.splice(qaIndex === -1 ? steps.length : qaIndex, 0, "video");
  }
  return [...new Set(steps)];
}

function confidenceForRoute({ format, platforms, actions, evidence }) {
  let confidence = 30;
  if (format) confidence += 20;
  if (platforms.length) confidence += 15;
  if (actions.create) confidence += 10;
  if (actions.analyzeLink || actions.ingestAssets) confidence += 10;
  if (evidence.length >= 3) confidence += 10;
  if (format === "content") confidence -= 10;
  return Math.max(10, Math.min(98, confidence));
}

function routeNaturalLanguage(input) {
  const normalized = normalizeText(input);
  const platforms = detectPlatforms(input, normalized);
  const actions = detectActions(normalized);
  const format = detectFormat(normalized, platforms, actions);
  const evidence = matchEvidence(normalized, [
    ["create-action", /\b(crea|creami|gener|genera|fammi|prepara|scrivi|produce|announcement|launch)\b/],
    ["post-format", /\b(post|caption|didascalia|announcement|launch)\b/],
    ["visual-request", /\b(image|visual|thumbnail|poster|copertina|cover|locandina|foto)\b/],
    ["video-request", /\b(reel|video|short|monta|edita|capcut)\b/],
    ["trend-research", /\b(trend|ricerca|reddit|x|twitter|competitor)\b/],
    ["external-link", /https?:\/\//],
    ["asset-folder", /\basset-folder\b/],
    ["publish-request", /\bpublish|pubblic[ao]|posta|schedule|programma\b/]
  ]);
  const steps = format ? stepsForRoute(format, platforms, actions) : [];
  const visualPlatforms = platforms.some((p) => ["instagram", "facebook", "linkedin", "tiktok"].includes(p));
  const needsVisual = Boolean(format && (steps.includes("visuals") || format === "image" || actions.generateImage || (visualPlatforms && actions.create)));
  const needsVideo = Boolean(format && (steps.includes("video") || ["reel", "video"].includes(format) || actions.generateVideo));
  const directImageOnly = format === "image" && actions.generateImage && !/\b(post|caption|announcement|launch|carousel|reel|video)\b/.test(normalized);
  const creativeWorkflow = Boolean(
    format &&
    (
      actions.ingestAssets ||
      needsVideo ||
      /\b(monta|edita|capcut|pixelle|openmontage|creative|orchestra)\b/.test(normalized) ||
      (actions.create && actions.research && /\b(reel|video|asset-folder|cartella|drive|trend|reddit|x|twitter)\b/.test(normalized))
    )
  );

  return {
    schemaVersion: "nlu-router.v1",
    original: String(input || ""),
    normalized,
    intent: {
      type: format,
      platforms,
      primaryPlatform: platforms[0] || null,
      agent: format ? (AGENT_BY_FORMAT[format] || AGENT_BY_FORMAT.content) : null,
      steps
    },
    actions,
    needs: {
      visual: needsVisual,
      video: needsVideo,
      linkAnalysis: actions.analyzeLink,
      assetIngestion: actions.ingestAssets,
      humanApproval: actions.publish || Boolean(format)
    },
    routing: {
      directImageOnly,
      creativeWorkflow,
      autoVisual: needsVisual && !directImageOnly && ["post", "carousel", "content"].includes(format),
      preset: /\b(story|cover|copertina|reel|verticale|9:16)\b/.test(normalized) ? "cover" : "square"
    },
    confidence: confidenceForRoute({ format, platforms, actions, evidence }),
    evidence
  };
}

function intentFromRoute(route) {
  if (!route || !route.intent || !route.intent.type) return null;
  return {
    type: route.intent.type,
    steps: route.intent.steps,
    agent: route.intent.agent,
    platforms: route.intent.platforms,
    confidence: route.confidence,
    route
  };
}

function routeNeedsAutoVisual(route) {
  return Boolean(route && route.routing && route.routing.autoVisual);
}

function routeWantsDirectImageGeneration(route) {
  return Boolean(route && route.routing && route.routing.directImageOnly);
}

function routeUsesCreativeWorkflow(route) {
  return Boolean(route && route.routing && route.routing.creativeWorkflow);
}

function visualPresetFromRoute(route) {
  return (route && route.routing && route.routing.preset) || "square";
}

function routeReportMarkdown(route) {
  return [
    "# Natural Language Router Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Schema: ${route.schemaVersion}`,
    `Confidence: ${route.confidence}%`,
    "",
    "## Intent",
    `- Type: ${route.intent.type || "none"}`,
    `- Platforms: ${route.intent.platforms.join(", ") || "none"}`,
    `- Agent: ${route.intent.agent || "none"}`,
    `- Steps: ${route.intent.steps.join(", ") || "none"}`,
    "",
    "## Needs",
    `- Visual: ${route.needs.visual ? "yes" : "no"}`,
    `- Video: ${route.needs.video ? "yes" : "no"}`,
    `- Link analysis: ${route.needs.linkAnalysis ? "yes" : "no"}`,
    `- Asset ingestion: ${route.needs.assetIngestion ? "yes" : "no"}`,
    `- Human approval: ${route.needs.humanApproval ? "yes" : "no"}`,
    "",
    "## Routing",
    `- Direct image only: ${route.routing.directImageOnly ? "yes" : "no"}`,
    `- Creative workflow: ${route.routing.creativeWorkflow ? "yes" : "no"}`,
    `- Auto visual: ${route.routing.autoVisual ? "yes" : "no"}`,
    `- Preset: ${route.routing.preset}`,
    "",
    "## Evidence",
    route.evidence.length ? route.evidence.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Normalized Request",
    route.normalized
  ].join("\n");
}

module.exports = {
  routeNaturalLanguage,
  intentFromRoute,
  routeNeedsAutoVisual,
  routeWantsDirectImageGeneration,
  routeUsesCreativeWorkflow,
  visualPresetFromRoute,
  routeReportMarkdown
};
