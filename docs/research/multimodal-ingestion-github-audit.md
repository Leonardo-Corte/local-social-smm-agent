# Multimodal Ingestion GitHub Audit

Generated: 2026-05-24

## Scope
Find whether reliable open-source repos should be integrated for chat ingestion of images, links, videos, and arbitrary files.

## Candidates Checked

### OP-Engineering/link-preview-js
- URL: https://github.com/OP-Engineering/link-preview-js
- License: MIT
- Signal: mature focused package for link metadata extraction.
- Decision: reference only for now. The workspace needs a tiny public-link snapshotter with strict safety guardrails, so a dependency is not necessary yet.

### gomfunkel/node-exif
- URL: https://github.com/gomfunkel/node-exif
- License: MIT
- Signal: established EXIF extraction package.
- Decision: reference only for now. The first implementation uses macOS `sips` plus `file` for no-install image metadata. Add EXIF parsing later only if the product needs camera/location metadata, and strip/avoid sensitive EXIF before publishing.

### bwindels/exif-parser
- URL: https://github.com/bwindels/exif-parser
- License: MIT
- Signal: small EXIF parser.
- Decision: reference only for now for the same reason as above.

## Implementation Choice
Built a local no-dependency ingestion layer instead of cloning code:
- image metadata via local system tools
- optional Ollama vision model when installed
- link metadata via public fetch + HTML meta parsing
- existing video intelligence via ffprobe/ffmpeg/Whisper-compatible local backend
- text/file previews copied into workspace context

## Guardrails
- No private scraping, login automation, captcha bypass, or account-facing actions.
- Social links are treated as manual-review/high-risk context.
- Reddit links require subreddit-rule review before any public action.
- Image analysis must not identify private people or invent event claims.
