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

## Business Profile
No business profile yet. Infer carefully from the brief and ask only for fact-critical gaps.

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


## Input: operations/current-request.md

# Current User Request

Created at: 2026-05-25T23:19:24.059Z

Intent: reel

Target: drafts/reels.md

Requested steps: strategy, video, capcut, qa

## User Request
generami un reel Instagram per questo sistema AI locale: mostra come si creano contenuti professionali senza API a pagamento, tutto gira sul Mac con Ollama, zero abbonamenti, approvazione umana prima della pubblicazione. Tono: pratico, sharp, credibile. Nessun claim inventato.


## Input: operations/agent-operating-contracts.md

# Agent Operating Contracts

Every agent must stay inside the generated workspace context. The system is human-approved: agents can propose, critique, generate drafts, and prepare exports, but they cannot publish, DM, comment, like, follow, bypass credentials, or invent proof.

## Global Output Rules
- Start from `business/business.md` when it exists.
- Separate observed facts, assumptions, recommendations, and blockers.
- Cite source URLs or file paths when using research, trend, repo, video, or publishing evidence.
- Ask a proactive question only when missing information changes facts, event logistics, claims, pricing, or approval.
- Use `platforms/platform-playbooks.md` when it exists; Instagram, Facebook, LinkedIn, X, and Reddit require different research, formats, audience assumptions, and approval blockers.
- Treat X and Reddit account-facing actions as blocked unless a human uses a manual or official approved path.
- For Reddit, include subreddit-rule review as a blocker before any draft can be used publicly.
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

## Platform Strategist (`platform-strategist`)

Mission: Adapt research, content format, audience psychology, and approval blockers for each platform: Instagram, Facebook, LinkedIn, X, and Reddit.

### Inputs
- business profile
- platform playbooks
- trend report
- current request

### Outputs
- platform-fit.md
- format-rules.md
- platform-specific-brief.md

### Quality Checks
- platform is explicit
- format matches platform behavior
- research sources match platform risk
- approval blockers are platform-specific

### Escalation Rules
- Block Reddit drafts until subreddit rules are checked.
- Block X/Reddit account-facing automation unless reviewed through official/manual paths.

### Required Response Schema
```json
{
  "agentId": "platform-strategist",
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

## CapCut Editor (`capcut-editor`)

Mission: Translate a reel script and asset intelligence into a precise, second-by-second CapCut edit plan with overlay text, animations, sound direction, and caption strategy.

### Inputs
- drafts/reels.md
- creative/capcut-plan.json
- assets/analysis (reel intelligence)
- business/business.md

### Outputs
- creative/capcut-plan.json (refined)
- CapCut Assembly Plan JSON block in reels.md

### Quality Checks
- hook overlay starts at 0s and ends by 3.0s
- no overlay text exceeds 10 words
- overlay timings do not overlap
- CTA text contains approval-gated placeholder, not a live link
- sound direction is specific (source, volume level, style)
- all overlay text can be verified from project brief

### Escalation Rules
- Block if source video duration is unknown — timing cannot be set without it.
- Flag if transcript is needed but not available.
- Flag if asset file path is not confirmed on disk.
- Never invent event details, attendance numbers, or pricing in overlay text.

### Required Response Schema
```json
{
  "agentId": "capcut-editor",
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
