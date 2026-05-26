# feedback-memory-curation

Source: local
License: project
Version: 0.1.0
Category: memory
Integration status: native

## Description
Turns human feedback and simulation findings into durable preferences, rejected patterns, approved patterns, and regeneration tasks.

## Assigned Agents
- memory-curator
- critic-qa

## Expected Outputs
- user-feedback.md
- preferences.json
- regeneration-queue.json

## Use Policy
Preserve human feedback as the highest-priority workspace memory.

## Workspace Adaptation Notes
- Use the generated project brief and workspace memory as the source of truth.
- Keep outputs local-first and human-approved.
- Do not assume BlackTwist, SaaS scheduling, or external publishing APIs are available.
