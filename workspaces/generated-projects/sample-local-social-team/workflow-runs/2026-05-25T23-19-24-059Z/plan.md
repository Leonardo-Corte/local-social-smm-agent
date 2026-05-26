# Workflow Plan

Workspace: sample-local-social-team

Mode: dry-run-prompt-packets

Final state is always `needs-human-review`. This runner does not publish, DM, comment, reply, vote, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| strategy | brand-strategist | project-brief.json, operations/current-request.md, operations/agent-operating-contracts.md, research/trend-report.md, strategy/content-pillars.md |
| video | reel-shorts-producer | operations/current-request.md, calendar/30-day-calendar.md, drafts/reels.md |
| qa | critic-qa | operations/current-request.md, review/workspace-quality-rubric.json, simulation/persona-report.md, review/qa-recap.md, drafts/posts.md |
