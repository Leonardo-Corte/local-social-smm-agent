# E2E System Test Report

Workspace: `out-of-office-e2e-test`

Date: 2026-05-23

## What Was Tested

- Deep interview from saved answers.
- Brief creation.
- Generated project workspace creation.
- Separate clean client workspace export.
- Model routing.
- Trend research plan.
- Persona simulation.
- Image plan.
- Quality gate.
- Publishing package.
- Client report.
- Workspace snapshot.
- Multi-agent workflow dry-run.
- Local Qwen copywriter execution through Ollama.
- Dashboard page availability.

## Results

| Area | Result |
| --- | --- |
| Interview to brief | Pass |
| Generated workspace | Pass |
| Clean client workspace | Pass |
| Bootstrap pipeline | Pass |
| Quality gate after workflow | 100/100 |
| Publishing safety | Pass, automatic publish disabled |
| Dashboard route | Pass, HTTP 200 |
| Workflow dry-run | Pass, 7 steps |
| Qwen local run | Pass, completed |
| Qwen copy quality | Needs critic/guardrail pass |

## Key Paths

- Generated workspace: `workspaces/generated-projects/out-of-office-e2e-test`
- Clean client workspace: `workspaces/client-workspaces/out-of-office-e2e-test`
- Start guide: `workspaces/client-workspaces/out-of-office-e2e-test/START_HERE.md`
- Client report: `workspaces/client-workspaces/out-of-office-e2e-test/client-report/report.md`
- Qwen run: `workspaces/generated-projects/out-of-office-e2e-test/runs/2026-05-23T08-20-32-593Z-copywriter/output.md`
- Workflow run: `workspaces/generated-projects/out-of-office-e2e-test/workflow-runs/2026-05-23T08-20-09-819Z`

## Important Finding

The system is structurally holding up, but Qwen copy output still needs a critic/guardrail pass before being allowed into final drafts.

The Qwen output included risky or overclaimed phrases such as:

- `corporate elite`
- `spots are limited`
- `best networking event NYC has to offer`
- `most influential people`
- `unparalleled connections`
- `career trajectory`

These should be treated as draft risks, not approved copy, unless a human confirms the claims.

## Verdict

The pipeline works end to end as a local-first workspace factory.

The next engineering improvement should be a stricter post-generation compliance critic for local model outputs before they can be applied to `drafts/`.
