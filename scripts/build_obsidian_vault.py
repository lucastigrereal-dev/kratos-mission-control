"""Build Obsidian vault from Akasha PostgreSQL content.

Exports documents organized by domain with YAML frontmatter.
Creates dashboards, templates, and vault configuration.
"""
import json
import re
import subprocess
from collections import defaultdict
from datetime import datetime
from pathlib import Path

OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"

DOMAIN_PARA = {
    "pessoal_estrategico": "3-Resources/Estrategia",
    "marketing_instagram": "3-Resources/Marketing",
    "cloud_code": "2-Areas/Tech",
    "estudos": "3-Resources/Estudos",
    "juridico": "3-Resources/Juridico",
    "ia_automacao": "2-Areas/Tech/IA",
    "vendas": "2-Areas/Vendas",
    "projetos_digitais": "1-Projects/Digital",
    "hotelaria_turismo": "2-Areas/Hotelaria",
    "conversas": "3-Resources/Conversas",
    "projetos": "1-Projects",
    "omnis": "2-Areas/Tech/OMNIS",
}

TAG_MAP = {
    "pessoal_estrategico": ["estrategia", "pessoal", "decisao"],
    "marketing_instagram": ["instagram", "marketing", "copy", "socialmedia"],
    "cloud_code": ["dev", "cloud", "codigo"],
    "estudos": ["aprendizado", "estudo", "referencia"],
    "juridico": ["legal", "contrato", "compliance"],
    "ia_automacao": ["ia", "automacao", "ai"],
    "vendas": ["vendas", "pitch", "comercial", "investidor"],
    "projetos_digitais": ["projeto", "digital", "produto"],
    "hotelaria_turismo": ["hotel", "turismo", "hospitality"],
    "conversas": ["chat", "conversa", "historico"],
    "projetos": ["projeto", "gestao"],
    "omnis": ["omnis", "automacao", "skill"],
}

INVALID_CHARS = re.compile(r'[<>:\"/\\|?*\x00-\x1f]')
MULTI_DASH = re.compile(r'-{2,}')
MULTI_SPACE = re.compile(r'\s+')


SEP = "«|»"  # unlikely separator sequence

def run_sql_csv(query):
    """Run SQL and return rows split by separator sequence."""
    result = subprocess.run(
        ["docker", "exec", "-i", "akasha-postgres",
         "psql", "-U", "akasha", "-d", "akasha",
         "-t", "-A", "-F", SEP, "-c", query],
        capture_output=True, text=True, timeout=120,
        encoding="utf-8", errors="replace",
    )
    if result.returncode != 0:
        err = result.stderr[:200] if result.stderr else "unknown"
        if "ERROR" in err:
            print(f"  SQL ERROR: {err}")
        return []
    if not result.stdout:
        return []
    rows = []
    for line in result.stdout.strip().split("\n"):
        line = line.strip()
        if line:
            parts = line.split(SEP)
            # Clean up control characters from each part
            clean = []
            for p in parts:
                p = ''.join(c for c in p if c.isprintable() or c in '\t\n\r')
                clean.append(p)
            rows.append(clean)
    return rows


def safe_filename(title, max_len=60):
    """Create Windows-safe filename from title."""
    if not title:
        return "sem-titulo"
    name = INVALID_CHARS.sub('', title)
    name = MULTI_SPACE.sub(' ', name)
    name = name.strip().strip('.')
    if not name:
        return "sem-titulo"
    name = name[:max_len].strip()
    return name


def ensure_dir(path):
    path.mkdir(parents=True, exist_ok=True)
    return path


def build_folders():
    folders = [
        "0-Inbox", "1-Projects", "1-Projects/Digital",
        "2-Areas/Vendas", "2-Areas/Tech/IA", "2-Areas/Tech/OMNIS",
        "2-Areas/Hotelaria", "3-Resources/Estrategia",
        "3-Resources/Marketing", "3-Resources/Estudos",
        "3-Resources/Juridico", "3-Resources/Conversas",
        "4-Archive", "Dashboards", "Daily", "_templates",
    ]
    for f in folders:
        ensure_dir(OBSIDIAN_PATH / f)
    print(f"  {len(folders)} folders created")


