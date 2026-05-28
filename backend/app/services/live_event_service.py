"""Live event service — aggregates operational state into a single payload for SSE streaming.

Phase 0.5A: sections run in parallel via ThreadPoolExecutor with cache TTL.
Phase 0.9: sub-collector parallelization — each section's internal fetches run concurrently.
Each section is isolated — one degraded source won't break the entire payload.
Adds _live_meta with per-section timing and cache diagnostics.
"""

import json
import time
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait, Future
from datetime import datetime, timezone


SECTION_TIMEOUT = 5.0  # max seconds per section thread — hard wall, not a soft hint
SUB_COLLECTOR_TIMEOUT = 2.0  # per-sub-collector timeout — prevents one slow source from degrading a section

# Cache TTLs per section
CACHE_TTL = {
    "context": 20.0,           # AW data + drift — changes slowly, expensive to rebuild
    "alerts": 10.0,            # active alerts, changes slowly
    "mentor_signals": 10.0,    # computed signals
    "next_best_action": 10.0,  # computed priority action
    "collector_status": 15.0,  # real collectors — expensive, now parallelized
    "today_execution": 15.0,   # plan + overdue — changes rarely
    "today_agenda": 10.0,      # calendar events
    "recent_checkpoints": 10.0, # checkpoints list
    "mission_lens": 15.0,      # composed mission intelligence — parallelized internally
}


# ── Parallel fetch helper (Phase 0.9) ────────────────────────────────────────


def _parallel_fetch(tasks: dict, timeout: float | None = None) -> dict:
    """Run multiple callables in parallel threads, each with its own error isolation.

    Args:
        tasks: {name: callable} — each callable is executed in its own thread.
        timeout: max seconds to wait for ALL tasks (default: SUB_COLLECTOR_TIMEOUT).

    Returns:
        {name: result} — on success, the callable's return value.
        {name: {"error": str, "degraded": True}} — on failure or timeout.
    """
    t = timeout if timeout is not None else SUB_COLLECTOR_TIMEOUT

    if not tasks:
        return {}

    executor = ThreadPoolExecutor(max_workers=len(tasks))
    futures_map: dict[str, Future] = {}
    for name, fn in tasks.items():
        futures_map[name] = executor.submit(fn)

    done, not_done = futures_wait(futures_map.values(), timeout=t)
    results = {}

    for name, future in futures_map.items():
        if future in done:
            try:
                results[name] = future.result(timeout=0.5)
            except Exception as e:
                results[name] = {"error": str(e), "degraded": True}
        else:
            results[name] = {"error": "sub-collector timeout", "degraded": True}

    executor.shutdown(wait=False, cancel_futures=True)
    return results


# ── Section builders ──────────────────────────────────────────────────────────


def _get_context() -> dict:
    from app.services import get_context_current
    return get_context_current()


def _get_active_alerts() -> list:
    from app.services.alert_service import get_alerts
    return get_alerts(status="active", limit=10)


def _get_mentor_signals() -> dict:
    """Mentor signals — 4 sub-calls run in parallel (Phase 0.9).

    generate_signals, detect_context_loss, get_next_best_action, and
    get_context_current are independent and each has its own timeout.
    """
    def _fetch_signals():
        from app.services.mentor_signal_service import generate_signals
        return generate_signals()

    def _fetch_context_loss():
        from app.services.context_loss_service import detect_context_loss
        return detect_context_loss()

    def _fetch_nba():
        from app.services.mentor_decision_service import get_next_best_action
        return get_next_best_action()

    def _fetch_context():
        from app.services import get_context_current
        return get_context_current()

    fetched = _parallel_fetch({
        "signals": _fetch_signals,
        "context_signals": _fetch_context_loss,
        "nba": _fetch_nba,
        "ctx": _fetch_context,
    }, timeout=SUB_COLLECTOR_TIMEOUT)

    signals = fetched.get("signals", [])
    if isinstance(signals, dict) and signals.get("degraded"):
        signals = []
    context_signals = fetched.get("context_signals", [])
    if isinstance(context_signals, dict) and context_signals.get("degraded"):
        context_signals = []
    nba = fetched.get("nba")
    if isinstance(nba, dict) and nba.get("degraded"):
        nba = None
    ctx = fetched.get("ctx", {})
    if isinstance(ctx, dict) and ctx.get("degraded"):
        ctx = {}

    return {
        "signals": signals,
        "signals_count": len(signals) if isinstance(signals, list) else 0,
        "context_signals": context_signals,
        "context_signals_count": len(context_signals) if isinstance(context_signals, list) else 0,
        "next_best_action": nba,
        "current_context": ctx,
    }


