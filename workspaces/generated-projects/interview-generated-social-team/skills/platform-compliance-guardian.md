# platform-compliance-guardian

Source: local
License: project
Version: 0.1.0
Category: safety
Integration status: native

## Description
Checks platform risk, source policy, license boundaries, approval gates, and blocked account actions before content or integrations move forward.

## Assigned Agents
- compliance-platform-guardian
- critic-qa

## Expected Outputs
- risk-review.md
- blocked-actions.md
- approval-gates.md

## Use Policy
Block risky account actions by default; require explicit human approval for publishing, credentials, high-risk sources, or experimental automation.

## Workspace Adaptation Notes
- Use the generated project brief and workspace memory as the source of truth.
- Keep outputs local-first and human-approved.
- Do not assume BlackTwist, SaaS scheduling, or external publishing APIs are available.
