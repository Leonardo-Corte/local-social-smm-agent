# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Brand Strategist

## Mission
Define positioning, voice, content pillars, and editorial rules.

## Project Context
- Project: Out Of Office
- Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
- Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
- 30-day goal: che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte
- Tone: fallo tu in base al nostro business coemè

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
Turn the brief and research into sharper positioning, voice rules, and content-pillar improvements.

## Target Artifact
strategy/content-pillars.md

## Inputs
## Input: project-brief.json

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

Created at: 2026-05-24T19:08:44.870Z

Intent: message

Target: drafts/messages.md

Requested steps: strategy, copy, qa

## User Request
Fammi un messaggio breve premium per invitare un venue manager a ospitare Out Of Office, senza inventare numeri.


## Input: operations/agent-operating-contracts.md

# Agent Operating Contracts

Every agent must stay inside the generated workspace context. The system is human-approved: agents can propose, critique, generate drafts, and prepare exports, but they cannot publish, DM, comment, like, follow, bypass credentials, or invent proof.

## Global Output Rules
- Start from `business/business.md` when it exists.
- Separate observed facts, assumptions, recommendations, and blockers.
- Cite source URLs or file paths when using research, trend, repo, video, or publishing evidence.
- Ask a proactive question only when missing information changes facts, event logistics, claims, pricing, or approval.
- End with a concrete handoff: next agent, human reviewer, or regeneration task.

## Intake Strategist (`intake-strategist`)

Mission: Interview the user and convert business context into a complete project brief.

### Inputs
- user answers
- existing assets
- business goals

### Outputs
- project-brief.json
- brief-summary.md
- open-questions.md

### Quality Checks
- niche is explicit
- target is explicit
- offer is explicit
- approval policy is explicit

### Escalation Rules
- Ask the human when business goals conflict or publishing authority is unclear.

