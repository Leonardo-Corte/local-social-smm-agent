# CapCut Agent Integration Audit

Generated: 2026-05-25

## Decision

Add a native CapCut-ready export layer to this project, but do not vendor external code yet.

The best immediate path is:

1. Generate our own normalized `capcut-plan.json` from the workspace reel intelligence and edit recipe.
2. Keep it draft-only and approval-gated.
3. Later connect that plan to one approved external adapter, preferably VectCutAPI or CapCut Mate, after a focused install test on the target machine.

This avoids turning the repo into a fragile copy of another project while still giving the user a practical CapCut handoff.

## GitHub Findings

| Repo | Stars | License | Fit | Decision |
| --- | ---: | --- | --- | --- |
| `sun-guannan/VectCutAPI` | 1934 | Apache-2.0 | Strong API/MCP surface for CapCut/Jianying draft automation. Has HTTP server and MCP server. | Top candidate for adapter integration. Do not vendor yet; integrate by local server boundary. |
| `Hommy-master/capcut-mate` | 1046 | MIT | FastAPI CapCut/Jianying draft automation with LLM workflow positioning, Docker, docs, and material/effect APIs. | Strong candidate. Good reference for endpoint shape and agent skill model. |
| `GuanYixuan/pyJianYingDraft` | 3328 | Apache-2.0 | Mature Python draft generation library, but mostly Jianying; README says CapCut version is separate/in progress. Mac can generate drafts but export has Windows/version caveats. | Inspiration and possible Python backend later; not the first direct CapCut route. |
| `GuanYixuan/pyCapCut` | 510 | no license detected via GitHub API | Purpose-built CapCut draft generation, but less mature and license unclear at audit time. | Do not integrate until license is explicit. |
| `GVCLab/CutClaw` | 847 | no license detected via GitHub API | Research-grade multi-agent long-video editing with music synchronization. Interesting architecture, not CapCut-specific production tooling. | Inspiration only until license and runtime practicality are clear. |

## Reddit/Community Signals

Reddit threads around AI content automation repeatedly point to the same product truth:

- Fully automated reels are still fragile; CapCut desktop plus repeatable templates is often the fastest high-quality path.
- The winning automation is not mass production. It is reducing repetitive editing decisions while keeping human review.
- Script timing, captions, pacing, and first-three-second retention matter more than simply producing more videos.
- Generic AI video pipelines often fail because sameness trains viewers to scroll past them.

Implication for this project: CapCut support should be a professional handoff/export workflow, not a blind auto-render machine.

## Integration Principles

- No automatic publishing.
- No account-facing automation.
- No external code vendored without a repo integration decision and license review.
- CapCut export artifacts must enter `publishing/artifact-registry.json` as `needs_human_review`.
- External CapCut servers must be optional local adapters, not required for workspace generation.
- The system should still work with pure FFmpeg preview recipes when CapCut is not installed.

## Recommended Build

### Phase A: Native Plan Export

Create `creative/capcut-plan.json` and `creative/capcut-plan.md` from:

- `assets/analysis/*-reel-intelligence.json`
- `assets/edited/*/*-edit-recipe.json`
- `drafts/reels.md`
- `business/business.md`

The plan should include:

- source media path
- target format: 9:16 Reel/Short
- trim range
- crop instructions
- subtitle/caption plan
- hook overlay suggestions
- music/sound direction
- approval blockers
- suggested adapter target: `manual-capcut`, `vectcutapi`, or `capcut-mate`

### Phase B: Optional Local Adapter

Add an adapter command later:

```bash
npm run capcut:adapter out-of-office -- --backend vectcutapi --endpoint http://127.0.0.1:9001
```

It should read `creative/capcut-plan.json` and call a local CapCut API server only after the artifact is approved or explicitly marked as draft export.

### Phase C: Template Memory

Add `creative/capcut-templates.json` where the user can define repeatable event recap structures:

- recap-fast-cuts
- venue-proof
- people-networking
- testimonial-cut
- ticket-cta

Agents should choose a template based on request and asset intelligence.

## Current Recommendation

Implement Phase A now. Revisit VectCutAPI and CapCut Mate as optional adapters after the local plan format is stable.
