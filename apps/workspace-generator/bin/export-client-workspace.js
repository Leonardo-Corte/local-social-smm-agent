#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("../../../packages/workspace-runner/workspace-paths");
const { formatNextCommands } = require("../../../packages/workspace-runner/next-commands");

const root = path.resolve(__dirname, "../../..");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function copyDir(source, destination) {
  ensureDir(destination);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === "versions") {
      continue;
    }
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      ensureDir(path.dirname(destinationPath));
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function removeFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function startHereMarkdown({ workspace, sourceWorkspaceRoot, clientWorkspaceRoot, brief }) {
  return `# ${brief.projectName || workspace} Client Workspace

This is the clean working workspace for the project.

The factory/system code stays outside this folder. This workspace is the project-specific communications team: chat, agents, strategy, drafts, assets, feedback, reports, and publishing packages.

## Start The Project AI Team Chat

From the factory root:

\`\`\`bash
cd ${root}
npm run workspace:chat ${workspace} -- --model qwen2.5:14b
\`\`\`

This opens the terminal chat for this specific project. You can talk naturally, and the system routes work to the social media agents behind the scenes.

## Exact Next Commands

${formatNextCommands({ root, workspace, state: "chat" })}

Suggested first requests:

\`\`\`text
Read business/business.md and tell me what is missing before we generate content.
Generami un carosello per vendere i ticket del prossimo evento.
Scrivimi 5 post per X e un mini-thread sul prossimo evento.
Crea un post Reddit community-first per chiedere feedback senza sembrare spam.
Analizza questo video: /absolute/path/to/reel.mp4
Fammi un messaggio premium per invitare un venue manager.
\`\`\`

Useful chat commands:

\`\`\`text
/video /absolute/path/to/reel.mp4
/make carousel voglio un carosello per il post di oggi
/make reel crea script, hook, caption e rischi approvazione
/make x scrivimi 5 post e un thread per X
/make reddit crea un post discussione per r/AskNYC con blocker regole subreddit
/image /absolute/path/to/image.png
/link https://example.com
/workflow research,strategy,copy,video,persona,qa
/feedback questo tono mi piace, più premium e meno corporate rigido
\`\`\`

## Rebuild This Workspace

From the factory root:

\`\`\`bash
cd ${root}
npm run workspace:bootstrap ${workspace}
\`\`\`

This regenerates business profile, agent contracts, content drafts, reports, quality gate, publishing package, client report, snapshot, and then refreshes this client workspace.

## Run AI Agents

For a small local Qwen run:

\`\`\`bash
cd ${root}
npm run agent:run ${workspace} -- --agent copywriter --model qwen2.5:14b --task "Improve drafts/posts.md. Keep it specific to the project brief, premium, and do not invent facts." --input drafts/posts.md
\`\`\`

For workflow prompt packets:

\`\`\`bash
cd ${root}
npm run workflow:run ${workspace} -- --steps intake,research,strategy,copy,video,persona,qa
\`\`\`

## Where To Work

- Brief: \`project-brief.json\`
- Business profile: \`business/business.md\`
- Strategy: \`strategy/content-pillars.md\`
- Calendar: \`calendar/30-day-calendar.md\`
- Platform playbooks: \`platforms/platform-playbooks.md\`
- Captions/posts: \`drafts/posts.md\`
- Reels: \`drafts/reels.md\`
- Carousels: \`drafts/carousels.md\`
- X drafts: \`drafts/threads.md\`
- Reddit drafts: \`drafts/reddit.md\`
- Feedback: \`memory/user-feedback.md\`
- Publishing review: \`publishing/export-package.md\`
- Client report: \`client-report/report.md\`

## Where To Put New Assets

- Raw video: \`assets/raw/\`
- Frames: \`assets/frames/\`
- Analysis notes: \`assets/analysis/\`
- Competitor notes: \`research/competitors/\`
- Brand references: \`brand/\`

## Source Link

Factory workspace:

\`\`\`text
${sourceWorkspaceRoot}
\`\`\`

Client workspace:

\`\`\`text
${clientWorkspaceRoot}
\`\`\`

## Safety

- No automatic publishing.
- No automatic DM/comment/like/follow.
- No automatic X replies/DMs/likes/follows.
- No automatic Reddit posting/commenting/voting/DMs.
- Reddit drafts require subreddit-rule review before use.
- Human approval is required before account-facing actions.
- Do not invent attendance numbers, guest identities, partnerships, prices, or event claims.
`;
}

