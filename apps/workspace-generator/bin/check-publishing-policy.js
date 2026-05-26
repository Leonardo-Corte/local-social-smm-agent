#!/usr/bin/env node

const { canTransition, requirePublishAllowed } = require("../../../packages/publishing/approval-state-machine");

function main() {
  if (!canTransition("needs_human_review", "approved")) {
    throw new Error("Expected human review to approved transition.");
  }
  if (canTransition("draft", "published")) {
    throw new Error("Draft must not transition directly to published.");
  }
  let blocked = false;
  try {
    requirePublishAllowed({ status: "draft", automaticPublishEnabled: false });
  } catch (error) {
    blocked = true;
  }
  if (!blocked) {
    throw new Error("Draft publish was not blocked.");
  }
  let missingApprovalMetadataBlocked = false;
  try {
    requirePublishAllowed({ status: "approved", automaticPublishEnabled: false });
  } catch (error) {
    missingApprovalMetadataBlocked = /human approval metadata|human approval requirement/.test(error.message);
  }
  if (!missingApprovalMetadataBlocked) {
    throw new Error("Approved item without human approval metadata was not blocked.");
  }
  requirePublishAllowed({
    status: "approved",
    automaticPublishEnabled: false,
    requiredHumanApproval: true,
    approval: {
      approvalMethod: "human",
      approver: "QA Reviewer",
      approvedAt: new Date().toISOString()
    }
  });
  console.log("OK publishing approval state machine");
}

main();
