# Mega Agentic System Hardening Task Plan

Date: 2026-05-25

Source audit:
- `docs/audits/workflow-technical-audit-2026-05-25.md`
- Independent planner agent: Zeno

## North Star

Build a local-first social media operating system where a human can:

1. Run a deep interview.
2. Generate a separate project workspace.
3. Get a clean business profile, custom agents, skills, platform playbooks, and operating rules.
4. Open a natural-language local AI team chat.
5. Attach images, videos, links, and notes safely.
6. Ask for posts, reels, carousels, messages, trend research, persona simulations, and QA.
7. Receive draft artifacts with traceable agent handoffs.
8. Approve, reject, or iterate content through a real approval state machine.
9. Export or publish only through manual/official human-approved paths.

This is not literal AGI. The realistic goal is a robust, inspectable, local agentic operating system with strong boundaries, specialized agents, measurable quality gates, and safe human control.

## Hard Principles

- No automatic publishing without human approval.
- No DM/comment/like/follow/reply/vote automation.
- No paid model/API requirement.
- No private scraping, login bypass, captcha bypass, or account-facing bot behavior.
- No copied external repo code without license review.
- No vague success claims: every artifact must separate observed facts, assumptions, and approval blockers.
- No hidden failures: model timeout, source failure, policy block, and missing approval must be explicit.
- No unsafe local file ingestion by default.
- No workspace path traversal.

## Priority Map

P0: Security and correctness foundations.

P1: Approval state, artifact lifecycle, failure semantics, and source of truth.

P2: Agent quality, model routing, semantic media intelligence, trend confidence, and UX.

P3: Advanced orchestration, external-reference-inspired patterns, and polished product workflows.

## Phase 0 - Baseline And Non-Mutating Verification

Goal: create a clean way to measure progress before deeper refactors.

Tasks:

1. Add a `docs/audits/current-risk-register.md` generated from the audit.
2. Add a `docs/roadmap/implementation-log.md` where every phase records changed files, commands, failures, and next risks.
3. Split `npm run check` into:
   - `check:smoke`
   - `check:readonly`
   - `check:mutating`
4. Make every check script declare whether it writes files.
5. Create temporary fixture workspaces for mutation tests instead of using real sample workspaces.
6. Add a command that prints system readiness without writing docs.

Acceptance criteria:

- There is at least one read-only check command.
- Mutating checks write only into temp directories.
- Existing `npm run check` still passes.
- Any future agent can read the implementation log and understand current status.

## Phase 1 - Workspace Path Safety

Goal: eliminate workspace path traversal and make workspace resolution centralized.

Tasks:

1. Create `packages/workspace-runner/workspace-paths.js`.
2. Implement:
   - `validateWorkspaceSlug(workspace)`
   - `assertInsideRoot(root, targetPath)`
   - `resolveGeneratedWorkspaceRoot(root, workspace)`
   - `resolveClientWorkspaceRoot(root, workspace)`
   - `resolveWorkspaceRelativePath(workspaceRoot, relativePath)`
   - `workspaceExists(workspaceRoot)`
3. Allow only slugs matching `/^[a-z0-9][a-z0-9-]{0,79}$/`.
4. Reject:
   - `../anything`
   - `/absolute/path`
   - `workspace with spaces`
   - `.hidden`
   - `name/child`
   - empty string
   - names longer than 80 chars
5. Replace manual generated workspace path joins in high-risk entrypoints:
   - `apps/workspace-generator/bin/workspace-chat.js`
   - `apps/workspace-generator/bin/run-workflow.js`
   - `apps/workspace-generator/bin/run-team-orchestration.js`
   - `apps/workspace-generator/bin/run-quality-gate.js`
   - `apps/workspace-generator/bin/build-publishing-package.js`
   - `apps/workspace-generator/bin/export-client-workspace.js`
   - `packages/workflow-runner/pipeline.js`
   - `packages/workflow-runner/team-orchestrator.js`
6. Add a check script:
   - `apps/workspace-generator/bin/check-workspace-paths.js`
7. Add package script:
   - `workspace:paths:check`
8. Add this script into `npm run check`.

Acceptance criteria:

- Valid workspaces still run.
- Invalid workspace names fail before any read/write.
- The check proves traversal rejection.
- No high-risk workspace runner constructs roots manually.

## Phase 2 - Safe Asset Import Policy

Goal: make file ingestion safe, explicit, logged, and redacted.

Tasks:

