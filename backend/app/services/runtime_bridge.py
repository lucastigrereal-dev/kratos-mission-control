"""Runtime Bridge — normalizes collector data for frontend consumption.

Wave 2: Bridges the gap between backend collector shapes and frontend expectations.
Each adapter transforms raw collector output into a normalized contract.
"""
import time
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from datetime import datetime, timezone

BRIDGE_TIMEOUT = 3.0


def normalize_collector_status(name: str, raw: dict) -> dict:
    """Normalize a single collector result to the frontend contract."""
    status = raw.get("collector_status", "unknown")
    data = raw.get("data") or {}
    source = raw.get("source", "unknown")

    normalized = {
        "collector": name,
        "status": _map_status(status),
        "source": source,
        "last_check": datetime.now(timezone.utc).isoformat(),
        "error": raw.get("error"),
    }

    # Add type-specific fields
    if name == "system" and data:
        normalized["cpu_percent"] = data.get("cpu", {}).get("percent", 0)
        normalized["memory_percent"] = data.get("memory", {}).get("percent", 0)
        normalized["hostname"] = data.get("hostname", "")
        normalized["uptime_hours"] = data.get("uptime_hours", 0)
    elif name == "docker" and data:
        normalized["total"] = data.get("total", 0)
        normalized["running"] = data.get("running", 0)
        normalized["unhealthy"] = data.get("unhealthy", 0)
    elif name == "git" and data:
        normalized["current_branch"] = data.get("current_branch", "")
        normalized["dirty"] = data.get("dirty", False)
        normalized["repos_tracked"] = data.get("repos_tracked", 0)

    return normalized


def _map_status(collector_status: str) -> str:
    """Map collector status to frontend health enum."""
    mapping = {
        "ok": "healthy",
        "degraded": "degraded",
        "error": "offline",
        "fallback": "degraded",
    }
    return mapping.get(collector_status, "unknown")


def build_bridge_payload() -> dict:
    """Build a normalized runtime bridge payload for frontend consumption.

    Returns data in the shape the frontend expects, sourced from real collectors.
    """
    from app.services import get_system, get_docker, get_git, get_akasha_status
    from app.services import get_qdrant_status, get_omnis_status

    t_start = time.monotonic()
    collectors = {}
    normalized = []

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

    done, _ = futures_wait(futures_map.values(), timeout=BRIDGE_TIMEOUT)

    for name, future in futures_map.items():
        if future in done:
            try:
                raw = future.result()
                collectors[name] = raw
                normalized.append(normalize_collector_status(name, raw))
            except Exception as e:
                collectors[name] = {"collector_status": "error", "source": "bridge_error", "error": str(e)}
                normalized.append({
                    "collector": name,
                    "status": "error",
                    "source": "bridge_error",
                    "last_check": datetime.now(timezone.utc).isoformat(),
                    "error": str(e),
                })
        else:
            collectors[name] = {"collector_status": "error", "source": "bridge_timeout"}
            normalized.append({
                "collector": name,
                "status": "error",
                "source": "bridge_timeout",
                "last_check": datetime.now(timezone.utc).isoformat(),
                "error": f"timeout after {BRIDGE_TIMEOUT}s",
            })

    executor.shutdown(wait=False, cancel_futures=True)

    # Aggregate system stats
    sys_data = collectors.get("system", {}).get("data", {})
    docker_data = collectors.get("docker", {}).get("data", {})
    git_data = collectors.get("git", {}).get("data", {})

    healthy = sum(1 for n in normalized if n["status"] == "healthy")
    degraded = sum(1 for n in normalized if n["status"] == "degraded")
    offline = sum(1 for n in normalized if n["status"] in ("offline", "error"))

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "runtime": {
            "cpu_percent": sys_data.get("cpu", {}).get("percent", 0),
            "memory_percent": sys_data.get("memory", {}).get("percent", 0),
            "hostname": sys_data.get("hostname", ""),
            "uptime_hours": sys_data.get("uptime_hours", 0),
        },
        "docker": {
            "total": docker_data.get("total", 0),
            "running": docker_data.get("running", 0),
            "unhealthy": docker_data.get("unhealthy", 0),
        },
        "git": {
            "current_branch": git_data.get("current_branch", ""),
            "dirty": git_data.get("dirty", False),
            "repos_tracked": git_data.get("repos_tracked", 0),
        },
        "collectors": normalized,
        "health": {
            "total": len(normalized),
            "healthy": healthy,
            "degraded": degraded,
            "offline": offline,
            "status": "ok" if offline == 0 else ("degraded" if degraded > 0 else "error"),
        },
        "_bridge_meta": {
            "build_time_ms": round((time.monotonic() - t_start) * 1000, 1),
            "sources_checked": len(normalized),
            "mode": "live" if offline == 0 else "degraded",
        },
    }
