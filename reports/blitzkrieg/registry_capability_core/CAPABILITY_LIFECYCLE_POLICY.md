# CAPABILITY LIFECYCLE POLICY

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED

## Statuses

| Status | Meaning | Allowed Actions |
|--------|---------|-----------------|
| `planned` | Proposed, not yet built | Can be referenced in designs; cannot be depended on |
| `candidate` | Built but not yet validated | Can be depended on by other `candidate` or `planned` capabilities |
| `active` | Validated and operational | Full participation in runtime |
| `degraded` | Operational but impaired | Still available; dependents should handle fallback |
| `deprecated` | Scheduled for removal | Should not be used by new capabilities |
| `archived` | Removed, kept for history | Read-only reference |
| `banned` | Blocked for safety/security | Cannot be referenced or used; requires incident review |

## State Machine

```
planned ──────► candidate ──────► active ──────► deprecated ──────► archived
                   │                 ▲               │
                   │                 │               │
                   └─────────────────┘               │
                        (fix & retry)                │
                                                     │
                 ┌───────────────────────────────────┘
                 │
                 ▼
              banned ◄──── ANY STATUS (critical risk detected)
```

## Transition Gates

### planned → candidate
- Capability record exists with all required fields
- At least one evidence file or test exists
- No duplicate detected by fingerprint

### candidate → active
- Evidence level = CONFIRMED
- At least one test passes
- Health check endpoint or verification command works
- All `depends_on` capabilities are `active` or `degraded`
- Risk level assessed and governance rules set

### active → degraded
- Automatic if health check fails
- Manual if operator observes impairment
- Dependents notified

### degraded → active
- Health check passes again
- Evidence re-confirmed
- No data loss during degradation

### active → deprecated
- Replacement capability is `candidate` or `active`
- `replaced_by` field set
- Migration path documented
- Deprecation reason filled

### deprecated → archived
- Zero active dependents
- Replacement is `active`
- All references updated
- Deprecation date > 30 days ago

### ANY → banned
- Critical risk detected (security, data loss, compliance)
- Immediate — no waiting period
- Incident review required to un-ban or replace
- All dependents flagged

## Versioning

- Version bump on any field change
- Major: breaking contract change (input/output type change)
- Minor: new field, new dependency, new exposed route/event
- Patch: description fix, metadata update, evidence file addition
