# Local Model Readiness Report

Generated at: 2026-05-25T20:36:23.608Z

Profile: Apple Silicon Pro/Max

## Backend Status
- Ollama: available (ollama-api)
- MLX LM: missing
- llama.cpp: available (llama-cli)
- vLLM: missing
- ComfyUI: missing
- NVIDIA SMI: missing

## Ollama
- CLI available: yes
- Models found: 5
- Selected default: qwen2.5-coder:14b
- Selected vision: qwen2.5vl:7b
- Recommended vision install: ollama pull qwen2.5vl:7b

### qwen2.5vl:7b
- Role: vision-candidate
- License: audit exact model license before client/commercial use

### deepseek-coder-v2:latest
- Role: strong-candidate
- License: audit exact model license before client/commercial use

### qwen2.5-coder:14b
- Role: strong-candidate
- License: audit exact model license before client/commercial use

### qwen-agent:latest
- Role: strong-candidate
- License: audit exact model license before client/commercial use

### qwen2.5:14b
- Role: strong-candidate
- License: audit exact model license before client/commercial use


## Next Actions
- Run npm run workflow:run sample-local-social-team -- --execute --model qwen2.5-coder:14b
- Vision ingestion is ready with qwen2.5vl:7b.
- Run npm run quality:gate after real model execution.
- Snapshot the workspace after reviewing real outputs.
