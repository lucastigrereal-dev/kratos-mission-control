# KRATOS Sprint A W16 — CI Snapshot Coverage

**Date:** 2026-05-17
**Wave:** A16

## Coverage Confirmation
- CI workflow (`.github/workflows/ci.yml`) runs `bun test tests/` after build
- All 243 tests across 21 files are verified, including snapshot tests
- Triggers: push to main, feat/**, fix/**, docs/**, test/**, ci/** — and PRs to main

## Snapshot Tests in CI
| Test File | Tests | Snapshot Type |
|---|---|---|
| `contexto-snapshot.test.ts` | 23 | Contexto snapshot + source badge |
| `dashboard-snapshot.test.ts` | 20 | Dashboard aggregation |
| `snapshot-contract-regression.test.ts` | 9 | Cross-contract regression |
| `source-metadata.test.ts` | 10 | SourceBadgeMeta schema |
| `snapshot-error-taxonomy.test.ts` | 13 | Error classification |

Total: 75 snapshot-related tests (plus 168 other store/contract tests).

## CI Safety
- Zero network calls in tests — pure logic only
- Zero env var requirements — `github-token-safety.test.ts` actively clears `globalThis.GITHUB_TOKEN`
- Bun 1.3.10 pinned in CI
- Build gate (`bun run build`) runs before tests
- No secrets required in CI workflow
