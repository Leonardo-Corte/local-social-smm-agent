# Repo Integration Refresh

Generated: 2026-05-26

## Question

Are there better open-source repositories for this local-first social media agent system, and should we integrate them or keep the current core?

## Verdict

Keep the current core.

The strongest external repositories are useful, but none should replace the project architecture today. The current system is already specialized around:

- deep interview -> clean project workspace
- business profile, platform playbooks, agent files, skills, policy, and task plan
- chat-first natural-language operation
- local Ollama routing
- draft-only outputs with human approval
- image/video/link ingestion
- CapCut planning
- adaptive agent orchestration with blackboard, handoffs, QA, and revision loop
- Instagram, Facebook, LinkedIn, X, and Reddit platform differences

The best upgrade path is to add narrow adapters and reference patterns, not to clone a larger framework into the core.

## Decision Matrix

| Repo | Fit | License posture | Decision | Why |
| --- | --- | --- | --- | --- |
| `calesthio/OpenMontage` | Very strong for agentic video production | AGPL-3.0 | Reference-only | Excellent pipeline, stage skill, Remotion, FFmpeg validation, and self-review ideas. Do not vendor due AGPL and runtime/provider complexity. |
| `AIDC-AI/ComfyUI-Copilot` | Very strong for image workflow intelligence | MIT | Optional adapter/reference | Best candidate for the "LLM controls ComfyUI" layer: workflow generation, debug, parameter tuning, local environment awareness. |
| `AIDC-AI/Pixelle-Video` | Strong but huge for short-video engine | Apache-2.0 | Reference-only for now | Useful architecture, but too heavy for Mac local-first core without a separate adapter spike. |
| `massgen/MassGen` | Strong generic multi-agent terminal orchestration | Audit-required | Reference-pattern-only | Good collaboration/scaling ideas; not social-specific and would replace too much of the current Node workflow. |
| `wanxingai/LightAgent` | Good lightweight skills/memory/MCP agent framework | Apache-2.0 | Reference-pattern-only | Useful for streaming, memory, and skills. Not worth migrating the core runtime. |
| `mudler/LocalAI` | Strong optional local runtime | MIT | Optional runtime adapter later | Could broaden backend support beyond Ollama, but would add setup complexity. Ollama remains simpler for the target user. |
| `langchain-ai/social-media-agent` | Good HITL social posting pattern | MIT | Pattern/reference | Useful human-in-loop flow, but less aligned with zero-cost local-only because it expects auth/provider setup. |
| `Comfy-Org/ComfyUI` | Best local visual backend | GPL-3.0 | Optional separate service | Keep as separate local backend/API. Do not copy GPL code into this repo. |
| `sun-guannan/VectCutAPI` | Strong CapCut/Jianying adapter | Apache-2.0 | Optional adapter candidate | Best CapCut API boundary candidate once our `capcut-plan.json` stabilizes. |
| `Hommy-master/capcut-mate` | Strong CapCut/Jianying adapter | MIT | Optional adapter candidate | Good FastAPI endpoint shape and LLM-tool framing. |
| `microsoft/TinyTroupe` | Strong persona simulation | MIT | Optional adapter/reference | Good for buyer/persona simulation, but current lighter persona layer is enough until deeper simulations are needed. |

## What To Integrate Next

1. **ComfyUI adapter, not ComfyUI clone**
   - Keep `creative/comfyui-plan.json` as our contract.
   - Add a local adapter that can call a running ComfyUI server.
   - Use ComfyUI-Copilot as a reference for workflow debugging and model/node recommendations.

2. **OpenMontage-inspired video pipeline**
   - Do not copy code.
   - Borrow the idea of stage manifests, provider scoring, FFmpeg validation, frame sampling, audio checks, and render self-review.
   - Map those ideas into our existing `creative:run` and `capcut:plan` flow.

3. **CapCut adapter spike**
   - Keep current `capcut-plan.json` as the product contract.
   - Test VectCutAPI first as a local server boundary.
   - Test CapCut Mate second if VectCutAPI is too Jianying-focused for the user machine.

4. **Runtime adapter later**
   - Keep Ollama default because it is already installed and simple.
   - Evaluate LocalAI only if we need OpenAI-compatible local multimodal routing across LLM, vision, audio, and image/video backends.

5. **Orchestration ideas only**
   - Use MassGen/LightAgent ideas for better blackboard summaries, run scoring, streaming, and skill memory.
   - Do not migrate the whole agent runtime unless local performance proves the current Node orchestrator cannot scale.

## Rejected For Core Replacement

- **OpenMontage as core**: stronger for full video production, weaker for this specific chat-first SMM workspace because it is AGPL, provider-heavy, and not built around IG/FB/X/Reddit approval workflows.
- **ComfyUI as core**: unbeatable visual backend, but wrong as the main SMM brain. It should stay a visual generation service.
- **MassGen/LightAgent as core**: useful agent frameworks, but adopting them would create a second orchestration system and slow down the product before proving better output.
- **LangChain social media agent as core**: good social HITL reference, but it leans toward service auth and social account connections; our guardrails need draft-first/manual approval.

## Current Confidence

High for "keep the core, integrate adapters."

Medium for exact adapter order because the next proof should be an install/run spike on the user's Mac:

1. ComfyUI local adapter
2. VectCutAPI local adapter
3. OpenMontage-style validation/reporting inside our creative workflow
4. Optional LocalAI runtime backend

## Guardrail

No external repository should be cloned into product code until:

- license is explicitly compatible with the intended boundary
- install works on the target machine
- it preserves no-cost/local-first operation
- it does not add DM/comment/like/follow/vote automation
- it keeps publishing human-approved
- it improves measurable output quality or speed