def export_docs():
    """Export top documents by domain from Akasha."""
    # Fetch all doc IDs and their first 5 chunks in one batch query
    docs_and_chunks = run_sql_csv("""
        WITH ranked AS (
            SELECT dc.document_id, dc.chunk_text, dc.chunk_index,
                   ROW_NUMBER() OVER (PARTITION BY dc.document_id ORDER BY dc.chunk_index) as rn
            FROM document_chunks dc
        )
        SELECT d.id, d.file_name, d.domain, d.source_type, d.file_type,
               r.chunk_text, r.chunk_index
        FROM documents d
        LEFT JOIN ranked r ON d.id = r.document_id AND r.rn <= 5
        WHERE d.domain IS NOT NULL AND d.file_name IS NOT NULL AND d.file_name != ''
          AND d.domain ~ '^[a-z][a-z0-9_]*$'
          AND length(d.domain) < 40
          AND length(d.file_name) < 200
          AND d.file_name ~ '^[[:print:]]+$'
        ORDER BY d.domain, d.file_name, r.chunk_index
        LIMIT 150000
    """)

    # Group chunks by document
    doc_data = defaultdict(lambda: {"chunks": []})
    for row in docs_and_chunks:
        if len(row) < 5:
            continue
        doc_id, file_name, domain, source_type, file_type = row[0], row[1], row[2], row[3], row[4]
        chunk_text = row[5] if len(row) > 5 else ""
        if doc_id not in doc_data:
            doc_data[doc_id]["file_name"] = file_name
            doc_data[doc_id]["domain"] = domain
            doc_data[doc_id]["source_type"] = source_type
            doc_data[doc_id]["file_type"] = file_type
        if chunk_text:
            doc_data[doc_id]["chunks"].append(chunk_text)

    exported = {}
    ok, skip = 0, 0

    for doc_id, data in doc_data.items():
        file_name = data["file_name"]
        domain = data["domain"]
        source_type = data["source_type"]
        file_type = data["file_type"]
        chunks_list = data["chunks"]

        if not domain or not isinstance(domain, str):
            skip += 1
            continue
        domain = domain.lower().strip()
        if not domain or len(domain) > 50:
            skip += 1
            continue

        para_folder = DOMAIN_PARA.get(domain, f"3-Resources/{domain.title()}")
        folder = OBSIDIAN_PATH / para_folder
        try:
            ensure_dir(folder)
        except (OSError, ValueError):
            skip += 1
            continue

        tags = TAG_MAP.get(domain, [domain])
        note_title = Path(file_name).stem if file_name else f"Doc-{doc_id}"
        fname = safe_filename(note_title)
        if not fname or fname == "sem-titulo":
            skip += 1
            continue

        fpath = folder / f"{fname}.md"
        idx = 1
        while fpath.exists():
            fpath = folder / f"{fname}-{idx}.md"
            idx += 1

        now = datetime.now().strftime("%Y-%m-%d")
        fm = (
            f'---\n'
            f'title: "{note_title}"\n'
            f'tags: [{", ".join(tags)}]\n'
            f'domain: {domain}\n'
            f'para: inbox\n'
            f'source_type: {source_type}\n'
            f'file_type: {file_type}\n'
            f'akasha_id: {doc_id}\n'
            f'created: {now}\n'
            f'updated: {now}\n'
            f'source: akasha-export\n'
            f'---\n\n'
            f'# {note_title}\n\n'
        )
        if chunks_list:
            fm += "\n\n".join(chunks_list)[:30000]

        try:
            fpath.write_text(fm, encoding="utf-8")
        except OSError:
            skip += 1
            continue

        exported[domain] = exported.get(domain, 0) + 1
        ok += 1
        if ok % 250 == 0:
            print(f"  ...{ok} notes")

    print(f"  {ok} notes exported, {skip} skipped")
    for d, c in sorted(exported.items()):
        print(f"    {d}: {c}")


def create_dashboards():
    d = OBSIDIAN_PATH / "Dashboards"
    ensure_dir(d)
    now = datetime.now().strftime("%Y-%m-%d")

    (d / "Pitch-Investidor.md").write_text(f"""---
title: "Dashboard — Pitch para Investidores"
tags: [dashboard, pitch, investidor]
domain: vendas
created: {now}
---

# Dashboard: Argumentos para Investidores

## Copys e Argumentos
```dataview
TABLE file.tags as Tags, domain, source_type as Fonte
FROM "3-Resources/Marketing" OR "2-Areas/Vendas"
WHERE contains(tags, "investidor") OR contains(tags, "pitch") OR contains(tags, "vendas")
SORT file.name ASC
```

## Prova Social e Resultados
```dataview
TABLE domain, file.tags as Tags
FROM "3-Resources/Marketing" OR "2-Areas/Vendas" OR "3-Resources/Estrategia"
WHERE contains(tags, "crescimento") OR contains(tags, "resultado")
SORT file.name ASC
```

## Estratégia
```dataview
TABLE domain, file.tags as Tags
FROM "3-Resources/Estrategia" OR "1-Projects"
WHERE contains(tags, "case") OR contains(tags, "estrategia")
SORT file.name ASC
```
""", encoding="utf-8")

    (d / "Visao-Geral.md").write_text(f"""---
title: "Dashboard — Visão Geral do Conhecimento"
tags: [dashboard, overview]
created: {now}
---

# Visão Geral

## Por Domínio
```dataview
TABLE length(rows) as Notas
FROM "1-Projects" OR "2-Areas" OR "3-Resources"
GROUP BY domain
SORT rows DESC
```

## Notas Recentes
```dataview
TABLE domain, date(created) as Criado, file.tags as Tags
FROM "1-Projects" OR "2-Areas" OR "3-Resources"
SORT created DESC
LIMIT 20
```
""", encoding="utf-8")

    (d / "Inbox-Review.md").write_text(f"""---
title: "Dashboard — Revisão de Inbox"
tags: [dashboard, inbox]
created: {now}
---

# Revisão de Inbox

```dataview
TABLE file.tags as Tags, domain, date(created) as Criado
FROM "0-Inbox"
SORT created DESC
LIMIT 20
```
""", encoding="utf-8")

    print("  3 dashboards created")


