# Agent Model Routing From Benchmark

Generated at: 2026-05-25T20:36:51.808Z

Workspace: out-of-office

Timeout per task: 45000 ms

## Routing
| Agent | Recommended local model | Status |
| --- | --- | --- |
| brand-strategist | qwen2.5-coder:14b | recommended |
| copywriter | qwen2.5-coder:14b | recommended |
| critic-qa | qwen2.5-coder:14b | recommended |
| persona-simulator | none | fallback-required |

## Policy
- Use benchmark routing for agent roles only after at least one successful task score.
- If a role has no recommendation, use the default local route with shorter prompts and more human review.
- Slow/timeout roles should run compact prompts first, then escalate only when needed.
- No paid API fallback is enabled by this file.
