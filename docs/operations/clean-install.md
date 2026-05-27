# Clean Install

Generated: 2026-05-27

## Requirements

- Node.js 18+
- npm
- Ollama running locally
- at least one local text model, for example `qwen2.5:14b`
- ffmpeg and ffprobe for video analysis
- optional: ComfyUI for local image generation
- optional: whisper.cpp / `whisper-cli` for local transcription

## Install

```bash
git clone https://github.com/Leonardo-Corte/local-social-smm-agent.git
cd local-social-smm-agent
npm install
npm run check
```

## Local Model Setup

```bash
ollama pull qwen2.5:14b
npm run models:wizard
npm run models:check
```

## Create A Workspace

```bash
npm run interview -- --bootstrap
```

The system creates:

- `workspaces/generated-projects/<workspace>`
- `workspaces/client-workspaces/<workspace>`
- project-specific business profile, agents, skills, playbooks, reports, and publishing package

## Start The Chat

```bash
npm run workspace:chat <workspace> -- --model qwen2.5:14b
```

Useful chat commands:

- `/creative <brief>`
- `/execute-plan <brief>`
- `/consensus <brief>`
- `/video /absolute/path/reel.mp4`
- `/image /absolute/path/image.png`
- `/comfyui <prompt>`
- `/copilot`
- `/pixelle <brief>`
- `/publish-dry-run <artifact-id> --platform instagram`

## Optional ComfyUI

Start ComfyUI separately, export an API workflow JSON, then:

```bash
export SMM_COMFYUI_WORKFLOW="/absolute/path/workflow.json"
npm run comfyui:run <workspace> -- --health
npm run comfyui:run <workspace> -- --workflow "$SMM_COMFYUI_WORKFLOW" --prompt "premium NYC networking reel cover" --preset reel
```

## Optional Pixelle-Video

Pixelle stays a separate optional service/check-out.

```bash
npm run video:engines -- --status
npm run video:engines <workspace> -- --pixelle-handoff --request "create a 15s reel"
```

If a local service is configured:

```bash
export SMM_PIXELLE_URL="http://127.0.0.1:PORT"
npm run video:engines <workspace> -- --run-pixelle --request "create a 15s reel"
```

## Publishing

Default path is manual export.

```bash
npm run publishing:artifacts <workspace> -- list
npm run publishing:artifacts <workspace> -- approve --id <artifact-id> --approver "Name"
npm run publishing:dry-run <workspace> -- --artifact <artifact-id> --platform instagram
npm run publishing:package <workspace>
```

No command publishes automatically.
