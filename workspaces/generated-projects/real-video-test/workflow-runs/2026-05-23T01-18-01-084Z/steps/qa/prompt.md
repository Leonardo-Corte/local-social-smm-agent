# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Critic/QA

## Mission
Review the generated workspace and list what is not good enough before human approval.

## Project Context
- Project: Real Video Test
- Niche: premium hospitality events, cocktail bars, and social dining experiences
- Target: young professionals, food and drink lovers, nightlife guests, event partners, and local hospitality audiences
- 30-day goal: turn one real event video into a repeatable Instagram/Facebook content system with human-approved captions, reel angles, and follow-up posts
- Tone: warm, premium, lively, social, polished, practical

## Inputs
- all generated artifacts
- review rubric

## Outputs
- qa-recap.md
- regeneration-tasks.md

## Allowed Tools
- review-loop

## Quality Checks
- weaknesses are specific
- fix tasks are actionable
- approval blockers are explicit

## Escalation Rules
- Escalate unresolved blockers to the human.


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
Run a final adversarial QA pass. Decide what is not good enough for human approval and convert it into regeneration tasks.

## Target Artifact
review/qa-recap.md

## Inputs
## Input: review/workspace-quality-rubric.json

{
  "version": "0.1.0",
  "minimumScoreToPresent": 80,
  "dimensions": [
    {
      "id": "strategic-fit",
      "label": "Strategic fit",
      "checks": [
        "niche is clear",
        "target is clear",
        "offer and goal are clear",
        "content pillars map to business outcome"
      ]
    },
    {
      "id": "content-quality",
      "label": "Content quality",
      "checks": [
        "hooks are specific",
        "drafts match voice",
        "formats vary",
        "CTAs are concrete"
      ]
    },
    {
      "id": "local-feasibility",
      "label": "Local feasibility",
      "checks": [
        "model profile is realistic",
        "visual workload matches hardware",
        "no required paid API"
      ]
    },
    {
      "id": "platform-safety",
      "label": "Platform safety",
      "checks": [
        "no spam automation",
        "approval gate present",
        "source risk labeled",
        "risky modules disabled"
      ]
    },
    {
      "id": "actionability",
      "label": "Actionability",
      "checks": [
        "calendar is complete",
        "publishing checklist is usable",
        "regeneration tasks are specific"
      ]
    }
  ]
}


## Input: simulation/persona-report.md

# Persona Simulation Report

Generated at: 2026-05-23T01:16:21.735Z

Project: Real Video Test

## Audience Panel
### Skeptical operator
- Segment: young professionals
- Motivation: save time and avoid fragile tools
- Core objection: This sounds like setup complexity disguised as automation.
- Conversion trigger: clear before/after workflow proof

### Cost-sensitive founder
- Segment: food
- Motivation: reduce recurring SaaS costs
- Core objection: Local-first is attractive, but quality and maintenance worry me.
- Conversion trigger: specific hardware expectations and realistic limits

### Creative strategist
- Segment: drink lovers
- Motivation: produce better ideas faster
- Core objection: The content may become generic if the system does not learn taste.
- Conversion trigger: memory from feedback and strong examples

### Agency delivery lead
- Segment: nightlife guests
- Motivation: standardize client delivery
- Core objection: Approval, revisions, and client-specific voice need to be robust.
- Conversion trigger: clear review states and client-ready artifacts

### Technical early adopter
- Segment: event partners
- Motivation: own the stack and customize agents
- Core objection: I need proof that integrations are modular and not locked to a SaaS.
- Conversion trigger: repo structure, local commands, and extension points


## Summary Scores
- Average interest: 67/100
- Average trust: 62/100
- Average clarity: 65/100
- Average purchase intent: 55/100

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
- Skeptical operator: Interesting, but show me how this works in a real young professionals workflow.
- Panel moderator: The draft should first fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.


## Draft Evaluations
### Post 1 / persona-01
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real young professionals workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-02
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real food workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-03
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real drink lovers workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-04
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real nightlife guests workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-05
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real event partners workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Technical early adopter: screenshot, before/after, workflow artifact, or mini case.


## Limits
- This is a deterministic local simulation, not market proof.
- Use it to find weak claims, missing proof, unclear CTAs, and likely objections before human approval.


## Input: review/qa-recap.md

# QA Recap

## Passes
- Workspace has agent roles, calendar, drafts, visual briefs, source registry, publishing checklist, persona report, and memory.
- Publishing is human-approved by default.

## Not Good Enough Yet
- Research is placeholder-level until live trend collection is implemented.
- Draft content is sample quality, not final campaign quality.
- Model routing is profile-based, not full benchmark-based.

## Regeneration Tasks
- Replace sample research with sourced trend report.
- Generate brand-specific variants after real user interview.
- Run persona simulation with actual target segments.


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
