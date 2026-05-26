# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Critic/QA

## Mission
Review the generated workspace and list what is not good enough before human approval.

## Project Context
- Project: Sample Local Social Team
- Niche: local-first AI tools for creators and small businesses
- Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
- 30-day goal: validate positioning and publish consistently with human-approved drafts
- Tone: sharp, useful, practical, slightly bold

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
Run a final adversarial QA pass. Decide what is not good enough for human approval and convert it into regeneration tasks.

## Target Artifact
review/qa-recap.md

## Inputs
## Input: operations/current-request.md

# Current User Request

Created at: 2026-05-25T23:19:24.059Z

Intent: reel

Target: drafts/reels.md

Requested steps: strategy, video, capcut, qa

## User Request
generami un reel Instagram per questo sistema AI locale: mostra come si creano contenuti professionali senza API a pagamento, tutto gira sul Mac con Ollama, zero abbonamenti, approvazione umana prima della pubblicazione. Tono: pratico, sharp, credibile. Nessun claim inventato.


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

Generated at: 2026-05-22T23:33:58.390Z

Project: Sample Local Social Team

## Audience Panel
### Skeptical operator
- Segment: solo creators
- Motivation: save time and avoid fragile tools
- Core objection: This sounds like setup complexity disguised as automation.
- Conversion trigger: clear before/after workflow proof

### Cost-sensitive founder
- Segment: small agencies
- Motivation: reduce recurring SaaS costs
- Core objection: Local-first is attractive, but quality and maintenance worry me.
- Conversion trigger: specific hardware expectations and realistic limits

### Creative strategist
- Segment: founders who want professional social content without recurring SaaS costs
- Motivation: produce better ideas faster
- Core objection: The content may become generic if the system does not learn taste.
- Conversion trigger: memory from feedback and strong examples

### Agency delivery lead
- Segment: solo creators
- Motivation: standardize client delivery
- Core objection: Approval, revisions, and client-specific voice need to be robust.
- Conversion trigger: clear review states and client-ready artifacts

### Technical early adopter
- Segment: small agencies
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
- Skeptical operator: Interesting, but show me how this works in a real solo creators workflow.
- Panel moderator: The draft should first fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.


## Draft Evaluations
### Post 1 / persona-01
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real solo creators workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-02
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real small agencies workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-03
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real founders who want professional social content without recurring SaaS costs workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-04
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real solo creators workflow.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.

### Post 1 / persona-05
- Interest: 67/100
- Trust: 62/100
- Clarity: 65/100
- Purchase intent: 55/100
- Likely reaction: Interesting, but show me how this works in a real small agencies workflow.
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

# Draft post

Request: Create a short approval-gated Instagram draft for a test event.

## Draft Direction
Create a concise, premium, proof-aware artifact for Out Of Office. Keep all claims conservative and leave missing facts as approval blockers.

## Prior Agent Notes
# copywriter Fallback Handoff

Status: fallback_template

The local model step did not complete in time, so this structured fallback keeps the team chain usable.

## Observed Facts
- User request: Create a short approval-gated Instagram draft for a test event.
- Intent: post
- Previous handoffs are available and should be preserved.

## Assumptions
- The final artifact must stay draft-only and require human approval.
- Missing facts should become approval blockers, not invented claims.

## Draft/Recommendation For This Step
Draft the requested social content or message. Adapt format and tone to the platform; keep it specific, premium, and proof-aware.

Use the previous handoff context below and keep the artifact concise, proof-aware, and specific:

No previous handoffs.

## Approval Blockers
- Confirm event details before publishing.
- Confirm ticket inclusions before mentioning food/drinks.
- Confirm any attendance, venue, guest, or partnership claim before use.

## Agent Handoff
The next agent should keep the request focused, avoid invented numbers or status claims, and verify the final draft against content policy.

Fallback reason: This operation was aborted


## Approval Blockers
- Confirm event details before publishing.
- Confirm claims and asset usage before approval.


## Previous Agent Handoffs
## Handoff From brand-strategist (strategy)
Status: saved_prompt_packet
Target: strategy/content-pillars.md

Prompt packet saved. Run with --execute to use a detected local Ollama model.


## Handoff From reel-shorts-producer (video)
Status: saved_prompt_packet
Target: drafts/reels.md

Prompt packet saved. Run with --execute to use a detected local Ollama model.



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
