# KRATOS Risk, Technical Debt, and Roadmap

Generated: 2026-05-19

## 1. Risk Register

| ID | Risk | Severity | Evidence | Mitigation |
|---|---|---|---|---|
| R-001 | Dual frontend authority | High | `src/` and `frontend/` both contain app/pages/hooks | Declare canonical frontend |
| R-002 | Backend identity conflict | High | Docs mention Hono/Worker; runtime is FastAPI | Publish current runtime authority |
| R-003 | DB schema drift | High | English inline schema vs Portuguese migration schema | Choose schema authority and test it |
| R-004 | API envelope inconsistency | Medium | Envelope documented; many endpoints exist | Contract test all endpoints |
| R-005 | Akasha scripts can write broad external state | High | Obsidian/Akasha scripts write files and DB | Dry-run/confirmation/runbook |
| R-006 | OMNIS boundary erosion | High | Future feature pressure may add execution | Automated no-mutation check |
| R-007 | ActivityWatch dependency offline | Medium | Context depends on local service | Offline state and confidence badges |
| R-008 | Docker dependency offline | Medium | Docker collector/Akasha container | Degraded state, no crash |
| R-009 | Stale docs | Medium | Many old phase reports | Current-truth index |
| R-010 | Agent overreach | Medium | Many agents/skills | Protected path and boundary checks |

## 2. Technical Debt

### Critical debt

1. Frontend split.
2. Backend docs/runtime mismatch.
3. SQLite schema mismatch.
4. API contract version drift.

### Significant debt

5. API base duplication.
6. Live SSE client duplication.
7. Akasha SQL script safety.
8. Historical docs noise.
9. Source badge coverage not fully enforceable.
10. Governance not fully automated.

### Lower debt

11. Some placeholder UI is acceptable if source is honest.
12. Some mock data is acceptable if visibly labeled.
13. Cloudflare Worker config can remain dormant if documented as non-authoritative.

## 3. Roadmap

### Sprint 1 - Runtime Truth

Deliverables:

- `CURRENT_RUNTIME_AUTHORITY.md`
- `FRONTEND_AUTHORITY.md`
- `DATABASE_SCHEMA_AUTHORITY.md`
- route inventory generated from FastAPI

Acceptance:

- A new agent can identify how to run the real app without reading 40 historical docs.

### Sprint 2 - Contract Hardening

Deliverables:

- endpoint envelope test matrix
- `/live/snapshot` schema validation
- no-OMNIS-mutation scanner
- source badge states test

Acceptance:

- Contract drift fails tests or produces a clear report.

### Sprint 3 - DB Stabilization

Deliverables:

- canonical SQLite schema
- migration/bootstrap story
- test DB fixture
- schema drift test

Acceptance:

- Services and migrations agree on column names.

### Sprint 4 - Frontend Consolidation

Deliverables:

- canonical frontend selected
- duplicated hooks retired or aliased
- API base centralized
- SSE client centralized

Acceptance:

- One build command and one frontend source of truth.

### Sprint 5 - Akasha Safe Integration

Deliverables:

- Akasha schema docs
- read-only status endpoint/UI
- script dry-run runbook
- parameterized/safe SQL plan

Acceptance:

- KRATOS can display Akasha health honestly without implying full semantic UI integration.

### Sprint 6 - Governance Automation

Deliverables:

- protected path scanner
- docs-only/source-code diff classifier
- current state report command
- agent/skill registry validator

Acceptance:

- Governance becomes executable, not just textual.

## 4. Stop-Doing List

- Stop adding new product features until runtime authority is documented.
- Stop duplicating frontend hooks across `src` and `frontend`.
- Stop treating historical reports as current truth.
- Stop expanding Akasha UI promises before status/source contracts are locked.
- Stop mixing migration languages (`nome`/`name`) without an adapter or migration decision.

## 5. Recommended Next Step

Create the three authority documents:

1. `docs/architecture/CURRENT_RUNTIME_AUTHORITY.md`
2. `docs/architecture/FRONTEND_AUTHORITY.md`
3. `docs/architecture/DATABASE_SCHEMA_AUTHORITY.md`

These are low-risk, documentation-only, and unblock disciplined implementation.

