# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Copywriter

## Mission
Write hooks, captions, posts, carousel copy, CTAs, and story copy.

## Project Context
- Project: Real Video Test
- Niche: premium hospitality events, cocktail bars, and social dining experiences
- Target: young professionals, food and drink lovers, nightlife guests, event partners, and local hospitality audiences
- 30-day goal: turn one real event video into a repeatable Instagram/Facebook content system with human-approved captions, reel angles, and follow-up posts
- Tone: warm, premium, lively, social, polished, practical

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
  "projectName": "Real Video Test",
  "niche": "premium hospitality events, cocktail bars, and social dining experiences",
  "targetAudience": "young professionals, food and drink lovers, nightlife guests, event partners, and local hospitality audiences",
  "primaryGoal30Days": "turn one real event video into a repeatable Instagram/Facebook content system with human-approved captions, reel angles, and follow-up posts",
  "offer": "a premium out-of-office social event experience hosted with La Tazza D Oro",
  "tone": "warm, premium, lively, social, polished, practical",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "use only observed video evidence unless human adds more context",
    "no invented attendance numbers",
    "no invented celebrity, sponsor, menu, or pricing claims",
    "human approval required before publishing",
    "no DM/comment/like/follow automation"
  ],
  "availableAssets": [
    "assets/raw/VIDEO-2026-05-21-19-25-07.mp4",
    "assets/analysis/contact-sheet.jpg",
    "assets/frames/frame-01.jpg through frame-11.jpg",
    "assets/audio/audio.wav"
  ],
  "approvalPolicy": "human-approved by project owner",
  "createdAt": "2026-05-23T01:16:08.594Z"
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
Review only drafts/posts.md. Improve clarity, specificity, proof-awareness, and CTA quality without inventing offers, free trials, signups, discounts, testimonials, or claims not present in the brief. Propose a complete replacement only for drafts/posts.md. Do not include carousel or reel content in the Proposed Artifact.

## Target Artifact
drafts/posts.md

## Inputs
## Input: calendar/30-day-calendar.md

# 30-Day Content Calendar

Goal: turn one real event video into a repeatable Instagram/Facebook content system with human-approved captions, reel angles, and follow-up posts

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
| 1 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 1 | Draft then human review |
| 2 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 2 | Draft then human review |
| 3 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 3 | Draft then human review |
| 4 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 4 | Draft then human review |
| 5 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 5 | Draft then human review |
| 6 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 6 | Draft then human review |
| 7 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 7 | Draft then human review |
| 8 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 8 | Draft then human review |
| 9 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 9 | Draft then human review |
| 10 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 10 | Draft then human review |
| 11 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 11 | Draft then human review |
| 12 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 12 | Draft then human review |
| 13 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 13 | Draft then human review |
| 14 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 14 | Draft then human review |
| 15 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 15 | Draft then human review |
| 16 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 16 | Draft then human review |
| 17 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 17 | Draft then human review |
| 18 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 18 | Draft then human review |
| 19 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 19 | Draft then human review |
| 20 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 20 | Draft then human review |
| 21 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 21 | Draft then human review |
| 22 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 22 | Draft then human review |
| 23 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 23 | Draft then human review |
| 24 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 24 | Draft then human review |
| 25 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 25 | Draft then human review |
| 26 | Problem awareness | Reel | premium hospitality events, cocktail bars, and social dining experiences angle 26 | Draft then human review |
| 27 | Proof/credibility | Carousel | premium hospitality events, cocktail bars, and social dining experiences angle 27 | Draft then human review |
| 28 | Education | Static post | premium hospitality events, cocktail bars, and social dining experiences angle 28 | Draft then human review |
| 29 | Behind the scenes | Story sequence | premium hospitality events, cocktail bars, and social dining experiences angle 29 | Draft then human review |
| 30 | Offer/CTA | Facebook post | premium hospitality events, cocktail bars, and social dining experiences angle 30 | Draft then human review |


## Input: drafts/posts.md

# Draft Posts

## Post 1
Hook: Stop paying for a social stack before your content system is even working.

Body: young professionals, food and drink lovers, nightlife guests, event partners, and local hospitality audiences need a repeatable local-first workflow: strategy, drafts, review, and publishing discipline before more SaaS.

CTA: Save this and review your current content workflow.


## Input: assets/analysis/video-asset-report.md

# Real Video Asset Report

Asset: `assets/raw/VIDEO-2026-05-21-19-25-07.mp4`

SHA-256: `2142746e10565705a3b04b1e3a0ec5b4d2fdf04a5a347e3877a178e10b5a96bf`

## Technical Metadata
- Format: MP4 / QuickTime
- Duration: 11.26 seconds
- Orientation: vertical
- Resolution: 576x1024
- Frame rate: 30 fps
- Video codec: H.264 baseline
- Audio: AAC stereo, extracted to mono WAV at 16 kHz

## Visual Observations
- Opening overlay reads: `Out Of Office x La Tazza D'oro`.
- Setting appears to be a busy hospitality venue, bar, or restaurant.
- Crowd density is high, suggesting an active event atmosphere.
- Bar staff, counter service, cocktails, food trays, and warm venue lighting are visible.
- The strongest visual beats are:
  - branded opening text
  - crowd at entrance/bar
  - packed bar scene
  - food close-up
  - orange cocktail hero shot

## Content Opportunities
- Reel recap: "Out Of Office x La Tazza D'oro in 11 seconds."
- Social proof angle: show the crowd and energy without inventing attendance numbers.
- Hospitality/event angle: premium bar, food, and cocktail atmosphere.
- Follow-up carousel: event highlights and why the format works.
- Story sequence: venue, crowd, food, cocktail, thank-you/next event teaser.

## Guardrails
- Do not claim exact turnout, sales, VIP attendance, or menu details unless confirmed by the human.
- Do not identify people by name unless provided.
- Do not imply sponsorship beyond the visible collaboration text.
- Human approval required before publishing.


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
