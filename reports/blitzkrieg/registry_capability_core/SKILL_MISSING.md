# SKILL MISSING — ABA 1 / Registry & Capability Core

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED

## Missing Skills

The following specialized skills were referenced in the ABA 1 activation sequence but do not exist in the current skill registry:

| # | Skill | Purpose | Priority | Mitigation |
|---|-------|---------|----------|------------|
| 8 | `schema-design` | Design YAML/JSON schemas from requirements | P2 | Handled manually in `capability.schema.yaml` |
| 9 | `architecture-review` | Review architecture decisions against patterns | P2 | Covered by `REGISTRY_SPEC_REVIEW.md` self-review |
| 10 | `registry-design` | Design registry patterns (catalog, indexing, lookup) | P2 | Handled manually via `CAPABILITY_MODEL_DECISION.md` |
| 11 | `capability-mapping` | Map existing code to capabilities | P2 | Seed examples in `capability_registry_seed.example.yaml` |
| 12 | `duplicate-detection` | Detect near-duplicate entries with similarity scoring | P1 | Spec in `CAPABILITY_DUPLICATE_DETECTION.md` — needs implementation script |
| 13 | `yaml-validation` | Validate YAML against schema | P1 | Spec in `capability.schema.yaml` — needs implementation script |
| 14 | `evidence-gate` | Verify evidence labels and enforce gates | P1 | Policy in `CAPABILITY_EVIDENCE_POLICY.md` — needs implementation script |

## Recommendation

Create these skills when the implementation phase reaches their corresponding validators. Priority order:
1. `duplicate-detection` — most algorithmic, hardest to get right manually
2. `yaml-validation` — structural, can be generated from schema
3. `evidence-gate` — policy enforcement, simpler logic

The other 4 skills (schema-design, architecture-review, registry-design, capability-mapping) are design-phase skills that were handled manually. Creating them now would be retrospective.
