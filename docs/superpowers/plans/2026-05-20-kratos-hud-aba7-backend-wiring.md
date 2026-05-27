# KRATOS HUD ABA 7 — Backend Wiring Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the 6 gaps identified in ABA 6 HUD Contract — create the `/hud/snapshot` endpoint, add emergency stop state, enrich SSE stream, and wire approval events.

**Architecture:** Compose the KratosHudSnapshot from existing collectors (akasha, cost, omnis, event_bridge) into a single `GET /hud/snapshot` endpoint. Add emergency stop state management via Redis. Enrich the existing SSE `/live/stream` with HUD-specific data. No new collectors needed — all data sources already exist.

**Tech Stack:** FastAPI + Redis + existing collectors + Zod (frontend contract)

**Dependencies:** ABA 6 HUD Contract complete (`api-contract/kratos-hud.schema.ts`, `reports/blitzkrieg/kratos_hud_contract/`)

**Spec reference:** `reports/blitzkrieg/kratos_hud_contract/KRATOS_HUD_CONTRACT.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| CREATE | `backend/app/routes/hud.py` | `GET /hud/snapshot` — single HUD endpoint |
| CREATE | `backend/app/services/emergency_stop_service.py` | Emergency stop state management (Redis-backed) |
| CREATE | `backend/app/services/hud_composer.py` | Compose KratosHudSnapshot from collectors |
| MODIFY | `backend/app/services/live_event_service.py` | Enrich SSE with HUD data |
| MODIFY | `backend/app/services/event_bridge.py` | Add `kratos:emergency:*` and `kratos:approval:*` channels |
| MODIFY | `backend/app/main.py` | Register hud router |
| CREATE | `backend/tests/test_hud_snapshot.py` | Tests for HUD snapshot endpoint |
| CREATE | `backend/tests/test_emergency_stop.py` | Tests for emergency stop service |

---

### Task 1: Emergency Stop Service

**Files:**
- Create: `backend/app/services/emergency_stop_service.py`
- Create: `backend/tests/test_emergency_stop.py`

**Context:** The emergency stop is a Redis-backed boolean state with metadata. It must survive restarts and be visible to all consumers.

- [ ] **Step 1: Write the failing test**

```python
# backend/tests/test_emergency_stop.py
import pytest
from app.services.emergency_stop_service import (
    is_emergency_stop_active,
    activate_emergency_stop,
    deactivate_emergency_stop,
    get_emergency_stop_state,
)

def test_emergency_stop_starts_inactive():
    state = get_emergency_stop_state()
    assert state["enabled"] is False
    assert state["reason"] == ""

def test_activate_emergency_stop():
    result = activate_emergency_stop(
        reason="Redis connection lost",
        affected_missions=["abc123", "def456"],
    )
    assert result["enabled"] is True
    assert result["reason"] == "Redis connection lost"
    assert "abc123" in result["affected_missions"]
    assert result["requires_confirmation"] is True

def test_deactivate_emergency_stop():
    activate_emergency_stop(reason="Test", affected_missions=[])
    result = deactivate_emergency_stop()
    assert result["enabled"] is False

def test_is_emergency_stop_active_returns_bool():
    assert is_emergency_stop_active() is False
    activate_emergency_stop(reason="Test", affected_missions=[])
    assert is_emergency_stop_active() is True
    deactivate_emergency_stop()
    assert is_emergency_stop_active() is False
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd kratos-mission-control/backend && python -m pytest tests/test_emergency_stop.py -v`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```python
# backend/app/services/emergency_stop_service.py
"""Emergency Stop Service — Redis-backed emergency stop state.
Survives restarts. Consumed by HUD and all mission-critical paths.
"""
import json
from datetime import datetime, timezone

import redis

REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6382
ESTOP_KEY = "kratos:emergency_stop"

_r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


def get_emergency_stop_state() -> dict:
    """Read current emergency stop state from Redis."""
    try:
        raw = _r.get(ESTOP_KEY)
        if raw:
            return json.loads(raw)
    except Exception:
        pass
    return {
        "enabled": False,
        "reason": "",
        "impact_summary": "",
        "requires_confirmation": True,
        "affected_missions": [],
        "activated_at": None,
        "activated_by": None,
    }


