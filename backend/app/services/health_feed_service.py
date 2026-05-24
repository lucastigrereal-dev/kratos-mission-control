"""Health Feed Service — comprehensive health across all systems.

Wave 4: Adds health checks for Redis, event bus, and external services
not covered by existing collectors. Aggregates into a single health payload.
"""
import json
import socket
import time
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from datetime import datetime, timezone

HEALTH_TIMEOUT = 2.0  # per-check timeout


def _tcp_check(host: str, port: int, timeout: float = 1.5) -> dict:
    """Check if a TCP port is open."""
    try:
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return {"status": "ok", "latency_ms": round((time.monotonic() - time.monotonic()) * 1000, 1)}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def _redis_health() -> dict:
    """Check Redis health via ping."""
    try:
        import redis
        import os
        host = os.environ.get("KRATOS_REDIS_HOST", "127.0.0.1")
        port = int(os.environ.get("KRATOS_REDIS_PORT", "6381"))
        r = redis.Redis(host=host, port=port, socket_connect_timeout=2)
        t0 = time.monotonic()
        r.ping()
        latency = round((time.monotonic() - t0) * 1000, 1)
        return {"status": "ok", "host": host, "port": port, "latency_ms": latency}
    except Exception as e:
        return {"status": "error", "host": "127.0.0.1", "port": 6381, "error": str(e)}


def _event_bus_health() -> dict:
    """Check event bus health from event_bridge status."""
    try:
        from app.services.event_bridge import get_status
        status = get_status()
        listener = status.get("listener", {})
        heartbeat = status.get("heartbeat", {})
        return {
            "status": status.get("status", "unknown"),
            "listener": {
                "running": listener.get("running", False),
                "channels": listener.get("channels", []),
                "events_received": listener.get("events_received", 0),
                "ring_buffer_size": listener.get("ring_buffer_size", 0),
            },
            "heartbeat": {
                "running": heartbeat.get("running", False),
                "count": heartbeat.get("count", 0),
            },
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


def _external_service_health() -> dict:
    """Check external services via TCP port checks (parallel)."""
    services = {
        "publisher_os": ("127.0.0.1", 8000),
        "supabase_db": ("127.0.0.1", 5434),
        "ollama": ("127.0.0.1", 11434),
        "n8n": ("127.0.0.1", 5678),
    }

    results = {}
    for name, (host, port) in services.items():
        check = _tcp_check(host, port)
        results[name] = {
            "status": check["status"],
            "host": host,
            "port": port,
            "error": check.get("error"),
        }

    return results


def _collector_health() -> dict:
    """Aggregate health from all real collectors."""
    from app.services import get_system, get_docker, get_git
    from app.services import get_akasha_status, get_qdrant_status, get_omnis_status

    tasks = {
        "system": get_system,
        "docker": get_docker,
        "git": get_git,
        "akasha": get_akasha_status,
        "qdrant": get_qdrant_status,
        "omnis": get_omnis_status,
    }

    executor = ThreadPoolExecutor(max_workers=len(tasks))
    futures_map = {name: executor.submit(fn) for name, fn in tasks.items()}
    done, _ = futures_wait(futures_map.values(), timeout=HEALTH_TIMEOUT)

    results = {}
    for name, future in futures_map.items():
        if future in done:
            try:
                raw = future.result()
                results[name] = {
                    "status": raw.get("collector_status", "unknown"),
                    "source": raw.get("source", "unknown"),
                    "error": raw.get("error"),
                }
            except Exception as e:
                results[name] = {"status": "error", "source": "exception", "error": str(e)}
        else:
            results[name] = {"status": "error", "source": "timeout"}

    executor.shutdown(wait=False, cancel_futures=True)
    return results


def get_health_feed() -> dict:
    """Build comprehensive health payload for the cockpit.

    Aggregates: collector health + Redis health + event bus health + external services.
    All checks run in parallel per category.
    """
    t_start = time.monotonic()

    # Run independent health checks in parallel
    executor = ThreadPoolExecutor(max_workers=4)
    future_collectors = executor.submit(_collector_health)
    future_redis = executor.submit(_redis_health)
    future_event_bus = executor.submit(_event_bus_health)
    future_external = executor.submit(_external_service_health)

    done, _ = futures_wait(
        [future_collectors, future_redis, future_event_bus, future_external],
        timeout=5.0
    )

    collectors = future_collectors.result() if future_collectors in done else {}
    redis_h = future_redis.result() if future_redis in done else {"status": "timeout"}
    event_bus = future_event_bus.result() if future_event_bus in done else {"status": "timeout"}
    external = future_external.result() if future_external in done else {}

    executor.shutdown(wait=False, cancel_futures=True)

    # Compute overall health
    all_checks = {}
    all_checks.update({f"collector:{k}": v.get("status", "unknown") for k, v in collectors.items()})
    all_checks["redis"] = redis_h.get("status", "unknown")
    all_checks["event_bus"] = event_bus.get("status", "unknown")
    all_checks.update({f"external:{k}": v.get("status", "unknown") for k, v in external.items()})

    healthy = sum(1 for v in all_checks.values() if v == "ok")
    degraded = sum(1 for v in all_checks.values() if v == "degraded")
    error = sum(1 for v in all_checks.values() if v not in ("ok", "degraded"))

    overall = "error" if error > 0 else ("degraded" if degraded > 0 else "ok")

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "overall": overall,
        "summary": {
            "total_checks": len(all_checks),
            "healthy": healthy,
            "degraded": degraded,
            "error": error,
        },
        "collectors": collectors,
        "redis": redis_h,
        "event_bus": event_bus,
        "external_services": external,
        "_health_meta": {
            "build_time_ms": round((time.monotonic() - t_start) * 1000, 1),
            "mode": "live" if overall == "ok" else "degraded",
        },
    }
