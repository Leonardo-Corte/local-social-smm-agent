# Local-First IG/FB Content Agent Workspace Factory

This repository is a modular mega-repo for building customized AI social-media workspaces.

The system is designed to:
- Interview the user deeply before generating a workspace.
- Create a tailored team of AI agents for Instagram/Facebook content operations.
- Generate strategy, calendar, drafts, visual briefs, publishing checklists, persona simulations, and review reports.
- Run local-first with no required paid APIs.
- Use human approval before account-facing publishing actions.

## Current Phase
M0 foundation:
- Plan and test spec are under `.omx/plans/`.
- Repo audit policy is under `docs/licenses/`.
- Source safety policy is under `docs/source-policies/`.
- Core registries live under `packages/`.
- The dependency-free workspace generator lives in `apps/workspace-generator/`.
- Hardware-aware local model routing is under `packages/model-router/`.
- Prompt-packet/local Ollama execution is under `packages/local-runtime/`.

## Generate a Sample Workspace

```bash
node apps/workspace-generator/bin/generate-workspace.js --sample
```

Output:

```text
workspaces/generated-projects/sample-local-social-team/
```

## Route Local Models

```bash
npm run models:route sample-local-social-team
```

This writes `model-profile.json`, `model-routing-report.json`, and `model-routing-report.md` inside the workspace. It detects local backends such as Ollama, MLX, llama.cpp, vLLM, ComfyUI, and NVIDIA SMI when available.

## Run an Agent Task

Dry run, creating a reviewable prompt packet:

```bash
npm run agent:run sample-local-social-team -- --agent critic-qa --task "Review drafts/posts.md before human approval." --input drafts/posts.md --dry-run
```

Local execution, when Ollama is installed, running, and has at least one local model:

```bash
npm run agent:run sample-local-social-team -- --agent critic-qa --task "Review drafts/posts.md before human approval." --input drafts/posts.md
```

Every run is saved under `workspaces/generated-projects/<workspace>/runs/` with `prompt.md`, `metadata.json`, and `output.md`.

## Run the Full Workflow

```bash
npm run workflow:run sample-local-social-team
```

Default mode is safe dry-run: it creates prompt packets for the full agent pipeline and sets the workspace state to `needs-human-review`.

To allow local Ollama execution when a model is installed and running:

```bash
npm run workflow:run sample-local-social-team -- --execute
```

Workflow outputs are saved under `workspaces/generated-projects/<workspace>/workflow-runs/<timestamp>/` with a plan, per-agent step folders, and a final summary.

Run selected steps when using large local models:

```bash
npm run workflow:run sample-local-social-team -- --execute --model qwen2.5:14b --steps copy,persona,qa --timeout-ms 180000
```

## Review and Export

```bash
npm run quality:gate sample-local-social-team
npm run publishing:package sample-local-social-team
npm run client:report sample-local-social-team
```

The publishing package is manual/human-approved by design. The current product surface is terminal chat plus generated workspace files; the dashboard has been removed until a simpler, polished UI is redesigned from scratch.

## Safety Defaults
- No DM/comment/like/follow automation.
- No publishing without human approval.
- No required paid model/API dependency.
- Risky automation is experimental and disabled by default.
- External repos must pass license and risk audit before vendoring.