def activate_emergency_stop(
    reason: str,
    affected_missions: list[str] | None = None,
    activated_by: str = "system",
) -> dict:
    """Activate emergency stop. Halts all automated execution."""
    state = {
        "enabled": True,
        "reason": reason,
        "impact_summary": f"Emergency stop activated: {reason}",
        "requires_confirmation": activated_by != "system",
        "affected_missions": affected_missions or [],
        "activated_at": datetime.now(timezone.utc).isoformat(),
        "activated_by": activated_by,
    }
    try:
        _r.set(ESTOP_KEY, json.dumps(state))
        _r.publish("kratos:emergency:activated", json.dumps(state))
    except Exception:
        pass
    return state


def deactivate_emergency_stop(deactivated_by: str = "operator") -> dict:
    """Deactivate emergency stop. Resume normal operations."""
    state = get_emergency_stop_state()
    state["enabled"] = False
    state["deactivated_at"] = datetime.now(timezone.utc).isoformat()
    state["deactivated_by"] = deactivated_by
    try:
        _r.set(ESTOP_KEY, json.dumps(state))
        _r.publish("kratos:emergency:deactivated", json.dumps(state))
    except Exception:
        pass
    return state


def is_emergency_stop_active() -> bool:
    """Quick boolean check for emergency stop state."""
    return get_emergency_stop_state().get("enabled", False)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd kratos-mission-control/backend && python -m pytest tests/test_emergency_stop.py -v`
Expected: 4 PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/emergency_stop_service.py backend/tests/test_emergency_stop.py
git commit -m "feat(hud): add emergency stop service (Redis-backed, survives restarts)

- activate_emergency_stop(reason, affected_missions)
- deactivate_emergency_stop()
- get_emergency_stop_state() / is_emergency_stop_active()
- Publishes to kratos:emergency:activated and kratos:emergency:deactivated"
```

---

### Task 2: Event Bridge — Add HUD Channels

**Files:**
- Modify: `backend/app/services/event_bridge.py`

**Context:** The event bridge already subscribes to `kratos:events`, `kratos:checkpoint`, `kratos:decision`, `kratos:heartbeat`. We need to add `kratos:emergency:*`, `kratos:approval:*`, and `kratos:hud:*` channels.

- [ ] **Step 1: Add HUD channels to subscription list**

Read `backend/app/services/event_bridge.py` and find the channel subscription configuration. Add the HUD channels:

```python
# In the subscription area, add:
HUD_CHANNELS = [
    "kratos:emergency:*",
    "kratos:approval:*",
    "kratos:hud:*",
]
```

- [ ] **Step 2: Verify existing psubscribe pattern supports new channels**

The existing code likely uses `psubscribe`. Verify the pattern covers the new channels.
If the existing channels are hardcoded, append `HUD_CHANNELS` to the list.
If using pattern subscription, verify patterns match (e.g., `kratos:*` already covers all).

Run: `cd kratos-mission-control/backend && python -c "from app.services.event_bridge import _channels_subscribed; print(_channels_subscribed)"`
Expected: List of channel patterns

- [ ] **Step 3: Add HUD event types to valid event type filter**

If there's an event type whitelist in `event_bridge.py`, add:
```python
VALID_HUD_EVENT_TYPES = {
    "emergency.activated",
    "emergency.deactivated",
    "approval.requested",
    "approval.resolved",
    "hud.snapshot.requested",
    "hud.mission.updated",
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/app/services/event_bridge.py
git commit -m "feat(hud): add HUD event channels to event bridge

- Subscribe to kratos:emergency:*, kratos:approval:*, kratos:hud:*
- Register HUD event types in valid type filter"
```

---

### Task 3: HUD Composer Service

**Files:**
- Create: `backend/app/services/hud_composer.py`

**Context:** Compose the full KratosHudSnapshot from existing collectors and services. This is the aggregation layer — no new collectors, just composition.

- [ ] **Step 1: Write the service**

