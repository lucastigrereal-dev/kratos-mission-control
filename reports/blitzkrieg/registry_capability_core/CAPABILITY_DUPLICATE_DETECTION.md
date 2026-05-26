# CAPABILITY DUPLICATE DETECTION

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED

## Fingerprint v0

The structural fingerprint is computed from these keys (in priority order):

```yaml
fingerprint:
  structural_keys:
    - domain          # same domain = higher similarity weight
    - type            # same type — e.g., two routes exposing same path
    - layer           # same layer — e.g., two transport-level SSE streams
    - contract.input  # same input schema reference
    - contract.output # same output schema reference
    - exposes.routes  # same route path
    - exposes.events  # same event name
    - exposes.commands # same command name
    - depends_on      # same dependency set
```

## Detection Rules

### R1: Exact ID Collision — BLOCK
```
IF new.id == existing.id → BLOCK registration
```
Same ID = same capability. Cannot register twice. Update existing or use `replaces`.

### R2: Domain + Type + Exposes Match — PROBABLE DUPLICATE
```
IF new.domain == existing.domain
   AND new.type == existing.type
   AND (new.exposes.routes ∩ existing.exposes.routes) is not empty
   OR (new.exposes.events ∩ existing.exposes.events) is not empty
   OR (new.exposes.commands ∩ existing.exposes.commands) is not empty
→ FLAG for human review
```
Two routes in the same domain exposing the same endpoint = almost certainly a duplicate or replacement.

### R3: Contract Output + Route/Event Match — CRITICAL DUPLICATE
```
IF new.contract.output == existing.contract.output
   AND (new.exposes.routes ∩ existing.exposes.routes) is not empty
   OR (new.exposes.events ∩ existing.exposes.events) is not empty
→ BLOCK — same output type on same route/event
```
Two capabilities producing the same output type on the same route = data conflict.

### R4: Similar Description — HUMAN REVIEW
```
IF string_similarity(new.description, existing.description) > 0.7
   AND new.domain == existing.domain
→ FLAG for human review (not automatic block)
```
Descriptions can be similar without being duplicates (e.g., "stream" appears in many capabilities).

### R5: Same Depends_on + Same Exposes — SUSPICIOUS
```
IF new.depends_on == existing.depends_on
   AND new.exposes == existing.exposes
→ FLAG for human review
```
Same dependencies + same outputs = same thing under different names.

## Similarity Scoring

```
Score = 0
+ 30 if same domain
+ 25 if same type
+ 20 if same layer
+ 15 if routes overlap
+ 15 if events overlap
+ 10 if commands overlap
+ 10 if same contract.output
+ 10 if same contract.input

Score >= 60 → CRITICAL DUPLICATE (block)
Score >= 40 → PROBABLE DUPLICATE (flag)
Score >= 20 → SIMILAR (log for awareness)
Score < 20  → DISTINCT (allow)
```

Weights are tunable per domain — `kratos` may have more route collisions than `external`.

## Validation Command (Future)

```bash
python scripts/validate_capability_registry.py \
  --registry registry/capabilities/*.yaml \
  --check-duplicates \
  --check-dependencies
```

Status: HYPOTHESIS — script not yet created.

## Duplicate Resolution Workflow

```
DUPLICATE DETECTED
  │
  ├─► Exact same capability → use "replaces" field in lifecycle
  │
  ├─► Different version of same thing → update existing, bump version
  │
  ├─► Genuinely different capabilities with similar fingerprints
  │      → document why they differ in description
  │      → add distinguishing field to fingerprint if pattern repeats
  │
  └─► False positive → adjust similarity threshold for this domain
```
