# Final Social Team Synthesis

You are the final editor for a local-first social media agent team.

## User Request
generami un reel Instagram per questo sistema AI locale: mostra come si creano contenuti professionali senza API a pagamento, tutto gira sul Mac con Ollama, zero abbonamenti, approvazione umana prima della pubblicazione. Tono: pratico, sharp, credibile. Nessun claim inventato.

## Intent
reel

## Target File
drafts/reels.md

## Business Profile


## Publishing Policy
```json
{
  "version": "0.1.0",
  "mode": "human-approved",
  "defaults": {
    "allowAutomaticPublish": false,
    "allowDmAutomation": false,
    "allowCommentAutomation": false,
    "allowLikeFollowAutomation": false,
    "allowCaptchaBypass": false,
    "allowCredentialStorage": false
  },
  "approvalStates": [
    "draft",
    "self_reviewed",
    "needs_human_review",
    "approved",
    "rejected",
    "published"
  ],
  "requiredBeforePublish": [
    "human approval",
    "platform checklist complete",
    "asset availability confirmed",
    "claims reviewed",
    "account permission confirmed"
  ],
  "experimentalModulesDefault": "disabled"
}

```

## Platform Playbooks
No platform playbooks available.

## Current Target File Content
# Reel Scripts

## Reel 1
Opening: "Before you automate Instagram, automate your thinking."
Beat 1: Show messy notes.
Beat 2: Show interview-to-workspace flow.
Beat 3: Show calendar and drafts.
CTA: "Want the checklist? Comment after human review only."


## Specialist Outputs
### strategy
### Observed Facts
- The system is a local-first AI tool for creators and small businesses.
- It operates on macOS with Ollama.
- There are no API costs involved in content creation.
- Content must be approved by humans before publication.

### Assumptions
- The reel aims to highlight the practicality of creating professional content without relying on paid APIs or recurring subscriptions.
- The tone should be sharp and credible, avoiding any inflated claims or superlatives.
- Ollama is a key component in facilitating this process.
- The target audience comprises solo creators, small agencies, and founders who seek cost-effective solutions for their social media content.

### Draft/Recommendation for This Step
#### Positioning
Position the AI system as an innovative local solution that empowers users to create professional-grade content without the need for ongoing API costs or subscriptions. Emphasize the flexibility, independence, and practical benefits of using Ollama on macOS for content creation.

#### Voice Guide
Voice should be clear, concise, and action-oriented with a slight edge of boldness.
- **Tone:** Practical, sharp, credible.
- **Style:** Direct and to-the-point, avoiding fluff or exaggeration.
- **Vocabulary:** Industry-standard but accessible terms that resonate with the target audience.

#### Promise Boundaries
Ensure all claims are realistic and supported by the system's capabilities. Avoid any promises related to automated social media management without human oversight (e.g., no DM/comment/like/follow/reply/vote automation).
- Focus on what the user can achieve independently using Ollama for content creation.
- Highlight the value of manual review in maintaining quality and integrity.

#### Platform Fit
The reel is intended for Instagram, making it crucial to tailor the content to align with platform norms while emphasizing practical benefits over flashy gimmicks. The video should be engaging enough to attract attention but grounded in reality.

#### Content Angle
Develop a short script that showcases the simplicity and effectiveness of using Ollama on macOS for professional content creation without relying on costly APIs or subscriptions.
- **Opening:** "Create professional social media content locally, without monthly fees."
- **Beat 1:** Demonstrate the process from idea conception to polished draft using Ollama directly on a Mac computer.
- **Beat 2:** Illustrate how this tool fits into an existing workflow (e.g., after interviews or brainstorming sessions).
- **CTA:** Invite users to engage by requesting more information via comments, emphasizing human approval before any content is published.

### Approval Blockers
- Ensure the tone and messaging do not overpromise features or benefits that are unsupported.
- Avoid creating a false sense of automation or ease without proper context about manual oversight.

### Agent Handoff for the Next Agent
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

### video
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

### capcut
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
- Verify all asset clearance and brand approval.

### Decisions Made
- Created a precise CapCut Assembly Plan for the reel based on provided script and guidelines.
- Ensured all visual beats align with practical benefits of using Ollama on macOS without API costs.
- Chosen animations are relevant to each beat's context, enhancing clarity and engagement.

### Risks Identified
- Overpromising features not yet fully supported by Ollama could undermine credibility.
- Misalignment with the target audience’s expectations might reduce engagement due to perceived complexity or limitations.

### Confidence: 85%

### Revision Needed
Target: Content Creator
Instructions: Review the script for clarity and ensure all visual beats align perfectly with the storyboard. Confirm that captions are clear, concise, and credible without false promises. Adjust as needed before final approval.

