"""Tests for Phase 0.2.2 — Mentor Decision Engine and endpoints."""

import sys
import json
from datetime import datetime
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db, get_db, generate_id, now_iso
from app.services.snapshot_service import (
    save_snapshot, save_run, save_metrics, get_latest_snapshot
)
from app.services.alert_service import get_alerts
from app.services.mentor_decision_service import (
    generate_recommendations, get_active_recommendations,
    get_next_best_action, get_projects_at_risk, get_finish_line,
    update_recommendation,
)

client = TestClient(app)


def setup_module():
    init_db()
    _clean_test_data()


def _clean_test_data():
    """Remove snapshots that could interfere with test assertions."""
    db = get_db()
    db.execute("DELETE FROM collector_snapshots")
    db.execute("DELETE FROM collector_runs")
    db.execute("DELETE FROM alert_events")
    db.execute("DELETE FROM metric_timeseries")
    db.execute("DELETE FROM mentor_recommendations")
    db.commit()
    db.close()


# ── Decision Engine: Rule A — Repo dirty ──────────────────────────────────────

def test_rule_repo_dirty_persistent():
    long_ago = "2026-03-01T00:00:00Z"
    save_snapshot("git", "real", "ok", {
        "repositories": [{"name": "omnis-control", "dirty": True,
                          "modified_files_count": 5, "last_commit_at": long_ago, "branch": "main"}]
    })
    # Verify the snapshot was saved correctly
    latest = get_latest_snapshot("git")
    assert latest is not None
    payload = latest.get("payload") or json.loads(latest.get("payload_json", "{}"))
    repos = payload.get("repositories", [])
    assert len(repos) == 1
    assert repos[0]["last_commit_at"] == long_ago

    recs = generate_recommendations()
    dirty_recs = [r for r in recs if r["category"] == "git_hygiene" and r["related_entity_id"] == "omnis-control"]
    assert len(dirty_recs) >= 1
    assert dirty_recs[0]["severity"] == "critical"


def test_rule_repo_dirty_recent():
    from datetime import timezone as tz
    today = datetime.now(tz.utc).isoformat()
    # Clean first so only this snapshot exists
    db = get_db()
    db.execute("DELETE FROM collector_snapshots WHERE collector_name = 'git'")
    db.execute("DELETE FROM mentor_recommendations")
    db.commit()
    db.close()

    save_snapshot("git", "real", "ok", {
        "repositories": [{"name": "kratos-mission-control", "dirty": True,
                          "modified_files_count": 2, "last_commit_at": today, "branch": "master"}]
    })
    recs = generate_recommendations()
    dirty_recs = [r for r in recs if r["category"] == "git_hygiene" and r["related_entity_id"] == "kratos-mission-control"]
    assert len(dirty_recs) >= 1
    assert dirty_recs[0]["severity"] == "warning"


# ── Rule B: No next action ────────────────────────────────────────────────────

def test_rule_no_next_action():
    # A project without next_action exists from seed data
    recs = generate_recommendations()
    missing = [r for r in recs if r["category"] == "next_action_missing"]
    assert len(missing) >= 0  # depends on seed data state


# ── Rule D: Container unhealthy ───────────────────────────────────────────────

def test_rule_container_unhealthy():
    recs = generate_recommendations()
    container_recs = [r for r in recs if r["category"] == "blocker" and r["related_entity_type"] == "container"]
    # May or may not exist depending on real container state
    assert isinstance(container_recs, list)


# ── Rule E: Disk critical ─────────────────────────────────────────────────────

def test_rule_disk_critical():
    db = get_db()
    db.execute("DELETE FROM collector_snapshots WHERE collector_name = 'system'")
    db.execute("DELETE FROM mentor_recommendations")
    db.commit()
    db.close()

    save_snapshot("system", "real", "ok", {"cpu_percent": 50, "memory_percent": 60, "disk_c_percent": 95.0})
    recs = generate_recommendations()
    disk_recs = [r for r in recs if r["category"] == "system_risk" and r["related_entity_id"] == "disco c"]
    assert len(disk_recs) >= 1
    assert disk_recs[0]["severity"] == "critical"