def _get_next_best_action() -> dict | None:
    from app.services.mentor_decision_service import get_next_best_action
    return get_next_best_action()


def _get_collector_status() -> dict:
    """Collector health check — 5 sub-collectors run in parallel (Phase 0.9).

    Each sub-collector is isolated with its own timeout and error handling.
    A slow Docker CLI or Git CLI no longer degrades the other 4 collectors.
    """
    def _fetch_system():
        from app.services import get_system
        sys_data = get_system()
        result = {
            "source": sys_data.get("source", "unknown"),
            "status": sys_data.get("collector_status", "unknown"),
        }
        if sys_data.get("data"):
            d = sys_data["data"]
            result["cpu_percent"] = d.get("cpu", {}).get("percent", 0)
            result["memory_percent"] = d.get("memory", {}).get("percent", 0)
        return result

    def _fetch_docker():
        from app.services import get_docker
        docker_data = get_docker()
        result = {
            "source": docker_data.get("source", "unknown"),
            "status": docker_data.get("collector_status", "unknown"),
        }
        if docker_data.get("data"):
            d = docker_data["data"]
            result["total"] = d.get("total", 0)
            result["running"] = d.get("running", 0)
            result["unhealthy"] = d.get("unhealthy", 0)
        return result

    def _fetch_omnis():
        from app.services import get_omnis_status
        omnis_data = get_omnis_status()
        return {
            "source": omnis_data.get("source", "unknown"),
            "status": omnis_data.get("collector_status", "unknown"),
        }

    def _fetch_git():
        from app.services import get_git
        git_data = get_git()
        result = {
            "source": git_data.get("source", "unknown"),
            "status": git_data.get("collector_status", "unknown"),
        }
        if git_data.get("data"):
            d = git_data["data"]
            result["dirty"] = d.get("dirty", 0) > 0
            result["dirty_count"] = d.get("dirty", 0)
            repos = d.get("repositories", [])
            primary = next(
                (r for r in repos if "kratos" in r.get("name", "").lower()),
                repos[0] if repos else {},
            )
            result["branch"] = primary.get("branch", "—")
        return result

    def _fetch_activitywatch():
        from app.services import get_activitywatch_status
        aw_data = get_activitywatch_status()
        return {
            "source": aw_data.get("source", "unknown"),
            "status": aw_data.get("collector_status", "unknown"),
        }

    return _parallel_fetch({
        "system": _fetch_system,
        "docker": _fetch_docker,
        "omnis": _fetch_omnis,
        "git": _fetch_git,
        "activitywatch": _fetch_activitywatch,
    }, timeout=SUB_COLLECTOR_TIMEOUT)


def _get_today_execution() -> dict:
    from app.services.execution_plan_service import get_today_plan
    from app.services.calendar_service import get_overdue_events, detect_missing_deadlines

    plan = get_today_plan()
    try:
        overdue = get_overdue_events()
    except Exception:
        overdue = []
    try:
        missing = detect_missing_deadlines()
    except Exception:
        missing = []

    return {
        "plan": plan,
        "overdue_count": len(overdue) if isinstance(overdue, list) else 0,
        "missing_deadlines_count": len(missing) if isinstance(missing, list) else 0,
    }


def _get_today_agenda() -> list:
    from app.services.calendar_service import get_today_events
    return get_today_events()


def _get_recent_checkpoints() -> list:
    from app.services import get_checkpoints
    checkpoints = get_checkpoints()
    if isinstance(checkpoints, list):
        return checkpoints[:5]
    return []


def _get_mission_lens() -> dict:
    from app.services.mission_intelligence_service import get_mission_lens
    return get_mission_lens()


# ── Section registry ────────────────────────────────────────────────────────

SECTIONS = {
    "context": _get_context,
    "alerts": _get_active_alerts,
    "mentor_signals": _get_mentor_signals,
    "next_best_action": _get_next_best_action,
    "collector_status": _get_collector_status,
    "today_execution": _get_today_execution,
    "today_agenda": _get_today_agenda,
    "recent_checkpoints": _get_recent_checkpoints,
    "mission_lens": _get_mission_lens,
}


# ── Build helpers ───────────────────────────────────────────────────────────


