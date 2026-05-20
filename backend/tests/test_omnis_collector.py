"""Tests for omnis_collector — HTTP + filesystem fallback with source badges."""
import json
import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.collectors.omnis_collector import (
    _fetch_http,
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


# ── _scan_filesystem (sanity) ───────────────────────────────────────────────

def test_scan_filesystem_returns_expected_keys():
    data = _scan_filesystem()
    assert "status" in data
    assert "sectors_file_exists" in data
    assert "checkers" in data
    assert "skills_count" in data
    assert "mode" in data