function main() {
  const [workspace] = process.argv.slice(2);
  if (!workspace) {
    console.error("Usage: node apps/workspace-generator/bin/export-client-workspace.js <workspace>");
    process.exit(1);
  }

  const paths = workspacePaths(root, workspace);
  const sourceWorkspaceRoot = paths.generated;
  if (!fs.existsSync(path.join(sourceWorkspaceRoot, "workspace-manifest.json"))) {
    console.error(`Missing generated workspace: ${sourceWorkspaceRoot}`);
    process.exit(1);
  }

  const clientWorkspaceRoot = paths.client;
  const brief = readJson(path.join(sourceWorkspaceRoot, "project-brief.json"), {});

  ensureDir(clientWorkspaceRoot);
  copyDir(sourceWorkspaceRoot, clientWorkspaceRoot);

  ensureDir(path.join(clientWorkspaceRoot, "assets/raw"));
  ensureDir(path.join(clientWorkspaceRoot, "assets/frames"));
  ensureDir(path.join(clientWorkspaceRoot, "assets/analysis"));
  ensureDir(path.join(clientWorkspaceRoot, "research/competitors"));
  ensureDir(path.join(clientWorkspaceRoot, "brand"));
  ensureDir(path.join(clientWorkspaceRoot, "commands"));

  writeFile(path.join(clientWorkspaceRoot, "START_HERE.md"), startHereMarkdown({
    workspace,
    sourceWorkspaceRoot,
    clientWorkspaceRoot,
    brief
  }));

  writeFile(path.join(clientWorkspaceRoot, "workspace-link.json"), `${JSON.stringify({
    workspace,
    factoryRoot: root,
    generatedWorkspaceRoot: sourceWorkspaceRoot,
    clientWorkspaceRoot,
    chatCommand: `npm run workspace:chat ${workspace} -- --model qwen2.5:14b`,
    refreshCommand: `npm run workspace:bootstrap ${workspace}`
  }, null, 2)}\n`);

  writeFile(path.join(clientWorkspaceRoot, "NEXT_COMMANDS.md"), `${formatNextCommands({ root, workspace, state: "chat" })}\n`);

  writeFile(path.join(clientWorkspaceRoot, "commands/refresh-from-factory.sh"), `#!/usr/bin/env bash
set -euo pipefail
cd "${root}"
npm run workspace:bootstrap ${workspace}
`);

writeFile(path.join(clientWorkspaceRoot, "commands/open-chat.sh"), `#!/usr/bin/env bash
set -euo pipefail
cd "${root}"
npm run workspace:chat ${workspace} -- --model qwen2.5:14b
`);
  writeFile(path.join(clientWorkspaceRoot, "commands/continue.sh"), `#!/usr/bin/env bash
set -euo pipefail
cd "${root}"
npm run workspace:chat ${workspace} -- --model qwen2.5:14b
`);
  writeFile(path.join(clientWorkspaceRoot, "commands/rebuild.sh"), `#!/usr/bin/env bash
set -euo pipefail
cd "${root}"
npm run workspace:bootstrap ${workspace}
`);
  writeFile(path.join(clientWorkspaceRoot, "commands/analyze-video.sh"), `#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: commands/analyze-video.sh /absolute/path/to/reel.mp4"
  exit 1
fi
cd "${root}"
npm run video:intel ${workspace} -- --asset "$1" --transcribe
npm run video:preview ${workspace}
`);
  removeFileIfExists(path.join(clientWorkspaceRoot, "commands/open-dashboard.sh"));

  fs.chmodSync(path.join(clientWorkspaceRoot, "commands/refresh-from-factory.sh"), 0o755);
  fs.chmodSync(path.join(clientWorkspaceRoot, "commands/open-chat.sh"), 0o755);
  fs.chmodSync(path.join(clientWorkspaceRoot, "commands/continue.sh"), 0o755);
  fs.chmodSync(path.join(clientWorkspaceRoot, "commands/rebuild.sh"), 0o755);
  fs.chmodSync(path.join(clientWorkspaceRoot, "commands/analyze-video.sh"), 0o755);

  console.log(`Client workspace ready: ${path.relative(root, clientWorkspaceRoot)}`);
  console.log(`Start here: ${path.relative(root, path.join(clientWorkspaceRoot, "START_HERE.md"))}`);
}

main();
