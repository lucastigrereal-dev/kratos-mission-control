# KRATOS Sprint A W27 — Snapshot Fixtures Hardening

**Date:** 2026-05-17
**Wave:** A27

## Audit Summary

### Fixture Patterns in Use
- **Inline payloads**: Tests construct payloads directly in assertions — lightweight, no shared state
- **Schema-only validation**: All tests use `safeParse()`, never mock HTTP or fetch
- **No seeds, no side effects**: Each test builds its own fixture, no `beforeEach` setup needed

### What's Well-Structured
- `snapshot-error-taxonomy.test.ts` (13 tests): Comprehensive coverage of all 8 error codes, classification logic, stale flag derivation, secrets safety
- `source-metadata.test.ts` (10 tests): Validates all SourceBadgeMeta fields including optional extensions (source_kind, confidence, error_code, generated_by)
- `dashboard-snapshot.test.ts` (20 tests): Tests valid payloads, edge cases (missing fields, invalid priorities, trend validation)
- `contexto-snapshot.test.ts` (23 tests): Covers both ContextSnapshot (desktop telemetry) and ContextoSnapshotData (high-level)

### No Hardening Needed
- No shared mutable fixtures — zero test isolation risks
- No random values — deterministic assertions
- No `any` types — all payloads type-checked via Zod
- No mock timers needed — `new Date().toISOString()` works for datetime validation

## Fixture Coverage by Error Code
| Code | Tested in |
|---|---|
| `missing_config` | `snapshot-error-taxonomy`, `snapshot-contract-regression`, `github-provider` |
| `external_unavailable` | `snapshot-error-taxonomy`, `snapshot-contract-regression`, `omnis-provider` |
| `stale_data` | `snapshot-error-taxonomy` |
| `validation_error` | `snapshot-error-taxonomy`, `snapshot-contract-regression`, `dashboard-snapshot`, `contexto-snapshot` |
| `forbidden_action` | `snapshot-error-taxonomy` |
| `internal_error` | `snapshot-error-taxonomy` |
| `not_found` | `snapshot-error-taxonomy` |
| `rate_limited` | `snapshot-error-taxonomy` |

All 8 error codes are covered. Fixtures are complete and stable.
