# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Copywriter

## Mission
Write hooks, captions, posts, carousel copy, CTAs, and story copy.

## Project Context
- Project: Interview Generated Social Team
- Niche: local-first AI content systems for creators and small agencies
- Target: solo creators, small agencies, founders
- 30-day goal: validate the offer and publish a consistent human-approved content calendar
- Tone: sharp, practical, professional, direct

## Inputs
- calendar
- voice guide
- content pillars

## Outputs
- posts.md
- carousels.md
- stories.md

## Allowed Tools
- copy templates

## Quality Checks
- hook is strong
- CTA is clear
- voice matches guide
- platform constraints met

## Escalation Rules
- Flag claims that need proof before publishing.


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
Review current post, carousel, and reel drafts. Propose better hooks, claims, CTAs, and format-specific improvements.

## Target Artifact
drafts/posts.md

## Inputs
## Input: calendar/30-day-calendar.md

# 30-Day Content Calendar

Goal: validate the offer and publish a consistent human-approved content calendar

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
| 1 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 1 | Draft then human review |
| 2 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 2 | Draft then human review |
| 3 | Education | Static post | local-first AI content systems for creators and small agencies angle 3 | Draft then human review |
| 4 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 4 | Draft then human review |
| 5 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 5 | Draft then human review |
| 6 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 6 | Draft then human review |
| 7 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 7 | Draft then human review |
| 8 | Education | Static post | local-first AI content systems for creators and small agencies angle 8 | Draft then human review |
| 9 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 9 | Draft then human review |
| 10 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 10 | Draft then human review |
| 11 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 11 | Draft then human review |
| 12 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 12 | Draft then human review |
| 13 | Education | Static post | local-first AI content systems for creators and small agencies angle 13 | Draft then human review |
| 14 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 14 | Draft then human review |
| 15 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 15 | Draft then human review |
| 16 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 16 | Draft then human review |
| 17 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 17 | Draft then human review |
| 18 | Education | Static post | local-first AI content systems for creators and small agencies angle 18 | Draft then human review |
| 19 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 19 | Draft then human review |
| 20 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 20 | Draft then human review |
| 21 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 21 | Draft then human review |
| 22 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 22 | Draft then human review |
| 23 | Education | Static post | local-first AI content systems for creators and small agencies angle 23 | Draft then human review |
| 24 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 24 | Draft then human review |
| 25 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 25 | Draft then human review |
| 26 | Problem awareness | Reel | local-first AI content systems for creators and small agencies angle 26 | Draft then human review |
| 27 | Proof/credibility | Carousel | local-first AI content systems for creators and small agencies angle 27 | Draft then human review |
| 28 | Education | Static post | local-first AI content systems for creators and small agencies angle 28 | Draft then human review |
| 29 | Behind the scenes | Story sequence | local-first AI content systems for creators and small agencies angle 29 | Draft then human review |
| 30 | Offer/CTA | Facebook post | local-first AI content systems for creators and small agencies angle 30 | Draft then human review |


## Input: drafts/posts.md

# Draft Posts

## Post 1
Hook: Stop paying for a social stack before your content system is even working.

Body: solo creators, small agencies, founders need a repeatable local-first workflow: strategy, drafts, review, and publishing discipline before more SaaS.

CTA: Save this and review your current content workflow.


## Input: drafts/carousels.md

# Carousel Drafts

## Carousel 1: The Local-First Social Team
1. Your content workflow should not start with another subscription.
2. Start with niche, target, offer, and constraints.
3. Turn that into agents, calendars, drafts, and reviews.
4. Keep approval human.
5. Iterate from feedback until the workspace fits.


## Input: drafts/reels.md

# Reel Scripts

## Reel 1
Opening: "Before you automate Instagram, automate your thinking."
Beat 1: Show messy notes.
Beat 2: Show interview-to-workspace flow.
Beat 3: Show calendar and drafts.
CTA: "Want the checklist? Comment after human review only."


## Output Contract
- Be specific to this workspace.
- Flag assumptions and risks.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- End with concrete next regeneration or approval steps.
