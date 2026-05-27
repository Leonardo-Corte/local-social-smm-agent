# System Benchmark Suite

Generated: 2026-05-27T04:50:07.217Z

Status: passed

Workspace root: `/Users/corte/Documents/Codex/2026-05-22/fammi-un-deep-interwie-per-questo/workspaces/generated-projects/sample-local-social-team`

## Fast Metrics
| Metric | Status | Time |
| --- | --- | ---: |
| Local model routing control-plane speed | passed | 1529 ms |
| Image QA and brand-fit scorecard | passed | 7 ms |
| Video analysis scorecard control-plane | passed | 0 ms |
| Creative output quality scorecard | passed | 2 ms |
| Consensus quality benchmark | passed | 0 ms |

## Metric Outputs
### Local model routing control-plane speed
```json
{
  "profile": "apple-silicon-pro",
  "backends": [
    {
      "id": "ollama",
      "available": true
    },
    {
      "id": "mlx",
      "available": false
    },
    {
      "id": "llama.cpp",
      "available": false
    },
    {
      "id": "vllm",
      "available": false
    },
    {
      "id": "comfyui",
      "available": false
    },
    {
      "id": "nvidia-smi",
      "available": false
    }
  ]
}
```

### Image QA and brand-fit scorecard
```json
{
  "status": "review_with_warnings",
  "brandFit": "aligned",
  "platformFit": "preferred"
}
```

### Video analysis scorecard control-plane
```json
{
  "status": "strong",
  "averageScore": 100,
  "platformScores": [
    {
      "platform": "instagram",
      "score": 100
    },
    {
      "platform": "facebook",
      "score": 100
    },
    {
      "platform": "linkedin",
      "score": 100
    },
    {
      "platform": "x",
      "score": 100
    },
    {
      "platform": "reddit",
      "score": 100
    }
  ]
}
```

### Creative output quality scorecard
```json
{
  "status": "weak_needs_rework",
  "percentage": 49,
  "nextActions": 3
}
```

### Consensus quality benchmark
```json
{
  "status": "passed",
  "cases": 2,
  "averageDelta": 22
}
```


## Heavy Media Timing
- realImageGeneration: not configured in fast benchmark; set SMM_COMFYUI_WORKFLOW for real ComfyUI timing
- realVideoGeneration: not configured in fast benchmark; set SMM_PIXELLE_URL for real Pixelle timing
- realVideoAnalysis: run `npm run video:intel <workspace> -- /path/video.mp4` for ffprobe/ffmpeg timing on an actual asset

## Guardrails
- Fast benchmark measures control-plane reliability and scorecard latency without forcing huge local model/media jobs.
- Real model speed is measured by npm run models:benchmark.
- Real image/video generation remains opt-in because it depends on local hardware and installed engines.
