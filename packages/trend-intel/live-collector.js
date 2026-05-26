const fs = require("fs");
const path = require("path");
const { buildQueries, sourceLinksForQuery } = require("./research-engine");
const { fetchPublicText } = require("../workspace-runner/safe-ingestion");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeName(value) {
  return String(value || "source").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "source";
}

async function fetchText(url) {
  return fetchPublicText(url, { timeoutMs: 10000, maxBytes: 500000 });
}

function htmlTitle(html) {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || "";
  return title.replace(/\s+/g, " ").trim();
}

function htmlDescription(html) {
  const meta = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)
    || /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i.exec(html);
  return (meta?.[1] || "").replace(/\s+/g, " ").trim();
}

function extractTextSignals(html) {
  const title = htmlTitle(html);
  const description = htmlDescription(html);
  const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 8);
  return { title, description, headings };
}

function queryTerms(query) {
  const stop = new Set([
    "trend",
    "trends",
    "content",
    "ideas",
    "problems",
    "objections",
    "instagram",
    "reel",
    "reels",
    "hooks",
    "facebook",
    "linkedin",
    "twitter",
    "reddit",
    "subreddit",
    "community",
    "questions",
    "the",
    "and",
    "for",
    "with"
  ]);
  return String(query || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 3 && !stop.has(term));
}

function relevanceScore({ query, title, excerpt }) {
  const haystack = `${title || ""} ${excerpt || ""}`.toLowerCase();
  const terms = queryTerms(query);
  let score = terms.filter((term) => haystack.includes(term)).length;
  if (/\bnetworking\b|\bnetwork\b|\bevent\b|\bevents\b|\bprofessionals?\b|\bcorporate\b|\bfounder\b|\bvenue\b|\bticket\b|\bluma\b/.test(haystack)) {
    score += 1;
  }
  if (/\bnyc\b|\bnew york\b|\bmanhattan\b|\bbrooklyn\b/.test(haystack)) {
    score += 1;
  }
  return score;
}

function redditItems(json, query, url) {
  const children = json?.data?.children || [];
  return children.slice(0, 12).map((child) => {
    const data = child.data || {};
    const title = data.title || "Untitled Reddit result";
    const excerpt = data.selftext ? String(data.selftext).slice(0, 240) : `r/${data.subreddit || "unknown"} public discussion`;
    const score = relevanceScore({ query, title, excerpt });
    return {
      source: "reddit-public",
      query,
      title,
      excerpt,
      url: data.permalink ? `https://www.reddit.com${data.permalink}` : url,
      collectedAt: new Date().toISOString(),
      risk: "medium",
      confidence: score >= 4 || data.score > 25 ? "medium" : "low",
      relevanceScore: score,
      observationType: "public-discussion"
    };
  }).filter((item) => item.relevanceScore >= 3);
}

function htmlItem({ source, query, url, html, risk = "low" }) {
  const signals = extractTextSignals(html);
  return {
    source,
    query,
    title: signals.title || signals.headings[0] || url,
    excerpt: signals.description || signals.headings.join(" | ") || "Public page snapshot collected; manual review recommended.",
    url,
    collectedAt: new Date().toISOString(),
    risk,
    confidence: signals.title || signals.description ? "medium" : "low",
    relevanceScore: relevanceScore({ query, title: signals.title, excerpt: signals.description || signals.headings.join(" ") }),
    observationType: "public-page"
  };
}

function projectLinkItems(projectLinks) {
  return (projectLinks.links || []).map((link) => ({
    source: `project-link:${link.kind || "reference"}`,
    query: link.note || link.kind || "project link",
    title: link.note || link.url,
    excerpt: "User-provided source. Review manually and use as high-context project evidence.",
    url: link.url,
    collectedAt: new Date().toISOString(),
    risk: ["instagram", "facebook", "linkedin", "x", "twitter", "reddit"].includes(link.kind) ? "medium" : "low",
    confidence: "medium",
    observationType: "user-provided-source"
  }));
}

