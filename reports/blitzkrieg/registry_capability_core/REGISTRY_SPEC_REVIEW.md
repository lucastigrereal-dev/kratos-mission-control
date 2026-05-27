# REGISTRY SPEC REVIEW

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED (self-review of spec artifacts)

## Strengths

| Strength | Detail |
|----------|--------|
| **Graph-native design** | Relationships (`depends_on`, `exposes`, `consumes`, etc.) form traversable edges — enables impact analysis, dependency resolution, governance audit |
| **Evidence-gated activation** | Cannot be `active` without CONFIRMED evidence — prevents registry rot where documented capabilities don't exist |
| **Per-capability governance** | Each capability carries its own safety rules — `forbidden_tools`, `approval_required_for`, `requires_human_slot` — instead of relying on global policies alone |
| **Fingerprint-based dedup** | Structural keys enable duplicate detection before registration, not after conflicts arise |
| **Lifecycle state machine** | Clear transitions with gates — `candidate → active` requires evidence, `active → deprecated` requires replacement |
| **Multi-domain scope** | Covers all 8 domains of the OMNISVERSO, not just KRATOS |
| **Seed examples** | 8 real capabilities across all domains with CONFIRMED evidence where available |

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Registry rot** | Medium | Evidence decay: CONFIRMED drops to HYPOTHESIS after 90 days without re-verification |
| **Over-specification** | Medium | Some fields (quality.verification_command, lifecycle.approved_by) may stay null for most entries — acceptable for v0.1 |
| **Manual maintenance burden** | Medium | Registry is spec-first; automation (validation script, auto-discovery) is future work |
| **Fingerprint false positives** | Low | R4 (similar description) is human-review only, not automatic block |
| **Cross-domain ID collisions** | Low | Dot-notation with domain prefix prevents this |
| **Schema evolution** | Low | Version field + `replaces`/`replaced_by` lifecycle fields handle migration |

## Fields That Could Be Simplified

| Field | Reason | Recommendation |
|-------|--------|----------------|
| `quality.verification_command` | Most entries will use health_endpoint or tests instead | Keep for script-type capabilities |
| `lifecycle.approved_by` | Only meaningful for human-gated capabilities | Keep, null is valid |
| `exposes.artifacts` | Overlaps with `contract.output` | Consider merging or clarifying distinction |
| `fingerprint.structural_keys` | Could be derived from schema automatically | Keep explicit for v0 — enables domain-specific tuning |

## Fields That Must Not Be Removed

| Field | Why Critical |
|-------|-------------|
| `evidence.level` | Gates activation; without it, registry becomes fiction |
| `governance.forbidden_tools` | Safety boundary; without it, capabilities lack operational constraints |
| `risk.requires_human_slot` | Human-in-the-loop gate; without it, dangerous capabilities auto-execute |
| `depends_on` | Dependency resolution; without it, impact analysis is impossible |
| `lifecycle.replaces` / `replaced_by` | Evolution tracking; without it, capabilities fork without traceability |
| `fingerprint` | Duplicate detection; without it, registry accumulates near-duplicates |

## Compatibility Check

| System | Compatibility | Notes |
|--------|---------------|-------|
| **KRATOS Agentic Core** | COMPATIBLE | Agents fit `type: agent`; skills fit `type: skill`; governance maps 1:1 |
| **Mission Package** | COMPATIBLE | Workflows (`type: workflow`) encapsulate multi-step missions |
| **Event Bus** | COMPATIBLE | `exposes.events` + `consumes` relationship model pub/sub |
| **Memory (Akasha)** | COMPATIBLE | `type: memory_source` covers pgvector, embeddings, knowledge retrieval |
| **Governance** | COMPATIBLE | `governance` field per capability + `type: governor` for policy enforcers |
| **Publisher OS** | COMPATIBLE | `type: workflow` + `layer: automation` or `content` |
| **Gringotts** | COMPATIBLE | `type: service` + `domain: gringotts` covers finance capabilities |

## Verdict

**PASS** — The spec is internally consistent, covers all required domains, and includes concrete examples with evidence labels. Ready for writing-plans to move to implementation.

## Recommendations for Next Iteration (v0.2)

1. Auto-discovery script that scans codebase and suggests capability entries
2. Validation script enforcing schema + dedup rules (TDD candidate)
3. Graph visualization (Mermaid/D3) from `depends_on` edges
4. Health check aggregator that verifies all CONFIRMED capabilities
5. CI integration — block PRs that add capabilities without evidence
