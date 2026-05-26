# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Critic/QA

## Mission
Review the generated workspace and list what is not good enough before human approval.

## Project Context
- Project: Out Of Office
- Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
- Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
- 30-day goal: che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte
- Tone: fallo tu in base al nostro business coemè

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


## Project Brief
```json
{
  "projectName": "Out Of Office",
  "niche": "allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city",
  "targetAudience": "tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...",
  "primaryGoal30Days": "che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte",
  "offer": "tiket del evento nel qule è compero cibo e drink",
  "tone": "fallo tu in base al nostro business coemè",
  "platforms": [
    "instagram",
    "facebook",
    "linkedin",
    "x",
    "reddit"
  ],
  "constraints": [
    "human approval required before publishing",
    "no automatic DM/comment/like/follow automation",
    "do not invent attendance numbers, guest identities, partnerships, pricing, or event claims"
  ],
  "availableAssets": [
    "ho vari video della serata anceh foto"
  ],
  "approvalPolicy": "leonardo cri o ludo",
  "createdAt": "2026-05-23T22:04:30.342Z"
}

```

## Business Profile
# Business Profile

Project: Out Of Office

## Clean Positioning
Out Of Office creates premium, social networking experiences in New York City for corporate professionals and ambitious people who want real-life connections without a stiff conference atmosphere.

## Business Type
Curated networking and social events brand

## Audiences
- Primary audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.
- Secondary audience: Professionals, founders, operators, creatives, finance/tech workers, and newcomers who want to meet interesting people in person.
- Venue buyer: Hospitality venues in New York that want qualified event traffic, food and drink spend, and a polished audience.

## Offer
Ticketed networking events where admission includes the event experience and may include food and drinks when confirmed for that event.

## Value Proposition
A curated room of interesting people, food, drinks, and social energy designed to make networking feel easier, more enjoyable, and more memorable.

## 30-Day Goals
- Grow Instagram organically.
- Increase community signups.
- Drive repeat attendance to events.
- Make venues understand why hosting Out Of Office can be valuable.

## Platforms
- instagram
- facebook
- linkedin
- x
- reddit

## Brand Tone
- premium
- social
- confident
- warm
- New York energy

## Proof And Claims To Verify
- Past event videos and photos exist.
- The business claims it can bring around 200 people to venues; verify per event before using as a public claim.
- Food and drinks are included or bundled in some ticket offers; verify exact details before publishing.

## Approval Owners
leonardo cri o ludo

## Publishing Rules
- Do not publish automatically.
- Do not automate DMs, comments, likes, or follows.
- Do not automate X/Reddit replies, votes, follows, DMs, or account-facing scraping.
- For Reddit, check subreddit rules and community norms before drafting any public post.
- Do not invent attendance numbers, guest identities, partnerships, pricing, food/drink inclusions, or venue claims.
- Use 'around 200 people' only after human confirmation for the specific event/context.
- All final content must be approved by Leonardo, Cri/Cristian, or Ludo.

## Open Questions The Agent Should Ask Proactively
- What is the exact next event date, venue, and Luma/ticket link?
- What exactly is included in each ticket for the next event?
- Which public claims are confirmed: attendance, venue results, guest quality, food/drink package?
- Which Instagram/Facebook/LinkedIn/X/Reddit handles, pages, or communities should be reviewed manually?
- What competitors or references should the system watch besides Post Office Roma?

## Agent Behavior
- First, infer and clean obvious spelling or wording issues from the interview.
- Ask the human only when a missing detail changes facts, claims, pricing, event logistics, or publishing approval.
- If content is too generic, proactively rewrite it with the business profile above.
- If an asset is uploaded, extract what can be safely observed and separate observed facts from assumptions.
- Never tell the human to fix messy wording when the intent is clear; normalize it and continue.


## Model Routing Context
# Model Routing Report

Profile: Apple Silicon Pro/Max

Policy: software-only no-cost; quality depends on local hardware and installed backends

## Detected Signals
- platform:darwin
- arch:arm64
- memoryGb:18

