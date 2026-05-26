# human-approved-publishing

Source: local
License: project
Version: 0.1.0
Category: publishing
Integration status: native

## Description
Prepares platform-ready export packages and publishing checklists while preventing automatic publishing until human approval is recorded.

## Assigned Agents
- publishing-operator
- compliance-platform-guardian

## Expected Outputs
- publishing-checklist.md
- export-package.md
- approval-log.md

## Use Policy
Use the approval state machine. Drafts cannot become published unless status is approved.

## Workspace Adaptation Notes
- Use the generated project brief and workspace memory as the source of truth.
- Keep outputs local-first and human-approved.
- Do not assume BlackTwist, SaaS scheduling, or external publishing APIs are available.
