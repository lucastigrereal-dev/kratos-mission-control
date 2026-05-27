"""Governance Runtime Minimum — Enforcement engine for risk/action classification.

Classifies actions as SAFE, DANGER, or REQUIRES_HUMAN_SLOT.
SAFE: allowed unconditionally.
DANGER: blocked unless run in approved/authorized mode.
REQUIRES_HUMAN_SLOT: blocked always, requires Lucas intervention.

Patterns:
  SAFE        — read-only, local, non-destructive
  DANGER      — write/external, but safe with dry-run or approval
  HUMAN_SLOT  — secrets, production, social publish, migration
"""
import os
from enum import Enum
from typing import Optional


class ActionLevel(str, Enum):
    SAFE = "SAFE"
    DANGER = "DANGER"
    REQUIRES_HUMAN_SLOT = "REQUIRES_HUMAN_SLOT"


# ── Classification Rules ─────────────────────────────────────────────────────

DANGER_PATTERNS = [
    "write", "delete", "drop", "create", "update", "insert",
    "migrate", "deploy", "publish", "execute", "run",
    "restart", "stop", "kill", "remove", "clear", "truncate",
    "push", "sync",
]

SAFE_PATTERNS = [
    "read", "get", "list", "query", "search", "fetch",
    "health", "status", "ping", "check", "validate",
    "view", "inspect", "audit", "report",
]

HUMAN_SLOT_PATTERNS = [
    "production", "publish_social", "send_message",
    "secret", "token", "api_key", "password",
    "force_push", "hard_delete", "drop_table",
    "deploy_prod", "social_post",
]


def classify_action(action: str, metadata: Optional[dict] = None) -> dict:
    """Classify an action and return its risk level + decision.

    Args:
        action: Action name/description to classify
        metadata: Optional context (target, scope, dry_run flag, etc.)

    Returns:
        Dict with level, allowed, reason, requires_human_slot
    """
    action_lower = action.lower()
    meta = metadata or {}
    dry_run = meta.get("dry_run", False)
    approved = meta.get("approved", False)

    # Human slot check first (highest priority)
    for pattern in HUMAN_SLOT_PATTERNS:
        if pattern in action_lower:
            return {
                "action": action,
                "level": ActionLevel.REQUIRES_HUMAN_SLOT,
                "allowed": False,
                "reason": f"Action matches human-required pattern: {pattern}",
                "requires_human_slot": True,
                "dry_run": dry_run,
            }

    # DANGER check
    is_danger = any(p in action_lower for p in DANGER_PATTERNS)
    is_safe = any(p in action_lower for p in SAFE_PATTERNS)

    if is_danger and not is_safe:
        if dry_run:
            return {
                "action": action,
                "level": ActionLevel.DANGER,
                "allowed": True,
                "reason": "DANGER action allowed in dry-run mode",
                "requires_human_slot": False,
                "dry_run": True,
            }
        if approved:
            return {
                "action": action,
                "level": ActionLevel.DANGER,
                "allowed": True,
                "reason": "DANGER action approved explicitly",
                "requires_human_slot": False,
                "dry_run": False,
            }
        return {
            "action": action,
            "level": ActionLevel.DANGER,
            "allowed": False,
            "reason": "DANGER action blocked — requires dry_run=True or approved=True",
            "requires_human_slot": False,
            "dry_run": dry_run,
        }

    # SAFE
    return {
        "action": action,
        "level": ActionLevel.SAFE,
        "allowed": True,
        "reason": "SAFE action — no restrictions",
        "requires_human_slot": False,
        "dry_run": dry_run,
    }


def validate_mission_action(mission_id: str, action: str, metadata: Optional[dict] = None) -> dict:
    """Governance gate for mission actions. Blocks DANGER/HUMAN_SLOT unless cleared.

    Returns classify_action result, plus mission context.
    """
    result = classify_action(action, metadata)
    result["mission_id"] = mission_id
    result["governance_mode"] = os.environ.get("KRATOS_GOVERNANCE_MODE", "observe")
    return result
