const fs = require("fs");
const path = require("path");
const { heuristicScore } = require("./consensus-orchestrator");

const FIXTURES = [
  {
    id: "networking-reel",
    request: "Create a reel for a premium NYC networking event.",
    oldDraft: "Join our networking event. Tickets available now.",
    consensusDraft: "Hook: The best NYC connections rarely happen in another Zoom call.\nDraft: A short event recap built around real conversations, warm venue energy, and a clear RSVP CTA.\nCTA: Join the next Out Of Office dinner.\nApproval risks: verify date, venue, ticket inclusions, and attendee claims.\nPlatform: Instagram reel."
  },
  {
    id: "reddit-post",
    request: "Create a Reddit-safe discussion post about networking in NYC.",
    oldDraft: "Buy tickets to our networking event.",
    consensusDraft: "Hook: NYC people who actually like networking, what makes an event feel worth showing up to?\nDraft: Community-first question, no hard sell, asks for pain points and preferences.\nCTA: Invite discussion only.\nApproval risks: check subreddit rules and remove promotional links unless allowed.\nPlatform: Reddit."
  }
];

function runConsensusBenchmark() {
  const cases = FIXTURES.map((fixture) => {
    const oldScore = heuristicScore(fixture.oldDraft);
    const consensusScore = heuristicScore(fixture.consensusDraft);
    return {
      id: fixture.id,
      request: fixture.request,
      oldScore,
      consensusScore,
      delta: consensusScore - oldScore,
      winner: consensusScore >= oldScore ? "consensus" : "old"
    };
  });
  return {
    generatedAt: new Date().toISOString(),
    status: cases.every((item) => item.winner === "consensus" && item.delta > 0) ? "passed" : "review",
    cases,
    notes: [
      "This is a deterministic heuristic benchmark, not a replacement for human quality review.",
      "Use it to catch regressions in basic output structure: hook, CTA, platform fit, approval risks."
    ]
  };
}

function consensusBenchmarkMarkdown(report) {
  return `# Consensus Benchmark

Generated: ${report.generatedAt}

Status: ${report.status}

## Cases
${report.cases.map((item) => `- ${item.id}: old ${item.oldScore}/100, consensus ${item.consensusScore}/100, delta ${item.delta}, winner ${item.winner}`).join("\n")}

## Notes
${report.notes.map((item) => `- ${item}`).join("\n")}
`;
}

function writeConsensusBenchmark(root) {
  const report = runConsensusBenchmark();
  const outDir = path.join(root, "docs/benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "consensus-benchmark.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "consensus-benchmark.md"), consensusBenchmarkMarkdown(report));
  return report;
}

module.exports = { consensusBenchmarkMarkdown, runConsensusBenchmark, writeConsensusBenchmark };
