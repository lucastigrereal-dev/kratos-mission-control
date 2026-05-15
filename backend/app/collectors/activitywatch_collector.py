"""ActivityWatch collector — HTTP API to local ActivityWatch instance."""
import json
import re
from datetime import datetime, timezone

AW_BASE = "http://localhost:5600"

# Sensitive data patterns to sanitize
SENSITIVE_PATTERNS = [
    (re.compile(r"Bearer\s+[A-Za-z0-9\-._~+/]+=*", re.IGNORECASE), "[FILTERED_TOKEN]"),
    (re.compile(r"sk-[A-Za-z0-9]{32,}"), "[FILTERED_KEY]"),
    (re.compile(r"ghp_[A-Za-z0-9]{32,}"), "[FILTERED_GH_TOKEN]"),
    (re.compile(r"xox[bpras]-[A-Za-z0-9\-]+"), "[FILTERED_SLACK]"),
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), "[EMAIL]"),
    (re.compile(r"-----BEGIN\s*(RSA|EC|DSA|OPENSSH)?\s*PRIVATE\s*KEY-----"), "[FILTERED_KEY]"),
]


def _sanitize(text: str) -> str:
    for pattern, replacement in SENSITIVE_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


def collect():
    """Collect current window data from ActivityWatch. Returns (data, source, status)."""
    try:
        import httpx
        client = httpx.Client(timeout=3.0)
        resp = client.get(f"{AW_BASE}/api/0/buckets")
        if resp.status_code != 200:
            return {"windows": [], "afk": [], "error": f"AW returned {resp.status_code}"}, "fallback", "error"

        buckets = resp.json()
        windows = []
        afk_events = []

        for bucket_id, bucket_data in buckets.items():
            try:
                events_resp = client.get(f"{AW_BASE}/api/0/buckets/{bucket_id}/events?limit=20")
                if events_resp.status_code != 200:
                    continue
                events = events_resp.json()

                for ev in events:
                    data = ev.get("data", {})
                    title = _sanitize(data.get("title", ""))
                    app = data.get("app", "")

                    if "afk" in bucket_id.lower():
                        afk_events.append({
                            "status": data.get("status", ""),
                            "started_at": ev.get("timestamp", ""),
                            "duration_seconds": ev.get("duration", 0),
                        })
                    elif app or title:
                        windows.append({
                            "app": app,
                            "title": title,
                            "url": data.get("url", ""),
                            "domain": _extract_domain(data.get("url", "")),
                            "started_at": ev.get("timestamp", ""),
                            "duration_seconds": ev.get("duration", 0),
                        })

                client.close()
            except Exception:
                continue

        # Sort by most recent
        windows.sort(key=lambda w: w.get("started_at", ""), reverse=True)

        return {"windows": windows, "afk": afk_events}, "real", "ok"
    except Exception as e:
        return {"windows": [], "afk": [], "error": str(e)}, "fallback", "error"


def _extract_domain(url: str) -> str:
    if not url:
        return ""
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc or ""
    except Exception:
        return ""


def get_buckets():
    """Return available AW buckets."""
    try:
        import httpx
        client = httpx.Client(timeout=3.0)
        resp = client.get(f"{AW_BASE}/api/0/buckets")
        client.close()
        if resp.status_code == 200:
            return list(resp.json().keys())
    except Exception:
        pass
    return []
