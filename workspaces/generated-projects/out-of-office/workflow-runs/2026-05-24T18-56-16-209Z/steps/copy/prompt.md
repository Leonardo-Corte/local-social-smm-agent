# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Copywriter

## Mission
Write hooks, captions, posts, carousel copy, CTAs, and story copy.

## Project Context
- Project: Out Of Office
- Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
- Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
- 30-day goal: che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte
- Tone: fallo tu in base al nostro business coemè

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
  "projectName": "Out Of Office",
  "niche": "allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city",
  "targetAudience": "tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...",
  "primaryGoal30Days": "che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte",
  "offer": "tiket del evento nel qule è compero cibo e drink",
  "tone": "fallo tu in base al nostro business coemè",
  "platforms": [
    "intagram",
    "facebook",
    "linkedin"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers, guest identities, partnerships, pricing, or event claims"
  ],
  "availableAssets": [
    "ho vari video della serata anceh foto"
  ],
  "approvalPolicy": "leonardo cri o ludo",
  "createdAt": "2026-05-23T22:04:30.342Z"
}

```

## Business Profile
# Business Profile

Project: Out Of Office

## Clean Positioning
Out Of Office creates premium, social networking experiences in New York City for corporate professionals and ambitious people who want real-life connections without a stiff conference atmosphere.

## Business Type
Curated networking and social events brand

## Audiences
- Primary audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.
- Secondary audience: Professionals, founders, operators, creatives, finance/tech workers, and newcomers who want to meet interesting people in person.
- Venue buyer: Hospitality venues in New York that want qualified event traffic, food and drink spend, and a polished audience.

## Offer
Ticketed networking events where admission includes the event experience and may include food and drinks when confirmed for that event.

## Value Proposition
A curated room of interesting people, food, drinks, and social energy designed to make networking feel easier, more enjoyable, and more memorable.

## 30-Day Goals
- Grow Instagram organically.
- Increase community signups.
- Drive repeat attendance to events.
- Make venues understand why hosting Out Of Office can be valuable.

## Platforms
- instagram
- facebook
- linkedin

## Brand Tone
- premium
- social
- confident
- warm
- New York energy

## Proof And Claims To Verify
- Past event videos and photos exist.
- The business claims it can bring around 200 people to venues; verify per event before using as a public claim.
- Food and drinks are included or bundled in some ticket offers; verify exact details before publishing.

## Approval Owners
leonardo cri o ludo

## Publishing Rules
- Do not publish automatically.
- Do not automate DMs, comments, likes, or follows.
- Do not invent attendance numbers, guest identities, partnerships, pricing, food/drink inclusions, or venue claims.
- Use 'around 200 people' only after human confirmation for the specific event/context.
- All final content must be approved by Leonardo, Cri/Cristian, or Ludo.

## Open Questions The Agent Should Ask Proactively
- What is the exact next event date, venue, and Luma/ticket link?
- What exactly is included in each ticket for the next event?
- Which public claims are confirmed: attendance, venue results, guest quality, food/drink package?
- Which Instagram/Facebook/LinkedIn handles should be tagged?
- What competitors or references should the system watch besides Post Office Roma?

## Agent Behavior
- First, infer and clean obvious spelling or wording issues from the interview.
- Ask the human only when a missing detail changes facts, claims, pricing, event logistics, or publishing approval.
- If content is too generic, proactively rewrite it with the business profile above.
- If an asset is uploaded, extract what can be safely observed and separate observed facts from assumptions.
- Never tell the human to fix messy wording when the intent is clear; normalize it and continue.


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
| Ollama | yes | ollama-api |
| MLX LM | no | - |
| llama.cpp | no | - |
| vLLM | no | - |
| ComfyUI | no | - |
| NVIDIA SMI | no | - |

## Text Models

### Frontier local reasoning/copy tier
- Role: strategy, critique, long-form copy, persona simulation
- Candidate tier: quantized 14B-32B+ open-weight instruct/reasoning model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing, vllm:missing
- License posture: audit exact checkpoint before download
- Notes: Use for strategist, critic, copywriter, and persona-simulation passes when RAM/VRAM allows.

### Fast local operator tier
- Role: summaries, extraction, task routing, checklist generation
- Candidate tier: quantized 3B-9B instruct model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing
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
- Backend fit: ollama:available, llama.cpp:missing, mlx:missing
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
## Input: business/business.md

# Business Profile

Project: Out Of Office

## Clean Positioning
Out Of Office creates premium, social networking experiences in New York City for corporate professionals and ambitious people who want real-life connections without a stiff conference atmosphere.

## Business Type
Curated networking and social events brand

## Audiences
- Primary audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.
- Secondary audience: Professionals, founders, operators, creatives, finance/tech workers, and newcomers who want to meet interesting people in person.
- Venue buyer: Hospitality venues in New York that want qualified event traffic, food and drink spend, and a polished audience.

## Offer
Ticketed networking events where admission includes the event experience and may include food and drinks when confirmed for that event.

## Value Proposition
A curated room of interesting people, food, drinks, and social energy designed to make networking feel easier, more enjoyable, and more memorable.

## 30-Day Goals
- Grow Instagram organically.
- Increase community signups.
- Drive repeat attendance to events.
- Make venues understand why hosting Out Of Office can be valuable.

## Platforms
- instagram
- facebook
- linkedin

## Brand Tone
- premium
- social
- confident
- warm
- New York energy

## Proof And Claims To Verify
- Past event videos and photos exist.
- The business claims it can bring around 200 people to venues; verify per event before using as a public claim.
- Food and drinks are included or bundled in some ticket offers; verify exact details before publishing.

## Approval Owners
leonardo cri o ludo

## Publishing Rules
- Do not publish automatically.
- Do not automate DMs, comments, likes, or follows.
- Do not invent attendance numbers, guest identities, partnerships, pricing, food/drink inclusions, or venue claims.
- Use 'around 200 people' only after human confirmation for the specific event/context.
- All final content must be approved by Leonardo, Cri/Cristian, or Ludo.

## Open Questions The Agent Should Ask Proactively
- What is the exact next event date, venue, and Luma/ticket link?
- What exactly is included in each ticket for the next event?
- Which public claims are confirmed: attendance, venue results, guest quality, food/drink package?
- Which Instagram/Facebook/LinkedIn handles should be tagged?
- What competitors or references should the system watch besides Post Office Roma?

## Agent Behavior
- First, infer and clean obvious spelling or wording issues from the interview.
- Ask the human only when a missing detail changes facts, claims, pricing, event logistics, or publishing approval.
- If content is too generic, proactively rewrite it with the business profile above.
- If an asset is uploaded, extract what can be safely observed and separate observed facts from assumptions.
- Never tell the human to fix messy wording when the intent is clear; normalize it and continue.


## Input: operations/current-request.md

# Current User Request

Created at: 2026-05-24T18:56:16.208Z

Intent: message

Target: drafts/messages.md

Requested steps: copy

## User Request
Fammi un messaggio breve premium per invitare un venue manager a ospitare Out Of Office, senza inventare numeri.


## Input: calendar/30-day-calendar.md

# 30-Day Content Calendar

Goal: Grow Instagram organically. Increase community signups. Drive repeat attendance to events. Make venues understand why hosting Out Of Office can be valuable.

Audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
| 1 | Desire | Reel | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 2 | Proof | Carousel | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 3 | Education | Static post | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 4 | Behind the scenes | Story sequence | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 5 | Offer | Facebook post | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 6 | Venue buyer | LinkedIn post | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 7 | Desire | Reel | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 8 | Proof | Carousel | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 9 | Education | Static post | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 10 | Behind the scenes | Story sequence | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |
| 11 | Offer | Facebook post | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 12 | Venue buyer | LinkedIn post | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 13 | Desire | Reel | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 14 | Proof | Carousel | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 15 | Education | Static post | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 16 | Behind the scenes | Story sequence | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 17 | Offer | Facebook post | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 18 | Venue buyer | LinkedIn post | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 19 | Desire | Reel | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 20 | Proof | Carousel | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |
| 21 | Education | Static post | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 22 | Behind the scenes | Story sequence | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 23 | Offer | Facebook post | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 24 | Venue buyer | LinkedIn post | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 25 | Desire | Reel | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 26 | Proof | Carousel | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 27 | Education | Static post | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 28 | Behind the scenes | Story sequence | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 29 | Offer | Facebook post | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 30 | Venue buyer | LinkedIn post | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |


## Input: drafts/posts.md

# Draft Posts

## Post 1: The Room
Hook: Networking in New York should not feel like a conference lobby.

Body: Out Of Office is built for people who want useful professional connections without losing the social energy of a good night out. The promise is simple: a curated room, interesting people, food and drinks when confirmed for the event, and a setting that makes starting conversations easier.

CTA: Join the community or grab a ticket for the next confirmed event.

Safety note: Confirm event date, venue, ticket inclusions, and link before publishing.

## Post 2: Venue Angle
Hook: A strong event is not just traffic. It is the right room.

Body: For New York venues, Out Of Office can position events around qualified professional attendance, social energy, and food and drink spend. Any attendance number or venue result must be verified before it becomes a public claim.

CTA: Ask about hosting a future Out Of Office night.

Safety note: Do not publish attendance claims unless a human confirms the exact proof.


## Previous Agent Handoffs
No previous handoffs for this run.

## Output Contract
- Be specific to this workspace.
- Clean obvious messy wording from user input yourself; do not ask the human to correct typos when intent is clear.
- Ask proactive follow-up questions only for factual gaps that affect claims, event logistics, pricing, tickets, approvals, or publishing safety.
- Flag assumptions and risks.
- Do not invent product claims, free trials, signups, discounts, testimonials, case studies, or CTAs that are not present in the brief.
- Prefer practical, proof-aware language over aggressive sales language.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- Include a section named "Agent Handoff" with what the next agent should keep, challenge, and verify.
- End with concrete next regeneration or approval steps.
