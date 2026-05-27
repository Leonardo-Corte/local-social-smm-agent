# Final Agentic SMM System Task Plan

Generated: 2026-05-26

## Target Outcome

Build a local-first social media operating system where the user starts from a deep interview, receives a project-specific workspace, then controls a specialized AI communications team through natural language chat.

The final system must be able to:

1. understand business, offer, niche, platforms, approvals, assets, and constraints
2. clean messy user input into a canonical business profile
3. personalize agents, skills, rules, context, and task plans per project
4. ingest local folders, Drive-synced folders, images, videos, links, and notes
5. research live context and trends from legal/public sources
6. create images through local ComfyUI workflows
7. plan, assemble, edit, and QA short-form videos through local/open engines
8. write platform-native hooks, captions, scripts, carousels, X posts, Reddit-safe drafts, LinkedIn posts, and Facebook/Instagram packages
9. run multi-agent critique, persona simulation, performance scoring, and consensus before final output
10. prepare publishing packages for human approval only
11. optionally publish through official APIs after explicit human approval and credentials setup

## Non-Negotiable Product Rules

- No automatic publishing without human approval.
- No DM/comment/like/follow/vote automation.
- No private scraping, credential harvesting, or bypassing platform rules.
- No promise of zero-cost quality if hardware is insufficient; software path is no-cost/local-first, output quality depends on machine and installed models.
- No vendoring or copying code across unsafe licenses. Use adapters, separate services, or clean-room reimplementation.
- Every produced asset enters the artifact registry as `needs_human_review`.
- Every external repo integration must have license, maintenance, install, and fallback notes.

## Current State

Done:

- Deep interview to workspace generation.
- Clean client workspace export.
- Business profile, agents, skill map, platform playbooks, guardrails.
- Chat-first workflow with natural language routing for images, videos, links, folders, and social content requests.
- Video intelligence baseline with frames/transcription hooks/edit recipe.
- Asset folder ingestion and artifact registry.
- Human approval state machine and publishing package.
- Platform support expanded to Instagram, Facebook, LinkedIn, X, and Reddit.
- Repo audit and integration decisions.
- ComfyUI-Copilot plan and video engine plan.
- ComfyUI API runner layer started: queue workflow, wait history, download images, register artifacts.

Still missing for the final powerful system:

- ComfyUI visual QA and workflow template library.
- Real Pixelle/OpenMontage/CapCut video production adapter layer.
- Deeper audio/video analysis: transcript quality, scene rhythm, shot quality, music/sound suggestions, crop safety, subtitle density.
- Live trend research with stronger public-source connectors.
- MassGen-style multi-agent collaboration with consensus, voting, evidence, and convergence logs.
- Drive/folder watcher and automatic asset queue.
- Official Meta API assisted publishing package with credential checks and human approval gates.
- Benchmarks: speed, quality, cost, hardware fit, model routing.

## Source Repo Decisions

### ComfyUI

Role: local visual generation backend.

Decision: use as external local service, not vendored into core.

Tasks:

- Build API client around `/prompt`, `/history/{prompt_id}`, `/view`, `/system_stats`, and `/queue`.
- Require exported API workflow JSON.
- Save generated images under `creative/images/`.
- Register outputs as human-review artifacts.
- Add visual QA and prompt trace.

Acceptance:

- A user can run one command with a workflow JSON and receive image artifacts in the workspace.
- If ComfyUI is missing, the system fails clearly and keeps text/brief fallback.

### ComfyUI-Copilot

Role: workflow ideation, workflow debugging, parameter tuning, and model/node recommendations.

Decision: optional ComfyUI custom node; do not require for core.

Tasks:

- Keep plan artifact.
- Add setup guidance.
- Feed project business profile, visual brief, image intelligence, and prompt engineer output as handoff.
- Later, parse Copilot-produced workflow suggestions into our workflow library.

Acceptance:

- The user sees exact setup commands and knows what to paste into Copilot.
- No paid key is required by the core system.

### Pixelle-Video

Role: optional full short-video engine.

Decision: separate adapter spike, not core replacement.

Tasks:

- Detect local Pixelle checkout/service.
- Build handoff JSON from our creative workflow: topic, script, visual plan, platform, duration, aspect ratio, voice/BGM hints.
- Trigger Pixelle only if installed/configured.
- Import resulting MP4 and metadata into artifact registry.
- Compare quality against our CapCut/FFmpeg path.

Acceptance:

- If installed, the chat can ask for a reel and receive a generated video artifact.
- If missing, the system continues with CapCut plan and manual/preview path.

### OpenMontage

Role: reference architecture for agentic video production and QA.

Decision: do not vendor due AGPL-3.0; use separate service or clean-room ideas.

Tasks:

- Recreate stage manifests, provider scoring, render validation, real-footage thinking, and self-review in our own system.
- Keep any direct execution as an explicit external checkout with license warning.

Acceptance:

- Our video QA report has OpenMontage-level discipline without copying code.
- License boundary remains documented.

