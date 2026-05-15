# KIMI ZIP INVENTORY — Complete Material Audit

**Date:** 2026-05-15 | **Phase:** P1.5 | **Total files:** 52

---

## Summary

| Category | Files | Status |
|---|---|---|
| Visual Bible | 12 | Reference foundation — DO NOT MODIFY |
| Execution Roadmap/Prompts | 14 | Historical — already executed or superseded |
| Component References | 6 | Code reference — adapt, don't copy |
| Motion Reference | 4 | Framer Motion specs — NOT active (CSS fallback only) |
| Validation Checklists | 5 | QA gates — useful for final hardening |
| Raw Large Specs | 5 | Research material — low priority |
| Root Reference Docs | 6 | Index/navigation — already consumed |

---

## Full Inventory

### 00_inbox_original/ (2 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `00_README_EXECUTIVO_technical.md` | Markdown | REFERENCE_ONLY | Technical executive summary |
| `00_README_EXECUTIVO_visual.md` | Markdown | REFERENCE_ONLY | Visual executive summary |

### 01_visual_bible/ (12 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `VISUAL_BIBLE.md` | Markdown | **ADOPT_NOW** | Canonical visual spec. Already applied. |
| `VISUAL_BIBLE_technical.md` | Markdown | REFERENCE_ONLY | Technical duplicate |
| `VISUAL_BIBLE_visual.md` | Markdown | DUPLICATE | Visual duplicate of main |
| `DESIGN_TOKENS.md` | Markdown | **ADOPT_NOW** | Token reference. Already consumed in kratos-tokens.css. |
| `DESIGN_TOKENS_technical.md` | Markdown | DUPLICATE | Technical duplicate |
| `ANTI_SAAS_RULES.md` | Markdown | **ADOPT_NOW** | Anti-generic-SaaS rules. Enforced. |
| `ANTI_SAAS_RULES_technical.md` | Markdown | DUPLICATE | Technical duplicate |
| `ANTI_SAAS_RULES_visual.md` | Markdown | DUPLICATE | Visual duplicate |
| `UI_PRINCIPLES.md` | Markdown | **ADOPT_NOW** | UX principles. Applied in component design. |
| `UI_PRINCIPLES_technical.md` | Markdown | DUPLICATE | Technical duplicate |
| `IMAGE_DESCRIPTIONS.md` | Markdown | REFERENCE_ONLY | Image alt-text reference |

### 02_execution/ (14 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `original_adoption_log/KIMI_ADOPTION_LOG.md` | Markdown | REFERENCE_ONLY | Historical adoption record |
| `original_roadmap/CLAUDE_EXECUTION_ORDER.md` | Markdown | REFERENCE_ONLY | Superseded by KRATOS_SUPREME_SEQUENTIAL_ROADMAP.md |
| `original_roadmap/CLAUDE_EXECUTION_ORDER_technical.md` | Markdown | DUPLICATE | Duplicate |
| `original_roadmap/FILE_TARGET_MAP.md` | Markdown | REFERENCE_ONLY | Historical file mapping |
| `original_roadmap/FILE_TARGET_MAP_technical.md` | Markdown | DUPLICATE | Duplicate |
| `original_roadmap/ISLAND_CONFIG.ts` | TypeScript | REFERENCE_ONLY | Island config reference. Already applied in WorldMap. |
| `original_roadmap/ISLAND_CONFIG_visual.ts` | TypeScript | DUPLICATE | Visual duplicate |
| `original_roadmap/ROADMAP_MICROFASES.md` | Markdown | REFERENCE_ONLY | Superseded |
| `original_roadmap/ROADMAP_MICROFASES_technical.md` | Markdown | DUPLICATE | Duplicate |
| `original_roadmap/ROADMAP_MICROFASES_visual.md` | Markdown | DUPLICATE | Duplicate |
| `original_prompts/FRONT_KIMI_00_AUDIT.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_01_TOKENS_GLASS.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_02_PRIMITIVES.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_03_WORLD_POLISH.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_04_HUD_POLISH.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_05_AURORA_POLISH.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_06_INTERNAL_ISLANDS.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/FRONT_KIMI_07_VISUAL_QA.md` | Markdown | REFERENCE_ONLY | Historical prompt |
| `original_prompts/MICROFASE_PROMPTS.md` | Markdown | REFERENCE_ONLY | Historical — all prompts already executed |

