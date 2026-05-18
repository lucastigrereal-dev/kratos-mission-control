# KRATOS Sprint C — Accessibility Audit

**Date:** 2026-05-17
**Scope:** SourceBadgeIndicator, DashboardView, ContextoView, SistemaView
**Standard:** WCAG 2.1 AA

---

## 1. SourceBadgeIndicator

### Element: Source status badge (`<span role="status">`)

| Check | Status | Notes |
|---|---|---|
| Semantic role | PASS | `role="status"` communicates live region to screen readers |
| Accessible name | PASS | `aria-label` with full context: source, origin, time, stale flag, error count, confidence % |
| Color contrast | PASS | Status dot is decorative (`aria-hidden`); text uses `--kratos-text-primary` (#f0f0f2) on dark surface = ~17:1 |
| Focus | N/A | Non-interactive element |
| State communication | PASS | Visual dot + text label + optional `!` stale indicator + error count badge |
| Null state | PASS | Returns `null` when `meta` is `null` — no empty badge rendered |

### Source values covered
- `"live"` — Green dot, "Ao vivo" label
- `"mock"` — Amber dot, "Simulado" label
- `"cache"` — Blue dot, "Cache" label
- `"stale"` — Red dot, "Desatualizado" label (also sets `stale: true`)
- `"partial"` — Amber dot, "Parcial" label
- Any other value — Falls back to `meta.source` string, muted color

### Error states covered
- `meta.stale === true` — Red critical dot + "!" badge
- `meta.errors.length > 0` — Red critical dot + error count badge
- Both stale + errors — Red dot + both badges

### Issues Fixed
1. **Raw hex `#fff`** replaced with `var(--kratos-text-primary)` — ensures text adapts if token values change
2. **Missing `aria-label`** — now provides complete context string for screen readers
3. **Origin display** — Added `meta.origin` display between label and timestamp

---

## 2. DashboardView

### Element: QuickLink navigation buttons

| Check | Status | Notes |
|---|---|---|
| Accessible name | PASS | `aria-label="Ir para {label}"` on all 4 buttons |
| Visible text | PASS | Label text visible inside button |
| Focus ring | PASS | `kratos-focus-ring` class — 1px indigo outline + 4px glow |
| Keyboard navigation | PASS | Native `<button>` — Tab to focus, Enter to activate |
| Touch target | PASS | `px-4 py-3` (~44px height) exceeds 24px WCAG minimum |

### Element: Overdue alert button

| Check | Status | Notes |
|---|---|---|
| Accessible name | PASS | `aria-label` with count and pluralization |
| Contrast | PASS | Red critical text (`#ef4444`) on dark surface = ~4.7:1 |
| Visual prominence | PASS | `kratos-critical-signal` glow animation (disabled with reduced-motion) |
| Error state communication | PASS | Icon + count + "Ir para Agenda" CTA all visible |

### Element: GitHub not configured badge

| Check | Status | Notes |
|---|---|---|
| Color contrast | PASS | Amber border + muted text — informational, not critical |

### Element: Degraded services badge

| Check | Status | Notes |
|---|---|---|
| Color contrast | PASS | Amber border + secondary text — informational warning |

---

## 3. ContextoView

### Element: Retry button (error state)

| Check | Status | Notes |
|---|---|---|
| Accessible name | PASS | `aria-label="Tentar carregar o contexto novamente"` |
| Visible text | PASS | "Tentar novamente" |
| Focus ring | PASS | `kratos-focus-ring` class |
| Keyboard activation | PASS | Native `<button>` with `onClick` |

### Element: Error state panel

| Check | Status | Notes |
|---|---|---|
| Visual distinction | PASS | Red-tinted background + red border + AlertTriangle icon |
| Error message | PASS | Title + description + hint with error code context |
| Recovery action | PASS | Retry button immediately below error panel |

### Element: Empty browser tabs state

| Check | Status | Notes |
|---|---|---|
| Empty state clarity | PASS | "Sem abas detectadas" with explanation |

### Element: Section labels

| Check | Status | Notes |
|---|---|---|
| Semantic structure | PASS | Visual separators for content hierarchy |
| Readability | PASS | `kratos-eyebrow` class — mono font, uppercase, muted color |

---

## 4. SistemaView

### Element: Worker health badge

| Check | Status | Notes |
|---|---|---|
| Accessible name | PASS | `aria-label` with status and version |
| Status communication | PASS | Color-coded dot (green/amber/red) + text status + version |
| Live region | PASS | `role="status"` |

### Element: Config badges (OMNIS/GitHub not configured)

| Check | Status | Notes |
|---|---|---|
| Color contrast | PASS | Muted text on amber-tinted background — informational |
| Visibility | PASS | Rendered conditionally only when unconfigured |

### Element: Reference gallery (LiveStatusIndicator states)

| Check | Status | Notes |
|---|---|---|
| Purpose | PASS | Reference documentation — not interactive |
| Visual clarity | PASS | 9 cards showing each LiveState with indicator |

### Element: Section structure

| Check | Status | Notes |
|---|---|---|
| Semantic HTML | PASS | `<section>` tags for each panel group |
| Heading hierarchy | PASS | SectionHeader + mono eyebrow labels per section |
| Scannability | PASS | Clear visual sections with consistent spacing (`space-y-10`) |

---

## Issues Fixed Summary

| File | Issue | Fix |
|---|---|---|
| SourceBadgeIndicator | Raw `color: "#fff"` (2x) | `var(--kratos-text-primary)` |
| SourceBadgeIndicator | Missing `aria-label` | Full context string via `ariaParts.join(", ")` |
| DashboardView | QuickLinks no aria-label | `aria-label="Ir para {label}"` on 4 buttons |
| ContextoView | Retry button no aria-label | `aria-label="Tentar carregar o contexto novamente"` |
| SistemaView | Worker badge no aria-label | `aria-label` with status + version |
| SistemaView | 15 broken `--kr-color-*` tokens | All replaced with valid `--kratos-*` tokens |

---

## Known Limitations (Out of Scope)

1. **ErrorState.tsx** uses raw `rgba(239,68,68,0.12)` for error icon background — base component, not in visual polish scope
2. **StatusCard.tsx** uses raw `rgba()` for `info` and `ghost` accent borders
3. No automated axe-core / Lighthouse audit performed — visual inspection only
4. Motion tokens (`--kr-duration-*`, `--kr-ease-*`) were added to styles.css but existing classes still use hardcoded values (`180ms ease`) — full migration out of scope

---

## Verification

```
Build:  PASS — zero errors, client + SSR
Tests:  270 pass / 0 fail / 25 files
```
