"""Tests for Phase 0.4/0.5A — SSE Live Updates with cache and parallelism."""
import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db
from app.services.live_event_service import build_live_payload

client = TestClient(app)


def setup_module():
    init_db()


# ── /live/snapshot ───────────────────────────────────────────────────────────

def test_snapshot_returns_200():
    resp = client.get("/live/snapshot")
    assert resp.status_code == 200


def test_snapshot_has_required_sections():
    resp = client.get("/live/snapshot")
    data = resp.json()
    assert "timestamp" in data
    assert "context" in data
    assert "alerts" in data
    assert "mentor_signals" in data
    assert "next_best_action" in data
    assert "collector_status" in data
    assert "today_execution" in data
    assert "recent_checkpoints" in data


def test_snapshot_collector_status_has_keys():
    resp = client.get("/live/snapshot")
    cs = resp.json()["collector_status"]
    if cs.get("degraded"):
        return
    assert "system" in cs
    assert "docker" in cs
    assert "omnis" in cs
    assert "git" in cs
    assert "activitywatch" in cs


def test_snapshot_timestamp_is_iso():
    resp = client.get("/live/snapshot")
    ts = resp.json()["timestamp"]
    assert "T" in ts  # ISO 8601


# ── /live/stream  ───────────────────────────────────────────────────────────

def test_stream_endpoint_registered():
    """SSE route is registered in app."""
    routes = [r.path for r in app.routes if hasattr(r, 'path')]
    assert "/live/stream" in routes


def test_build_live_payload_tolerates_partial_failures():
    """Payload builds successfully even with partial degraded sections."""
    payload = build_live_payload()
    assert "timestamp" in payload
    assert "context" in payload
    assert "alerts" in payload
    assert "mentor_signals" in payload


# ── Phase 0.5A: _live_meta ──────────────────────────────────────────────────

def test_snapshot_has_live_meta():
    resp = client.get("/live/snapshot")
    data = resp.json()
    assert "_live_meta" in data
    meta = data["_live_meta"]
    assert "build_time_ms" in meta
    assert "section_count" in meta
    assert meta["section_count"] >= 8
    assert "sections" in meta
    assert "degraded_count" in meta
    assert "cached_count" in meta
    assert "mode" in meta
    assert meta["mode"] in ("live", "degraded")


def test_live_meta_sections_have_status():
    resp = client.get("/live/snapshot")
    sections = resp.json()["_live_meta"]["sections"]
    for name, info in sections.items():
        assert "status" in info, f"Section {name} missing status"
        assert info["status"] in ("ok", "degraded", "error")
        assert "cached" in info
        assert "elapsed_ms" in info


def test_live_meta_per_section_timing():
    resp = client.get("/live/snapshot")
    sections = resp.json()["_live_meta"]["sections"]
    for name, info in sections.items():
        assert info["elapsed_ms"] >= 0, f"Section {name} elapsed_ms is negative"
        assert info["elapsed_ms"] < 15000, f"Section {name} took >15s — something is wrong"


# ── Cache integration ───────────────────────────────────────────────────────

def test_cache_stores_and_retrieves():
    """Cache service stores and retrieves correctly."""
    from app.services.live_cache_service import get_cached, set_cache, invalidate
    invalidate("test-section")
    set_cache("test-section", {"value": 42})
    hit, data, age = get_cached("test-section", ttl=10.0)
    assert hit is True
    assert data == {"value": 42}
    assert age >= 0
    invalidate("test-section")
    hit2, _, _ = get_cached("test-section", ttl=10.0)
    assert hit2 is False


def test_cache_works_with_valid_ttl():
    """Cache hits when TTL is valid and entry isfresh."""
    from app.services.live_cache_service import get_cached, set_cache, invalidate
    invalidate("valid-test")
    set_cache("valid-test", "data")
    hit, data, age = get_cached("valid-test", ttl=999.0)  # very long TTL
    assert hit is True
    assert data == "data"
    assert age >= 0
    invalidate("valid-test")


def test_cache_invalidate_all():
    """Invalidate without key clears all."""
    from app.services.live_cache_service import set_cache, get_cached, invalidate
    set_cache("a", 1)
    set_cache("b", 2)
    invalidate()
    for k in ("a", "b"):
        hit, _, _ = get_cached(k, ttl=10.0)
        assert hit is False


def test_cache_no_sensitive_data_leak():
    """Cache info() does not expose stored values."""
    from app.services.live_cache_service import set_cache, cache_info, invalidate
    invalidate()
    set_cache("secret-section", {"token": "sk-sensitive"})
    info = cache_info()
    assert "secret-section" in info["keys"]
    # info() only returns keys and ages, not values
    assert "token" not in json.dumps(info)
    invalidate()


# ── Payload does not leak secrets ───────────────────────────────────────────

