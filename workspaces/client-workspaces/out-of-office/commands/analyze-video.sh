#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: commands/analyze-video.sh /absolute/path/to/reel.mp4"
  exit 1
fi
cd "/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo"
npm run video:intel out-of-office -- --asset "$1" --transcribe
npm run video:preview out-of-office
