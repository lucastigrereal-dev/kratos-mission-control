"""Tests for external_services_collector — TCP + HTTP probes for 5 external services."""
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.collectors.external_services_collector import (
    _tcp_probe,
    _http_probe,
    _probe_ollama,
    _probe_publisher_os,
    _probe_supabase,
    _probe_redis,
    _probe_n8n,
    collect,
    collect_ollama,
    collect_publisher_os,
    collect_supabase,
    collect_redis,
    collect_n8n,
)


# ── _tcp_probe ───────────────────────────────────────────────────────────────

def test_tcp_probe_returns_false_on_refused_port():
    # Port 19999 is almost certainly not listening
    assert _tcp_probe("127.0.0.1", 19999) is False


def test_tcp_probe_returns_false_on_timeout():
    # Non-routable address to trigger timeout
    assert _tcp_probe("192.0.2.1", 80) is False


# ── _http_probe ──────────────────────────────────────────────────────────────

def test_http_probe_returns_true_on_200(monkeypatch):
    import urllib.request
    import io

    class FakeResp:
        status = 200
        def read(self): return b'{"version": "0.9.0"}'
        def __enter__(self): return self
        def __exit__(self, *a): pass

    monkeypatch.setattr(urllib.request, "urlopen", lambda req, timeout: FakeResp())
    ok, detail = _http_probe("http://localhost:9999", "/")
    assert ok is True
    assert "0.9.0" in detail


def test_http_probe_returns_false_on_connection_refused(monkeypatch):
    import urllib.error
    monkeypatch.setattr(
        "urllib.request.urlopen",
        lambda req, timeout: (_ for _ in ()).throw(urllib.error.URLError("refused"))
    )
    ok, _ = _http_probe("http://localhost:19999", "/")
    assert ok is False


def test_http_probe_returns_true_on_200_with_empty_body(monkeypatch):
    import urllib.request

    class FakeResp:
        status = 200
        def read(self): return b""
        def __enter__(self): return self
        def __exit__(self, *a): pass

    monkeypatch.setattr(urllib.request, "urlopen", lambda req, timeout: FakeResp())
    ok, detail = _http_probe("http://localhost:9999", "/")
    assert ok is True
    assert detail == ""


# ── Individual probes (mocked) ────────────────────────────────────────────────

def test_probe_ollama_live_when_http_up(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._http_probe",
        lambda url, path="/": (True, "0.9.0")
    )
    result = _probe_ollama()
    assert result["status"] == "live"
    assert result["source_badge"] == "confirmed"


def test_probe_ollama_offline_when_http_down(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._http_probe",
        lambda url, path="/": (False, "connection refused")
    )
    result = _probe_ollama()
    assert result["status"] == "offline"
    assert result["source_badge"] == "offline"


def test_probe_supabase_live_when_tcp_up(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._tcp_probe",
        lambda host, port: True
    )
    result = _probe_supabase()
    assert result["status"] == "live"
    assert result["protocol"] == "tcp"
    assert result["source_badge"] == "confirmed"


def test_probe_redis_offline_when_tcp_down(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._tcp_probe",
        lambda host, port: False
    )
    result = _probe_redis()
    assert result["status"] == "offline"
    assert result["source_badge"] == "offline"


# ── collect() ────────────────────────────────────────────────────────────────

def test_collect_returns_all_five_services(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._tcp_probe",
        lambda host, port: True
    )
    monkeypatch.setattr(
        "app.collectors.external_services_collector._http_probe",
        lambda url, path="/": (True, "")
    )
    data, source, status = collect()
    assert source == "real"
    assert status == "ok"
    assert "services" in data
    assert set(data["services"].keys()) == {"publisher_os", "supabase", "redis", "ollama", "n8n"}
    assert data["summary"]["live"] == 5


def test_collect_returns_degraded_when_some_offline(monkeypatch):
    def fake_tcp(host, port):
        return port == 5434  # only supabase up

    def fake_http(url, path="/"):
        return (False, "refused")

    monkeypatch.setattr("app.collectors.external_services_collector._tcp_probe", fake_tcp)
    monkeypatch.setattr("app.collectors.external_services_collector._http_probe", fake_http)
    data, source, status = collect()
    assert source == "real"
    assert status == "degraded"
    assert data["summary"]["live"] == 1
    assert data["summary"]["offline"] == 4


def test_collect_returns_error_when_all_offline(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._tcp_probe",
        lambda host, port: False
    )
    monkeypatch.setattr(
        "app.collectors.external_services_collector._http_probe",
        lambda url, path="/": (False, "refused")
    )
    data, source, status = collect()
    assert source == "real"
    assert status == "error"
    assert data["summary"]["live"] == 0


# ── Individual wrapper shape ──────────────────────────────────────────────────

def test_collect_ollama_wrapper_returns_triple(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._http_probe",
        lambda url, path="/": (True, "")
    )
    result, source, status = collect_ollama()
    assert source == "real"
    assert status in ("ok", "error")
    assert "source_badge" in result


def test_collect_supabase_wrapper_returns_triple(monkeypatch):
    monkeypatch.setattr(
        "app.collectors.external_services_collector._tcp_probe",
        lambda host, port: False
    )
    result, source, status = collect_supabase()
    assert source == "real"
    assert status == "error"
    assert result["status"] == "offline"
