"""Tests for operational_truth_service — cross-reference verifier."""
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))


# ── _check_project_alignment ──────────────────────────────────────────────────

def test_project_alignment_consistent_when_all_sources_agree():
    from app.services.operational_truth_service import _check_project_alignment

    mock_git = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "current_branch": "feature/kratos-0-11",
            "repos": [{"name": "kratos-mission-control", "current_branch": "feature/kratos-0-11", "dirty_files": 0}],
        },
    }
    mock_aw = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "windows": [
                {"app": "Cursor", "title": "operational_truth_service.py — kratos-mission-control", "url": "", "domain": ""}
            ],
        },
    }
    mock_focus = {"focus_project": "kratos-mission-control", "focus_block_minutes": 90}

    with patch("app.services.get_git", return_value=mock_git):
        with patch("app.services.get_activitywatch_status", return_value=mock_aw):
            with patch("app.services.get_mentor_focus", return_value=mock_focus):
                with patch("app.services.context_classifier_service.classify") as mock_classify:
                    mock_classify.return_value = {
                        "project_guess": "kratos-mission-control",
                        "mission_guess": None,
                        "reason_guess": "path_match",
                        "confidence": 0.9,
                    }
                    result = _check_project_alignment()

    assert result["verdict"] == "consistent"
    assert result["status"] == "ok"
    assert "kratos-mission-control" in result["projects_detected"]


def test_project_alignment_conflict_when_sources_disagree():
    from app.services.operational_truth_service import _check_project_alignment

    mock_git = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "current_branch": "feature/kratos-0-11",
            "repos": [{"name": "kratos-mission-control", "current_branch": "feature/kratos-0-11", "dirty_files": 0}],
        },
    }
    mock_aw = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "windows": [
                {"app": "Chrome", "title": "Instagram — lucastigrereal", "url": "https://instagram.com", "domain": "instagram.com"}
            ],
        },
    }
    mock_focus = {"focus_project": "kratos-mission-control"}

    with patch("app.services.get_git", return_value=mock_git):
        with patch("app.services.get_activitywatch_status", return_value=mock_aw):
            with patch("app.services.get_mentor_focus", return_value=mock_focus):
                with patch("app.services.context_classifier_service.classify") as mock_classify:
                    mock_classify.return_value = {
                        "project_guess": "instagram-publisher",
                        "mission_guess": None,
                        "reason_guess": "domain",
                        "confidence": 0.85,
                    }
                    result = _check_project_alignment()

    assert result["verdict"] == "conflict"
    assert result["status"] == "warning"
    assert len(result["conflicts"]) > 0


def test_project_alignment_degraded_when_only_one_source():
    from app.services.operational_truth_service import _check_project_alignment

    mock_git = {"source": "fallback", "collector_status": "offline", "data": None}
    mock_aw = {"source": "fallback", "collector_status": "offline", "data": None}
    mock_focus = {"focus_project": "kratos-mission-control"}

    with patch("app.services.get_git", return_value=mock_git):
        with patch("app.services.get_activitywatch_status", return_value=mock_aw):
            with patch("app.services.get_mentor_focus", return_value=mock_focus):
                result = _check_project_alignment()

    assert result["verdict"] == "unknown"
    assert result["status"] == "degraded"


# ── _check_infrastructure_health ──────────────────────────────────────────────

def test_infrastructure_healthy_when_all_sources_ok():
    from app.services.operational_truth_service import _check_infrastructure_health

    mock_docker = {
        "source": "real",
        "collector_status": "ok",
        "data": {"total": 8, "running": 8, "unhealthy": 0},
    }
    mock_omnis = {"source": "real", "collector_status": "ok"}
    mock_system = {
        "source": "real",
        "collector_status": "ok",
        "data": {"cpu": {"percent": 25}, "memory": {"percent": 45}},
    }

    with patch("app.services.get_docker", return_value=mock_docker):
        with patch("app.services.get_omnis_status", return_value=mock_omnis):
            with patch("app.services.get_system", return_value=mock_system):
                result = _check_infrastructure_health()

    assert result["verdict"] == "consistent"
    assert result["status"] == "ok"


def test_infrastructure_degraded_when_docker_has_unhealthy():
    from app.services.operational_truth_service import _check_infrastructure_health

    mock_docker = {
        "source": "real",
        "collector_status": "ok",
        "data": {"total": 8, "running": 6, "unhealthy": 2},
    }
    mock_omnis = {"source": "real", "collector_status": "ok"}
    mock_system = {
        "source": "real",
        "collector_status": "ok",
        "data": {"cpu": {"percent": 25}, "memory": {"percent": 45}},
    }

    with patch("app.services.get_docker", return_value=mock_docker):
        with patch("app.services.get_omnis_status", return_value=mock_omnis):
            with patch("app.services.get_system", return_value=mock_system):
                result = _check_infrastructure_health()

    assert result["verdict"] == "degraded"
    assert len(result["issues"]) >= 1


