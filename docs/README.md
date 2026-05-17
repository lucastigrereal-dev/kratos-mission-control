# KRATOS Mission Control — Documentation

## Quick Navigation

- [Sequential Roadmap](KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md) — Full P0-P14 execution plan
- [Phase Reports](#phase-reports) — Per-phase build audits (P0 → current)
- [Archive](archive/) — Completed wave reports (Waves A-D, 1-7, KP3, WE)
- [Architecture](architecture/) — Operating model
- [Product](product/) — Cognitive continuity spec
- [Reports](reports/) — Curated reference reports
- [Kimi Reference](kimi/) — Original Kimi design specs (reference only, not active)

## Phase Reports

| Phase | Report                                                                 | Status   |
| ----- | ---------------------------------------------------------------------- | -------- |
| P0    | [Baseline Lock](KRATOS_P0_BASELINE_LOCK_REPORT.md)                     | PASS     |
| P1    | [Merge Readiness Final](KRATOS_P1_MERGE_READINESS_FINAL.md)            | PASS     |
| P1.5  | [Kimi Zip Adoption Gate](KRATOS_P1_5_KIMI_ZIP_ADOPTION_GATE_REPORT.md) | PASS     |
| P2    | [API Contract V1](KRATOS_P2_API_CONTRACT_REPORT.md)                    | PASS     |
| P3    | [Frontend Tests](KRATOS_P3_FRONTEND_TESTS_REPORT.md)                   | PASS     |
| P4    | [React Version Decision](KRATOS_P4_REACT_VERSION_DECISION.md)          | PASS     |
| P5    | [CSS Split](KRATOS_P5_CSS_SPLIT_REPORT.md)                             | PASS     |
| P6    | [OMNIS Page Operational](KRATOS_P6_OMNIS_PAGE_REPORT.md)               | PASS     |
| P7    | [Approval Cockpit V1](KRATOS_P7_APPROVAL_COCKPIT_REPORT.md)            | PASS     |
| P8    | [Mission Control Home V1](KRATOS_P8_MISSION_CONTROL_HOME_REPORT.md)    | PASS     |
| P9    | [Aurora Full-Screen Mode](KRATOS_P9_AURORA_FULLSCREEN_REPORT.md)       | PASS     |
| P10   | [Context Memory / Continuity](KRATOS_P10_CONTEXT_MEMORY_REPORT.md)     | PASS     |
| P11   | [Checkpoints Timeline](KRATOS_P11_CHECKPOINTS_TIMELINE_REPORT.md)      | PASS     |
| P12   | [Docs Cleanup](KRATOS_P12_DOCS_CLEANUP_REPORT.md)                      | PASS     |
| P13   | [Stash Audit](KRATOS_P13_STASH_AUDIT_REPORT.md)                        | PASS     |
| P14   | [Release Candidate](KRATOS_SUPREME_RELEASE_CANDIDATE_REPORT.md)        | RC READY |

## Preflight / Validation

- [Supreme 5Waves Preflight](KRATOS_SUPREME_5WAVES_PREFLIGHT_REPORT.md)
- [Supreme 5Waves Visual Validation](KRATOS_SUPREME_5WAVES_VISUAL_VALIDATION_REPORT.md)

## Directory Structure

```
docs/
├── README.md                         ← You are here
├── KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md
├── KRATOS_P*.md                      ← P0-P13 phase reports
├── architecture/                     ← Architecture specs
│   └── KRATOS_OPERATING_MODEL.md
├── product/                          ← Product specs
│   └── KRATOS_COGNITIVE_CONTINUITY_SPEC.md
├── reports/                          ← Curated reports
│   ├── KRATOS_K_P1_C_CSS_TOKEN_COMPLETION_REPORT.md
│   └── KRATOS_KIMI_REFERENCE_PACK_CURATION_REPORT.md
├── kimi/                             ← Kimi design references (read-only)
│   ├── 01_visual_bible/
│   ├── 02_execution/
│   ├── 03_component_reference/
│   ├── 05_validation/
│   ├── 09_adoption_gate/
│   └── ...
└── archive/                          ← Completed wave reports (historical)
    ├── KRATOS_WAVE_A_D_*.md
    ├── KRATOS_KIMI_KP3*.md
    └── ...
```
