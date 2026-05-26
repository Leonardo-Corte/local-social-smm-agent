# Workflow Plan

Workspace: out-of-office

Mode: dry-run-prompt-packets

Final state is always `needs-human-review`. This runner does not publish, DM, comment, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| intake | intake-strategist | project-brief.json, business/business.md, memory/preferences.json, memory/user-feedback.md |
| research | market-researcher | project-brief.json, business/business.md, sources/source-registry.md, research/trend-report.md, research/live-trend-report.md, research/trend-items.json |
| strategy | brand-strategist | project-brief.json, business/business.md, research/trend-report.md, research/live-trend-report.md, strategy/content-pillars.md |
| calendar | content-planner | business/business.md, strategy/content-pillars.md, calendar/30-day-calendar.md |
