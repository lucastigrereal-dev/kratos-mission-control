"""Operational Truth Verifier — cross-references all collectors to detect conflicts.

Phase 0.11: Each check compares two or more independent sources. When sources agree,
the operator's reality is "consistent." When they diverge, we have a conflict that
needs attention — either a distraction, a stale sensor, or a broken service.
"""

import time
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from datetime import datetime, timezone

CHECK_TIMEOUT = 3.0  # max seconds per individual check


def _parallel_checks(checks: dict) -> dict:
    """Run multiple check functions in parallel threads, each isolated from failures."""
    if not checks:
        return {}

    executor = ThreadPoolExecutor(max_workers=len(checks))
    futures_map = {name: executor.submit(fn) for name, fn in checks.items()}

    done, not_done = futures_wait(futures_map.values(), timeout=CHECK_TIMEOUT)
    results = {}

    for name, future in futures_map.items():
        if future in done:
            try:
                results[name] = future.result()
            except Exception as e:
                results[name] = {
                    "status": "error",
                    "verdict": "check_failed",
                    "error": str(e),
                }
        else:
            results[name] = {
                "status": "error",
                "verdict": "timeout",
                "error": f"check exceeded {CHECK_TIMEOUT}s",
            }

    executor.shutdown(wait=False, cancel_futures=True)
    return results


# ── Individual checks ──────────────────────────────────────────────────────────


def _check_project_alignment() -> dict:
    """Cross-reference: git branch vs AW window vs focus project.

    Sources (independent):
      - git collector → current branch → inferred project
      - activitywatch collector → active window title/url → classified project
      - mentor focus → declared focus_project

    Verdict:
      - consistent: all sources point to the same project
      - degraded: one source is unavailable, others agree
      - conflict: sources disagree on what project is active
    """
    from app.services import get_git, get_activitywatch_status, get_mentor_focus
    from app.services.context_classifier_service import classify

    # Fetch sources independently
    git_data = get_git()
    aw_data = get_activitywatch_status()
    focus = get_mentor_focus()

    sources_available = []
    sources_missing = []
    project_signals = {}

    # Git signal
    git_branch = None
    git_project = None
    if git_data.get("source") == "real" and git_data.get("data"):
        git_info = git_data["data"]
        git_branch = git_info.get("current_branch", "")
        git_repos = git_info.get("repos", [])
        if git_repos:
            git_project = git_repos[0].get("name", "")
        project_signals["git"] = {
            "branch": git_branch,
            "project": git_project,
            "source": "real",
        }
        sources_available.append("git")
    else:
        project_signals["git"] = {"branch": None, "project": None, "source": git_data.get("source", "unknown")}
        sources_missing.append("git")

    # AW signal
    aw_project = None
    aw_app = None
    aw_title = None
    if aw_data.get("source") == "real" and aw_data.get("data"):
        aw_info = aw_data["data"]
        windows = aw_info.get("windows", [])
        if windows:
            current = windows[0]
            aw_app = current.get("app", "")
            aw_title = current.get("title", "")
            classification = classify(
                title=aw_title,
                url=current.get("url", ""),
                app=aw_app,
            )
            aw_project = classification.get("project_guess")
        project_signals["activitywatch"] = {
            "app": aw_app,
            "title": aw_title,
            "project": aw_project,
            "source": "real",
        }
        sources_available.append("activitywatch")
    else:
        project_signals["activitywatch"] = {
            "app": None, "title": None, "project": None,
            "source": aw_data.get("source", "unknown"),
        }
        sources_missing.append("activitywatch")

    # Focus signal
    focus_project = focus.get("focus_project", "")
    project_signals["focus"] = {
        "project": focus_project,
        "source": "declared",
    }

    # Determine verdict
    projects_found = set()
    if git_project:
        projects_found.add(git_project.lower())
    if aw_project:
        projects_found.add(aw_project.lower())
    if focus_project:
        projects_found.add(focus_project.lower())

    # Filter out None/empty
    projects_found.discard("")
    projects_found.discard(None)

    available_count = len(sources_available)
    conflict_details = []

    if available_count >= 2 and len(projects_found) > 1:
        verdict = "conflict"
        status = "warning"
        summary = f"Divergencia: {', '.join(sorted(projects_found))}"
        # Build conflict detail
        if git_project and aw_project and git_project.lower() != aw_project.lower():
            conflict_details.append({
                "type": "git_vs_activitywatch",
                "message": f"Git diz '{git_project}' mas ActivityWatch detectou '{aw_project}'",
                "severity": "warning",
            })
        if focus_project:
            for p in projects_found:
                if p != focus_project.lower():
                    conflict_details.append({
                        "type": "focus_drift",
                        "message": f"Foco declarado: '{focus_project}' mas atividade real: '{p}'",
                        "severity": "warning",
                    })
    elif available_count >= 2 and len(projects_found) == 1:
        verdict = "consistent"
        status = "ok"
        aligned_project = next(iter(projects_found))
        summary = f"Alinhado: {aligned_project}"
    elif available_count == 1:
        verdict = "degraded"
        status = "degraded"
        summary = f"Apenas 1 fonte disponivel ({sources_available[0]})"
    else:
        verdict = "unknown"
        status = "degraded"
        summary = "Nenhuma fonte disponivel para comparar"

    return {
        "status": status,
        "verdict": verdict,
        "summary": summary,
        "sources_available": sources_available,
        "sources_missing": sources_missing,
        "signals": project_signals,
        "conflicts": conflict_details,
        "projects_detected": sorted(projects_found),
    }