async function collectLiveTrends({ workspaceRoot, brief, projectLinks = {}, maxQueries = 4, delayMs = 1200 }) {
  const snapshotDir = path.join(workspaceRoot, "research/source-snapshots");
  ensureDir(snapshotDir);
  const queries = buildQueries(brief).slice(0, maxQueries);
  const items = projectLinkItems(projectLinks);
  const failures = [];

  for (const query of queries) {
    const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=8&sort=relevance`;
    try {
      const result = await fetchText(redditUrl);
      fs.writeFileSync(path.join(snapshotDir, `${safeName(`reddit-${query}`)}.json`), result.text);
      if (result.ok) {
        items.push(...redditItems(JSON.parse(result.text), query, redditUrl));
      } else {
        failures.push({ source: "reddit-public", query, url: redditUrl, status: result.status });
      }
    } catch (error) {
      failures.push({ source: "reddit-public", query, url: redditUrl, error: error.message });
    }
    await sleep(delayMs);

    for (const link of sourceLinksForQuery(query).filter((candidate) => candidate.source !== "reddit-public").slice(0, 2)) {
      try {
        const result = await fetchText(link.url);
        fs.writeFileSync(path.join(snapshotDir, `${safeName(`${link.source}-${query}`)}.html`), result.text);
        if (result.ok) {
          const item = htmlItem({
            source: link.source,
            query,
            url: result.finalUrl || link.url,
            html: result.text,
            risk: link.source.includes("youtube") ? "medium" : "low"
          });
          if (item.relevanceScore >= 2) {
            items.push(item);
          } else {
            failures.push({
              source: link.source,
              query,
              url: link.url,
              status: "low-relevance-snapshot",
              relevanceScore: item.relevanceScore
            });
          }
        } else {
          failures.push({ source: link.source, query, url: link.url, status: result.status });
        }
      } catch (error) {
        failures.push({ source: link.source, query, url: link.url, error: error.message });
      }
      await sleep(delayMs);
    }
  }

  const report = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    mode: "live-public-sources",
    maxQueries,
    items,
    failures,
    guardrails: [
      "Public sources only; no login, no account automation, no DM/comment/like/follow actions.",
      "X and Reddit are research/draft inputs only here; no replies, votes, follows, DMs, or auto-posting.",
      "Reddit observations require subreddit-rule review before they become publishable recommendations.",
      "Use collected items as directional trend intelligence, not proof.",
      "Cite source URLs and collection dates.",
      "Separate observation from inference."
    ]
  };
  return report;
}

function liveTrendMarkdown(report) {
  return `# Live Trend Research Report

Generated at: ${report.generatedAt}

Mode: ${report.mode}

## Guardrails
${report.guardrails.map((item) => `- ${item}`).join("\n")}

## Trend Items
${report.items.map((item, index) => `### ${index + 1}. ${item.title}
- Source: ${item.source}
- Query: ${item.query}
- Risk: ${item.risk}
- Confidence: ${item.confidence}
- Relevance score: ${item.relevanceScore ?? "-"}
- Collected: ${item.collectedAt}
- URL: ${item.url}
- Observation: ${item.excerpt}
- Inference: Use as directional audience/context signal only; validate before turning into claims.
`).join("\n") || "- No live items collected."}

## Collection Failures
${report.failures.map((failure) => `- ${failure.source} / ${failure.query || "-"} / ${failure.url || "-"} / ${failure.status || failure.error}`).join("\n") || "- None."}
`;
}

function writeLiveTrendReport({ workspaceRoot, report }) {
  const researchDir = path.join(workspaceRoot, "research");
  ensureDir(researchDir);
  fs.writeFileSync(path.join(researchDir, "trend-items.json"), `${JSON.stringify(report.items, null, 2)}\n`);
  fs.writeFileSync(path.join(researchDir, "live-trend-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(researchDir, "live-trend-report.md"), liveTrendMarkdown(report));
}

module.exports = { collectLiveTrends, liveTrendMarkdown, writeLiveTrendReport };
