#!/usr/bin/env node

const assert = require("assert");
const { TEMPLATES, buildTemplateRegistryReport, templateById } = require("../../../packages/image-workflow/comfyui-template-registry");

const report = buildTemplateRegistryReport();
assert.ok(TEMPLATES.length >= 4);
assert.ok(templateById("reel-cover-9x16"));
assert.ok(report.templates.every((template) => template.preset && template.bestFor.length > 0));
console.log("comfyui template registry ok");
