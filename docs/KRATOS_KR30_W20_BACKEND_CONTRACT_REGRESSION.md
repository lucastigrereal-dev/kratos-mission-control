# KRATOS KR30 W20 — Backend Contract Regression

**Date:** 2026-05-17  
**Wave:** K20  
**Tests added:** 10  
**Suite total:** 160 pass / 0 fail

## What Was Built

`tests/contracts/backend-regression.test.ts` — 10 regression tests:

- ContextSnapshot: required fields present + live data validates
- GithubRepoStatus: required fields present
- OmnisStatus: required fields present + live data validates
- Service: required fields present + all services validate
- SourceBadgeMeta: required fields + valid case passes
- ApiErrorCode: all 8 codes still defined

## How to Use

If a schema field is renamed or removed, these tests will fail — that's the point.
Before any schema change, run `bun test tests/contracts/` to catch regressions early.
