# Local Agent Task Packet

You are running inside a no-paid-API, human-approved IG/FB content workspace.

## Agent
# Platform Strategist

## Mission
Adapt research, content format, audience psychology, and approval blockers for each platform: Instagram, Facebook, LinkedIn, X, and Reddit.

## Project Context
- Project: Out Of Office
- Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
- Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
- 30-day goal: che la pagina instagram crecse orgnicamnte, e che la gente si sicrive alla ocmneuity e partecipa ai nostrin eventi costantemnte
- Tone: fallo tu in base al nostro business coemè

## Inputs
- business profile
- platform playbooks
- trend report
- current request

## Outputs
- platform-fit.md
- format-rules.md
- platform-specific-brief.md

## Allowed Tools
- platform-playbooks
- trend-intel
- source-policy

## Quality Checks
- platform is explicit
- format matches platform behavior
- research sources match platform risk
- approval blockers are platform-specific

## Escalation Rules
- Block Reddit drafts until subreddit rules are checked.
- Block X/Reddit account-facing automation unless reviewed through official/manual paths.


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
Adapt the request to each selected platform's algorithm, format expectations, audience behavior, research sources, and approval blockers.

## Target Artifact
drafts/platform-adaptations.md

## Inputs
## Input: project-brief.json

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


## Input: sources/source-registry.md

# Source Registry

| Source | Risk | Method | Allowed Use | Refresh |
| --- | --- | --- | --- | --- |
| Google Trends | low | manual export or browser-assisted public research | trend direction and topic discovery | weekly |
| YouTube public search/trending | medium | browser-assisted public research with rate limits | format, hook, title, and topic benchmarking | weekly |
| Reddit public communities | medium | public browsing, RSS where available, or official API if configured | pain points, language mining, objections | weekly |
| TikTok Creative Center | medium | manual/browser-assisted research | creative inspiration and trend patterns | weekly |
| Instagram public manual review | high | human/manual or explicitly approved browser review only | competitor and format observation | manual |
| Facebook public manual review | high | human/manual or explicitly approved browser review only | page and group topic observation without automated collection | manual |
| User-provided documents and exports | low | local file import | brand context, audience research, performance review | on upload |


## Input: research/trend-report.md

# Trend Research Plan

Generated at: 2026-05-24T19:27:18.965Z

Project: Out Of Office
Niche: allora la nichia è corporate people che vogliono connnetersi con altre perople in corporte o anceh in generle gente a cui piace fare networking tutte perosne solo a new york city
Target: tuute le perone corporate peoole, perosne a cui pioace fare netwokl di livello, i locali ci devono chiamere per fare gli venti nei loro locali anceh capito perche noi priu o meno portio 200 perosne di livello nel locale che fanno netwiking magiano e beevnono e espendono la voce ...
Mode: planned-local-first

## Source Risk Summary
- Low risk: google-trends, user-provided-assets
- Medium risk: youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center
- High risk / manual only: x-public-search-manual, instagram-public-review, facebook-public-review

## Guardrails
- Cite every source before using a claim.
- Separate observed facts from strategic inference.
- Do not automate restricted Meta surfaces.
- Treat X and Reddit account-facing actions as manual/approved only.
- For Reddit, verify subreddit rules before any public draft becomes publishable.
- Use high-risk sources only through human/manual review unless explicitly approved.

## Query Seeds
- NYC networking events trend
- NYC networking events content ideas
- NYC networking events problems objections
- NYC networking events instagram reel hooks
- NYC networking events facebook community questions
- NYC networking events linkedin post angles
- NYC networking events X thread hooks
- NYC networking events Twitter conversation prompts
- NYC networking events reddit questions objections
- NYC networking events subreddit discussion angle
- NYC corporate networking trend
- NYC corporate networking content ideas
- NYC corporate networking problems objections
- NYC corporate networking instagram reel hooks
- NYC corporate networking facebook community questions
- NYC corporate networking linkedin post angles
- NYC corporate networking X thread hooks
- NYC corporate networking Twitter conversation prompts
- NYC corporate networking reddit questions objections
- NYC corporate networking subreddit discussion angle
- NYC professional networking trend
- NYC professional networking content ideas
- NYC professional networking problems objections
- NYC professional networking instagram reel hooks
- NYC professional networking facebook community questions
- NYC professional networking linkedin post angles
- NYC professional networking X thread hooks
- NYC professional networking Twitter conversation prompts
- NYC professional networking reddit questions objections
- NYC professional networking subreddit discussion angle

## Research Tasks
### research-task-01
- Query: NYC networking events trend
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20trend
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20trend&src=typed_query

### research-task-02
- Query: NYC networking events content ideas
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20content%20ideas
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20content%20ideas&src=typed_query

### research-task-03
- Query: NYC networking events problems objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20problems%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20problems%20objections&src=typed_query

### research-task-04
- Query: NYC networking events instagram reel hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20instagram%20reel%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20instagram%20reel%20hooks&src=typed_query

