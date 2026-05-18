# KRATOS Sprint C M02 — Parallel Scope Lock

**Date:** 2026-05-17
**Wave:** M02
**Status:** LOCKED

## Scope: parallel/kratos-c-playwright

**Worktree:** `.claude/worktrees/kratos-c-playwright`
**Base:** daa8c88
**Mission:** E2E test foundation for KRATOS cockpit

### Deliverables
- Playwright installed and configured
- `playwright.config.ts` with webServer pointing to `bun run dev`
- Smoke tests for all 7 routes (`/`, `/agora`, `/agenda`, `/checkpoints`, `/projetos`, `/contexto`, `/sistema`)
- Console error detection (zero errors in CI)
- Screenshot baseline for visual regression (dark mode)
- CI workflow step for `bunx playwright test`
- Test helpers: `tests/e2e/` directory structure
- README for E2E test commands

### Forbidden
- No deploy config changes
- No `wrangler deploy`
- No `.env` reads
- No source code changes in `src/` (read-only)
- No route changes
- No component changes

### Files expected
- `playwright.config.ts` (new)
- `tests/e2e/` directory (new)
- `.github/workflows/ci.yml` (patch — add Playwright step)
- `package.json` (patch — add playwright scripts)

---

## Scope: parallel/kratos-c-visual

**Worktree:** `.claude/worktrees/kratos-c-visual`
**Base:** daa8c88
**Mission:** Visual polish for 3 Sprint B-wired views + SourceBadgeIndicator

### Deliverables
- SourceBadgeIndicator refinement (colors, sizing, animation)
- DashboardView polish (layout, spacing, dark mode)
- ContextoView polish (snapshot card, confidence display)
- SistemaView polish (badge alignment, health status)
- Token audit: zero raw colors, all `var(--kr-*)`
- Accessibility pass: aria labels, contrast ratios, focus rings
- Motion audit: no infinite loops, max 2 concurrent, duration ≤ 0.6s
- Neuro-UX: 7±2 elements per view, 1 primary action, spatial memory
- Loading/Empty/Error state visual consistency
- Mobile 375px verification
- `prefers-reduced-motion` compliance

### Forbidden
- No deploy config changes
- No `wrangler deploy`
- No `.env` reads
- No route additions or removals
- No hook logic changes (visual only)
- No new dependencies without audit
- No changing component APIs (props interfaces stable)

### Files expected (modified)
- `src/components/kratos/base/SourceBadgeIndicator.tsx`
- `src/components/kratos/views/DashboardView.tsx`
- `src/components/kratos/views/ContextoView.tsx`
- `src/components/kratos/views/SistemaView.tsx`
- `src/styles.css` (if tokens need refinement)

### Files expected (new)
- `docs/KRATOS_SPRINT_C_VISUAL_QA_REPORT.md`
- `docs/KRATOS_SPRINT_C_ACCESSIBILITY_AUDIT.md`

---

## Handoff Command for Each Branch

```bash
# Playwright
cd C:\Users\lucas\kratos-mission-control\.claude\worktrees\kratos-c-playwright
# Mission: E2E test foundation per scope above
# Start with: bun add -D @playwright/test && bunx playwright install

# Visual
cd C:\Users\lucas\kratos-mission-control\.claude\worktrees\kratos-c-visual
# Mission: Visual polish per scope above
# Start with: audit current SourceBadgeIndicator + 3 views
```
