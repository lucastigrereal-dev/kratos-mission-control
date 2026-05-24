from fastapi import APIRouter

router = APIRouter(prefix="/observability", tags=["observability"])


@router.get("/feed")
def observability_feed():
    """Observability feed — metrics, telemetry, and trace summary."""
    try:
        from app.services.observability_feed_service import get_observability_feed
        return get_observability_feed()
    except Exception as e:
        return {"error": str(e), "source": "error"}


@router.get("/traces")
def trace_summary():
    """Trace propagation summary from event bridge."""
    try:
        from app.services.observability_feed_service import _get_trace_summary
        return _get_trace_summary()
    except Exception as e:
        return {"error": str(e), "source": "error"}


@router.get("/metrics")
def metrics_snapshot():
    """Collector metrics snapshot."""
    try:
        from app.services.observability_feed_service import _get_collector_metrics
        return _get_collector_metrics()
    except Exception as e:
        return {"error": str(e), "source": "error"}
