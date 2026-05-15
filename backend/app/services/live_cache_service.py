"""In-memory cache service for live event sections.

Simple TTL-based cache to avoid redundant collector runs within short windows.
"""

import time
from threading import Lock

_cache: dict[str, tuple[float, object]] = {}
_lock = Lock()


def get_cached(key: str, ttl: float = 10.0) -> tuple[bool, object, float]:
    """Check cache for key. Returns (hit, data, age_seconds)."""
    with _lock:
        if key in _cache:
            ts, data = _cache[key]
            age = time.monotonic() - ts
            if age < ttl:
                return True, data, age
    return False, None, 0.0


def set_cache(key: str, data: object) -> None:
    """Store data in cache with current timestamp."""
    with _lock:
        _cache[key] = (time.monotonic(), data)


def invalidate(key: str | None = None) -> None:
    """Clear a specific key or all cache."""
    with _lock:
        if key:
            _cache.pop(key, None)
        else:
            _cache.clear()


def cache_info() -> dict:
    """Return cache diagnostics."""
    with _lock:
        keys = list(_cache.keys())
        now = time.monotonic()
        entries = {}
        for k in keys:
            ts, _ = _cache[k]
            entries[k] = {"age_seconds": round(now - ts, 1)}
        return {
            "entry_count": len(keys),
            "keys": keys,
            "entries": entries,
        }