def create_templates():
    td = ensure_dir(OBSIDIAN_PATH / "_templates")

    (td / "nota-nova.md").write_text("""---
title: "<% tp.file.title %>"
tags: []
domain:
para: inbox
status: active
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
source: manual
---

# <% tp.file.title %>

## Contexto

## Conteudo

## Referencias
""", encoding="utf-8")

    (td / "briefing-diario.md").write_text("""---
title: "Briefing — <% tp.date.now("YYYY-MM-DD") %>"
tags: [briefing, diario]
created: <% tp.date.now("YYYY-MM-DD") %>
---

# Briefing Diario — <% tp.date.now("DD/MM/YYYY") %>

## Top 3 Prioridades
1.
2.
3.

## Insights do Dia

## Bloqueios

## Next Action Concreta
""", encoding="utf-8")

    print("  2 templates created")


def init_vault_config():
    oc = ensure_dir(OBSIDIAN_PATH / ".obsidian")

    (oc / "app.json").write_text(json.dumps({
        "promptDelete": False,
        "attachmentFolderPath": "_assets",
        "spellcheck": True,
        "spellcheckLanguages": ["pt-BR", "en-US"],
        "livePreview": True,
        "defaultViewMode": "source",
    }, indent=2))

    (oc / "appearance.json").write_text(json.dumps({
        "theme": "obsidian",
        "accentColor": "#7c3aed",
    }, indent=2))

    (oc / "core-plugins.json").write_text(json.dumps([
        "file-explorer", "global-search", "switcher", "graph",
        "backlink", "outgoing-link", "tag-pane", "page-preview",
        "daily-notes", "templates", "note-composer", "command-palette",
        "slash-command", "editor-status", "markdown-importer",
        "outline", "word-count", "workspaces",
    ], indent=2))

    (oc / "community-plugins.json").write_text(json.dumps([
        "dataview", "templater-obsidian", "quickadd",
        "obsidian-local-rest-api", "periodic-notes",
        "obsidian-linter", "metadata-menu", "omnisearch",
    ], indent=2))

    (oc / "daily-notes.json").write_text(json.dumps({
        "folder": "Daily",
        "format": "YYYY-MM-DD",
        "template": "_templates/briefing-diario.md",
    }, indent=2))

    (oc / "templates.json").write_text(json.dumps({
        "folder": "_templates",
    }, indent=2))

    (oc / "dataview.json").write_text(json.dumps({
        "enableInlineDataview": True,
        "enableDataviewJs": True,
        "enableInlineDataviewJs": True,
    }, indent=2))

    (oc / "hotkeys.json").write_text(json.dumps({
        "quickadd:capture": [{"modifiers": ["Mod"], "key": "Q"}],
        "templater-obsidian:insert-templater": [{"modifiers": ["Mod"], "key": "T"}],
    }, indent=2))

    print("  .obsidian vault config initialized")


def main():
    print("=" * 55)
    print("BUILDING OBSIDIAN VAULT FROM AKASHA")
    print("=" * 55)

    print("\n[1/5] Folder structure...")
    build_folders()

    print("\n[2/5] Exporting documents...")
    export_docs()

    print("\n[3/5] Dashboards...")
    create_dashboards()

    print("\n[4/5] Templates...")
    create_templates()

    print("\n[5/5] Vault config...")
    init_vault_config()

    total = sum(1 for _ in OBSIDIAN_PATH.rglob("*.md"))
    print(f"\nDONE. Path: {OBSIDIAN_PATH}")
    print(f"Total .md files: {total}")


if __name__ == "__main__":
    main()