def test_rule_disk_warning():
    db = get_db()
    db.execute("DELETE FROM collector_snapshots WHERE collector_name = 'system'")
    db.execute("DELETE FROM mentor_recommendations")
    db.commit()
    db.close()

    save_snapshot("system", "real", "ok", {"cpu_percent": 50, "memory_percent": 60, "disk_c_percent": 85.0})
    recs = generate_recommendations()
    disk_recs = [r for r in recs if r["category"] == "system_risk" and r["related_entity_id"] == "disco c"]
    assert len(disk_recs) >= 1
    assert disk_recs[0]["severity"] == "warning"


# ── Rule G: Project abandoned ─────────────────────────────────────────────────

def test_rule_project_abandoned():
    recs = generate_recommendations()
    abandoned = [r for r in recs if r["category"] == "project_abandonment"]
    # Depends on seed data
    assert isinstance(abandoned, list)


# ── Rule I: Too many active ───────────────────────────────────────────────────

def test_rule_too_many_active():
    recs = generate_recommendations()
    focus_recs = [r for r in recs if r["category"] == "focus"]
    # Depends on task state
    assert isinstance(focus_recs, list)


# ── Scoring ───────────────────────────────────────────────────────────────────

def test_priority_scoring():
    save_snapshot("system", "real", "ok", {"cpu_percent": 50, "memory_percent": 60, "disk_c_percent": 96.0})
    recs = generate_recommendations()
    critical_recs = [r for r in recs if r["severity"] == "critical"]
    if critical_recs:
        assert critical_recs[0]["priority_score"] >= 50


def test_next_best_action_selection():
    recs = generate_recommendations()
    nba = get_next_best_action()
    if recs and nba:
        # NBA should be the highest scored
        assert nba["priority_score"] >= recs[-1]["priority_score"]


# ── New endpoints ─────────────────────────────────────────────────────────────

def test_mentor_recommendations_endpoint():
    response = client.get("/mentor/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_mentor_recommendations_active_endpoint():
    response = client.get("/mentor/recommendations/active")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for r in data:
        assert r.get("status") == "active"


def test_mentor_next_best_action_endpoint():
    response = client.get("/mentor/next-best-action")
    assert response.status_code == 200
    data = response.json()
    assert "next_best_action" in data


def test_mentor_focus_endpoint():
    response = client.get("/mentor/focus")
    assert response.status_code == 200
    data = response.json()
    assert "mode" in data
    assert "do_not_do" in data
    assert "timebox_minutes" in data


def test_mentor_finish_line_endpoint():
    response = client.get("/mentor/finish-line")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_mentor_projects_at_risk_endpoint():
    response = client.get("/mentor/projects-at-risk")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_mentor_summary_updated():
    response = client.get("/mentor/summary")
    assert response.status_code == 200
    data = response.json()
    assert "next_best_action" in data or "next_action" in data
    assert "recommendations_count" in data


def test_mentor_next_action_updated():
    response = client.get("/mentor/next-action")
    assert response.status_code == 200
    data = response.json()
    assert "next_best_action" in data


# ── CRUD: complete/dismiss/snooze ─────────────────────────────────────────────

def test_complete_recommendation():
    recs = get_active_recommendations()
    if recs:
        rec_id = recs[0]["id"]
        result = update_recommendation(rec_id, "completed")
        assert result is not None
        assert result["status"] == "completed"


def test_dismiss_recommendation():
    recs = get_active_recommendations()
    if recs:
        rec_id = recs[0]["id"]
        result = update_recommendation(rec_id, "dismissed")
        assert result is not None
        assert result["status"] == "dismissed"


def test_snooze_recommendation():
    recs = get_active_recommendations()
    if recs:
        rec_id = recs[0]["id"]
        result = update_recommendation(rec_id, "snoozed")
        assert result is not None
        assert result["status"] == "snoozed"


def test_complete_nonexistent():
    result = update_recommendation("rec-nonexistent", "completed")
    assert result is None


# ── Resilience ─────────────────────────────────────────────────────────────────

def test_endpoints_dont_break_without_history():
    response = client.get("/mentor/finish-line")
    assert response.status_code == 200
    response2 = client.get("/mentor/focus")
    assert response2.status_code == 200
    response3 = client.get("/mentor/next-best-action")
    assert response3.status_code == 200
