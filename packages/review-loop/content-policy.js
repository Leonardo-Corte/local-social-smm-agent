const POLICY_RULES = [
  {
    id: "unverified-superlative",
    severity: "blocker",
    pattern: /\b(best(?!\s+regards)|#1|number one|top|unparalleled|ultimate|perfect|miglior[ei]?|piu potente|più potente|piu interessante|più interessante)\b/i,
    message: "Unverified superlative or absolute quality claim."
  },
  {
    id: "unverified-attendance-number",
    severity: "blocker",
    pattern: /\b(?:around|about|approximately|circa)?\s*\d{2,5}\s+(?:attendees|people|guests|professionals|persone|ospiti|partecipanti)\b/i,
    message: "Attendance numbers need explicit confirmation before publishing."
  },
  {
    id: "false-scarcity",
    severity: "blocker",
    pattern: /\b(spots? are limited|limited spots?|before (they'?re|they are) gone|last chance|act fast|selling out|sold out|posti? limitat[oi]|ultim[iao] possibilit[aà]|prima che finiscano)\b/i,
    message: "Scarcity or urgency claim needs proof before publishing."
  },
  {
    id: "unverified-status",
    severity: "blocker",
    pattern: /\b(corporate elite|elite crowd|vip|influential people|industry leaders|most influential|movers and shakers)\b/i,
    message: "Audience status claim may be misleading unless verified."
  },
  {
    id: "outcome-promise",
    severity: "blocker",
    pattern: /\b(change your career|career trajectory|next big opportunity|guaranteed|guarantee|promises?|can truly impact|trasform[a-zà ]+opportunit|produce risultati|risultati inaspettati|opportunit[aà] reali)\b/i,
    message: "Outcome promise is too strong without proof."
  },
  {
    id: "unsupported-testimonial",
    severity: "blocker",
    pattern: /\b(testimonial|case study|everyone says|people love|trusted by)\b/i,
    message: "Testimonial/social proof claim needs a source."
  },
  {
    id: "unsupported-offer",
    severity: "blocker",
    pattern: /\b(discount|free trial|try (our|the) free|buy now|sign up)\b/i,
    message: "Offer/CTA is not allowed unless present in the brief."
  },
  {
    id: "hype-language",
    severity: "warning",
    pattern: /\b(magic|unforgettable|as good as it gets|go-to|look no further|we'?ve got you covered)\b/i,
    message: "Generic hype phrase; prefer concrete, proof-aware language."
  },
  {
    id: "emoji-heavy",
    severity: "warning",
    pattern: /[\u{1F300}-\u{1FAFF}]/u,
    message: "Emoji should be reviewed for brand fit before publishing."
  }
];

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function auditContentPolicy(content) {
  const text = String(content || "");
  const findings = [];

  for (const rule of POLICY_RULES) {
    const regex = new RegExp(rule.pattern.source, `${rule.pattern.flags.includes("i") ? "i" : ""}g${rule.pattern.flags.includes("u") ? "u" : ""}`);
    let match;
    while ((match = regex.exec(text)) !== null) {
      findings.push({
        id: rule.id,
        severity: rule.severity,
        message: rule.message,
        match: match[0],
        line: lineNumberForIndex(text, match.index)
      });
      if (match.index === regex.lastIndex) {
        regex.lastIndex += 1;
      }
    }
  }

  const blockers = findings.filter((finding) => finding.severity === "blocker");
  const warnings = findings.filter((finding) => finding.severity === "warning");

  return {
    status: blockers.length > 0 ? "blocked_needs_revision" : warnings.length > 0 ? "review_warnings" : "passed",
    blockers,
    warnings,
    findings
  };
}

function policyReportMarkdown(report) {
  return `# Content Policy Audit

Status: ${report.status}

Blockers: ${report.blockers.length}
Warnings: ${report.warnings.length}

## Findings

${report.findings.length > 0 ? report.findings.map((finding) => `- ${finding.severity.toUpperCase()} ${finding.id} line ${finding.line}: \`${finding.match}\` - ${finding.message}`).join("\n") : "No policy findings."}

## Rule

Content with blockers is draft-only and must not be applied to final artifacts or publishing packages until revised and human-approved.
`;
}

module.exports = { POLICY_RULES, auditContentPolicy, policyReportMarkdown };
