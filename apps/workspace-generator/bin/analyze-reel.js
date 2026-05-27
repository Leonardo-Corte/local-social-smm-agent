#!/usr/bin/env node


const { workspacePaths } = require('../../../packages/workspace-runner/workspace-paths');
const path = require("path");
const {
  buildReelIntelligence,
  findDefaultAsset,
  writeReelIntelligence
} = require("../../../packages/video-intel/reel-intelligence");
const {
  buildVideoQualityReport,
  writeVideoQualityReport
} = require("../../../packages/video-intel/video-quality-report");

const root = path.resolve(__dirname, "../../..");

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] || null;
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  if (!workspace) {
    console.error("Usage: npm run video:intel <workspace> -- --asset assets/raw/video.mp4");
    process.exit(1);
  }

  const workspaceRoot = workspacePaths(root, workspace).generated;
  const assetPath = valueAfter(args, "--asset") || findDefaultAsset(workspaceRoot);
  if (!assetPath) {
    console.error(`No video asset found for workspace ${workspace}. Put a video under assets/raw or pass --asset.`);
    process.exit(1);
  }

  const report = buildReelIntelligence({ workspaceRoot, assetPath, transcribe: args.includes("--transcribe") });
  const paths = writeReelIntelligence({ workspaceRoot, report });
  const quality = buildVideoQualityReport({ reelReport: report });
  const qualityPaths = writeVideoQualityReport({ workspaceRoot, report: quality });

  console.log(`Reel intelligence ready for ${workspace}`);
  console.log(`Asset: ${path.relative(root, report.asset.absolutePath)}`);
  console.log(`Report: ${path.relative(root, paths.mdPath)}`);
  console.log(`Latest: ${path.relative(root, paths.latestPath)}`);
  console.log(`Quality: ${path.relative(root, qualityPaths.mdPath)} (${quality.status}, ${quality.averageScore}/100)`);
  console.log(`Frames: ${report.frames.length}`);
  console.log(`Transcription: ${report.transcription.status}`);
}

main();
