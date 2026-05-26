function sectionLines(markdown, headingPatterns) {
  const text = String(markdown || "");
  for (const pattern of headingPatterns) {
    const regex = new RegExp(`^#{1,3}\\s+${pattern}\\s*$`, "im");
    const match = regex.exec(text);
    if (!match) {
      continue;
    }
    const start = match.index + match[0].length;
    const rest = text.slice(start);
    const nextHeading = rest.search(/^#{1,3}\s+/m);
    const block = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    const lines = block
      .split("\n")
      .map((line) => line.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean);
    if (lines.length > 0) {
      return lines;
    }
  }
  return [];
}

function extractDecisions(markdown) {
  return sectionLines(markdown, ["Decisions Made", "Key Decisions", "Decisions"]);
}

function extractRisks(markdown) {
  return sectionLines(markdown, ["Risks Identified", "Approval Blockers", "Risks"]);
}

function extractRevisionRequest(markdown) {
  const text = String(markdown || "");
  const headingPatterns = ["Revision Needed", "Requires Revision"];
  for (const pattern of headingPatterns) {
    const regex = new RegExp(`^#{1,3}\\s+${pattern}\\s*$`, "im");
    const match = regex.exec(text);
    if (!match) {
      continue;
    }
    const start = match.index + match[0].length;
    const rest = text.slice(start);
    const nextHeading = rest.search(/^#{1,3}\s+/m);
    const block = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
    if (!block) {
      continue;
    }
    const targetMatch = block.match(/^Target:\s*(.+)$/im);
    const instructionsMatch = block.match(/^Instructions:\s*([\s\S]+?)(?=^[A-Z][a-z]+:|$)/im);
    const targetRaw = targetMatch ? targetMatch[1].trim() : "none";
    const instructionsRaw = instructionsMatch ? instructionsMatch[1].trim() : "none";
    const needed = targetRaw.toLowerCase() !== "none" && instructionsRaw.toLowerCase() !== "none";
    return {
      needed,
      targetAgent: targetRaw.toLowerCase() === "none" ? null : targetRaw,
      instructions: instructionsRaw.toLowerCase() === "none" ? null : instructionsRaw
    };
  }
  return { needed: false, targetAgent: null, instructions: null };
}

function extractConfidence(markdown) {
  const text = String(markdown || "");
  const sectionLines = sectionContent(text, ["Confidence"]);
  if (sectionLines.length > 0) {
    const parsed = parseConfidenceValue(sectionLines[0]);
    if (parsed !== null) {
      return parsed;
    }
  }
  const inlineMatch = text.match(/Confidence:\s*(\d{1,3})\s*%/i);
  if (inlineMatch) {
    return clampConfidence(Number(inlineMatch[1]));
  }
  return null;
}

function sectionContent(text, headingPatterns) {
  for (const pattern of headingPatterns) {
    const regex = new RegExp(`^#{1,3}\\s+${pattern}\\s*$`, "im");
    const match = regex.exec(text);
    if (!match) {
      continue;
    }
    const start = match.index + match[0].length;
    const rest = text.slice(start);
    const nextHeading = rest.search(/^#{1,3}\s+/m);
    const block = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    return block.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  return [];
}

function parseConfidenceValue(str) {
  const match = String(str).match(/(\d{1,3})\s*%?/);
  if (!match) {
    return null;
  }
  return clampConfidence(Number(match[1]));
}

function clampConfidence(value) {
  return Math.max(0, Math.min(100, value));
}

module.exports = {
  extractDecisions,
  extractRisks,
  extractRevisionRequest,
  extractConfidence
};
