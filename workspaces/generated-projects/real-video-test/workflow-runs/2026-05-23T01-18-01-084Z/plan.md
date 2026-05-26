# Workflow Plan

Workspace: real-video-test

Mode: local-model-execution

Final state is always `needs-human-review`. This runner does not publish, DM, comment, like, follow, or use account-facing automation.

| Step | Agent | Inputs |
| --- | --- | --- |
| copy | copywriter | calendar/30-day-calendar.md, drafts/posts.md, assets/analysis/video-asset-report.md |
| video | reel-shorts-producer | calendar/30-day-calendar.md, drafts/reels.md, assets/analysis/video-asset-report.md |
| visuals | visual-director | model-routing-report.md, creative/visual-briefs.md, calendar/30-day-calendar.md, assets/analysis/video-asset-report.md |
| qa | critic-qa | review/workspace-quality-rubric.json, simulation/persona-report.md, review/qa-recap.md, drafts/posts.md, assets/analysis/video-asset-report.md |