### research-task-05
- Query: NYC networking events facebook community questions
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20facebook%20community%20questions
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20facebook%20community%20questions&src=typed_query

### research-task-06
- Query: NYC networking events linkedin post angles
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20linkedin%20post%20angles
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20linkedin%20post%20angles
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20linkedin%20post%20angles
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20linkedin%20post%20angles&src=typed_query

### research-task-07
- Query: NYC networking events X thread hooks
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20X%20thread%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20X%20thread%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20X%20thread%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20X%20thread%20hooks&src=typed_query

### research-task-08
- Query: NYC networking events Twitter conversation prompts
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20Twitter%20conversation%20prompts
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20Twitter%20conversation%20prompts
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20Twitter%20conversation%20prompts
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20Twitter%20conversation%20prompts&src=typed_query

### research-task-09
- Query: NYC networking events reddit questions objections
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20reddit%20questions%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20reddit%20questions%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20reddit%20questions%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20reddit%20questions%20objections&src=typed_query

### research-task-10
- Query: NYC networking events subreddit discussion angle
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20networking%20events%20subreddit%20discussion%20angle
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20networking%20events%20subreddit%20discussion%20angle
- reddit-public: https://www.reddit.com/search/?q=NYC%20networking%20events%20subreddit%20discussion%20angle
- x-public-search-manual: https://x.com/search?q=NYC%20networking%20events%20subreddit%20discussion%20angle&src=typed_query

### research-task-11
- Query: NYC corporate networking trend
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20trend
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20trend&src=typed_query

### research-task-12
- Query: NYC corporate networking content ideas
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20content%20ideas
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20content%20ideas&src=typed_query

### research-task-13
- Query: NYC corporate networking problems objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20problems%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20problems%20objections&src=typed_query

### research-task-14
- Query: NYC corporate networking instagram reel hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20instagram%20reel%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20instagram%20reel%20hooks&src=typed_query

### research-task-15
- Query: NYC corporate networking facebook community questions
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20facebook%20community%20questions
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20facebook%20community%20questions&src=typed_query

### research-task-16
- Query: NYC corporate networking linkedin post angles
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20linkedin%20post%20angles
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20linkedin%20post%20angles
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20linkedin%20post%20angles
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20linkedin%20post%20angles&src=typed_query

### research-task-17
- Query: NYC corporate networking X thread hooks
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20X%20thread%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20X%20thread%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20X%20thread%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20X%20thread%20hooks&src=typed_query

### research-task-18
- Query: NYC corporate networking Twitter conversation prompts
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20Twitter%20conversation%20prompts
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20Twitter%20conversation%20prompts
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20Twitter%20conversation%20prompts
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20Twitter%20conversation%20prompts&src=typed_query

### research-task-19
- Query: NYC corporate networking reddit questions objections
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20reddit%20questions%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20reddit%20questions%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20reddit%20questions%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20reddit%20questions%20objections&src=typed_query

### research-task-20
- Query: NYC corporate networking subreddit discussion angle
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20corporate%20networking%20subreddit%20discussion%20angle
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20corporate%20networking%20subreddit%20discussion%20angle
- reddit-public: https://www.reddit.com/search/?q=NYC%20corporate%20networking%20subreddit%20discussion%20angle
- x-public-search-manual: https://x.com/search?q=NYC%20corporate%20networking%20subreddit%20discussion%20angle&src=typed_query

### research-task-21
- Query: NYC professional networking trend
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20trend
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20trend
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20trend
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20trend&src=typed_query

### research-task-22
- Query: NYC professional networking content ideas
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20content%20ideas
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20content%20ideas
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20content%20ideas
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20content%20ideas&src=typed_query

### research-task-23
- Query: NYC professional networking problems objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20problems%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20problems%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20problems%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20problems%20objections&src=typed_query

### research-task-24
- Query: NYC professional networking instagram reel hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20instagram%20reel%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20instagram%20reel%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20instagram%20reel%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20instagram%20reel%20hooks&src=typed_query

### research-task-25
- Query: NYC professional networking facebook community questions
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20facebook%20community%20questions
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20facebook%20community%20questions
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20facebook%20community%20questions
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20facebook%20community%20questions&src=typed_query

### research-task-26
- Query: NYC professional networking linkedin post angles
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20linkedin%20post%20angles
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20linkedin%20post%20angles
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20linkedin%20post%20angles
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20linkedin%20post%20angles&src=typed_query

### research-task-27
- Query: NYC professional networking X thread hooks
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20X%20thread%20hooks
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20X%20thread%20hooks
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20X%20thread%20hooks
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20X%20thread%20hooks&src=typed_query

### research-task-28
- Query: NYC professional networking Twitter conversation prompts
- Objective: Find audience pain language and objections.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20Twitter%20conversation%20prompts
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20Twitter%20conversation%20prompts
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20Twitter%20conversation%20prompts
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20Twitter%20conversation%20prompts&src=typed_query

