function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value !== "string") {
    return [];
  }
  return value
    .replace(/\s+\be\b\s+/gi, ",")
    .replace(/\s+\band\b\s+/gi, ",")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUnknownAnswer(value) {
  const text = String(value || "").trim().toLowerCase();
  return !text || ["bho", "boh", "non lo so", "non so", "nessuno", "niente"].includes(text);
}

function normalizeTone(value) {
  if (isUnknownAnswer(value)) {
    return "social, polished, energetic, witty, aspirational but not fake";
  }
  return String(value || "").trim();
}

function normalizeConstraints(value) {
  const items = normalizeList(value).filter((item) => !isUnknownAnswer(item) && !/non vedo limiti/i.test(item));
  return items.length > 0
    ? items
    : [
        "human approval required before publishing",
        "no automatic DM/comment/like/follow automation",
        "do not invent attendance numbers, guest identities, partnerships, pricing, or event claims"
      ];
}

function normalizeBrief(raw) {
  return {
    projectName: String(raw.projectName || "").trim(),
    niche: String(raw.niche || "").trim(),
    targetAudience: String(raw.targetAudience || "").trim(),
    primaryGoal30Days: String(raw.primaryGoal30Days || "").trim(),
    offer: String(raw.offer || "").trim(),
    tone: normalizeTone(raw.tone),
    platforms: normalizeList(raw.platforms),
    constraints: normalizeConstraints(raw.constraints),
    availableAssets: normalizeList(raw.availableAssets),
    approvalPolicy: String(raw.approvalPolicy || "human-approved").trim(),
    createdAt: raw.createdAt || new Date().toISOString()
  };
}

function validateBrief(brief, questionBank) {
  const missing = [];
  for (const field of questionBank.requiredFields) {
    const value = brief[field];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        missing.push(field);
      }
    } else if (!value) {
      missing.push(field);
    }
  }
  return {
    valid: missing.length === 0,
    missing
  };
}

function buildBriefFromAnswers(answers, questionBank) {
  const brief = normalizeBrief(answers);
  const validation = validateBrief(brief, questionBank);
  return { brief, validation };
}

function applyTemplate(rawAnswers, template) {
  if (!template) {
    return rawAnswers;
  }
  return {
    ...rawAnswers,
    niche: rawAnswers.niche || template.niche,
    targetAudience: rawAnswers.targetAudience || template.targetAudience,
    offer: rawAnswers.offer || template.offer,
    tone: rawAnswers.tone || template.tone,
    contentTemplate: template.id,
    templatePillars: template.contentPillars || [],
    recommendedFormats: template.recommendedFormats || []
  };
}

module.exports = {
  applyTemplate,
  buildBriefFromAnswers,
  normalizeBrief,
  validateBrief
};
