"""Git collector — repo status via git CLI."""
import subprocess
import json
from pathlib import Path

REPOS = [
    "C:\\Users\\lucas\\kratos-mission-control",
    "C:\\Users\\lucas\\daily-prophet-hotels",
    "C:\\Users\\lucas\\publisher-os",
    "C:\\Users\\lucas\\publisher-os-cockpit",
    "C:\\Users\\lucas\\omnis-control",
]


def _get_repo_status(path: str) -> dict:
    try:
        r = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, timeout=5, cwd=path,
        )
        dirty_files = [l for l in r.stdout.strip().split("\n") if l.strip()]

        branch_r = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, timeout=2, cwd=path,
        )
        branch = branch_r.stdout.strip()

        log_r = subprocess.run(
            ["git", "log", "--oneline", "-1", "--format=%h %s"],
            capture_output=True, text=True, timeout=2, cwd=path,
        )
        last_commit = log_r.stdout.strip()

        return {
            "path": path,
            "name": Path(path).name,
            "branch": branch,
            "last_commit": last_commit,
            "dirty": len(dirty_files) > 0,
            "dirty_count": len(dirty_files),
            "status": "dirty" if dirty_files else "clean",
        }
    except Exception as e:
        return {
            "path": path,
            "name": Path(path).name,
            "error": str(e),
            "status": "error",
        }


def collect():
    """Collect Git status for all tracked repos. Returns (data, source, status)."""
    repos = []
    for path in REPOS:
        if Path(path).exists():
            repos.append(_get_repo_status(path))

    degraded = sum(1 for r in repos if r.get("status") in ("dirty", "error"))
    return {
        "repositories": repos,
        "total": len(repos),
        "dirty": sum(1 for r in repos if r.get("dirty", False)),
        "status": "degraded" if degraded > 0 else "ok",
    }, "real", "ok"


def _fallback():
    """Fallback data when collector fails entirely."""
    return {
        "repositories": [{"name": Path(p).name, "path": p, "status": "unknown"} for p in REPOS],
        "total": len(REPOS),
        "status": "unknown",
    }
