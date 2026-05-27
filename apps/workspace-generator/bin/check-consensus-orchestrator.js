#!/usr/bin/env node

const assert = require("assert");
const { DEFAULT_CANDIDATES, heuristicScore } = require("../../../packages/orchestration/consensus-orchestrator");

assert.ok(DEFAULT_CANDIDATES.length >= 4);
assert.ok(heuristicScore("Hook\nCTA\nApproval risks\nInstagram platform") > heuristicScore("generic text"));
assert.ok(heuristicScore("guaranteed VIP celebrity sold out") < 60);
console.log("consensus orchestrator ok");
