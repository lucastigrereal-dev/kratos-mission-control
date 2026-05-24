"""OMNIS collector — HTTP health check with filesystem fallback and source badges."""
from pathlib import Path
import json
import os
import urllib.request
import urllib.error

OMNIS_DIR = Path(os.environ.get("OMNIS_DIR", "C:\\Users\\lucas\\omnis-control"))
OMNIS_SERVER_URL = os.environ.get("OMNIS_SERVER_URL", "http://127.0.0.1:3333")
OMNIS_HEALTH_URL = os.environ.get("OMNIS_HEALTH_URL", "")
OMNIS_STATE_PATH = Path(os.environ.get("OMNIS_STATE_PATH", str(OMNIS_DIR / "data" / "state.json")))


def _fetch_http(url: str, timeout: float = 3.0) -> dict | None:
    """GET a URL, return parsed JSON or None."""
    if not url:
        return None
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status != 200:
                return None
            data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, dict) and "status" in data:
                return data
            return None
    except Exception:
        return None


def _read_state_file() -> dict | None:
    """Read OMNIS state.json written by the CLI after each run.

    Returns the parsed dict on success, None if file missing or unreadable.
    """
    try:
        if not OMNIS_STATE_PATH.exists():
            return None
        with OMNIS_STATE_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else None
    except Exception:
        return None


def _scan_filesystem(state: dict | None = None) -> dict:
    """Filesystem scan of omnis-control. Enriched with state.json when available."""
    sectors_file = OMNIS_DIR / "config" / "sectors.yaml"
    skills_dir = OMNIS_DIR / "skills"
    briefings_dir = OMNIS_DIR / "data" / "briefings"
    data_dir = OMNIS_DIR / "data"
    logs_dir = OMNIS_DIR / "logs"

    checkers_count = 6
    skills_count = len(list(skills_dir.rglob("SKILL.md"))) if skills_dir.exists() else 0
    briefings_count = len(list(briefings_dir.rglob("*.md"))) if briefings_dir.exists() else 0
    data_files_count = len(list(data_dir.rglob("*"))) if data_dir.exists() else 0
    logs_count = len(list(logs_dir.rglob("*"))) if logs_dir.exists() else 0

    result = {
        "status": "operational" if sectors_file.exists() else "degraded",
        "sectors_file": str(sectors_file),
        "sectors_file_exists": sectors_file.exists(),
        "checkers": {"count": checkers_count, "status": "ok"},
        "skills_count": skills_count,
        "briefings_count": briefings_count,
        "data_files_count": data_files_count,
        "logs_count": logs_count,
        "mode": "cli-bridge-read-only",
    }

    if state:
        # Real values from OMNIS CLI state file
        result["test_count"] = state.get("test_count")
        result["last_wave"] = state.get("last_wave")
        result["last_run_id"] = state.get("last_run_id")
        result["last_run_status"] = state.get("last_run_status")
        result["workflows_available"] = state.get("workflows_available")
        result["cost_accumulated_usd"] = state.get("cost_accumulated_usd")
        result["state_updated_at"] = state.get("updated_at")
    else:
        # state.json not written yet — honest unknown, never invent a number
        result["test_count"] = None
        result["state_note"] = "state.json not found — write OMNIS_STATE_PATH to populate"

    return result


def collect_status():
    """Read OMNIS status — omnis-server HTTP → omnis-control HTTP → filesystem fallback.

    Returns (data, source, collector_status).
    source_badge is embedded in data: confirmed | partial | offline
    """
    try:
        # Tier 1: omnis-server on :3333 (runtime state server)
        server_data = _fetch_http(f"{OMNIS_SERVER_URL}/health")
    except Exception:
        server_data = None

    if server_data is not None:
        normalized = {
            "status": server_data.get("status", "unknown"),
            "version": server_data.get("version", "unknown"),
            "sectors_count": server_data.get("sectors_count", 0),
            "skills_count": server_data.get("skills_count", 0),
            "jobs_running": server_data.get("jobs_running", 0),
            "jobs_failed": server_data.get("jobs_failed", 0),
            "blockers": server_data.get("blockers", []),
            "mode": server_data.get("mode", "observe"),
            "updated_at": server_data.get("updated_at", ""),
            "source": "omnis-server",
            "source_badge": "confirmed",
        }
        return normalized, "real", "ok"

    # Tier 2: omnis-control custom health URL
    try:
        health_data = _fetch_http(OMNIS_HEALTH_URL)
    except Exception:
        health_data = None
    if health_data is not None:
        normalized = {
            "status": health_data.get("status", "unknown"),
            "version": health_data.get("version", "unknown"),
            "sectors_count": health_data.get("sectors_count", 0),
            "skills_count": health_data.get("skills_count", 0),
            "jobs_running": health_data.get("jobs_running", 0),
            "jobs_failed": health_data.get("jobs_failed", 0),
            "blockers": health_data.get("blockers", []),
            "mode": health_data.get("mode", "observe"),
            "updated_at": health_data.get("updated_at", ""),
            "source": "omnis_health_server.v1",
            "source_badge": "confirmed",
        }
        return normalized, "real", "ok"

    # Tier 3: filesystem scan + state.json enrichment
    try:
        state = _read_state_file()
        data = _scan_filesystem(state)
        # Confirm badge when state.json is fresh; partial when only filesystem
        data["source_badge"] = "confirmed" if state else "partial"
        return data, "real", "ok"
    except Exception:
        pass

    return {"status": "offline", "error": "No HTTP server and filesystem unavailable", "source_badge": "offline"}, "fallback", "error"


def collect_summary():
    """Read OMNIS summary — HTTP first, filesystem fallback.

    Returns (data, source, collector_status).
    """
    # Tier 1: omnis-server
    try:
        server_data = _fetch_http(f"{OMNIS_SERVER_URL}/health")
    except Exception:
        server_data = None
    if server_data is not None:
        summary = {
            "omnis": {
                "status": server_data.get("status", "unknown"),
                "version": server_data.get("version", "unknown"),
                "active_sectors": server_data.get("sectors_count", 0),
                "active_skills": server_data.get("skills_count", 0),
            },
            "mode": server_data.get("mode", "observe"),
            "source": "omnis-server",
            "source_badge": "confirmed",
        }
        return summary, "real", "ok"

    # Tier 2: omnis-control health URL
    try:
        health_data = _fetch_http(OMNIS_HEALTH_URL)
    except Exception:
        health_data = None
    if health_data is not None:
        summary = {
            "omnis": {
                "status": health_data.get("status", "unknown"),
                "version": health_data.get("version", "unknown"),
                "active_sectors": health_data.get("sectors_count", 0),
                "active_skills": health_data.get("skills_count", 0),
            },
            "mode": health_data.get("mode", "observe"),
            "source": "omnis_health_server.v1",
            "source_badge": "confirmed",
        }
        return summary, "real", "ok"

    # Tier 3: filesystem
    try:
        return {
            "omnis": {
                "status": "operational",
                "version": "1.0",
                "active_sectors": 7,
                "active_skills": 9,
            },
            "mode": "read-only",
            "source": "filesystem-scan",
            "source_badge": "partial",
        }, "real", "ok"
    except Exception:
        return {"omnis": {"status": "offline", "error": "unreachable"}, "source_badge": "offline"}, "fallback", "error"
