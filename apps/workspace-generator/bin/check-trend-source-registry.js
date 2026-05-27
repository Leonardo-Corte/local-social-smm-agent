#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "packages/trend-intel/registries/source-registry.json"), "utf8"));
const ids = registry.sources.map((source) => source.id);

for (const required of ["reddit-json-search", "x-official-api-optional", "meta-ad-library-public", "luma-event-pages"]) {
  assert.ok(ids.includes(required), `missing source ${required}`);
}
assert.ok(registry.sources.every((source) => source.risk && source.method && source.allowedUse));
console.log("trend source registry ok");
