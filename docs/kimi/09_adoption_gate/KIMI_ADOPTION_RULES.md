# KIMI ADOPTION RULES — Gate Protocol

**Date:** 2026-05-15 | **Phase:** P1.5 | **Version:** 1.0

---

## 1. Supreme Principle

> **Kimi is reference. KRATOS is authority. Claude adapts. Aurora audits. Lucas approves.**

Kimi materials provide visual inspiration, design tokens, component ideas, and specs. They do NOT provide production-ready code to be copied directly into the KRATOS frontend.

## 2. Classification System

Every Kimi artifact must be classified into exactly one bucket:

| Classification | Symbol | Meaning |
|---|---|---|
| **ADOPT_NOW** | ✅ | Actively applied and enforced in current codebase |
| **ADAPT_LATER** | 🔧 | Useful spec/code for a specific future roadmap phase |
| **REFERENCE_ONLY** | 📖 | Historical, research, or read-only context |
| **REJECT** | ❌ | Incompatible with KRATOS architecture or philosophy |
| **DUPLICATE** | 📋 | Redundant copy of a primary artifact |
| **UNKNOWN** | ❓ | Not yet evaluated |

## 3. Adoption Gates

### Gate 1: Inventory
- All Kimi files must be listed in `KIMI_ZIP_INVENTORY.md`
- No file may be adopted without being inventoried first

### Gate 2: Classification
- Every file receives exactly one classification
- Classifications are documented in the inventory
- UNKNOWN items must be resolved before any adoption

### Gate 3: Component Mapping
- Any Kimi component targeted for adoption must be mapped to a specific KRATOS component in `KIMI_COMPONENT_TO_KRATOS_MAP.md`
- If no KRATOS component exists, document the gap

### Gate 4: Adaptation (for ADAPT_LATER → actual use)
- Read Kimi source
- Compare with existing KRATOS code
- Extract only what's needed (tokens, layout ideas, interaction patterns)
- Remove: Framer Motion, CVA, `any` types, external deps
- Convert: Framer → CSS transitions, CVA → plain classes
- Apply KRATOS namespace (`--kr-*`, `kr-*` classes)
- Validate: build + visual check

### Gate 5: Approval
- ADAPT_LATER items only enter code during their designated roadmap phase
- ADOPT_NOW items are already applied — no action needed
- Any item not in the roadmap requires explicit human approval

## 4. Forbidden Actions

- ❌ Copy Kimi `.tsx` file directly into `frontend/src/`
- ❌ Import Kimi CSS globally without tokenization
- ❌ Install dependencies mentioned in Kimi specs (Framer Motion, CVA, etc.)
- ❌ Use Kimi `ISLAND_CONFIG.ts` as runtime config — it's reference only
- ❌ Adopt Kimi code outside its designated roadmap phase
- ❌ Apply Kimi motion variants directly (use CSS fallback)

## 5. Allowed Actions

- ✅ Read Kimi files for inspiration during any phase
- ✅ Reference Kimi design tokens when creating new `--kr-*` tokens
- ✅ Use Kimi page specs as UX requirements for page rebuilds
- ✅ Compare Kimi component code with existing KRATOS code for gap analysis
- ✅ Extract layout patterns and interaction ideas from Kimi specs

## 6. Phase-to-Kimi Mapping

| Roadmap Phase | Kimi Materials to Reference | Adoption Level |
|---|---|---|
| P1.5 (this phase) | ALL — inventory and classify | DOCUMENTATION ONLY |
| P2 (API Contract) | None directly | N/A |
| P3 (Frontend Tests) | `03_SAFE_PRIMITIVES/` — component API reference | SPEC REFERENCE |
| P4 (React Version) | None directly | N/A |
| P5 (CSS Split) | `01_visual_bible/DESIGN_TOKENS.md` — organization pattern | ORGANIZATION REFERENCE |
| P6 (OMNIS Page) | `03_component_reference/island_pages/OmnisLabPage.md` | FULL ADAPTATION |
| P7 (Approvals) | None directly | N/A |
| P8 (Mission Home) | `VISUAL_BIBLE.md` — shell architecture, UX principles | UX REFERENCE |
| P9 (Aurora FS) | `06_AURORA_COMPONENTS/` — AuroraOrb, AuroraHUD | FULL ADAPTATION |
| P10-P14 | None directly — hardening and cleanup | N/A |

## 7. Violation Response

If Kimi material is found in `frontend/src/` that hasn't passed the adoption gate:
1. **Do NOT delete** — it may have been intentionally adapted
2. **Flag** in the next phase report
3. **Verify** whether it passed a previous adoption gate (check KIMI_ADOPTION_LOG.md)
4. **Classify** as: LEGACY_ADOPTED (pre-gate, keep) or UNVETTED (needs gate review)

---

**These rules take effect immediately and govern all phases P2 through P14.**
