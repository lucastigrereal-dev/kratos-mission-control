# KRATOS — Skills Registry Sync

**Date:** 2026-05-17  
**Wave:** K26  

---

## I. SKILLS (`.claude/skills/`)

| Skill | Status | Category | Notes |
|---|---|---|---|
| `akasha-vault-builder` | ⚠️ PLACEHOLDER | Visual/Integration | Needs Akasha + frontend sprint |
| `api-contract-sync` | ✅ READY | Backend/Contract | Maintains Zod schema consistency |
| `glass-panel-builder` | ⚠️ VISUAL ONLY | Visual | Deferred: FrontendGuard active |
| `hud-assembler` | ⚠️ VISUAL ONLY | Visual | Deferred: FrontendGuard active |
| `island-composer` | ⚠️ VISUAL ONLY | Visual | Deferred: FrontendGuard active |
| `kimi-to-code` | ⚠️ VISUAL ONLY | Visual | Deferred: FrontendGuard active |
| `motion-guardian` | ✅ READY (conceptual) | Visual/QA | Active as review checklist |
| `neuro-ux-checker` | ✅ READY (conceptual) | UX/QA | Active as review checklist |
| `omnis-lab-builder` | ⚠️ PLACEHOLDER | Visual/Integration | Needs OMNIS Lab + frontend sprint |
| `token-enforcer` | ✅ READY (conceptual) | Visual/QA | Active as review checklist |
| `visual-qa-kimi` | ⚠️ VISUAL ONLY | Visual/QA | Deferred: FrontendGuard active |

---

## II. AGENTS (`.claude/agents/`)

| Agent | Status | Category | Notes |
|---|---|---|---|
| `kratos-api-builder` | ✅ READY | Backend | Hono endpoints + api-contract validation |
| `kratos-architect` | ✅ READY | Architecture | Planning, boundaries, sequence |
| `kratos-data-layer` | ✅ READY | Data | Zod schemas, hooks, mock data |
| `kratos-qa-guard` | ✅ READY | QA | Pre-commit review |
| `kratos-ui-builder` | ⚠️ VISUAL ONLY | Visual | READ-ONLY role while FrontendGuard active |

---

## III. COMMANDS (`.claude/commands/`)

**No commands directory found.** Commands are not configured for this project.

---

## IV. CLASSIFICATION LEGEND

| Status | Meaning |
|---|---|
| ✅ READY | Can be used now |
| ⚠️ VISUAL ONLY | Deferred to frontend sprint |
| ⚠️ PLACEHOLDER | Needs integration (Akasha/OMNIS) to be useful |
| 🔴 OBSOLETE | Not applicable anymore |
| 🔴 DANGEROUS | Blocked — security or boundary risk |

---

## V. PLACEHOLDER GUARDS

The following skills must NOT be invoked in this sprint:
1. `akasha-vault-builder` — would require writing to `frontend/` (FrontendGuard)
2. `omnis-lab-builder` — would attempt to display OMNIS execution UI (OMNIS boundary)

See K27 for detailed placeholder guard documentation.

---

## VI. RECOMMENDATIONS

1. **When frontend sprint opens:** Activate glass-panel-builder, hud-assembler, island-composer, kimi-to-code, visual-qa-kimi
2. **When Akasha is connected:** Activate akasha-vault-builder
3. **After OMNIS Lab is designed:** Activate omnis-lab-builder (READ-ONLY display only)
4. **Create commands dir:** `.claude/commands/` for project-specific slash commands
