# Reference Integration Notes

Date: 2026-05-22

These notes summarize locally cloned reference repositories. They are not core code imports. Any reuse still requires manual code audit and explicit integration decision.

## `blacktwist/social-media-skills`

License hint: MIT.

Useful structure:
- Foundation context skill.
- Strategy skills: content strategy, calendar, platform strategy.
- Creation skills: post, thread, carousel, caption, repurposing, hook writing.
- Analysis skills: performance analysis, growth tracking, pattern analysis, optimization advice.

Integration direction:
- Map this catalog into our generated agent skill/context files.
- Use as direct inspiration for skill taxonomy.
- Candidate for clean adaptation because license is MIT, but still audit individual files before vendoring.

Immediate actions:
- Add our own generated workspace skills for: context, platform strategy, hook writer, caption writer, carousel writer, performance analyzer.
- Keep BlackTwist MCP-specific parts out of core; our core must remain no-required-SaaS.

## `langchain-ai/social-media-agent`

License hint: MIT.

Useful structure:
- Human-in-the-loop post generation flow.
- Separate agents for data ingestion, generate post, generate thread, repurposing, reflection, verification, upload, and supervisor.
- Interrupt/review flow concepts for user approval.
- Test/eval structure around social graph behavior.

Constraints:
- Quickstart depends on API services such as Anthropic, FireCrawl, Arcade, and LangSmith.
- Current repo targets Twitter/LinkedIn more than IG/FB.
- Not local-first enough for our core.

Integration direction:
- Do not copy runtime dependencies into core.
- Recreate the useful flow shape locally: ingest -> draft -> reflect -> verify -> human approval -> export/publish.
- Use the supervisor/interrupt architecture as a design reference only unless specific files pass audit.

Immediate actions:
- Add a local `approval-state-machine` package.
- Add "reflect then verify" steps to regeneration pipeline.
- Add tests that make publishing impossible unless status is `approved`.

## `microsoft/TinyTroupe`

License hint: MIT.
Retrieval mode: targeted API/reference files because full clone/download was too slow on the current network.

Useful direction:
- Persona simulation for business insight.
- Simulated customer/user panels.
- Qualitative reaction reports.
- Synthetic feedback loops that remain advisory, not proof of demand.

Integration direction:
- Use as a conceptual reference for our `persona-sim` package.
- Recreate local-first persona panel generation in our own schema.
- Avoid any mandatory paid model dependency.

Immediate actions:
- Add persona panel schema.
- Generate persona reports from project brief + draft content.
- Mark simulation output as directional, not factual market evidence.

## `idiap/sdialog`

License hint: MIT.
Retrieval mode: targeted API/reference files because full clone/download was too slow on the current network.

Useful direction:
- Multi-agent/persona dialogue simulation.
- Evaluation-oriented simulated conversations.
- Potential pattern for audience panels debating content, objections, and buying intent.

Integration direction:
- Use as reference for persona-to-persona discussion reports.
- Keep our core implementation local-first and dependency-light.
- Build our own report artifacts: objections, likely comments, trust gaps, purchase intent blockers, and content fixes.

Immediate actions:
- Add persona discussion template.
- Add report sections for "likely reaction", "objection", "misunderstanding risk", and "recommended content fix".
