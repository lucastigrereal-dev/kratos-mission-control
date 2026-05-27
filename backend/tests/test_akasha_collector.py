"""Tests for akasha_collector — PostgreSQL/pgvector health check."""
import json
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.collectors.akasha_collector import (
    _check_postgres_port,
    _find_akasha_container,
    collect_status,
)


# ── _check_postgres_port ────────────────────────────────────────────────────

def test_postgres_port_open():
    mock_sock = MagicMock()
    with patch("socket.create_connection", return_value=mock_sock):
        assert _check_postgres_port() is True
        mock_sock.close.assert_called_once()


def test_postgres_port_closed():
    with patch("socket.create_connection", side_effect=OSError("refused")):
        assert _check_postgres_port() is False


# ── _find_akasha_container ──────────────────────────────────────────────────

def test_container_found_and_healthy():
    inspect_out = json.dumps([{
        "Id": "abc123def456abc123def456abc123def456abc123def456",
        "Name": "/akasha-postgres",
        "State": {"Running": True, "Status": "running", "Health": {"Status": "healthy"}},
        "Config": {"Image": "pgvector/pgvector:pg16"},
        "Created": "2026-01-01T00:00:00Z",
    }])
    mock_result = type("Result", (), {"returncode": 0, "stdout": inspect_out, "stderr": ""})
    with patch("subprocess.run", return_value=mock_result):
        result = _find_akasha_container()
        assert result is not None
        assert result["name"] == "akasha-postgres"
        assert result["running"] is True
        assert result["health"] == "healthy"


def test_container_not_found():
    mock_result = type("Result", (), {"returncode": 1, "stdout": "[]", "stderr": "No such object"})
    with patch("subprocess.run", return_value=mock_result):
        result = _find_akasha_container()
        assert result is None


# ── collect_status ──────────────────────────────────────────────────────────

def test_collect_confirmed_when_container_and_port_ok():
    container = {"name": "akasha-postgres", "running": True, "health": "healthy"}
    with patch("app.collectors.akasha_collector._find_akasha_container", return_value=container):
        with patch("app.collectors.akasha_collector._check_postgres_port", return_value=True):
            data, source, status = collect_status()
            assert source == "real"
            assert status == "ok"
            assert data["status"] == "healthy"
            assert data["source_badge"] == "confirmed"


def test_collect_partial_when_container_running_but_port_closed():
    container = {"name": "akasha-postgres", "running": True, "health": "healthy"}
    with patch("app.collectors.akasha_collector._find_akasha_container", return_value=container):
        with patch("app.collectors.akasha_collector._check_postgres_port", return_value=False):
            data, source, status = collect_status()
            assert source == "real"
            assert status == "ok"
            assert data["status"] == "degraded"
            assert data["source_badge"] == "partial"


def test_collect_offline_when_nothing_available():
    with patch("app.collectors.akasha_collector._find_akasha_container", return_value=None):
        with patch("app.collectors.akasha_collector._check_postgres_port", return_value=False):
            data, source, status = collect_status()
            assert source == "fallback"
            assert status == "error"
            assert data["status"] == "offline"
            assert data["source_badge"] == "offline"
