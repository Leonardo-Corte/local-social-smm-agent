#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const { skillCardMarkdown } = require("../../../packages/agents/skill-adapter");
const { buildModelRoutingReport, modelRoutingMarkdown } = require("../../../packages/model-router/detect-profile");
const { simulateDrafts, simulationMarkdown } = require("../../../packages/persona-sim/persona-engine");
const { buildTrendReport, reportMarkdown } = require("../../../packages/trend-intel/research-engine");
const {
  buildPlatformPlaybooks,
  platformPlaybooksMarkdown
} = require("../../../packages/platform-intel/platform-playbooks");

const root = path.resolve(__dirname, "../../..");
const version = "0.1.0";

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function detectHardwareProfile(modelProfiles, modelCatalog) {
  return buildModelRoutingReport(modelProfiles, modelCatalog);
}

function sampleBrief() {
  return {
    ...readJson("workspaces/sample-briefs/local-social-team.json"),
    createdAt: new Date().toISOString()
  };
}

function briefFromFile(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return {
    ...JSON.parse(fs.readFileSync(absolutePath, "utf8")),
    createdAt: new Date().toISOString()
  };
}

function agentMarkdown(agent, brief) {
  return `# ${agent.name}

## Mission
${agent.mission}

## Project Context
- Project: ${brief.projectName}
- Niche: ${brief.niche}
- Target: ${brief.targetAudience}
- 30-day goal: ${brief.primaryGoal30Days}
- Tone: ${brief.tone}

## Inputs
${agent.inputs.map((item) => `- ${item}`).join("\n")}

## Outputs
${agent.outputs.map((item) => `- ${item}`).join("\n")}

## Allowed Tools
${agent.tools.map((item) => `- ${item}`).join("\n")}

## Quality Checks
${agent.qualityChecks.map((item) => `- ${item}`).join("\n")}

## Escalation Rules
${agent.escalationRules.map((item) => `- ${item}`).join("\n")}
${agent.customSection ? `\n${agent.customSection}` : ""}`;
}

