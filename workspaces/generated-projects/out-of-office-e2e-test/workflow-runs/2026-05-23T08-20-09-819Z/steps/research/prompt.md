# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Market Researcher

## Mission
Research trends, competitors, creators, formats, objections, hashtags, and content gaps.

## Project Context
- Project: Out Of Office E2E Test
- Niche: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City
- Target: corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe
- 30-day goal: generate high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events
- Tone: social, polished, energetic, witty, aspirational but not fake

## Inputs
- project brief
- source registry

## Outputs
- trend-report.md
- competitor-map.md
- content-opportunities.md

## Allowed Tools
- trend-intel
- browser-research

## Quality Checks
- sources are cited
- source risk is labeled
- claims are separated from inference

## Escalation Rules
- Do not use high-risk sources without explicit review.


## Project Brief
```json
{
  "projectName": "Out Of Office E2E Test",
  "niche": "premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City",
  "targetAudience": "corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe",
  "primaryGoal30Days": "generate high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events",
  "offer": "fun, curated networking events in New York where interesting people meet through a social hospitality experience; sell event tickets and grow the community around the Out Of Office brand",
  "tone": "social, polished, energetic, witty, aspirational but not fake",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers or guest identities",
    "keep the brand premium",
    "social"
  ],
  "availableAssets": [
    "photos",
    "videos",
    "website",
    "Luma event pages",
    "past event notes",
    "competitor reference Post Office Roma"
  ],
  "approvalPolicy": "Leonardo Corte, Ludovico Margio, or Cristian Google must approve before publishing",
  "createdAt": "2026-05-23T08:19:58.835Z"
}

```

## Model Routing Context
# Model Routing Report

Profile: Apple Silicon Pro/Max

Policy: software-only no-cost; quality depends on local hardware and installed backends

## Detected Signals
- platform:darwin
- arch:arm64
- memoryGb:18

## Local Backend Probes
| Backend | Available | Command |
| --- | --- | --- |
| Ollama | no | - |
| MLX LM | no | - |
| llama.cpp | yes | llama-cli |
| vLLM | no | - |
| ComfyUI | no | - |
| NVIDIA SMI | no | - |

## Text Models

### Frontier local reasoning/copy tier
- Role: strategy, critique, long-form copy, persona simulation
- Candidate tier: quantized 14B-32B+ open-weight instruct/reasoning model
- Backend fit: ollama:missing, mlx:missing, llama.cpp:available, vllm:missing
- License posture: audit exact checkpoint before download
- Notes: Use for strategist, critic, copywriter, and persona-simulation passes when RAM/VRAM allows.

### Fast local operator tier
- Role: summaries, extraction, task routing, checklist generation
- Candidate tier: quantized 3B-9B instruct model
- Backend fit: ollama:missing, mlx:missing, llama.cpp:available
- License posture: audit exact checkpoint before download
- Notes: Use for repeatable low-cost internal tasks so the strongest model is reserved for high-leverage thinking.

## Image Models

### Text-heavy social graphics tier
- Role: IG carousel covers, ad-like static visuals, quote cards
- Candidate tier: local workflow optimized for readable text and brand-safe compositions
- Backend fit: comfyui:missing
- License posture: audit exact image model and workflow licenses
- Notes: Prefer for carousels and graphics where legible text matters. Keep human approval before publishing.

### General local image tier
- Role: mood boards, backgrounds, concept art, visual variants
- Candidate tier: memory-aware local diffusion or image model workflow
- Backend fit: comfyui:missing
- License posture: audit exact image model and workflow licenses
- Notes: Use for optional image ideation. If ComfyUI is missing, generate precise briefs instead of blocking the workspace.

## Orchestration

### Local sequential agent batch
- Role: multi-agent workflow execution
- Candidate tier: single active model call at a time with cached context
- Backend fit: ollama:missing, llama.cpp:available, mlx:missing
- License posture: project code is no-cost; backend/model licenses audited separately
- Notes: Best default for laptops. Agents run in sequence and persist outputs to files.

## Human Decisions Required
- Download exact local model weights only after checking their license and hardware fit.
- Do not configure paid API fallbacks in generated workspaces.
- Keep image/video generation optional when hardware is too small.


