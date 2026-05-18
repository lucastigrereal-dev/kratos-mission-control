# KRATOS Sprint B W25 — Missing Config UX Pass

**Date:** 2026-05-17
**Wave:** B25

## Config Detection States

### GitHub Token Missing
- DashboardView: Amber badge "GitHub não configurado" below header
- SistemaView: Amber badge "GitHub não configurado" in status bar
- `useGithubConfig().data.configured === false` → UI shows informational notice, not error
- No crash, no broken layout

### OMNIS Base URL Missing
- SistemaView: Amber badge "OMNIS não configurado" in status bar
- `useOmnisConfig().data.configured === false` → UI shows informational notice
- OMNIS sections still render with empty/error states
- Server functions return `missing_config` error code gracefully

### Both Configured
- Badges disappear, SourceBadgeIndicator shows "Ao vivo" (if live data is flowing)
