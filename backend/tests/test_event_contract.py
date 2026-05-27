"""Event contract tests — validate envelope schema and event_bridge behavior."""
import json
import pytest


# ── Contract constants ──────────────────────────────────────────────────

REQUIRED_ENVELOPE_FIELDS = {"event_id", "event_type", "timestamp", "source", "severity", "status", "payload"}
REQUIRED_SOURCE_FIELDS = {"service", "version"}
VALID_SEVERITIES = {"debug", "info", "warn", "error", "critical"}
VALID_STATUSES = {"ok", "degraded", "failed", "pending"}
VALID_CHANNELS = {"system:heartbeat", "mission:events", "memory:events", "risk:events", "omnis:events"}
KNOWN_EVENT_TYPES = {
    "system.heartbeat", "mission.started", "mission.completed", "mission.failed",
    "memory.ingested", "memory.queried", "memory.indexed",
    "risk.detected", "risk.resolved",
    "runtime.heartbeat", "skill.executed", "content.published", "knowledge.updated",
}


def make_valid_envelope(event_type="system.heartbeat", **overrides):
    import uuid
    from datetime import datetime, timezone

    envelope = {
        "event_id": f"evt-{uuid.uuid4().hex[:8]}",
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": {
            "service": "kratos-mission-control",
            "version": "0.12.0",
            "instance": "kratos-backend",
        },
        "correlation_id": f"corr-{uuid.uuid4().hex[:8]}",
        "mission_id": None,
        "severity": "info",
        "status": "ok",
        "payload": {},
    }
    envelope.update(overrides)
    return envelope


# ── Envelope validation ────────────────────────────────────────────────

def validate_envelope(event: dict) -> list[str]:
    errors = []
    missing = REQUIRED_ENVELOPE_FIELDS - set(event.keys())
    if missing:
        errors.append(f"Missing required fields: {sorted(missing)}")
    if event.get("severity") not in VALID_SEVERITIES:
        errors.append(f"Invalid severity: {event.get('severity')}")
    if event.get("status") not in VALID_STATUSES:
        errors.append(f"Invalid status: {event.get('status')}")
    src = event.get("source", {})
    if not isinstance(src, dict):
        errors.append("source must be a dict")
    else:
        missing_src = REQUIRED_SOURCE_FIELDS - set(src.keys())
        if missing_src:
            errors.append(f"Missing source fields: {sorted(missing_src)}")
    if event.get("event_type") not in KNOWN_EVENT_TYPES:
        errors.append(f"Unknown event_type: {event.get('event_type')} (not in known catalog)")
    return errors


class TestEventEnvelopeContract:
    """Validates the standard event envelope schema."""

    def test_valid_envelope_passes_validation(self):
        envelope = make_valid_envelope()
        errors = validate_envelope(envelope)
        assert errors == [], f"Valid envelope should have no errors: {errors}"

    def test_missing_event_id_fails(self):
        envelope = make_valid_envelope()
        del envelope["event_id"]
        errors = validate_envelope(envelope)
        assert any("event_id" in e for e in errors)

    def test_missing_event_type_fails(self):
        envelope = make_valid_envelope()
        del envelope["event_type"]
        errors = validate_envelope(envelope)
        assert any("event_type" in e for e in errors)

    def test_missing_timestamp_fails(self):
        envelope = make_valid_envelope()
        del envelope["timestamp"]
        errors = validate_envelope(envelope)
        assert any("timestamp" in e for e in errors)

    def test_missing_source_fails(self):
        envelope = make_valid_envelope()
        del envelope["source"]
        errors = validate_envelope(envelope)
        assert any("source" in e for e in errors)

    def test_source_missing_service_fails(self):
        envelope = make_valid_envelope()
        envelope["source"] = {"version": "1.0"}
        errors = validate_envelope(envelope)
        assert any("service" in e for e in errors)

    def test_source_missing_version_fails(self):
        envelope = make_valid_envelope()
        envelope["source"] = {"service": "kratos"}
        errors = validate_envelope(envelope)
        assert any("version" in e for e in errors)

    def test_invalid_severity_fails(self):
        envelope = make_valid_envelope(severity="catastrophic")
        errors = validate_envelope(envelope)
        assert any("severity" in e for e in errors)

    def test_invalid_status_fails(self):
        envelope = make_valid_envelope(status="unknown")
        errors = validate_envelope(envelope)
        assert any("status" in e for e in errors)

    def test_unknown_event_type_warns(self):
        envelope = make_valid_envelope(event_type="custom.thing")
        errors = validate_envelope(envelope)
        assert any("event_type" in e for e in errors)

    def test_all_known_event_types_pass_severity(self):
        for etype in KNOWN_EVENT_TYPES:
            envelope = make_valid_envelope(event_type=etype)
            errors = validate_envelope(envelope)
            assert errors == [], f"{etype} should validate: {errors}"

    def test_envelope_is_valid_json(self):
        envelope = make_valid_envelope()
        serialized = json.dumps(envelope, ensure_ascii=False)
        parsed = json.loads(serialized)
        assert parsed == envelope

    def test_event_id_format(self):
        envelope = make_valid_envelope()
        assert envelope["event_id"].startswith("evt-")
        assert len(envelope["event_id"]) == 12  # evt- + 8 hex

    def test_all_severities_pass(self):
        for sev in VALID_SEVERITIES:
            envelope = make_valid_envelope(severity=sev)
            errors = validate_envelope(envelope)
            assert errors == [], f"Severity {sev} should validate"


