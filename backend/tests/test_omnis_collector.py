"""Tests for omnis_collector — HTTP + filesystem fallback + state.json bridge."""
import json
import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.collectors.omnis_collector import (
    _fetch_http,
    _read_state_file,
    _scan_filesystem,
    collect_status,
    collect_summary,
)


# ── _fetch_http ──────────────────────────────────────────────────────────────

def test_fetch_http_returns_none_when_url_empty():
    assert _fetch_http("") is None


def test_fetch_http_returns_parsed_json_on_200():
    payload = {"status": "ok", "version": "0.9.0", "sectors_count": 9}
    mock_resp = MagicMock()
    mock_resp.status = 200
    mock_resp.read.return_value = json.dumps(payload).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp
    mock_resp.__exit__.return_value = None

    with patch("urllib.request.urlopen", return_value=mock_resp):
        result = _fetch_http("http://127.0.0.1:5200/health")
        assert result == payload


def test_fetch_http_returns_none_on_non_200():
    mock_resp = MagicMock()
    mock_resp.status = 500
    mock_resp.__enter__.return_value = mock_resp
    mock_resp.__exit__.return_value = None

    with patch("urllib.request.urlopen", return_value=mock_resp):
        assert _fetch_http("http://127.0.0.1:5200/health") is None


def test_fetch_http_returns_none_on_connection_error():
    with patch("urllib.request.urlopen", side_effect=OSError("refused")):
        assert _fetch_http("http://127.0.0.1:5200/health") is None


def test_fetch_http_returns_none_on_invalid_json():
    mock_resp = MagicMock()
    mock_resp.status = 200
    mock_resp.read.return_value = b"<html>not json</html>"
    mock_resp.__enter__.return_value = mock_resp
    mock_resp.__exit__.return_value = None

    with patch("urllib.request.urlopen", return_value=mock_resp):
        assert _fetch_http("http://127.0.0.1:5200/health") is None


def test_fetch_http_returns_none_when_status_field_missing():
    payload = {"version": "0.9.0"}  # no 'status' key
    mock_resp = MagicMock()
    mock_resp.status = 200
    mock_resp.read.return_value = json.dumps(payload).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp
    mock_resp.__exit__.return_value = None

    with patch("urllib.request.urlopen", return_value=mock_resp):
        assert _fetch_http("http://127.0.0.1:5200/health") is None


# ── collect_status ──────────────────────────────────────────────────────────

def test_collect_status_uses_omnis_server_first():
    payload = {"status": "ok", "version": "0.9.0", "sectors_count": 9, "skills_count": 17,
               "jobs_running": 1, "jobs_failed": 0, "blockers": [], "mode": "observe",
               "updated_at": "2026-05-14T10:00:00Z"}

    with patch("app.collectors.omnis_collector._fetch_http", return_value=payload):
        data, source, status = collect_status()
        assert source == "real"
        assert status == "ok"
        assert data["status"] == "ok"
        assert data["version"] == "0.9.0"
        assert data["sectors_count"] == 9
        assert data["skills_count"] == 17
        assert data["source"] == "omnis-server"
        assert data["source_badge"] == "confirmed"


def test_collect_status_falls_back_to_filesystem_when_http_fails():
    with patch("app.collectors.omnis_collector._fetch_http", return_value=None):
        data, source, status = collect_status()
        assert source == "real"
        assert status == "ok"
        assert "sectors_file_exists" in data
        assert "checkers" in data
        assert data["source_badge"] == "partial"


def test_collect_status_returns_error_on_catastrophic_failure():
    with patch("app.collectors.omnis_collector._fetch_http", return_value=None):
        with patch("app.collectors.omnis_collector._scan_filesystem", side_effect=RuntimeError("boom")):
            data, source, status = collect_status()
            assert status == "error"
            assert source == "fallback"
            assert data["source_badge"] == "offline"


# ── collect_summary ─────────────────────────────────────────────────────────

