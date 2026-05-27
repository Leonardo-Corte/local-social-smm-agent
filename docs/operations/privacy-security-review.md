# Privacy And Security Review

This system is local-first by design. It can ingest client files, create drafts,
analyze assets, and prepare publishing packages, but it must not silently post,
message, like, follow, scrape private accounts, or send private project data to
paid/cloud APIs.

## Data Boundaries

- Workspace data lives under `workspaces/generated-projects/<project>`.
- Clean client handoff data lives under `workspaces/client-workspaces/<project>`.
- Generated drafts, reports, artifacts, and approval state stay in the project workspace.
- Local model prompts may include business profile, assets, links, transcripts, and draft copy.
- Remote endpoints are blocked by default for ComfyUI and Pixelle-style services unless an explicit trusted-host override is set.

## Secrets

- Do not commit Meta, Reddit, X, Google, Luma, or model-provider tokens.
- Store tokens only in local shell environment variables or a local ignored env file.
- Publishing checks should report missing credentials as `not_configured`, not fail open.
- Never put OAuth tokens into workspace reports, model prompts, or client exports.

## Asset Handling

- Folder ingestion hashes files and records origin labels.
- Unsupported files and symlinks are rejected or flagged before downstream use.
- Video/image assets remain `needs_human_review` until explicitly approved.
- The system must not infer private facts from assets, such as attendee identity, VIP status, exact attendance, or partnerships.

## External Integrations

- Meta publishing is assisted only and requires official API readiness plus human approval.
- X and Reddit are treated as research and drafting platforms first; no vote/comment/DM automation.
- OpenMontage is AGPL and must stay as a separate service/reference boundary unless a legal license decision changes.
- Pixelle and ComfyUI adapters are optional local service contracts. Missing services should produce clear handoff files, not broken workflows.

## Human Approval Gate

- Every generated artifact defaults to `needs_human_review`.
- Publishing dry-runs must block unapproved artifacts.
- Final publish commands must require explicit artifact ID, platform, and credential readiness.
- Automatic publishing without preview is out of scope.

## Security Checks

- `npm run check` must include policy checks for vendored code, safe ingestion, publishing registry, approval CLI, dry-run publishing, and operational docs.
- Before adding a new external repo, re-run the GitHub metadata audit and update integration decisions.
- Any remote endpoint must have a local-first fallback and a documented opt-in switch.

