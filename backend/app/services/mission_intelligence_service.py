"""Mission Intelligence Service — composes existing collectors into a single operational truth.

KRATOS is not a task app. It is a cockpit.
This service answers: where am I, what must I do, what must I not do, what is the risk.

Phase 0.6G: Mission Lens Contract v1 — canonical payload contract for all frontend consumers.
Phase 0.9: Internal parallelization — data fetches run concurrently via _parallel_fetch().
"""

from app.db import now_iso
from app.services import (
    get_now,
    get_context_current,
    get_checkpoints,
    get_system,
)
from app.services.context_loss_service import detect_context_loss
from app.services.mentor_decision_service import (
    get_next_best_action,
    get_active_recommendations,
    get_projects_at_risk,
)
from app.services.alert_service import get_alerts

CONTRACT_VERSION = "mission_lens.v1"
STALE_AFTER_MS = 12000  # matches CACHE_TTL["mission_lens"] = 12.0s


# ── Current Mission (unchanged shape) ─────────────────────────────────────────

def get_current_mission() -> dict:
    """Where am I right now? Single-source-of-truth for the active mission."""
    now_data = _safe(get_now, {})
    ctx = _safe(get_context_current, {})
    loss = _safe(detect_context_loss, [])

    project = now_data.get("current_project") or {}
    mission = now_data.get("current_mission") or {}

    if isinstance(project, str):
        project = {"id": project, "name": project}
    if isinstance(mission, str):
        mission = {"id": mission, "title": mission}

    drift = ctx.get("drift", {})
    focus_state = drift.get("state", "on_focus" if ctx.get("on_focus", True) else "drifting")
    drift_minutes = drift.get("minutes_out_of_focus", ctx.get("drift_minutes", 0))
    drift_severity = drift.get("severity", "none")

    confidence = max(0.3, 1.0 - (len(loss) * 0.15))
    source = ctx.get("source", "mock")

    return {
        "current_project": {
            "id": project.get("id", "unknown"),
            "name": project.get("name", "Indefinido"),
            "phase": project.get("phase"),
            "status": project.get("status", "active"),
        },
        "current_mission": {
            "id": mission.get("id", "unknown"),
            "title": mission.get("title", mission.get("description", "Missão indefinida")),
            "status": mission.get("status", "in_progress"),
        },
        "focus_state": focus_state,
        "current_context": {
            "app": ctx.get("current_app", "unknown"),
            "window": ctx.get("current_window", "unknown"),
            "project_guess": ctx.get("project_guess"),
            "context_switches_today": ctx.get("context_switches_today", 0),
        },
        "drift": {
            "state": focus_state,
            "severity": drift_severity,
            "minutes_out_of_focus": drift_minutes,
            "reason": drift.get("reason", ""),
            "recovery_action": drift.get("recovery_action", {}),
            "should_suggest_checkpoint": drift.get("should_suggest_checkpoint", False),
        },
        "drift_minutes": drift_minutes,
        "source": source,
        "confidence": round(confidence, 2),
        "generated_at": now_iso(),
    }


# ── Mission Lens — Contract v1 ─────────────────────────────────────────────────

