const fs = require("fs");
const path = require("path");

function readText(workspaceRoot, relativePath) {
  const filePath = path.join(workspaceRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(workspaceRoot, relativePath, fallback) {
  const filePath = path.join(workspaceRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function scoreText(text, patterns) {
  const haystack = String(text || "").toLowerCase();
  return patterns.reduce((score, pattern) => score + (pattern.test(haystack) ? 1 : 0), 0);
}

function evaluateCreativePerformance(workspaceRoot) {
  const posts = readText(workspaceRoot, "drafts/posts.md");
  const reels = readText(workspaceRoot, "drafts/reels.md");
  const carousels = readText(workspaceRoot, "drafts/carousels.md");
  const liveTrends = readText(workspaceRoot, "research/live-trend-report.md");
  const trendPlan = readText(workspaceRoot, "research/trend-report.md");
  const assetLibrary = readJson(workspaceRoot, "assets/asset-library.json", { assets: [] });
  const capcutPlan = readText(workspaceRoot, "creative/capcut-plan.md");
  const corpus = [posts, reels, carousels].join("\n\n");

  const dimensions = [
    {
      id: "hook-strength",
      label: "Hook strength",
      score: Math.min(20, scoreText(corpus, [/\bhook\b/, /\bfirst\b|\bprimi\b/, /\b3 seconds?\b|\btre secondi\b/, /\bscroll\b/, /\bnot another\b/]) * 4),
      max: 20,
      recommendation: "Lead every reel/post with a concrete contrast, tension, or visual proof moment."
    },
    {
      id: "platform-fit",
      label: "Platform fit",
      score: Math.min(20, scoreText(corpus, [/\binstagram\b/, /\bfacebook\b/, /\blinkedin\b/, /\bx\b|\btwitter\b/, /\breddit\b/, /\bplatform\b/]) * 3),
      max: 20,
      recommendation: "Keep platform-specific variants separate; do not reuse Instagram captions on X/Reddit unchanged."
    },
    {
      id: "trend-context",
      label: "Trend/context grounding",
      score: liveTrends.length > 300 ? 18 : trendPlan.length > 300 ? 12 : 4,
      max: 20,
      recommendation: "Run live trend research when preparing multiple reels from fresh assets."
    },
    {
      id: "asset-grounding",
      label: "Asset grounding",
      score: Math.min(20, (assetLibrary.assets || []).length * 4 + (capcutPlan ? 6 : 0)),
      max: 20,
      recommendation: "Use the asset library and CapCut plan as the proof layer before writing claims."
    },
    {
      id: "approval-safety",
      label: "Approval safety",
      score: scoreText(corpus, [/\bapproval\b|\bapprov/, /\bconfirm\b|\bconferma/, /\bdo not invent\b|\bnon invent/]) >= 2 ? 20 : 10,
      max: 20,
      recommendation: "Keep missing facts as approval blockers, especially ticket details, venue, guests, and numbers."
    }
  ];

  const score = dimensions.reduce((sum, item) => sum + item.score, 0);
  const maxScore = dimensions.reduce((sum, item) => sum + item.max, 0);
  const status = score >= 85 ? "strong_candidate_for_human_review" : score >= 65 ? "needs_iteration" : "weak_needs_rework";

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    status,
    dimensions,
    requiredHumanApproval: true,
    automaticPublishEnabled: false,
    nextActions: dimensions
      .filter((item) => item.score < item.max * 0.75)
      .map((item) => item.recommendation)
  };
}

function performanceMarkdown(report) {
  return `# Creative Performance Review

Generated at: ${report.generatedAt}

Status: ${report.status}

Score: ${report.score}/${report.maxScore} (${report.percentage}%)

Human approval required: yes

Automatic publishing: disabled

## Dimensions
${report.dimensions.map((item) => `### ${item.label}
- Score: ${item.score}/${item.max}
- Recommendation: ${item.recommendation}
`).join("\n")}

## Next Actions
${report.nextActions.map((item) => `- ${item}`).join("\n") || "- Ready for human review."}
`;
}

function writePerformanceReview(workspaceRoot, report) {
  const reviewDir = path.join(workspaceRoot, "review");
  fs.mkdirSync(reviewDir, { recursive: true });
  const jsonPath = path.join(reviewDir, "creative-performance-review.json");
  const mdPath = path.join(reviewDir, "creative-performance-review.md");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, performanceMarkdown(report));
  return { jsonPath, mdPath };
}

module.exports = {
  evaluateCreativePerformance,
  performanceMarkdown,
  writePerformanceReview
};
