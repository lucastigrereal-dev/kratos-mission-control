"""Qdrant collector — vector database health check with Docker awareness."""
import subprocess
import json
import socket
import urllib.request


def _check_qdrant_port(host: str = "127.0.0.1", port: int = 6333, timeout: float = 2.0) -> bool:
    """TCP connect to Qdrant HTTP port. Returns True if port is open."""
    try:
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return True
    except Exception:
        return False


def _find_qdrant_container() -> dict | None:
    """Find publisher-os-qdrant-1 container via docker inspect."""
    try:
        result = subprocess.run(
            ["docker", "inspect", "publisher-os-qdrant-1"],
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
            "started_at": state.get("StartedAt", ""),
            "finished_at": state.get("FinishedAt", ""),
            "exit_code": state.get("ExitCode", 0),
            "health": state.get("Health", {}).get("Status", "unknown") if state.get("Health") else "no-healthcheck",
            "image": container.get("Config", {}).get("Image", ""),
            "restart_policy": container.get("HostConfig", {}).get("RestartPolicy", {}).get("Name", "unknown"),
        }
    except FileNotFoundError:
        return None
    except Exception:
        return None


def _get_qdrant_collections() -> dict | None:
    """Query Qdrant /collections endpoint for collection inventory."""
    try:
        req = urllib.request.Request("http://127.0.0.1:6333/collections")
        req.add_header("Accept", "application/json")
        with urllib.request.urlopen(req, timeout=3) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


def _get_collection_info(collection_name: str) -> dict | None:
    """Query Qdrant collection info including point count."""
    try:
        req = urllib.request.Request(f"http://127.0.0.1:6333/collections/{collection_name}")
        req.add_header("Accept", "application/json")
        with urllib.request.urlopen(req, timeout=3) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


def collect_status():
    """Read Qdrant operational memory status — Docker container + HTTP API.

    Returns (data, source, collector_status).
    source_badge in data: confirmed | partial | offline
    """
    container = _find_qdrant_container()
    port_open = _check_qdrant_port()
    collections_raw = _get_qdrant_collections()

    # Build collection details
    collections = []
    if collections_raw and collections_raw.get("status") == "ok":
        for col in collections_raw.get("result", {}).get("collections", []):
            name = col["name"]
            info = _get_collection_info(name)
            points = 0
            dims = 0
            if info and info.get("status") == "ok":
                result = info.get("result", {})
                points = result.get("points_count", 0)
                vectors_config = result.get("config", {}).get("params", {}).get("vectors", {})
                dims = vectors_config.get("size", 0)
            collections.append({
                "name": name,
                "points": points,
                "dimensions": dims,
            })

    total_points = sum(c["points"] for c in collections)
    memory_is_empty = total_points == 0

    # Both container running + API responding = confirmed
    if container and container["running"] and port_open and collections_raw:
        return {
            "status": "healthy" if not memory_is_empty else "healthy_empty",
            "container": container,
            "port": 6333,
            "api_responding": True,
            "collections": collections,
            "total_collections": len(collections),
            "total_points": total_points,
            "memory_is_empty": memory_is_empty,
            "restart_policy": container.get("restart_policy", "unknown"),
            "has_healthcheck": container.get("health") != "no-healthcheck",
            "source_badge": "confirmed",
        }, "real", "ok"

    # Container running but API not responding = degraded
    if container and container["running"] and not port_open:
        return {
            "status": "degraded",
            "container": container,
            "port": 6333,
            "api_responding": False,
            "error": "Container running but Qdrant API not responding on port 6333",
            "source_badge": "partial",
        }, "real", "ok"

    # Container exists but not running
    if container and not container["running"]:
        return {
            "status": "stopped",
            "container": container,
            "port": 6333,
            "api_responding": port_open,
            "error": f"Container status: {container['status']} (exit code {container['exit_code']})",
            "source_badge": "offline",
        }, "real", "ok"

    # Port responding but no container (bare-metal Qdrant?)
    if port_open:
        return {
            "status": "external",
            "container": None,
            "port": 6333,
            "api_responding": True,
            "collections": collections,
            "note": "Qdrant responding but container publisher-os-qdrant-1 nao encontrado",
            "source_badge": "partial",
        }, "real", "ok"

    # Nothing
    return {
        "status": "offline",
        "container": None,
        "port": 6333,
        "api_responding": False,
        "error": "Qdrant indisponivel — container nao encontrado, porta fechada",
        "source_badge": "offline",
    }, "fallback", "error"