def build_mission_lens_contract() -> dict:
    """Canonical Mission Lens contract payload — safe normalizer, never raises.

    Phase 0.9: data fetches run in parallel via _parallel_fetch().
    All frontend consumers must use this shape. See docs/KRATOS_MISSION_LENS_CONTRACT_V1.md.
    """
    from app.services.live_event_service import _parallel_fetch

    fetched = _parallel_fetch({
        "now_data": get_now,
        "nba": get_next_best_action,
        "active_recs": lambda: get_active_recommendations(limit=20),
        "at_risk": get_projects_at_risk,
        "alerts": lambda: get_alerts(status="active", limit=5),
        "checkpoints": get_checkpoints,
        "system": get_system,
        "loss": detect_context_loss,
        "ctx": get_context_current,
    })

    def _get(key, default=None):
        v = fetched.get(key, default)
        if isinstance(v, dict) and v.get("degraded"):
            return default
        if v is None:
            return default
        return v

    now_data = _get("now_data", {})
    nba = _get("nba")
    active_recs = _get("active_recs", [])
    at_risk = _get("at_risk", [])
    alerts = _get("alerts", [])
    checkpoints = _get("checkpoints", [])
    system = _get("system", {})
    loss = _get("loss", [])
    ctx = _get("ctx", {})
    checkpoint_suggestion = ctx.get("checkpoint_suggestion", {})
    if not checkpoint_suggestion or not checkpoint_suggestion.get("should_suggest") is not None:
        checkpoint_suggestion = {
            "should_suggest": False, "severity": "none", "reason": "Contexto indisponível",
            "trigger": {}, "suggested_checkpoint": None,
            "cooldown": {"active": False, "remaining_minutes": 0},
        }

    return {
        "contract_version": CONTRACT_VERSION,
        "source": ctx.get("source", "mock"),
        "collector_status": "ok",
        "generated_at": now_iso(),
        "stale_after_ms": STALE_AFTER_MS,
        "data": {
            "current_mission": _build_current_mission_contract(now_data, ctx, loss),
            "next_action": _build_next_action_contract(nba, now_data, ctx),
            "do_not_do": _build_do_not_do_contract(active_recs, at_risk, alerts, ctx),
            "risks": _build_risks_contract(at_risk, alerts, loss),
            "deadlines": _build_deadlines(active_recs, now_data),
            "checkpoint": _build_checkpoint_contract(checkpoints),
            "system_pulse": _build_system_pulse_contract(system, alerts, at_risk),
            "mentor_summary": _build_mentor_summary_contract(nba, active_recs, alerts),
            "checkpoint_suggestion": checkpoint_suggestion,
        },
    }


def get_mission_lens() -> dict:
    """Consolidated operational view — the cockpit's main dashboard data."""
    return build_mission_lens_contract()


# ── Mission Brief (mentor voice — unchanged shape) ─────────────────────────────

def get_mission_brief() -> dict:
    """Short operational text in first person — Aurora/mentor voice (Phase 0.9 parallel)."""
    from app.services.live_event_service import _parallel_fetch

    fetched = _parallel_fetch({
        "now_data": get_now,
        "nba": get_next_best_action,
        "active_recs": lambda: get_active_recommendations(limit=10),
        "at_risk": get_projects_at_risk,
        "alerts": lambda: get_alerts(status="active", limit=3),
        "checkpoints": get_checkpoints,
        "ctx": get_context_current,
        "loss": detect_context_loss,
    })

    def _get(key, default=None):
        v = fetched.get(key, default)
        if isinstance(v, dict) and v.get("degraded"):
            return default
        return v if v is not None else default

    now_data = _get("now_data", {})
    nba = _get("nba")
    active_recs = _get("active_recs", [])
    at_risk = _get("at_risk", [])
    alerts = _get("alerts", [])
    checkpoints = _get("checkpoints", [])
    ctx = _get("ctx", {})
    loss = _get("loss", [])

    project = now_data.get("current_project") or {}
    if isinstance(project, str):
        project = {"name": project}
    mission = now_data.get("current_mission") or {}
    if isinstance(mission, str):
        mission = {"title": mission}
    project_name = project.get("name", "projeto indefinido")
    mission_title = mission.get("title", mission.get("description", "missão indefinida"))
    app_name = ctx.get("current_app", "app desconhecido")

    you_are_here = f"Você está em {project_name} — {mission_title}. App atual: {app_name}."

    if nba:
        do_this_now = nba.get("recommended_action", "Defina sua próxima ação.")
    elif now_data.get("next_action"):
        do_this_now = now_data["next_action"]
    else:
        do_this_now = "Defina sua próxima ação antes de abrir qualquer outra coisa."

    # Brief uses terse string list — richer contract is in get_mission_lens()
    do_not_do = _build_do_not_do_str(active_recs, at_risk, alerts)[:3]

    main_risk = "Nenhum risco crítico detectado."
    critical_alerts = [a for a in alerts if a.get("severity") == "critical"]
    if critical_alerts:
        main_risk = f"Alerta crítico: {critical_alerts[0].get('title', 'Verifique os alertas')}."
    elif at_risk:
        main_risk = f"Projeto em risco: {at_risk[0].get('title', at_risk[0].get('project_id', '?'))}."
    elif loss:
        main_risk = f"Sinal de perda de contexto detectado: {loss[0].get('description', 'verifique o foco')}."

    resume_from = "Nenhum checkpoint disponível."
    if checkpoints:
        cp = checkpoints[0] if isinstance(checkpoints, list) else None
        if cp:
            cp_name = cp.get("name", "checkpoint anterior")
            cp_at = cp.get("created_at", "")[:16].replace("T", " às ") if cp.get("created_at") else ""
            resume_from = f"Último checkpoint: '{cp_name}'{' — ' + cp_at if cp_at else ''}."

    return {
        "you_are_here": you_are_here,
        "do_this_now": do_this_now,
        "do_not_do": do_not_do,
        "main_risk": main_risk,
        "resume_from": resume_from,
        "generated_at": now_iso(),
    }


