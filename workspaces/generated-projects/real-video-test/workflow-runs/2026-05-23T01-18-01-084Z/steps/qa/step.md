# qa

Agent: critic-qa

Task: Run a final adversarial QA pass. Decide what is not good enough for human approval and convert it into regeneration tasks.

Backend: prompt-packet

Model: qwen2.5:14b

Status: fallback_saved_prompt_packet

Inputs:
- review/workspace-quality-rubric.json
- simulation/persona-report.md
- review/qa-recap.md
- drafts/posts.md
- assets/analysis/video-asset-report.md
