# System Completion Task Plan

Status: Active
Created: 2026-05-24
Product direction: terminal/chat-first workspace now; no dashboard until the core automation is strong enough to deserve a polished UI.

## Decision

The old dashboard has been removed from the product surface. It was useful for testing, but it made the system feel more complex than it should. The project now prioritizes:

- Deep interview.
- Project-specific workspace generation.
- Local AI chat.
- Specialized agent files and skills.
- Local model execution.
- File-based reports, approvals, and publishing packages.

A future UI will be designed from scratch only after the automation engine is stronger.

## Non-Negotiable Guardrails

- No automatic publishing without human approval.
- No automatic DM/comment/like/follow.
- No account-facing scraping or automation that risks bans by default.
- No paid API dependency as a requirement.
- No copied/vendored external repo code without license approval.
- Every generated claim must separate observed fact, assumption, and missing proof.

## Phase 1: Remove Dashboard Surface

Goal: keep the repo clean and prevent the user from being sent back to a confusing local web UI.

Tasks:
- [x] Remove dashboard npm script.
- [x] Delete `apps/dashboard/server.js`.
- [x] Replace dashboard mentions in README and quickstart.
- [x] Replace dashboard guidance in workspace start command.
- [x] Replace exported client workspace dashboard commands with chat commands.
- [x] Remove stale generated `open-dashboard.sh` files from existing client workspaces.
- [x] Add a check that fails if `npm run dashboard`, `apps/dashboard`, or `127.0.0.1:8787` returns as active product guidance.

Acceptance criteria:
- `npm run dashboard` is no longer a valid script.
- `npm run workspace:start <workspace>` points only to chat and workspace folders.
- New exported client workspaces include `commands/open-chat.sh`, not `commands/open-dashboard.sh`.

## Phase 2: Live Trend Research Engine

Goal: move from placeholder/planned trend research to real, cited, refreshable trend intelligence.

Current state:
- `research/trend-research-plan.json` exists.
- `research/trend-report.md` exists.
- `market-researcher` agent exists.
- Source registry exists.

Missing:
- Live source collection.
- Stable source adapters.
- Citation and freshness scoring.
- Platform-specific trend extraction.

Tasks:
- [x] Build source adapter interface: `collect()`, `normalize()`, `riskLabel()`, `citation()`.
- [x] Add low-risk public sources first: Google Trends, Reddit public search, YouTube public search/pages.
- [x] Add user-provided competitor/watchlist sources: Instagram URLs, Facebook pages, Luma pages, LinkedIn pages, websites.
- [x] Store raw source snapshots under `research/source-snapshots/`.
- [x] Store normalized trend items in `research/trend-items.json`.
- [x] Generate `research/live-trend-report.md` with citations, date collected, confidence, and source-risk label.
- [x] Add rate limits and robots/source-policy notes.
- [x] Add trend refresh command: `npm run research:trend <workspace> -- --live`.
- [x] Teach `market-researcher` to use live trend items before drafting strategy.

Acceptance criteria:
- Running live trend research produces cited trend items.
- Report distinguishes platform observation, inference, and recommendation.
- No credentials or risky account automation required.

## Phase 3: External Repo Integration Program

Goal: learn from the best no-cost/open-source repos without license violations or unsafe copying.

Current state:
- Repo audit candidates exist.
- GitHub metadata audit exists for some candidates.
- License/risk posture exists at a basic level.

Missing:
- Deep architecture comparison.
- Decided integration patterns.
- Adapter/wrapper strategy.
- License-based allow/deny list.

Tasks:
- [ ] Refresh repo candidate list for social content ops, scheduling, trend research, local agents, video analysis, persona simulation, and ComfyUI/image generation.
- [x] For each repo, record license, maintenance activity, security concerns, and integration value from available metadata.
- [x] Classify each repo as: `reference-only`, `adapter`, `vendor-allowed`, `do-not-use`.
- [x] Create `docs/research/repo-integration-decisions.md`.
- [ ] Create architecture notes for best patterns to recreate legally.
- [ ] Integrate only approved repos through adapters or clean-room reimplementation.
- [x] Add tests that verify no unapproved vendored code is present.

