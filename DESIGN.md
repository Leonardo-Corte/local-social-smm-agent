# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-05-24
- Primary product surfaces: terminal start flow, local project workspace web app, terminal workspace AI chat
- Evidence reviewed: `apps/dashboard/server.js`, `package.json`, `docs/USER_QUICKSTART.md`, `workspaces/client-workspaces/out-of-office/START_HERE.md`

## Brand
- Personality: calm, professional, local-first, guided, useful
- Trust signals: visible approval state, guardrail status, local-only language, clear workspace path
- Avoid: technical control-room language, dense command panels, vague automation promises, risky growth-hack framing

## Product goals
- Goals: let a nontechnical user create a project from interview, open a local workspace, add assets/links/feedback, invoke the project AI, review drafts, and approve/reject/iterate safely
- Non-goals: auto-publishing, hidden scraping, social botting, command-heavy admin consoles
- Success signals: user knows the next action in under 10 seconds; terminal and web app roles are distinct; dangerous actions remain impossible by default

## Personas and jobs
- Primary personas: project owner/creator, social media operator, local event marketer, agency-like collaborator
- User jobs: start a new project, add event/video/context, ask AI for strategy/content, review output, keep approvals safe
- Key contexts of use: local Mac, browser plus terminal side by side, iterative content production

## Information architecture
- Primary navigation: Ask, Reel Lab, Output Package, Approvals, Admin
- Core routes/screens: workspace list, workspace page, chat command page
- Content hierarchy: natural-language chat first; reel/content automation second; output package and approvals third; technical maintenance hidden last

## Design principles
- Principle 1: The app should feel like a simple studio, not a control panel.
- Principle 2: Chat and reel automation are the primary surfaces; agent names, scripts, and files stay behind the scenes unless needed.
- Tradeoffs: Keep terminal chat for model interaction until web streaming/chat is implemented; keep maintenance available but collapsed.

## Visual language
- Color: neutral operational UI with restrained teal accent for primary actions and warm warning/red only for review states
- Typography: system sans, compact but readable
- Spacing/layout rhythm: dense enough for work, with clear grouped panels and no nested card stacks
- Shape/radius/elevation: 6-8px radius, border-based panels, no decorative effects
- Motion: none for now
- Imagery/iconography: asset thumbnails can come later; avoid decorative illustration

## Components
- Existing components to reuse: server-rendered panels, forms, metrics, tables
- New/changed components: Ask the Studio composer, Reel Lab upload/generate lane, output package grid, approval lane, hidden admin details
- Variants and states: success/status badges, warning/bad badges, empty tables
- Token/component ownership: CSS in `apps/dashboard/server.js` until frontend extraction exists

## Accessibility
- Target standard: practical WCAG AA direction
- Keyboard/focus behavior: all actions must be form/button/link accessible
- Contrast/readability: avoid low-contrast muted text for primary instructions
- Screen-reader semantics: headings should reflect workflow hierarchy
- Reduced motion and sensory considerations: no required animation

## Responsive behavior
- Supported breakpoints/devices: desktop primary, tablet/mobile readable
- Layout adaptations: hero becomes single column; panels stack at narrow widths
- Touch/hover differences: buttons remain large enough for touch

## Interaction states
- Loading: current server-post actions block until complete; future async status should show queued/running
- Empty: show plain “No links/assets/runs yet” language
- Error: plain-text error page for now
- Success: redirect back to workspace and log action
- Disabled: publishing remains disabled until human approval
- Offline/slow network: local app works without internet except user-provided links/research

## Content voice
- Tone: practical, direct, reassuring
- Terminology: use “Ask the Studio”, “Reel Lab”, “Output Package”, “Approvals”, “Brand Memory”, “Admin”
- Microcopy rules: avoid “control room”, “dry-run”, “pipeline” in primary UI; put technical terms under maintenance only

## Implementation constraints
- Framework/styling system: dependency-free Node HTTP server with server-rendered HTML
- Design-token constraints: inline CSS variables in `apps/dashboard/server.js`
- Performance constraints: avoid heavy client JS; avoid long model calls from web route for now
- Compatibility constraints: Node 18+, local browser, Ollama local for chat
- Test/screenshot expectations: verify with `node -c`, `npm run check`, curl route checks

## Open questions
- [ ] Should web chat stream model output instead of blocking while the local model runs?
- [ ] Should upload automatically extract frames/transcribe video, or stay as explicit next action?
- [ ] What exact approval roles should be shown in UI for each client project?