1. Create `packages/asset-intel/import-policy.js`.
2. Implement:
   - `classifyImportPath`
   - `isSensitivePath`
   - `isAllowedImportPath`
   - `redactSensitiveText`
   - `writeImportAuditRecord`
3. Default allow:
   - files already inside the workspace
   - files inside configured `SOCIAL_AGENT_IMPORT_DIR`
   - files passed with an explicit future flag `--allow-external-import`
4. Default block:
   - `.env`
   - `.ssh`
   - `.aws`
   - `.npmrc`
   - private keys
   - browser profile folders
   - keychain/system folders
   - hidden dotfiles unless explicitly allowlisted
5. Make these paths use the policy:
   - `/attach`
   - `/image`
   - `/video`
   - natural-language path detection
   - `ingestTextFile`
   - image/video copying into `assets/raw`
6. Write audit records to:
   - `assets/import-audit/imports.jsonl`
7. Add a user-facing error that explains how to allow an external file safely.

Acceptance criteria:

- Safe workspace asset imports still work.
- Secret-like files are blocked.
- Text redaction is applied before prompt inclusion.
- Every imported asset has an audit record.

## Phase 3 - Safe URL Fetching

Goal: prevent SSRF-style local/private fetches and make link research predictable.

Tasks:

1. Create `packages/asset-intel/url-safety.js`.
2. Implement:
   - `validatePublicHttpUrl`
   - `isPrivateHostname`
   - `isPrivateIp`
   - `safeFetchText`
   - `safeFetchJson`
3. Block:
   - `localhost`
   - `127.0.0.0/8`
   - `0.0.0.0`
   - `10.0.0.0/8`
   - `172.16.0.0/12`
   - `192.168.0.0/16`
   - `169.254.0.0/16`
   - `::1`
   - link-local IPv6
   - metadata service hosts
4. Add byte caps and timeouts.
5. Validate redirect targets.
6. Use the safe fetcher in:
   - `packages/asset-intel/attachment-ingestor.js`
   - `packages/trend-intel/live-collector.js`
7. Persist blocked URL decisions as link intelligence reports.

Acceptance criteria:

- Public URLs still work.
- Local/private URLs are blocked with explicit reason.
- Trend collector and link ingestion share the same safety rules.

## Phase 4 - Workspace Source Of Truth

Goal: remove confusion between generated and client workspaces.

Decision to make:

- Option A: `client-workspaces/<workspace>` is the canonical user workspace.
- Option B: `generated-projects/<workspace>` remains canonical and `client-workspaces` is only export/read-only.

Recommended:

- Option A for product UX.
- Keep generated workspace as factory/cache.

Tasks:

1. Add `workspaceKind`, `canonicalRoot`, `sourceGeneratedWorkspace`, and `lastSync` to manifests.
2. Add a resolver:
   - `resolveCanonicalWorkspaceRoot(root, workspace, { preferClient })`
3. Update chat/team/workflow/export/report commands to use canonical root.
4. Add explicit sync command:
   - `workspace:sync`
5. Make command output always print canonical root.

Acceptance criteria:

- User-facing chat writes to the same workspace the user opens.
- Generated workspace does not silently diverge.
- Sync is explicit and logged.

## Phase 5 - Artifact Registry And Approval Gate

Goal: turn human approval from text into enforced state.

Tasks:

1. Create `packages/publishing/artifact-registry.js`.
2. Store registry at:
   - `publishing/artifact-registry.json`
3. Artifact fields:
   - `id`
   - `path`
   - `sha256`
   - `kind`
   - `platforms`
   - `sourceRun`
   - `policyStatus`
   - `state`
   - `createdAt`
   - `updatedAt`
   - `approver`
   - `approvedAt`
   - `approvalNotes`
4. States:
   - `draft`
   - `needs_human_review`
   - `changes_requested`
   - `approved`
   - `exported`
5. Add CLI:
   - `artifact:list`
   - `artifact:approve`
   - `artifact:reject`
   - `artifact:status`
6. Make team run register final artifacts as `needs_human_review`.
7. Make publishing package include only approved artifacts with matching hashes.
8. If file changes after approval, downgrade to `needs_human_review`.

Acceptance criteria:

- No publishing package can claim readiness without approved artifacts.
- Hash mismatch blocks export.
- Approval owner and timestamp are recorded.

## Phase 6 - Failure Semantics And Progress UX

Goal: make model failures visible and prevent fallback artifacts from masquerading as work.

Tasks:

1. In `team-orchestrator`, mark every step as:
   - `completed`
   - `failed_model_timeout`
   - `failed_model_error`
   - `skipped_dependency_failed`
2. Add `critical` step metadata.
3. If a critical step fails, stop final synthesis.
4. Save prompt packets and retry command.
5. Do not write fallback final artifact to target.
6. Print progress:
   - step start
   - model
   - elapsed
   - status
   - output path
7. Add `--fast` mode:
   - fewer context files
   - shorter prompts
   - fewer steps
   - same safety gates

Acceptance criteria:

- Timeout returns failure status, not generic copy.
- CLI output is understandable while running.
- Failed runs are resumable/retryable.

## Phase 7 - General Business Profile Generator

Goal: remove Out Of Office assumptions from core.

Tasks:

1. Move current Out Of Office profile into fixture:
   - `workspaces/sample-briefs/out-of-office-profile-fixture.json`
2. Refactor `packages/business-profile/profile.js`.
3. Derive:
   - business type
   - positioning
   - audience
   - offer
   - proof to verify
   - goals
   - tone
   - approval owners
   - open questions
4. Never invent event city, proof, attendance, food/drinks, or venue value.
5. Add non-Out-Of-Office fixtures.

Acceptance criteria:

- Generic workspace has no Out Of Office/NYC leakage.
- Missing facts become open questions.
- Out Of Office still gets a strong profile because its brief contains those facts.

## Phase 8 - Agent Contracts And Orchestration Graph

Goal: make agents behave like a controlled team, not free-form prompts.

Tasks:

1. Create `packages/agents/task-contracts.js`.
2. Define required fields:
   - observed facts
   - assumptions
   - proposed output
   - blockers
   - handoff
   - confidence
   - sources used
3. Add pipeline graph schema:
   - step id
   - agent id
   - dependencies
   - criticality
   - input artifacts
   - output artifacts
4. Add contract validation after every step.
5. Save event log:
   - `runs/events.jsonl`
6. Add controlled memory:
   - approved claims
   - rejected phrases
   - user feedback
   - platform preferences

Acceptance criteria:

- Every step output is machine-checkable.
- QA can block downstream steps.
- Final synthesis can cite the chain of evidence.

## Phase 9 - Semantic Media Intelligence

Goal: move video/image from metadata to creative understanding.

Tasks:

1. For video:
   - extract keyframes
   - build contact sheet
   - send representative frames to `qwen2.5vl:7b`
   - ask for scene, mood, motion, hook, visual proof, risks
2. Separate reports:
   - technical probe
   - visual semantic report
   - edit recipe
   - caption/script package
3. For images:
   - detect text-heavy assets
   - detect platform fit
   - generate crop/format recommendations
4. Add media QA:
   - claim support
   - privacy risk
   - face/person identification guardrails
   - event detail verification

Acceptance criteria:

- Reel analysis includes visual observations, not just ffprobe metadata.
- Copy agents consume media intelligence automatically.
- Unsupported visual claims are blocked.

## Phase 10 - Trend Intelligence Upgrade

Goal: make trend research useful, sourced, scored, and less noisy.

Tasks:

1. Create source adapters:
   - Reddit public JSON
   - YouTube public page titles
   - Google Trends manual/browser-assisted fallback
   - user-provided competitor links
   - RSS/public blogs
2. Add:
   - dedupe
   - recency score
   - relevance score
   - source reliability
   - platform fit
   - quote/excerpt limits
3. Add human review queue for medium/high-risk sources.
4. Create `research/evidence-board.json`.
5. Make agents cite evidence IDs instead of raw links.

Acceptance criteria:

- Report shows high-confidence vs low-confidence items.
- Failure rate is visible.
- Agents cannot use trend claims without evidence IDs.

## Phase 11 - Model Routing And Benchmarking

Goal: choose the right local model per job, not just first matching model name.

Tasks:

1. Fix `--models` parsing to accept comma-separated and space-separated values.
2. Define model task families:
   - social-copy
   - strategy
   - critic-qa
   - persona
   - vision
   - fast-extract
   - coding
3. Benchmark each task family with smaller, timed prompts.
4. Store benchmark history.
5. Add `--max-models`, `--max-tasks`, and `--fast`.
6. Penalize unsafe copy and wrong language.

Acceptance criteria:

- Benchmark can compare multiple models.
- Persona timeout is surfaced.
- Routing avoids coder model for social copy if another local model performs better.

## Phase 12 - Quality Gate 2.0