## Publishing Policy
```json
{
  "version": "0.1.0",
  "mode": "human-approved",
  "defaults": {
    "allowAutomaticPublish": false,
    "allowDmAutomation": false,
    "allowCommentAutomation": false,
    "allowLikeFollowAutomation": false,
    "allowCaptchaBypass": false,
    "allowCredentialStorage": false
  },
  "approvalStates": [
    "draft",
    "self_reviewed",
    "needs_human_review",
    "approved",
    "rejected",
    "published"
  ],
  "requiredBeforePublish": [
    "human approval",
    "platform checklist complete",
    "asset availability confirmed",
    "claims reviewed",
    "account permission confirmed"
  ],
  "experimentalModulesDefault": "disabled"
}

```

## Task
Review the trend report and source registry. Produce research gaps, source-risk notes, and concrete trend-research tasks.

## Target Artifact
research/trend-report.md

## Inputs
## Input: project-brief.json

{
  "projectName": "Out Of Office E2E Test",
  "niche": "premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City",
  "targetAudience": "corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe",
  "primaryGoal30Days": "generate high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events",
  "offer": "fun, curated networking events in New York where interesting people meet through a social hospitality experience; sell event tickets and grow the community around the Out Of Office brand",
  "tone": "social, polished, energetic, witty, aspirational but not fake",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers or guest identities",
    "keep the brand premium",
    "social"
  ],
  "availableAssets": [
    "photos",
    "videos",
    "website",
    "Luma event pages",
    "past event notes",
    "competitor reference Post Office Roma"
  ],
  "approvalPolicy": "Leonardo Corte, Ludovico Margio, or Cristian Google must approve before publishing",
  "createdAt": "2026-05-23T08:19:58.835Z"
}


## Input: sources/source-registry.md

# Source Registry

| Source | Risk | Method | Allowed Use | Refresh |
| --- | --- | --- | --- | --- |
| Google Trends | low | manual export or browser-assisted public research | trend direction and topic discovery | weekly |
| YouTube public search/trending | medium | browser-assisted public research with rate limits | format, hook, title, and topic benchmarking | weekly |
| Reddit public communities | medium | public browsing, RSS where available, or official API if configured | pain points, language mining, objections | weekly |
| TikTok Creative Center | medium | manual/browser-assisted research | creative inspiration and trend patterns | weekly |
| Instagram public manual review | high | human/manual or explicitly approved browser review only | competitor and format observation | manual |
| Facebook public manual review | high | human/manual or explicitly approved browser review only | page and group topic observation without automated collection | manual |
| User-provided documents and exports | low | local file import | brand context, audience research, performance review | on upload |


## Input: research/trend-report.md

# Trend Research Plan

Generated at: 2026-05-23T08:19:59.201Z

Project: Out Of Office E2E Test
Niche: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City
Target: corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe
Mode: planned-local-first

## Source Risk Summary
- Low risk: google-trends, user-provided-assets
- Medium risk: youtube-trending-and-search, reddit-public, tiktok-creative-center
- High risk / manual only: instagram-public-review, facebook-public-review

## Guardrails
- Cite every source before using a claim.
- Separate observed facts from strategic inference.
- Do not automate restricted Meta surfaces.
- Use high-risk sources only through human/manual review unless explicitly approved.

## Query Seeds
- premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City trend
- premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City content ideas
- premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City problems objections
- premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City instagram reel hooks
- premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City facebook community questions
- fun trend
- fun content ideas
- fun problems objections
- fun instagram reel hooks
- fun facebook community questions
- curated networking events in New York where interesting people meet through a social hospitality experience trend
- curated networking events in New York where interesting people meet through a social hospitality experience content ideas
- curated networking events in New York where interesting people meet through a social hospitality experience problems objections
- curated networking events in New York where interesting people meet through a social hospitality experience instagram reel hooks
- curated networking events in New York where interesting people meet through a social hospitality experience facebook community questions
- sell event tickets and grow the community around the Out Of Office brand trend
- sell event tickets and grow the community around the Out Of Office brand content ideas
- sell event tickets and grow the community around the Out Of Office brand problems objections
- sell event tickets and grow the community around the Out Of Office brand instagram reel hooks
- sell event tickets and grow the community around the Out Of Office brand facebook community questions
- corporate professionals trend
- corporate professionals content ideas
- corporate professionals problems objections
- corporate professionals instagram reel hooks
- corporate professionals facebook community questions
- founders trend
- founders content ideas
- founders problems objections
- founders instagram reel hooks
- founders facebook community questions