# ── Contract builders (Phase 0.6G) ────────────────────────────────────────────

def _build_current_mission_contract(now_data: dict, ctx: dict, loss: list) -> dict:
    project = now_data.get("current_project") or {}
    mission = now_data.get("current_mission") or {}
    if isinstance(project, str):
        project = {"name": project}
    if isinstance(mission, str):
        mission = {"title": mission}

    drift = ctx.get("drift", {})
    on_focus = ctx.get("on_focus", True)
    drift_minutes = ctx.get("drift_minutes", 0)
    focus_state = drift.get("state", "on_focus" if on_focus else "drifting")
    drift_severity = drift.get("severity", "none")

    confidence = max(0.3, 1.0 - (len(loss) * 0.15))

    return {
        "title": mission.get("title", mission.get("description", "Missão indefinida")),
        "project": project.get("name", "Projeto indefinido"),
        "focus_state": focus_state,
        "focus_drift_minutes": drift_minutes,
        "confidence": round(confidence, 2),
        "drift": {
            "state": focus_state,
            "severity": drift_severity,
            "minutes_out_of_focus": drift.get("minutes_out_of_focus", drift_minutes),
            "reason": drift.get("reason", ""),
            "recovery_action": drift.get("recovery_action") or {"title": "Verificar foco", "cta_label": "Retomar"},
            "should_suggest_checkpoint": drift.get("should_suggest_checkpoint", False),
        },
    }


def _build_next_action_contract(nba: dict | None, now_data: dict, ctx: dict = None) -> dict:
    # Drift recovery overrides normal next-action when off_focus medium/high
    if ctx is None:
        ctx = _safe(get_context_current, {})
    drift = ctx.get("drift", {})
    if drift.get("state") == "off_focus" and drift.get("severity") in ("medium", "high"):
        recovery = drift.get("recovery_action", {})
        return {
            "title": recovery.get("title", "Retomar foco"),
            "rationale": drift.get("reason", "Você está fora do foco da missão"),
            "priority": "high",
            "source": "drift",
            "cta_label": recovery.get("cta_label", "Retomar agora"),
        }

    if nba:
        title = nba.get("recommended_action", "Definir próxima ação")
        rationale = nba.get("rationale") or nba.get("reason") or "Maior score de prioridade"
        priority = "high" if nba.get("score", 0) > 70 else "medium"
        source = "nba"
    elif now_data.get("next_action"):
        title = now_data["next_action"]
        rationale = "Definido no plano do dia"
        priority = "medium"
        source = "now_data"
    else:
        title = "Definir próxima ação"
        rationale = "Nenhuma ação detectada automaticamente"
        priority = "low"
        source = "fallback"

    return {
        "title": title,
        "rationale": rationale,
        "priority": priority,
        "source": source,
        "cta_label": "Fazer isso agora" if priority == "high" else "Próxima ação",
    }


