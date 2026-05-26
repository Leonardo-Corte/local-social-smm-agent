# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Copywriter

## Mission
Write hooks, captions, posts, carousel copy, CTAs, and story copy.

## Project Context
- Project: Out Of Office
- Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
- Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
- 30-day goal: che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte
- Tone: fallo tu in base al nostro business coemè

## Inputs
- calendar
- voice guide
- content pillars

## Outputs
- posts.md
- carousels.md
- stories.md

## Allowed Tools
- copy templates

## Quality Checks
- hook is strong
- CTA is clear
- voice matches guide
- platform constraints met

## Escalation Rules
- Flag claims that need proof before publishing.


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
Review the requested draft target. Improve clarity, specificity, platform fit, proof-awareness, and CTA quality without inventing offers, free trials, signups, discounts, testimonials, or claims not present in the brief.

## Target Artifact
drafts/posts.md

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

Generated at: 2026-05-24T19:41:18.424Z

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

Created at: 2026-05-25T20:37:06.128Z

Intent: post

Target: drafts/posts.md

Requested steps: strategy, copy, qa

## User Request
crea un post instagram basato sul business profile, senza usare numeri inventati


## Input: calendar/30-day-calendar.md

# 30-Day Content Calendar

Goal: Grow Instagram organically. Increase community signups. Drive repeat attendance to events. Make venues understand why hosting Out Of Office can be valuable.

Audience: Corporate professionals in New York City who want high-quality networking in a more relaxed, social environment.

| Day | Pillar | Format | Topic | Status |
| --- | --- | --- | --- | --- |
| 1 | Desire | Reel | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 2 | Proof | Carousel | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 3 | Education | Static post | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 4 | Behind the scenes | Story sequence | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 5 | Offer | Facebook event/community post | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 6 | Venue buyer | LinkedIn authority post | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 7 | Desire | X single post | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 8 | Proof | X mini-thread | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 9 | Education | Reddit discussion prompt | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 10 | Behind the scenes | Reel | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |
| 11 | Offer | Carousel | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 12 | Venue buyer | Static post | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 13 | Desire | Story sequence | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 14 | Proof | Facebook event/community post | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 15 | Education | LinkedIn authority post | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 16 | Behind the scenes | X single post | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 17 | Offer | X mini-thread | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 18 | Venue buyer | Reddit discussion prompt | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 19 | Desire | Reel | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 20 | Proof | Carousel | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |
| 21 | Education | Static post | Out Of Office: Why networking feels easier when the room is curated | Draft -> QA -> human approval |
| 22 | Behind the scenes | Story sequence | Out Of Office: What a better after-work networking night looks like in NYC | Draft -> QA -> human approval |
| 23 | Offer | Facebook event/community post | Out Of Office: The difference between stiff conferences and real social connection | Draft -> QA -> human approval |
| 24 | Venue buyer | LinkedIn authority post | Out Of Office: A night designed for corporate people who still want actual fun | Draft -> QA -> human approval |
| 25 | Desire | X single post | Out Of Office: What venues gain when the right professional crowd shows up | Draft -> QA -> human approval |
| 26 | Proof | X mini-thread | Out Of Office: How to walk into the room without feeling awkward | Draft -> QA -> human approval |
| 27 | Education | Reddit discussion prompt | Out Of Office: Why food, drinks, and warm energy make networking more natural | Draft -> QA -> human approval |
| 28 | Behind the scenes | Reel | Out Of Office: Behind the scenes of building a room people want to stay in | Draft -> QA -> human approval |
| 29 | Offer | Carousel | Out Of Office: A recap angle built from real event footage | Draft -> QA -> human approval |
| 30 | Venue buyer | Static post | Out Of Office: A direct ticket CTA for the next confirmed event | Draft -> QA -> human approval |


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


## Input: drafts/platform-adaptations.md

# Platform Adaptations

## Instagram
- Lead with real event footage, fast hook, social proof through vibe.
- Best draft files: drafts/reels.md, drafts/carousels.md, drafts/posts.md.

## Facebook
- Add clearer logistics, event context, and shareable community framing.
- Best draft files: drafts/posts.md and publishing/publishing-checklist.md.

## LinkedIn
- Use professional credibility, founder/operator logic, and venue buyer value.
- Avoid hype; write like a sharp business note.

## X / Twitter
- Compress the idea into POV, tension, or timely observation.
- Use single posts and short threads; do not paste Instagram captions unchanged.
- Best draft file: drafts/threads.md.

## Reddit
- Community-first, rule-aware, transparent, and low-promo.
- Use discussion prompts and feedback requests before ticket CTAs.
- Best draft file: drafts/reddit.md.