def test_payload_no_sensitive_patterns():
    """Ensure live payload doesn't contain token/secret/key patterns."""
    resp = client.get("/live/snapshot")
    raw = json.dumps(resp.json()).lower()
    forbidden = ["bearer sk-", "ghp_", "xoxb-", "private key", "password"]
    for pattern in forbidden:
        assert pattern not in raw, f"Live payload contained '{pattern}'"


def test_snapshot_returns_valid_json():
    resp = client.get("/live/snapshot")
    assert resp.headers.get("content-type", "").startswith("application/json")


# ── Root endpoint list ──────────────────────────────────────────────────────

def test_live_endpoints_in_root():
    resp = client.get("/")
    endpoints = resp.json().get("endpoints", [])
    assert "/live/stream" in endpoints
    assert "/live/snapshot" in endpoints


# ── Phase 0.6E: mission_lens in /live/snapshot ──────────────────────────────

def test_snapshot_has_mission_lens():
    resp = client.get("/live/snapshot")
    data = resp.json()
    assert "mission_lens" in data, "mission_lens section missing from /live/snapshot"


def test_mission_lens_has_next_action():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    assert "data" in ml
    na = ml["data"]["next_action"]
    assert isinstance(na, dict)
    assert "title" in na
    assert len(na["title"]) > 0


def test_mission_lens_has_do_not_do():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    dnd = ml["data"]["do_not_do"]
    assert isinstance(dnd, list)
    assert len(dnd) >= 1
    assert isinstance(dnd[0], dict)


def test_mission_lens_has_risks():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    assert isinstance(ml["data"]["risks"], list)


def test_mission_lens_has_mentor_summary():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    ms = ml["data"]["mentor_summary"]
    assert isinstance(ms, dict)
    assert "text" in ms
    assert len(ms["text"]) > 0


def test_mission_lens_has_system_pulse():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    pulse = ml["data"]["system_pulse"]
    assert "status" in pulse
    assert "critical_count" in pulse


def test_mission_lens_in_live_meta_sections():
    resp = client.get("/live/snapshot")
    meta_sections = resp.json()["_live_meta"]["sections"]
    assert "mission_lens" in meta_sections
    ml_meta = meta_sections["mission_lens"]
    assert "status" in ml_meta
    assert ml_meta["status"] in ("ok", "degraded", "error")
    assert "elapsed_ms" in ml_meta


def test_live_meta_section_count_includes_mission_lens():
    resp = client.get("/live/snapshot")
    meta = resp.json()["_live_meta"]
    assert meta["section_count"] >= 9


def test_snapshot_still_200_if_mission_lens_raises(monkeypatch):
    """mission_lens failure must not break /live/snapshot."""
    import app.services.live_event_service as svc

    def _boom():
        raise RuntimeError("simulated mission_lens failure")

    original = svc.SECTIONS.get("mission_lens")
    svc.SECTIONS["mission_lens"] = _boom
    # Also clear cache so it must call the function
    from app.services.live_cache_service import invalidate
    invalidate("mission_lens")
    try:
        resp = client.get("/live/snapshot")
        assert resp.status_code == 200
        data = resp.json()
        assert "mission_lens" in data
        ml = data["mission_lens"]
        # Should be error payload, not a 500
        assert "error" in ml or "degraded" in ml or "next_action" in ml
    finally:
        if original:
            svc.SECTIONS["mission_lens"] = original
        invalidate("mission_lens")


def test_build_payload_includes_mission_lens():
    from app.services.live_event_service import build_live_payload
    payload = build_live_payload()
    assert "mission_lens" in payload


# ── Phase 0.6G: mission_lens contract_version in /live/snapshot ─────────────

def test_snapshot_mission_lens_has_contract_version():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    assert ml.get("contract_version") == "mission_lens.v1"


def test_snapshot_mission_lens_has_stale_after_ms():
    resp = client.get("/live/snapshot")
    ml = resp.json()["mission_lens"]
    assert "stale_after_ms" in ml
    assert ml["stale_after_ms"] > 0


def test_snapshot_mission_lens_next_action_has_cta_label():
    resp = client.get("/live/snapshot")
    na = resp.json()["mission_lens"]["data"]["next_action"]
    assert "cta_label" in na
    assert isinstance(na["cta_label"], str)


def test_snapshot_mission_lens_checkpoint_always_dict():
    resp = client.get("/live/snapshot")
    cp = resp.json()["mission_lens"]["data"]["checkpoint"]
    assert isinstance(cp, dict)
    assert "available" in cp
    assert "resume_hint" in cp


def test_snapshot_mission_lens_mentor_summary_has_tone():
    resp = client.get("/live/snapshot")
    ms = resp.json()["mission_lens"]["data"]["mentor_summary"]
    assert ms["tone"] in ("calm", "urgent", "critical")


