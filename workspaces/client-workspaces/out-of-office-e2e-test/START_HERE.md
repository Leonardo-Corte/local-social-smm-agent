# Out Of Office E2E Test Client Workspace

This is the clean working workspace for the project.

The factory/system code stays outside this folder. Work here when reviewing strategy, drafts, assets, feedback, reports, and publishing packages.

## Start The Project AI Chat

From the factory root:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workspace:chat out-of-office-e2e-test -- --model qwen2.5:14b
```

Suggested first request:

```text
Read business/business.md and tell me what is missing before we generate content.
```

## Rebuild This Workspace

From the factory root:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workspace:bootstrap out-of-office-e2e-test
```

This regenerates reports, quality gate, publishing package, client report, snapshot, and then refreshes this client workspace.

## Run AI Agents

For a small local Qwen run:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run agent:run out-of-office-e2e-test -- --agent copywriter --model qwen2.5:14b --task "Improve drafts/posts.md for Out Of Office. Make it premium, social, New York-specific, ticket-oriented, and do not invent facts." --input drafts/posts.md
```

For workflow prompt packets:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workflow:run out-of-office-e2e-test -- --steps intake,research,strategy,copy,video,persona,qa
```

## Where To Work

- Brief: `project-brief.json`
- Business profile: `business/business.md`
- Strategy: `strategy/content-pillars.md`
- Calendar: `calendar/30-day-calendar.md`
- Captions/posts: `drafts/posts.md`
- Reels: `drafts/reels.md`
- Carousels: `drafts/carousels.md`
- Feedback: `memory/user-feedback.md`
- Publishing review: `publishing/export-package.md`
- Client report: `client-report/report.md`

## Where To Put New Assets

- Raw video: `assets/raw/`
- Frames: `assets/frames/`
- Analysis notes: `assets/analysis/`
- Competitor notes: `research/competitors/`
- Brand references: `brand/`

## Source Link

Factory workspace:

```text
/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo/workspaces/generated-projects/out-of-office-e2e-test
```

Client workspace:

```text
/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo/workspaces/client-workspaces/out-of-office-e2e-test
```

## Safety

- No automatic publishing.
- No automatic DM/comment/like/follow.
- Human approval is required before account-facing actions.
- Do not invent attendance numbers, guest identities, partnerships, prices, or event claims.
