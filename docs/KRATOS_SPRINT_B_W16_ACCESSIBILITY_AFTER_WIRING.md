# KRATOS Sprint B W16 — Accessibility After Wiring

**Date:** 2026-05-17
**Wave:** B16

## Audit

### ARIA Labels
- StatusDot uses `aria-hidden` (decorative)
- Alert bar button has `aria-label` with overdue count
- SourceBadgeIndicator uses `title` attribute for full context
- All interactive elements wrapped in buttons with labels

### Focus Management
- `.kratos-focus-ring` class on all interactive elements
- Config badges are non-interactive (informational spans)

### Contrast
- All colors use CSS tokens (`var(--kr-*)`), not raw hex
- Badges use `color-mix(in oklab, ...)` for tinted backgrounds
- Text uses `--kr-color-text-primary` / `--kr-color-text-secondary` / `--kr-color-text-muted`

### Reduced Motion
- `prefers-reduced-motion` handled by CSS token system
- SourceBadgeIndicator and badges are static — no animation
- Existing StatusDot pulse/blink respects motion preferences

### Live Regions
- No `aria-live` regions needed — data updates are passive (no real-time push)
