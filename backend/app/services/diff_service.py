"""Diff service — computes structured diffs between system states.

Used to detect meaningful changes between collector snapshots for alert generation.
"""


def diff_dicts(before: dict, after: dict, prefix: str = "") -> list[dict]:
    """Compute a list of changes between two flat or nested dicts.
    Returns list of {key, before, after, change_type} dicts.
    """
    changes = []
    all_keys = set(before.keys()) | set(after.keys())

    for key in sorted(all_keys):
        full_key = f"{prefix}.{key}" if prefix else key
        b_val = before.get(key)
        a_val = after.get(key)

        if isinstance(b_val, dict) and isinstance(a_val, dict):
            changes.extend(diff_dicts(b_val, a_val, full_key))
        elif b_val != a_val:
            changes.append({
                "key": full_key,
                "before": b_val,
                "after": a_val,
                "change_type": "added" if b_val is None else "removed" if a_val is None else "modified",
            })

    return changes


def has_significant_change(before: dict, after: dict, threshold_pct: float = 5.0) -> bool:
    """Check if any numeric value changed more than threshold_pct percent."""
    diffs = diff_dicts(before, after)
    for d in diffs:
        if d["change_type"] != "modified":
            continue
        try:
            b = float(d["before"])
            a = float(d["after"])
            if b == 0:
                if a != 0:
                    return True
            else:
                pct_change = abs((a - b) / b) * 100
                if pct_change > threshold_pct:
                    return True
        except (ValueError, TypeError):
            if d["before"] != d["after"]:
                return True
    return False