## Local Backend Probes
| Backend | Available | Command |
| --- | --- | --- |
| Ollama | yes | ollama-api |
| MLX LM | no | - |
| llama.cpp | no | - |
| vLLM | no | - |
| ComfyUI | no | - |
| NVIDIA SMI | no | - |

## Text Models

### Frontier local reasoning/copy tier
- Role: strategy, critique, long-form copy, persona simulation
- Candidate tier: quantized 14B-32B+ open-weight instruct/reasoning model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing, vllm:missing
- License posture: audit exact checkpoint before download
- Notes: Use for strategist, critic, copywriter, and persona-simulation passes when RAM/VRAM allows.

### Fast local operator tier
- Role: summaries, extraction, task routing, checklist generation
- Candidate tier: quantized 3B-9B instruct model
- Backend fit: ollama:available, mlx:missing, llama.cpp:missing
- License posture: audit exact checkpoint before download
- Notes: Use for repeatable low-cost internal tasks so the strongest model is reserved for high-leverage thinking.

## Image Models

### Text-heavy social graphics tier
- Role: IG carousel covers, ad-like static visuals, quote cards
- Candidate tier: local workflow optimized for readable text and brand-safe compositions
- Backend fit: comfyui:missing
- License posture: audit exact image model and workflow licenses
- Notes: Prefer for carousels and graphics where legible text matters. Keep human approval before publishing.

### General local image tier
- Role: mood boards, backgrounds, concept art, visual variants
- Candidate tier: memory-aware local diffusion or image model workflow
- Backend fit: comfyui:missing
- License posture: audit exact image model and workflow licenses
- Notes: Use for optional image ideation. If ComfyUI is missing, generate precise briefs instead of blocking the workspace.

## Orchestration

### Local sequential agent batch
- Role: multi-agent workflow execution
- Candidate tier: single active model call at a time with cached context
- Backend fit: ollama:available, llama.cpp:missing, mlx:missing
- License posture: project code is no-cost; backend/model licenses audited separately
- Notes: Best default for laptops. Agents run in sequence and persist outputs to files.

## Human Decisions Required
- Download exact local model weights only after checking their license and hardware fit.
- Do not configure paid API fallbacks in generated workspaces.
- Keep image/video generation optional when hardware is too small.


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

## Task
Run a final adversarial QA pass. Decide what is not good enough for human approval and convert it into regeneration tasks.

## Target Artifact
review/qa-recap.md

## Inputs
## Input: business/business.md

# Business Profile

Project: Out Of Office

## Clean Positioning
Out Of Office creates premium, social networking experiences in New York City for corporate professionals and ambitious people who want real-life connections without a stiff conference atmosphere.

## Business Type
Curated networking and social events brand

## Audiences
- Primary audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.
- Secondary audience: Professionals, founders, operators, creatives, finance/tech workers, and newcomers who want to meet interesting people in person.
- Venue buyer: Hospitality venues in New York that want qualified event traffic, food and drink spend, and a polished audience.

## Offer
Ticketed networking events where admission includes the event experience and may include food and drinks when confirmed for that event.

## Value Proposition
A curated room of interesting people, food, drinks, and social energy designed to make networking feel easier, more enjoyable, and more memorable.

## 30-Day Goals
- Grow Instagram organically.
- Increase community signups.
- Drive repeat attendance to events.
- Make venues understand why hosting Out Of Office can be valuable.

## Platforms
- instagram
- facebook
- linkedin
- x
- reddit

## Brand Tone
- premium
- social
- confident
- warm
- New York energy

## Proof And Claims To Verify
- Past event videos and photos exist.
- The business claims it can bring around 200 people to venues; verify per event before using as a public claim.
- Food and drinks are included or bundled in some ticket offers; verify exact details before publishing.

## Approval Owners
leonardo cri o ludo

## Publishing Rules
- Do not publish automatically.
- Do not automate DMs, comments, likes, or follows.
- Do not automate X/Reddit replies, votes, follows, DMs, or account-facing scraping.
- For Reddit, check subreddit rules and community norms before drafting any public post.
- Do not invent attendance numbers, guest identities, partnerships, pricing, food/drink inclusions, or venue claims.
- Use 'around 200 people' only after human confirmation for the specific event/context.
- All final content must be approved by Leonardo, Cri/Cristian, or Ludo.

