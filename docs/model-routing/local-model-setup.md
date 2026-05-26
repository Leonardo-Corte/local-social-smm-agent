# Local Model Setup Wizard

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
| Ollama | yes | ollama-api |
| MLX LM | no | - |
| llama.cpp | no | - |
| vLLM | no | - |
| ComfyUI | no | - |
| NVIDIA SMI | no | - |

## Text Models

### Frontier local reasoning/copy tier
- Role: strategy, critique, long-form copy, persona simulation
- Candidate tier: quantized 14B-32B+ open-weight instruct/reasoning model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing, vllm:missing
- License posture: audit exact checkpoint before download
- Notes: Use for strategist, critic, copywriter, and persona-simulation passes when RAM/VRAM allows.

### Fast local operator tier
- Role: summaries, extraction, task routing, checklist generation
- Candidate tier: quantized 3B-9B instruct model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing
- License posture: audit exact checkpoint before download
- Notes: Use for repeatable low-cost internal tasks so the strongest model is reserved for high-leverage thinking.

## Vision Models

### Frontier local vision tier
- Role: image understanding, social asset analysis, visual QA, screenshot/link creative context
- Candidate tier: Qwen2.5-VL 7B/32B or comparable open-weight VLM depending on memory
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing
- License posture: audit exact checkpoint license before client/commercial use
- Notes: Default for MacBook Pro Apple Silicon class machines. Use it to inspect uploaded images before copy, carousel, and platform adaptation work.

### Fast local vision tier
- Role: quick visual summaries, lightweight image triage, attachment routing
- Candidate tier: small open-weight VLM for machines where 7B+ vision is too slow
- Backend fit: ollama:available
- License posture: audit exact checkpoint license before client/commercial use
- Notes: Fallback when the stronger VLM is not installed or the machine is too constrained.

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
- Backend fit: ollama:available, llama.cpp:missing, mlx:missing
- License posture: project code is no-cost; backend/model licenses audited separately
- Notes: Best default for laptops. Agents run in sequence and persist outputs to files.

## Human Decisions Required
- Download exact local model weights only after checking their license and hardware fit.
- Do not configure paid API fallbacks in generated workspaces.
- Keep image/video generation optional when hardware is too small.


## Recommended Setup
- Text backend: Ollama detected, selected qwen2.5vl:7b
- Vision backend: ready with qwen2.5vl:7b
- Image backend: ComfyUI not detected; keep image generation as visual briefs until installed.
- Exact model weights must be chosen after license and hardware checks.

## Recommended Local Pulls For This Machine
```bash
# Text model already available: qwen2.5vl:7b
# Vision model already available: qwen2.5vl:7b
```

## No-Cost Boundary
- This project does not require paid APIs.
- Local model quality depends on machine RAM/VRAM.
- Do not add paid fallback keys to generated workspaces by default.

## Smoke Commands
```bash
npm run models:route sample-local-social-team
npm run workflow:run sample-local-social-team -- --execute
npm run quality:gate sample-local-social-team
```
