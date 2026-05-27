# Orchestration Performance Audit

Date: 2026-05-26

Scope: `Leonardo-Corte/local-social-smm-agent`, local-first social media agent workflow.

## Verdict

The system can support the intended chat-first workflow, but the slow/stupid feeling came from three concrete architecture problems:

1. The most used creative workflow still called the older linear team runner instead of the adaptive blackboard runner.
2. Natural chat sometimes executed a full workflow and then made an extra generic chat LLM call, doubling latency and muddying the answer.
3. Creative brainstorming used many sequential local-model calls; on a MacBook/Ollama setup this is expensive and often weaker than one compact, role-aware council pass.

## External Patterns Checked

- LangChain's social media agent emphasizes human-in-the-loop approval and customizable business/style prompts.
- MassGen emphasizes parallel/collective agent work, shared collaboration state, consensus, and structured logs.
- ComfyUI-Copilot uses a hierarchical assistant plus specialized workers for image workflow construction.
- SciTalk short-form generation uses specialized agents plus iterative feedback from simulated user roles.
- Reddit practitioner feedback points to an editorial workflow: policy/compliance, reviewer/editor stage, platform-specific tone, and human editing.

## Changes Applied

### Adaptive Orchestration Now Drives Creative Runs

`packages/workflow-runner/creative-orchestrator.js` now calls `runAdaptiveTeamOrchestration` instead of the older `runTeamOrchestration`.

Impact:
- shared blackboard entries for decisions, risks, handoffs, blockers
- revision loop support
- orchestration report per team run
- no final artifact if every local model step fails

### Chat No Longer Double-Runs After Workflows

`apps/workspace-generator/bin/workspace-chat.js` now returns after a natural-language workflow has already produced a run summary.

Impact:
- lower latency
- less confusing assistant output
- the user sees the actual artifacts/reports instead of a second generic answer

### Fast Creative Council

`packages/orchestration/brainstorm-engine.js` now defaults to a `council` mode: one structured local-model call simulates all selected creative agents, their challenges/builds, and the creative director synthesis.

Use full multi-call mode when needed:

```bash
SMM_BRAINSTORM_MODE=full npm run workspace:chat <workspace> -- --model qwen2.5:14b
```

Impact:
- much faster on single-machine Ollama
- keeps agent role separation
- keeps creative-room artifacts
- avoids 10+ sequential calls for one brainstorm

### Better Ollama Context Defaults

`packages/local-runtime/model-client.js` now sends dynamic `num_ctx`, `num_predict`, temperature, top-p, repeat penalty, and `keep_alive`.

Impact:
- fewer context-loss failures on long workspace prompts
- less model reload overhead
- still overrideable:

```bash
SMM_OLLAMA_NUM_CTX=8192 SMM_OLLAMA_KEEP_ALIVE=20m npm run workspace:chat <workspace>
```

### Smarter Image Prompting From Chat

Natural-language image generation now runs the prompt engineer against:
- business profile
- latest image intelligence
- latest link intelligence
- user request

It writes:

```text
creative/image-prompt-engineer-latest.md
```

Impact:
- image prompts are no longer simple regex-cleaned user text
- generated visuals are more tied to brand/context
- style/rationale are auditable before human approval

## Remaining Constraints

- Pollinations image generation is free but not local. For strict local-only image generation, the next implementation should wire ComfyUI execution, model detection, and image QA.
- X research remains manual/public-link oriented by policy; no login scraping or account automation.
- Reddit research can collect public signals, but subreddit-rule review remains human-approved.
- Publishing remains manual/official/human-approved by design.

