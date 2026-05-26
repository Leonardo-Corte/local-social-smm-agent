# Repo Audit Matrix

Date: 2026-05-22

| Candidate | Category | License posture | Cost posture | ToS/account risk | Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `brightbeanxyz/brightbean-studio` | Social management/scheduler | Audit required | Self-host/no required SaaS claimed | Low if official APIs only | Inspect first | Strong architecture reference for workspaces, approvals, scheduling |
| `blacktwist/social-media-skills` | Agent skills/content | MIT | No-cost | Low | Candidate for direct adaptation | Strong fit for agent skill registry |
| `gitroomhq/postiz-app` | Scheduler | AGPL-3.0 | Self-host | Low if official OAuth | Reference/separate service | Mature but core-copy risk due AGPL |
| `trypost-it/trypost` | Scheduler/API/MCP | AGPL-3.0 | Self-host | Low if official APIs | Reference/separate module | Useful ideas for brand profile and MCP |
| `langchain-ai/social-media-agent` | HITL social agent | Audit required | May need external services | Medium | Pattern reference | Useful flow, likely not local-first enough |
| `microsoft/TinyTroupe` | Persona simulation | Audit required | Usually model-dependent | Low | Inspect | Strong persona/business insights framing |
| `idiap/sdialog` | Persona/dialog simulation | MIT | Model-dependent but adaptable | Low | Candidate for adaptation | Strong MIT simulation/evaluation toolkit |
| `Comfy-Org/ComfyUI` | Visual generation backend | Audit required | Local/no-cost possible | Low | Integration candidate | Primary local image backend |
| `Traffgain/Traffgain` | IG/FB automation | Audit required | Local | High | Experimental/reference only | Engagement automation risk |
| `GramAddict/bot` | Instagram automation | Audit required | Local | High | Experimental/reference only | Bot behavior disabled by default |
| `profullstack/social-poster` | Browser posting | Audit required | Local | Medium/high | Experimental/reference only | Could inform semi-assisted posting |

## Audit Rules
- Do not vendor code until license is confirmed.
- Do not copy AGPL/GPL code into core without explicit decision.
- No-license repos are inspiration-only.
- Risky account automation must be isolated under `experimental` and disabled by default.
