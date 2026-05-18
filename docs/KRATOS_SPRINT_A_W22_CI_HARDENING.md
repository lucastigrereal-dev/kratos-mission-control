# KRATOS Sprint A W22 — CI Hardening

**Date:** 2026-05-17
**Wave:** A22

## Current CI
- Triggers: push (main, feat/**, fix/**, docs/**, test/**, ci/**) + PR to main
- Steps: checkout → setup bun → install → build → test
- No deploy, no secrets
- **Status: PASS (243 tests, build ~5s)**

## Hardening Applied

### 1. Job timeout
```yaml
timeout-minutes: 10
```
Prevents hung CI from consuming minutes indefinitely.

### 2. Concurrency group
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
Cancels stale runs when new commits push to the same branch.

### 3. Bun cache
```yaml
- name: Cache Bun dependencies
  uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: bun-${{ runner.os }}-${{ hashFiles('bun.lockb') }}
```
Faster installs in subsequent CI runs.

### 4. Type check step (added after build)
```yaml
- name: Type check
  run: bunx tsc --noEmit
```
Catches type errors that build might not surface. Using `bunx tsc` avoids global install dependency.

## CI After Hardening
```yaml
name: KRATOS CI

on:
  push:
    branches: [main, "feat/**", "fix/**", "docs/**", "test/**", "ci/**"]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-test:
    name: Build & Test
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: "1.3.10"

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: bun-${{ runner.os }}-${{ hashFiles('bun.lockb') }}
          restore-keys: bun-${{ runner.os }}-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build
        run: bun run build

      - name: Type check
        run: bunx tsc --noEmit

      - name: Test (stores + contracts)
        run: bun test tests/
```

## Not Included
- Lint step: pre-existing EPERM on `.pytest_cache` — needs `.eslintignore` or dir cleanup first
- E2E step: Playwright not yet installed (A20)
- Deploy step: requires explicit authorization
- Bundle size diff: nice-to-have, not critical now
