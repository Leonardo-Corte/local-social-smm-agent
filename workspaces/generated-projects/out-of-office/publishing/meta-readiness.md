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