def _build_do_not_do_contract(active_recs: list, at_risk: list, alerts: list, ctx: dict = None) -> list[dict]:
    items = [
        {
            "title": "Não abrir novo projeto sem fechar o atual.",
            "reason": "Context switching destrói o foco e dilui a execução.",
            "severity": "warning",
        }
    ]

    if len(active_recs) > 5:
        items.append({
            "title": "Não refatorar nada que já funciona.",
            "reason": "Refatoração sem objetivo gera regressão e perde tempo.",
            "severity": "info",
        })
    if len(active_recs) > 8:
        items.append({
            "title": "Não pesquisar ferramenta nova — use o que já tem.",
            "reason": "Pesquisa de ferramenta sem missão definida é procrastinação disfarçada.",
            "severity": "info",
        })
    if any(r.get("category") == "git_hygiene" for r in active_recs):
        items.append({
            "title": "Não acumular alterações sem commit ou checkpoint.",
            "reason": "Alterações sem commit são trabalho perdido em caso de falha.",
            "severity": "warning",
        })
    if any(r.get("category") == "project_abandonment" for r in active_recs):
        items.append({
            "title": "Não iniciar feature nova em projeto já em risco de abandono.",
            "reason": "Projeto em risco precisa de fechamento, não de nova feature.",
            "severity": "critical",
        })
    if any(a.get("severity") == "critical" for a in alerts):
        items.append({
            "title": "Não ignorar alertas críticos ativos.",
            "reason": "Alertas críticos são bloqueadores — resolva antes de avançar.",
            "severity": "critical",
        })
    if at_risk:
        items.append({
            "title": f"Não deixar {len(at_risk)} projeto(s) em risco sem próxima ação.",
            "reason": "Projetos sem ação definida tendem ao abandono.",
            "severity": "warning",
        })

    # Drift-based do_not_do
    ctx = ctx or {}
    drift = ctx.get("drift", {})
    if drift.get("state") == "off_focus" and drift.get("severity") in ("medium", "high"):
        items.append({
            "title": "Não abrir nova frente antes de retomar a missão atual.",
            "reason": f"Você está {drift.get('minutes_out_of_focus', 0)}min fora do foco. Retome antes de expandir.",
            "severity": "warning",
        })

    return items[:5]


def _build_risks_contract(at_risk: list, alerts: list, loss: list) -> list[dict]:
    risks = []

    for a in alerts:
        if a.get("severity") in ("critical", "warning"):
            risks.append({
                "title": a.get("title", "Alerta"),
                "severity": a.get("severity", "warning"),
                "entity": a.get("project_id") or a.get("entity") or "sistema",
                "reason": a.get("description") or a.get("title", ""),
                "suggested_action": "Investigar e resolver o alerta antes de avançar.",
            })

    for r in at_risk:
        risks.append({
            "title": r.get("title") or r.get("project_id", "Projeto"),
            "severity": r.get("severity", "warning"),
            "entity": r.get("project_id") or "projeto",
            "reason": r.get("reason") or "Projeto em risco de abandono ou sem ação definida.",
            "suggested_action": "Definir próxima ação ou fechar o projeto.",
        })

    for l in loss:
        risks.append({
            "title": l.get("description", "Perda de contexto"),
            "severity": l.get("severity", "info"),
            "entity": "contexto",
            "reason": "Sinal de drift ou perda de foco detectado.",
            "suggested_action": "Retomar checkpoint e redefinir próxima ação.",
        })

    seen = set()
    unique = []
    for r in risks:
        if r["title"] not in seen:
            seen.add(r["title"])
            unique.append(r)

    return unique[:6]


def _build_checkpoint_contract(checkpoints: list) -> dict:
    if not checkpoints or not isinstance(checkpoints, list):
        return {
            "available": False,
            "label": "Nenhum checkpoint disponível",
            "last_checkpoint_at": None,
            "resume_hint": "Crie um checkpoint antes de avançar.",
        }
    cp = checkpoints[0]
    cp_name = cp.get("name", "checkpoint anterior")
    cp_at = cp.get("created_at")
    cp_at_short = cp_at[:16].replace("T", " às ") if cp_at else None
    return {
        "available": True,
        "label": cp_name,
        "last_checkpoint_at": cp_at,
        "resume_hint": f"Retomar de: '{cp_name}'" + (f" — {cp_at_short}" if cp_at_short else ""),
    }


