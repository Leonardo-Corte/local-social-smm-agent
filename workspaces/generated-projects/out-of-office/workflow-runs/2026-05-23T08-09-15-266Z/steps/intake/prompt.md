# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Intake Strategist

## Mission
Interview the user and convert business context into a complete project brief.

## Project Context
- Project: Out Of Office
- Niche: premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City
- Target: corporate professionals, founders, operators, creatives, consultants, finance/tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe
- 30-day goal: generate viral or high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events
- Tone: social, polished, energetic, witty, aspirational but not fake

## Inputs
- user answers
- existing assets
- business goals

## Outputs
- project-brief.json
- brief-summary.md
- open-questions.md

## Allowed Tools
- interview-engine
- memory

## Quality Checks
- niche is explicit
- target is explicit
- offer is explicit
- approval policy is explicit

## Escalation Rules
- Ask the human when business goals conflict or publishing authority is unclear.


## Project Brief
```json
{
  "projectName": "Out Of Office",
  "niche": "premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City",
  "targetAudience": "corporate professionals, founders, operators, creatives, consultants, finance/tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe",
  "primaryGoal30Days": "generate viral or high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events",
  "offer": "fun, curated networking events in New York where interesting people meet through a social hospitality experience; sell event tickets and grow the community around the Out Of Office brand",
  "tone": "social, polished, energetic, witty, aspirational but not fake",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers, guest identities, partnerships, pricing, or event claims",
    "keep the brand premium and social, not corporate-boring"
  ],
  "availableAssets": [
    "foto",
    "video",
    "sito",
    "e eventi e luma come distrubuzione",
    "un nostro main mcompetitor ma non a new york",
    "è a roma ed è il Post Office a roma"
  ],
  "approvalPolicy": "io leonardo corte o ludovico margio o cristian google",
  "createdAt": "2026-05-23T08:08:01.821Z"
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
Review the project brief and identify missing context, contradictions, and personalization tasks before content work starts.

## Target Artifact
project-brief.json

## Inputs
## Input: project-brief.json

{
  "projectName": "Out Of Office",
  "niche": "premium after-work networking events for corporate professionals and ambitious people seeking real connections in New York City",
  "targetAudience": "corporate professionals, founders, operators, creatives, consultants, finance/tech workers, and socially ambitious newcomers in New York who want high-quality networking without a stiff conference vibe",
  "primaryGoal30Days": "generate viral or high-retention reels, increase ticket sales, and grow Instagram/Facebook profile follows for upcoming Out Of Office events",
  "offer": "fun, curated networking events in New York where interesting people meet through a social hospitality experience; sell event tickets and grow the community around the Out Of Office brand",
  "tone": "social, polished, energetic, witty, aspirational but not fake",
  "platforms": [
    "instagram",
    "facebook"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers, guest identities, partnerships, pricing, or event claims",
    "keep the brand premium and social, not corporate-boring"
  ],
  "availableAssets": [
    "foto",
    "video",
    "sito",
    "e eventi e luma come distrubuzione",
    "un nostro main mcompetitor ma non a new york",
    "è a roma ed è il Post Office a roma"
  ],
  "approvalPolicy": "io leonardo corte o ludovico margio o cristian google",
  "createdAt": "2026-05-23T08:08:01.821Z"
}


## Input: memory/preferences.json

{
  "preferences": [],
  "rejectedPatterns": [],
  "approvedPatterns": []
}


## Input: memory/user-feedback.md

# User Feedback Memory

Store human feedback here. Each item should include:
- Date
- Artifact
- Feedback
- Preference learned
- Regeneration target


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