Acceptance criteria:
- Every repo has a decision and license note.
- No integration happens without a written license/risk decision.
- The system can explain which repo ideas influenced which local module.

## Phase 4: Local Model Benchmark And Routing

Goal: automatically choose the best local model for each agent and task on the user's hardware.

Current state:
- Hardware/backend detection exists.
- Ollama route works.
- Qwen2.5:14b is supported.
- Model routing report exists.

Missing:
- Benchmark suite.
- Comparative quality scores.
- Automatic role-based routing.
- Image/video model benchmark.

Tasks:
- [x] Define benchmark tasks for strategy, copy, QA, persona simulation, Italian messy-input cleanup, and safety critique.
- [x] Add local benchmark command: `npm run models:benchmark <workspace>`.
- [ ] Test available Ollama models: Qwen, Llama, Gemma, Mistral/Mixtral variants when installed.
- [x] Score outputs with deterministic rubrics: factual caution, specificity, formatting, Italian/English handling, instruction-following, latency.
- [x] Store results under `model-benchmarks/`.
- [x] Update routing with best benchmarked model per agent in `model-routing-benchmark.md`.
- [x] Add graceful fallback notes when hardware/model latency is insufficient.
- [x] Add image/video model benchmark plan for ComfyUI/Whisper/ffmpeg pipelines.

Acceptance criteria:
- Each agent has a recommended local model.
- Slow models are not used for lightweight tasks unless quality justifies it.
- Report tells the user what to install next and why.

## Phase 5: Local Image Generation Pipeline

Goal: make image generation no-cost and local-first, with quality and license controls.

Current state:
- ComfyUI/image plan exists.
- Visual Director agent exists.

Missing:
- Working local generation workflow.
- Model install guidance.
- Prompt-to-asset pipeline.
- Approval and license checks.

Tasks:
- [x] Detect ComfyUI installation and available workflows.
- [x] Recommend local image models by hardware profile and license posture.
- [x] Create reusable prompt templates for event posters, carousels, thumbnails, story backgrounds, and brand moodboards.
- [x] Generate image briefs first; generate actual images only if a local backend is ready.
- [ ] Store generated images under `creative/generated/`.
- [ ] Add visual QA checklist: brand match, text legibility, platform size, claim safety.
- [x] Block publishing use until human approval.

Acceptance criteria:
- System can produce either a ready local image prompt package or real local images.
- Every image artifact has source/model/license metadata.

## Phase 6: Reel Intelligence And Local Video Analysis

Goal: upload a reel/video and automatically extract useful production intelligence.

Current state:
- Raw asset folders exist.
- Basic video asset reporting exists for earlier real-video test.
- Reel/Shorts Producer exists.

Missing:
- Automatic transcription.
- Scene/frame analysis.
- Rhythm/pacing notes.
- Sound/music direction.
- Visual hook detection.

Tasks:
- [x] Add `ffmpeg` probe for duration, resolution, fps, audio presence, loudness, and keyframes.
- [x] Add frame extraction to `assets/frames/<video-id>/`.
- [x] Add local transcription with Whisper-compatible no-cost backend.
- [ ] Add shot/scene summary from frames.
- [x] Add pacing analysis: cuts per second, first-three-second density, dead zones.
- [x] Add audio notes: speech/music/noise, volume issues, sound direction suggestions.
- [x] Generate `assets/analysis/<video-id>-reel-intelligence.md`.
- [x] Feed the report into `reel-shorts-producer`, `copywriter`, `critic-qa`, and `publishing-operator`.

Acceptance criteria:
- Given a video file, the system creates a structured reel intelligence report.
- Generated hooks/captions reference only observed or user-confirmed facts.
- Missing questions are listed instead of invented claims.

## Phase 7: Assisted Meta Publishing

