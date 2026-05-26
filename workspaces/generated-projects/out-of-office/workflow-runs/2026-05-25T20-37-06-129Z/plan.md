# Workflow Plan

Workspace: out-of-office

Mode: dry-run-prompt-packets

Final state is always `needs-human-review`. This runner does not publish, DM, comment, reply, vote, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| strategy | brand-strategist | project-brief.json, business/business.md, platforms/platform-playbooks.md, operations/current-request.md, operations/agent-operating-contracts.md, research/trend-report.md, research/live-trend-report.md, strategy/content-pillars.md |
| copy | copywriter | business/business.md, platforms/platform-playbooks.md, operations/current-request.md, calendar/30-day-calendar.md, drafts/posts.md, drafts/threads.md, drafts/reddit.md, drafts/platform-adaptations.md, assets/analysis/image-intelligence-latest.md, sources/link-intelligence-latest.md |
| qa | critic-qa | business/business.md, platforms/platform-playbooks.md, operations/current-request.md, review/workspace-quality-rubric.json, simulation/persona-report.md, review/qa-recap.md, drafts/posts.md, drafts/threads.md, drafts/reddit.md |
