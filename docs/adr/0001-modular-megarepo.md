# ADR 0001: Build a Modular Mega-Repo

Date: 2026-05-22

## Decision
Build a project-owned modular monorepo that can integrate, vendor, isolate, or recreate functionality from external repositories.

## Context
The product is a local-first AI social-media workspace factory, not merely a scheduler or bot. It must own deep interview, model routing, agent generation, trend intelligence, content planning, publishing safety, feedback memory, and persona simulation.

## Consequences
- External code requires audit before use.
- AGPL/GPL candidates remain separate integrations or references unless explicitly accepted.
- Risky automation remains experimental and disabled by default.
- The architecture can evolve without being trapped inside one upstream repo.