def _build_section(name: str, fn) -> tuple[str, dict, dict]:
    """Build one section with cache check, timing, and error isolation.
    Returns (name, data, meta_entry).
    """
    from app.services.live_cache_service import get_cached, set_cache

    t0 = time.monotonic()
    meta = {"status": "ok", "cached": False, "cache_age_seconds": 0, "elapsed_ms": 0}

    # Check cache
    ttl = CACHE_TTL.get(name, 10.0)
    hit, cached_data, age = get_cached(name, ttl=ttl)
    if hit:
        elapsed = (time.monotonic() - t0) * 1000
        meta["elapsed_ms"] = round(elapsed, 1)
        meta["cached"] = True
        meta["cache_age_seconds"] = round(age, 1)
        return name, cached_data, meta

    # Build fresh
    try:
        data = fn()
        set_cache(name, data)
    except Exception as e:
        # Try stale cache as last resort
        hit2, stale_data, age2 = get_cached(name, ttl=999999.0)  # any age
        if hit2:
            meta["status"] = "degraded"
            meta["cached"] = True
            meta["cache_age_seconds"] = round(age2, 1)
            meta["error"] = str(e)
            elapsed = (time.monotonic() - t0) * 1000
            meta["elapsed_ms"] = round(elapsed, 1)
            return name, stale_data, meta
        data = {"error": str(e), "degraded": True}
        meta["status"] = "error"

    elapsed = (time.monotonic() - t0) * 1000
    meta["elapsed_ms"] = round(elapsed, 1)
    return name, data, meta


# ── Public API ───────────────────────────────────────────────────────────────


def build_live_payload() -> dict:
    """Aggregate all live data into one payload.

    All sections start in parallel (one worker per section).
    futures_wait() enforces a single global deadline — no thread holds up the response
    beyond SECTION_TIMEOUT. executor.shutdown(wait=False) discards slow threads
    immediately after the deadline so the caller is never blocked by __exit__.
    """
    t_start = time.monotonic()
    payload = {"timestamp": datetime.now(timezone.utc).isoformat()}
    meta_sections = {}

    executor = ThreadPoolExecutor(max_workers=len(SECTIONS))
    futures_map = {
        name: executor.submit(_build_section, name, fn)
        for name, fn in SECTIONS.items()
    }

    done, not_done = futures_wait(futures_map.values(), timeout=SECTION_TIMEOUT)
    future_to_name = {f: n for n, f in futures_map.items()}

    for future in done:
        name = future_to_name[future]
        try:
            section_name, data, section_meta = future.result()
            payload[section_name] = data
            meta_sections[section_name] = section_meta
        except Exception as e:
            payload[name] = {"error": str(e), "degraded": True}
            meta_sections[name] = {
                "status": "error",
                "cached": False,
                "cache_age_seconds": 0,
                "elapsed_ms": 0,
                "error": str(e),
            }

    for future in not_done:
        name = future_to_name[future]
        from app.services.live_cache_service import get_cached
        hit, stale, age = get_cached(name, ttl=999999.0)
        if hit:
            payload[name] = stale
            meta_sections[name] = {
                "status": "degraded",
                "cached": True,
                "cache_age_seconds": round(age, 1),
                "elapsed_ms": round(SECTION_TIMEOUT * 1000),
                "error": "section timed out",
            }
        else:
            payload[name] = {"error": "timeout", "degraded": True}
            meta_sections[name] = {
                "status": "error",
                "cached": False,
                "cache_age_seconds": 0,
                "elapsed_ms": round(SECTION_TIMEOUT * 1000),
                "error": "section timed out",
            }

    # Release threads immediately — do not block on slow workers still running
    executor.shutdown(wait=False, cancel_futures=True)

    total_ms = (time.monotonic() - t_start) * 1000
    degraded_count = sum(1 for m in meta_sections.values() if m["status"] != "ok")
    cached_count = sum(1 for m in meta_sections.values() if m["cached"])

    payload["_live_meta"] = {
        "build_time_ms": round(total_ms, 1),
        "section_count": len(SECTIONS),
        "sections": meta_sections,
        "degraded_count": degraded_count,
        "cached_count": cached_count,
        "mode": "live" if degraded_count == 0 else "degraded",
    }

    return payload


def get_live_snapshot() -> dict:
    """Return the live payload as a plain dict (for JSON endpoint)."""
    return build_live_payload()