# ── Phase 0.6F: timeout wall + parallelism ──────────────────────────────────

def test_snapshot_returns_within_timeout_wall():
    """Warm-cache snapshot must complete well under SECTION_TIMEOUT."""
    import time
    # First call primes all section caches
    client.get("/live/snapshot")
    t0 = time.monotonic()
    resp = client.get("/live/snapshot")
    elapsed = time.monotonic() - t0
    assert resp.status_code == 200
    # Warm cache: all sections served from cache — expect <500ms
    assert elapsed < 0.5, f"Warm snapshot took {elapsed:.2f}s — cache not working"


def test_slow_section_does_not_exceed_timeout_wall(monkeypatch):
    """A section sleeping 5s must not delay snapshot beyond SECTION_TIMEOUT + overhead."""
    import time
    import app.services.live_event_service as svc
    from app.services.live_cache_service import invalidate

    original = svc.SECTIONS.get("collector_status")
    call_count = {"n": 0}

    def _slow():
        call_count["n"] += 1
        time.sleep(7.0)  # longer than SECTION_TIMEOUT=5.0
        return {"fake": True}

    svc.SECTIONS["collector_status"] = _slow
    invalidate("collector_status")
    try:
        t0 = time.monotonic()
        resp = client.get("/live/snapshot")
        elapsed = time.monotonic() - t0
        assert resp.status_code == 200
        # Must not block beyond timeout + reasonable overhead (1s)
        assert elapsed < svc.SECTION_TIMEOUT + 1.0, (
            f"Snapshot blocked {elapsed:.2f}s — timeout wall not enforced"
        )
    finally:
        if original:
            svc.SECTIONS["collector_status"] = original
        invalidate("collector_status")


def test_timed_out_section_marked_as_degraded_or_error(monkeypatch):
    """Section that times out must appear in _live_meta as degraded or error (not ok)."""
    import time
    import app.services.live_event_service as svc
    from app.services.live_cache_service import invalidate

    original = svc.SECTIONS.get("collector_status")

    def _slow():
        time.sleep(7.0)
        return {"fake": True}

    svc.SECTIONS["collector_status"] = _slow
    invalidate("collector_status")
    try:
        resp = client.get("/live/snapshot")
        assert resp.status_code == 200
        meta = resp.json()["_live_meta"]
        cs_meta = meta["sections"].get("collector_status", {})
        assert cs_meta.get("status") in ("degraded", "error"), (
            f"Timed-out section has status={cs_meta.get('status')} — expected degraded/error"
        )
    finally:
        if original:
            svc.SECTIONS["collector_status"] = original
        invalidate("collector_status")


def test_all_sections_present_even_with_slow_one(monkeypatch):
    """All other sections must be present in payload even when one section times out."""
    import time
    import app.services.live_event_service as svc
    from app.services.live_cache_service import invalidate

    original = svc.SECTIONS.get("collector_status")

    def _slow():
        time.sleep(7.0)
        return {"fake": True}

    svc.SECTIONS["collector_status"] = _slow
    invalidate("collector_status")
    try:
        resp = client.get("/live/snapshot")
        data = resp.json()
        for section in ("context", "alerts", "mentor_signals", "mission_lens", "recent_checkpoints"):
            assert section in data, f"Section '{section}' missing when collector_status times out"
    finally:
        if original:
            svc.SECTIONS["collector_status"] = original
        invalidate("collector_status")


def test_build_time_ms_reported_accurately():
    """_live_meta.build_time_ms must be a positive number."""
    resp = client.get("/live/snapshot")
    meta = resp.json()["_live_meta"]
    assert meta["build_time_ms"] > 0
    assert meta["build_time_ms"] < 15000


# ── Phase 0.9: Internal collector parallelization ─────────────────────────────

def test_parallel_fetch_runs_concurrently():
    """_parallel_fetch executes tasks in parallel, not sequentially."""
    import time
    from app.services.live_event_service import _parallel_fetch

    def _slow1():
        time.sleep(0.3)
        return "a"

    def _slow2():
        time.sleep(0.3)
        return "b"

    t0 = time.monotonic()
    results = _parallel_fetch({"a": _slow1, "b": _slow2}, timeout=2.0)
    elapsed = time.monotonic() - t0

    assert results["a"] == "a"
    assert results["b"] == "b"
    # Parallel: total < 0.6s. Sequential would be >0.6s.
    assert elapsed < 0.5, f"Parallel fetch took {elapsed:.2f}s — not parallel"


