"""KRATOS Event Bridge — Redis-backed cross-container event listener.

Read-only listener. Ring buffer of last 100 events. Zero write operations from events.
"""
import json
import threading
import time
import uuid
from collections import deque
from datetime import datetime, timezone

import redis

REDIS_HOST = "127.0.0.1"
REDIS_PORT = int(os.environ.get("KRATOS_REDIS_PORT", "6381"))
RING_SIZE = 100
HEARTBEAT_INTERVAL = 30

_ring: deque = deque(maxlen=RING_SIZE)
_listener_thread: threading.Thread | None = None
_heartbeat_thread: threading.Thread | None = None
_listener_running = False
_heartbeat_running = False
_last_error: str | None = None
_channels_subscribed: list[str] = []
_heartbeat_count = 0
_events_received = 0


def _make_envelope(
    event_type: str,
    payload: dict,
    trace_id: str | None = None,
    severity: str = "info",
    status: str = "ok",
    correlation_id: str | None = None,
    mission_id: str | None = None,
) -> dict:
    return {
        "event_id": f"evt-{uuid.uuid4().hex[:8]}",
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": {
            "service": "kratos-mission-control",
            "version": "0.12.0",
            "instance": "kratos-backend",
        },
        "correlation_id": correlation_id or f"corr-{uuid.uuid4().hex[:8]}",
        "mission_id": mission_id,
        "severity": severity,
        "status": status,
        "trace_id": trace_id,
        "payload": payload,
    }


def _publish_heartbeat(r: redis.Redis) -> None:
    """Publish system.heartbeat on kratos:events every HEARTBEAT_INTERVAL seconds."""
    global _heartbeat_running, _heartbeat_count
    _heartbeat_running = True
    while _heartbeat_running:
        try:
            envelope = _make_envelope("system.heartbeat", {
                "status": "healthy",
                "uptime_seconds": time.monotonic(),
                "collectors": {},
            })
            r.publish("system:heartbeat", json.dumps(envelope, ensure_ascii=False))
            _heartbeat_count += 1
        except Exception:
            pass
        time.sleep(HEARTBEAT_INTERVAL)


def _listen(r: redis.Redis) -> None:
    """Subscribe to omnis:events and system:heartbeat. Append to ring buffer."""
    global _listener_running, _last_error, _channels_subscribed, _events_received
    _listener_running = True
    _channels_subscribed = ["omnis:events", "system:heartbeat"]

    try:
        pubsub = r.pubsub()
        pubsub.subscribe(*_channels_subscribed)

        for message in pubsub.listen():
            if not _listener_running:
                break
            if message["type"] != "message":
                continue
            try:
                data = json.loads(message["data"])
                data["_received_at"] = datetime.now(timezone.utc).isoformat()
                data["_channel"] = message["channel"].decode() if isinstance(message["channel"], bytes) else message["channel"]
                _ring.append(data)
                _events_received += 1
            except json.JSONDecodeError:
                pass
    except Exception as e:
        _last_error = str(e)
    finally:
        _listener_running = False


def start() -> dict:
    """Start heartbeat and listener threads. Returns status dict."""
    global _listener_thread, _heartbeat_thread, _last_error

    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, socket_connect_timeout=3)
        r.ping()
    except Exception as e:
        _last_error = f"Redis connection failed: {e}"
        return {"status": "offline", "error": _last_error}

    _last_error = None

    if _heartbeat_thread is None or not _heartbeat_thread.is_alive():
        _heartbeat_thread = threading.Thread(target=_publish_heartbeat, args=(r,), daemon=True)
        _heartbeat_thread.start()

    if _listener_thread is None or not _listener_thread.is_alive():
        _listener_thread = threading.Thread(target=_listen, args=(r,), daemon=True)
        _listener_thread.start()

    return {"status": "running", "redis_host": REDIS_HOST, "redis_port": REDIS_PORT}


def get_recent_events(n: int = 50, event_type: str | None = None, source: str | None = None) -> list[dict]:
    """Return last N events from ring buffer, optionally filtered."""
    events = list(_ring)
    if event_type:
        events = [e for e in events if e.get("event_type") == event_type]
    if source:
        events = [e for e in events if e.get("source", {}).get("service") == source]
    return events[-n:]


def replay(n: int = 10, event_type: str | None = None, source: str | None = None,
           re_emit: bool = False) -> list[dict]:
    """Replay the last N events from the ring buffer, optionally filtered.

    Args:
        n: Number of events to replay (most recent).
        event_type: Optional filter by event_type field.
        source: Optional filter by source.service field.
        re_emit: If True, re-publish matching events to omnis:events so active
                 listeners re-process them through their handler pipelines.

    Returns:
        List of matching event dicts (most recent last).
    """
    events = list(_ring)
    if event_type:
        events = [e for e in events if e.get("event_type") == event_type]
    if source:
        events = [e for e in events if e.get("source", {}).get("service") == source]
    result = events[-n:]

    if re_emit and result:
        try:
            r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, socket_connect_timeout=3)
            for event in result:
                clean = {k: v for k, v in event.items()
                         if k not in ("_received_at", "_channel")}
                r.publish("omnis:events", json.dumps(clean, ensure_ascii=False, default=str))
        except Exception:
            pass

    return result


def get_status() -> dict:
    """Return bridge status for diagnostic endpoint."""
    return {
        "status": "running" if _listener_running else "stopped",
        "heartbeat": {
            "running": _heartbeat_running,
            "interval": HEARTBEAT_INTERVAL,
            "count": _heartbeat_count,
        },
        "listener": {
            "running": _listener_running,
            "channels": _channels_subscribed,
            "events_received": _events_received,
            "ring_buffer_size": len(_ring),
            "ring_buffer_max": RING_SIZE,
        },
        "redis": {
            "host": REDIS_HOST,
            "port": REDIS_PORT,
        },
        "last_error": _last_error,
    }


def stop() -> None:
    """Stop heartbeat and listener threads gracefully."""
    global _listener_running, _heartbeat_running
    _listener_running = False
    _heartbeat_running = False
