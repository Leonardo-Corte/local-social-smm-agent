# Workflow Technical Audit

Date: 2026-05-25

Auditor setup:
- Primary local audit by Codex.
- Independent sub-agent reviewer: `Harvey`, role `code-reviewer`, read-only mandate.

## Verdict

Request changes. The project is a useful local-first prototype, but it is not yet a production-grade closed social media operating system.

The strongest parts are:
- clear local-first/no-paid-API posture
- good generated workspace file structure
- explicit human approval rules
- real Ollama text and vision model detection
- real image analysis with `qwen2.5vl:7b`
- transparent run artifacts under `workflow-runs`, `team-runs`, `chat-runs`, and `assets/analysis`

The weak parts are:
- workspace/path isolation is not strong enough
- local file and link ingestion are too permissive
- approval is not enforced by a real artifact state gate
- the business profile is too hardcoded toward Out Of Office
- model fallbacks can make failures look like useful work
- checks are smoke checks, not a real isolated test suite
- trend research is noisy and fragile
- video understanding is mostly technical metadata, not semantic scene intelligence

## Evidence Collected

### Codebase Size

- Files under `apps`, `packages`, `docs`, and `workspaces` at max depth 4: 655
- Active files under `apps` and `packages`: 83
- JS/JSON lines under `apps` and `packages`: 10,483

### Test / Check Evidence

Command:

```bash
/usr/bin/time -p npm run check
```

Result:
- Passed.
- Runtime: 0.64s.
- Checks are custom smoke checks, not isolated unit/integration tests.
- Some check scripts mutate workspace files, so they are not safe read-only verification.

### Model Evidence

Installed local Ollama models:
- `qwen2.5vl:7b`
- `deepseek-coder-v2:latest`
- `qwen2.5-coder:14b`
- `qwen-agent:latest`
- `qwen2.5:14b`

`npm run models:check` selected:
- Text: `qwen2.5-coder:14b`
- Vision: `qwen2.5vl:7b`

Image test:
- Input: `workspaces/generated-projects/out-of-office/assets/raw/gigigraph.png`
- Output: `workspaces/generated-projects/out-of-office/assets/analysis/gigigraph-image-intelligence.md`
- Vision status: completed
- Vision model: `qwen2.5vl:7b`

### Benchmark Evidence

Command:

```bash
/usr/bin/time -p npm run models:benchmark out-of-office -- --models qwen2.5-coder:14b qwen2.5:14b --timeout-ms 45000
```

Result:
- Runtime: 95.44s.
- Models tested: 1, despite two model names being passed.
- `qwen2.5-coder:14b` scored 25.
- Persona simulation timed out after 45.0s.
- Copy output included risky generic hype such as "unparalleled", "exclusive deals", and English output for a mixed Italian workflow.

Finding:
- `apps/workspace-generator/bin/benchmark-local-models.js` only supports comma-separated `--models` values via `value.split(",")`, so space-separated model args are ignored.

### Team Orchestration Evidence

Command:

```bash
/usr/bin/time -p npm run team:run out-of-office -- --type post --request "crea un post instagram basato sul business profile, senza usare numeri inventati" --steps strategy,copy,qa --model qwen2.5-coder:14b --timeout-ms 20000 --no-apply
```

Result:
- Runtime: 100.29s.
- Status: `blocked_by_content_policy`.
- All three agent steps fell back with `This operation was aborted`.
- Final artifact was fallback template content, not useful user-facing content.
- Policy blocked the artifact because the fallback text contained the word `promise`.

Finding:
- The system is safe enough not to apply blocked content, but the operator experience is weak: it waits a long time, prints no step progress, then returns a fallback artifact.
- The content policy can block internal scaffold/template text, not just real publishable copy.

### Live Trend Evidence

Command:

```bash
/usr/bin/time -p npm run research:trend out-of-office -- --live
```

Result:
- Runtime: 21.81s.
- Items: 5.
- Failures: 8.
- Google Trends returned 429 for all tested queries.
- YouTube snapshots were low relevance.
- Reddit results included noisy or weakly relevant items.

Finding:
- Current live trend research is directional and experimental, not yet professional-grade trend intelligence.

## Critical Findings

### 1. Workspace Path Traversal Risk

Severity: critical

Problem:
- Many CLIs derive workspace paths with `path.join(root, "workspaces/generated-projects", workspace)` without validating `workspace`.
- A malicious or accidental `../` workspace argument can escape the expected root.

Known risk areas:
- `packages/workflow-runner/pipeline.js`
- `apps/workspace-generator/bin/workspace-chat.js`
- `apps/workspace-generator/bin/export-client-workspace.js`
- most workspace-targeting CLI scripts

Required fix:
- Add a single resolver, for example `resolveGeneratedWorkspaceRoot(workspace)`.
- Accept only slugs matching something like `/^[a-z0-9][a-z0-9-]{0,79}$/`.
- Verify the resolved path starts with the generated workspace root plus path separator.
- Replace all hand-built workspace path joins.

### 2. Chat Can Import Arbitrary Local Files

Severity: critical

Problem:
- Natural language path detection, `/attach`, `/image`, and `/video` can read or copy files from outside the workspace.
- Text files can be injected into prompts/transcripts.
- This is useful for a local assistant, but unsafe as a default product behavior.

Key file:
- `apps/workspace-generator/bin/workspace-chat.js`

