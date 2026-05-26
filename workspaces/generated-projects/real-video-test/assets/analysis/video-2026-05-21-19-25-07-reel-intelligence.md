# Reel Intelligence Report

Generated at: 2026-05-24T15:45:15.266Z

Asset: `assets/raw/VIDEO-2026-05-21-19-25-07.mp4`

SHA-256: `2142746e10565705a3b04b1e3a0ec5b4d2fdf04a5a347e3877a178e10b5a96bf`

## Technical Metadata
- Format: QuickTime / MOV
- Duration: 11.20 seconds
- Orientation: vertical
- Resolution: 576x1024
- Frame rate: 30.00 fps
- Video codec: h264
- Audio present: yes
- Audio codec: aac
- Mean volume: -14.8 dB
- Max volume: 0 dB
- Silence events: 0
- Keyframes: 1

## Extracted Frames
- `assets/frames/video-2026-05-21-19-25-07/frame-001.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-002.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-003.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-004.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-005.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-006.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-007.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-008.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-009.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-010.jpg`
- `assets/frames/video-2026-05-21-19-25-07/frame-011.jpg`

## Transcription
- Status: missing-model
- Backend: whisper.cpp CLI
- whisper-cli is installed, but no local model file was found.
- Set WHISPER_MODEL=/absolute/path/to/ggml-model.bin to enable transcription.


## Pacing And First-Three-Seconds Notes
- First-three-second review required: yes
- Use extracted frames to check whether the opening frame communicates event, venue, people, or offer immediately.
- Do not infer exact attendance, guest identity, partnerships, or ticket inclusions from visuals alone.

## Sound Direction
- Review whether original audio should stay, be ducked under music, or be replaced by a trending sound.
- If people are speaking, generate captions after transcription is available.

## Editing Recommendations
- Duration is short enough for a fast recap; make the first three seconds visually explicit.
- Low keyframe density can indicate few major scene changes; review whether the edit feels dynamic enough.

## Agent Handoff
- `reel-shorts-producer`: use this report for hooks, visual beats, edit notes, and missing asset questions.
- `copywriter`: use this report for caption angles, but only claim visible or human-confirmed facts.
- `critic-qa`: check unsupported claims, weak hooks, and missing proof.
- `publishing-operator`: require human approval and exact event details before export.

## Guardrails
- Do not publish automatically.
- Do not invent attendance numbers, venue sales, VIP guests, sponsor relationships, ticket inclusions, or identities.
- Separate observed video facts from assumptions and human-confirmation questions.