### MassGen

Role: multi-agent collaboration pattern.

Decision: use pattern, not runtime migration.

Tasks:

- Add multiple candidate drafts per content request.
- Add judge agents with platform-specific rubrics.
- Add consensus threshold and convergence log.
- Add final synthesis that cites evidence and rejected ideas.
- Benchmark versus current adaptive council.

Acceptance:

- For a post/reel request, at least 3 agents produce alternatives, at least 2 reviewers score them, and final output explains why it won.

## Phase 1 - Master Task Plan And Repo Audit Lock

Status: in progress

Tasks:

- [x] Create this master task plan.
- [x] Keep external repo decisions in `docs/research/repo-integration-decisions.md`.
- [x] Add a roadmap status reporter CLI that prints done/next/blocked.
- [x] Add an integration-risk matrix: license, setup weight, hardware demand, fallback, owner.
- [x] Re-run GitHub audit before every major external integration.

Acceptance:

- One file answers "what is missing and what happens next."
- Every major integration has source, license, boundary, and fallback.

Verification:

- `npm run audit:github`
- `npm run audit:decisions`
- `npm run check`

## Phase 2 - Real Local Image Generation With ComfyUI

Status: started

Tasks:

- [x] Add `packages/image-workflow/comfyui-api-client.js`.
- [x] Add CLI `npm run comfyui:run`.
- [x] Add mocked ComfyUI API check.
- [x] Register generated images as `needs_human_review`.
- [x] Add first image QA report: dimensions, size, aspect ratio, baked-text risk, warnings.
- [x] Add built-in workflow template registry under `packages/image-workflow/templates/`.
- [x] Upgrade visual QA with crop safety and platform-fit warnings.
- [x] Add chat auto-route: prefer ComfyUI when `SMM_IMAGE_BACKEND=comfyui`.
- [x] Add model/hardware setup guide for SDXL Turbo, Flux Schnell, Qwen-Image routes, and lower-RAM fallback.
- [x] Add ComfyUI-Copilot handoff button/command from chat.
- [x] Add OCR/text legibility and brand-fit scoring.

Acceptance:

- Command:
  `npm run comfyui:run out-of-office -- --workflow /path/api-workflow.json --prompt "premium NYC networking event cover" --preset reel`
- Output:
  - image saved in `creative/images/`
  - run report in `creative/comfyui-runs/<run>/`
  - artifact registry entry requiring human review
- If ComfyUI is off, the error explains exactly what to start.

Verification:

- `npm run comfyui:api:check`
- `node --check packages/image-workflow/comfyui-api-client.js`
- local smoke with real ComfyUI when available

## Phase 3 - Deep Video Analysis

Status: planned

Tasks:

- [x] Improve `video:intel` with ffprobe metadata: codec, FPS, duration, resolution, audio presence/channels.
- [x] Add Whisper/whisper.cpp local transcription route with fallback status when missing.
- [x] Add first cut-rhythm signal through frame sampling and keyframe density.
- [x] Add shot-quality checks: brightness, blur availability, saturation, framing/crop guidance, face/text manual-risk notes.
- [x] Add audio analysis: loudness, peaks, silence, music bed suggestions.
- [x] Add platform-specific video constraints for IG Reels, Facebook Reels, LinkedIn video, X video, Reddit video/link post.
- [x] Write `assets/analysis/video-quality-report.md`.

Acceptance:

- Given a reel, the system can say what works, what is weak, where hooks should land, what audio/overlay edits to make, and which platforms it fits.

Verification:

- synthetic video fixture test
- real user reel smoke
- `npm run video:intel <workspace> -- --asset <file> --transcribe`

## Phase 4 - Video Creation And Editing Engine

Status: planned

Tasks:

- [x] Add `packages/video-engines/engine-registry.js`.
- [x] Keep current CapCut plan as first local/editing contract.
- [x] Add Pixelle adapter:
  - detect checkout/service
  - generate handoff JSON
  - import MP4
  - register artifact
- [x] Trigger Pixelle job directly if a local service contract is configured.
- [x] Add first OpenMontage-inspired clean-room QA:
  - stage manifest
  - provider/tool scoring
  - render validation
  - self-review
- [x] Add optional external OpenMontage service boundary:
  - no vendoring
  - explicit AGPL warning
  - import only final outputs/metadata
- [x] Add generated-video comparison report:
  - CapCut path
  - Pixelle path
  - manual edit path
  - quality score
  - hardware/runtime cost

Acceptance:

- User says: "generami 4 reel da questa cartella seguendo trend X e Reddit."
- System ingests assets, researches, scripts, selects/generates visuals, creates edit/video artifact if engine is configured, then produces human-review package.

Verification:

- mocked Pixelle service check
- local CapCut plan check
- artifact registry check

## Phase 5 - Live Trend Research

Status: planned

Tasks:

- [x] Build source registry for public/legal sources:
  - Reddit subreddit search/API/manual source URLs
  - X official/API/manual trend links where available
  - Meta Ad Library/public pages where allowed
  - Google Trends public pages/manual exports
  - news/search RSS
  - competitor public websites/events