def _check_infrastructure_health() -> dict:
    """Cross-reference: Docker vs OMNIS vs System health.

    Verdict:
      - consistent: all infra sources agree on health
      - degraded: one service unhealthy or unreachable
      - conflict: multiple critical failures
    """
    from app.services import get_docker, get_omnis_status, get_system

    docker = get_docker()
    omnis = get_omnis_status()
    system = get_system()

    issues = []
    health_signals = {}

    # Docker
    docker_healthy = True
    if docker.get("source") == "real" and docker.get("data"):
        d = docker["data"]
        unhealthy = d.get("unhealthy", 0)
        running = d.get("running", 0)
        total = d.get("total", 0)
        health_signals["docker"] = {
            "total": total, "running": running, "unhealthy": unhealthy,
            "status": "healthy" if unhealthy == 0 else "degraded",
            "source": "real",
        }
        if unhealthy > 0:
            issues.append(f"Docker: {unhealthy} containers unhealthy")
            docker_healthy = False
    else:
        health_signals["docker"] = {
            "total": 0, "running": 0, "unhealthy": 0,
            "status": "unknown",
            "source": docker.get("source", "unknown"),
        }
        issues.append("Docker: offline ou inacessivel")
        docker_healthy = False

    # OMNIS
    omnis_healthy = True
    if omnis.get("source") == "real":
        health_signals["omnis"] = {"status": "healthy", "source": "real"}
    else:
        health_signals["omnis"] = {
            "status": "unknown",
            "source": omnis.get("source", "unknown"),
        }
        if omnis.get("collector_status") != "ok":
            issues.append("OMNIS: inacessivel")
            omnis_healthy = False

    # System
    sys_healthy = True
    if system.get("source") == "real" and system.get("data"):
        s = system["data"]
        cpu = s.get("cpu", {}).get("percent", 0)
        mem = s.get("memory", {}).get("percent", 0)
        health_signals["system"] = {
            "cpu_percent": cpu, "memory_percent": mem,
            "status": "healthy" if cpu < 90 and mem < 90 else "degraded",
            "source": "real",
        }
        if cpu > 90:
            issues.append(f"CPU critico: {cpu}%")
            sys_healthy = False
        if mem > 90:
            issues.append(f"Memoria critica: {mem}%")
            sys_healthy = False
    else:
        health_signals["system"] = {
            "cpu_percent": 0, "memory_percent": 0,
            "status": "unknown",
            "source": system.get("source", "unknown"),
        }
        issues.append("System: offline")

    # Aggregate verdict
    healthy_sources = sum([docker_healthy, omnis_healthy, sys_healthy])
    if healthy_sources == 3:
        verdict = "consistent"
        status = "ok"
        summary = "Infraestrutura saudavel"
    elif healthy_sources >= 2:
        verdict = "degraded"
        status = "degraded"
        summary = f"{len(issues)} alerta(s) de infra"
    else:
        verdict = "conflict"
        status = "critical"
        summary = f"Multiplas falhas: {len(issues)} alerta(s)"

    return {
        "status": status,
        "verdict": verdict,
        "summary": summary,
        "signals": health_signals,
        "issues": issues,
    }