def test_parallel_fetch_isolates_errors():
    """One failing sub-collector does not affect others in _parallel_fetch."""
    from app.services.live_event_service import _parallel_fetch

    def _ok():
        return {"value": 42}

    def _fail():
        raise RuntimeError("simulated failure")

    results = _parallel_fetch({"ok": _ok, "fail": _fail}, timeout=2.0)
    assert results["ok"] == {"value": 42}
    assert results["fail"]["degraded"] is True
    assert "simulated failure" in results["fail"]["error"]


def test_parallel_fetch_timeout_returns_partial():
    """Tasks that exceed timeout return degraded marker; fast tasks still complete."""
    import time
    from app.services.live_event_service import _parallel_fetch

    def _fast():
        return "done"

    def _slow():
        time.sleep(5.0)
        return "never"

    results = _parallel_fetch({"fast": _fast, "slow": _slow}, timeout=0.5)
    assert results["fast"] == "done"
    assert results["slow"]["degraded"] is True
    assert "timeout" in results["slow"]["error"]


def test_collector_status_has_all_5_keys_even_partial_failures(monkeypatch):
    """collector_status section must return all 5 collector keys even if some time out."""
    import app.services.live_event_service as svc
    from app.services.live_cache_service import invalidate

    original = svc.SECTIONS.get("collector_status")

    def _partial():
        return {
            "system": {"source": "real", "status": "ok"},
            "docker": {"error": "timeout", "degraded": True},
            "omnis": {"source": "real", "status": "ok"},
            "git": {"source": "real", "status": "degraded"},
            "activitywatch": {"error": "timeout", "degraded": True},
        }

    svc.SECTIONS["collector_status"] = _partial
    invalidate("collector_status")
    try:
        resp = client.get("/live/snapshot")
        assert resp.status_code == 200
        cs = resp.json()["collector_status"]
        assert "system" in cs
        assert "docker" in cs
        assert "omnis" in cs
        assert "git" in cs
        assert "activitywatch" in cs
    finally:
        if original:
            svc.SECTIONS["collector_status"] = original
        invalidate("collector_status")


def test_mentor_signals_survives_partial_failure(monkeypatch):
    """mentor_signals section composes correctly even if one sub-call fails."""
    import app.services.live_event_service as svc
    from app.services.live_cache_service import invalidate

    original = svc.SECTIONS.get("mentor_signals")

    def _partial():
        return {
            "signals": [{"type": "test", "severity": "info", "message": "ok"}],
            "signals_count": 1,
            "context_signals": {"error": "timeout", "degraded": True},
            "context_signals_count": 0,
            "next_best_action": None,
            "current_context": {},
        }

    svc.SECTIONS["mentor_signals"] = _partial
    invalidate("mentor_signals")
    try:
        resp = client.get("/live/snapshot")
        assert resp.status_code == 200
        ms = resp.json()["mentor_signals"]
        assert ms["signals_count"] >= 0
        assert "signals" in ms
        assert "next_best_action" in ms
        assert "current_context" in ms
    finally:
        if original:
            svc.SECTIONS["mentor_signals"] = original
        invalidate("mentor_signals")


def test_mission_lens_builds_even_with_degraded_ctx(monkeypatch):
    """mission_lens builds valid contract even when context fetch is degraded."""
    import app.services.mission_intelligence_service as mis
    from app.services.live_cache_service import invalidate

    original = mis.build_mission_lens_contract

    def _with_degraded_ctx():
        result = original()
        result["source"] = "fallback"
        result["collector_status"] = "degraded"
        result["data"]["current_mission"]["confidence"] = 0.3
        return result

    mis.build_mission_lens_contract = _with_degraded_ctx
    invalidate("mission_lens")
    try:
        resp = client.get("/live/snapshot")
        assert resp.status_code == 200
        ml = resp.json()["mission_lens"]
        assert ml["contract_version"] == "mission_lens.v1"
        assert "data" in ml
        assert "next_action" in ml["data"]
        assert "do_not_do" in ml["data"]
        assert "risks" in ml["data"]
    finally:
        mis.build_mission_lens_contract = original
        invalidate("mission_lens")


def test_context_section_has_source_and_collector_status():
    """context section must preserve source and collector_status fields."""
    resp = client.get("/live/snapshot")
    ctx = resp.json()["context"]
    if ctx.get("degraded"):
        return
    assert "source" in ctx
    assert "collector_status" in ctx
    assert ctx["source"] in ("real", "fallback", "mock")
    assert ctx["collector_status"] in ("ok", "degraded", "error", "offline")


def test_snapshot_no_section_fully_missing():
    """All 9 sections must be present in snapshot payload — none can be missing."""
    resp = client.get("/live/snapshot")
    data = resp.json()
    required = [
        "context", "alerts", "mentor_signals", "next_best_action",
        "collector_status", "today_execution", "today_agenda",
        "recent_checkpoints", "mission_lens",
    ]
    for section in required:
        assert section in data, f"Required section '{section}' missing from snapshot"
