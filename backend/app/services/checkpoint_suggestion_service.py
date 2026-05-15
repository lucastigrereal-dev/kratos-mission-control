"""Phase 0.8C — Auto Checkpoint Suggestion Engine.

Pure function: no DB, no side effects. Cooldown-aware to prevent spam.
Integrates with drift analysis to suggest checkpoints only when meaningful.
"""
from datetime import datetime, timezone, timedelta


# Cooldown windows — how long after a checkpoint before suggesting again
COOLDOWN_DEFAULT_MINUTES = 20
COOLDOWN_MEDIUM_MINUTES = 15
COOLDOWN_HIGH_MINUTES = 10

# Time thresholds for contextual checkpoint suggestions
RELATED_NO_CHECKPOINT_MINUTES = 45  # suggest if working on related for 45+ min
UNKNOWN_NO_CHECKPOINT_MINUTES = 60  # suggest if unknown state persists 60+ min


def build_checkpoint_suggestion(
    context: dict | None = None,
    drift: dict | None = None,
    last_checkpoint: dict | None = None,
    now: datetime | None = None,
) -> dict:
    """Build a checkpoint suggestion based on current context and drift state.

    Returns a dict that is safe to embed directly in API responses.
    Never raises — returns no_suggestion on any failure.
    """
    try:
        ctx = context or {}
        d = drift or ctx.get("drift", {})
        state = d.get("state", "on_focus")
        severity = d.get("severity", "none")
        minutes_out = d.get("minutes_out_of_focus", 0)

        now_dt = now or datetime.now(timezone.utc)

        # Check cooldown first
        cooldown = _check_cooldown(last_checkpoint, state, severity, now_dt)
        if cooldown["active"]:
            return {
                "should_suggest": False,
                "severity": "none",
                "reason": f"Cooldown ativo — último checkpoint foi há menos de {cooldown['remaining_minutes']}min",
                "trigger": {"type": "cooldown", "minutes_out_of_focus": minutes_out},
                "suggested_checkpoint": None,
                "cooldown": cooldown,
            }

        # Decide whether to suggest
        decision = _decide_suggestion(state, severity, minutes_out, ctx, last_checkpoint, now_dt)

        if not decision["should_suggest"]:
            return {
                "should_suggest": False,
                "severity": "none",
                "reason": decision["reason"],
                "trigger": decision["trigger"],
                "suggested_checkpoint": None,
                "cooldown": cooldown,
            }

        # Build the suggested checkpoint payload
        suggested = _build_suggested_checkpoint(ctx, d, decision)

        return {
            "should_suggest": True,
            "severity": decision["suggested_severity"],
            "reason": decision["reason"],
            "trigger": decision["trigger"],
            "suggested_checkpoint": suggested,
            "cooldown": cooldown,
        }
    except Exception:
        return {
            "should_suggest": False,
            "severity": "none",
            "reason": "Erro interno ao avaliar checkpoint",
            "trigger": {"type": "error", "minutes_out_of_focus": 0},
            "suggested_checkpoint": None,
            "cooldown": {"active": False, "remaining_minutes": 0},
        }


def _check_cooldown(
    last_checkpoint: dict | None,
    state: str,
    severity: str,
    now_dt: datetime,
) -> dict:
    """Determine if cooldown is active based on last checkpoint time and drift severity."""
    if not last_checkpoint:
        return {"active": False, "remaining_minutes": 0}

    created_at = last_checkpoint.get("created_at")
    if not created_at:
        return {"active": False, "remaining_minutes": 0}

    try:
        if created_at.endswith("Z"):
            created_at = created_at[:-1] + "+00:00"
        cp_time = datetime.fromisoformat(created_at)
        elapsed_minutes = (now_dt - cp_time).total_seconds() / 60

        if severity == "high":
            window = COOLDOWN_HIGH_MINUTES
        elif severity == "medium":
            window = COOLDOWN_MEDIUM_MINUTES
        else:
            window = COOLDOWN_DEFAULT_MINUTES

        if elapsed_minutes < window:
            return {
                "active": True,
                "remaining_minutes": max(0, int(window - elapsed_minutes)),
            }
    except (ValueError, TypeError):
        pass

    return {"active": False, "remaining_minutes": 0}