Goal: score real quality, not just file presence.

Tasks:

1. Add checks:
   - artifact registry state
   - model run success
   - no fallback-only artifacts
   - content policy pass
   - citation coverage
   - platform-specific formatting
   - business profile specificity
   - media evidence support
2. Add workspace score categories:
   - security
   - completeness
   - evidence
   - brand fit
   - approval readiness
   - publishing readiness
3. Make quality gate block export if core categories fail.

Acceptance criteria:

- Generic placeholder content cannot score as ready.
- Failed model runs lower score.
- Unapproved artifacts block publishing readiness.

## Phase 13 - External Repo Inspiration Program

Goal: use external repositories intelligently without license or copy risk.

Approved inspiration-only sources:

- `reference/github-agent-orchestration/langgraph-supervisor-js`
  - Use for supervisor/handoff graph ideas.
- `reference/inspiration-only/TinyTroupe`
  - Use for persona simulation concepts.
- `reference/inspiration-only/sdialog`
  - Use for structured dialogue simulation ideas.
- `reference/inspiration-only/social-media-skills`
  - Use for skill taxonomy and agent operating manuals.
- Postiz/TryPost research notes
  - Use for publishing workflow and approval UX ideas.

Rules:

- No copying code unless license allows and audit is written.
- Prefer recreating small patterns in local style.
- Every integration gets:
  - license note
  - risk note
  - files touched
  - reason why dependency is needed or avoided

Acceptance criteria:

- Repo inspirations are mapped to local modules.
- No unapproved vendored code enters product paths.

## Phase 14 - Product UX Rebuild

Goal: make the system feel simple: chat first, automation second, approvals third.

Tasks:

1. Terminal:
   - `workspace:start <name>`
   - readable progress
   - simple natural language examples
2. Future local web app:
   - chat surface
   - upload zone
   - draft review
   - approval registry
   - media previews
   - trend board
3. Avoid old dashboard complexity.
4. Build only after P0/P1 are safe.

Acceptance criteria:

- Non-technical user can start a workspace from one command.
- User can see what is draft, blocked, approved, exported.
- No confusing technical maintenance page as primary UX.

## First Implementation Sprint

Sprint name: `P0 Workspace Boundary Lockdown`

Scope:

1. Add `packages/workspace-runner/workspace-paths.js`.
2. Add `apps/workspace-generator/bin/check-workspace-paths.js`.
3. Add package script `workspace:paths:check`.
4. Wire the check into `npm run check`.
5. Update:
   - `apps/workspace-generator/bin/run-workflow.js`
   - `apps/workspace-generator/bin/run-team-orchestration.js`
   - `apps/workspace-generator/bin/run-quality-gate.js`
   - `apps/workspace-generator/bin/build-publishing-package.js`
   - `packages/workflow-runner/pipeline.js`
   - `packages/workflow-runner/team-orchestrator.js`
6. Leave lower-risk CLI conversions for Sprint 2 if needed.

Definition of done:

- Invalid workspace slugs fail.
- Traversal is blocked.
- Existing valid workspace commands still work.
- `npm run check` passes.
- Implementation log is updated.

## Second Implementation Sprint

Sprint name: `P0 Safe Asset And URL Ingestion`

Scope:

1. Add import policy.
2. Add URL safety module.
3. Wire chat ingestion.
4. Wire link ingestion.
5. Wire trend collector.
6. Add checks for blocked secret path and blocked localhost URL.

Definition of done:

- Workspace internal files work.
- External imports are explicit and logged.
- Secrets are blocked/redacted.
- Local/private URLs are blocked.

## Third Implementation Sprint

Sprint name: `P1 Approval And Failure Truth`

Scope:

1. Add artifact registry.
2. Register team outputs.
3. Add approve/reject/status CLIs.
4. Block publishing package without approval.
5. Remove final fallback artifacts on model failure.
6. Add progress logs.

Definition of done:

- Failed model run cannot produce final content.
- Publishing package requires approved artifact hash.
- User sees progress and retry command.

## Immediate Command Queue

Run after Sprint 1:

```bash
npm run workspace:paths:check
npm run check
npm run team:run out-of-office -- --type post --request "crea un post Instagram semplice senza numeri inventati" --steps strategy,copy,qa --model qwen2.5-coder:14b --timeout-ms 20000 --no-apply
```

Expected:

- Path check passes.
- Main check passes.
- Team run either completes with real model outputs or fails explicitly without writing generic fallback copy.
