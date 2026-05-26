# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Persona Simulator

## Mission
Simulate target audience reactions and produce buyer-persona reports.

## Project Context
- Project: Out Of Office E2E Test
- Niche: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City
- Target: corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe
- 30-day goal: generate high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events
- Tone: social, polished, energetic, witty, aspirational but not fake

## Inputs
- project brief
- draft content
- persona templates

## Outputs
- persona-report.md
- objection-map.md
- reaction-summary.md

## Allowed Tools
- persona-sim

## Quality Checks
- personas differ meaningfully
- reactions are actionable
- bias/limits noted

## Escalation Rules
- Do not treat simulation as proof of market demand.


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
Use the existing persona report and drafts to identify likely objections, drop-off points, and content improvements.

## Target Artifact
simulation/persona-report.md

## Inputs
## Input: simulation/persona-report.md

# Persona Simulation Report

Generated at: 2026-05-23T08:19:59.271Z

Project: Out Of Office E2E Test

## Audience Panel
### Skeptical operator
- Segment: corporate professionals
- Motivation: save time and avoid fragile tools
- Core objection: This sounds like setup complexity disguised as automation.
- Conversion trigger: clear before/after workflow proof

### Cost-sensitive founder
- Segment: founders
- Motivation: reduce recurring SaaS costs
- Core objection: Local-first is attractive, but quality and maintenance worry me.
- Conversion trigger: specific hardware expectations and realistic limits

### Creative strategist
- Segment: operators
- Motivation: produce better ideas faster
- Core objection: The content may become generic if the system does not learn taste.
- Conversion trigger: memory from feedback and strong examples

### Agency delivery lead
- Segment: creatives
- Motivation: standardize client delivery
- Core objection: Approval, revisions, and client-specific voice need to be robust.
- Conversion trigger: clear review states and client-ready artifacts

### Technical early adopter
- Segment: consultants
- Motivation: own the stack and customize agents
- Core objection: I need proof that integrations are modular and not locked to a SaaS.
- Conversion trigger: repo structure, local commands, and extension points


## Summary Scores
- Average interest: 67/100
- Average trust: 62/100
- Average clarity: 60/100
- Average purchase intent: 53/100

## Top Fixes
- Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Technical early adopter: screenshot, before/after, workflow artifact, or mini case.

## Persona Panel Dialogue
### Post 1
- Likely decision: not_ready
- Dominant objection: Needs concrete proof or before/after example.
- Skeptical operator: Needs concrete proof or before/after example.
- Skeptical operator: Interesting, but show me how this works in a real corporate professionals workflow.
- Panel moderator: The draft should first fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.


## Draft Evaluations
### Post 1 / persona-01
- Interest: 67/100
- Trust: 62/100
- Clarity: 60/100
- Purchase intent: 53/100
- Likely reaction: Interesting, but show me how this works in a real corporate professionals workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-02
- Interest: 67/100
- Trust: 62/100
- Clarity: 60/100
- Purchase intent: 53/100
- Likely reaction: Interesting, but show me how this works in a real founders workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-03
- Interest: 67/100
- Trust: 62/100
- Clarity: 60/100
- Purchase intent: 53/100
- Likely reaction: Interesting, but show me how this works in a real operators workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-04
- Interest: 67/100
- Trust: 62/100
- Clarity: 60/100
- Purchase intent: 53/100
- Likely reaction: Interesting, but show me how this works in a real creatives workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-05
- Interest: 67/100
- Trust: 62/100
- Clarity: 60/100
- Purchase intent: 53/100
- Likely reaction: Interesting, but show me how this works in a real consultants workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Technical early adopter: screenshot, before/after, workflow artifact, or mini case.


## Limits
- This is a deterministic local simulation, not market proof.
- Use it to find weak claims, missing proof, unclear CTAs, and likely objections before human approval.


## Input: drafts/posts.md

# Draft Posts

## Post 1
Hook: Stop paying for a social stack before your content system is even working.

Body: corporate professionals, founders, operators, creatives, consultants, finance and tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe need a repeatable local-first workflow: strategy, drafts, review, and publishing discipline before more SaaS.

CTA: Save this and review your current content workflow.


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