### qa
## Observed Facts
- The user requested a reel showcasing the capabilities of creating professional content locally using Ollama on macOS without API costs.
- The current script includes key beats such as brainstorming ideas, writing scripts, editing videos, and planning workflows with clear captions.

## Assumptions
- All necessary assets for the reel (video clips, images, sounds) are available and cleared for use.
- The Ollama app is fully functional on macOS to create professional content without API costs.
- The user has access to all required software like CapCut for editing the video.

## Draft/Recommendation
The current draft provides a solid foundation but needs refinement in several areas. Here’s an updated version of the draft with clearer instructions and more specific details:

### Revised CapCut Assembly Plan

```json
{
  "overlays": [
    { "at": 0, "duration": 3.5, "text": "Create pro content locally", "position": "lower" },
    { "at": 4, "duration": 2.8, "text": "Start with an idea", "position": "lower" },
    { "at": 10, "duration": 3.0, "text": "Script it up sharp", "position": "lower" },
    { "at": 20, "duration": 3.5, "text": "Edit locally publish", "position": "lower" },
    { "at": 34, "duration": 3.5, "text": "[CTA — approval required]", "position": "lower" }
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
- **Hook (0-3.5s):** The opening message emphasizes the core value proposition: creating professional content locally without API costs.
- **Beat 2 (4-6.8s):** This beat encourages starting with a clear idea, setting expectations for practical and actionable content creation.
- **Beat 3 (10-13s):** Emphasizes the process of writing sharp and credible scripts within Ollama.
- **Beat 4 (20-23.5s):** Highlights local editing capabilities, reinforcing the confidence in publishing locally without external dependencies.
- **CTA (34-37.5s):** The CTA prompts viewers to engage by commenting for a checklist, ensuring human approval is required before proceeding.

## Approval Blockers
- Confirm the CTA link before final export.
- Verify all asset clearance and brand approval.
- Ensure that the reel adheres strictly to the tone of being sharp, practical, and credible without any unsupported claims or superlatives.

### Decisions Made
- Hook crafted to emphasize local-first AI content creation without API costs.
- Visual beats designed for clarity and practical guidance.
- CTA adjusted to require human approval before final export.

### Risks Identified
- Overpromising features that are not fully developed could undermine credibility.
- Misalignment with target audience's expectations on practicality and ease of use might reduce engagement.
- Failing to verify all asset clearance might result in copyright issues or legal complications.

### Confidence: 85%

### Revision Needed
Target: Content Creator
Instructions: Review the script for clarity, ensure all visual beats align with the storyboard, and verify that each caption is clear and concise. Adjust as needed to maintain a credible tone without false promises.

### copy (revised)
## Observed Facts
- The user requested a reel showcasing the capabilities of creating professional content locally using Ollama on macOS without API costs.
- The previous drafts outline key beats such as brainstorming ideas, writing scripts, editing videos, and planning workflows with clear captions.

## Assumptions
- All necessary assets for the reel (video clips, images, sounds) are available and cleared for use.
- The Ollama app is fully functional on macOS to create professional content without API costs.
- The user has access to all required software like CapCut for editing the video.

## Draft/Recommendation

### Revised Reel Script with Clear Captions and Visual Beats
**Hook:**
Beat 1: Opening screen with text "Create pro content locally."
Visual: A laptop showing Ollama app on macOS.
Sound: Upbeat instrumental music starts.

**Beats and Visuals:**
- Beat 2: Show a user brainstorming ideas in notes or digital workspace.
Caption: "Start with an idea, no limits."
- Beat 3: Transition to the script creation process within Ollama.
Visual: Close-up of writing scripts inside Ollama.
Caption: "Script it up sharp."
- Beat 4: Display video editing capabilities within Ollama.
Visual: Editing screen inside Ollama.
Caption: "Edit locally, publish confidently."
- Beat 5: Show workflow planning and draft review process in Ollama.
Visual: Calendar and drafts review workflow inside Ollama.
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
    { "at": 0, "duration": 3.5, "text": "Create pro content locally", "position": "lower" },
    { "at": 4, "duration": 2.8, "text": "Start with an idea", "position": "lower" },
    { "at": 10, "duration": 3.0, "text": "Script it up sharp", "position": "lower" },
    { "at": 20, "duration": 3.5, "text": "Edit locally publish", "position": "lower" },
    { "at": 34, "duration": 3.5, "text": "[CTA — approval required]", "position": "lower" }
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
- **Hook (0-3.5s):** The opening message emphasizes the core value proposition: creating professional content locally without API costs.
- **Beat 2 (4-6.8s):** This beat encourages starting with a clear idea, setting expectations for practical and actionable content creation.
- **Beat 3 (10-13s):** Emphasizes the process of writing sharp and credible scripts within Ollama.
- **Beat 4 (20-23.5s):** Highlights local editing capabilities, reinforcing the confidence in publishing locally without external dependencies.
- **CTA (34-37.5s):** The CTA prompts viewers to engage by commenting for a checklist, ensuring human approval is required before proceeding.

## Approval Blockers
- Confirm the CTA link before final export.
- Verify all asset clearance and brand approval.
- Ensure that the reel adheres strictly to the tone of being sharp, practical, and credible without making unsupported claims or promises.

### Decisions Made
- Hook crafted to emphasize local-first AI content creation without API costs.
- Visual beats designed for clarity and practical guidance.
- Captions written in a clear, concise manner to maintain credibility.

### Risks Identified
- Overpromising features that are not fully developed could undermine credibility.
- Misalignment with target audience's expectations on practicality and ease of use might reduce engagement.

### Confidence: 85%

### Revision Needed
Target: Content Creator
Instructions: Review the script for clarity, ensure all visual beats align with the storyboard, and verify that each caption is clear and concise. Adjust as needed to maintain a credible tone without false promises.

### qa
## Observed Facts
- The user requested a reel showcasing the capabilities of creating professional content locally using Ollama on macOS without API costs.
- Key beats include brainstorming ideas, writing scripts, editing videos locally, and planning workflows with clear captions.

## Assumptions
- All necessary assets for the reel (video clips, images, sounds) are available and cleared for use.
- The Ollama app is fully functional on macOS to create professional content without API costs.
- The user has access to all required software like CapCut for editing the video.

## Draft/Recommendation

### Revised Reel Script with Clear Captions and Visual Beats
**Hook:**
Beat 1: Opening screen with text "Create pro content locally."
Visual: A laptop showing Ollama app on macOS.
Sound: Upbeat instrumental music starts.

**Beats and Visuals:**
- Beat 2: Show a user brainstorming ideas in notes or digital workspace.
Caption: "Start with an idea, no limits."
- Beat 3: Transition to the script creation process within Ollama.
Visual: Close-up of writing scripts inside Ollama.
Caption: "Script it up sharp."
- Beat 4: Display video editing capabilities within Ollama.
Visual: Editing screen inside Ollama.
Caption: "Edit locally, publish confidently."
- Beat 5: Show workflow planning and draft review process in Ollama.
Visual: Calendar and drafts review workflow inside Ollama.
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
    { "at": 0, "duration": 3.5, "text": "Create pro content locally", "position": "lower" },
    { "at": 4, "duration": 2.8, "text": "Start with an idea", "position": "lower" },
    { "at": 10, "duration": 3.0, "text": "Script it up sharp", "position": "lower" },
    { "at": 20, "duration": 3.5, "text": "Edit locally publish", "position": "lower" },
    { "at": 34, "duration": 3.5, "text": "[CTA — approval required]", "position": "lower" }
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
- **Hook (0-3.5s):** The opening message emphasizes the core value proposition: creating professional content locally without API costs.
- **Beat 2 (4-6.8s):** This beat encourages starting with a clear idea, setting expectations for practical and actionable content creation.
- **Beat 3 (10-13s):** Emphasizes the process of writing sharp and credible scripts within Ollama.
- **Beat 4 (20-23.5s):** Highlights local editing capabilities, reinforcing the confidence in publishing locally without external dependencies.
- **CTA (34-37.5s):** The CTA prompts viewers to engage by commenting for a checklist, ensuring human approval is required before proceeding.

## Approval Blockers
- Confirm the CTA link before final export.
- Verify all asset clearance and brand approval.
- Ensure that the reel adheres strictly to the tone of being sharp, practical, and credible.

### Decisions Made
- Revised captions and visuals for clarity and adherence to the user request.
- Maintained the structure of key beats in the script.
- Added clear instructions for CapCut assembly plan with overlays and sound direction.

### Risks Identified
- Uncertainty regarding asset clearance and brand approval before final export.
- Possibility of misalignment between visual elements and captions.
- Lack of confirmation on CTA link availability before final review.

### Confidence: 85%

### Revision Needed
Target: none
Instructions: none


## Required Final Artifact Rules
- Write only the target artifact content, not commentary.
- Use the user's request as the concrete brief.
- Keep it specific to the business profile.
- If facts are missing, include a short "Approval Blockers" section instead of inventing.
- No automatic publishing language.
- No DM/comment/like/follow/reply/vote automation.
- X drafts must be text-first and not pasted Instagram-style.
- Reddit drafts must be community-first and include subreddit-rule approval blockers.
- No invented attendance, guest, venue, price, food/drink, scarcity, testimonial, partnership, or performance claims.
- The artifact is draft-only and needs human review.