## Input: assets/analysis/image-intelligence-latest.md

# Image Intelligence Report

Generated at: 2026-05-25T20:25:52.767Z

Asset: `assets/raw/gigigraph.png`

SHA-256: `5da3e61e87628816ccda4dda063783445c61c383515e6b727abb379ad9771bc9`

## Technical Metadata
- Kind: image
- File type: PNG image data, 1183 x 879, 8-bit/color RGBA, non-interlaced
- Format: png
- Resolution: 1183x879
- DPI: 96x96

## Visual Analysis
- Status: completed
- Model: qwen2.5vl:7b
- Local Ollama vision analysis completed.

### Model Summary
### Visible Elements:
The image appears to be a network visualization, likely representing a social media workspace or a complex network of connections. The elements include:
- **Nodes**: These are the points in the network, which could represent users, groups, or content.
- **Edges**: These are the lines connecting the nodes, indicating relationships or interactions between the elements.
- **Color Coding**: Different colors are used to distinguish between different nodes or groups, which could signify different categories or types of content.
- **Cluster Formation**: There are distinct clusters of nodes, suggesting different communities or subgroups within the network.

### Possible Social Content Angles:
1. **Community Structure**: The image could be used to illustrate the structure of a social media community, showing how users are connected and how different groups interact.
2. **Content Analysis**: It could be used to analyze the spread of content or the influence of certain users within the network.
3. **Influence Mapping**: Highlighting key influencers or hubs within the network.
4. **Network Dynamics**: Showing how the network evolves over time or in response to certain events.

### Platform Fit:
- **Instagram**: This image would be well-suited for Instagram if it is used to represent a social media workspace. It could be used in a post to showcase the interconnectedness of a community or to highlight the diversity of content within a network.
- **Facebook**: Facebook is another platform where such an image could be used to represent a social media workspace. It could be shared in a post to discuss the structure of a community or the spread of information.
- **LinkedIn**: LinkedIn is more professional and would be less suitable for this type of image unless it is used in a professional context, such as discussing the structure of a professional network or the spread of information within a company.
- **X (formerly Twitter)**: X could use this image to represent a network of users or the spread of content. It would be effective in a tweet or a thread to discuss the dynamics of a network.
- **Reddit**: Reddit could use this image to represent a subreddit or a network of users within a community. It would be effective in a post to discuss the structure of a community or the spread of content.

### What Must Not Be Claimed Without Human Confirmation:
- **Identify Specific Individuals**: The image does not provide any identifiable information about individuals. Any claims about specific individuals must be made with human confirmation.
- **Private Information**: The image does not contain any private or sensitive information. Any claims about private information must be made with human confirmation.
- **Specific Content**: The image does not provide any specific content or posts. Any claims about specific content must be made with human confirmation.

### Conclusion:
This image is a network visualization that could be used to represent a social media workspace. It is well-suited for platforms like Instagram, Facebook, and X, where it can be used to discuss the structure and dynamics of a network. It should not be used to claim specific individuals or private information without human confirmation.


## Platform Fit Notes
- Horizontal image: likely needs crop or layout adaptation for Instagram/Reels; can work for LinkedIn/Facebook.
- Do not infer identities, attendance numbers, partnerships, or ticket details from the image alone.
- If the image contains text, verify legibility manually before publishing.

## Agent Handoff
- `visual-director`: use this for crop, composition, thumbnail, and image-generation direction.
- `copywriter`: write captions only from observed or human-confirmed facts.
- `platform-strategist`: adapt the image differently for Instagram, Facebook, LinkedIn, X, and Reddit.
- `critic-qa`: block unsupported claims and weak platform fit.

## Guardrails
- Do not publish automatically.
- Do not identify private people from the image.
- Do not invent event details, attendance, venue claims, guest status, or ticket inclusions.


## Input: sources/link-intelligence-latest.md

# Link Intelligence Report

Generated at: 2026-05-24T19:40:54.777Z

URL: https://example.com

Final URL: https://example.com/

Status: ok 200

Risk: low-public-page

Content type: text/html


## Signals
- Title: Example Domain
- Description: -

## Headings
- Example Domain

## Guardrails
- Use links as context and cite the URL.
- Do not bypass login, paywalls, robots, captchas, or private areas.
- For social links, treat observations as manual-review context unless an official approved API path exists.

## Agent Handoff
- `market-researcher`: use this as cited context only.
- `platform-strategist`: adapt output by source/platform risk.
- `copywriter`: do not copy source wording too closely; summarize and transform.
- `critic-qa`: block unsupported claims.


## Previous Agent Handoffs
## Handoff From brand-strategist (strategy)
Status: saved_prompt_packet
Target: strategy/content-pillars.md

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
