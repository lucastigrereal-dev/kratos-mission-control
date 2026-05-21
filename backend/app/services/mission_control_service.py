r"""Mission Control Read-Only Backend — Parser for reports and system state.

Reads from C:/Users/lucas/reports/ and serves structured overviews.
Zero mutations, zero side effects.
"""
import json
import os
from pathlib import Path
from datetime import datetime, timezone

REPORTS_ROOT = Path(os.environ.get("KRATOS_REPORTS_ROOT", "C:/Users/lucas/reports"))


def _read_json(filename: str) -> dict | None:
    path = REPORTS_ROOT / filename
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _read_md(filename: str) -> str | None:
    path = REPORTS_ROOT / filename
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return None


def _list_autopilot_reports() -> list[str]:
    """List all files in reports/autopilot/."""
    autopilot = REPORTS_ROOT / "autopilot"
    if not autopilot.exists():
        return []
    return [f.name for f in autopilot.iterdir() if f.is_file()]


def get_overview() -> dict:
    """Aggregate overview from all available reports."""
    inventory = _read_json("architecture_inventory.json")
    autopilot_files = _list_autopilot_reports()

    return {
        "status": "ok",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "reports_root": str(REPORTS_ROOT),
        "reports_available": {
            "architecture_inventory": inventory is not None,
            "autopilot_files": autopilot_files,
        },
        "autopilot_status": _get_autopilot_status(),
    }


def get_health() -> dict:
    """System health from available data sources."""
    return {
        "status": "ok",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "checks": {
            "reports_accessible": REPORTS_ROOT.exists(),
            "architecture_inventory": _read_json("architecture_inventory.json") is not None,
        },
    }


def get_blockers() -> dict:
    """Known blockers from reports and autopilot state."""
    progress = _read_json("autopilot/autopilot_progress.json")
    blocked_blocks = []
    if progress:
        blocked_blocks = [k for k, v in progress.get("blocks", {}).items() if v.get("status") == "BLOCKED"]

    return {
        "status": "ok",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "blocked_count": len(blocked_blocks),
        "blocked_blocks": blocked_blocks,
        "source": "autopilot_progress.json",
    }


def get_capabilities() -> dict:
    """Capabilities from architecture inventory."""
    inventory = _read_json("architecture_inventory.json")
    if inventory:
        return {
            "status": "ok",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source": "architecture_inventory.json",
            "data": inventory,
        }
    return {
        "status": "degraded",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "fallback",
        "error": "architecture_inventory.json not found",
    }


def get_runtime() -> dict:
    """Runtime state from available sources."""
    return {
        "status": "ok",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "runtime": {
            "redis_containers": _get_redis_status(),
        },
    }


def _get_autopilot_status() -> dict:
    progress = _read_json("autopilot/autopilot_progress.json")
    if not progress:
        return {"loaded": False, "error": "autopilot_progress.json not found"}
    return {
        "loaded": True,
        "total_completed": progress.get("total_completed", 0),
        "total_pending": progress.get("total_pending", 0),
        "total_in_progress": progress.get("total_in_progress", 0),
    }


def _get_redis_status() -> list[dict]:
    """Check Redis containers from Docker (best-effort)."""
    import subprocess
    try:
        result = subprocess.run(
            ["docker", "ps", "--filter", "name=redis", "--format", "{{.Names}}\t{{.Status}}"],
            capture_output=True, text=True, timeout=5,
        )
        containers = []
        for line in result.stdout.strip().split("\n"):
            if line:
                parts = line.split("\t")
                containers.append({"name": parts[0], "status": parts[1] if len(parts) > 1 else "unknown"})
        return containers
    except Exception:
        return []
