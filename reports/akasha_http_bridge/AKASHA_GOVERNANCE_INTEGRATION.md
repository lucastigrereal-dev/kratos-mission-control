# AKASHA GOVERNANCE INTEGRATION — ABA23

**Date:** 2026-05-21 | **Project:** KRATOS Mission Control

---

## Governance Rules (P0)

| Rule | Enforcement |
|------|-------------|
| Read-only bridge | No POST/PUT/DELETE to Akasha |
| No ingestion | Bridge never triggers ingestion pipeline |
| No embedding writes | Bridge never creates or stores vectors |
| Truncated responses | All text excerpts ≤ 500 chars |
| Source badge | Every response includes `source_badge: confirmed|partial|mock` |

## Auth Requirements (per ABA22)

| Endpoint | Risk | Requires Auth | Scope |
|----------|------|---------------|-------|
| GET /akasha/status | L1 | Yes (Phase B) | memory:read |
| GET /akasha/health | L1 | Yes (Phase B) | memory:read |
| POST /akasha/search | L2 | Yes (Phase B) | memory:read |
| POST /akasha/context | L2 | Yes (Phase B) | memory:read |
| GET /akasha/sources | L1 | Yes (Phase B) | memory:read |

Auth is NOT implemented yet. These endpoints will be protected in Phase B (JWT).

## Human Approval Gates

No Akasha bridge endpoint requires human approval (all are read-only L1-L2).

## Audit Events (future)

When auth is implemented, Akasha bridge should emit:
- `memory.searched` — when POST /akasha/search is called
- `memory.retrieved` — when POST /akasha/context is called

## MCP Service Scoping

When MCP server (publisher-os) accesses Akasha bridge:
- Minimum scope: `memory:read`
- No write scope
- Rate limit: 30 requests/min
- Max results per search: 10

## LGPD / Data Privacy

| Requirement | Status | Action |
|-------------|--------|--------|
| Consent tracking | ❌ Not implemented | Future phase |
| Data export | ❌ Not implemented | Future phase |
| Data deletion | ❌ Not implemented | Future phase |
| PII identification | ❌ Not implemented | Future phase |

Current bridge is read-only, so no new LGPD risks are introduced. Risks are inherited from Akasha's existing data.

## Blocker Status

| Blocker | Status | Impact |
|---------|--------|--------|
| Akasha PostgreSQL port 5432 not running | UNKNOWN | Bridge falls back to mock |
| No data classification on Akasha docs | ACCEPTED | Blanket truncation applied |
| Auth layer not implemented | ACCEPTED | Endpoints open until Phase B |
