#!/usr/bin/env node

const path = require("path");
const { writeTemplateRegistry, templateRegistryMarkdown } = require("../../../packages/image-workflow/comfyui-template-registry");

const root = path.resolve(__dirname, "../../..");
const report = writeTemplateRegistry(root);
console.log(templateRegistryMarkdown(report));
