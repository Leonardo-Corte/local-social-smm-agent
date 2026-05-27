# ComfyUI Workflow Template Registry

Status: template-contracts-ready

These are template contracts for exported ComfyUI API workflows. The user still provides the actual workflow JSON because model filenames and nodes differ per machine.

## Templates
### reel-cover-9x16
- Purpose: High-energy vertical reel cover
- Preset: reel
- Aspect ratio: 9:16
- Best for: instagram, facebook, x
- Positive node role: main visual prompt
- Negative node role: quality/safety negative prompt
- Prompt guidance: Keep the visual text-free, with strong subject/background separation and space for external overlay.

### carousel-cover-4x5
- Purpose: Instagram/LinkedIn carousel cover background
- Preset: cover
- Aspect ratio: 4:5
- Best for: instagram, linkedin, facebook
- Positive node role: editorial cover prompt
- Negative node role: bad anatomy, unreadable text, logos
- Prompt guidance: Use clean negative space for typography that will be added outside the model.

### square-social-1x1
- Purpose: General square post visual
- Preset: square
- Aspect ratio: 1:1
- Best for: instagram, facebook, x
- Positive node role: social post prompt
- Negative node role: watermark, logo, broken text
- Prompt guidance: Prefer simple composition and avoid visual clutter.

### story-background-9x16
- Purpose: Story background with center-safe copy area
- Preset: story
- Aspect ratio: 9:16
- Best for: instagram, facebook
- Positive node role: story background prompt
- Negative node role: text, watermark, third-party logo
- Prompt guidance: Leave the middle third clean for overlays, poll stickers, or CTA.

