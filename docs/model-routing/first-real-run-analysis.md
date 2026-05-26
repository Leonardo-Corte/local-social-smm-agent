# First Real Local Run Analysis

Run: `workspaces/generated-projects/sample-local-social-team/workflow-runs/2026-05-23T00-47-38-143Z`

Model: `qwen2.5:14b`

Steps executed:
- `copy`
- `persona`
- `qa`

## What Worked
- Ollama API execution works with `qwen2.5:14b`.
- The selected-step workflow mode completed 3/3 steps.
- Persona and QA outputs were directionally useful.
- Regeneration candidates were created from QA output.

## Weaknesses Found
- The copy step mixed post, carousel, and reel outputs into one `Proposed Artifact`.
- The copy tone was too salesy and less aligned with the requested sharp/practical voice.
- The extractor missed some non-heading `Recommended Fixes` patterns.
- Full 12-step execution is too heavy for comfortable iteration on a 14B local model.

## Fixes Applied
- The copy step now targets only `drafts/posts.md`.
- Copy step inputs were reduced to calendar + post drafts only.
- Regeneration extractor now recognizes bold/colon-style actionable sections such as `**Recommended Fixes:**`.
- Proposed Artifact sections now create regeneration tasks.
- Output applicator now blocks unapproved sales language such as free-trial/sign-up claims, guarantees, and vague "perfect solution" phrasing.
- Output applicator dry-run no longer mutates the regeneration queue.

## Next Recommended Execution
Run only the copy step after prompt/input tuning:

```bash
npm run workflow:run sample-local-social-team -- --execute --model qwen2.5:14b --steps copy --timeout-ms 180000
```

Review the resulting `Proposed Artifact` before applying.

## Second Copy Run Finding
Run: `workflow-runs/2026-05-23T00-58-26-924Z`

The step completed faster and stayed scoped to `drafts/posts.md`, but still produced vague sales language:
- `perfect solution`
- `how we can help`

Those are now blocked by artifact policy, so they cannot be applied automatically.
