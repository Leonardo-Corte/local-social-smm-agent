# Video/Image Agentic Engine Integration Plan

Generated: 2026-05-26

## Goal

Make the system capable of going from natural chat request to professional social output:

1. understand the business and platform
2. research trend/context
3. generate or select images/video assets
4. assemble/edit video
5. write hooks/captions/platform variants
6. run persona and performance review
7. prepare a human-approved publishing package

The core SMM workspace remains the brain. External engines become optional local adapters.

Master plan: `docs/roadmap/final-agentic-smm-system-task-plan.md`.

## Integration Decisions

### OpenMontage

Decision: **do not vendor; use as reference or separate local service only.**

Why:
- License is AGPL-3.0, so copying/adapting it into our core would create a risky license boundary.
- It is a full production system, not just a video library.
- It supports paid/provider paths, while our default product must stay no-cost/local-first.

What we should take:
- pipeline manifests
- stage skills
- provider scoring
- video validation via ffprobe/frame sampling/audio/subtitle checks
- render self-review
- real-footage/open-footage thinking

Implementation:
- Recreate the ideas inside our own `creative:run` flow.
- Keep any direct OpenMontage execution as a separate checkout/service later.

### ComfyUI-Copilot

Decision: **integrate now as a safe optional adapter plan.**

Why:
- MIT license.
- Strong fit for image workflow generation, debugging, rewriting, parameter tuning, and model/node recommendations.
- It belongs behind our Visual Director, not as the main app.

Implementation started:
- `creative/comfyui-copilot-plan.json`
- `creative/comfyui-copilot-plan.md`
- `npm run comfyui:copilot:plan <workspace>`

Next implementation:
- Add a ComfyUI API runner for a user-supplied workflow JSON.
- Register generated images under `creative/images/` with `needs_human_review`.
- Add visual QA pass after generation.

### Pixelle-Video

Decision: **prepare optional adapter spike, not core replacement.**

Why:
- Apache-2.0 and very relevant.
- It already thinks in topic -> script -> image/video generation -> TTS -> BGM -> composition.
- It is heavy and likely needs careful backend setup on Mac.

Implementation:
- Add a separate-service plan first.
- Feed Pixelle our script/visual plan.
- Import resulting MP4 plus metadata into artifact registry.
- Do not block the chat workflow if Pixelle is missing.

### MassGen

Decision: **use as orchestration pattern, not runtime migration yet.**

Why:
- Apache-2.0 license file is present.
- Strong concepts: parallel agents, shared summaries, convergence, voting, consensus, criteria pruning.
- Our current runtime is already workspace-specific and Node-based.

Implementation:
- Recreate MassGen-inspired patterns in our orchestrator:
  - parallel candidate drafts
  - judge/checklist scoring
  - consensus threshold
  - restart only when new evidence appears
  - final synthesis with evidence
- Do not replace the current adaptive orchestrator until a benchmark proves better output/speed.

## Task Plan

### Phase 1 - Safe Planning Layer

- [x] Add ComfyUI-Copilot integration plan artifact.
- [x] Add video engine integration plan artifact.
- [x] Add scripts for generating those plans.
- [x] Add creative workflow steps for these plans.
- [ ] Add model/setup wizard copy that explains ComfyUI-Copilot and Pixelle.

### Phase 2 - ComfyUI Execution Adapter

- [x] Add `packages/image-workflow/comfyui-api-client.js`.
- [x] Support checking a running ComfyUI endpoint.
- [x] Support queueing a workflow JSON.
- [x] Support retrieving output image paths.
- [x] Register outputs as `needs_human_review`.
- [ ] Save model/workflow/license metadata.
- [x] Add a first visual QA report per generated image.
- [ ] Upgrade visual QA with OCR/text legibility and brand-fit checks.

### Phase 3 - OpenMontage-Inspired Video QA

- [ ] Add `creative/video-quality-report.json`.
- [ ] Run ffprobe validation on preview/final MP4.
- [ ] Extract representative frames.
- [ ] Measure audio loudness/peaks when audio exists.
- [ ] Check caption/overlay density and crop safety.
- [ ] Add delivery checklist by platform.

### Phase 4 - Pixelle Adapter Spike

- [ ] Create separate `packages/video-engines/pixelle-adapter.js`.
- [ ] Detect local Pixelle checkout/service.
- [ ] Generate a Pixelle handoff request from our workspace.
- [ ] Import returned MP4/output metadata.
- [ ] Add artifact registry entry.
- [ ] Compare quality against current CapCut/FFmpeg plan.

### Phase 5 - MassGen-Inspired Orchestration

- [ ] Add multi-candidate agent draft mode.
- [ ] Add checklist scoring by platform and business objective.
- [ ] Add consensus threshold.
- [ ] Add explicit convergence/restart log.
- [ ] Benchmark against current council mode on speed and quality.

## Non-Negotiables

- No automatic publishing.
- No DM/comment/like/follow/vote automation.
- No paid API requirement.
- Every external engine is optional.
- Every produced artifact stays draft-only until human approval.
- Every license boundary must be documented before code/vendor integration.
