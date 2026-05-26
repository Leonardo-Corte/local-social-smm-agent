# Workflow Plan

Workspace: out-of-office

Mode: dry-run-prompt-packets

Final state is always `needs-human-review`. This runner does not publish, DM, comment, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| intake | intake-strategist | project-brief.json, memory/preferences.json, memory/user-feedback.md |
| research | market-researcher | project-brief.json, sources/source-registry.md, research/trend-report.md |
| strategy | brand-strategist | project-brief.json, research/trend-report.md, strategy/content-pillars.md |
| copy | copywriter | calendar/30-day-calendar.md, drafts/posts.md |
| video | reel-shorts-producer | calendar/30-day-calendar.md, drafts/reels.md |
| persona | persona-simulator | simulation/persona-report.md, drafts/posts.md |
| qa | critic-qa | review/workspace-quality-rubric.json, simulation/persona-report.md, review/qa-recap.md, drafts/posts.md |
