# Agent Orchestration GitHub Audit

Generated at: 2026-05-24

## Goal

Find reusable open-source patterns for the missing advanced layer: agents hand off context to each other, a supervisor/team runner coordinates the sequence, and final outputs are written to the correct workspace artifact instead of staying only in run reports.

## Repos Reviewed Locally

### langchain-ai/langgraph-supervisor-js
- Local reference path: `reference/github-agent-orchestration/langgraph-supervisor-js`
- License: MIT
- Relevant pattern: supervisor coordinates specialized agents, tool-style handoff, message history control.
- Decision: reference pattern only for now. Do not add LangGraph dependency yet because this project is deliberately no-cost/local-first and already has a lightweight Node runner.
- Integrated idea: supervisor/team runner plus explicit handoff context between steps.

### ReinaMacCredy/maestro
- Local reference path: `reference/github-agent-orchestration/maestro`
- License: MIT
- Relevant pattern: local-first filesystem state, handoff envelopes, evidence, task lifecycle, inspectable run artifacts.
- Decision: reference pattern only for now. Do not vendor or depend on Maestro; recreate the smaller idea that fits this social workspace.
- Integrated idea: on-disk `handoff.json`, `handoffs.json`, team-run summaries, final artifact, content policy evidence.

### crewAIInc/crewAI
- Clone attempt: interrupted/removed because the shallow clone was too heavy for this immediate integration pass.
- Decision: keep as conceptual candidate for later comparison, but no local code retained and no integration made.

## Implemented Local Pattern

- `packages/workflow-runner/team-orchestrator.js`
  - Runs a compact social team chain for a user request.
  - Writes `operations/current-request.md`.
  - Runs compact specialist steps with previous handoffs included.
  - Stores per-agent `prompt.md`, `output.md`, and `handoff.json`.
  - Stores combined `handoffs.json`.
  - Synthesizes the final artifact for the correct target file.
  - Runs content policy audit and revision/fallback loops.
  - Applies output only as `needs_human_review`; never publishes.

- `apps/workspace-generator/bin/run-team-orchestration.js`
  - CLI entrypoint:
    `npm run team:run <workspace> -- --type carousel --request "..."`

- `apps/workspace-generator/bin/workspace-chat.js`
  - Chat `/make` and natural content-generation requests now route into the team orchestrator.

## Guardrails Preserved

- No automatic publishing.
- No DM/comment/like/follow automation.
- No private scraping.
- No vendored external repo code.
- External repos are stored under `reference/` for audit/reference, not imported as product code.
- Final artifacts require human approval.