function sourceRegistryMarkdown(sourceRegistry) {
  const rows = sourceRegistry.sources.map((source) => {
    return `| ${source.name} | ${source.risk} | ${source.method} | ${source.allowedUse} | ${source.refreshCadence} |`;
  });
  return `# Source Registry

| Source | Risk | Method | Allowed Use | Refresh |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function contentCalendarMarkdown(brief) {
  const formats = ["Reel", "Carousel", "Static post", "Story sequence", "Facebook post"];
  const pillars = ["Problem awareness", "Proof/credibility", "Education", "Behind the scenes", "Offer/CTA"];
  const rows = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const format = formats[index % formats.length];
    const pillar = pillars[index % pillars.length];
    return `| ${day} | ${pillar} | ${format} | ${brief.niche} angle ${day} | Draft then human review |`;
  });
  return `# 30-Day Content Calendar

Goal: ${brief.primaryGoal30Days}

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function initialPostsMarkdown(brief) {
  return `# Draft Posts

## Post 1
Hook: Stop paying for a social stack before your content system is even working.

Body: ${brief.targetAudience} need a repeatable local-first workflow: strategy, drafts, review, and publishing discipline before more SaaS.

CTA: Save this and review your current content workflow.
`;
}

function createWorkspace(brief) {
  const agents = readJson("packages/agents/registry/agents.json");
  const socialSkills = readJson("packages/agents/registry/social-skills.json");
  const nativeSkills = readJson("packages/agents/registry/native-skills.json");
  const allSkills = [...socialSkills.skills, ...nativeSkills.skills];
  const modelProfiles = readJson("packages/model-router/profiles/model-profiles.json");
  const sourceRegistry = readJson("packages/trend-intel/registries/source-registry.json");
  const publishingPolicy = readJson("packages/publishing/policies/publishing-policy.json");
  const reviewRubric = readJson("packages/review-loop/rubrics/workspace-quality-rubric.json");
  const modelCatalog = readJson("packages/model-router/model-catalog.json");
  const modelRoutingReport = detectHardwareProfile(modelProfiles, modelCatalog);
  const modelProfile = modelRoutingReport.profile;
  const trendReport = buildTrendReport(brief, sourceRegistry);
  const initialPosts = initialPostsMarkdown(brief);
  const personaSimulation = simulateDrafts(brief, initialPosts);
  const slug = slugify(brief.projectName);
  const workspaceRoot = workspacePaths(root, slug).generated;

  ensureDir(workspaceRoot);

  const manifest = {
    generatorVersion: version,
    workspaceSlug: slug,
    projectName: brief.projectName,
    generatedAt: new Date().toISOString(),
    modelProfile: modelProfile.id,
    approvalMode: publishingPolicy.mode,
    automaticPublishEnabled: false,
    riskyAutomationEnabled: false,
    requiredHumanApproval: true,
    agentCount: agents.length
  };

  writeFile(path.join(workspaceRoot, "workspace-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "project-brief.json"), `${JSON.stringify(brief, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "model-profile.json"), `${JSON.stringify(modelProfile, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "model-routing-report.json"), `${JSON.stringify(modelRoutingReport, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "model-routing-report.md"), modelRoutingMarkdown(modelRoutingReport));
  writeFile(path.join(workspaceRoot, "policy/publishing-policy.json"), `${JSON.stringify(publishingPolicy, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "review/workspace-quality-rubric.json"), `${JSON.stringify(reviewRubric, null, 2)}\n`);

  for (const agent of agents) {
    writeFile(path.join(workspaceRoot, "agents", `${agent.id}.md`), agentMarkdown(agent, brief));
  }

  for (const skill of allSkills) {
    writeFile(path.join(workspaceRoot, "skills", `${skill.id}.md`), skillCardMarkdown(skill));
  }
  writeFile(path.join(workspaceRoot, "skills/skill-map.md"), `# Skill Map

${agents.map((agent) => {
  const mapped = allSkills.filter((skill) => skill.targetAgents.includes(agent.id));
  return `## ${agent.name}
${mapped.length > 0 ? mapped.map((skill) => `- ${skill.id}`).join("\n") : "- No adapted social skills mapped yet."}`;
}).join("\n\n")}
`);

  writeFile(path.join(workspaceRoot, "sources/source-registry.md"), sourceRegistryMarkdown(sourceRegistry));
  const platformPlaybooks = buildPlatformPlaybooks(workspaceRoot);
  writeFile(path.join(workspaceRoot, "platforms/platform-playbooks.json"), `${JSON.stringify(platformPlaybooks, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "platforms/platform-playbooks.md"), platformPlaybooksMarkdown(platformPlaybooks));
  writeFile(path.join(workspaceRoot, "operations/task-plan.md"), `# Workspace Task Plan

## Phase 1: Clarify
- [ ] Review project brief.
- [ ] Confirm niche, target, offer, tone, assets, and constraints.
- [ ] Confirm approval owner.

## Phase 2: Research
- [ ] Collect low/medium-risk trend sources.
- [ ] Build competitor and creator watchlists.
- [ ] Produce trend report with citations and confidence labels.

## Phase 3: Produce
- [ ] Finalize content pillars.
- [ ] Generate 30-day calendar.
- [ ] Draft posts, carousels, reels, stories, and visual briefs.

## Phase 4: Review
- [ ] Run Critic/QA recap.
- [ ] Run persona simulation.
- [ ] Convert weaknesses into regeneration tasks.

## Phase 5: Approve and Publish
- [ ] Human approves each artifact.
- [ ] Publishing operator prepares export/checklist.
- [ ] Account-facing actions stay blocked until explicitly approved.
`);
  writeFile(path.join(workspaceRoot, "research/trend-research-plan.json"), `${JSON.stringify(trendReport, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "research/trend-report.md"), reportMarkdown(trendReport));
  writeFile(path.join(workspaceRoot, "strategy/content-pillars.md"), `# Content Pillars

${(brief.templatePillars && brief.templatePillars.length > 0
  ? brief.templatePillars
  : [
    `Pain points and problem awareness for ${brief.targetAudience}`,
    `Practical education around ${brief.niche}`,
    "Proof, trust, and behind-the-scenes credibility",
    "Offer-led content with human-approved CTAs",
    "Community questions, objections, and feedback loops"
  ]).map((pillar, index) => `${index + 1}. ${pillar}.`).join("\n")}
`);
  writeFile(path.join(workspaceRoot, "calendar/30-day-calendar.md"), contentCalendarMarkdown(brief));
  writeFile(path.join(workspaceRoot, "drafts/posts.md"), initialPosts);
  writeFile(path.join(workspaceRoot, "drafts/carousels.md"), `# Carousel Drafts

## Carousel 1: The Local-First Social Team
1. Your content workflow should not start with another subscription.
2. Start with niche, target, offer, and constraints.
3. Turn that into agents, calendars, drafts, and reviews.
4. Keep approval human.
5. Iterate from feedback until the workspace fits.
`);
  writeFile(path.join(workspaceRoot, "drafts/reels.md"), `# Reel Scripts

## Reel 1
Opening: "Before you automate Instagram, automate your thinking."
Beat 1: Show messy notes.
Beat 2: Show interview-to-workspace flow.
Beat 3: Show calendar and drafts.
CTA: "Want the checklist? Comment after human review only."
`);
  writeFile(path.join(workspaceRoot, "creative/visual-briefs.md"), `# Visual Briefs

## Brief 1
Style: clean professional interface, local-first AI workspace, visible calendar and agent roles.
Model route: ${modelProfile.imageModelTier}
Text guidance: use Qwen-Image candidate for text-heavy graphics when available.
`);
  writeFile(path.join(workspaceRoot, "publishing/publishing-checklist.md"), `# Publishing Checklist

- [ ] Human approved this specific draft.
- [ ] Claims are checked.
- [ ] Assets are present.
- [ ] Platform format is correct.
- [ ] No DM/comment/like/follow automation.
- [ ] No X reply/DM/follow/like automation.
- [ ] No Reddit posting/commenting/voting/DM automation.
- [ ] Reddit subreddit rules checked if Reddit is targeted.
- [ ] No bypass or prohibited collection.
- [ ] Account permission confirmed.

Default: do not publish automatically.
`);
  writeFile(path.join(workspaceRoot, "simulation/persona-report.json"), `${JSON.stringify(personaSimulation, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "simulation/persona-report.md"), simulationMarkdown(personaSimulation));
  writeFile(path.join(workspaceRoot, "review/qa-recap.md"), `# QA Recap

## Passes
- Workspace has agent roles, calendar, drafts, visual briefs, source registry, publishing checklist, persona report, and memory.
- Publishing is human-approved by default.

## Not Good Enough Yet
- Research is placeholder-level until live trend collection is implemented.
- Draft content is sample quality, not final campaign quality.
- Model routing is profile-based, not full benchmark-based.

## Regeneration Tasks
- Replace sample research with sourced trend report.
- Generate brand-specific variants after real user interview.
- Run persona simulation with actual target segments.
`);
  writeFile(path.join(workspaceRoot, "memory/user-feedback.md"), `# User Feedback Memory

Store human feedback here. Each item should include:
- Date
- Artifact
- Feedback
- Preference learned
- Regeneration target
`);
  writeFile(path.join(workspaceRoot, "memory/preferences.json"), `${JSON.stringify({ preferences: [], rejectedPatterns: [], approvedPatterns: [] }, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "memory/regeneration-queue.json"), `${JSON.stringify({ tasks: [] }, null, 2)}\n`);
  writeFile(path.join(workspaceRoot, "review/regeneration-log.md"), "# Regeneration Log\n");

  return workspaceRoot;
}

function check() {
  const jsonFiles = [
    "packages/agents/registry/agents.json",
    "packages/agents/registry/native-skills.json",
    "packages/agents/registry/social-skills.json",
    "packages/interview-engine/question-bank.json",
    "packages/model-router/model-catalog.json",
    "packages/model-router/profiles/model-profiles.json",
    "packages/repo-auditor/candidates.json",
    "packages/trend-intel/registries/source-registry.json",
    "packages/publishing/policies/publishing-policy.json",
    "packages/review-loop/rubrics/workspace-quality-rubric.json",
    "workspaces/sample-briefs/local-social-team.json"
  ];
  for (const file of jsonFiles) {
    readJson(file);
  }
  console.log(`OK parsed ${jsonFiles.length} registry files`);
}

function main() {
  const rawArgs = process.argv.slice(2);
  const args = new Set(rawArgs);
  if (args.has("--check")) {
    check();
    return;
  }
  let brief;
  const briefIndex = rawArgs.indexOf("--brief");
  if (briefIndex !== -1) {
    const briefPath = rawArgs[briefIndex + 1];
    if (!briefPath) {
      console.error("Missing value for --brief");
      process.exit(2);
    }
    brief = briefFromFile(briefPath);
  } else if (args.has("--sample")) {
    brief = sampleBrief();
  } else {
    console.error("Usage: node apps/workspace-generator/bin/generate-workspace.js --sample");
    console.error("   or: node apps/workspace-generator/bin/generate-workspace.js --brief path/to/brief.json");
    process.exit(2);
  }
  const workspaceRoot = createWorkspace(brief);
  console.log(`Created workspace: ${path.relative(root, workspaceRoot)}`);
}

main();
