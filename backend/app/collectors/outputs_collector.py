"""Outputs collector — scan document/output directories."""
from pathlib import Path

OUTPUT_DIRS = [
    Path("C:\\Users\\lucas\\kratos-mission-control\\docs"),
    Path("C:\\Users\\lucas\\omnis-control\\docs"),
    Path("C:\\Users\\lucas\\omnis-control\\logs"),
    Path("C:\\Users\\lucas\\omnis-control\\data"),
]


def collect():
    """Scan output directories. Returns (data, source, status)."""
    try:
        results = []
        for d in OUTPUT_DIRS:
            if d.exists():
                files = list(d.rglob("*"))
                results.append({
                    "path": str(d),
                    "name": d.name,
                    "file_count": len([f for f in files if f.is_file()]),
                    "dir_count": len([f for f in files if f.is_dir()]),
                })
        return results, "real", "ok"
    except Exception as e:
        return [], "fallback", "error"