def _build_system_pulse_contract(system: dict, alerts: list, at_risk: list) -> dict:
    sys_status = system.get("collector_status") or system.get("status", "unknown")
    critical_count = sum(1 for a in alerts if a.get("severity") == "critical")
    degraded_count = sum(1 for a in alerts if a.get("severity") in ("warning", "critical"))

    parts = []
    if critical_count:
        parts.append(f"{critical_count} alerta(s) crítico(s)")
    if at_risk:
        parts.append(f"{len(at_risk)} projeto(s) em risco")
    live_status = " | ".join(parts) if parts else "Sistema sem alertas ativos"

    return {
        "status": sys_status,
        "live_status": live_status,
        "degraded_count": degraded_count,
        "critical_count": critical_count,
    }


def _build_mentor_summary_contract(nba: dict | None, active_recs: list, alerts: list) -> dict:
    critical = [a for a in alerts if a.get("severity") == "critical"]
    if critical:
        text = f"{len(critical)} alerta(s) crítico(s) ativo(s). Resolva antes de qualquer outra coisa."
        tone = "critical"
        urgency = "critical"
    elif nba:
        project = nba.get("project_id", "projeto")
        action = nba.get("recommended_action", "ação recomendada")
        text = f"Foco em {project}: {action}"
        score = nba.get("score", 0)
        tone = "urgent" if score > 70 else "calm"
        urgency = "high" if score > 70 else "medium"
    elif active_recs:
        text = f"{len(active_recs)} recomendação(ões) ativa(s). Priorize a de maior score."
        tone = "calm"
        urgency = "medium"
    else:
        text = "Sistema estável. Escolha uma missão e execute sem interrupções."
        tone = "calm"
        urgency = "low"

    return {"text": text, "tone": tone, "urgency": urgency}


# ── Helpers used by brief (terse string format) ────────────────────────────────

def _build_do_not_do_str(active_recs: list, at_risk: list, alerts: list) -> list[str]:
    items = ["Não abrir novo projeto sem fechar o atual."]

    if len(active_recs) > 5:
        items.append("Não refatorar nada que já funciona.")
    if len(active_recs) > 8:
        items.append("Não pesquisar ferramenta nova — use o que já tem.")
    if any(r.get("category") == "git_hygiene" for r in active_recs):
        items.append("Não acumular alterações sem commit ou checkpoint.")
    if any(r.get("category") == "project_abandonment" for r in active_recs):
        items.append("Não iniciar feature nova em projeto já em risco de abandono.")
    if any(a.get("severity") == "critical" for a in alerts):
        items.append("Não ignorar alertas críticos ativos.")
    if at_risk:
        items.append(f"Não deixar {len(at_risk)} projeto(s) em risco sem próxima ação.")

    return items[:5]


def _build_deadlines(active_recs: list, now_data: dict) -> list[dict]:
    deadlines = []

    for r in active_recs:
        if r.get("category") == "deadline" and r.get("recommended_action"):
            deadlines.append({
                "title": r.get("title", "Prazo"),
                "project_id": r.get("project_id"),
                "severity": r.get("severity", "warning"),
                "due_at": r.get("due_at"),
            })

    active_risks = now_data.get("active_risks", [])
    if isinstance(active_risks, list):
        for risk_str in active_risks:
            if isinstance(risk_str, str) and "prazo" in risk_str.lower():
                deadlines.append({
                    "title": risk_str,
                    "project_id": None,
                    "severity": "warning",
                    "due_at": None,
                })

    return deadlines[:5]


# ── Safe wrapper ───────────────────────────────────────────────────────────────

def _safe(fn, default):
    try:
        result = fn()
        return result if result is not None else default
    except Exception:
        return default