def test_infrastructure_conflict_when_multi_critical():
    from app.services.operational_truth_service import _check_infrastructure_health

    mock_docker = {"source": "fallback", "collector_status": "error", "data": None}
    mock_omnis = {"source": "fallback", "collector_status": "error"}
    mock_system = {
        "source": "real",
        "collector_status": "ok",
        "data": {"cpu": {"percent": 95}, "memory": {"percent": 92}},
    }

    with patch("app.services.get_docker", return_value=mock_docker):
        with patch("app.services.get_omnis_status", return_value=mock_omnis):
            with patch("app.services.get_system", return_value=mock_system):
                result = _check_infrastructure_health()

    assert result["verdict"] == "conflict"
    assert len(result["issues"]) >= 3


# ── _check_data_freshness ─────────────────────────────────────────────────────

def test_data_freshness_all_real():
    from app.services.operational_truth_service import _check_data_freshness

    real_response = {"source": "real", "collector_status": "ok"}

    with patch("app.services.get_git", return_value=real_response):
        with patch("app.services.get_docker", return_value=real_response):
            with patch("app.services.get_omnis_status", return_value=real_response):
                with patch("app.services.get_system", return_value=real_response):
                    with patch("app.services.get_activitywatch_status", return_value=real_response):
                        result = _check_data_freshness()

    assert result["verdict"] == "consistent"
    assert result["status"] == "ok"
    assert len(result["stale_sources"]) == 0


def test_data_freshness_degraded_when_sources_stale():
    from app.services.operational_truth_service import _check_data_freshness

    real_response = {"source": "real", "collector_status": "ok"}
    fallback_response = {"source": "fallback", "collector_status": "offline"}

    with patch("app.services.get_git", return_value=real_response):
        with patch("app.services.get_docker", return_value=real_response):
            with patch("app.services.get_omnis_status", return_value=real_response):
                with patch("app.services.get_system", return_value=fallback_response):
                    with patch("app.services.get_activitywatch_status", return_value=fallback_response):
                        result = _check_data_freshness()

    assert result["verdict"] == "degraded"
    assert len(result["stale_sources"]) == 2


# ── _check_git_hygiene ────────────────────────────────────────────────────────

def test_git_hygiene_clean():
    from app.services.operational_truth_service import _check_git_hygiene

    mock_git = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "current_branch": "main",
            "repos": [
                {"name": "kratos-mission-control", "current_branch": "main", "dirty_files": 0, "stashes": 0}
            ],
        },
    }

    with patch("app.services.get_git", return_value=mock_git):
        result = _check_git_hygiene()

    assert result["verdict"] == "consistent"
    assert result["total_dirty_files"] == 0
    assert result["needs_checkpoint"] is False


def test_git_hygiene_dirty_warns_checkpoint():
    from app.services.operational_truth_service import _check_git_hygiene

    mock_git = {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "current_branch": "feature/big-change",
            "repos": [
                {"name": "kratos-mission-control", "current_branch": "feature/big-change", "dirty_files": 12, "stashes": 2}
            ],
        },
    }

    with patch("app.services.get_git", return_value=mock_git):
        result = _check_git_hygiene()

    assert result["verdict"] == "conflict"
    assert result["total_dirty_files"] > 5
    assert result["needs_checkpoint"] is True


def test_git_hygiene_offline_returns_unknown():
    from app.services.operational_truth_service import _check_git_hygiene

    mock_git = {"source": "fallback", "collector_status": "offline", "data": None}

    with patch("app.services.get_git", return_value=mock_git):
        result = _check_git_hygiene()

    assert result["verdict"] == "unknown"
    assert result["total_dirty_files"] == 0


# ── build_operational_truth ───────────────────────────────────────────────────

def test_build_operational_truth_returns_structure():
    from app.services.operational_truth_service import build_operational_truth

    result = build_operational_truth()

    assert "timestamp" in result
    assert "verdict" in result
    assert "status" in result
    assert "checks" in result
    assert "check_stats" in result
    assert "build_time_ms" in result

    checks = result["checks"]
    assert "project_alignment" in checks
    assert "infrastructure_health" in checks
    assert "data_freshness" in checks
    assert "git_hygiene" in checks

    stats = result["check_stats"]
    assert stats["total"] == 4
    # Each check returns a verdict; total is always 4 checks
    assert stats["consistent"] + stats["degraded"] + stats["conflict"] <= 4  # "unknown" doesn't count
    assert result["verdict"] in ("consistent", "mostly_consistent", "degraded", "conflict")


def test_build_operational_truth_build_time_is_positive():
    from app.services.operational_truth_service import build_operational_truth

    result = build_operational_truth()
    assert result["build_time_ms"] > 0
