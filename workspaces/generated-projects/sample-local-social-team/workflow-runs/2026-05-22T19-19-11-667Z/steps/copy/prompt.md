# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Copywriter

## Mission
Write hooks, captions, posts, carousel copy, CTAs, and story copy.

## Project Context
- Project: Sample Local Social Team
- Niche: local-first AI tools for creators and small businesses
- Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
- 30-day goal: validate positioning and publish consistently with human-approved drafts
- Tone: sharp, useful, practical, slightly bold

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

## Inputs
## Input: calendar/30-day-calendar.md

# 30-Day Content Calendar

Goal: validate positioning and publish consistently with human-approved drafts

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
| 1 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 1 | Draft then human review |
| 2 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 2 | Draft then human review |
| 3 | Education | Static post | local-first AI tools for creators and small businesses angle 3 | Draft then human review |
| 4 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 4 | Draft then human review |
| 5 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 5 | Draft then human review |
| 6 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 6 | Draft then human review |
| 7 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 7 | Draft then human review |
| 8 | Education | Static post | local-first AI tools for creators and small businesses angle 8 | Draft then human review |
| 9 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 9 | Draft then human review |
| 10 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 10 | Draft then human review |
| 11 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 11 | Draft then human review |
| 12 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 12 | Draft then human review |
| 13 | Education | Static post | local-first AI tools for creators and small businesses angle 13 | Draft then human review |
| 14 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 14 | Draft then human review |
| 15 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 15 | Draft then human review |
| 16 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 16 | Draft then human review |
| 17 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 17 | Draft then human review |
| 18 | Education | Static post | local-first AI tools for creators and small businesses angle 18 | Draft then human review |
| 19 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 19 | Draft then human review |
| 20 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 20 | Draft then human review |
| 21 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 21 | Draft then human review |
| 22 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 22 | Draft then human review |
| 23 | Education | Static post | local-first AI tools for creators and small businesses angle 23 | Draft then human review |
| 24 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 24 | Draft then human review |
| 25 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 25 | Draft then human review |
| 26 | Problem awareness | Reel | local-first AI tools for creators and small businesses angle 26 | Draft then human review |
| 27 | Proof/credibility | Carousel | local-first AI tools for creators and small businesses angle 27 | Draft then human review |
| 28 | Education | Static post | local-first AI tools for creators and small businesses angle 28 | Draft then human review |
| 29 | Behind the scenes | Story sequence | local-first AI tools for creators and small businesses angle 29 | Draft then human review |
| 30 | Offer/CTA | Facebook post | local-first AI tools for creators and small businesses angle 30 | Draft then human review |


## Input: drafts/posts.md

# Draft Posts

## Post 1
Hook: Stop paying for a social stack before your content system is even working.

Body: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs need a repeatable local-first workflow: strategy, drafts, review, and publishing discipline before more SaaS.

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
- End with concrete next regeneration or approval steps.
