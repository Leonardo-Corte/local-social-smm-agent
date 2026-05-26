#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { buildTrendReport, reportMarkdown } = require("../../../packages/trend-intel/research-engine");
const { collectLiveTrends, writeLiveTrendReport } = require("../../../packages/trend-intel/live-collector");
const { runLiveFetcher } = require("../../../packages/trend-intel/live-fetcher");

const root = path.resolve(__dirname, "../../..");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

async function main() {
  const args = process.argv.slice(2);
  const workspace = args[0] || "sample-local-social-team";
  const workspaceRoot = workspacePaths(root, workspace).generated;
  if (!fs.existsSync(workspaceRoot)) {
    console.error(`Workspace not found: ${workspace}`);
    process.exit(1);
  }

  const brief = readJson(path.join(workspaceRoot, "project-brief.json"));
  const businessProfilePath = path.join(workspaceRoot, "business/business-profile.json");
  const businessProfile = fs.existsSync(businessProfilePath) ? readJson(businessProfilePath) : {};
  const researchBrief = { ...brief, ...businessProfile };
  const sourceRegistry = readJson(path.join(root, "packages/trend-intel/registries/source-registry.json"));
  const report = buildTrendReport(researchBrief, sourceRegistry);

  fs.mkdirSync(path.join(workspaceRoot, "research"), { recursive: true });
  fs.writeFileSync(path.join(workspaceRoot, "research/trend-research-plan.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(workspaceRoot, "research/trend-report.md"), reportMarkdown(report));

  console.log(`Wrote trend research plan for ${workspace}: ${report.tasks.length} tasks`);
  if (args.includes("--live")) {
    const projectLinksPath = path.join(workspaceRoot, "sources/project-links.json");
    const projectLinks = fs.existsSync(projectLinksPath) ? readJson(projectLinksPath) : { links: [] };
    const maxQueries = valueAfter(args, "--max-queries") ? Number(valueAfter(args, "--max-queries")) : 4;

    if (args.includes("--rss")) {
      const niche = brief.niche || researchBrief.niche || "";
      const topics = niche ? [niche, "AI tools", "content creation"] : ["AI tools", "content creation", "local-first"];
      console.log("Fetching RSS + HN + Product Hunt trends...");
      const rssReport = await runLiveFetcher({ workspaceRoot, topics });
      console.log(`Wrote live-trend-report.md: ${rssReport.itemCount} items (${Object.keys(rssReport.items.reduce((a, i) => { a[i.source] = 1; return a; }, {})).length} sources)`);
    } else {
      const liveReport = await collectLiveTrends({ workspaceRoot, brief: researchBrief, projectLinks, maxQueries });
      writeLiveTrendReport({ workspaceRoot, report: liveReport });
      console.log(`Wrote live trend report for ${workspace}: ${liveReport.items.length} items, ${liveReport.failures.length} failures`);
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
