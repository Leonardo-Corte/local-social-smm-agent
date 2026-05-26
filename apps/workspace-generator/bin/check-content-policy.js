#!/usr/bin/env node

const { auditContentPolicy } = require("../../../packages/review-loop/content-policy");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const risky = `
Join NYC's corporate elite for the best networking event NYC has to offer.
Spots are limited, act fast before they're gone.
Meet the most influential people and change your career trajectory.
`;
  const riskyAudit = auditContentPolicy(risky);
  assert(riskyAudit.status === "blocked_needs_revision", "risky copy should be blocked");
  assert(riskyAudit.blockers.length >= 4, "risky copy should produce several blockers");

  const safer = `
Out Of Office brings New York professionals together for a polished after-work networking event.
Expect a social room, conversation, and a hospitality-led setting. Ticket link in bio after human approval.
`;
  const saferAudit = auditContentPolicy(safer);
  assert(saferAudit.blockers.length === 0, "safer copy should not have blockers");

  console.log("OK content policy guardrails");
}

main();