- [x] Add source adapters with rate limits and cache.
- [x] Add evidence-first trend report:
  - source URL
  - timestamp
  - platform
  - signal type
  - confidence
  - content angle
  - legal/safety notes
- [x] Add "no private scraping" and "no account action automation" checks.
- [x] Add trend-to-content mapping for IG/Facebook/LinkedIn/X/Reddit.

Acceptance:

- A trend report never invents data and every recommendation points back to a source.

Verification:

- cached fixture tests
- live optional run with `--live`
- content policy guard

## Phase 6 - MassGen-Style Agent Collaboration

Status: planned

Tasks:

- [x] Add blackboard schema for candidate ideas, evidence, objections, votes, and final decisions.
- [x] Add candidate generation:
  - strategist candidate
  - platform specialist candidate
  - creator/copywriter candidate
  - contrarian critic candidate
- [x] Add judge rubrics:
  - business fit
  - platform fit
  - hook strength
  - proof/evidence
  - safety
  - audience objection handling
  - production feasibility
- [x] Add consensus:
  - minimum score threshold
  - top-two debate
  - forced revision when blockers exist
  - convergence report
- [x] Add benchmark harness: old council vs new consensus mode.

Acceptance:

- The system does not just call one model once. It shows how specialist agents argued, scored, revised, and synthesized the final artifact.

Verification:

- deterministic fixture with fake model outputs
- quality benchmark snapshots
- speed budget report

## Phase 7 - Drive/Folder Asset Ingestion

Status: planned

Tasks:

- [x] Strengthen existing folder ingest for Drive-synced folders.
- [x] Add folder manifest with hash, date, kind, origin label, and review state.
- [x] Add queue: new assets -> analysis -> suggested content opportunities.
- [x] Add dedupe by hash.
- [x] Add optional watch mode for local folders only.
- [x] Add safe handling for unsupported files and symlinks.

Acceptance:

- User points to a local/Drive-synced folder and the system builds a searchable, deduped asset library with next actions.

Verification:

- `npm run assets:ingest:check`
- temp folder with mixed file types

## Phase 8 - Human-Approved Publishing With Official APIs

Status: planned

Tasks:

- [x] Keep manual publishing package as default.
- [x] Add Meta readiness checklist:
  - app ID
  - page/account connection
  - permission list
  - token status
  - account type
  - media URL hosting requirement
  - rate limit notes
- [x] Add dry-run publisher:
  - validates artifact approved
  - validates media specs
  - validates caption
  - does not publish
- [x] Add assisted publish only after explicit command and human approval.
- [x] Add hard blocks for unapproved artifacts.
- [x] Add X/Reddit publish posture:
  - default manual only
  - no engagement automation
  - official API only if user explicitly configures

Acceptance:

- Approved artifacts can be packaged or dry-run checked.
- No code path publishes an unapproved artifact.

Verification:

- approval state tests
- dry-run publisher tests
- no-token path tests

## Phase 9 - Unified Chat Orchestration

Status: planned

Tasks:

- [x] Make chat the only primary UX.
- [x] Add command extraction for:
  - create image
  - create reel
  - analyze video
  - ingest folder
  - research trends
  - create campaign
  - prepare publishing package
  - approve/reject/iterate artifact
- [x] Add "agent trace" file per request.
- [x] Add progress events and final saved artifact summary.
- [x] Add conversational memory update after user feedback.
- [x] Add task-plan executor so chat can run multi-step production jobs from one natural message.

Acceptance:

- User can write normal language and the system chooses the right agents/tools without needing exact commands.

Verification:

- scripted chat fixtures
- regression checks for dangerous commands

## Phase 10 - Benchmark, Hardening, And Professionalization

Status: planned

Tasks:

- [x] Add benchmark suite:
  - local model routing speed
  - creative output quality
  - image generation time
  - video analysis time
  - consensus overhead
- [x] Add quality scorecards per output.
- [x] Add failure mode docs.
- [x] Add setup wizard for Mac Apple Silicon.
- [x] Add clean install docs.
- [x] Add workspace examples.
- [x] Add privacy/security review.

Acceptance:

- We can prove when the system is faster, smarter, safer, or blocked by hardware.

Verification:

- `npm run check`
- benchmark report
- manual smoke on Out Of Office workspace

## Next Execution Order

1. Finish ComfyUI real runner and chat integration.
2. Add visual QA for generated images.
3. Add deep video QA report.
4. Add Pixelle adapter spike with mocked test.
5. Add MassGen-style consensus orchestration.
6. Add live trend connectors and source cache.
7. Add Drive/folder queue automation.
8. Add Meta API dry-run/readiness layer.
9. Run full end-to-end workspace test on Out Of Office.

## Current First Task

Finish hardening: OCR/brand-fit image QA, direct Pixelle service execution when configured, OpenMontage-style stage manifest scoring, and benchmark harness.