def test_collect_summary_uses_omnis_server_first():
    payload = {"status": "ok", "version": "0.9.0", "sectors_count": 9, "skills_count": 17, "mode": "observe"}
    with patch("app.collectors.omnis_collector._fetch_http", return_value=payload):
        data, source, status = collect_summary()
        assert source == "real"
        assert status == "ok"
        assert data["omnis"]["version"] == "0.9.0"
        assert data["omnis"]["active_sectors"] == 9
        assert data["source"] == "omnis-server"
        assert data["source_badge"] == "confirmed"


def test_collect_summary_falls_back_when_http_fails():
    with patch("app.collectors.omnis_collector._fetch_http", return_value=None):
        data, source, status = collect_summary()
        assert source == "real"
        assert status == "ok"
        assert data["omnis"]["status"] == "operational"
        assert data["source_badge"] == "partial"


# ── _read_state_file ────────────────────────────────────────────────────────

def test_read_state_file_returns_none_when_missing(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", tmp_path / "nonexistent.json")
    assert _read_state_file() is None


def test_read_state_file_returns_dict_when_valid(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    state = {"test_count": 9841, "last_wave": "Onda 10", "updated_at": "2026-05-24T18:00:00Z"}
    p = tmp_path / "state.json"
    p.write_text(json.dumps(state), encoding="utf-8")
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", p)
    result = _read_state_file()
    assert result is not None
    assert result["test_count"] == 9841
    assert result["last_wave"] == "Onda 10"


def test_read_state_file_returns_none_on_invalid_json(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    p = tmp_path / "state.json"
    p.write_text("not json{{{", encoding="utf-8")
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", p)
    assert _read_state_file() is None


def test_read_state_file_returns_none_when_not_dict(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    p = tmp_path / "state.json"
    p.write_text(json.dumps([1, 2, 3]), encoding="utf-8")
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", p)
    assert _read_state_file() is None


# ── _scan_filesystem ─────────────────────────────────────────────────────────

def test_scan_filesystem_returns_expected_keys():
    data = _scan_filesystem()
    assert "status" in data
    assert "sectors_file_exists" in data
    assert "checkers" in data
    assert "skills_count" in data
    assert "mode" in data


def test_scan_filesystem_without_state_has_no_hardcoded_test_count():
    data = _scan_filesystem(state=None)
    # test_count must be None (honest) — never 201 hardcoded
    assert data.get("test_count") is None
    assert "state_note" in data


def test_scan_filesystem_with_state_populates_fields():
    state = {
        "test_count": 9841,
        "last_wave": "Onda 10",
        "last_run_id": "run_abc",
        "last_run_status": "success",
        "workflows_available": 20,
        "cost_accumulated_usd": 1.23,
        "updated_at": "2026-05-24T18:00:00Z",
    }
    data = _scan_filesystem(state=state)
    assert data["test_count"] == 9841
    assert data["last_wave"] == "Onda 10"
    assert data["last_run_id"] == "run_abc"
    assert data["last_run_status"] == "success"
    assert data["workflows_available"] == 20
    assert data["cost_accumulated_usd"] == 1.23
    assert data["state_updated_at"] == "2026-05-24T18:00:00Z"
    assert "state_note" not in data


# ── collect_status + state.json bridge ──────────────────────────────────────

def test_collect_status_reads_state_file_when_http_fails(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    state = {"test_count": 9841, "last_wave": "Onda 10", "updated_at": "2026-05-24T18:00:00Z"}
    p = tmp_path / "state.json"
    p.write_text(json.dumps(state), encoding="utf-8")
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", p)

    with patch("app.collectors.omnis_collector._fetch_http", return_value=None):
        data, source, status = collect_status()

    assert source == "real"
    assert status == "ok"
    assert data["test_count"] == 9841
    assert data["last_wave"] == "Onda 10"
    assert data["source_badge"] == "confirmed"  # state.json found


def test_collect_status_source_badge_partial_when_no_state_file(tmp_path, monkeypatch):
    import app.collectors.omnis_collector as mod
    monkeypatch.setattr(mod, "OMNIS_STATE_PATH", tmp_path / "nonexistent.json")

    with patch("app.collectors.omnis_collector._fetch_http", return_value=None):
        data, source, status = collect_status()

    assert source == "real"
    assert status == "ok"
    assert data["source_badge"] == "partial"
    assert data.get("test_count") is None  # honest: unknown