## Research Tasks
### research-task-01
- Query: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20trend
- reddit-public: https://www.reddit.com/search/?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20trend

### research-task-02
- Query: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20content%20ideas

### research-task-03
- Query: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20problems%20objections

### research-task-04
- Query: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20instagram%20reel%20hooks

### research-task-05
- Query: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=premium%20after-work%20networking%20events%20for%20corporate%20professionals%20and%20ambitious%20people%20seeking%20real%20connections%20in%20New%20York%20City%20facebook%20community%20questions

### research-task-06
- Query: fun trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=fun%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=fun%20trend
- reddit-public: https://www.reddit.com/search/?q=fun%20trend

### research-task-07
- Query: fun content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=fun%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=fun%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=fun%20content%20ideas

### research-task-08
- Query: fun problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=fun%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=fun%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=fun%20problems%20objections

### research-task-09
- Query: fun instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=fun%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=fun%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=fun%20instagram%20reel%20hooks

### research-task-10
- Query: fun facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=fun%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=fun%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=fun%20facebook%20community%20questions

### research-task-11
- Query: curated networking events in New York where interesting people meet through a social hospitality experience trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20trend
- reddit-public: https://www.reddit.com/search/?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20trend

### research-task-12
- Query: curated networking events in New York where interesting people meet through a social hospitality experience content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20content%20ideas

### research-task-13
- Query: curated networking events in New York where interesting people meet through a social hospitality experience problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20problems%20objections

### research-task-14
- Query: curated networking events in New York where interesting people meet through a social hospitality experience instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20instagram%20reel%20hooks

### research-task-15
- Query: curated networking events in New York where interesting people meet through a social hospitality experience facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=curated%20networking%20events%20in%20New%20York%20where%20interesting%20people%20meet%20through%20a%20social%20hospitality%20experience%20facebook%20community%20questions

### research-task-16
- Query: sell event tickets and grow the community around the Out Of Office brand trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20trend
- reddit-public: https://www.reddit.com/search/?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20trend

### research-task-17
- Query: sell event tickets and grow the community around the Out Of Office brand content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20content%20ideas

### research-task-18
- Query: sell event tickets and grow the community around the Out Of Office brand problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20problems%20objections

### research-task-19
- Query: sell event tickets and grow the community around the Out Of Office brand instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20instagram%20reel%20hooks

### research-task-20
- Query: sell event tickets and grow the community around the Out Of Office brand facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=sell%20event%20tickets%20and%20grow%20the%20community%20around%20the%20Out%20Of%20Office%20brand%20facebook%20community%20questions

### research-task-21
- Query: corporate professionals trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=corporate%20professionals%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=corporate%20professionals%20trend
- reddit-public: https://www.reddit.com/search/?q=corporate%20professionals%20trend

### research-task-22
- Query: corporate professionals content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=corporate%20professionals%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=corporate%20professionals%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=corporate%20professionals%20content%20ideas

### research-task-23
- Query: corporate professionals problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=corporate%20professionals%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=corporate%20professionals%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=corporate%20professionals%20problems%20objections

### research-task-24
- Query: corporate professionals instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=corporate%20professionals%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=corporate%20professionals%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=corporate%20professionals%20instagram%20reel%20hooks

### research-task-25
- Query: corporate professionals facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=corporate%20professionals%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=corporate%20professionals%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=corporate%20professionals%20facebook%20community%20questions

### research-task-26
- Query: founders trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=founders%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=founders%20trend
- reddit-public: https://www.reddit.com/search/?q=founders%20trend

### research-task-27
- Query: founders content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=founders%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=founders%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=founders%20content%20ideas

### research-task-28
- Query: founders problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=founders%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=founders%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=founders%20problems%20objections

### research-task-29
- Query: founders instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=founders%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=founders%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=founders%20instagram%20reel%20hooks

### research-task-30
- Query: founders facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=founders%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=founders%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=founders%20facebook%20community%20questions



## Output Contract
- Be specific to this workspace.
- Flag assumptions and risks.
- Do not invent product claims, free trials, signups, discounts, testimonials, case studies, or CTAs that are not present in the brief.
- Prefer practical, proof-aware language over aggressive sales language.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- End with concrete next regeneration or approval steps.
