#!/usr/bin/env bash
set -euo pipefail
cd "/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo"
npm run workspace:chat out-of-office-e2e-test -- --model qwen2.5:14b
