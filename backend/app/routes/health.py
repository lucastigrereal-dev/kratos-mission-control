from fastapi import APIRouter
from app.services import (
    get_system, get_docker, get_git, get_akasha_status, get_qdrant_status, get_omnis_status,
    get_ollama_status, get_publisher_os_status, get_supabase_status, get_redis_status, get_n8n_status,
)

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    collectors = {}
    degraded = []
    errors = []

    for name, fn in [
        ("system", get_system),
        ("docker", get_docker),
        ("git", get_git),
        ("akasha", get_akasha_status),
        ("qdrant", get_qdrant_status),
        ("omnis", get_omnis_status),
        ("ollama", get_ollama_status),
        ("publisher_os", get_publisher_os_status),
        ("supabase", get_supabase_status),
        ("redis", get_redis_status),
        ("n8n", get_n8n_status),
    ]:
        try:
            result = fn()
            status = result.get("collector_status", "unknown")
            collectors[name] = {
                "status": status,
                "source": result.get("source", "unknown"),
            }
            if status == "degraded":
                degraded.append(name)
            elif status == "error":
                errors.append(name)
        except Exception as e:
            collectors[name] = {"status": "error", "source": "exception", "error": str(e)}
            errors.append(name)

    overall = "error" if errors else ("degraded" if degraded else "ok")

    return {
        "source": "real",
        "collector_status": overall,
        "data": {
            "status": overall,
            "version": "0.12.0",
            "phase": "0.12 — KRATOS Live Cockpit",
            "project": "kratos-mission-control",
            "mode": "local-first",
            "collectors": collectors,
            "degraded": degraded,
            "errors": errors,
        },
    }


@router.get("/health/full")
def health_full():
    """Comprehensive health check — collectors + Redis + event bus + external services."""
    try:
        from app.services.health_feed_service import get_health_feed
        return get_health_feed()
    except Exception as e:
        return {"overall": "error", "error": str(e)}