```python
# backend/app/services/hud_composer.py
"""HUD Composer — aggregates data from all collectors into KratosHudSnapshot.
Reads from existing collectors. Zero new data collection.
"""
from datetime import datetime, timezone

from app.services.emergency_stop_service import get_emergency_stop_state
from app.services.operational_truth_service import build_operational_truth
from app.services.event_bridge import get_recent_events


def compose_hud_snapshot() -> dict:
    """Build the full KratosHudSnapshot from existing collectors."""
    truth = build_operational_truth()
    emergency = get_emergency_stop_state()

    # Mission card from operational truth
    alignment = truth.get("checks", {}).get("project_alignment", {})
    now_mission = _build_mission_card(alignment, truth)

    # Health panel from all checks
    health = _build_health_panel(truth)

    # Blockers from git hygiene + infrastructure
    blockers = _build_blocker_panel(truth)

    # Event timeline from event bridge
    events = _build_event_timeline()

    # Needs you now from blockers + emergency
    needs = _build_needs_you_now(blockers, emergency)

    # Latest deliveries from outputs collector (if available)
    deliveries = _build_latest_deliveries()

    return {
        "now": now_mission,
        "next": None,  # Filled by mentor decision service in future phase
        "needs_you_now": needs,
        "blockers": blockers,
        "health": health,
        "latest_deliveries": deliveries,
        "event_timeline": events,
        "emergency_stop": emergency,
    }


def _build_mission_card(alignment: dict, truth: dict) -> dict | None:
    """Extract current mission from project alignment check."""
    signals = alignment.get("signals", {})
    git_signal = signals.get("git", {})
    project = git_signal.get("project") or alignment.get("summary", "")
    if not project:
        return None

    conflicts = alignment.get("conflicts", [])
    risk = "low"
    if conflicts:
        risk = "medium" if len(conflicts) == 1 else "high"

    return {
        "mission_id": f"mission-{project.lower().replace(' ', '-')}",
        "title": project,
        "status": _map_verdict_to_status(truth.get("verdict", "unknown")),
        "priority": "P1_degraded" if risk != "low" else "P3_info",
        "progress": 0,
        "next_action": _extract_next_action(alignment),
        "risk_level": risk,
        "owner": "lucas",
        "updated_at": truth.get("timestamp", datetime.now(timezone.utc).isoformat()),
        "blockers_count": len(truth.get("checks", {}).get("git_hygiene", {}).get("repos", [])),
    }


def _build_health_panel(truth: dict) -> dict:
    """Build 7-component health from operational truth checks."""
    infra = truth.get("checks", {}).get("infrastructure_health", {}).get("signals", {})
    freshness = truth.get("checks", {}).get("data_freshness", {})

    def _component(status_str: str, detail: str = "") -> dict:
        tier = "OK"
        if status_str in ("degraded", "unknown"):
            tier = "WARN"
        elif status_str in ("critical", "error"):
            tier = "FAILED"
        return {"status": tier, "detail": detail}

    docker_sig = infra.get("docker", {})
    omnis_sig = infra.get("omnis", {})
    system_sig = infra.get("system", {})

    return {
        "mission_runtime": _component(
            truth.get("status", "unknown"),
            f"operational-truth: {truth.get('verdict', 'unknown')}",
        ),
        "bus_health": _component(
            "ok" if _check_redis_available() else "error",
            "Redis :6382",
        ),
        "memory_health": _component(
            docker_sig.get("status", "unknown"),
            f"Akasha: {_get_akasha_stats()}",
        ),
        "registry_health": _component("ok", "Skills registry (not checked in v0.11)"),
        "governance_health": _component(
            "degraded" if _has_pending_approvals() else "ok",
            "Approval pipeline",
        ),
        "lego_health": _component(
            docker_sig.get("status", "unknown"),
            f"Docker: {docker_sig.get('running', 0)}/{docker_sig.get('total', 0)}",
        ),
        "agentic_core_health": _component(
            omnis_sig.get("status", "unknown"),
            "OMNIS crews",
        ),
    }


def _build_blocker_panel(truth: dict) -> dict:
    """Extract blockers from git hygiene and infrastructure."""
    blockers = []
    git_hygiene = truth.get("checks", {}).get("git_hygiene", {})
    infra = truth.get("checks", {}).get("infrastructure_health", {})

    # Git hygiene blockers
    for repo in git_hygiene.get("repos", []):
        blockers.append({
            "blocker_id": f"git-{repo.get('name', 'unknown')}",
            "severity": "warning" if repo.get("dirty_files", 0) < 10 else "blocking",
            "source": "git",
            "title": f"{repo.get('name')}: {repo.get('dirty_files')} arquivos pendentes",
            "description": f"Branch {repo.get('branch')} com alterações não commitadas",
            "recommended_action": "Commit ou stash as alterações",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Infrastructure issues
    for issue in infra.get("issues", []):
        blockers.append({
            "blocker_id": f"infra-{issue[:8]}",
            "severity": "blocking" if "critico" in issue.lower() else "warning",
            "source": "infrastructure",
            "title": issue,
            "description": issue,
            "recommended_action": "Verificar saúde dos containers",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    blocking_count = sum(1 for b in blockers if b["severity"] == "blocking")
    return {
        "blockers": blockers[:10],
        "blocking_count": blocking_count,
        "total_count": len(blockers),
    }


def _build_needs_you_now(blockers: dict, emergency: dict) -> dict:
    """Derive NeedsYouNow from blockers and emergency state."""
    items = []

    if emergency.get("enabled"):
        items.append({
            "id": "emergency-stop",
            "type": "emergency_alert",
            "title": f"EMERGENCY: {emergency.get('reason', 'Unknown')}",
            "priority": "P0_critical",
            "created_at": emergency.get("activated_at", ""),
        })

    for b in blockers.get("blockers", []):
        if b["severity"] == "blocking":
            items.append({
                "id": b["blocker_id"],
                "type": "blocker",
                "title": b["title"],
                "priority": "P0_critical",
                "mission_id": None,
                "created_at": b["created_at"],
            })

    return {
        "approvals": [],
        "blockers": [i for i in items if i["type"] == "blocker"],
        "critical_decisions": [],
        "emergency_alerts": [i for i in items if i["type"] == "emergency_alert"],
    }


def _build_event_timeline() -> dict:
    """Get recent events from event bridge ring buffer."""
    try:
        events = get_recent_events(limit=50)
        entries = []
        for evt in events:
            entries.append({
                "event_type": evt.get("event_type", "unknown"),
                "timestamp": evt.get("timestamp", ""),
                "actor": evt.get("source", {}).get("service", "unknown"),
                "status": evt.get("status", "ok"),
                "decision_chain": evt.get("decision_chain", []),
                "artifact_link": evt.get("payload", {}).get("artifact_link"),
            })
        timestamps = [e["timestamp"] for e in entries if e["timestamp"]]
        return {
            "entries": entries,
            "oldest": min(timestamps) if timestamps else None,
            "newest": max(timestamps) if timestamps else None,
            "collapsed_by_default": True,
        }
    except Exception:
        return {"entries": [], "oldest": None, "newest": None, "collapsed_by_default": True}


def _build_latest_deliveries() -> list:
    """Get recent outputs from outputs collector."""
    try:
        from app.collectors.outputs_collector import collect_outputs
        outputs = collect_outputs()
        if outputs.get("source") == "real":
            return [
                {
                    "id": o.get("id", f"out-{i}"),
                    "title": o.get("title", "Output"),
                    "type": o.get("type", "unknown"),
                    "delivered_at": o.get("created_at", ""),
                    "source": "omnis",
                }
                for i, o in enumerate(outputs.get("data", [])[:5])
            ]
    except Exception:
        pass
    return []


def _map_verdict_to_status(verdict: str) -> str:
    mapping = {
        "consistent": "executing",
        "mostly_consistent": "executing",
        "degraded": "degraded",
        "conflict": "waiting_approval",
        "unknown": "observing",
    }
    return mapping.get(verdict, "idle")


def _extract_next_action(alignment: dict) -> str:
    conflicts = alignment.get("conflicts", [])
    if conflicts:
        return f"Resolver: {conflicts[0].get('message', 'conflito detectado')}"
    return "Continuar missão atual"


def _check_redis_available() -> bool:
    try:
        import redis
        r = redis.Redis(host="127.0.0.1", port=6382, socket_connect_timeout=1)
        r.ping()
        return True
    except Exception:
        return False


def _get_akasha_stats() -> str:
    try:
        from app.collectors.akasha_collector import collect_akasha_status
        status = collect_akasha_status()
        if status.get("source") == "real":
            return "Akasha online"
    except Exception:
        pass
    return "Akasha status unknown"


def _has_pending_approvals() -> bool:
    try:
        from app.collectors.outputs_collector import collect_outputs
        outputs = collect_outputs()
        pending = [o for o in outputs.get("data", []) if o.get("status") == "needs_review"]
        return len(pending) > 0
    except Exception:
        return False
```

