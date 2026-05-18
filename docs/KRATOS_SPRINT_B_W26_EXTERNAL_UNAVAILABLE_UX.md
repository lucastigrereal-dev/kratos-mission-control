# KRATOS Sprint B W26 — External Unavailable UX Pass

**Date:** 2026-05-17
**Wave:** B26

## External Unavailable States

### OMNIS Unavailable
- SistemaView: Per-section `ErrorState` with title "OMNIS indisponível"
- Description includes error message from server
- Hint shows which bridge endpoint failed ("bridge /api/omnis/status")
- Other sections (crews, jobs) independently handle their own errors

### GitHub API Unavailable
- TrackedRepoCard in DashboardView: `ErrorState` with repo name + error message
- Server returns `external_unavailable` error code
- Individual repo cards fail independently — other repos still render

### UX Principles
- Errors are scoped to affected data, not global
- Next action always visible: "Verifique a conexão e tente novamente"
- Error messages are human-readable, not raw stack traces
- Color coding: amber for missing config, red for external unavailable
