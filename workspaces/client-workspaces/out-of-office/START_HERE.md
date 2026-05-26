# Out Of Office Client Workspace

This is the clean working workspace for the project.

The factory/system code stays outside this folder. This workspace is the project-specific communications team: chat, agents, strategy, drafts, assets, feedback, reports, and publishing packages.

## Start The Project AI Team Chat

From the factory root:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workspace:chat out-of-office -- --model qwen2.5:14b
```

This opens the terminal chat for this specific project. You can talk naturally, and the system routes work to the social media agents behind the scenes.

Suggested first requests:

```text
Read business/business.md and tell me what is missing before we generate content.
Generami un carosello per vendere i ticket del prossimo evento.
Scrivimi 5 post per X e un mini-thread sul prossimo evento.
Crea un post Reddit community-first per chiedere feedback senza sembrare spam.
Analizza questo video: /absolute/path/to/reel.mp4
Fammi un messaggio premium per invitare un venue manager.
```

Useful chat commands:

```text
/video /absolute/path/to/reel.mp4
/make carousel voglio un carosello per il post di oggi
/make reel crea script, hook, caption e rischi approvazione
/make x scrivimi 5 post e un thread per X
/make reddit crea un post discussione per r/AskNYC con blocker regole subreddit
/image /absolute/path/to/image.png
/link https://example.com
/workflow research,strategy,copy,video,persona,qa
/feedback questo tono mi piace, più premium e meno corporate rigido
```

## Rebuild This Workspace

From the factory root:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workspace:bootstrap out-of-office
```

This regenerates business profile, agent contracts, content drafts, reports, quality gate, publishing package, client report, snapshot, and then refreshes this client workspace.

## Run AI Agents

For a small local Qwen run:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run agent:run out-of-office -- --agent copywriter --model qwen2.5:14b --task "Improve drafts/posts.md for Out Of Office. Make it premium, social, New York-specific, ticket-oriented, and do not invent facts." --input drafts/posts.md
```

For workflow prompt packets:

```bash
cd /Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo
npm run workflow:run out-of-office -- --steps intake,research,strategy,copy,video,persona,qa
```

## Where To Work

- Brief: `project-brief.json`
- Business profile: `business/business.md`
- Strategy: `strategy/content-pillars.md`
- Calendar: `calendar/30-day-calendar.md`
- Platform playbooks: `platforms/platform-playbooks.md`
- Captions/posts: `drafts/posts.md`
- Reels: `drafts/reels.md`
- Carousels: `drafts/carousels.md`
- X drafts: `drafts/threads.md`
- Reddit drafts: `drafts/reddit.md`
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
/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo/workspaces/generated-projects/out-of-office
```

Client workspace:

```text
/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo/workspaces/client-workspaces/out-of-office
```

## Safety

- No automatic publishing.
- No automatic DM/comment/like/follow.
- No automatic X replies/DMs/likes/follows.
- No automatic Reddit posting/commenting/voting/DMs.
- Reddit drafts require subreddit-rule review before use.
- Human approval is required before account-facing actions.
- Do not invent attendance numbers, guest identities, partnerships, prices, or event claims.
