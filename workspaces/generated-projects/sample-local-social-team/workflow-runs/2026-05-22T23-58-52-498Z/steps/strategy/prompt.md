# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Brand Strategist

## Mission
Define positioning, voice, content pillars, and editorial rules.

## Project Context
- Project: Sample Local Social Team
- Niche: local-first AI tools for creators and small businesses
- Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
- 30-day goal: validate positioning and publish consistently with human-approved drafts
- Tone: sharp, useful, practical, slightly bold

## Inputs
- project brief
- research report

## Outputs
- brand-strategy.md
- content-pillars.md
- voice-guide.md

## Allowed Tools
- content-planner

## Quality Checks
- voice is actionable
- pillars map to goals
- differentiation is concrete

## Escalation Rules
- Ask for human review if positioning implies a promise the project cannot support.


## Project Brief
```json
{
  "projectName": "Sample Local Social Team",
  "niche": "local-first AI tools for creators and small businesses",
  "targetAudience": "solo creators, small agencies, and founders who want professional social content without recurring SaaS costs",
  "primaryGoal30Days": "validate positioning and publish consistently with human-approved drafts",
  "offer": "a local-first AI social media workspace factory",
  "tone": "sharp, useful, practical, slightly bold",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "no paid model APIs required",
    "human approval before publishing",
    "no spam automation",
    "local-first generation"
  ],
  "availableAssets": [
    "project notes",
    "repo scouting",
    "founder point of view"
  ],
  "approvalPolicy": "human-approved",
  "createdAt": "2026-05-22T18:47:32.518Z"
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
Turn the brief and research into sharper positioning, voice rules, and content-pillar improvements.

## Target Artifact
strategy/content-pillars.md

## Inputs
## Input: project-brief.json

{
  "projectName": "Sample Local Social Team",
  "niche": "local-first AI tools for creators and small businesses",
  "targetAudience": "solo creators, small agencies, and founders who want professional social content without recurring SaaS costs",
  "primaryGoal30Days": "validate positioning and publish consistently with human-approved drafts",
  "offer": "a local-first AI social media workspace factory",
  "tone": "sharp, useful, practical, slightly bold",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "no paid model APIs required",
    "human approval before publishing",
    "no spam automation",
    "local-first generation"
  ],
  "availableAssets": [
    "project notes",
    "repo scouting",
    "founder point of view"
  ],
  "approvalPolicy": "human-approved",
  "createdAt": "2026-05-22T18:47:32.518Z"
}


## Input: research/trend-report.md

# Trend Research Plan

Generated at: 2026-05-22T19:49:47.190Z

Project: Sample Local Social Team
Niche: local-first AI tools for creators and small businesses
Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
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
- local-first AI tools for creators and small businesses trend
- local-first AI tools for creators and small businesses content ideas
- local-first AI tools for creators and small businesses problems objections
- local-first AI tools for creators and small businesses instagram reel hooks
- local-first AI tools for creators and small businesses facebook community questions
- a local-first AI social media workspace factory trend
- a local-first AI social media workspace factory content ideas
- a local-first AI social media workspace factory problems objections
- a local-first AI social media workspace factory instagram reel hooks
- a local-first AI social media workspace factory facebook community questions
- solo creators trend
- solo creators content ideas
- solo creators problems objections
- solo creators instagram reel hooks
- solo creators facebook community questions
- small agencies trend
- small agencies content ideas
- small agencies problems objections
- small agencies instagram reel hooks
- small agencies facebook community questions
- and founders who want professional social content without recurring SaaS costs trend
- and founders who want professional social content without recurring SaaS costs content ideas
- and founders who want professional social content without recurring SaaS costs problems objections
- and founders who want professional social content without recurring SaaS costs instagram reel hooks
- and founders who want professional social content without recurring SaaS costs facebook community questions
- instagram trend
- instagram content ideas
- instagram problems objections
- instagram instagram reel hooks
- instagram facebook community questions

## Research Tasks
### research-task-01
- Query: local-first AI tools for creators and small businesses trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20trend
- reddit-public: https://www.reddit.com/search/?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20trend

### research-task-02
- Query: local-first AI tools for creators and small businesses content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20content%20ideas

### research-task-03
- Query: local-first AI tools for creators and small businesses problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20problems%20objections

### research-task-04
- Query: local-first AI tools for creators and small businesses instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20instagram%20reel%20hooks

### research-task-05
- Query: local-first AI tools for creators and small businesses facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=local-first%20AI%20tools%20for%20creators%20and%20small%20businesses%20facebook%20community%20questions

### research-task-06
- Query: a local-first AI social media workspace factory trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=a%20local-first%20AI%20social%20media%20workspace%20factory%20trend
- reddit-public: https://www.reddit.com/search/?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20trend

### research-task-07
- Query: a local-first AI social media workspace factory content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=a%20local-first%20AI%20social%20media%20workspace%20factory%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20content%20ideas

### research-task-08
- Query: a local-first AI social media workspace factory problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=a%20local-first%20AI%20social%20media%20workspace%20factory%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20problems%20objections

### research-task-09
- Query: a local-first AI social media workspace factory instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=a%20local-first%20AI%20social%20media%20workspace%20factory%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20instagram%20reel%20hooks

### research-task-10
- Query: a local-first AI social media workspace factory facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=a%20local-first%20AI%20social%20media%20workspace%20factory%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=a%20local-first%20AI%20social%20media%20workspace%20factory%20facebook%20community%20questions

### research-task-11
- Query: solo creators trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=solo%20creators%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=solo%20creators%20trend
- reddit-public: https://www.reddit.com/search/?q=solo%20creators%20trend

### research-task-12
- Query: solo creators content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=solo%20creators%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=solo%20creators%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=solo%20creators%20content%20ideas

### research-task-13
- Query: solo creators problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=solo%20creators%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=solo%20creators%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=solo%20creators%20problems%20objections

### research-task-14
- Query: solo creators instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=solo%20creators%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=solo%20creators%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=solo%20creators%20instagram%20reel%20hooks

### research-task-15
- Query: solo creators facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=solo%20creators%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=solo%20creators%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=solo%20creators%20facebook%20community%20questions

### research-task-16
- Query: small agencies trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=small%20agencies%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=small%20agencies%20trend
- reddit-public: https://www.reddit.com/search/?q=small%20agencies%20trend

### research-task-17
- Query: small agencies content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=small%20agencies%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=small%20agencies%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=small%20agencies%20content%20ideas

### research-task-18
- Query: small agencies problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=small%20agencies%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=small%20agencies%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=small%20agencies%20problems%20objections

### research-task-19
- Query: small agencies instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=small%20agencies%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=small%20agencies%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=small%20agencies%20instagram%20reel%20hooks

### research-task-20
- Query: small agencies facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=small%20agencies%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=small%20agencies%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=small%20agencies%20facebook%20community%20questions

### research-task-21
- Query: and founders who want professional social content without recurring SaaS costs trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20trend
- reddit-public: https://www.reddit.com/search/?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20trend

### research-task-22
- Query: and founders who want professional social content without recurring SaaS costs content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20content%20ideas

### research-task-23
- Query: and founders who want professional social content without recurring SaaS costs problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20problems%20objections

### research-task-24
- Query: and founders who want professional social content without recurring SaaS costs instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20instagram%20reel%20hooks

### research-task-25
- Query: and founders who want professional social content without recurring SaaS costs facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=and%20founders%20who%20want%20professional%20social%20content%20without%20recurring%20SaaS%20costs%20facebook%20community%20questions

### research-task-26
- Query: instagram trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=instagram%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=instagram%20trend
- reddit-public: https://www.reddit.com/search/?q=instagram%20trend

### research-task-27
- Query: instagram content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=instagram%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=instagram%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=instagram%20content%20ideas

### research-task-28
- Query: instagram problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=instagram%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=instagram%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=instagram%20problems%20objections

### research-task-29
- Query: instagram instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=instagram%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=instagram%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=instagram%20instagram%20reel%20hooks

### research-task-30
- Query: instagram facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=instagram%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=instagram%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=instagram%20facebook%20community%20questions



## Input: strategy/content-pillars.md

# Content Pillars

1. Pain points and problem awareness for solo creators, small agencies, and founders who want professional social content without recurring SaaS costs.
2. Practical education around local-first AI tools for creators and small businesses.
3. Proof, trust, and behind-the-scenes credibility.
4. Offer-led content with human-approved CTAs.
5. Community questions, objections, and feedback loops.


## Output Contract
- Be specific to this workspace.
- Flag assumptions and risks.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- End with concrete next regeneration or approval steps.
