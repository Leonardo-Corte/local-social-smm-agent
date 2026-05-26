# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Memory Curator

## Mission
Store user feedback as durable workspace preferences and regeneration rules.

## Project Context
- Project: Sample Local Social Team
- Niche: local-first AI tools for creators and small businesses
- Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
- 30-day goal: validate positioning and publish consistently with human-approved drafts
- Tone: sharp, useful, practical, slightly bold

## Inputs
- human feedback
- QA recap
- approved artifacts

## Outputs
- user-feedback.md
- preferences.json
- regeneration-queue.json

## Allowed Tools
- memory

## Quality Checks
- feedback is normalized
- affected artifacts are identified

## Escalation Rules
- Ask for clarification if feedback contradicts existing approved preferences.


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
Summarize reusable preferences, rejected patterns, and regeneration tasks learned from this workflow run.

## Target Artifact
memory/preferences.json

## Inputs
## Input: memory/user-feedback.md

# User Feedback Memory

Store human feedback here. Each item should include:
- Date
- Artifact
- Feedback
- Preference learned
- Regeneration target


## Input: memory/preferences.json

{
  "preferences": [],
  "rejectedPatterns": [],
  "approvedPatterns": []
}


## Input: memory/regeneration-queue.json

{
  "tasks": [
    {
      "id": "workflow-prompt-packet-intake-project-brief-json-execute-intake-strategist-step-with-a-local-model-and-review-the-resulting-output-before-ch",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "intake",
      "agentId": "intake-strategist",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/intake/prompt.md",
      "feedback": "Execute intake-strategist step with a local model and review the resulting output before changing project-brief.json.",
      "target": "project-brief.json",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.453Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-research-research-trend-report-md-execute-market-researcher-step-with-a-local-model-and-review-the-resulting-output-b",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "research",
      "agentId": "market-researcher",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/research/prompt.md",
      "feedback": "Execute market-researcher step with a local model and review the resulting output before changing research/trend-report.md.",
      "target": "research/trend-report.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-strategy-strategy-content-pillars-md-execute-brand-strategist-step-with-a-local-model-and-review-the-resulting-output",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "strategy",
      "agentId": "brand-strategist",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/strategy/prompt.md",
      "feedback": "Execute brand-strategist step with a local model and review the resulting output before changing strategy/content-pillars.md.",
      "target": "strategy/content-pillars.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-calendar-calendar-30-day-calendar-md-execute-content-planner-step-with-a-local-model-and-review-the-resulting-output-",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "calendar",
      "agentId": "content-planner",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/calendar/prompt.md",
      "feedback": "Execute content-planner step with a local model and review the resulting output before changing calendar/30-day-calendar.md.",
      "target": "calendar/30-day-calendar.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-copy-drafts-posts-md-execute-copywriter-step-with-a-local-model-and-review-the-resulting-output-before-changing-draft",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "copy",
      "agentId": "copywriter",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/copy/prompt.md",
      "feedback": "Execute copywriter step with a local model and review the resulting output before changing drafts/posts.md.",
      "target": "drafts/posts.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-video-drafts-reels-md-execute-reel-shorts-producer-step-with-a-local-model-and-review-the-resulting-output-before-cha",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "video",
      "agentId": "reel-shorts-producer",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/video/prompt.md",
      "feedback": "Execute reel-shorts-producer step with a local model and review the resulting output before changing drafts/reels.md.",
      "target": "drafts/reels.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-visuals-creative-visual-briefs-md-execute-visual-director-step-with-a-local-model-and-review-the-resulting-output-bef",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "visuals",
      "agentId": "visual-director",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/visuals/prompt.md",
      "feedback": "Execute visual-director step with a local model and review the resulting output before changing creative/visual-briefs.md.",
      "target": "creative/visual-briefs.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-compliance-review-qa-recap-md-execute-compliance-platform-guardian-step-with-a-local-model-and-review-the-resulting-o",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "compliance",
      "agentId": "compliance-platform-guardian",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/compliance/prompt.md",
      "feedback": "Execute compliance-platform-guardian step with a local model and review the resulting output before changing review/qa-recap.md.",
      "target": "review/qa-recap.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-publishing-publishing-publishing-checklist-md-execute-publishing-operator-step-with-a-local-model-and-review-the-resu",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "publishing",
      "agentId": "publishing-operator",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/publishing/prompt.md",
      "feedback": "Execute publishing-operator step with a local model and review the resulting output before changing publishing/publishing-checklist.md.",
      "target": "publishing/publishing-checklist.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-persona-simulation-persona-report-md-execute-persona-simulator-step-with-a-local-model-and-review-the-resulting-outpu",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "persona",
      "agentId": "persona-simulator",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/persona/prompt.md",
      "feedback": "Execute persona-simulator step with a local model and review the resulting output before changing simulation/persona-report.md.",
      "target": "simulation/persona-report.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-qa-review-qa-recap-md-execute-critic-qa-step-with-a-local-model-and-review-the-resulting-output-before-changing-revie",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "qa",
      "agentId": "critic-qa",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/qa/prompt.md",
      "feedback": "Execute critic-qa step with a local model and review the resulting output before changing review/qa-recap.md.",
      "target": "review/qa-recap.md",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "id": "workflow-prompt-packet-memory-memory-preferences-json-execute-memory-curator-step-with-a-local-model-and-review-the-resulting-output-before-",
      "createdAt": "2026-05-22T19:24:56.368Z",
      "source": "workflow-runner",
      "workflowRun": "workflow-runs/2026-05-22T19-24-56-279Z",
      "stepId": "memory",
      "agentId": "memory-curator",
      "artifact": "workflow-runs/2026-05-22T19-24-56-279Z/steps/memory/prompt.md",
      "feedback": "Execute memory-curator step with a local model and review the resulting output before changing memory/preferences.json.",
      "target": "memory/preferences.json",
      "status": "needs_local_model_run",
      "priority": 3,
      "action": "execute_agent_step",
      "completedAt": "2026-05-22T19:25:17.454Z",
      "processor": "workflow-task-router-v0.1",
      "note": "Run npm run workflow:run <workspace> -- --execute after installing/starting a local model backend."
    },
    {
      "createdAt": "2026-05-22T23:33:58.392Z",
      "artifact": "simulation/persona-report.md",
      "feedback": "Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.",
      "target": "drafts/posts.md",
      "status": "pending",
      "source": "persona-sim",
      "priority": 1
    },
    {
      "createdAt": "2026-05-22T23:33:58.392Z",
      "artifact": "simulation/persona-report.md",
      "feedback": "Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.",
      "target": "drafts/posts.md",
      "status": "pending",
      "source": "persona-sim",
      "priority": 2
    },
    {
      "createdAt": "2026-05-22T23:33:58.392Z",
      "artifact": "simulation/persona-report.md",
      "feedback": "Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.",
      "target": "drafts/posts.md",
      "status": "pending",
      "source": "persona-sim",
      "priority": 3
    },
    {
      "createdAt": "2026-05-22T23:33:58.392Z",
      "artifact": "simulation/persona-report.md",
      "feedback": "Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.",
      "target": "drafts/posts.md",
      "status": "pending",
      "source": "persona-sim",
      "priority": 4
    },
    {
      "createdAt": "2026-05-22T23:33:58.392Z",
      "artifact": "simulation/persona-report.md",
      "feedback": "Add a concrete proof point for the Technical early adopter: screenshot, before/after, workflow artifact, or mini case.",
      "target": "drafts/posts.md",
      "status": "pending",
      "source": "persona-sim",
      "priority": 5
    }
  ]
}


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


## Output Contract
- Be specific to this workspace.
- Flag assumptions and risks.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- End with concrete next regeneration or approval steps.
