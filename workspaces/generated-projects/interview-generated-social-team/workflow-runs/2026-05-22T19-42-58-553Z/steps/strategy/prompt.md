# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Brand Strategist

## Mission
Define positioning, voice, content pillars, and editorial rules.

## Project Context
- Project: Interview Generated Social Team
- Niche: local-first AI content systems for creators and small agencies
- Target: solo creators, small agencies, founders
- 30-day goal: validate the offer and publish a consistent human-approved content calendar
- Tone: sharp, practical, professional, direct

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
  "projectName": "Interview Generated Social Team",
  "niche": "local-first AI content systems for creators and small agencies",
  "targetAudience": "solo creators, small agencies, founders",
  "primaryGoal30Days": "validate the offer and publish a consistent human-approved content calendar",
  "offer": "a local-first AI workspace that generates strategy, drafts, reviews, and publishing packages",
  "tone": "sharp, practical, professional, direct",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "no paid APIs",
    "no spam automation",
    "human approval required",
    "local-first generation"
  ],
  "availableAssets": [
    "founder notes",
    "repo audit",
    "sample drafts",
    "competitor ideas"
  ],
  "approvalPolicy": "human-approved by the project owner",
  "createdAt": "2026-05-22T19:42:58.186Z"
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
| Ollama | yes | ollama |
| MLX LM | no | - |
| llama.cpp | yes | llama-cli |
| vLLM | no | - |
| ComfyUI | no | - |
| NVIDIA SMI | no | - |

## Text Models

### Frontier local reasoning/copy tier
- Role: strategy, critique, long-form copy, persona simulation
- Candidate tier: quantized 14B-32B+ open-weight instruct/reasoning model
- Backend fit: ollama:available, mlx:missing, llama.cpp:available, vllm:missing
- License posture: audit exact checkpoint before download
- Notes: Use for strategist, critic, copywriter, and persona-simulation passes when RAM/VRAM allows.

### Fast local operator tier
- Role: summaries, extraction, task routing, checklist generation
- Candidate tier: quantized 3B-9B instruct model
- Backend fit: ollama:available, mlx:missing, llama.cpp:available
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
- Backend fit: ollama:available, llama.cpp:available, mlx:missing
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
  "projectName": "Interview Generated Social Team",
  "niche": "local-first AI content systems for creators and small agencies",
  "targetAudience": "solo creators, small agencies, founders",
  "primaryGoal30Days": "validate the offer and publish a consistent human-approved content calendar",
  "offer": "a local-first AI workspace that generates strategy, drafts, reviews, and publishing packages",
  "tone": "sharp, practical, professional, direct",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "no paid APIs",
    "no spam automation",
    "human approval required",
    "local-first generation"
  ],
  "availableAssets": [
    "founder notes",
    "repo audit",
    "sample drafts",
    "competitor ideas"
  ],
  "approvalPolicy": "human-approved by the project owner",
  "createdAt": "2026-05-22T19:42:58.186Z"
}


## Input: research/trend-report.md

# Trend Research Plan

Generated at: 2026-05-22T19:42:58.352Z

Project: Interview Generated Social Team
Niche: local-first AI content systems for creators and small agencies
Target: solo creators, small agencies, founders
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
- local-first AI content systems for creators and small agencies trend
- local-first AI content systems for creators and small agencies content ideas
- local-first AI content systems for creators and small agencies problems objections
- local-first AI content systems for creators and small agencies instagram reel hooks
- local-first AI content systems for creators and small agencies facebook community questions
- a local-first AI workspace that generates strategy trend
- a local-first AI workspace that generates strategy content ideas
- a local-first AI workspace that generates strategy problems objections
- a local-first AI workspace that generates strategy instagram reel hooks
- a local-first AI workspace that generates strategy facebook community questions
- drafts trend
- drafts content ideas
- drafts problems objections
- drafts instagram reel hooks
- drafts facebook community questions
- reviews trend
- reviews content ideas
- reviews problems objections
- reviews instagram reel hooks
- reviews facebook community questions
- and publishing packages trend
- and publishing packages content ideas
- and publishing packages problems objections
- and publishing packages instagram reel hooks
- and publishing packages facebook community questions
- solo creators trend
- solo creators content ideas
- solo creators problems objections
- solo creators instagram reel hooks
- solo creators facebook community questions

## Research Tasks
### research-task-01
- Query: local-first AI content systems for creators and small agencies trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-02
- Query: local-first AI content systems for creators and small agencies content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-03
- Query: local-first AI content systems for creators and small agencies problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-04
- Query: local-first AI content systems for creators and small agencies instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-05
- Query: local-first AI content systems for creators and small agencies facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-06
- Query: a local-first AI workspace that generates strategy trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-07
- Query: a local-first AI workspace that generates strategy content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-08
- Query: a local-first AI workspace that generates strategy problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-09
- Query: a local-first AI workspace that generates strategy instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-10
- Query: a local-first AI workspace that generates strategy facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-11
- Query: drafts trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-12
- Query: drafts content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-13
- Query: drafts problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-14
- Query: drafts instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-15
- Query: drafts facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-16
- Query: reviews trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-17
- Query: reviews content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-18
- Query: reviews problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-19
- Query: reviews instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-20
- Query: reviews facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-21
- Query: and publishing packages trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-22
- Query: and publishing packages content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-23
- Query: and publishing packages problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-24
- Query: and publishing packages instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-25
- Query: and publishing packages facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-26
- Query: solo creators trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-27
- Query: solo creators content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-28
- Query: solo creators problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-29
- Query: solo creators instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending

### research-task-30
- Query: solo creators facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending



## Input: strategy/content-pillars.md

# Content Pillars

1. Pain points and problem awareness for solo creators, small agencies, founders.
2. Practical education around local-first AI content systems for creators and small agencies.
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