class TestEventBridgeMakeEnvelope:
    """Validates the actual event_bridge._make_envelope produces valid contracts."""

    def test_make_envelope_produces_valid_contract(self):
        from app.services.event_bridge import _make_envelope

        envelope = _make_envelope("system.heartbeat", {"status": "healthy"})
        errors = validate_envelope(envelope)
        assert errors == [], f"_make_envelope should produce valid contract: {errors}"

    def test_make_envelope_includes_source(self):
        from app.services.event_bridge import _make_envelope

        envelope = _make_envelope("test.event", {})
        assert envelope["source"]["service"] == "kratos-mission-control"
        assert envelope["source"]["version"] == "0.12.0"

    def test_make_envelope_includes_trace_id_when_provided(self):
        from app.services.event_bridge import _make_envelope

        envelope = _make_envelope("test.event", {}, trace_id="trace-123")
        assert envelope["trace_id"] == "trace-123"

    def test_make_envelope_unique_event_ids(self):
        from app.services.event_bridge import _make_envelope

        ids = {_make_envelope("test.event", {})["event_id"] for _ in range(20)}
        assert len(ids) == 20, "All event IDs must be unique"


class TestEventBridgeRingBuffer:
    """Validates ring buffer behavior."""

    def test_maxlen_enforced(self):
        from collections import deque

        ring = deque(maxlen=5)
        for i in range(10):
            ring.append({"event_id": f"evt-{i}"})
        assert len(ring) == 5
        assert ring[0]["event_id"] == "evt-5"

    def test_get_recent_events_filters_by_type(self):
        from app.services.event_bridge import _ring

        _ring.clear()
        _ring.append({"event_type": "test.a", "event_id": "evt-1"})
        _ring.append({"event_type": "test.b", "event_id": "evt-2"})
        _ring.append({"event_type": "test.a", "event_id": "evt-3"})

        from app.services.event_bridge import get_recent_events
        filtered = get_recent_events(event_type="test.a")
        assert len(filtered) == 2
        assert all(e["event_type"] == "test.a" for e in filtered)

    def test_get_recent_events_filters_by_source(self):
        from app.services.event_bridge import _ring

        _ring.clear()
        _ring.append({"event_type": "x", "source": {"service": "s1"}})
        _ring.append({"event_type": "x", "source": {"service": "s2"}})

        from app.services.event_bridge import get_recent_events
        filtered = get_recent_events(source="s1")
        assert len(filtered) == 1
        assert filtered[0]["source"]["service"] == "s1"


class TestChannelNaming:
    """Validates channel naming convention."""

    def test_all_channels_match_convention(self):
        for channel in VALID_CHANNELS:
            assert ":" in channel, f"Channel {channel} must use domain:subdomain format"
            domain, subdomain = channel.split(":", 1)
            assert domain, f"Channel {channel} has empty domain"
            assert subdomain, f"Channel {channel} has empty subdomain"

    def test_heartbeat_channel(self):
        assert "system:heartbeat" in VALID_CHANNELS

    def test_mission_channel(self):
        assert "mission:events" in VALID_CHANNELS

    def test_memory_channel(self):
        assert "memory:events" in VALID_CHANNELS

    def test_risk_channel(self):
        assert "risk:events" in VALID_CHANNELS
