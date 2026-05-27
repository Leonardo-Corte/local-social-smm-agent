#!/usr/bin/env node

const path = require("path");
const { writeFinalSystemStatus, statusMarkdown } = require("../../../packages/roadmap/final-system-status");

const root = path.resolve(__dirname, "../../..");
const status = writeFinalSystemStatus(root);
console.log(statusMarkdown(status));