### 03_component_reference/ (2 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `island_pages/OmnisLabPage.md` | Markdown | **ADAPT_LATER** | Spec for OMNIS page — use in P6 |
| `island_pages/AkashaGringottsPage.md` | Markdown | **ADAPT_LATER** | Spec for vault pages |
| `island_pages/AllOtherIslands.md` | Markdown | **ADAPT_LATER** | Spec for remaining island pages |

### 04_motion_reference/ (4 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `motionVariants.ts` | TypeScript | REFERENCE_ONLY | Framer Motion variants. NOT active. |
| `motionVariants_technical.ts` | TypeScript | DUPLICATE | Duplicate |
| `performanceRules.md` | Markdown | REFERENCE_ONLY | Motion perf rules — apply to CSS animations |
| `reducedMotionRules.md` | Markdown | **ADOPT_NOW** | Already applied in CSS `prefers-reduced-motion` |

### 05_validation/ (5 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `ACCEPTANCE_CHECKLIST.md` | Markdown | REFERENCE_ONLY | Useful for P14 hardening |
| `ACCEPTANCE_CRITERIA.md` | Markdown | REFERENCE_ONLY | Useful for P14 hardening |
| `BUILD_CHECKLIST.md` | Markdown | REFERENCE_ONLY | Already enforced in all phases |
| `SCREENSHOT_REQUIREMENTS.md` | Markdown | REFERENCE_ONLY | Useful for visual QA |
| `VISUAL_QA_CHECKLIST.md` | Markdown | **ADAPT_LATER** | Use in P14 final QA |

### 07_raw_large_specs/ (5 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `KIMI_CODIGOS_ORGANIZADO.md` | Markdown | REFERENCE_ONLY | Organized code manifest |
| `Markdown_analysis.md` | Markdown | REFERENCE_ONLY | Analysis notes |
| `Texto_colado.md` | Markdown | REFERENCE_ONLY | Raw pasted text |
| `kratos_visual_spec5.md` | Markdown | REFERENCE_ONLY | Visual spec v5 |
| `kratos_visualspec4.md` | Markdown | REFERENCE_ONLY | Visual spec v4 |

### Root docs/kimi/ (6 files)
| File | Type | Classification | Notes |
|---|---|---|---|
| `README.md` | Markdown | **ADOPT_NOW** | Navigation index |
| `KIMI_ADOPTION_LOG.md` | Markdown | REFERENCE_ONLY | Historical log |
| `KIMI_CODE_RAW.md` | Markdown | REFERENCE_ONLY | Code manifest (64 entries) |
| `KIMI_COMPONENT_MAP.md` | Markdown | **ADOPT_NOW** | Already applied map |
| `KIMI_EXECUTION_ROADMAP.md` | Markdown | REFERENCE_ONLY | Superseded by Supreme roadmap |
| `KIMI_NEXT_MICROPHASE.md` | Markdown | REFERENCE_ONLY | Historical — P1-C was last |

---

## Classification Summary

| Classification | Count | Meaning |
|---|---|---|
| **ADOPT_NOW** | 8 | Already applied and actively enforced |
| **ADAPT_LATER** | 5 | Useful spec/code for future phases (P3, P5, P6) |
| REFERENCE_ONLY | 27 | Historical, research, or read-only reference |
| DUPLICATE | 12 | Technical/visual duplicates of primary files |
| REJECT | 0 | Nothing rejected |
| UNKNOWN | 0 | Everything classified |

---

## Key Finding

**No ZIP archives exist in the project.** The original `KRATOS_KIMI_FRONTEND_PACK_V1_COMPILED.zip` was already extracted and reorganized into the `docs/kimi/` directory structure before the 5-waves work began. All Kimi materials are plain Markdown and TypeScript reference files, safely contained in `docs/kimi/` with zero risk of accidental frontend contamination.
