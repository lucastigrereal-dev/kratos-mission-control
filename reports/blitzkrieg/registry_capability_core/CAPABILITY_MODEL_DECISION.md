# CAPABILITY MODEL DECISION

**Date:** 2026-05-20
**Status:** APPROVED
**Evidence Level:** CONFIRMED

## Decision

**Model B (Nó de Grafo com Contrato) selected as the canonical Capability Registry model for the OMNISVERSO.**

## Alternatives Evaluated

### A) Flat Entity (YAML simples) — REJECTED

Each capability as a flat entry: `id`, `name`, `domain`, `type`, `depends_on`.

**Why rejected:**
- Cannot express contracts (input/output/side_effects)
- No evidence layer — cannot distinguish CONFIRMED from HYPOTHESIS
- No governance field — cannot encode safety rules
- No lifecycle tracking
- No fingerprint for duplicate detection beyond exact ID match
- Flat `depends_on` cannot distinguish `depends_on` from `exposes` from `consumes`
- **Too simple for a multi-system registry spanning KRATOS, Akasha, OMNIS, Gringotts, Publisher OS**

### B) Graph Node with Contract — APPROVED

Each capability is a node in a directed graph with identity, contract, dependencies, evidence, risk, governance, lifecycle, and quality fields.

**Why approved:**
- Rich enough for dependency resolution and impact analysis
- Contract field enables type-safe capability wiring
- Evidence layer gates what can be `active` vs `planned`
- Governance field encodes per-capability safety rules (allowed/forbidden tools, approval gates)
- Lifecycle enables state machine transitions with gates
- Fingerprint enables structural duplicate detection beyond ID matching
- Fingerprint-based dedup prevents capability duplication across domains
- Compatible with existing KRATOS patterns: api-contract/, agent-manifest, skill-manifest
- Extensible — new fields can be added without breaking existing entries
- Graph-native: `depends_on`, `exposes`, `consumes`, `produces` form traversable edges

### C) OpenAPI-like Full Spec — REJECTED (for now)

Each capability gets a complete OpenAPI-style schema with full input/output type definitions, error codes, authentication flows, etc.

**Why rejected:**
- Overkill for an internal operational registry
- Heavy maintenance burden — every minor change requires spec update
- Most capabilities don't need full schema documentation (scripts, agents, prompts don't have REST contracts)
- Can be layered on top later as an optional `contract.openapi_spec` field
- **Not needed now — Model B supports the `contract` field which can reference OpenAPI schemas when relevant**

## Model B Core Principles

1. **Every capability is a graph node** — it has identity, edges, and state
2. **Contract-first** — input/output/side_effects explicitly declared
3. **Evidence-gated** — cannot be `active` without CONFIRMED evidence
4. **Governed** — safety rules encoded per capability, not just global policies
5. **Fingerprinted** — structural keys enable duplicate detection
6. **Versioned** — lifecycle tracks creation, updates, deprecation, replacement

## Scope

The Registry covers the entire OMNISVERSO — not just KRATOS:

| Domain | Scope |
|--------|-------|
| `kratos` | Mission Control cockpit |
| `akasha` | Vector memory + knowledge |
| `omnis` | Agent execution engine |
| `gringotts` | Finance + treasury |
| `mission_control` | Cross-system orchestration |
| `publisher_os` | Content publishing |
| `cross_cutting` | Shared infrastructure |
| `external` | Third-party integrations |
