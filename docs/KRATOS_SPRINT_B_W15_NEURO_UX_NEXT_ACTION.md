# KRATOS Sprint B W15 — Neuro UX Next Action Pass

**Date:** 2026-05-17
**Wave:** B15

## Audit

### Cognitive Load Check
- DashboardView: 4 stat blocks + 4 quick links + repos = 8±2 elements ✓
- ContextoView: Hero + drift card + 2 detail cards + action strip = 7 elements ✓
- SistemaView: Sections scroll vertically — one at a time ✓
- AgoraView: Focus card + next action + alerts = 5 elements ✓

### Next Action Clarity
- `useContextoMissionSnapshot().data.next_action` exposes the context store's reason[0]
- Dashboard aggregated `next_actions` shows priority + project + action
- AgoraView `NextActionCard.onPrimary` advances checkpoint progress

### Source Clarity (Real vs Fallback)
- SourceBadgeIndicator shows "Simulado" (mock) / "Ao vivo" (live) / "Parcial" (partial)
- Config badges show "GitHub não configurado" / "OMNIS não configurado" when absent
- Worker health badge shows ok/degraded/error with version

### No Redesign
- Zero layout changes to existing views
- Only additive: badges and indicators
- Visual MVP preserved