## Open Questions The Agent Should Ask Proactively
- What is the exact next event date, venue, and Luma/ticket link?
- What exactly is included in each ticket for the next event?
- Which public claims are confirmed: attendance, venue results, guest quality, food/drink package?
- Which Instagram/Facebook/LinkedIn/X/Reddit handles, pages, or communities should be reviewed manually?
- What competitors or references should the system watch besides Post Office Roma?

## Agent Behavior
- First, infer and clean obvious spelling or wording issues from the interview.
- Ask the human only when a missing detail changes facts, claims, pricing, event logistics, or publishing approval.
- If content is too generic, proactively rewrite it with the business profile above.
- If an asset is uploaded, extract what can be safely observed and separate observed facts from assumptions.
- Never tell the human to fix messy wording when the intent is clear; normalize it and continue.


## Input: platforms/platform-playbooks.md

# Platform Playbooks

Project: Out Of Office

Generated at: 2026-05-24T19:27:18.782Z

## Global Rules
- Every agent must adapt research, format, voice, CTA, and approval blockers to the target platform.
- Do not cross-post the same copy unchanged across platforms.
- No automatic publishing, DMs, comments, likes, follows, or account-facing scraping.
- If a platform has community-specific rules, the human approval gate must verify them before use.

## Instagram (`instagram`)

### Research Focus
- Reel hook patterns in the first 1-3 seconds
- Carousel save/share angles
- Creator/competitor visual pacing, thumbnails, and caption CTAs

### Format Rules
- Prefer Reels, carousels, stories, and strong visual proof.
- Lead with a visual or emotional hook before explaining.
- Keep claims proof-aware and use real event footage whenever possible.

### Audience Behavior
- Skims fast, reacts to vibe, saves useful lists, shares social proof.
- Needs to feel the room before trusting the ticket CTA.

### Automation Policy
- No auto likes, comments, follows, DMs, or account scraping.
- Publishing stays manual or official Meta route after human approval.

### Draft Targets
- drafts/reels.md
- drafts/carousels.md
- drafts/posts.md

## Facebook (`facebook`)

### Research Focus
- Event page language, local community questions, venue/event objections
- Longer context captions and logistics clarity
- Community proof and shareable event recaps

### Format Rules
- Use clearer logistics and community context than Instagram.
- Make the value obvious for attendees and venue buyers.
- Avoid automated group posting or comment activity.

### Audience Behavior
- Responds to event details, social context, trust, and practical clarity.
- May share with friends or local groups when the value is obvious.

### Automation Policy
- No group scraping or automated group posting.
- Publishing package is draft-only until human approval.

### Draft Targets
- drafts/posts.md
- publishing/publishing-checklist.md

## LinkedIn (`linkedin`)

### Research Focus
- Professional networking pain points
- Founder/operator/corporate event narratives
- Venue/business development angles

### Format Rules
- Write with professional credibility, not hype.
- Use a clear point of view, useful context, and thoughtful CTA.
- Keep the event feeling premium and credible.

### Audience Behavior
- Evaluates status, relevance, credibility, and professional upside.
- Responds to thoughtful posts, founder notes, and behind-the-scenes business logic.

### Automation Policy
- No automated connection requests, DMs, comments, likes, or scraping.
- Use manual review and approved copy only.

### Draft Targets
- drafts/posts.md
- drafts/messages.md

## X / Twitter (`x`)

### Research Focus
- Short text hooks, strong POVs, timely cultural or local conversation angles
- Thread structure for event lessons, NYC social observations, and networking takes
- Quote-friendly one-liners and reply-worthy questions

### Format Rules
- Prefer sharp single posts, mini-threads, and conversation prompts.
- Open with a point of view, tension, or specific NYC observation.
- Do not reuse Instagram captions as-is; X needs text-first velocity and compression.

### Audience Behavior
- Rewards clarity, wit, novelty, timeliness, and discussion.
- Corporate/event audiences need a useful take before a ticket CTA.