- [ ] **Step 2: Verify it imports cleanly**

Run: `cd kratos-mission-control/backend && python -c "from app.services.hud_composer import compose_hud_snapshot; print('OK')"`
Expected: OK (no import errors)

- [ ] **Step 3: Commit**

```bash
git add backend/app/services/hud_composer.py
git commit -m "feat(hud): add HUD composer service

Composes KratosHudSnapshot from existing collectors:
- MissionCard from operational-truth project_alignment
- HealthPanel from infrastructure_health + akasha + redis
- BlockerPanel from git_hygiene + infra issues
- EventTimeline from event_bridge ring buffer
- NeedsYouNow from blockers + emergency stop
- EmergencyStop from emergency_stop_service"
```

---

### Task 4: HUD Snapshot Route

**Files:**
- Create: `backend/app/routes/hud.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_hud_snapshot.py`

- [ ] **Step 1: Write the failing test**

```python
# backend/tests/test_hud_snapshot.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_hud_snapshot_returns_200():
    response = client.get("/hud/snapshot")
    assert response.status_code == 200

def test_hud_snapshot_has_required_fields():
    response = client.get("/hud/snapshot")
    data = response.json()
    assert "now" in data
    assert "next" in data
    assert "needs_you_now" in data
    assert "blockers" in data
    assert "health" in data
    assert "latest_deliveries" in data
    assert "event_timeline" in data
    assert "emergency_stop" in data

def test_hud_snapshot_emergency_stop_is_false_by_default():
    response = client.get("/hud/snapshot")
    data = response.json()
    assert data["emergency_stop"]["enabled"] is False

def test_hud_snapshot_health_has_7_components():
    response = client.get("/hud/snapshot")
    health = response.json()["health"]
    assert "mission_runtime" in health
    assert "bus_health" in health
    assert "memory_health" in health
    assert "registry_health" in health
    assert "governance_health" in health
    assert "lego_health" in health
    assert "agentic_core_health" in health

def test_hud_snapshot_event_timeline_collapsed_by_default():
    response = client.get("/hud/snapshot")
    timeline = response.json()["event_timeline"]
    assert timeline.get("collapsed_by_default", False) is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd kratos-mission-control/backend && python -m pytest tests/test_hud_snapshot.py -v`
