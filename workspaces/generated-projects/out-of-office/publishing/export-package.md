# Publishing Package

Project: Out Of Office

Status: needs-human-approval

Automatic publish: disabled

Human approval required: yes

Quality status: ready_for_human_review

## Approval Checks
- [ ] Human approved this exact caption/script/asset.
- [ ] Claims and proof points are verified.
- [ ] No DM/comment/like/follow automation is requested.
- [ ] No X reply/DM/follow/like automation or Reddit posting/commenting/voting automation is requested.
- [ ] Reddit subreddit rules are checked before any Reddit draft is used.
- [ ] Platform format and asset dimensions are checked.
- [ ] Manual or official Meta path is selected.

## Manual Publishing Path
- Export approved captions/scripts from this package.
- Prepare assets manually or through local generation.
- Review in Meta Business Suite, X, Reddit, LinkedIn, or the platform UI as appropriate.
- Publish only after final human approval.

## Meta Readiness
# Meta Publishing Readiness

Generated at: 2026-05-24T19:41:20.387Z

Project: Out Of Office

Status: manual-export-ready-api-not-configured

Automatic publish: disabled

## Supported Modes
- manual-export
- official-meta-api-assisted-after-explicit-setup

## Blocked Modes
- automatic publishing without human approval
- DM/comment/like/follow automation
- credential storage in generated workspace files
- browser bot publishing

## Official Docs To Verify During Setup
- [Instagram Graph API Content Publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing/)
- [Pages API posts](https://developers.facebook.com/docs/pages-api/posts/)
- [Meta permissions reference](https://developers.facebook.com/docs/permissions/reference/)

## Setup Checklist
- [ ] Create or choose a Meta developer app owned by the business.
- [ ] Connect the Facebook Page and Instagram professional account in Meta Business settings.
- [ ] Confirm the Instagram account is eligible for Graph API publishing.
- [ ] Request only the permissions required for the selected official publishing path.
- [ ] Keep tokens outside the generated workspace, for example in local environment variables.
- [ ] Run publish checks only after the exact caption, asset, and platform are human-approved.
- [ ] Log approver, timestamp, asset path, caption path, and platform before any official publish attempt.

## Likely Permission Areas
These must be verified against current Meta documentation before implementation:
- instagram_basic
- instagram_content_publish
- pages_show_list
- pages_read_engagement
- pages_manage_posts

## Manual Export Steps
1. Open the approved publishing package.
2. Copy the approved caption and hashtags.
3. Attach only approved media assets.
4. Check event link, date, venue, ticket inclusions, and claims.
5. Publish manually through Meta Business Suite, Instagram, Facebook, or LinkedIn.
6. Record the published URL in the workspace publishing log.

## Environment Contract For Future Official Adapter
- `META_ACCESS_TOKEN`: optional; never write token into repo files
- `META_PAGE_ID`: optional official adapter target
- `META_IG_USER_ID`: optional official adapter target
- `META_DRY_RUN`: default true until explicit human setup

## Current Decision
Manual export is the production path. The official adapter can be built later, but it must stay behind approval state, dry-run mode, and local environment variables.


## Calendar
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


## Posts
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


## Carousels
# Carousel Drafts

## Carousel 1: Why This Room Works
1. Networking is easier when the room is curated.
2. People stay longer when the event feels social, not transactional.
3. Food, drinks, and a strong venue make conversation more natural.
4. The best events create both professional value and a good night out.
5. Out Of Office is built for New York people who want both.

CTA slide: Join the community or check the next event link.

## Carousel 2: Before You Buy A Ticket
1. Who is this for? Corporate professionals, founders, operators, creatives, and ambitious people in NYC.
2. What is the vibe? Premium, warm, confident, and social.
3. What is included? Confirm the exact event details before publishing.
4. Why come? Meet interesting people in a setting designed to make connection easier.
5. Final CTA: Save the date once venue, time, and ticket details are confirmed.


## Reels
# Reel Scripts

## Reel 1: Event Recap
Opening hook: "This is what networking in New York should feel like."
Beat 1: Fast cuts of people arriving, greetings, venue energy.
Beat 2: Show conversations, food/drinks if visible and confirmed.
Beat 3: Show the room feeling active and curated.
Caption angle: A better room for people who want real-life connections after work.
CTA: Join the community or get the next ticket.
Safety note: Only mention food/drink inclusions if confirmed for that event.

## Reel 2: Anti-Stiff Networking
Opening hook: "No stiff conference energy. Just the right people in the right room."
Beat 1: Show relaxed conversations.
Beat 2: Cut to venue atmosphere.
Beat 3: End with next-event CTA card.
Caption angle: Professional networking can feel warm, social, and genuinely worth showing up for.
CTA: Link in bio / Luma link after human approval.

## Reel 3: Venue Buyer
Opening hook: "What if your venue could host a room people actually want to stay in?"
Beat 1: Show full-room energy if available.
Beat 2: Show hospitality details.
Beat 3: Mention verified event traffic only after approval.
CTA: Contact Out Of Office about hosting.
Safety note: Keep attendance and spend claims out unless proof is attached.


## X / Twitter Drafts
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


## Reddit Drafts
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


## Platform Adaptations
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


