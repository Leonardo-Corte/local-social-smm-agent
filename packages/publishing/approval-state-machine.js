const transitions = {
  draft: ["self_reviewed", "rejected"],
  self_reviewed: ["needs_human_review", "rejected"],
  needs_human_review: ["approved", "rejected"],
  approved: ["published", "rejected"],
  rejected: ["draft"],
  published: []
};

function canTransition(from, to) {
  return Boolean(transitions[from] && transitions[from].includes(to));
}

function requirePublishAllowed(item) {
  if (!item || item.status !== "approved") {
    throw new Error("Publishing blocked: item must be human-approved before publish.");
  }
  if (!item.requiredHumanApproval) {
    throw new Error("Publishing blocked: human approval requirement must be explicit.");
  }
  if (!item.approval || item.approval.approvalMethod !== "human") {
    throw new Error("Publishing blocked: missing explicit human approval metadata.");
  }
  if (!item.approval.approver || !String(item.approval.approver).trim()) {
    throw new Error("Publishing blocked: missing human approver.");
  }
  if (!item.approval.approvedAt) {
    throw new Error("Publishing blocked: missing approval timestamp.");
  }
  if (item.automaticPublishEnabled) {
    throw new Error("Publishing blocked: automatic publish is disabled by policy.");
  }
  return true;
}

module.exports = {
  canTransition,
  requirePublishAllowed,
  transitions
};
