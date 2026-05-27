# Repo Integration Decisions

Generated at: 2026-05-27T04:37:12.652Z

## Rules
- Do not copy or vendor external code without a written license decision.
- AGPL/GPL repos can inform architecture or run as separate optional services only after review.
- Account automation bots are blocked by product guardrails.
- Every integration must preserve no-cost/local-first operation and human approval.

## Decision Matrix
| Repo | License | Category | Classification | Boundary |
| --- | --- | --- | --- | --- |
| [brightbeanxyz/brightbean-studio](https://github.com/brightbeanxyz/brightbean-studio) | AGPL-3.0 | social-management-scheduler | reference-only | Study architecture and product patterns only. Do not copy/vend code into this repo. |
| [blacktwist/social-media-skills](https://github.com/blacktwist/social-media-skills) | MIT | agent-skills-content | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) | AGPL-3.0 | social-scheduler | reference-only | Study architecture and product patterns only. Do not copy/vend code into this repo. |
| [trypost-it/trypost](https://github.com/trypost-it/trypost) | AGPL-3.0 | social-scheduler-api | reference-only | Study architecture and product patterns only. Do not copy/vend code into this repo. |
| [langchain-ai/social-media-agent](https://github.com/langchain-ai/social-media-agent) | MIT | human-in-loop-agent | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [renezander030/capcut-cli](https://github.com/renezander030/capcut-cli) | MIT | capcut-draft-cli | vendor-allowed | Vendored code is allowed only for the named repo path and must retain its license, attribution, and isolated adapter boundary. |
| [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) | AGPL-3.0 | agentic-video-production | reference-only | Study architecture and product patterns only. Do not copy/vend code into this repo. |
| [AIDC-AI/ComfyUI-Copilot](https://github.com/AIDC-AI/ComfyUI-Copilot) | MIT | visual-workflow-copilot | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [AIDC-AI/Pixelle-Video](https://github.com/AIDC-AI/Pixelle-Video) | Apache-2.0 | video-generation-editing-engine | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [massgen/MassGen](https://github.com/massgen/MassGen) | Apache-2.0 | multi-agent-orchestration | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [wanxingai/LightAgent](https://github.com/wanxingai/LightAgent) | Apache-2.0 | agent-framework | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [mudler/LocalAI](https://github.com/mudler/LocalAI) | MIT | local-model-runtime | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [microsoft/TinyTroupe](https://github.com/microsoft/TinyTroupe) | MIT | persona-simulation | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [idiap/sdialog](https://github.com/idiap/sdialog) | MIT | persona-dialog-simulation | adapter | Eligible for adapter or clean-room pattern reuse after file-level code audit. |
| [Comfy-Org/ComfyUI](https://github.com/Comfy-Org/ComfyUI) | GPL-3.0 | visual-generation | adapter | Use as an optional separate local service/process with license notes; do not embed copied code. |
| [GramAddict/bot](https://github.com/GramAddict/bot) | MIT | instagram-automation | do-not-use | Reference only for risk awareness. Do not integrate account automation. |

## Details
### brightbeanxyz/brightbean-studio
- Candidate ID: brightbean-studio
- Category: social-management-scheduler
- License: AGPL-3.0
- Risk: low-medium
- Stars: 1701
- Last push: 2026-05-21T12:13:24Z
- Classification: reference-only
- Boundary: Study architecture and product patterns only. Do not copy/vend code into this repo.
- Reason: AGPL boundary requires careful separation.
- Integration next step: Extract product/architecture lessons without code reuse.

### blacktwist/social-media-skills
- Candidate ID: social-media-skills
- Category: agent-skills-content
- License: MIT
- Risk: low
- Stars: 186
- Last push: 2026-05-01T10:01:29Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### gitroomhq/postiz-app
- Candidate ID: postiz
- Category: social-scheduler
- License: AGPL-3.0
- Risk: license-boundary
- Stars: 30596
- Last push: 2026-05-22T13:01:29Z
- Classification: reference-only
- Boundary: Study architecture and product patterns only. Do not copy/vend code into this repo.
- Reason: AGPL boundary requires careful separation.
- Integration next step: Extract product/architecture lessons without code reuse.

### trypost-it/trypost
- Candidate ID: trypost
- Category: social-scheduler-api
- License: AGPL-3.0
- Risk: license-boundary
- Stars: 125
- Last push: 2026-05-22T16:39:11Z
- Classification: reference-only
- Boundary: Study architecture and product patterns only. Do not copy/vend code into this repo.
- Reason: AGPL boundary requires careful separation.
- Integration next step: Extract product/architecture lessons without code reuse.

### langchain-ai/social-media-agent
- Candidate ID: social-media-agent
- Category: human-in-loop-agent
- License: MIT
- Risk: dependency-cost
- Stars: 2582
- Last push: 2026-05-19T21:52:52Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### renezander030/capcut-cli
- Candidate ID: capcut-cli
- Category: capcut-draft-cli
- License: MIT
- Risk: vendored-code-audited
- Stars: 26
- Last push: 2026-05-25T14:36:12Z
- Classification: vendor-allowed
- Boundary: Vendored code is allowed only for the named repo path and must retain its license, attribution, and isolated adapter boundary.
- Reason: A written vendor decision exists for this specific dependency.
- Integration next step: Extract product/architecture lessons without code reuse.

### calesthio/OpenMontage
- Candidate ID: openmontage
- Category: agentic-video-production
- License: AGPL-3.0
- Risk: license-boundary-runtime-complexity
- Stars: 3980
- Last push: 2026-05-07T12:12:36Z
- Classification: reference-only
- Boundary: Study architecture and product patterns only. Do not copy/vend code into this repo.
- Reason: AGPL boundary requires careful separation.
- Integration next step: Extract product/architecture lessons without code reuse.

### AIDC-AI/ComfyUI-Copilot
- Candidate ID: comfyui-copilot
- Category: visual-workflow-copilot
- License: MIT
- Risk: dependency-complexity
- Stars: 5197
- Last push: 2026-04-07T04:23:08Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### AIDC-AI/Pixelle-Video
- Candidate ID: pixelle-video
- Category: video-generation-editing-engine
- License: Apache-2.0
- Risk: high-runtime-complexity
- Stars: 19947
- Last push: 2026-05-18T07:13:46Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### massgen/MassGen
- Candidate ID: massgen
- Category: multi-agent-orchestration
- License: Apache-2.0
- Risk: framework-migration-cost
- Stars: 1038
- Last push: 2026-05-26T02:19:53Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### wanxingai/LightAgent
- Candidate ID: lightagent
- Category: agent-framework
- License: Apache-2.0
- Risk: framework-migration-cost
- Stars: 997
- Last push: 2026-05-26T17:43:57Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### mudler/LocalAI
- Candidate ID: localai
- Category: local-model-runtime
- License: MIT
- Risk: operational-complexity
- Stars: 46476
- Last push: 2026-05-26T16:40:45Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### microsoft/TinyTroupe
- Candidate ID: tinytroupe
- Category: persona-simulation
- License: MIT
- Risk: low
- Stars: 7463
- Last push: 2026-05-07T18:49:53Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### idiap/sdialog
- Candidate ID: sdialog
- Category: persona-dialog-simulation
- License: MIT
- Risk: low
- Stars: 137
- Last push: 2026-05-20T09:00:13Z
- Classification: adapter
- Boundary: Eligible for adapter or clean-room pattern reuse after file-level code audit.
- Reason: Permissive license, still requires dependency/security review.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### Comfy-Org/ComfyUI
- Candidate ID: comfyui
- Category: visual-generation
- License: GPL-3.0
- Risk: dependency-complexity
- Stars: 114038
- Last push: 2026-05-22T16:51:34Z
- Classification: adapter
- Boundary: Use as an optional separate local service/process with license notes; do not embed copied code.
- Reason: GPL dependency can be useful, but direct vendoring would constrain the main project.
- Integration next step: Inspect dependency files and design a small adapter boundary.

### GramAddict/bot
- Candidate ID: gramaddict
- Category: instagram-automation
- License: MIT
- Risk: high-account-tos
- Stars: 1556
- Last push: 2025-02-16T22:01:11Z
- Classification: do-not-use
- Boundary: Reference only for risk awareness. Do not integrate account automation.
- Reason: Account-facing bot behavior conflicts with project guardrails.
- Integration next step: Keep blocked and document risk.

