"""External services health probe — TCP + HTTP checks for the 5 invisible services.

Probes Publisher OS, Supabase, Redis, Ollama, n8n which store.ts previously
hardcoded as "unknown". TCP probe for raw protocol services (Postgres, Redis),
HTTP probe for the rest. Each result carries source_badge for frontend display.
"""
import json
import os
import socket
import urllib.error
import urllib.request

# Configurable via env
PUBLISHER_OS_URL = os.environ.get("PUBLISHER_OS_URL", "http://localhost:3200")
SUPABASE_HOST = os.environ.get("SUPABASE_HOST", "localhost")
SUPABASE_PORT = int(os.environ.get("SUPABASE_PORT", "5434"))
REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6381"))
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
N8N_URL = os.environ.get("N8N_URL", "http://localhost:5678")

_TCP_TIMEOUT = 1.5
_HTTP_TIMEOUT = 2.0


def _tcp_probe(host: str, port: int) -> bool:
    """True if TCP connection to host:port succeeds within timeout."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(_TCP_TIMEOUT)
    try:
        return sock.connect_ex((host, port)) == 0
    except Exception:
        return False
    finally:
        sock.close()


def _http_probe(url: str, path: str = "/") -> tuple[bool, str]:
    """Returns (is_up, detail). is_up=True on HTTP 2xx. detail is version or error."""
    full_url = url.rstrip("/") + path
    try:
        req = urllib.request.Request(full_url, method="GET")
        with urllib.request.urlopen(req, timeout=_HTTP_TIMEOUT) as resp:
            if 200 <= resp.status < 300:
                try:
                    body = json.loads(resp.read().decode("utf-8"))
                    detail = (
                        body.get("version")
                        or body.get("ollama")
                        or ""
                    )
                    return True, str(detail)[:32] if detail else ""
                except Exception:
                    return True, ""
            return False, f"HTTP {resp.status}"
    except urllib.error.URLError as e:
        reason = str(e.reason) if hasattr(e, "reason") else str(e)
        return False, reason[:64]
    except Exception as e:
        return False, str(e)[:64]


def _probe_ollama() -> dict:
    is_up, detail = _http_probe(OLLAMA_URL, "/api/tags")
    return {
        "status": "live" if is_up else "offline",
        "url": OLLAMA_URL,
        "detail": detail,
        "source_badge": "confirmed" if is_up else "offline",
    }


def _probe_publisher_os() -> dict:
    is_up, detail = _http_probe(PUBLISHER_OS_URL, "/")
    return {
        "status": "live" if is_up else "offline",
        "url": PUBLISHER_OS_URL,
        "detail": detail,
        "source_badge": "confirmed" if is_up else "offline",
    }


def _probe_supabase() -> dict:
    is_up = _tcp_probe(SUPABASE_HOST, SUPABASE_PORT)
    return {
        "status": "live" if is_up else "offline",
        "host": SUPABASE_HOST,
        "port": SUPABASE_PORT,
        "protocol": "tcp",
        "source_badge": "confirmed" if is_up else "offline",
    }


def _probe_redis() -> dict:
    is_up = _tcp_probe(REDIS_HOST, REDIS_PORT)
    return {
        "status": "live" if is_up else "offline",
        "host": REDIS_HOST,
        "port": REDIS_PORT,
        "protocol": "tcp",
        "source_badge": "confirmed" if is_up else "offline",
    }


def _probe_n8n() -> dict:
    is_up, detail = _http_probe(N8N_URL, "/healthz")
    if not is_up:
        # n8n sometimes serves on / instead of /healthz
        is_up, detail = _http_probe(N8N_URL, "/")
    return {
        "status": "live" if is_up else "offline",
        "url": N8N_URL,
        "detail": detail,
        "source_badge": "confirmed" if is_up else "offline",
    }


_PROBES = {
    "publisher_os": _probe_publisher_os,
    "supabase": _probe_supabase,
    "redis": _probe_redis,
    "ollama": _probe_ollama,
    "n8n": _probe_n8n,
}


def _probe_one(name: str) -> dict:
    try:
        return _PROBES[name]()
    except Exception as e:
        return {"status": "unknown", "error": str(e)[:128], "source_badge": "offline"}


def collect() -> tuple[dict, str, str]:
    """Probe all 5 external services. Returns (data, source, collector_status)."""
    results = {name: _probe_one(name) for name in _PROBES}
    live = sum(1 for r in results.values() if r["status"] == "live")
    offline = sum(1 for r in results.values() if r["status"] == "offline")
    unknown = sum(1 for r in results.values() if r["status"] == "unknown")

    if offline + unknown == 0:
        overall = "ok"
    elif live > 0:
        overall = "degraded"
    else:
        overall = "error"

    return {
        "services": results,
        "summary": {"total": len(results), "live": live, "offline": offline, "unknown": unknown},
        "source_badge": "confirmed",
    }, "real", overall


# ── Individual collector wrappers (one per service for health.py) ────────────

def collect_ollama() -> tuple[dict, str, str]:
    r = _probe_one("ollama")
    status = "ok" if r["status"] == "live" else "error"
    return r, "real", status


def collect_publisher_os() -> tuple[dict, str, str]:
    r = _probe_one("publisher_os")
    status = "ok" if r["status"] == "live" else "error"
    return r, "real", status


def collect_supabase() -> tuple[dict, str, str]:
    r = _probe_one("supabase")
    status = "ok" if r["status"] == "live" else "error"
    return r, "real", status


def collect_redis() -> tuple[dict, str, str]:
    r = _probe_one("redis")
    status = "ok" if r["status"] == "live" else "error"
    return r, "real", status


def collect_n8n() -> tuple[dict, str, str]:
    r = _probe_one("n8n")
    status = "ok" if r["status"] == "live" else "error"
    return r, "real", status
