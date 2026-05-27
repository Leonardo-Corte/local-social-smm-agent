# Failure Modes And Recovery

Generated: 2026-05-27

## Local Model Fails Or Is Too Slow

Symptoms:

- chat hangs for several minutes
- adaptive team falls back
- output is generic or shallow

Recovery:

- run `npm run models:check`
- use a smaller Ollama model
- keep `SMM_IMAGE_BACKEND` unset unless ComfyUI is running
- prefer `/consensus` for quality when speed is acceptable

## ComfyUI Is Missing Or Not Reachable

Symptoms:

- `npm run comfyui:run <workspace> -- --health` fails
- chat image generation falls back to Pollinations or errors when `SMM_IMAGE_BACKEND=comfyui`

Recovery:

- start ComfyUI on `http://127.0.0.1:8188`
- export an API workflow JSON from ComfyUI
- set `SMM_COMFYUI_WORKFLOW=/absolute/path/workflow.json`
- rerun `/comfyui <prompt>` in chat

## Pixelle-Video Is Missing

Symptoms:

- `npm run video:engines -- --status` shows `pixelle-video` as missing
- `--run-pixelle` reports `service-not-configured`

Recovery:

- keep using CapCut plan and preview edit path
- generate `npm run video:engines <workspace> -- --pixelle-handoff --request "..."`
- install/run Pixelle separately, then set `SMM_PIXELLE_URL`

## Video Analysis Is Partial

Symptoms:

- transcription status is `missing-backend` or `missing-model`
- blur analysis unavailable
- quality report has warnings but no hard blocker

Recovery:

- install `whisper-cli` and set `WHISPER_MODEL`
- manually review extracted frames
- use `assets/analysis/video-quality-latest.md` as edit guidance, not final truth

## Trend Research Fails

Symptoms:

- live trend report contains failures
- source snapshots are low relevance

Recovery:

- reduce max live queries
- add user-provided links
- use manual public source links from `research/trend-report.md`
- do not turn low-confidence observations into claims

## Publishing Is Blocked

Symptoms:

- `publishing:dry-run` returns `blocked`
- export package lists artifacts under blocked

Recovery:

- approve the artifact locally with `npm run publishing:artifacts <workspace> -- approve --id <id> --approver "Name"`
- rerun dry-run
- keep credentials in environment variables only

## Safety Boundary

Never recover by:

- bypassing approval state
- automating likes/comments/DMs/follows/votes
- scraping private or logged-in surfaces
- copying code from incompatible licenses into this repo