### Automation Policy
- No automated replies, DMs, follows, likes, or login-based scraping.
- Use public/manual research links and draft-only posting unless an official approved API path is configured.

### Draft Targets
- drafts/threads.md
- drafts/platform-adaptations.md

## Reddit (`reddit`)

### Research Focus
- Subreddit-specific rules, pain language, objections, and recurring questions
- NYC community discussions around networking, loneliness, professional events, and venues
- What sounds helpful versus promotional inside each subreddit

### Format Rules
- Reddit drafts must be community-first, transparent, and low-promo.
- Lead with a genuine question, useful insight, or request for feedback.
- Every draft must name the subreddit rule check as an approval blocker.

### Audience Behavior
- Rejects obvious ads and generic marketing.
- Responds to specificity, honesty, usefulness, and respect for subreddit norms.

### Automation Policy
- No automated posting, commenting, voting, DMs, or subreddit scraping beyond public low-rate research.
- A human must check subreddit rules and approve each post before any account action.

### Draft Targets
- drafts/reddit.md
- drafts/platform-adaptations.md



## Input: operations/current-request.md

# Current User Request

Created at: 2026-05-24T19:29:03.395Z

Intent: reddit

Target: drafts/reddit.md

Requested steps: research, platform, copy, qa

## User Request
crea un post Reddit per capire cosa pensano dei networking event a NYC


## Input: review/workspace-quality-rubric.json

{
  "version": "0.1.0",
  "minimumScoreToPresent": 80,
  "dimensions": [
    {
      "id": "strategic-fit",
      "label": "Strategic fit",
      "checks": [
        "niche is clear",
        "target is clear",
        "offer and goal are clear",
        "content pillars map to business outcome"
      ]
    },
    {
      "id": "content-quality",
      "label": "Content quality",
      "checks": [
        "hooks are specific",
        "drafts match voice",
        "formats vary",
        "CTAs are concrete"
      ]
    },
    {
      "id": "local-feasibility",
      "label": "Local feasibility",
      "checks": [
        "model profile is realistic",
        "visual workload matches hardware",
        "no required paid API"
      ]
    },
    {
      "id": "platform-safety",
      "label": "Platform safety",
      "checks": [
        "no spam automation",
        "approval gate present",
        "source risk labeled",
        "risky modules disabled"
      ]
    },
    {
      "id": "actionability",
      "label": "Actionability",
      "checks": [
        "calendar is complete",
        "publishing checklist is usable",
        "regeneration tasks are specific"
      ]
    }
  ]
}


## Input: simulation/persona-report.md

# Persona Simulation Report

Generated at: 2026-05-24T19:27:19.026Z

Project: Out Of Office

## Audience Panel
### Skeptical operator
- Segment: tuute le perone corporate peoole
- Motivation: save time and avoid fragile tools
- Core objection: This sounds like setup complexity disguised as automation.
- Conversion trigger: clear before/after workflow proof

### Cost-sensitive founder
- Segment: perosne a cui pioace fare netwokl di livello
- Motivation: reduce recurring SaaS costs
- Core objection: Local-first is attractive, but quality and maintenance worry me.
- Conversion trigger: specific hardware expectations and realistic limits

### Creative strategist
- Segment: i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano
- Motivation: produce better ideas faster
- Core objection: The content may become generic if the system does not learn taste.
- Conversion trigger: memory from feedback and strong examples

### Agency delivery lead
- Segment: beevnono
- Motivation: standardize client delivery
- Core objection: Approval, revisions, and client-specific voice need to be robust.
- Conversion trigger: clear review states and client-ready artifacts

### Technical early adopter
- Segment: espendono la voce ...
- Motivation: own the stack and customize agents
- Core objection: I need proof that integrations are modular and not locked to a SaaS.
- Conversion trigger: repo structure, local commands, and extension points


## Summary Scores
- Average interest: 55/100
- Average trust: 61/100
- Average clarity: 50/100
- Average purchase intent: 46/100

## Top Fixes
- Name the offer and outcome directly in the body.
- Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.
- Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.

