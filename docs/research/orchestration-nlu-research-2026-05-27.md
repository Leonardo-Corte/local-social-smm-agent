# Orchestration And NLU Research Refresh

Generated: 2026-05-27

## User Problem

The workspace chat handled a messy natural-language request as text-only content and missed the implied visual generation. It also risked forcing the current workspace business profile into an external product/link request.

## External References Checked

| Source | Useful Pattern | Decision |
| --- | --- | --- |
| OpenAI Swarm: https://github.com/openai/swarm | Lightweight agents, explicit handoffs, context variables, tool/function execution loop. | Do not vendor. Swarm is educational and API-oriented, but adopt the handoff/context-variable pattern in our native orchestrator. |
| LangGraph: https://github.com/langchain-ai/langgraph | Stateful workflows, durable execution, human-in-the-loop state, memory, traceability. | Do not add dependency now. Adopt explicit route state and trace files locally. |
| Microsoft AutoGen: https://github.com/microsoft/autogen | Multi-agent conversations, AgentTool pattern, MCP warning, benchmarking. | Do not vendor. AutoGen is Python-heavy and in maintenance mode; use the lesson that agent tools need bounded iterations and traceable outputs. |
| Semantic Router: https://github.com/aurelio-labs/semantic-router | Route objects, utterance-driven routing, local route layers, route optimization. | Do not add dependency. Implement a small local deterministic route layer in Node for no-cost routing. |
| Reddit agent framework threads | Repeated recommendation: production quality depends more on explicit state, conditional routing, observability, guardrails, and evals than framework branding. | Build native NLU router with schema, confidence, evidence, and check coverage. |

## Integration Completed

- Added `packages/orchestration/natural-language-router.js`.
- Chat now routes every natural request through a structured NLU contract before choosing a workflow.
- The route is persisted to:
  - `operations/nlu-router-latest.json`
  - `operations/nlu-router-latest.md`
- The route includes:
  - normalized user request
  - detected intent type
  - target platforms
  - specialist agent
  - required steps
  - visual/video/link/asset needs
  - direct-image vs creative-workflow decision
  - confidence score
  - evidence labels
- Existing chat helpers now call the router instead of growing ad hoc regex logic.
- Added regression checks for:
  - messy Instagram launch request with link
  - automatic visual need
  - image-only request
  - Drive/folder + X/Reddit trend + reel workflow
  - external-link scope guard

## Why No Framework Was Vendored

- LangGraph is powerful, but adding it now would introduce a large workflow/runtime layer when the current project already has filesystem state, blackboard entries, approval gates, and checks.
- AutoGen is useful conceptually, but it is Python-heavy and its upstream README points new users toward Microsoft Agent Framework.
- Semantic Router is close to the NLU need, but its main package is Python/embedding-oriented; our immediate reliability gain is covered by a small deterministic local router with no new cost or install step.
- Reddit production discussions consistently warn that control, tracing, state, and evals matter more than the framework itself.

## Next Possible Upgrade

If the deterministic router starts failing on real user prompts, add a second-pass local LLM classifier that must emit the same `nlu-router.v1` schema and is only accepted when JSON validates and confidence beats the deterministic route.
