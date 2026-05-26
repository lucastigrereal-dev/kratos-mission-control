# CAPABILITY GRAPH RELATIONSHIPS

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED

## Relationship Types

### Hard Dependencies (structural — breaking if missing)

| Relationship | Direction | Semantics | Example |
|-------------|-----------|-----------|---------|
| `depends_on` | A → B | A cannot function without B | `kratos.live.stream` → `kratos.live.cache` |
| `owned_by` | A → domain | A belongs to this domain | `kratos.live.stream` → domain `kratos` |
| `replaces` | new → old | New capability supersedes old | `v2.live.stream` → `kratos.live.stream` |
| `guarded_by` | A → governor | Governor validates A before execution | `kratos.deploy` → `token-enforcer` |

### Soft Dependencies (informational — degraded if missing)

| Relationship | Direction | Semantics | Example |
|-------------|-----------|-----------|---------|
| `consumes` | A → B | A reads data/events from B | `useLiveKratos` → `live.snapshot` event |
| `observed_by` | A → observer | A is monitored by this capability | `live.stream` → `mission_control.health` |
| `triggered_by` | A → trigger | A is invoked by this trigger | `post_scheduler` → cron timer |
| `used_by` | A → consumer | A is used by this consumer | `checkpoint.schema` → `useCheckpoints` |

### Production Relationships (output — what this creates)

| Relationship | Direction | Semantics | Example |
|-------------|-----------|-----------|---------|
| `exposes` | A → artifact | A makes this available | `kratos.live.stream` → route `/live/stream` |
| `produces` | A → artifact | A generates this data/event | `live_event_service` → `live.snapshot` event |

### Lifecycle Relationships

| Relationship | Direction | Semantics | Example |
|-------------|-----------|-----------|---------|
| `replaces` | new → old | Forward pointer in lifecycle | `v2.checkpoint.service` → `checkpoint.service` |
| `replaced_by` | old → new | Backward pointer in lifecycle | `checkpoint.service` → `v2.checkpoint.service` |

## Graph Traversal Use Cases

### Impact Analysis: "What breaks if X goes down?"

```
START: capability X
TRAVERSE: used_by (reverse) → find all consumers
TRAVERSE: depends_on (forward from each consumer) → transitive impact
OUTPUT: ordered list of affected capabilities
```

### Dependency Resolution: "Can we activate X?"

```
START: capability X
TRAVERSE: depends_on (recursive)
CHECK: all transitive dependencies are active or degraded
CHECK: no banned capabilities in transitive closure
OUTPUT: PASS/BLOCK
```

### Duplicate Detection: "Does X already exist?"

```
START: capability X fingerprint
COMPARE: structural_keys against all existing capabilities
MATCH: same domain + type + exposes = probable duplicate
MATCH: same contract.output + route/event = critical duplicate
OUTPUT: similarity score + list of potential duplicates
```

### Governance Audit: "What capabilities can write to production?"

```
FILTER: governance.forbidden_tools does NOT contain "production_write"
FILTER: risk.requires_human_slot = false
OUTPUT: capabilities that might auto-execute dangerous actions
```

## Edge Cardinality

| Relationship | Source Cardinality | Target Cardinality |
|-------------|-------------------|-------------------|
| `depends_on` | Many | Many |
| `exposes` | One | Many |
| `consumes` | Many | Many |
| `produces` | One | Many |
| `owned_by` | Many | One (domain) |
| `guarded_by` | Many | Many |
| `observed_by` | Many | Many |
| `replaces` | One | One |
| `replaced_by` | One | One |
| `triggered_by` | Many | Many |
| `used_by` | Many | Many |