def _decide_suggestion(
    state: str,
    severity: str,
    minutes_out: int,
    ctx: dict,
    last_checkpoint: dict | None,
    now_dt: datetime,
) -> dict:
    """Decide whether to suggest a checkpoint based on drift state and severity."""
    # on_focus: never suggest checkpoint
    if state == "on_focus":
        return {
            "should_suggest": False,
            "reason": "Você está no foco — sem necessidade de checkpoint agora.",
            "trigger": {"type": "on_focus", "minutes_out_of_focus": 0},
            "suggested_severity": "none",
        }

    # off_focus: suggest based on severity
    if state == "off_focus":
        if severity == "high":
            return {
                "should_suggest": True,
                "reason": f"Você está {minutes_out}min fora do foco. Salve um checkpoint antes de se perder.",
                "trigger": {"type": "off_focus", "minutes_out_of_focus": minutes_out},
                "suggested_severity": "high",
            }
        elif severity == "medium":
            return {
                "should_suggest": True,
                "reason": f"Drift detectado há {minutes_out}min. Sugiro salvar checkpoint antes de continuar.",
                "trigger": {"type": "off_focus", "minutes_out_of_focus": minutes_out},
                "suggested_severity": "medium",
            }
        else:
            # low severity: don't suggest checkpoint, just a nudge
            return {
                "should_suggest": False,
                "reason": f"Desvio leve ({minutes_out}min) — apenas um alerta, sem necessidade de checkpoint.",
                "trigger": {"type": "off_focus_low", "minutes_out_of_focus": minutes_out},
                "suggested_severity": "none",
            }

    # related: suggest if no checkpoint in a while
    if state == "related":
        if last_checkpoint:
            return {
                "should_suggest": False,
                "reason": "Atividade de suporte com checkpoint recente.",
                "trigger": {"type": "related", "minutes_out_of_focus": minutes_out},
                "suggested_severity": "none",
            }
        # No checkpoint at all — suggest after some time
        duration_sec = ctx.get("duration_seconds", 0) if isinstance(ctx, dict) else 0
        if duration_sec >= RELATED_NO_CHECKPOINT_MINUTES * 60:
            return {
                "should_suggest": True,
                "reason": f"Trabalhando em contexto relacionado há {duration_sec // 60}min sem checkpoint.",
                "trigger": {"type": "related_no_checkpoint", "minutes_out_of_focus": minutes_out},
                "suggested_severity": "low",
            }
        return {
            "should_suggest": False,
            "reason": "Contexto relacionado — próximo checkpoint será sugerido após 45min.",
            "trigger": {"type": "related", "minutes_out_of_focus": minutes_out},
            "suggested_severity": "none",
        }

    # unknown: suggest only if no checkpoint in a long time
    if state == "unknown":
        if last_checkpoint:
            return {
                "should_suggest": False,
                "reason": "ActivityWatch offline, mas há checkpoint recente.",
                "trigger": {"type": "unknown", "minutes_out_of_focus": 0},
                "suggested_severity": "none",
            }
        return {
            "should_suggest": True,
            "reason": "ActivityWatch offline e sem checkpoint. Salve o estado atual manualmente.",
            "trigger": {"type": "unknown_no_checkpoint", "minutes_out_of_focus": 0},
            "suggested_severity": "low",
        }

    # fallback
    return {
        "should_suggest": False,
        "reason": "Sem gatilho de checkpoint detectado.",
        "trigger": {"type": "none", "minutes_out_of_focus": 0},
        "suggested_severity": "none",
    }


def _build_suggested_checkpoint(ctx: dict, drift: dict, decision: dict) -> dict:
    """Build a lightweight suggested checkpoint from current context."""
    project = drift.get("expected_project") or ctx.get("project_guess", "indefinido")
    mission = ctx.get("mission_guess") or "Contexto atual"

    app = ctx.get("current_app", "?")
    title = ctx.get("current_title", "?")

    where_i_stopped = f"App: {app}, Janela: {title}"

    # Simple next action suggestion
    app_lower = app.lower()
    if "code" in app_lower or "vscode" in app_lower:
        next_action = f"Continuar implementacao em {project}"
    elif "terminal" in app_lower:
        next_action = f"Rodar proximo comando ou teste em {project}"
    else:
        next_action = f"Retomar foco em {project}"

    return {
        "project": project,
        "mission": mission,
        "where_i_stopped": where_i_stopped,
        "next_action": next_action,
        "resume_hint": f"Voltar para {project}: {where_i_stopped}",
        "confidence": ctx.get("confidence", 0.5),
    }