Goal: support official/manual publishing workflows without violating approval rules.

Current state:
- Publishing package exists.
- Publishing policy blocks automatic posting.
- Approval state exists.

Missing:
- Meta API readiness checklist.
- Credential setup flow.
- Official publishing adapter.
- Manual export UX.

Tasks:
- [x] Build Meta API requirements doc: app, permissions, page/account linking, review limits.
- [x] Add credential-free manual export first: captions, hashtags, asset checklist, posting steps.
- [ ] Add optional official Meta API adapter behind explicit setup and approval.
- [ ] Keep publish command disabled unless artifact is approved.
- [ ] Log every publishing attempt and approval owner.
- [ ] Never support auto DM/comment/like/follow.

Acceptance criteria:
- Manual export works without credentials.
- Official adapter cannot run without approved artifact and explicit credentials.
- Approval state remains the gate.

## Phase 8: Video Improvement And Editing Automation

Goal: go beyond notes and create optional edited outputs locally.

Current state:
- Reel improvement notes can be generated.

Missing:
- Actual video transformations.
- Captions/subtitles.
- Safe, reversible edit recipes.

Tasks:
- [x] Define edit recipe JSON: trim, crop, subtitle/caption plan, cut list, preview settings.
- [ ] Generate `.srt` captions from transcription.
- [x] Use `ffmpeg` to create preview variants.
- [x] Store outputs under `assets/edited/`.
- [x] Add before/after metadata and human review notes.
- [x] Keep destructive edits impossible; originals remain untouched.

Acceptance criteria:
- System can create at least one local preview edit.
- Every edit is reproducible from a recipe.
- User approves before any publishing export uses the edited asset.

## Phase 9: Future Polished UI From Scratch

Goal: rebuild UI only after the engine works, not before.

Current state:
- Old dashboard removed.

Future UI principles:
- One primary chat surface.
- One content automation flow.
- Upload/select reel with preview thumbnails.
- Output package cards.
- Clear approval state.
- No technical pipeline language in primary UI.

Tasks:
- [ ] Write product spec for the new UI after Phases 2-8 are useful.
- [ ] Choose whether to keep dependency-free server or move to a proper frontend stack.
- [ ] Design screens: Chat, Reel Lab, Output Package, Approvals, Library, Settings.
- [ ] Add streaming chat and job status.
- [ ] Add thumbnails, progress states, and report cards.
- [ ] Add e2e tests and screenshot verification.

Acceptance criteria:
- A nontechnical user understands the next action in under 10 seconds.
- The UI never exposes internal agent IDs unless in advanced/debug mode.

## Phase 10: Professional Agent Orchestration

Goal: make every agent behave like a real specialist with context, tools, inputs, outputs, rubrics, and handoffs.

Current state:
- Agent files exist.
- Skill files exist.
- Workflow runner exists.

Missing:
- Deeper per-agent operating manuals.
- Automatic handoff contracts.
- Better report format per agent.
- Better iteration loop.

Tasks:
- [x] Expand each agent file with: mission, forbidden actions, required inputs, output schema, quality rubric, examples, escalation rules.
- [ ] Add per-agent context bundles generated from business profile, trend data, model routing, and memory.
- [x] Add agent handoff contracts: what each agent receives and produces.
- [ ] Add one final executive report combining strategy, creative, risks, personas, and approval next steps.
- [ ] Add feedback loop: approve/reject/iterate updates memory and triggers only affected agents.
- [x] Add run status metadata for every agent step.

Acceptance criteria:
- Every agent output is structured and reviewable.
- Feedback causes targeted iteration, not full blind regeneration.
- Final report is client-ready.

## Suggested Build Order

1. Finish dashboard removal and terminal-first docs.
2. Build reel intelligence local video analysis.
3. Build live trend research.
4. Build model benchmark routing.
5. Upgrade agent orchestration and reports.
6. Add manual Meta publishing export improvements.
7. Add optional image generation.
8. Add optional local video editing.
9. Redesign UI from scratch.