Expected: FAIL — 404 or 500

- [ ] **Step 3: Write the route**

```python
# backend/app/routes/hud.py
"""KRATOS HUD endpoint — single snapshot for the entire HUD layer."""
from fastapi import APIRouter
from app.services.hud_composer import compose_hud_snapshot

router = APIRouter(tags=["hud"])


@router.get("/hud/snapshot")
def hud_snapshot():
    """Compose the full KratosHudSnapshot from all collectors.
    
    This is the single endpoint the HUD frontend polls.
    Returns all 8 HUD artifacts in one response.
    """
    return compose_hud_snapshot()
```

- [ ] **Step 4: Register route in main.py**

In `backend/app/main.py`, find the router registration section and add:
```python
from app.routes import hud

app.include_router(hud.router)
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd kratos-mission-control/backend && python -m pytest tests/test_hud_snapshot.py -v`
Expected: 5 PASS

- [ ] **Step 6: Commit**

```bash
git add backend/app/routes/hud.py backend/app/main.py backend/tests/test_hud_snapshot.py
git commit -m "feat(hud): add GET /hud/snapshot endpoint

Single endpoint composing the full KratosHudSnapshot:
- now, next, needs_you_now, blockers, health
- latest_deliveries, event_timeline, emergency_stop
All data from existing collectors. Zero new data collection."
```

---

### Task 5: Enrich SSE with HUD Data

**Files:**
- Modify: `backend/app/services/live_event_service.py`

**Context:** The existing SSE `/live/stream` already pushes operational-truth every 5s. We need to add the HUD snapshot to the SSE stream so the frontend gets a complete HUD payload without a separate fetch.

