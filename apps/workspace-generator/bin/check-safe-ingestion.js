#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  assertSafeLocalAssetFile,
  assertSafePublicHttpUrl,
  importLocalAsset
} = require("../../../packages/workspace-runner/safe-ingestion");

const root = path.resolve(__dirname, "../../..");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function assertThrowsMessage(fn, pattern) {
  assert.throws(fn, (error) => pattern.test(error.message));
}

async function assertRejectsMessage(fn, pattern) {
  await assert.rejects(fn, (error) => pattern.test(error.message));
}

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "safe-ingestion-check-"));
  const workspaceRoot = path.join(tempRoot, "workspace");
  const sourceRoot = path.join(tempRoot, "sources");
  fs.mkdirSync(workspaceRoot, { recursive: true });
  fs.mkdirSync(sourceRoot, { recursive: true });

  try {
    const normalText = path.join(sourceRoot, "strategy notes.txt");
    writeFile(normalText, "safe notes");
    const imported = importLocalAsset({ workspaceRoot, sourcePath: normalText });
    assert.strictEqual(imported.kind, "text");
    assert.ok(imported.destination.startsWith(path.join(workspaceRoot, "assets", "raw") + path.sep));
    assert.notStrictEqual(imported.destination, normalText);
    assert.strictEqual(fs.readFileSync(imported.destination, "utf8"), "safe notes");
    assert.ok(/strategy-notes-[a-f0-9]{12}\.txt$/.test(imported.destination));

    const image = path.join(sourceRoot, "visual.PNG");
    writeFile(image, "not a real png but enough for extension policy");
    assert.strictEqual(assertSafeLocalAssetFile(image, { allowedKinds: ["image"] }).kind, "image");
    assertThrowsMessage(() => assertSafeLocalAssetFile(image, { allowedKinds: ["video"] }), /not allowed/);

    const directory = path.join(sourceRoot, "folder.md");
    fs.mkdirSync(directory);
    assertThrowsMessage(() => assertSafeLocalAssetFile(directory), /normal file/);

    const unsupported = path.join(sourceRoot, "script.sh");
    writeFile(unsupported, "echo unsafe");
    assertThrowsMessage(() => assertSafeLocalAssetFile(unsupported), /Unsupported asset extension/);

    const envFile = path.join(sourceRoot, ".env");
    writeFile(envFile, "TOKEN=secret");
    assertThrowsMessage(() => assertSafeLocalAssetFile(envFile), /sensitive local path/i);

    const keyFile = path.join(sourceRoot, "private-key.pem");
    writeFile(keyFile, "secret");
    assertThrowsMessage(() => assertSafeLocalAssetFile(keyFile), /sensitive local path/i);

    const tooLarge = path.join(sourceRoot, "big.txt");
    writeFile(tooLarge, "abcdef");
    assertThrowsMessage(() => assertSafeLocalAssetFile(tooLarge, { maxBytes: 3 }), /too large/);

    const symlink = path.join(sourceRoot, "linked.txt");
    try {
      fs.symlinkSync(normalText, symlink);
      assertThrowsMessage(() => assertSafeLocalAssetFile(symlink), /symlink/);
    } catch (error) {
      if (error.code !== "EPERM" && error.code !== "EEXIST") {
        throw error;
      }
    }

    await assertRejectsMessage(() => assertSafePublicHttpUrl("file:///etc/passwd"), /Unsupported URL scheme/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("data:text/plain,hello"), /Unsupported URL scheme/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("javascript:alert(1)"), /Unsupported URL scheme/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("http://user:pass@example.com"), /embedded credentials/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("http://localhost:8787"), /Private or local/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("http://127.0.0.1:8787"), /Private IPv4/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("http://10.0.0.1"), /Private IPv4/);
    await assertRejectsMessage(() => assertSafePublicHttpUrl("http://169.254.169.254/latest/meta-data"), /Private IPv4/);
    assert.strictEqual(await assertSafePublicHttpUrl("https://8.8.8.8/dns-query"), "https://8.8.8.8/dns-query");

    console.log("Safe ingestion checks passed.");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
