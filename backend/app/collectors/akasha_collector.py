"""AKASHA collector — PostgreSQL/pgvector health check with Docker awareness."""
import subprocess
import json
import socket


def _check_postgres_port(host: str = "127.0.0.1", port: int = 5432, timeout: float = 2.0) -> bool:
    """TCP connect to PostgreSQL port. Returns True if port is open."""
    try:
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return True
    except Exception:
        return False


def _find_akasha_container() -> dict | None:
    """Find akasha-postgres container via docker inspect. Returns container info or None."""
    try:
        result = subprocess.run(
            ["docker", "inspect", "akasha-postgres"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode != 0:
            return None
        data = json.loads(result.stdout)
        if not data:
            return None
        container = data[0]
        state = container.get("State", {})
        return {
            "id": container.get("Id", "")[:12],
            "name": container.get("Name", "").lstrip("/"),
            "running": state.get("Running", False),
            "status": state.get("Status", ""),
            "health": state.get("Health", {}).get("Status", "unknown") if state.get("Health") else "no-healthcheck",
            "image": container.get("Config", {}).get("Image", ""),
            "created": container.get("Created", ""),
        }
    except FileNotFoundError:
        return None
    except Exception:
        return None


def collect_status():
    """Read AKASHA memory status — Docker container + PostgreSQL port.

    Returns (data, source, collector_status).
    source_badge in data: confirmed | partial | offline
    """
    container = _find_akasha_container()
    pg_responding = _check_postgres_port()

    # Both Docker container healthy + port open = confirmed
    if container and container["running"] and pg_responding:
        return {
            "status": "healthy",
            "container": container,
            "postgres_port": 5432,
            "postgres_responding": True,
            "vector_engine": "pgvector/pgvector:pg16",
            "source_badge": "confirmed",
        }, "real", "ok"

    # Container running but port not responding = degraded
    if container and container["running"] and not pg_responding:
        return {
            "status": "degraded",
            "container": container,
            "postgres_port": 5432,
            "postgres_responding": False,
            "error": "Container running but PostgreSQL port 5432 not responding",
            "source_badge": "partial",
        }, "real", "ok"

    # Container exists but not running
    if container and not container["running"]:
        return {
            "status": "stopped",
            "container": container,
            "postgres_port": 5432,
            "postgres_responding": pg_responding,
            "error": f"Container status: {container['status']}",
            "source_badge": "offline",
        }, "real", "ok"

    # Port responding but no container found (external PostgreSQL?)
    if pg_responding:
        return {
            "status": "external",
            "container": None,
            "postgres_port": 5432,
            "postgres_responding": True,
            "note": "PostgreSQL respondendo mas container akasha-postgres nao encontrado",
            "source_badge": "partial",
        }, "real", "ok"

    # Nothing
    return {
        "status": "offline",
        "container": None,
        "postgres_port": 5432,
        "postgres_responding": False,
        "error": "AKASHA PostgreSQL indisponivel",
        "source_badge": "offline",
    }, "fallback", "error"
