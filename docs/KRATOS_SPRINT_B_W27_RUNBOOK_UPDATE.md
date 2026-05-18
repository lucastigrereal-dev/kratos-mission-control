# KRATOS Sprint B W27 — Runbook Update

**Date:** 2026-05-17
**Wave:** B27

## Updated Runbook Entries

### New Hooks
```bash
bun test tests/stores/contexto-mission-snapshot.test.ts  # 10 tests
bun test tests/stores/dashboard-snapshot-hook.test.ts     # 6 tests
bun test tests/stores/worker-health-hook.test.ts          # 5 tests
bun test tests/stores/provider-config-hooks.test.ts       # 6 tests
```

### Quick Start (unchanged)
```bash
bun install
bun run dev
bun run build
bun test tests/
```

### New Error Patterns
- `missing_config` → Amber badge in DashboardView/SistemaView (not an error screen)
- `external_unavailable` → Per-section ErrorState with retry
- `stale_data` → SourceBadgeIndicator turns red with time display

### New Components
- `SourceBadgeIndicator` — shows data source (mock/live/partial/stale) with relative time
- Config badges — "GitHub não configurado" / "OMNIS não configurado"
- Worker health badge — ok/degraded/error with version

### Build/Test Gate
- 270 tests, 25 files
- Build ~5.3s (client + SSR)
- CI: timeout 10min, concurrency group, bun cache, type check
