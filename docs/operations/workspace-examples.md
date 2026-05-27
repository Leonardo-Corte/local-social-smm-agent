# Workspace Examples

These examples define what a healthy generated client workspace should look like.
They are not dashboards. The primary interface remains the terminal chat.

## Sample Local Social Team

Path: `workspaces/generated-projects/sample-local-social-team`

Use this workspace for checks and smoke tests. It should contain:

- `business/business.md` for the cleaned business profile.
- `platforms/platform-playbooks.md` for Instagram, Facebook, LinkedIn, X, and Reddit platform posture.
- `assets/asset-library.json` for imported local/Drive-synced files.
- `research/trend-report.md` and optional `research/live-trend-report.md`.
- `drafts/posts.md`, `drafts/reels.md`, and `drafts/carousels.md`.
- `review/creative-performance-review.md`.
- `publishing/artifact-registry.json`.

Useful commands:

```bash
npm run workspace:chat sample-local-social-team
npm run creative:run sample-local-social-team
npm run video:engines sample-local-social-team -- --compare
npm run publishing:dry-run sample-local-social-team -- --artifact <artifact-id> --platform instagram
```

## Out Of Office

Path: `workspaces/generated-projects/out-of-office`

This is the real NYC networking-event style workspace created from the interview.
Use it to test real prompts such as:

```text
creami 4 reel per Instagram e X usando gli asset nella cartella Drive, con hook diversi e approvazione finale
```

Expected flow:

1. Chat extracts the intent and updates current request context.
2. Agents use business profile, platform playbooks, trends, assets, and memory.
3. Consensus/creative workflow produces drafts and reports.
4. Artifacts stay in `needs_human_review`.
5. Human approval happens before any publishing dry-run or official API step.

## Healthy Workspace Criteria

- Business profile exists and is readable by agents.
- Platform playbooks exist for each selected platform.
- Asset ingestion queue exists when files are imported.
- Reports explain blockers instead of silently failing.
- No artifact can publish automatically.
- Every generated image/video has a quality or review report.

