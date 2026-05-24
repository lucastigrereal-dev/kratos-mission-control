"""Observability Feed Service — telemetry aggregation for cockpit.

Wave 5: Aggregates metrics, traces, and telemetry from collectors,
event bridge, and live event service. Provides trace_id generation
and rollup summaries.
"""
import time
import uuid
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from datetime import datetime, timezone

OBS_TIMEOUT = 3.0


def generate_trace_id() -> str:
    """Generate a trace_id for correlation across services."""
    return f"trace-{uuid.uuid4().hex[:12]}"


def _get_collector_metrics() -> dict:
    """Aggregate metrics from all collectors."""
    from app.services import get_system, get_docker, get_omnis_status
    from app.services.event_bridge import get_status as get_event_status

    metrics = {"timestamp": datetime.now(timezone.utc).isoformat(), "collectors": {}}

    # System metrics
    try:
        sys_result = get_system()
        if sys_result.get("data"):
            d = sys_result["data"]
            metrics["system"] = {
                "cpu_percent": d.get("cpu", {}).get("percent", 0),
                "memory_percent": d.get("memory", {}).get("percent", 0),
                "disk_percent": d.get("disk", {}).get("percent", 0),
                "hostname": d.get("hostname", ""),
                "uptime_hours": d.get("uptime_hours", 0),
            }
    except Exception:
        metrics["system"] = {"error": "collector_failed"}

    # Docker metrics
    try:
        docker_result = get_docker()
        if docker_result.get("data"):
            d = docker_result["data"]
            metrics["docker"] = {
                "total": d.get("total", 0),
                "running": d.get("running", 0),
                "unhealthy": d.get("unhealthy", 0),
            }
    except Exception:
        metrics["docker"] = {"error": "collector_failed"}

    # Event metrics
    try:
        evt = get_event_status()
        metrics["events"] = {
            "received": evt.get("listener", {}).get("events_received", 0),
            "heartbeats": evt.get("heartbeat", {}).get("count", 0),
            "ring_buffer_size": evt.get("listener", {}).get("ring_buffer_size", 0),
            "channels": evt.get("listener", {}).get("channels", []),
        }
    except Exception:
        metrics["events"] = {"error": "event_bridge_unavailable"}

    return metrics


def _get_live_telemetry() -> dict:
    """Get telemetry from the live event service."""
    try:
        from app.services.live_event_service import build_live_payload
        payload = build_live_payload()
        meta = payload.get("_live_meta", {})
        return {
            "build_time_ms": meta.get("build_time_ms", 0),
            "section_count": meta.get("section_count", 0),
            "degraded_count": meta.get("degraded_count", 0),
            "cached_count": meta.get("cached_count", 0),
            "mode": meta.get("mode", "unknown"),
            "sections": meta.get("sections", {}),
        }
    except Exception as e:
        return {"error": str(e)}


def _get_trace_summary() -> dict:
    """Get trace summary from event bridge recent events."""
    try:
        from app.services.event_bridge import get_recent_events
        events = get_recent_events(n=50)
        traces = {}
        events_with_trace = 0
        events_without_trace = 0

        for event in events:
            trace_id = event.get("trace_id")
            if trace_id:
                events_with_trace += 1
                if trace_id not in traces:
                    traces[trace_id] = {"count": 0, "event_types": [], "first_seen": event.get("timestamp")}
                traces[trace_id]["count"] += 1
                traces[trace_id]["event_types"].append(event.get("event_type", "unknown"))
            else:
                events_without_trace += 1

        return {
            "total_events_sampled": len(events),
            "events_with_trace": events_with_trace,
            "events_without_trace": events_without_trace,
            "unique_traces": len(traces),
            "trace_propagation_pct": round(
                events_with_trace / max(len(events), 1) * 100, 1
            ),
        }
    except Exception as e:
        return {"error": str(e)}


def get_observability_feed() -> dict:
    """Build the observability payload — metrics + telemetry + traces."""
    t_start = time.monotonic()

    executor = ThreadPoolExecutor(max_workers=3)
    f_metrics = executor.submit(_get_collector_metrics)
    f_telemetry = executor.submit(_get_live_telemetry)
    f_traces = executor.submit(_get_trace_summary)

    done, _ = futures_wait([f_metrics, f_telemetry, f_traces], timeout=OBS_TIMEOUT)

    metrics = f_metrics.result() if f_metrics in done else {"error": "timeout"}
    telemetry = f_telemetry.result() if f_telemetry in done else {"error": "timeout"}
    traces = f_traces.result() if f_traces in done else {"error": "timeout"}

    executor.shutdown(wait=False, cancel_futures=True)

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
        "telemetry": telemetry,
        "traces": traces,
        "_obs_meta": {
            "build_time_ms": round((time.monotonic() - t_start) * 1000, 1),
            "sources": ["collectors", "live_event_service", "event_bridge"],
            "mode": "live",
        },
    }