## Persona Panel Dialogue
### Post 1: The Room
- Likely decision: not_ready
- Dominant objection: Needs concrete proof or before/after example.
- Skeptical operator: Needs concrete proof or before/after example.
- Skeptical operator: I understand the idea, but I do not yet see why I should care now.
- Panel moderator: The draft should first fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.

### Post 2: Venue Angle
- Likely decision: not_ready
- Dominant objection: Offer connection is weak or implicit.
- Skeptical operator: Offer connection is weak or implicit.
- Skeptical operator: I understand the idea, but I do not yet see why I should care now.
- Panel moderator: The draft should first fix: Name the offer and outcome directly in the body.


## Draft Evaluations
### Post 1: The Room / persona-01
- Interest: 55/100
- Trust: 50/100
- Clarity: 50/100
- Purchase intent: 42/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Skeptical operator: screenshot, before/after, workflow artifact, or mini case.

### Post 1: The Room / persona-02
- Interest: 55/100
- Trust: 50/100
- Clarity: 50/100
- Purchase intent: 42/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Cost-sensitive founder: screenshot, before/after, workflow artifact, or mini case.

### Post 1: The Room / persona-03
- Interest: 55/100
- Trust: 50/100
- Clarity: 50/100
- Purchase intent: 42/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Creative strategist: screenshot, before/after, workflow artifact, or mini case.

### Post 1: The Room / persona-04
- Interest: 55/100
- Trust: 50/100
- Clarity: 50/100
- Purchase intent: 42/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Agency delivery lead: screenshot, before/after, workflow artifact, or mini case.

### Post 1: The Room / persona-05
- Interest: 55/100
- Trust: 50/100
- Clarity: 50/100
- Purchase intent: 42/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Needs concrete proof or before/after example.
- Recommended fix: Add a concrete proof point for the Technical early adopter: screenshot, before/after, workflow artifact, or mini case.

### Post 2: Venue Angle / persona-01
- Interest: 55/100
- Trust: 72/100
- Clarity: 50/100
- Purchase intent: 49/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Offer connection is weak or implicit.
- Recommended fix: Name the offer and outcome directly in the body.

### Post 2: Venue Angle / persona-02
- Interest: 55/100
- Trust: 72/100
- Clarity: 50/100
- Purchase intent: 49/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Offer connection is weak or implicit.
- Recommended fix: Name the offer and outcome directly in the body.

### Post 2: Venue Angle / persona-03
- Interest: 55/100
- Trust: 72/100
- Clarity: 50/100
- Purchase intent: 49/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Offer connection is weak or implicit.
- Recommended fix: Name the offer and outcome directly in the body.

### Post 2: Venue Angle / persona-04
- Interest: 55/100
- Trust: 72/100
- Clarity: 50/100
- Purchase intent: 49/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Offer connection is weak or implicit.
- Recommended fix: Name the offer and outcome directly in the body.

### Post 2: Venue Angle / persona-05
- Interest: 55/100
- Trust: 72/100
- Clarity: 50/100
- Purchase intent: 49/100
- Likely reaction: I understand the idea, but I do not yet see why I should care now.
- Main objection: Offer connection is weak or implicit.
- Recommended fix: Name the offer and outcome directly in the body.


## Limits
- This is a deterministic local simulation, not market proof.
- Use it to find weak claims, missing proof, unclear CTAs, and likely objections before human approval.


## Input: review/qa-recap.md

# QA Recap

## Passes
- Workspace has agent roles, calendar, drafts, visual briefs, source registry, publishing checklist, persona report, and memory.
- Publishing is human-approved by default.

## Not Good Enough Yet
- Research is placeholder-level until live trend collection is implemented.
- Draft content is sample quality, not final campaign quality.
- Model routing is profile-based, not full benchmark-based.

## Regeneration Tasks
- Replace sample research with sourced trend report.
- Generate brand-specific variants after real user interview.
- Run persona simulation with actual target segments.


## Input: drafts/posts.md

# Draft Posts

## Post 1: The Room
Hook: Networking in New York should not feel like a conference lobby.

Body: Out Of Office is built for people who want useful professional connections without losing the social energy of a good night out. The promise is simple: a curated room, interesting people, food and drinks when confirmed for the event, and a setting that makes starting conversations easier.

