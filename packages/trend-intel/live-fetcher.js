const https = require("https");
const fs = require("fs");
const path = require("path");

const ALLOWED_HOSTS = new Set([
  "hn.algolia.com",
  "www.reddit.com",
  "reddit.com",
  "www.producthunt.com",
  "producthunt.com"
]);

const DEFAULT_SUBREDDITS = ["entrepreneur", "SideProject", "AITools", "Productivity"];
const HN_ALGOLIA = "https://hn.algolia.com/api/v1/search";
const PRODUCT_HUNT_RSS = "https://www.producthunt.com/feed";

function httpsGet(url, { timeoutMs = 15000, maxBytes = 500000 } = {}) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { return reject(new Error(`Invalid URL: ${url}`)); }

    if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
      return reject(new Error(`SSRF block: host ${parsedUrl.hostname} not in allowlist`));
    }

    https.get(url, { timeout: timeoutMs }, (res) => {
      const chunks = [];
      let total = 0;
      res.on("data", (chunk) => {
        total += chunk.length;
        if (total > maxBytes) { res.destroy(); return reject(new Error("Response too large")); }
        chunks.push(chunk);
      });
      res.on("end", () => resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString("utf8") }));
      res.on("error", reject);
    }).on("error", reject).on("timeout", function () { this.destroy(); reject(new Error("Timeout")); });
  });
}

function parseRssItems(xml) {
  const items = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];
    const title = (/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i.exec(block) || /<title[^>]*>([\s\S]*?)<\/title>/i.exec(block))?.[1]?.trim() || "";
    const link = (/<link>([\s\S]*?)<\/link>/i.exec(block))?.[1]?.trim() || "";
    const desc = (/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i.exec(block) || /<description[^>]*>([\s\S]*?)<\/description>/i.exec(block))?.[1]?.trim() || "";
    const pubDate = (/<pubDate>([\s\S]*?)<\/pubDate>/i.exec(block))?.[1]?.trim() || "";
    if (title && link) items.push({ title, link, description: desc.replace(/<[^>]+>/g, " ").slice(0, 300), pubDate });
  }
  return items;
}

async function fetchRedditRss(subreddit) {
  const url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}.rss?limit=10`;
  const res = await httpsGet(url);
  if (res.status !== 200) return [];
  const items = parseRssItems(res.text);
  return items.map((item) => ({
    source: `reddit/r/${subreddit}`,
    type: "reddit-rss",
    title: item.title,
    url: item.link,
    excerpt: item.description.slice(0, 200),
    collectedAt: new Date().toISOString(),
    risk: "low",
    confidence: "low"
  }));
}

async function fetchHackerNews(query, { numResults = 8 } = {}) {
  const url = `${HN_ALGOLIA}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${numResults}&numericFilters=points>5`;
  const res = await httpsGet(url);
  if (res.status !== 200) return [];
  let parsed;
  try { parsed = JSON.parse(res.text); } catch { return []; }
  return (parsed.hits || []).map((hit) => ({
    source: "hacker-news",
    type: "hn-story",
    title: hit.title || "",
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    excerpt: `Points: ${hit.points || 0} | Comments: ${hit.num_comments || 0}`,
    collectedAt: new Date().toISOString(),
    risk: "low",
    confidence: "medium"
  })).filter((item) => item.title);
}

async function fetchProductHuntRss() {
  try {
    const res = await httpsGet(PRODUCT_HUNT_RSS);
    if (res.status !== 200) return [];
    const items = parseRssItems(res.text);
    return items.slice(0, 10).map((item) => ({
      source: "product-hunt",
      type: "ph-launch",
      title: item.title,
      url: item.link,
      excerpt: item.description.slice(0, 200),
      collectedAt: new Date().toISOString(),
      risk: "low",
      confidence: "medium"
    }));
  } catch {
    return [];
  }
}

async function fetchLiveTrends({ topics = [], subreddits, includeHN = true, includePH = true } = {}) {
  const resolvedSubreddits = subreddits || DEFAULT_SUBREDDITS;
  const resolvedTopics = topics.length > 0 ? topics : ["AI tools", "content creation", "local AI"];

  const fetches = [];

  for (const sub of resolvedSubreddits.slice(0, 4)) {
    fetches.push(fetchRedditRss(sub).catch(() => []));
  }

  if (includeHN) {
    for (const topic of resolvedTopics.slice(0, 2)) {
      fetches.push(fetchHackerNews(topic).catch(() => []));
    }
  }

  if (includePH) {
    fetches.push(fetchProductHuntRss().catch(() => []));
  }

  const nested = await Promise.all(fetches);
  const items = nested.flat();

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    mode: "rss-and-public-api",
    topics: resolvedTopics,
    subreddits: resolvedSubreddits,
    itemCount: items.length,
    items,
    guardrails: [
      "Public RSS and public APIs only. No login, no automation.",
      "Use as directional trend signals only — not as proof or claims.",
      "Cite source URLs and collection dates in any published content.",
      "Do not auto-post, comment, vote, or reply on any platform."
    ]
  };
}

function liveFetcherMarkdown(report) {
  const bySource = {};
  for (const item of report.items) {
    if (!bySource[item.source]) bySource[item.source] = [];
    bySource[item.source].push(item);
  }

  const lines = [
    `# Live Trend Intelligence`,
    ``,
    `Generated: ${report.generatedAt}`,
    `Mode: ${report.mode}`,
    `Topics: ${report.topics.join(", ")}`,
    `Total items: ${report.itemCount}`,
    ``,
    `> ${report.guardrails[0]}`,
    ``
  ];

  for (const [source, items] of Object.entries(bySource)) {
    lines.push(`## ${source} (${items.length} items)`);
    lines.push(``);
    for (const item of items.slice(0, 8)) {
      lines.push(`### ${item.title}`);
      lines.push(`- URL: ${item.url}`);
      lines.push(`- ${item.excerpt}`);
      lines.push(`- Collected: ${item.collectedAt}`);
      lines.push(``);
    }
  }

  return lines.join("\n");
}

async function runLiveFetcher({ workspaceRoot, topics, subreddits, includeHN, includePH }) {
  const report = await fetchLiveTrends({ topics, subreddits, includeHN, includePH });
  const researchDir = path.join(workspaceRoot, "research");
  fs.mkdirSync(researchDir, { recursive: true });
  fs.writeFileSync(path.join(researchDir, "live-trend-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(researchDir, "live-trend-report.md"), liveFetcherMarkdown(report));
  return report;
}

module.exports = { fetchLiveTrends, fetchRedditRss, fetchHackerNews, fetchProductHuntRss, runLiveFetcher, liveFetcherMarkdown };
