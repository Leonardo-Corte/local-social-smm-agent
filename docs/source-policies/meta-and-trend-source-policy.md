# Meta and Trend Source Policy

## Default Posture
The system is hybrid-controlled:
- Publishing and account-facing actions prefer official APIs and human approval.
- Trend research can use public web, search, RSS, manual exports, and browser-assisted review.
- Automated collection from Meta products is restricted unless explicitly authorized and reviewed.

## Hard Blocks
- No automatic DM/comment/like/follow spam.
- No automatic publish without preview and human approval.
- No captcha/login/rate-limit bypass.
- No aggressive or massive scraping from Instagram/Facebook.

## Source Risk Levels
- `low`: RSS, public websites with permissive terms, user-provided docs, manual exports.
- `medium`: browser-assisted public research with rate limits.
- `high`: platform pages with restrictive terms, login-required pages, automation-sensitive surfaces.
- `blocked`: bypass, spam, credential abuse, private data, prohibited collection.

## Required Labels
Every source in a generated workspace must include:
- URL or description.
- Collection method.
- Risk level.
- Refresh cadence.
- Allowed use.
- Notes on limits.
