# Full Creative Automation Flow

Generated: 2026-05-25

## Target Flow

The system must behave like a local AI communications team, not like a dashboard of disconnected tools.

1. Deep interview creates the business profile and workspace.
2. The user can provide assets through chat, direct files, or a local synced Drive folder.
3. The system imports safe source assets into the workspace asset library.
4. Agents research platform trends and competitor/context signals.
5. Agents decide what creative is needed:
   - use existing video/photo
   - generate image prompts/local image briefs
   - create reel edit plan
   - create CapCut edit plan
   - create hooks/captions/platform variants
6. Video/editing agents assemble a draft package:
   - cut list
   - subtitle/caption plan
   - overlay text
   - sound/music direction
   - CapCut plan or FFmpeg preview
7. Distribution agents adapt the output for Instagram, Facebook, LinkedIn, X, and Reddit.
8. Metrics/performance reviewer simulates expected performance and flags weak hooks, audience mismatch, policy issues, or missing proof.
9. Critic QA decides:
   - approve for human review
   - iterate
   - ask a factual question
   - block
10. Publishing operator prepares only approved/manual/offical-path packages. No auto publish without human approval.

## New Implemented Piece

`assets:ingest` imports a local folder or synced Drive folder into the workspace.

Example:

```bash
npm run assets:ingest out-of-office -- --dir "/Users/corte/Library/CloudStorage/GoogleDrive-.../Out Of Office Assets" --label google-drive
```

It writes:

- `assets/asset-library.json`
- `assets/asset-library.md`
- copied files under `assets/raw/`
- source asset entries in `publishing/artifact-registry.json`

It rejects:

- `.env`, keys, credentials, auth configs
- unsupported extensions
- symlinks
- directories as files
- files over configured limits

## Next Build Steps

1. Add a `creative:run` orchestrator command.
2. It should run:
   - asset library selection
   - trend research
   - image plan or local image generation plan
   - video intelligence
   - preview edit
   - CapCut plan
   - team orchestration for hook/caption/platform distribution
   - persona/performance review
   - publishing package refresh
3. Add a `performance-reviewer` agent or extend `critic-qa` with metrics-focused scoring:
   - hook strength
   - platform fit
   - retention risk
   - CTA clarity
   - proof strength
   - visual novelty
   - repost/engagement probability
4. Add optional local adapters:
   - `vectcutapi`
   - `capcut-mate`
   - `manual-capcut`
5. Add image-generation execution only when local backend is installed:
   - ComfyUI/Qwen-Image/SDXL/Flux depending on hardware.
   - If unavailable, keep visual briefs and prompt packs.

## Product Rule

The system can generate, edit, critique, package, and prepare distribution.

It must not publish, schedule, DM, comment, vote, like, follow, or use account credentials unless an explicit approved official/manual path is implemented and the exact artifact is human-approved.
