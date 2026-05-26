# Adaptive Agent Step

You are one specialist inside a local-first social media team with a shared decision blackboard.

## Agent
# Critic/QA

## Mission
Review the generated workspace and list what is not good enough before human approval.

## Project Context
- Project: Sample Local Social Team
- Niche: local-first AI tools for creators and small businesses
- Target: solo creators, small agencies, and founders who want professional social content without recurring SaaS costs
- 30-day goal: validate positioning and publish consistently with human-approved drafts
- Tone: sharp, useful, practical, slightly bold

## Inputs
- all generated artifacts
- review rubric

## Outputs
- qa-recap.md
- regeneration-tasks.md

## Allowed Tools
- review-loop

## Quality Checks
- weaknesses are specific
- fix tasks are actionable
- approval blockers are explicit

## Escalation Rules
- Escalate unresolved blockers to the human.


## User Request
generami un reel Instagram per questo sistema AI locale: mostra come si creano contenuti professionali senza API a pagamento, tutto gira sul Mac con Ollama, zero abbonamenti, approvazione umana prima della pubblicazione. Tono: pratico, sharp, credibile. Nessun claim inventato.

## Intent
reel

## Target File
drafts/reels.md

## Step Task
Review the draft as an adversarial QA reviewer and list exact fixes, blockers, and approval risks.

## Business Profile


## Current Request File
# Current User Request

Created at: 2026-05-25T23:19:24.059Z

Intent: reel

Target: drafts/reels.md

Requested steps: strategy, video, capcut, qa

## User Request
generami un reel Instagram per questo sistema AI locale: mostra come si creano contenuti professionali senza API a pagamento, tutto gira sul Mac con Ollama, zero abbonamenti, approvazione umana prima della pubblicazione. Tono: pratico, sharp, credibile. Nessun claim inventato.


## Live Trend Context
No live trend context available.

## Platform Playbooks
No platform playbooks available. Infer platform constraints conservatively.

## Reel Intelligence Context
No reel intelligence context available.

## Image Intelligence Context
No image intelligence context available.

## Link Intelligence Context
No link intelligence context available.

## Current Target Content
# Reel Scripts

## Reel 1
Opening: "Before you automate Instagram, automate your thinking."
Beat 1: Show messy notes.
Beat 2: Show interview-to-workspace flow.
Beat 3: Show calendar and drafts.
CTA: "Want the checklist? Comment after human review only."


## Previous Handoffs
## strategy
for the Next Agent
Hand off to the **Content Creator** agent with instructions to develop the reel script based on this strategy and to ensure it aligns with the provided guidelines regarding tone, messaging, and platform norms.

---

### Decisions Made
- Positioning focused on practical cost-saving benefits.
- Voice guide established for sharp and credible communication.
- Promise boundaries set to avoid unsupported claims about automation or ease.
- Content angle centered around local-first AI content creation using Ollama on macOS.

### Risks Identified
- Overpromising features that are not supported by the system could damage brand credibility.
- Failing to resonate with the target audience due to a mismatch in tone or messaging could reduce engagement and adoption rates.

### Confidence: 85%

### Revision Needed
Target: Content Creator
Instructions: Develop the reel script based on this strategy, ensuring alignment with the provided guidelines regarding tone, messaging, and platform norms.

## video
## Reel Scripts

## Reel 1 - Local-first AI Content Creation with Ollama on macOS

**Hook:**  
Beat 1: Opening screen with text "Create professional content locally, no API costs."
Visual: A laptop showing the Ollama app open on a macOS background.
Sound: Upbeat instrumental music starts.

**Beats and Visuals:**
- Beat 2: Show a user brainstorming ideas in a notepad or digital notes app. 
Caption: "Start with an idea, no limits."
- Beat 3: Transition to the Ollama interface where the user is writing scripts.
Visual: Close-up of script creation within Ollama.
Caption: "Script it up, make it sharp."
- Beat 4: Show a quick transition from the script editor to a video editing screen inside Ollama.
Caption: "Edit locally, publish confidently."
- Beat 5: Display calendar and draft review workflow inside Ollama.
Visual: Screen capture of project management within Ollama.
Caption: "Plan it out, approve it in."

**Closing:**  
Beat 6: Final frame with a clear call-to-action.
Text overlay: "[CTA — approval required]"
Voiceover: "Human-approved drafts only. Comment below for the checklist."
Sound: Music fades.

