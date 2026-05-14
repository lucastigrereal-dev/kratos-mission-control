"""Tests for Phase 0.8C — Auto Checkpoint Suggestion Engine."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db, get_db, now_iso
from app.services.checkpoint_suggestion_service import (
    build_checkpoint_suggestion,
    _check_cooldown,
    _decide_suggestion,
    COOLDOWN_MEDIUM_MINUTES,
    COOLDOWN_HIGH_MINUTES,
    COOLDOWN_DEFAULT_MINUTES,
)

client = TestClient(app)


def setup_module():
    init_db()


# ── Unit: build_checkpoint_suggestion() ────────────────────────────────────────


def test_on_focus_never_suggests():
    drift = {"state": "on_focus", "severity": "none", "minutes_out_of_focus": 0}
    result = build_checkpoint_suggestion(drift=drift)
    assert result["should_suggest"] is False
    assert result["severity"] == "none"
    assert result["suggested_checkpoint"] is None


def test_off_focus_low_no_suggestion():
    drift = {"state": "off_focus", "severity": "low", "minutes_out_of_focus": 3}
    result = build_checkpoint_suggestion(drift=drift)
    assert result["should_suggest"] is False
    assert "leve" in result["reason"].lower() or "alerta" in result["reason"].lower()


def test_off_focus_medium_suggests_checkpoint():
    drift = {"state": "off_focus", "severity": "medium", "minutes_out_of_focus": 10}
    result = build_checkpoint_suggestion(drift=drift)
    assert result["should_suggest"] is True
    assert result["severity"] == "medium"
    assert result["suggested_checkpoint"] is not None
    assert "project" in result["suggested_checkpoint"]


def test_off_focus_high_suggests_checkpoint():
    drift = {"state": "off_focus", "severity": "high", "minutes_out_of_focus": 20}
    result = build_checkpoint_suggestion(drift=drift)
    assert result["should_suggest"] is True
    assert result["severity"] == "high"
    assert result["suggested_checkpoint"] is not None
    assert result["trigger"]["type"] == "off_focus"


def test_related_with_recent_checkpoint_no_suggestion():
    drift = {"state": "related", "severity": "none", "minutes_out_of_focus": 0}
    last_cp = {"id": "cp-1", "created_at": (datetime.now(timezone.utc) - timedelta(minutes=5)).isoformat()}
    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=last_cp)
    assert result["should_suggest"] is False


def test_related_no_checkpoint_long_duration_suggests():
    drift = {
        "state": "related",
        "severity": "none",
        "minutes_out_of_focus": 0,
        "expected_project": "kratos",
    }
    context = {
        "duration_seconds": 50 * 60,  # 50 min
        "current_app": "Code.exe",
        "current_title": "some-related-project — VS Code",
        "project_guess": "kratos",
        "confidence": 0.7,
    }
    result = build_checkpoint_suggestion(drift=drift, context=context)
    assert result["should_suggest"] is True
    assert result["severity"] == "low"


def test_unknown_with_checkpoint_no_suggestion():
    drift = {"state": "unknown", "severity": "none", "minutes_out_of_focus": 0}
    last_cp = {"id": "cp-1", "created_at": datetime.now(timezone.utc).isoformat()}
    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=last_cp)
    assert result["should_suggest"] is False


def test_unknown_no_checkpoint_suggests():
    drift = {"state": "unknown", "severity": "none", "minutes_out_of_focus": 0}
    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=None)
    assert result["should_suggest"] is True
    assert result["severity"] == "low"


# ── Unit: cooldown logic ───────────────────────────────────────────────────────


def test_cooldown_active_blocks_suggestion():
    drift = {"state": "off_focus", "severity": "high", "minutes_out_of_focus": 20}
    now = datetime.now(timezone.utc)
    last_cp = {"id": "cp-1", "created_at": (now - timedelta(minutes=3)).isoformat()}

    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=last_cp, now=now)
    assert result["should_suggest"] is False
    assert result["cooldown"]["active"] is True
    assert "cooldown" in result["reason"].lower()


def test_cooldown_expired_allows_suggestion():
    drift = {"state": "off_focus", "severity": "medium", "minutes_out_of_focus": 10}
    now = datetime.now(timezone.utc)
    last_cp = {"id": "cp-1", "created_at": (now - timedelta(minutes=COOLDOWN_MEDIUM_MINUTES + 5)).isoformat()}

    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=last_cp, now=now)
    assert result["cooldown"]["active"] is False


def test_cooldown_shorter_for_high_severity():
    """High severity = shorter cooldown (10min) so user can be reminded sooner."""
    drift = {"state": "off_focus", "severity": "high", "minutes_out_of_focus": 25}
    now = datetime.now(timezone.utc)
    # 12 min ago — would be in cooldown for default (20min) but NOT for high (10min)
    last_cp = {"id": "cp-1", "created_at": (now - timedelta(minutes=12)).isoformat()}

    result = build_checkpoint_suggestion(drift=drift, last_checkpoint=last_cp, now=now)
    assert result["cooldown"]["active"] is False
    assert result["should_suggest"] is True


def test_cooldown_no_checkpoint_returns_no_cooldown():
    result = _check_cooldown(None, "off_focus", "high", datetime.now(timezone.utc))
    assert result["active"] is False


def test_cooldown_invalid_date_handled():
    result = _check_cooldown(
        {"id": "cp-1", "created_at": "not-a-date"},
        "off_focus",
        "high",
        datetime.now(timezone.utc),
    )
    assert result["active"] is False


# ── Unit: suggested_checkpoint payload ─────────────────────────────────────────


def test_suggested_checkpoint_has_required_fields():
    drift = {
        "state": "off_focus",
        "severity": "medium",
        "minutes_out_of_focus": 12,
        "expected_project": "kratos-mission-control",
    }
    context = {
        "current_app": "Firefox.exe",
        "current_title": "YouTube — Videos",
        "project_guess": "kratos-mission-control",
        "mission_guess": "Fase 0.8C",
        "confidence": 0.75,
    }
    result = build_checkpoint_suggestion(drift=drift, context=context)
    sc = result["suggested_checkpoint"]
    assert "project" in sc
    assert "mission" in sc
    assert "where_i_stopped" in sc
    assert "next_action" in sc
    assert "resume_hint" in sc
    assert "confidence" in sc
    assert sc["project"] == "kratos-mission-control"


def test_suggested_checkpoint_infers_next_action_from_terminal():
    drift = {
        "state": "off_focus",
        "severity": "medium",
        "minutes_out_of_focus": 8,
        "expected_project": "daily-prophet",
    }
    context = {
        "current_app": "WindowsTerminal.exe",
        "current_title": "daily-prophet — Terminal",
        "project_guess": "daily-prophet",
        "confidence": 0.8,
    }
    result = build_checkpoint_suggestion(drift=drift, context=context)
    assert "teste" in result["suggested_checkpoint"]["next_action"].lower() or \
           "comando" in result["suggested_checkpoint"]["next_action"].lower()


# ── Unit: exception safety ─────────────────────────────────────────────────────


def test_build_checkpoint_suggestion_never_raises():
    """Passing garbage should return no_suggestion, not raise."""
    result = build_checkpoint_suggestion(context=None, drift=None, last_checkpoint=None)
    assert isinstance(result, dict)
    assert "should_suggest" in result
    assert result["should_suggest"] is False
    assert result["severity"] == "none"


# ── Endpoint integration: /context/current ─────────────────────────────────────


def test_context_current_has_checkpoint_suggestion():
    resp = client.get("/context/current")
    assert resp.status_code == 200
    data = resp.json()
    assert "checkpoint_suggestion" in data
    cs = data["checkpoint_suggestion"]
    assert "should_suggest" in cs
    assert "severity" in cs
    assert "reason" in cs
    assert "trigger" in cs
    assert "suggested_checkpoint" in cs
    assert "cooldown" in cs


def test_context_current_checkpoint_suggestion_cooldown_has_keys():
    resp = client.get("/context/current")
    cs = resp.json()["checkpoint_suggestion"]
    cd = cs["cooldown"]
    assert "active" in cd
    assert "remaining_minutes" in cd
    assert isinstance(cd["active"], bool)
    assert isinstance(cd["remaining_minutes"], int)


# ── Endpoint integration: /mission/lens ────────────────────────────────────────


def test_mission_lens_has_checkpoint_suggestion():
    resp = client.get("/mission/lens")
    assert resp.status_code == 200
    data = resp.json()
    assert "data" in data
    assert "checkpoint_suggestion" in data["data"]
    cs = data["data"]["checkpoint_suggestion"]
    assert "should_suggest" in cs
    assert "reason" in cs


# ── Endpoint integration: /live/snapshot ───────────────────────────────────────


def test_live_snapshot_still_200_with_checkpoint_suggestion():
    resp = client.get("/live/snapshot")
    assert resp.status_code == 200
    data = resp.json()
    assert "_live_meta" in data
    assert "context" in data
    assert "mission_lens" in data


def test_live_snapshot_mission_lens_has_checkpoint_suggestion():
    resp = client.get("/live/snapshot")
    data = resp.json()
    ml = data.get("mission_lens", {})
    if ml and "data" in ml:
        assert "checkpoint_suggestion" in ml["data"]


# ── No sensitive data leak ─────────────────────────────────────────────────────


def test_checkpoint_suggestion_no_sensitive_data():
    """Suggested checkpoint must not contain raw tokens/secrets."""
    resp = client.get("/context/current")
    data = resp.json()
    cs = data.get("checkpoint_suggestion", {})
    sc = cs.get("suggested_checkpoint")
    if sc:
        sc_str = str(sc)
        forbidden = ["Bearer", "sk-", "ghp_", "xoxb-", "token", "secret", "password"]
        for pattern in forbidden:
            assert pattern not in sc_str.lower(), f"Found '{pattern}' in suggested_checkpoint"


# ── Phase 0.8B backward compat preserved ───────────────────────────────────────


def test_context_current_still_has_drift():
    resp = client.get("/context/current")
    assert resp.status_code == 200
    data = resp.json()
    assert "drift" in data
    assert "state" in data["drift"]


def test_context_current_still_has_backward_compat():
    resp = client.get("/context/current")
    data = resp.json()
    assert "on_focus" in data
    assert "project_guess" in data
    assert "confidence" in data
    assert "drift_minutes" in data


# ── Phase 0.8C required fields: source, collector_status ────────────────────────


def test_context_current_has_source():
    resp = client.get("/context/current")
    assert resp.status_code == 200
    data = resp.json()
    assert "source" in data, "Missing 'source' field in /context/current"
    assert data["source"] in ("real", "fallback", "mock")


def test_context_current_has_collector_status():
    resp = client.get("/context/current")
    assert resp.status_code == 200
    data = resp.json()
    assert "collector_status" in data, "Missing 'collector_status' field in /context/current"
    assert isinstance(data["collector_status"], str)
    assert len(data["collector_status"]) > 0


def test_context_current_full_contract():
    """Verify /context/current returns all 0.8C required top-level fields."""
    resp = client.get("/context/current")
    assert resp.status_code == 200
    data = resp.json()

    required = [
        "current_app", "current_title", "project_guess",
        "on_focus", "confidence", "drift_minutes",
        "drift", "checkpoint_suggestion",
        "source", "collector_status",
    ]
    for field in required:
        assert field in data, f"Missing required field '{field}' in /context/current"
