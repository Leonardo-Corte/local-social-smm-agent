# critic-qa Fallback Handoff

Status: fallback_template

The local model step did not complete in time, so this structured fallback keeps the team chain usable.

## Observed Facts
- User request: crea un post instagram basato sul business profile, senza usare numeri inventati
- Intent: post
- Previous handoffs are available and should be preserved.

## Assumptions
- The final artifact must stay draft-only and require human approval.
- Missing facts should become approval blockers, not invented claims.

## Draft/Recommendation For This Step
Review the draft as an adversarial QA reviewer and list exact fixes, blockers, and approval risks.

Use the previous handoff context below and keep the artifact concise, proof-aware, and specific:

## strategy
The next agent should keep the request focused, avoid invented numbers or status claims, and verify the final draft against content policy.

Fallback reason: This operation was aborted

## copy
The next agent should keep the request focused, avoid invented numbers or status claims, and verify the final draft against content policy.

Fallback reason: This operation was aborted


## Approval Blockers
- Confirm event details before publishing.
- Confirm ticket inclusions before mentioning food/drinks.
- Confirm any attendance, venue, guest, or partnership claim before use.

## Agent Handoff
The next agent should keep the request focused, avoid invented numbers or status claims, and verify the final draft against content policy.

Fallback reason: This operation was aborted
