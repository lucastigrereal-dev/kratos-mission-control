"""Docker collector — container status via docker CLI."""
import subprocess
import json


def collect():
    """Collect Docker container status. Returns (data, source, status)."""
    try:
        result = subprocess.run(
            ["docker", "ps", "-a", "--format", "json"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode != 0:
            return {"containers": [], "total": 0, "error": result.stderr.strip()}, "real", "degraded"

        containers = []
        for line in result.stdout.strip().split("\n"):
            if line.strip():
                try:
                    c = json.loads(line)
                    containers.append({
                        "id": c.get("ID", ""),
                        "name": c.get("Names", ""),
                        "image": c.get("Image", ""),
                        "status": c.get("State", ""),
                        "status_text": c.get("Status", ""),
                    })
                except json.JSONDecodeError:
                    pass

        running = sum(1 for c in containers if c["status"] == "running")
        unhealthy = sum(1 for c in containers if "unhealthy" in c.get("status_text", "").lower())

        return {
            "containers": containers,
            "total": len(containers),
            "running": running,
            "unhealthy": unhealthy,
            "source_badge": "real",
        }, "real", "ok"
    except FileNotFoundError:
        return {"containers": [], "total": 0, "error": "Docker not installed", "source_badge": "error"}, "fallback", "error"
    except subprocess.TimeoutExpired:
        return {"containers": [], "total": 0, "error": "Docker CLI timeout", "source_badge": "error"}, "fallback", "error"
    except Exception as e:
        return {"containers": [], "total": 0, "error": str(e), "source_badge": "error"}, "fallback", "error"
