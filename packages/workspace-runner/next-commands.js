const fs = require("fs");
const path = require("path");
const { workspacePaths } = require("./workspace-paths");

function quoteShellPath(value) {
  return JSON.stringify(String(value));
}

function shellCommand(root, command) {
  return `cd ${quoteShellPath(root)} && ${command}`;
}

function chatCommand(root, workspace, model = "qwen2.5:14b") {
  return shellCommand(root, `npm run workspace:chat ${workspace} -- --model ${model}`);
}

function bootstrapCommand(root, workspace) {
  return shellCommand(root, `npm run workspace:bootstrap ${workspace}`);
}

function startCommand(root, workspace) {
  return shellCommand(root, `npm run workspace:start ${workspace}`);
}

function checkCommand(root) {
  return shellCommand(root, "npm run check");
}

function formatCommandBlock(title, command) {
  return `${title}:\n\n\`\`\`bash\n${command}\n\`\`\``;
}

function formatNextCommands({ root, workspace, model = "qwen2.5:14b", state = "chat" }) {
  const primary = state === "needs-bootstrap"
    ? bootstrapCommand(root, workspace)
    : chatCommand(root, workspace, model);
  const secondary = state === "needs-bootstrap"
    ? chatCommand(root, workspace, model)
    : bootstrapCommand(root, workspace);

  return [
    "## Next Commands",
    "",
    "Copy/paste the exact command below. Do not run the workspace folder path by itself: folders are not executable commands.",
    "",
    formatCommandBlock("Copy/paste now", primary),
    "",
    state === "needs-bootstrap"
      ? formatCommandBlock("Then open the project AI team chat", secondary)
      : formatCommandBlock("If you need to rebuild/regenerate the workspace", secondary),
    "",
    formatCommandBlock("If you only want the command menu", startCommand(root, workspace)),
    "",
    formatCommandBlock("If you want to verify the whole system", checkCommand(root))
  ].join("\n");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function writeScript(filePath, command) {
  writeText(filePath, `#!/usr/bin/env bash
set -euo pipefail
${command}
`);
  fs.chmodSync(filePath, 0o755);
}

function writeNextCommandFiles({ root, workspace, model = "qwen2.5:14b", state = "chat" }) {
  const paths = workspacePaths(root, workspace);
  const markdown = formatNextCommands({ root, workspace, model, state });
  const generatedOperations = path.join(paths.generated, "operations");
  const generatedCommands = path.join(paths.generated, "commands");

  writeText(path.join(generatedOperations, "next-commands.md"), `${markdown}\n`);
  writeText(path.join(paths.generated, "NEXT_COMMANDS.md"), `${markdown}\n`);
  writeScript(path.join(generatedCommands, "continue.sh"), chatCommand(root, workspace, model));
  writeScript(path.join(generatedCommands, "rebuild.sh"), bootstrapCommand(root, workspace));

  if (fs.existsSync(paths.client)) {
    const clientCommands = path.join(paths.client, "commands");
    writeText(path.join(paths.client, "NEXT_COMMANDS.md"), `${markdown}\n`);
    writeScript(path.join(clientCommands, "continue.sh"), chatCommand(root, workspace, model));
    writeScript(path.join(clientCommands, "rebuild.sh"), bootstrapCommand(root, workspace));
  }

  return {
    markdown,
    generatedNextCommands: path.join(paths.generated, "NEXT_COMMANDS.md"),
    generatedContinueScript: path.join(generatedCommands, "continue.sh"),
    clientNextCommands: fs.existsSync(paths.client) ? path.join(paths.client, "NEXT_COMMANDS.md") : null
  };
}

function nextCommandPolicy({ root, workspace, model = "qwen2.5:14b" }) {
  return [
    "Always finish operational answers with an explicit copy/paste command when a next action exists.",
    "Never say only 'done' or 'open the chat' without the exact terminal command.",
    `Default chat command: ${chatCommand(root, workspace, model)}`,
    `Default rebuild command: ${bootstrapCommand(root, workspace)}`,
    `Default command menu: ${startCommand(root, workspace)}`
  ].join("\n");
}

module.exports = {
  bootstrapCommand,
  chatCommand,
  checkCommand,
  formatNextCommands,
  nextCommandPolicy,
  shellCommand,
  startCommand,
  writeNextCommandFiles
};