### Required Response Schema
```json
{
  "agentId": "intake-strategist",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Market Researcher (`market-researcher`)

Mission: Research trends, competitors, creators, formats, objections, hashtags, and content gaps.

### Inputs
- project brief
- source registry

### Outputs
- trend-report.md
- competitor-map.md
- content-opportunities.md

### Quality Checks
- sources are cited
- source risk is labeled
- claims are separated from inference

### Escalation Rules
- Do not use high-risk sources without explicit review.

### Required Response Schema
```json
{
  "agentId": "market-researcher",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Brand Strategist (`brand-strategist`)

Mission: Define positioning, voice, content pillars, and editorial rules.

### Inputs
- project brief
- research report

### Outputs
- brand-strategy.md
- content-pillars.md
- voice-guide.md

### Quality Checks
- voice is actionable
- pillars map to goals
- differentiation is concrete

### Escalation Rules
- Ask for human review if positioning implies a promise the project cannot support.

### Required Response Schema
```json
{
  "agentId": "brand-strategist",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Content Planner (`content-planner`)

Mission: Create the publishing cadence and 30-day content calendar.

### Inputs
- brand strategy
- trend report
- platform constraints

### Outputs
- 30-day-calendar.md
- content-backlog.md

### Quality Checks
- 30 days present
- formats vary
- goals and CTAs are assigned

### Escalation Rules
- Flag unrealistic cadence for available assets or hardware.

### Required Response Schema
```json
{
  "agentId": "content-planner",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Copywriter (`copywriter`)

Mission: Write hooks, captions, posts, carousel copy, CTAs, and story copy.

### Inputs
- calendar
- voice guide
- content pillars

### Outputs
- posts.md
- carousels.md
- stories.md

### Quality Checks
- hook is strong
- CTA is clear
- voice matches guide
- platform constraints met

### Escalation Rules
- Flag claims that need proof before publishing.

### Required Response Schema
```json
{
  "agentId": "copywriter",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Reel/Shorts Producer (`reel-shorts-producer`)

Mission: Create scripts, shot lists, visual beats, and editing notes for short-form video.

### Inputs
- calendar
- brand strategy
- trend report

### Outputs
- reels.md
- shot-lists.md

### Quality Checks
- first 3 seconds are specified
- visual beats are concrete
- CTA is clear

### Escalation Rules
- Flag scripts requiring unavailable assets.

### Required Response Schema
```json
{
  "agentId": "reel-shorts-producer",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Visual Director (`visual-director`)

Mission: Create local image-generation prompts, ComfyUI workflow notes, and visual art direction.

### Inputs
- brand strategy
- calendar
- model profile

### Outputs
- visual-briefs.md
- image-prompts.md
- comfyui-workflow-notes.md

### Quality Checks
- visuals match brand
- model choice fits hardware
- text-heavy graphics use suitable model

### Escalation Rules
- Flag visual concepts that require paid/unsupported models.

### Required Response Schema
```json
{
  "agentId": "visual-director",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Compliance/Platform Guardian (`compliance-platform-guardian`)

Mission: Check platform, source, licensing, and account-action risk.

### Inputs
- project artifacts
- source policy
- publishing policy

### Outputs
- risk-review.md
- blocked-actions.md

### Quality Checks
- no blocked actions
- risky modules disabled
- approval gate present

### Escalation Rules
- Block direct publish, scraping, or credential use until reviewed.

### Required Response Schema
```json
{
  "agentId": "compliance-platform-guardian",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Publishing Operator (`publishing-operator`)

Mission: Prepare drafts for official or semi-assisted IG/FB publishing after human approval.

### Inputs
- approved drafts
- platform checklist

### Outputs
- publishing-checklist.md
- export-package.md

### Quality Checks
- approval state is approved
- assets present
- platform requirements checked

### Escalation Rules
- Never publish without human approval.

### Required Response Schema
```json
{
  "agentId": "publishing-operator",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Analyst (`analyst`)

Mission: Analyze performance data and update strategy.

### Inputs
- metrics
- published content
- user feedback

### Outputs
- performance-report.md
- optimization-tasks.md

### Quality Checks
- recommendations tie to data
- confidence is labeled

### Escalation Rules
- Flag missing or unreliable metrics.

### Required Response Schema
```json
{
  "agentId": "analyst",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Persona Simulator (`persona-simulator`)

Mission: Simulate target audience reactions and produce buyer-persona reports.

### Inputs
- project brief
- draft content
- persona templates

### Outputs
- persona-report.md
- objection-map.md
- reaction-summary.md

### Quality Checks
- personas differ meaningfully
- reactions are actionable
- bias/limits noted

### Escalation Rules
- Do not treat simulation as proof of market demand.

### Required Response Schema
```json
{
  "agentId": "persona-simulator",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Critic/QA (`critic-qa`)

Mission: Review the generated workspace and list what is not good enough before human approval.

### Inputs
- all generated artifacts
- review rubric

### Outputs
- qa-recap.md
- regeneration-tasks.md

### Quality Checks
- weaknesses are specific
- fix tasks are actionable
- approval blockers are explicit

### Escalation Rules
- Escalate unresolved blockers to the human.

### Required Response Schema
```json
{
  "agentId": "critic-qa",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.

## Memory Curator (`memory-curator`)

Mission: Store user feedback as durable workspace preferences and regeneration rules.

### Inputs
- human feedback
- QA recap
- approved artifacts

### Outputs
- user-feedback.md
- preferences.json
- regeneration-queue.json

### Quality Checks
- feedback is normalized
- affected artifacts are identified

### Escalation Rules
- Ask for clarification if feedback contradicts existing approved preferences.

### Required Response Schema
```json
{
  "agentId": "memory-curator",
  "status": "completed | needs-human-input | blocked",
  "observedFacts": [
    "Only facts found in provided inputs or cited sources."
  ],
  "assumptions": [
    "Clearly labeled assumptions."
  ],
  "recommendations": [
    "Concrete next actions or artifact changes."
  ],
  "blockers": [
    "Missing proof, missing asset, policy issue, or approval gap."
  ],
  "handoff": {
    "targetAgent": "next agent id or human",
    "reason": "why the handoff is needed",
    "requiredInputs": [
      "files or answers needed next"
    ]
  }
}
```

### Stop Condition
The agent stops when its output file/draft is specific enough for the next agent or human reviewer, and all blockers are listed instead of hidden.



## Input: research/trend-report.md

# Trend Research Plan

Generated at: 2026-05-24T15:54:52.037Z

Project: Out Of Office
Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
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
- NYC networking events trend
- NYC networking events content ideas
- NYC networking events problems objections
- NYC networking events instagram reel hooks
- NYC networking events facebook community questions
- NYC corporate networking trend
- NYC corporate networking content ideas
- NYC corporate networking problems objections
- NYC corporate networking instagram reel hooks
- NYC corporate networking facebook community questions
- NYC professional networking trend
- NYC professional networking content ideas
- NYC professional networking problems objections
- NYC professional networking instagram reel hooks
- NYC professional networking facebook community questions
- NYC business networking events trend
- NYC business networking events content ideas
- NYC business networking events problems objections
- NYC business networking events instagram reel hooks
- NYC business networking events facebook community questions
- NYC founder networking events trend
- NYC founder networking events content ideas
- NYC founder networking events problems objections
- NYC founder networking events instagram reel hooks
- NYC founder networking events facebook community questions
- NYC after work networking trend
- NYC after work networking content ideas
- NYC after work networking problems objections
- NYC after work networking instagram reel hooks
- NYC after work networking facebook community questions

## Research Tasks
### research-task-01
- Query: NYC networking events trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20trend

### research-task-02
- Query: NYC networking events content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20content%20ideas

### research-task-03
- Query: NYC networking events problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20problems%20objections

### research-task-04
- Query: NYC networking events instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20instagram%20reel%20hooks

### research-task-05
- Query: NYC networking events facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20facebook%20community%20questions

### research-task-06
- Query: NYC corporate networking trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20trend

### research-task-07
- Query: NYC corporate networking content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20content%20ideas

### research-task-08
- Query: NYC corporate networking problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20problems%20objections

### research-task-09
- Query: NYC corporate networking instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20instagram%20reel%20hooks

### research-task-10
- Query: NYC corporate networking facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20facebook%20community%20questions

### research-task-11
- Query: NYC professional networking trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20trend

### research-task-12
- Query: NYC professional networking content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20content%20ideas

### research-task-13
- Query: NYC professional networking problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20problems%20objections

### research-task-14
- Query: NYC professional networking instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20instagram%20reel%20hooks

### research-task-15
- Query: NYC professional networking facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20facebook%20community%20questions

### research-task-16
- Query: NYC business networking events trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20business%20networking%20events%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20business%20networking%20events%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20business%20networking%20events%20trend

### research-task-17
- Query: NYC business networking events content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20business%20networking%20events%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20business%20networking%20events%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20business%20networking%20events%20content%20ideas

### research-task-18
- Query: NYC business networking events problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20business%20networking%20events%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20business%20networking%20events%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20business%20networking%20events%20problems%20objections

### research-task-19
- Query: NYC business networking events instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20business%20networking%20events%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20business%20networking%20events%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20business%20networking%20events%20instagram%20reel%20hooks

### research-task-20
- Query: NYC business networking events facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20business%20networking%20events%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20business%20networking%20events%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20business%20networking%20events%20facebook%20community%20questions

### research-task-21
- Query: NYC founder networking events trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20founder%20networking%20events%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20founder%20networking%20events%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20founder%20networking%20events%20trend

### research-task-22
- Query: NYC founder networking events content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20founder%20networking%20events%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20founder%20networking%20events%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20founder%20networking%20events%20content%20ideas

### research-task-23
- Query: NYC founder networking events problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20founder%20networking%20events%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20founder%20networking%20events%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20founder%20networking%20events%20problems%20objections

### research-task-24
- Query: NYC founder networking events instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20founder%20networking%20events%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20founder%20networking%20events%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20founder%20networking%20events%20instagram%20reel%20hooks

### research-task-25
- Query: NYC founder networking events facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20founder%20networking%20events%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20founder%20networking%20events%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20founder%20networking%20events%20facebook%20community%20questions

### research-task-26
- Query: NYC after work networking trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20after%20work%20networking%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20after%20work%20networking%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20after%20work%20networking%20trend

### research-task-27
- Query: NYC after work networking content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20after%20work%20networking%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20after%20work%20networking%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20after%20work%20networking%20content%20ideas

### research-task-28
- Query: NYC after work networking problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20after%20work%20networking%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20after%20work%20networking%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20after%20work%20networking%20problems%20objections

### research-task-29
- Query: NYC after work networking instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20after%20work%20networking%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20after%20work%20networking%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20after%20work%20networking%20instagram%20reel%20hooks

### research-task-30
- Query: NYC after work networking facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20after%20work%20networking%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20after%20work%20networking%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20after%20work%20networking%20facebook%20community%20questions



## Input: research/live-trend-report.md

# Live Trend Research Report

Generated at: 2026-05-24T15:55:02.498Z

Mode: live-public-sources

## Guardrails
- Public sources only; no login, no account automation, no DM/comment/like/follow actions.
- Use collected items as directional trend intelligence, not proof.
- Cite source URLs and collection dates.
- Separate observation from inference.

## Trend Items
### 1. https://luma.com/ishmpmbi?tk=zzHho4
- Source: project-link:luma
- Query: luma
- Risk: low
- Confidence: medium
- Relevance score: -
- Collected: 2026-05-24T15:54:52.044Z
- URL: https://luma.com/ishmpmbi?tk=zzHho4
- Observation: User-provided source. Review manually and use as high-context project evidence.
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 2. NameSummit - A Digital Branding Event in NYC
- Source: reddit-public
- Query: NYC networking events trend
- Risk: medium
- Confidence: low
- Relevance score: 3
- Collected: 2026-05-24T15:54:52.656Z
- URL: https://www.reddit.com/r/Entrepreneur/comments/6px0ox/namesummit_a_digital_branding_event_in_nyc/
- Observation: Hello fellow Redditors,

I am an event coordinator for NameSummit, a Digital branding and Marketing event taking place in NYC on August 7th and 8th. I am extending a personal invitation to the Reddit community for this event. 

I am excited
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 3. https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- Source: youtube-trending-and-search
- Query: NYC networking events trend
- Risk: medium
- Confidence: low
- Relevance score: 0
- Collected: 2026-05-24T15:54:55.948Z
- URL: https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- Observation: Public page snapshot collected; manual review recommended.
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 4. Building a Real-Time Platform for Bars &amp; Events - NYC Cofounder Wanted
- Source: reddit-public
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: medium
- Relevance score: 4
- Collected: 2026-05-24T15:54:57.895Z
- URL: https://www.reddit.com/r/cofounderhunt/comments/1reikwi/building_a_realtime_platform_for_bars_events_nyc/
- Observation: **A real-time customer acquisition platform , activating demand through time-sensitive drink specials and events.**

The platform is a real-time nightlife platform that gives users line of sight on live drink specials they can act on immedi
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 5. Which dress for an evening work event in NYC?
- Source: reddit-public
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: medium
- Relevance score: 3
- Collected: 2026-05-24T15:54:57.895Z
- URL: https://www.reddit.com/r/OUTFITS/comments/1t2ztqz/which_dress_for_an_evening_work_event_in_nyc/
- Observation: ⭐️Edit⭐️ Thanks for the responses everyone! I will be going with the first one, and feel very confident in doing so given all the feedback. For those who asked, the first dress is from Aritzia, but it’s at least 5 years old and no longer on
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 6. https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- Source: youtube-trending-and-search
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: low
- Relevance score: 0
- Collected: 2026-05-24T15:55:01.297Z
- URL: https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- Observation: Public page snapshot collected; manual review recommended.
- Inference: Use as directional audience/context signal only; validate before turning into claims.


## Collection Failures
- google-trends / NYC networking events trend / https://trends.google.com/trends/explore?q=NYC%20networking%20events%20trend / 429
- google-trends / NYC networking events content ideas / https://trends.google.com/trends/explore?q=NYC%20networking%20events%20content%20ideas / 429


## Input: strategy/content-pillars.md

# Content Pillars

1. Pain points and problem awareness for tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ....
2. Practical education around allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city.
3. Proof, trust, and behind-the-scenes credibility.
4. Offer-led content with human-approved CTAs.
5. Community questions, objections, and feedback loops.


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