- [ ] **Step 1: Read the existing SSE event service**

Read `backend/app/services/live_event_service.py` to understand the current event structure. Identify where events are composed and where to inject the HUD snapshot.

- [ ] **Step 2: Add HUD snapshot to SSE event stream**

```python
# In the SSE event generator, add a hud event type:
from app.services.hud_composer import compose_hud_snapshot

# Inside the event loop, after the existing snapshot event:
hud_data = compose_hud_snapshot()
yield {
    "event": "hud",
    "data": json.dumps(hud_data),
}
```

- [ ] **Step 3: Verify SSE stream includes HUD events**

Run: `cd kratos-mission-control/backend && curl -N http://localhost:8000/live/stream` (manual check — kill after 5s)
Expected: Both `event: snapshot` and `event: hud` lines in the stream

- [ ] **Step 4: Commit**

```bash
git add backend/app/services/live_event_service.py
git commit -m "feat(hud): add HUD snapshot to SSE live stream

New event type: 'hud' — contains full KratosHudSnapshot
Pushed alongside existing 'snapshot' event every 5s"
```

---

### Task 6: Approval Push Wiring (ARGOS → Redis → HUD)

**Files:**
- Modify: `backend/app/routes/approvals.py`
- Modify: `backend/app/services/approval_service.py`

**Context:** The ARGOS MCP has `argos_approval_queue` that returns pending approvals. We need to poll this (or receive push events) and publish to `kratos:approval:*` Redis channels that the event bridge already subscribes to.

- [ ] **Step 1: Read existing approval route and service**

Read `backend/app/routes/approvals.py` and `backend/app/services/approval_service.py`.

- [ ] **Step 2: Add approval event publishing**

```python
# In approval_service.py or a new function:
import json
import redis

def publish_approval_event(approval: dict, event_type: str):
    """Publish approval event to Redis for HUD consumption."""
    try:
        r = redis.Redis(host="127.0.0.1", port=6382)
        envelope = {
            "event_id": f"evt-{approval.get('id', 'unknown')}",
            "event_type": f"approval.{event_type}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": {"service": "kratos-mission-control", "version": "0.12.0"},
            "payload": approval,
            "severity": "warning",
            "status": "pending",
        }
        r.publish("kratos:approval:requested", json.dumps(envelope))
    except Exception:
        pass
```

- [ ] **Step 3: Wire to approval route**

In `approvals.py`, after processing an approval status change, call `publish_approval_event()`.

- [ ] **Step 4: Verify events reach event bridge**

Run: `cd kratos-mission-control/backend && python -c "
from app.services.approval_service import publish_approval_event
publish_approval_event({'id': 'test-1', 'action': 'test'}, 'requested')
from app.services.event_bridge import get_recent_events
events = get_recent_events(limit=5)
print([e.get('event_type') for e in events])
"`
Expected: 'approval.requested' in the list

- [ ] **Step 5: Commit**

```bash
git add backend/app/routes/approvals.py backend/app/services/approval_service.py
git commit -m "feat(hud): wire approval events to Redis for HUD

Publishes approval.requested and approval.resolved events
to kratos:approval:* Redis channels
Consumed by event_bridge → HUD EventTimeline + NeedsYouNow"
```

---

## Final Verification

- [ ] All tests pass: `cd kratos-mission-control/backend && python -m pytest tests/test_hud_snapshot.py tests/test_emergency_stop.py -v`
- [ ] `GET /hud/snapshot` returns 200 with all 8 artifacts
- [ ] SSE stream includes `event: hud`
- [ ] Emergency stop state persists across restarts (Redis GET `kratos:emergency_stop`)
- [ ] Event bridge receives approval events
- [ ] `git status` shows only intentional changes

## Post-ABA 7 State

After ABA 7 completes:
- **P0 gaps resolved:** Emergency stop state (Task 1), Approval push (Task 6)
- **P1 gaps resolved:** HUD snapshot endpoint (Task 3-4), SSE enrichment (Task 5)
- **Ready for ABA 8:** Frontend HUD implementation can now consume `GET /hud/snapshot` and `event: hud` from SSE

**Do NOT:** Start ABA 8 frontend implementation until ABA 7 is verified and tests pass.