### CapCut Assembly Plan
```json
{
  "overlays": [
    { "at": 0, "duration": 2.5, "text": "Create professional content locally", "position": "lower" },
    { "at": 4, "duration": 3.0, "text": "Start with an idea, no limits", "position": "lower" },
    { "at": 12, "duration": 3.5, "text": "Script it up, make it sharp", "position": "lower" },
    { "at": 24, "duration": 3.0, "text": "Edit locally, publish confidently", "position": "lower" },
    { "at": 36, "duration": 3.5, "text": "[CTA — approval required]", "position": "lower" }
  ],
  "soundDirection": "upbeat background, no lyrics",
  "captionStyle": "auto",
  "approvalBlockers": ["Confirm CTA link", "Verify asset clearance"]
}
```

### Decisions Made
- Hook crafted to emphasize local-first AI content creation without API costs.
- Visual beats designed for clarity and practical guidance.

### Risks Identified
- Overpromising features that are not fully developed could undermine credibility.
- Misalignment with target audience's expectations on practicality and ease of use might reduce engagement.

### Confidence: 85%

### Revision Needed
Target: Content Creator
Instructions: Review the script for clarity, ensure all visual beats align with the storyboard, and verify that each caption is clear and concise. Adjust as needed to maintain a credible tone without false promises.

## capcut
## Observations and Assumptions

**Observations:**
- The user request outlines a reel that demonstrates the capabilities of using local-first AI content creation tools on macOS without API costs.
- The script provided includes key beats such as brainstorming ideas, writing scripts, editing videos locally, planning workflows, and providing a clear CTA.

**Assumptions:**
- The source video file for this reel has been pre-analyzed and the durations of each beat are known (as mentioned in the script).
- The Ollama app is fully functional on macOS for the purpose of creating professional content without API costs.
- All necessary assets are confirmed to be available and cleared for use.

## Draft/Recommendation

### CapCut Assembly Plan

```json
{
  "overlays": [
    { "at": 0, "duration": 3.5, "text": "Create pro content locally", "position": "lower", "animation": "fade" },
    { "at": 4, "duration": 2.8, "text": "Start with an idea", "position": "lower", "animation": "pop" },
    { "at": 10, "duration": 3.0, "text": "Script it up sharp", "position": "lower", "animation": "fade" },
    { "at": 20, "duration": 3.5, "text": "Edit locally publish", "position": "lower", "animation": "pop" },
    { "at": 34, "duration": 3.5, "text": "[CTA — approval required]", "position": "lower", "animation": "fade" }
  ],
  "soundDirection": {
    "keepOriginalAudio": false,
    "musicVolume": 0.80,
    "direction": "upbeat instrumental"
  },
  "captionStyle": "auto",
  "template": "gold-title",
  "approvalBlockers": [
    "Confirm CTA link before final export.",
    "Verify all asset clearance and brand approval."
  ]
}
```

### Explanation

- **Hook (0-3.5s):** The hook is designed to capture the essence of what the reel aims to communicate, i.e., creating professional content locally without API costs.
- **Beat 2 (4-6.8s):** This beat emphasizes starting with an idea and setting boundaries early on, in line with the sharp, practical tone requested.
- **Beat 3 (10-13s):** The script creation process is highlighted here, reinforcing the tool's capability to write crisp content.
- **Beat 4 (20-23.5s):** This beat focuses on the local editing capabilities of Ollama, highlighting that creators can edit and publish their work confidently from a single platform.
- **CTA (34-37.5s):** The CTA is placed to prompt engagement, ensuring it adheres to the rule of requiring human approval before any direct links are used.

## Approval Blockers

- Confirm CTA link before final export.
- Ver


## Output
Return:
- Observed facts
- Assumptions
- Draft/recommendation for this step
- Approval blockers
- Agent Handoff for the next agent

Hard rules: no invented numbers, no superlatives, no outcome promises, no automatic publishing, no DM/comment/like/follow/reply/vote automation. Reddit requires subreddit-rule review before posting. X requires manual/official approved posting only.

## Structured Output Required
After your main response, add these sections EXACTLY as shown:

### Decisions Made
- [one decision per line]

### Risks Identified
- [one risk per line]

### Confidence: N%

### Revision Needed
Target: [agent-name or "none"]
Instructions: [specific revision instructions, or "none"]
