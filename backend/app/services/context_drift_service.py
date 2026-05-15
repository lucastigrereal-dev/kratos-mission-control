"""Context drift service — detects when user is off-focus from mission.

Analyzes current ActivityWatch window against mission expectations to compute
drift state, severity, and recovery actions.
"""

from datetime import datetime, timezone


def analyze_drift(
    current_window: dict | None = None,
    source: str = "fallback",
    mission_info: dict | None = None,
    afk_events: list | None = None,
) -> dict:
    """Analyze whether the user is on-focus, off-focus, or in related context.
    Returns a drift dict with state, severity, minutes_out_of_focus, reason,
    current_app/title, inferred/expected project, and recovery_action.
    """
    mission_info = mission_info or {}
    afk_events = afk_events or []

    expected_project = (
        mission_info.get("current_project", {}).get("id", "")
        or mission_info.get("current_project", "")
    )

    if not current_window:
        return {
            "state": "unknown",
            "severity": "none",
            "minutes_out_of_focus": 0,
            "reason": "ActivityWatch offline — sem dados de janela ativa",
            "current_app": "unknown",
            "current_title": "",
            "inferred_project": None,
            "expected_project": expected_project,
            "recovery_action": {
                "title": "Iniciar ActivityWatch para monitorar foco",
                "cta_label": "Verificar AW",
            },
        }

    app = current_window.get("app", "unknown")
    title = current_window.get("title", "")
    url = current_window.get("url", "")
    domain = current_window.get("domain", "")
    duration = current_window.get("duration_seconds", 0)

    # Check AFK
    is_afk = False
    afk_minutes = 0
    if afk_events:
        for ev in afk_events:
            if ev.get("status") == "afk" and ev.get("duration_seconds", 0) > 0:
                is_afk = True
                afk_minutes = max(afk_minutes, ev.get("duration_seconds", 0) / 60)

    if is_afk and afk_minutes > 5:
        return {
            "state": "off_focus",
            "severity": "medium" if afk_minutes > 15 else "low",
            "minutes_out_of_focus": int(afk_minutes),
            "reason": f"AFK há {int(afk_minutes)} minutos",
            "current_app": app,
            "current_title": title,
            "inferred_project": None,
            "expected_project": expected_project,
            "recovery_action": {
                "title": "Retomar sessão de trabalho",
                "cta_label": "Voltar ao foco",
            },
        }

    # Classify window against expected project
    from app.services.context_classifier_service import classify
    classification = classify(title=title, url=url, app=app)
    inferred = classification.get("project_guess")
    confidence = classification.get("confidence", 0)

    # On-focus: same project
    if inferred and expected_project and inferred == expected_project:
        return {
            "state": "on_focus",
            "severity": "none",
            "minutes_out_of_focus": 0,
            "reason": f"No foco — {app}: {title[:60]}",
            "current_app": app,
            "current_title": title,
            "inferred_project": inferred,
            "expected_project": expected_project,
            "recovery_action": None,
        }

    # Related: not same project but classified — might be support work
    if inferred and inferred != expected_project:
        minutes_out = max(0, int(duration / 60)) if duration else 0
        severity = "medium" if minutes_out > 30 else "low"
        return {
            "state": "related",
            "severity": severity,
            "minutes_out_of_focus": minutes_out,
            "reason": f"Contexto relacionado: {classification.get('reason_guess', inferred)}",
            "current_app": app,
            "current_title": title,
            "inferred_project": inferred,
            "expected_project": expected_project,
            "recovery_action": {
                "title": f"Retomar {expected_project} — você está em {inferred}",
                "cta_label": "Voltar ao projeto principal",
            },
        }

    # Off-focus: unclassified, probably distracted
    minutes_out = max(0, int(duration / 60)) if duration else 0
    severity = "high" if minutes_out > 45 else "medium" if minutes_out > 20 else "low"
    known_distraction = any(
        kw in (app + title).lower()
        for kw in ("youtube", "twitter", "instagram", "reddit", "netflix", "twitch", "tiktok")
    )

    return {
        "state": "off_focus",
        "severity": "high" if known_distraction and minutes_out > 10 else severity,
        "minutes_out_of_focus": minutes_out,
        "reason": f"{'Distração detectada' if known_distraction else 'Fora do foco'}: {app} — {title[:60]}",
        "current_app": app,
        "current_title": title,
        "inferred_project": inferred,
        "expected_project": expected_project,
        "recovery_action": {
            "title": f"Você saiu do foco de '{expected_project}'. {'Feche essa distração.' if known_distraction else 'Retome o projeto.'}",
            "cta_label": "Retomar missão agora",
        },
    }


def get_drift_summary(drift: dict) -> str:
    """One-line summary of drift state for UI display."""
    state = drift.get("state", "unknown")
    if state == "on_focus":
        return "No foco"
    if state == "off_focus":
        return f"Fora do foco há {drift.get('minutes_out_of_focus', 0)}min"
    if state == "related":
        return "Contexto relacionado"
    return "Estado desconhecido"