def _check_data_freshness() -> dict:
    """Check how stale each collector's data is."""
    from app.services import get_git, get_docker, get_omnis_status, get_system, get_activitywatch_status

    sources = {
        "git": get_git,
        "docker": get_docker,
        "omnis": get_omnis_status,
        "system": get_system,
        "activitywatch": get_activitywatch_status,
    }

    freshness = {}
    stale_sources = []

    for name, fn in sources.items():
        try:
            result = fn()
            src = result.get("source", "unknown")
            data = result.get("data", {})
            badge = data.get("source_badge", src) if isinstance(data, dict) else src
            freshness[name] = {"source": src, "source_badge": badge}
            if src != "real":
                stale_sources.append({
                    "source": name,
                    "reason": f"usando {src}, nao dados reais",
                    "source_badge": badge,
                })
        except Exception as e:
            freshness[name] = {"source": "error", "error": str(e)}
            stale_sources.append({"source": name, "reason": str(e)})

    if len(stale_sources) == 0:
        verdict = "consistent"
        status = "ok"
        summary = "Todos os coletores retornando dados reais"
    elif len(stale_sources) <= 2:
        verdict = "degraded"
        status = "degraded"
        summary = f"{len(stale_sources)} fonte(s) degradadas"
    else:
        verdict = "conflict"
        status = "critical"
        summary = f"{len(stale_sources)} fontes offline — verdade comprometida"

    return {
        "status": status,
        "verdict": verdict,
        "summary": summary,
        "freshness": freshness,
        "stale_sources": stale_sources,
    }


def _check_git_hygiene() -> dict:
    """Check git dirtiness across tracked repos as a signal for checkpoint need."""
    from app.services import get_git

    git_data = get_git()

    if git_data.get("source") != "real" or not git_data.get("data"):
        return {
            "status": "degraded",
            "verdict": "unknown",
            "summary": "Git offline — higiene desconhecida",
            "repos": [],
            "total_dirty_files": 0,
            "needs_checkpoint": False,
        }

    repos = git_data["data"].get("repos", [])
    total_dirty = 0
    dirty_repos = []

    for repo in repos:
        dirty = repo.get("dirty_files", 0)
        total_dirty += dirty
        if dirty > 0:
            dirty_repos.append({
                "name": repo.get("name", ""),
                "branch": repo.get("current_branch", ""),
                "dirty_files": dirty,
                "has_stashes": bool(repo.get("stashes", 0)),
            })

    if total_dirty == 0:
        verdict = "consistent"
        status = "ok"
        summary = "Working trees limpos"
        needs_cp = False
    elif total_dirty <= 5:
        verdict = "degraded"
        status = "degraded"
        summary = f"{total_dirty} arquivos nao commitados"
        needs_cp = False
    else:
        verdict = "conflict"
        status = "warning"
        summary = f"{total_dirty} arquivos pendentes — sugere checkpoint"
        needs_cp = True

    return {
        "status": status,
        "verdict": verdict,
        "summary": summary,
        "repos": dirty_repos,
        "total_dirty_files": total_dirty,
        "needs_checkpoint": needs_cp,
    }


# ── Check registry ─────────────────────────────────────────────────────────────


CHECKS = {
    "project_alignment": _check_project_alignment,
    "infrastructure_health": _check_infrastructure_health,
    "data_freshness": _check_data_freshness,
    "git_hygiene": _check_git_hygiene,
}


# ── Public API ─────────────────────────────────────────────────────────────────


def build_operational_truth() -> dict:
    """Run all checks in parallel and produce the operational truth veredict."""
    t_start = time.monotonic()

    check_results = _parallel_checks(CHECKS)

    # Aggregate global verdict
    verdicts = [c.get("verdict", "unknown") for c in check_results.values()]
    statuses = [c.get("status", "unknown") for c in check_results.values()]

    conflict_count = verdicts.count("conflict")
    degraded_count = verdicts.count("degraded")
    consistent_count = verdicts.count("consistent")

    if conflict_count > 0:
        global_verdict = "conflict"
        global_status = "warning"
    elif degraded_count > 1:
        global_verdict = "degraded"
        global_status = "degraded"
    elif degraded_count == 1:
        global_verdict = "mostly_consistent"
        global_status = "ok"
    else:
        global_verdict = "consistent"
        global_status = "ok"

    total_ms = (time.monotonic() - t_start) * 1000

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "verdict": global_verdict,
        "status": global_status,
        "summary": (
            f"{consistent_count} consistentes, "
            f"{degraded_count} degradados, "
            f"{conflict_count} conflitos"
        ),
        "checks": check_results,
        "check_stats": {
            "total": len(CHECKS),
            "consistent": consistent_count,
            "degraded": degraded_count,
            "conflict": conflict_count,
        },
        "build_time_ms": round(total_ms, 1),
    }
