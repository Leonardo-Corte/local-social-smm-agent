# User Quickstart

This is the practical guide for trying the local-first IG/FB agent system.

## 1. Requirements

- Node.js 18 or newer.
- Ollama running locally.
- At least one local text model pulled in Ollama.

Current tested model:

```bash
ollama pull qwen2.5:14b
```

If the Ollama CLI crashes on macOS, the system can still work through the local Ollama API at `http://127.0.0.1:11434`.

## 2. Open The Project

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
```

There is no paid API setup required. The repo currently uses only built-in Node modules plus local tools such as Ollama and ffmpeg.

## 3. Open Workspace Chat

```bash
npm run workspace:chat out-of-office -- --model qwen2.5:14b
```

Useful chat commands:

```text
/agents
/agent copywriter
/attach drafts/posts.md
/feedback Make the tone more premium and less corporate.
/exit
```

The chat loads the project brief, business profile, active agent, skill map, publishing policy, memory, and any attached files. It saves transcripts under `workspaces/generated-projects/<workspace>/chat-runs/`.

## 4. Try The Existing Real Video Workspace

Workspace:

```text
real-video-test
```

Useful files:

- `workspaces/generated-projects/real-video-test/assets/raw/VIDEO-2026-05-21-19-25-07.mp4`
- `workspaces/generated-projects/real-video-test/assets/analysis/video-asset-report.md`
- `workspaces/generated-projects/real-video-test/drafts/real-video-reel-package.md`
- `workspaces/generated-projects/real-video-test/publishing/export-package.md`
- `workspaces/generated-projects/real-video-test/client-report/report.md`

Run checks:

```bash
npm run quality:gate real-video-test
npm run publishing:package real-video-test
npm run client:report real-video-test
```

Run one local AI agent on the real video report:

```bash
npm run agent:run real-video-test -- --agent reel-shorts-producer --model qwen2.5:14b --task "Using only assets/analysis/video-asset-report.md and drafts/real-video-reel-package.md, improve hooks, captions, sound direction, edit notes, and approval blockers. Do not invent facts." --input assets/analysis/video-asset-report.md --input drafts/real-video-reel-package.md
```

The result is saved under:

```text
workspaces/generated-projects/real-video-test/runs/
```

## 4B. Workspace Chat Notes

After a workspace exists, open its natural-language local chat:

```bash
npm run workspace:chat out-of-office -- --model qwen2.5:14b
```

Inside the chat:

```text
/agents
/agent copywriter
/attach drafts/posts.md
/feedback Make the tone more premium and less corporate.
/exit
```

The current product surface is terminal chat plus generated workspace files. The old local dashboard has been removed until a simpler, polished UI is redesigned from scratch.

## 5. Create A New Project By Interview

Use the interview flow:

```bash
npm run interview
```

It asks questions and creates a brief. The brief is the source of truth for a new workspace.

To generate everything immediately after the interview:

```bash
npm run interview -- --bootstrap
```

Briefs live here:

```text
workspaces/briefs/
```

Generated workspaces live here:

```text
workspaces/generated-projects/
```

Clean client workspaces live here:

```text
workspaces/client-workspaces/
```

The `generated-projects` folder is the factory output used by the automation engine. The `client-workspaces` folder is the clean project folder you open to work on strategy, drafts, assets, feedback, reports, and publishing review.

## 6. Create A New Workspace From A Brief

If you already have a brief JSON:

```bash
node apps/workspace-generator/bin/generate-workspace.js --brief workspaces/briefs/YOUR-BRIEF.json
```

Then run the standard pipeline:

```bash
npm run workspace:bootstrap YOUR-WORKSPACE
```

This runs model routing, trend research plan, persona simulation, image plan, quality gate, publishing package, client report, and a workspace snapshot.
It also refreshes a separate clean workspace under `workspaces/client-workspaces/YOUR-WORKSPACE`.

## 7. Where To Put Things

### Business Inputs

Edit:

```text
workspaces/generated-projects/<workspace>/project-brief.json
```

This contains niche, target, offer, tone, platforms, constraints, and goals.

### User Feedback

Write feedback here:

```text
workspaces/generated-projects/<workspace>/memory/user-feedback.md
```

Example:

```text
The captions are too generic. Make them more premium, more local, and less SaaS-like.
Avoid fake claims. Use the venue and cocktail details from the video.
```

Then run:

```bash
npm run workflow:tasks <workspace>
```

### Video Assets

Put raw videos here:

```text
workspaces/generated-projects/<workspace>/assets/raw/
```

Put extracted frames here:

```text
workspaces/generated-projects/<workspace>/assets/frames/
```

Put analysis notes here:

```text
workspaces/generated-projects/<workspace>/assets/analysis/
```

### Draft Content

Edit or review:

```text
workspaces/generated-projects/<workspace>/drafts/posts.md
workspaces/generated-projects/<workspace>/drafts/reels.md
workspaces/generated-projects/<workspace>/drafts/carousels.md
```

For real reel-specific packages:

```text
workspaces/generated-projects/<workspace>/drafts/real-video-reel-package.md
```

### Publishing Review

Review:

```text
workspaces/generated-projects/<workspace>/publishing/export-package.md
workspaces/generated-projects/<workspace>/publishing/publishing-checklist.md
```

Publishing is intentionally manual/human-approved. The system should never auto-publish without explicit approval.

## 8. Safety Rules

- No automatic DM, comment, like, follow, or spam behavior.
- No automatic publishing without human approval.
- No fake claims, fake attendance numbers, fake testimonials, fake offers, or invented discounts.
- Trend research should use public/allowed sources with rate limits.
- Paid APIs are not required by default.

## 9. Current Known Limitation

Full multi-agent execution with `qwen2.5:14b` can timeout when prompts are too large.

Use shorter single-agent runs for now, or selected workflow steps:

```bash
npm run workflow:run real-video-test -- --execute --model qwen2.5:14b --steps copy --timeout-ms 180000
```

Next improvement to build: compact real-asset workflow mode so local models receive only the brief, video report, and target draft instead of the whole workspace context.