CTA: Join the community or grab a ticket for the next confirmed event.

Safety note: Confirm event date, venue, ticket inclusions, and link before publishing.

## Post 2: Venue Angle
Hook: A strong event is not just traffic. It is the right room.

Body: For New York venues, Out Of Office can position events around qualified professional attendance, social energy, and food and drink spend. Any attendance number or venue result must be verified before it becomes a public claim.

CTA: Ask about hosting a future Out Of Office night.

Safety note: Do not publish attendance claims unless a human confirms the exact proof.


## Input: drafts/threads.md

# X / Twitter Drafts

## Single Post 1: NYC Networking POV
Hook: Most networking events in New York feel like work after work. The room has to earn your evening.

Body: Out Of Office should position each event around a simple tension: corporate people want useful connections, but they also want a night that feels alive. The best X angle is a sharp observation first, ticket CTA second.

CTA: Join the community when the next event link is approved.

Approval blockers:
- Confirm next event date, venue, and link before CTA.
- Do not imply guaranteed outcomes or unverified attendee quality.

## Mini-Thread 1: Why The Room Matters
1. Networking works better when the room is curated and the energy is social.
2. People do not just buy access. They buy the chance to walk into a room where conversation feels easier.
3. For NYC professionals, after-work time is expensive. The event has to feel worth leaving the office for.
4. Out Of Office should show the vibe, the people, and the reason to come back.
5. CTA after approval: next event link / community signup.

Approval blockers:
- Confirm any ticket inclusions before mentioning food or drinks.
- Keep attendance numbers out unless human-confirmed for this exact post.


## Input: drafts/reddit.md

# Reddit Drafts

## Community-First Post Template
Target subreddit: [human selects subreddit]

Title option: NYC professionals: what makes a networking event actually worth showing up to?

Body:
I am working on Out Of Office, a New York event concept for professionals who want networking to feel less stiff and more social.

Before pushing harder on promotion, I want to understand what people here actually dislike about networking events in NYC:

- What makes an event feel worth the time?
- What makes it feel like a waste?
- Do food, drinks, venue, or attendee curation change whether you would go?

Not trying to spam a link here. Looking for honest feedback before shaping the next event.

Approval blockers:
- Human must check subreddit rules before posting.
- Remove or rewrite if the subreddit does not allow market research, events, or self-reference.
- Do not include ticket links unless that subreddit explicitly allows promotion.

## Reddit Research Notes
- Use Reddit mainly for objections, language, and community truth.
- Drafts should feel like a real conversation, not an ad.
- When in doubt, ask for feedback instead of selling.


## Previous Agent Handoffs
## Handoff From market-researcher (research)
Status: saved_prompt_packet
Target: research/trend-report.md

Prompt packet saved. Run with --execute to use a detected local Ollama model.


## Handoff From platform-strategist (platform)
Status: saved_prompt_packet
Target: drafts/platform-adaptations.md

Prompt packet saved. Run with --execute to use a detected local Ollama model.


## Handoff From copywriter (copy)
Status: saved_prompt_packet
Target: drafts/posts.md

Prompt packet saved. Run with --execute to use a detected local Ollama model.



## Output Contract
- Be specific to this workspace.
- Clean obvious messy wording from user input yourself; do not ask the human to correct typos when intent is clear.
- Ask proactive follow-up questions only for factual gaps that affect claims, event logistics, pricing, tickets, approvals, or publishing safety.
- Flag assumptions and risks.
- Do not invent product claims, free trials, signups, discounts, testimonials, case studies, or CTAs that are not present in the brief.
- Prefer practical, proof-aware language over aggressive sales language.
- Do not recommend DM/comment/like/follow automation.
- Do not mark anything ready to publish without explicit human approval.
- Include a section named "Recommended Fixes" with concrete bullets.
- If and only if you are proposing a full replacement for the target artifact, include a section named "Proposed Artifact" containing one fenced code block with the complete replacement content.
- Include a section named "Agent Handoff" with what the next agent should keep, challenge, and verify.
- End with concrete next regeneration or approval steps.
