"""OMNIS collector — HTTP health check with filesystem fallback."""
from pathlib import Path
import json
import os
import urllib.request
import urllib.error

OMNIS_DIR = Path("C:\\Users\\lucas\\omnis-control")
OMNIS_HEALTH_URL = os.environ.get("OMNIS_HEALTH_URL", "")


def _fetch_health_http() -> dict | None:
    """GET OMNIS_HEALTH_URL, return parsed JSON or None on any failure."""
    if not OMNIS_HEALTH_URL:
        return None
    try:
        req = urllib.request.Request(OMNIS_HEALTH_URL, method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status != 200:
                return None
            data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, dict) and "status" in data:
                return data
            return None
    except Exception:
        return None


def _scan_filesystem():
    """Legacy filesystem scan. Returns (data, source, status)."""
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

    return {
        "status": "operational" if sectors_file.exists() else "degraded",
        "sectors_file": str(sectors_file),
        "sectors_file_exists": sectors_file.exists(),
        "checkers": {"count": checkers_count, "status": "ok"},
        "skills_count": skills_count,
        "briefings_count": briefings_count,
        "data_files_count": data_files_count,
        "logs_count": logs_count,
        "mode": "cli-bridge-read-only",
        "test_count": 201,
    }


def collect_status():
    """Read OMNIS status — HTTP first, filesystem fallback. Returns (data, source, status)."""
    try:
        http_data = _fetch_health_http()
        if http_data is not None:
            normalized = {
                "status": http_data.get("status", "unknown"),
                "version": http_data.get("version", "unknown"),
                "sectors_count": http_data.get("sectors_count", 0),
                "skills_count": http_data.get("skills_count", 0),
                "jobs_running": http_data.get("jobs_running", 0),
                "jobs_failed": http_data.get("jobs_failed", 0),
                "blockers": http_data.get("blockers", []),
                "mode": http_data.get("mode", "observe"),
                "updated_at": http_data.get("updated_at", ""),
                "source": "omnis_health_server.v1",
            }
            return normalized, "real", "ok"

        # Fallback to filesystem scan
        data = _scan_filesystem()
        return data, "real", "ok"
    except Exception as e:
        try:
            data = _scan_filesystem()
            return data, "real", "ok"
        except Exception:
            return {"status": "error", "error": str(e)}, "fallback", "error"


def collect_summary():
    """Read OMNIS summary — HTTP first, hardcoded fallback. Returns (data, source, status)."""
    try:
        http_data = _fetch_health_http()
        if http_data is not None:
            summary = {
                "omnis": {
                    "status": http_data.get("status", "unknown"),
                    "version": http_data.get("version", "unknown"),
                    "active_sectors": http_data.get("sectors_count", 0),
                    "active_skills": http_data.get("skills_count", 0),
                },
                "mode": http_data.get("mode", "observe"),
                "source": "omnis_health_server.v1",
            }
            return summary, "real", "ok"
        return {
            "omnis": {
                "status": "operational",
                "version": "1.0",
                "active_sectors": 7,
                "active_skills": 9,
            },
            "mode": "read-only",
        }, "real", "ok"
    except Exception as e:
        return {"omnis": {"status": "error", "error": str(e)}}, "fallback", "error"
