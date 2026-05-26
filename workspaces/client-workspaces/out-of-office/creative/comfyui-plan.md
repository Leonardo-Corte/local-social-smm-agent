# Optional ComfyUI Image Plan

Status: brief-only

Human approval required: yes

Automatic publish: disabled

## Local Backend
- Command probe: missing
- ComfyUI folder: not found
- Model folder: not found
- Checkpoints found: none
- LoRAs found: none
- Workflows found: none

## Workflow Notes
- Use local image generation only after exact model/workflow license checks.
- Do not generate or publish platform assets without human approval.
- Prefer text-light layouts unless the selected image model is proven reliable with text.
- Keep brand consistency and avoid misleading claims in generated visuals.

## Recommended Local Model Tracks
### sdxl-lightning-or-turbo
- Fit: fast poster, thumbnail, story background drafts
- Backend required: ComfyUI
- Install priority: install-backend-first
- License posture: check exact model card before commercial/public use
- Notes: Good first local workflow for Apple Silicon when speed matters; avoid relying on generated text inside images.

### flux-schnell-compatible-local-workflow
- Fit: higher quality moodboards and event visuals
- Backend required: ComfyUI
- Install priority: medium
- License posture: check exact weights and commercial terms
- Notes: Use only if hardware handles it comfortably; keep prompts text-light and add copy separately in design tools.

### sd15-or-sdxl-controlnet
- Fit: reusable brand layouts and reference-guided variants
- Backend required: ComfyUI
- Install priority: later
- License posture: check checkpoint and ControlNet license
- Notes: Useful after base generation is stable and brand assets exist.


## Prompt Seeds
### event-poster
- Purpose: Event poster background
- Size: 1080x1350
- Prompt: premium New York networking event, stylish professionals in a warm venue, candid social energy, editorial photography, clean negative space for typography, no readable text, realistic lighting

### reel-thumbnail
- Purpose: Reel thumbnail
- Size: 1080x1920
- Prompt: vertical event recap thumbnail, energetic after-work networking in New York, confident premium social atmosphere, expressive faces, sharp foreground, no readable text

### carousel-cover
- Purpose: Carousel cover
- Size: 1080x1350
- Prompt: modern editorial cover image for professional networking tips, New York evening venue, refined but approachable, strong composition, large clean empty area for headline, no readable text

### story-background
- Purpose: Story background
- Size: 1080x1920
- Prompt: Instagram story background for premium networking event, lively conversation, drinks and warm ambience, elegant New York venue, uncluttered center area, no readable text

### brand-moodboard
- Purpose: Brand moodboard
- Size: 1536x1024
- Prompt: moodboard for premium social networking brand in New York, candid conversations, after-work energy, hospitality venue details, confident warm visual language, editorial grid


## Source Visual Briefs
# Visual Briefs

## Brand Feel
- Premium but not cold.
- New York evening energy.
- Warm hospitality lighting.
- Candid professional conversations.
- Social proof through real room energy, not exaggerated claims.

## Asset Priorities
1. Real event video clips and photos.
2. Clean reel thumbnails with short human-added text.
3. Carousel backgrounds with large empty typography zones.
4. Venue and crowd detail shots.

## Local Image Generation Prompts
Use these only as drafts and keep generated text out of the image:
- Premium New York networking event, stylish professionals in a warm venue, candid social energy, editorial photography, no readable text.
- After-work professional social event in NYC, drinks, conversation, polished hospitality atmosphere, realistic lighting, no readable text.
- Editorial carousel background for networking tips, elegant venue details, clean negative space, no readable text.

## Review Rules
- Prefer real event footage over synthetic imagery when selling tickets.
- Generated imagery must be labeled internally with model/source metadata.
- Human approval is required before use in publishing packages.

