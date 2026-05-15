"""Context classifier — maps window title/url/app to project and mission guesses."""

import re

# Project classification rules: (pattern, project_id, mission_guess, reason)
PROJECT_RULES: list[tuple[re.Pattern, str, str, str]] = [
    (re.compile(r"kratos|mission.control", re.IGNORECASE), "kratos-mission-control", "KRATOS 0.10", "KRATOS repo or docs"),
    (re.compile(r"publisher.os|jarvis|argos", re.IGNORECASE), "publisher-os", "Publisher OS", "Publisher OS repo"),
    (re.compile(r"omnis|hominis", re.IGNORECASE), "omnis-control", "OMNIS", "OMNIS files or code"),
    (re.compile(r"daily.prophet|hotel|hoteis", re.IGNORECASE), "daily-prophet-hotels", "Daily Prophet", "Daily Prophet repo"),
    (re.compile(r"instagram|social.media", re.IGNORECASE), "publisher-os", "Social Media", "Instagram content"),
    (re.compile(r"akasha|biblioteca|sabedoria", re.IGNORECASE), "kratos-mission-control", "Akasha", "Knowledge base work"),
    (re.compile(r"supabase|postgres|sql", re.IGNORECASE), "kratos-mission-control", "Infra DB", "Database work"),
    (re.compile(r"docker|container", re.IGNORECASE), "kratos-mission-control", "Infra DevOps", "Container work"),
]

# Apps that map to specific projects
APP_MAP: dict[str, str] = {
    "Code": "kratos-mission-control",
    "WindowsTerminal": "kratos-mission-control",
    "Obsidian": "kratos-mission-control",
    "Chrome": None,  # determined by URL
    "Firefox": None,
    "Figma": "kratos-mission-control",
}


def classify(title: str = "", url: str = "", app: str = "") -> dict:
    """Classify a window into project/mission guesses. Returns classification dict."""
    result = {
        "project_guess": None,
        "mission_guess": None,
        "reason_guess": "",
        "confidence": 0.0,
    }

    search_text = f"{title} {url}"

    # Try URL/title patterns first
    for pattern, project_id, mission, reason in PROJECT_RULES:
        if pattern.search(search_text):
            result["project_guess"] = project_id
            result["mission_guess"] = mission
            result["reason_guess"] = reason
            result["confidence"] = 0.75
            return result

    # Try app mapping
    if app:
        mapped = APP_MAP.get(app)
        if mapped:
            result["project_guess"] = mapped
            result["mission_guess"] = "Dev Session"
            result["reason_guess"] = f"App conhecido: {app}"
            result["confidence"] = 0.5
            return result

    # Low-confidence guess based on app name
    if app:
        app_lower = app.lower()
        if any(kw in app_lower for kw in ("code", "editor", "ide", "terminal")):
            result["project_guess"] = "kratos-mission-control"
            result["mission_guess"] = "Dev Session"
            result["reason_guess"] = "Ferramenta de desenvolvimento"
            result["confidence"] = 0.35
            return result
        if any(kw in app_lower for kw in ("browser", "chrome", "firefox", "edge")):
            result["reason_guess"] = "Navegador sem URL classificável"
            result["confidence"] = 0.0
            return result

    result["reason_guess"] = "Contexto não classificado"
    return result
