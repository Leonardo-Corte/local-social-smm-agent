# Workflow Plan

Workspace: sample-local-social-team

Mode: local-model-execution

Final state is always `needs-human-review`. This runner does not publish, DM, comment, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| copy | copywriter | calendar/30-day-calendar.md, drafts/posts.md, drafts/carousels.md, drafts/reels.md |
| persona | persona-simulator | simulation/persona-report.md, drafts/posts.md |
| qa | critic-qa | review/workspace-quality-rubric.json, simulation/persona-report.md, review/qa-recap.md, drafts/posts.md |