### research-task-29
- Query: NYC professional networking reddit questions objections
- Objective: Find format, hook, and creative patterns.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20reddit%20questions%20objections
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20reddit%20questions%20objections
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20reddit%20questions%20objections
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20reddit%20questions%20objections&src=typed_query

### research-task-30
- Query: NYC professional networking subreddit discussion angle
- Objective: Find content gaps and positioning opportunities.
- Suggested sources: google-trends, youtube-trending-and-search, reddit-public, reddit-subreddit-rules, tiktok-creative-center, user-provided-assets
- Evidence required: yes
- Status: pending
- google-trends: https://trends.google.com/trends/explore?q=NYC%20professional%20networking%20subreddit%20discussion%20angle
- youtube-trending-and-search: https://www.youtube.com/results?search_query=NYC%20professional%20networking%20subreddit%20discussion%20angle
- reddit-public: https://www.reddit.com/search/?q=NYC%20professional%20networking%20subreddit%20discussion%20angle
- x-public-search-manual: https://x.com/search?q=NYC%20professional%20networking%20subreddit%20discussion%20angle&src=typed_query



## Input: research/live-trend-report.md

# Live Trend Research Report

Generated at: 2026-05-24T15:55:02.498Z

Mode: live-public-sources

## Guardrails
- Public sources only; no login, no account automation, no DM/comment/like/follow actions.
- Use collected items as directional trend intelligence, not proof.
- Cite source URLs and collection dates.
- Separate observation from inference.

## Trend Items
### 1. https://luma.com/ishmpmbi?tk=zzHho4
- Source: project-link:luma
- Query: luma
- Risk: low
- Confidence: medium
- Relevance score: -
- Collected: 2026-05-24T15:54:52.044Z
- URL: https://luma.com/ishmpmbi?tk=zzHho4
- Observation: User-provided source. Review manually and use as high-context project evidence.
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 2. NameSummit - A Digital Branding Event in NYC
- Source: reddit-public
- Query: NYC networking events trend
- Risk: medium
- Confidence: low
- Relevance score: 3
- Collected: 2026-05-24T15:54:52.656Z
- URL: https://www.reddit.com/r/Entrepreneur/comments/6px0ox/namesummit_a_digital_branding_event_in_nyc/
- Observation: Hello fellow Redditors,

I am an event coordinator for NameSummit, a Digital branding and Marketing event taking place in NYC on August 7th and 8th. I am extending a personal invitation to the Reddit community for this event. 

I am excited
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 3. https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- Source: youtube-trending-and-search
- Query: NYC networking events trend
- Risk: medium
- Confidence: low
- Relevance score: 0
- Collected: 2026-05-24T15:54:55.948Z
- URL: https://www.youtube.com/results?search_query=NYC%20networking%20events%20trend
- Observation: Public page snapshot collected; manual review recommended.
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 4. Building a Real-Time Platform for Bars &amp; Events - NYC Cofounder Wanted
- Source: reddit-public
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: medium
- Relevance score: 4
- Collected: 2026-05-24T15:54:57.895Z
- URL: https://www.reddit.com/r/cofounderhunt/comments/1reikwi/building_a_realtime_platform_for_bars_events_nyc/
- Observation: **A real-time customer acquisition platform , activating demand through time-sensitive drink specials and events.**

The platform is a real-time nightlife platform that gives users line of sight on live drink specials they can act on immedi
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 5. Which dress for an evening work event in NYC?
- Source: reddit-public
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: medium
- Relevance score: 3
- Collected: 2026-05-24T15:54:57.895Z
- URL: https://www.reddit.com/r/OUTFITS/comments/1t2ztqz/which_dress_for_an_evening_work_event_in_nyc/
- Observation: ⭐️Edit⭐️ Thanks for the responses everyone! I will be going with the first one, and feel very confident in doing so given all the feedback. For those who asked, the first dress is from Aritzia, but it’s at least 5 years old and no longer on
- Inference: Use as directional audience/context signal only; validate before turning into claims.

### 6. https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- Source: youtube-trending-and-search
- Query: NYC networking events content ideas
- Risk: medium
- Confidence: low
- Relevance score: 0
- Collected: 2026-05-24T15:55:01.297Z
- URL: https://www.youtube.com/results?search_query=NYC%20networking%20events%20content%20ideas
- Observation: Public page snapshot collected; manual review recommended.
- Inference: Use as directional audience/context signal only; validate before turning into claims.


## Collection Failures
- google-trends / NYC networking events trend / https://trends.google.com/trends/explore?q=NYC%20networking%20events%20trend / 429
- google-trends / NYC networking events content ideas / https://trends.google.com/trends/explore?q=NYC%20networking%20events%20content%20ideas / 429


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



## Previous Agent Handoffs
## Handoff From market-researcher (research)
Status: saved_prompt_packet
Target: research/trend-report.md

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
