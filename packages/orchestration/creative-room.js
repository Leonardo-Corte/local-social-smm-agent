const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const MESSAGE_TYPES = ["idea", "reaction", "challenge", "build", "decision", "question", "synthesis"];

class CreativeRoom {
  constructor({ runId, workspaceRoot, agents }) {
    this.runId = runId;
    this.workspaceRoot = workspaceRoot;
    this.agents = agents;
    this.messages = [];
    this.round = 0;
  }

  post({ from, to = "all", type = "idea", content, round }) {
    if (!MESSAGE_TYPES.includes(type)) throw new Error(`Unknown message type: ${type}`);
    const msg = {
      id: crypto.randomBytes(4).toString("hex"),
      from,
      to,
      type,
      content: content.trim(),
      round: round ?? this.round,
      timestamp: new Date().toISOString()
    };
    this.messages.push(msg);
    return msg;
  }

  getMessages({ round, from, to, type } = {}) {
    return this.messages.filter((m) => {
      if (round != null && m.round !== round) return false;
      if (from && m.from !== from) return false;
      if (to && m.to !== to && m.to !== "all") return false;
      if (type && m.type !== type) return false;
      return true;
    });
  }

  getRoomContext({ maxChars = 8000 } = {}) {
    if (this.messages.length === 0) return "La stanza è vuota — sei il primo a parlare.";
    const lines = this.messages.map((m) => {
      const toLabel = m.to === "all" ? "tutti" : `@${m.to}`;
      return `[Round ${m.round}] ${m.from} → ${toLabel} [${m.type.toUpperCase()}]\n${m.content}`;
    });
    const full = lines.join("\n\n---\n\n");
    return full.length > maxChars ? full.slice(0, maxChars) + "\n\n[... messaggi precedenti omessi per lunghezza]" : full;
  }

  getRoundSummary(round) {
    const msgs = this.getMessages({ round });
    const byAgent = {};
    for (const m of msgs) {
      if (!byAgent[m.from]) byAgent[m.from] = [];
      byAgent[m.from].push(m);
    }
    return { round, totalMessages: msgs.length, byAgent };
  }

  persist(dir) {
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, "creative-room.json");
    fs.writeFileSync(filePath, JSON.stringify({ runId: this.runId, messages: this.messages }, null, 2));
    const mdPath = path.join(dir, "creative-room.md");
    fs.writeFileSync(mdPath, this.toMarkdown());
    return { filePath, mdPath };
  }

  toMarkdown() {
    const rounds = [...new Set(this.messages.map((m) => m.round))].sort();
    const lines = [`# Creative Room — ${this.runId}`, ""];
    for (const round of rounds) {
      lines.push(`## Round ${round}`);
      lines.push("");
      for (const m of this.getMessages({ round })) {
        const toLabel = m.to === "all" ? "tutti" : `@${m.to}`;
        lines.push(`### ${m.from} → ${toLabel} \`[${m.type}]\``);
        lines.push(m.content);
        lines.push("");
      }
    }
    return lines.join("\n");
  }
}

module.exports = { CreativeRoom };
