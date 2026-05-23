# KRATOS BRANCH DECISION MATRIX

**Date:** 2026-05-15 | **Phase:** P1 | **Purpose:** Document all local branches and recommend disposition

---

## Branch Inventory

| # | Branch | HEAD | Ahead/Behind | Function | Status | Risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 1 | `feature/kratos-kimi-supreme-zips-5waves` | `9b73604` | +47 main, +2 origin | Active development — 5 waves visual + docs + P0/P1 | **ACTIVE** | LOW | **MERGE to main** (canonical) |
| 2 | `main` | `5981d22` | baseline | Canonical trunk — merge of kimi visual wave 2 | STABLE | NONE | **KEEP** as canonical base |
| 3 | `master` | `8d72e2c` | -41 main | Stale — diverged, no longer canonical | **STALE** | LOW | **ARCHIVE** — superseded by main |
| 4 | `feature/kratos-1-visual-shell` | `1511d1f` | unknown vs main | Wave 1 frontend final — earlier iteration | DORMANT | LOW | **ARCHIVE after merge** — work absorbed into 5-waves branch |
| 5 | `feature/kratos-kimi-visual-wave-2` | `dac5901` | already merged into main at `5981d22` | Wave 2 consolidated — merged, has 1 stash | DORMANT | LOW | **ARCHIVE** — already merged. Stash audit in P13. |
| 6 | `feature/kratos-supreme-5waves-kimi` | `aac7f07` | 18 ahead of main (at time) | Wave 7 QA final — intermediary branch | DORMANT | LOW | **ARCHIVE after merge** — superseded by 5-waves branch |

---

## Decision Matrix

| Branch | Keep | Archive Now | Archive Later | Review | Rationale |
|---|---|---|---|---|---|
| `feature/kratos-kimi-supreme-zips-5waves` | — | — | ✓ | — | Active, merge first then archive |
| `main` | ✓ | — | — | — | Canonical trunk |
| `master` | — | ✓ | — | — | 41 commits behind main, abandoned |
| `feature/kratos-1-visual-shell` | — | — | ✓ | — | Superseded, archive after 5-waves merge |
| `feature/kratos-kimi-visual-wave-2` | — | ✓ | — | — | Already merged into main |
| `feature/kratos-supreme-5waves-kimi` | — | — | ✓ | — | Superseded, archive after 5-waves merge |

---

## Recommended Actions

### Immediate (post-P1 approval)
1. Merge `feature/kratos-kimi-supreme-zips-5waves` → `main`
2. Delete `master` (or tag it as `archive/master-legacy`)

### After Merge
3. Archive `feature/kratos-1-visual-shell` (delete branch)
4. Archive `feature/kratos-kimi-visual-wave-2` (delete branch, handle stash in P13)
5. Archive `feature/kratos-supreme-5waves-kimi` (delete branch)

### Deferred
6. P13: Full audit of `stash@{0}` on `feature/kratos-kimi-visual-wave-2`

---

## Final State Target

After all actions:

```
main                            ← canonical trunk, all waves merged
feature/kratos-kimi-supreme-zips-5waves  ← archived (deleted)
feature/kratos-1-visual-shell            ← archived (deleted)
feature/kratos-kimi-visual-wave-2        ← archived (deleted)
feature/kratos-supreme-5waves-kimi       ← archived (deleted)
master                                   ← archived (deleted or tagged)
```

**4 dormant branches + 1 stale master → cleaned to 1 canonical main.**
