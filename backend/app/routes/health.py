from fastapi import APIRouter
from app.services import (
    get_system, get_docker, get_git, get_akasha_status, get_qdrant_status, get_omnis_status,
    get_ollama_status, get_publisher_os_status, get_supabase_status, get_redis_status, get_n8n_status,
)

router = APIRouter(tags=["health"])


_CORE_COLLECTORS = {"system", "docker", "git", "akasha", "qdrant", "omnis"}
_EXTERNAL_COLLECTORS = {"ollama", "publisher_os", "supabase", "redis", "n8n"}


@router.get("/health")
def health():
    collectors = {}
    core_degraded = []
    core_errors = []
    external_degraded = []
    external_errors = []

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
            is_external = name in _EXTERNAL_COLLECTORS
            if status == "degraded":
                (external_degraded if is_external else core_degraded).append(name)
            elif status == "error":
                (external_errors if is_external else core_errors).append(name)
        except Exception as e:
            collectors[name] = {"status": "error", "source": "exception", "error": str(e)}
            is_external = name in _EXTERNAL_COLLECTORS
            (external_errors if is_external else core_errors).append(name)

    # Core errors/degraded affect overall status; external errors cap at "degraded"
    if core_errors:
        overall = "error"
    elif core_degraded or external_errors:
        overall = "degraded"
    else:
        overall = "ok"

    degraded = core_degraded + external_degraded
    errors = core_errors + external_errors

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