Required fix:
- Default deny external paths.
- Allow explicit import only from approved directories.
- Block dotfiles, keys, env files, secrets, browser profiles, and system folders.
- Add redaction before any content enters a prompt.
- Log every imported asset with source path, hash, and safety decision.

### 3. Link Ingestion Has SSRF-Like Risk

Severity: high

Problem:
- `analyzeLink` fetches arbitrary HTTP(S) URLs.
- It does not block localhost, private IPs, link-local ranges, metadata services, or redirects into private networks.
- It lacks content-length streaming caps.

Key file:
- `packages/asset-intel/attachment-ingestor.js`

Required fix:
- Add URL safety validation.
- Block private/local IP ranges.
- Disable or validate redirects.
- Stream with strict byte caps.
- Store failure reason when blocked.

### 4. Human Approval Is Not a Real State Gate

Severity: high

Problem:
- Human approval appears in files and policy text, but final artifacts are not governed by a strict artifact state registry.
- `team-orchestrator` can write draft targets with `applied_needs_human_review`.
- Publishing packages are checklist-based, not tied to approved artifact hashes.

Required fix:
- Add an artifact registry:
  - `draft`
  - `needs_human_review`
  - `changes_requested`
  - `approved`
  - `exported`
- Store artifact hash, approver, timestamp, source run, policy status.
- Block export/publish package generation unless artifact is approved.

### 5. Fallbacks Mask Real Model Failure

Severity: high

Problem:
- If model calls timeout, `team-orchestrator` writes fallback handoffs and can synthesize a fallback final artifact.
- This can make the system look like it completed work when the model failed.

Key file:
- `packages/workflow-runner/team-orchestrator.js`

Required fix:
- Treat model timeout as `failed_needs_model_run`.
- Save prompts and partial handoffs, but do not create a final artifact from generic fallback templates.
- Surface exact failed step and suggested retry command.

### 6. Business Profile Is Too Hardcoded

Severity: high

Problem:
- `packages/business-profile/profile.js` contains Out Of Office/NYC-specific positioning, audiences, proof, and goals.
- This is fine for the current client, but violates the general "deep interview creates any project workspace" requirement.

Required fix:
- Move Out Of Office content into fixture/sample data.
- Generate profile fields from the interview brief.
- If core facts are missing, write open questions instead of hardcoded assumptions.

## High / Medium Findings

### Generated vs Client Workspace Divergence

The app creates both:
- `workspaces/generated-projects/<workspace>`
- `workspaces/client-workspaces/<workspace>`

But chat/team operations mostly read/write generated workspace. The client workspace can become stale or ignored.

Fix:
- Choose one source of truth.
- Prefer client workspace for user-facing work, or implement explicit sync with manifests.

### Trend Research Is Noisy

The live collector fetches Reddit, Google Trends pages, and YouTube pages. It has guardrails, but relevance is weak and Google Trends rate-limits quickly.

Fix:
- Add source-specific adapters.
- Add dedupe, recency, confidence scoring, and human citation review.
- Store source snapshots with relevance decisions.

### Video Intelligence Is Mostly Technical

The video system extracts:
- ffprobe metadata
- keyframes
- volume/silence signals
- optional Whisper transcript
- ffmpeg preview edit

It does not yet run a vision model over keyframes to describe scenes, people, setting, mood, or visual hooks.

Fix:
- Feed representative frames/contact sheet to `qwen2.5vl:7b`.
- Produce semantic video report separate from technical probe.

### Quality Gate Measures Presence More Than Quality

`packages/review-loop/quality-gate.js` checks file presence, length, manifest flags, and simple markers.

Fix:
- Add quality checks for:
  - model-run success
  - source citation coverage
  - policy status
  - artifact approval status
  - platform specificity
  - business-profile specificity

### Model Routing Needs Task-Specific Ranking

Current text model selection avoids vision models, but it still tends to choose the first strong-looking model by name. It selected `qwen2.5-coder:14b`, which may not be the best social copy model.

Fix:
- Route by task:
  - `chat/social-copy`
  - `strategy/reasoning`
  - `coding`
  - `vision`
  - `fast extraction`
- Benchmark all installed candidates with comma and space-separated CLI support.

### UX Has No Progress Feedback

Long `team:run` calls can take 100s with little progress.

Fix:
- Print step start/end, model name, elapsed time, fallback status.
- Add `--fast` preset with fewer context blocks and shorter timeouts.
- Add retry command in output.

## Security / Safety Priority List

1. Workspace slug/root validation.
2. External file import allowlist and redaction.
3. URL fetch safety and SSRF blocks.
4. Artifact approval registry.
5. No final artifact from fallback-only model failure.
6. Isolated tmpdir tests that do not mutate real workspaces.

## Product Priority List

1. Make `client-workspaces/<workspace>` the actual user workspace or remove it.
2. Generalize business profile generation.
3. Add progress-aware terminal chat and team runs.
4. Add semantic video understanding with vision on frames.
5. Upgrade trend research confidence and relevance.
6. Add real approval UI/CLI loop.

## Next Engineering Task

Start with security and correctness, not UI:

1. Implement `packages/workspace-runner/workspace-paths.js`.
2. Replace workspace path construction in all CLI entrypoints.
3. Add tests/checks for traversal rejection.
4. Add safe external asset import policy.
5. Make `/attach`, `/image`, `/video`, natural paths, and `/link` use the policy.

Until those are done, the system should be treated as local prototype only.
