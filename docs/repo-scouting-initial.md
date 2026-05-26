# Initial Repo and Model Scouting

Date: 2026-05-22

Purpose: first reconnaissance for the local-first IG/FB content agent workspace factory.

## Integration Philosophy
Build a project-owned modular mega-repo. Use permissive repositories directly when they pass audit. Keep restrictive or risky projects as separate optional modules or inspiration. Recreate valuable behavior with original code when direct reuse is not clean.

## Candidate Repositories

### Core Social Management / Scheduling

| Repo | Role | License posture | Initial decision |
| --- | --- | --- | --- |
| `brightbeanxyz/brightbean-studio` | Self-hosted social management dashboard, workspaces, approvals, scheduling, official integrations | Audit required | High-priority architecture/reference candidate |
| `gitroomhq/postiz-app` | Mature self-hosted scheduler, compliance-minded OAuth approach | AGPL-3.0 | Reference or separate service, not copied core |
| `trypost-it/trypost` | Social scheduler with MCP/API, brand profile, AI carousel ideas | AGPL-3.0 | Reference or separate module |
| `langchain-ai/social-media-agent` | HITL generation/scheduling graph patterns | Audit required | Pattern reference for human-in-loop flow |

### Agent Skills / Content Strategy

| Repo | Role | License posture | Initial decision |
| --- | --- | --- | --- |
| `blacktwist/social-media-skills` | Social media context, strategy, calendar, post, carousel, caption, analysis skills | MIT | Strong candidate for direct import/adaptation after audit |
| `apify/agent-skills` | Scraping/data skills for agent environments | Platform/API cost risk | Reference only unless free/local paths are possible |

### Persona and Audience Simulation

| Repo | Role | License posture | Initial decision |
| --- | --- | --- | --- |
| `microsoft/TinyTroupe` | Persona simulation for business insights | Audit required | Strong candidate for persona report subsystem |
| `idiap/sdialog` | MIT persona-driven multi-agent dialog simulation and evaluation | MIT | Strong candidate for reusable simulation/evaluation patterns |
| `OminousIndustries/TinyTroupeOllama` | TinyTroupe fork adapted toward local Ollama | Fork/audit required | Inspect for local-backend adaptation ideas |

### Visual Generation

| Repo / project | Role | License posture | Initial decision |
| --- | --- | --- | --- |
| `Comfy-Org/ComfyUI` | Local visual generation backend and workflow graph | Open-source, audit exact license/deps | Primary local image workflow backend candidate |
| Qwen-Image | Text-heavy social graphics and image editing candidate | Apache 2.0 per Comfy docs | High-priority model candidate |
| FLUX family | High-quality image generation | License differs by model | Candidate only after exact model license audit |

### Automation / Browser / Risky Modules

| Repo | Role | License posture | Initial decision |
| --- | --- | --- | --- |
| `Traffgain/Traffgain` | IG/FB local automation claims | Audit required, ToS risk | Experimental/reference only |
| `GramAddict/bot` | Instagram Android automation | Risky account automation | Experimental/reference only, disabled by default |
| `profullstack/social-poster` | Browser automation posting | Risky but useful selector/session ideas | Experimental/reference only |
| `WillReynolds5/AutoGPT-Social` | Auto-generated Instagram content optimization | Older/OpenAI/instagrapi risk | Inspiration only |

## Public Source / Platform Constraints

Meta-related automation should be conservative:
- Publishing should prefer official APIs and OAuth where feasible.
- Human preview/approval is mandatory before account actions.
- Meta terms prohibit unauthorized automated data collection, so trend collection should prioritize non-Meta public sources, official APIs, manual exports, search/trend sites, RSS, and browser-assisted review.
- Instagram/Facebook scraping or bot modules must be isolated, disabled by default, and clearly marked experimental.

## Model Routing Hypothesis

### Local Text Models
Exact model choices must be re-validated during implementation because open-weight rankings change quickly. The model router should support:
- Apple Silicon: MLX, Ollama, llama.cpp, quantized 7B-32B class models.
- NVIDIA: vLLM, Ollama, llama.cpp, larger MoE or dense models depending on VRAM.
- CPU/weak hardware: small instruct models and batch/offline workflows.

### Local Image Models
Primary backend: ComfyUI.

Initial candidates:
- Qwen-Image for social graphics with text because it is reported as Apache 2.0 and strong at multilingual text rendering.
- FLUX variants for photorealism and style generation after license audit.
- Smaller fallback models for weak hardware.

## Next Audit Tasks
1. Clone or inspect candidate repos one by one.
2. Record license, stars/activity, language stack, install complexity, API dependencies, and ToS risk.
3. Decide `core`, `integration`, `vendor`, `reference`, or `experimental`.
4. Build a clean monorepo scaffold.
5. Implement hardware detection and model profile registry first, so every agent can target realistic local capacity.
