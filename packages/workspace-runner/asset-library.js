const fs = require("fs");
const path = require("path");
const { importLocalAsset } = require("./safe-ingestion");
const { resolveInside } = require("./workspace-paths");
const { registerArtifact } = require("../publishing/artifact-registry");

const LIBRARY_RELATIVE_PATH = "assets/asset-library.json";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function libraryPath(workspaceRoot) {
  return resolveInside(workspaceRoot, LIBRARY_RELATIVE_PATH);
}

function readAssetLibrary(workspaceRoot) {
  const filePath = libraryPath(workspaceRoot);
  return readJson(filePath, {
    version: "0.1.0",
    updatedAt: new Date().toISOString(),
    sources: [],
    assets: [],
    rejected: []
  });
}

function writeAssetLibrary(workspaceRoot, library) {
  const filePath = libraryPath(workspaceRoot);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify({
    version: library.version || "0.1.0",
    updatedAt: new Date().toISOString(),
    sources: Array.isArray(library.sources) ? library.sources : [],
    assets: Array.isArray(library.assets) ? library.assets : [],
    rejected: Array.isArray(library.rejected) ? library.rejected : []
  }, null, 2)}\n`);
}

function walkFiles(dirPath, maxDepth = 3, depth = 0) {
  if (depth > maxDepth) {
    return [];
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      files.push(...walkFiles(entryPath, maxDepth, depth + 1));
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      files.push(entryPath);
    }
  }
  return files;
}

function assetRecord({ imported, sourcePath, sourceLabel }) {
  return {
    id: imported.sha256.slice(0, 16),
    kind: imported.kind,
    ext: imported.ext,
    size: imported.size,
    sha256: imported.sha256,
    originalPath: path.resolve(sourcePath),
    workspacePath: imported.relativePath.split(path.sep).join("/"),
    sourceLabel,
    importedAt: new Date().toISOString(),
    usageStatus: "source_asset_needs_review",
    notes: [
      "Use as source material only until a human approves the exact derived creative.",
      "Do not infer people identities, attendance, venue promises, partnerships, or ticket inclusions from the asset alone."
    ]
  };
}

function mergeAssets(existingAssets, newAssets) {
  const byHash = new Map(existingAssets.map((asset) => [asset.sha256, asset]));
  for (const asset of newAssets) {
    byHash.set(asset.sha256, { ...(byHash.get(asset.sha256) || {}), ...asset });
  }
  return [...byHash.values()].sort((a, b) => a.workspacePath.localeCompare(b.workspacePath));
}

function ingestAssetDirectory({ workspaceRoot, sourceDir, sourceLabel = "local-folder", maxDepth = 3 }) {
  const absoluteSourceDir = path.resolve(process.cwd(), sourceDir);
  if (!fs.existsSync(absoluteSourceDir) || !fs.statSync(absoluteSourceDir).isDirectory()) {
    throw new Error(`Asset directory not found: ${sourceDir}`);
  }

  const library = readAssetLibrary(workspaceRoot);
  const files = walkFiles(absoluteSourceDir, maxDepth);
  const importedAssets = [];
  const rejected = [];

  for (const filePath of files) {
    try {
      const imported = importLocalAsset({ workspaceRoot, sourcePath: filePath });
      const record = assetRecord({ imported, sourcePath: filePath, sourceLabel });
      importedAssets.push(record);
      registerArtifact(workspaceRoot, {
        path: record.workspacePath,
        type: "source-asset",
        intent: record.kind,
        platform: null,
        sourceRun: `asset-ingest:${sourceLabel}`,
        sourceAgent: "asset-librarian",
        status: "needs_human_review",
        metadata: {
          originalPath: record.originalPath,
          size: record.size,
          sha256: record.sha256
        }
      });
    } catch (error) {
      rejected.push({
        path: path.resolve(filePath),
        reason: error.message,
        rejectedAt: new Date().toISOString()
      });
    }
  }

  const sourceRecord = {
    label: sourceLabel,
    path: absoluteSourceDir,
    scannedAt: new Date().toISOString(),
    maxDepth,
    imported: importedAssets.length,
    rejected: rejected.length
  };

  const next = {
    ...library,
    sources: [...(library.sources || []), sourceRecord],
    assets: mergeAssets(library.assets || [], importedAssets),
    rejected: [...(library.rejected || []), ...rejected]
  };
  writeAssetLibrary(workspaceRoot, next);
  return {
    source: sourceRecord,
    imported: importedAssets,
    rejected,
    library: next
  };
}

function assetLibraryMarkdown(report) {
  return `# Asset Library

Updated at: ${new Date().toISOString()}

## Latest Source
- Label: ${report.source.label}
- Path: ${report.source.path}
- Imported: ${report.source.imported}
- Rejected: ${report.source.rejected}

## Imported Assets
${report.imported.map((asset) => `- \`${asset.workspacePath}\` (${asset.kind}, ${asset.size} bytes, ${asset.sha256.slice(0, 12)})`).join("\n") || "- None."}

## Rejected Files
${report.rejected.map((item) => `- \`${item.path}\`: ${item.reason}`).join("\n") || "- None."}

## Agent Usage
- \`visual-director\`: select images for post/carousel/thumbnail concepts.
- \`reel-shorts-producer\`: select videos and plan cuts.
- \`copywriter\`: use only observed or human-confirmed facts from assets.
- \`critic-qa\`: block unsupported claims before approval.
- \`publishing-operator\`: only export approved derived artifacts.
`;
}

function writeAssetLibraryMarkdown(workspaceRoot, report) {
  const filePath = resolveInside(workspaceRoot, "assets", "asset-library.md");
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, assetLibraryMarkdown(report));
  return filePath;
}

module.exports = {
  LIBRARY_RELATIVE_PATH,
  assetLibraryMarkdown,
  ingestAssetDirectory,
  readAssetLibrary,
  writeAssetLibraryMarkdown
};
