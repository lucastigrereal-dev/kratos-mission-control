"""
Unified RAG + Pitch Generator — combines Akasha + Obsidian + LLM.

USAGE:
  python scripts/rag_pitch_generator.py "tema aqui"
  python scripts/rag_pitch_generator.py "convencer investidor sobre ROI de redes sociais"
  python scripts/rag_pitch_generator.py "argumentos para pitch" vendas

Requirements:
  - Akasha PostgreSQL Docker container (akasha-postgres) running
"""
import json
import sys
import subprocess
from collections import Counter
from datetime import datetime
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"


def _decode_escaped(text):
    """Decode PostgreSQL 'escape' format (octal \\ooo) back to real text."""
    try:
        return text.encode("latin-1").decode("unicode_escape")
    except Exception:
        return text


def search_akasha(query_text, top_k=15, domain_filter=None):
    """Search Akasha using ILIKE keyword matching with safe bytea encoding
    to bypass UTF-8 validation errors on corrupted chunk_text rows."""
    keywords = [w.strip() for w in query_text.split() if len(w.strip()) > 2]
    if not keywords:
        return []

    conditions = " OR ".join(
        f"(dc.chunk_text ILIKE '%' || '{kw}' || '%')" for kw in keywords
    )

    where = ""
    if domain_filter:
        where = f"AND d.domain = '{domain_filter}'"

    # Use safe_chunk_snippet + DISTINCT ON to deduplicate by document
    sql = f"""
        SELECT DISTINCT ON (d.id) dc.id, d.file_name, d.domain, dc.section_title,
               safe_chunk_snippet(dc.chunk_text, 800) as snippet,
               d.file_type
        FROM document_chunks dc
        JOIN documents d ON dc.document_id = d.id
        WHERE ({conditions})
          {where}
        LIMIT {top_k * 20}
    """

    try:
        result = subprocess.run(
            ["docker", "exec", "-i", "akasha-postgres",
             "psql", "-U", "akasha", "-d", "akasha",
             "-t", "-A", "-F", "\x1f"],
            input=sql.encode("utf-8"), capture_output=True, timeout=30,
        )
        stdout = result.stdout.decode("utf-8", errors="replace")
        stderr = result.stderr.decode("utf-8", errors="replace")

        if "ERROR" in stderr:
            print(f"  psql error: {stderr.strip()[:200]}")
            return []

        kw_lower = [kw.lower() for kw in keywords]
        results = []
        for line in stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("\x1f")
            if len(parts) < 5:
                continue
            snippet_raw = _decode_escaped(parts[4] if len(parts) > 4 else "")
            snippet = "".join(c for c in snippet_raw if c.isprintable() or c in " \t")
            snippet_lower = snippet.lower()
            match_count = sum(1 for kw in kw_lower if kw in snippet_lower)
            try:
                results.append({
                    "chunk_id": parts[0].strip(),
                    "doc_title": parts[1].strip(),
                    "domain": parts[2].strip(),
                    "section_title": parts[3].strip() if parts[3].strip() else "N/A",
                    "snippet": snippet[:800],
                    "score": float(max(match_count, 1)),
                })
            except (ValueError, IndexError):
                continue

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:top_k]
    except Exception as e:
        print(f"  Akasha search error: {e}")
        return []


def search_obsidian(query_text, max_results=10):
    """Search Obsidian vault markdown files for relevant content."""
    if not OBSIDIAN_PATH.exists():
        return []

    keywords = [kw.lower() for kw in query_text.split() if len(kw) > 2]
    results = []
    seen_titles = set()

    all_md = sorted(
        [f for f in OBSIDIAN_PATH.rglob("*.md")
         if ".obsidian" not in str(f) and "_templates" not in str(f)],
        key=lambda f: (
            0 if not f.stem.rpartition("-")[2].isdigit() else 1,
            f.stat().st_mtime,
        ),
        reverse=False,
    )
    for md_file in all_md:
        base_stem = md_file.stem.rsplit("-", 1)[0] if md_file.stem.rpartition("-")[2].isdigit() else md_file.stem
        if base_stem.lower() in seen_titles:
            continue
        seen_titles.add(base_stem.lower())
        try:
            content = md_file.read_text(encoding="utf-8", errors="replace")
            content_lower = content.lower()
            score = sum(1 for kw in keywords if kw in content_lower)
            if score > 0:
                for kw in keywords:
                    idx = content_lower.find(kw)
                    if idx >= 0:
                        start = max(0, idx - 100)
                        end = min(len(content), idx + 300)
                        snippet = content[start:end].replace("\n", " ").strip()
                        snippet = "".join(c for c in snippet if c.isprintable() or c in " \t")
                        results.append({
                            "file": str(md_file.relative_to(OBSIDIAN_PATH)),
                            "title": md_file.stem,
                            "score": score,
                            "snippet": snippet[:400],
                        })
                        break
        except Exception:
            continue

    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:max_results]


def build_context(query_text, domain_filter=None):
    """Build unified context from Akasha + Obsidian."""
    print(f"[search] Akasha ILIKE search...")
    akasha_results = search_akasha(query_text, top_k=15, domain_filter=domain_filter)
    print(f"         Akasha: {len(akasha_results)} results")

    print(f"[search] Obsidian vault scan...")
    obsidian_results = search_obsidian(query_text, max_results=10)
    print(f"         Obsidian: {len(obsidian_results)} results")

    return {
        "query": query_text,
        "akasha_results": akasha_results,
        "obsidian_results": obsidian_results,
        "total_sources": len(akasha_results) + len(obsidian_results),
        "timestamp": datetime.now().isoformat(),
    }


def build_rag_prompt(context):
    """Build the RAG prompt for pitch/presentation generation."""
    query = context["query"]
    blocks = []

    akasha = context["akasha_results"]
    if akasha:
        blocks.append("## Conteudo do Akasha (PostgreSQL — conhecimento indexado)")
        for i, r in enumerate(akasha[:10], 1):
            score = r.get('score', 0)
            blocks.append(
                f"[A{i}] Domain: {r['domain']} | "
                f"Section: {r.get('section_title') or 'N/A'} | "
                f"Matches: {score:.0f}\n"
                f"{r['snippet']}\n"
            )

    obsidian = context["obsidian_results"]
    if obsidian:
        blocks.append("\n## Conteudo do Obsidian (Notas pessoais)")
        for i, r in enumerate(obsidian[:6], 1):
            blocks.append(
                f"[O{i}] Arquivo: {r['file']} | Matches: {r['score']}\n"
                f"{r['snippet']}\n"
            )

    source_text = "\n".join(blocks)

    prompt = f"""# TAREFA
Use APENAS os conteudos abaixo, vindos do meu banco Akasha (PostgreSQL)
e das minhas notas do Obsidian.

Tema: **{query}**

{source_text}

# INSTRUCOES
A partir desses conteudos, monte um ROTEIRO DE APRESENTACAO em 10-15 slides.

Para cada slide, entregue:
- TITULO impactante
- 3 a 5 BULLETS principais
- Sugestao de IMAGEM ou GRAFICO (opcional)

Destaque FRASES que podem ser usadas como COPY de anuncio/pitch rapido.

Termine com um slide de CHAMADA PARA ACAO forte.

Se algum topico nao tiver cobertura suficiente nos conteudos fornecidos,
indique como [A COMPLETAR] com sugestao do que buscar.

Formato: Markdown estruturado, pronto para transformar em apresentacao."""

    return prompt


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/rag_pitch_generator.py 'tema' [domain_filter]")
        print("Ex: python scripts/rag_pitch_generator.py 'investir em redes sociais' vendas")
        sys.exit(1)

    query = sys.argv[1]
    domain_filter = sys.argv[2] if len(sys.argv) > 2 else None

    print("=" * 60)
    print("RAG PITCH GENERATOR")
    print("=" * 60)
    print(f"Tema: {query}")
    if domain_filter:
        print(f"Filtro: {domain_filter}")

    context = build_context(query, domain_filter)

    if context["total_sources"] == 0:
        print("\n  Nenhum resultado encontrado.")
        print("  Domains disponiveis:")
        for d in ["vendas", "marketing_instagram", "pessoal_estrategico",
                   "juridico", "cloud_code", "ia_automacao"]:
            print(f"    {d}")
        sys.exit(1)

    prompt = build_rag_prompt(context)

    output = Path.home() / ".planning" / "pitch_output.md"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        f"# RAG PITCH: {query}\n"
        f"Gerado: {context['timestamp']}\n"
        f"Fontes: {len(context['akasha_results'])} Akasha + "
        f"{len(context['obsidian_results'])} Obsidian\n\n"
        f"{prompt}\n",
        encoding="utf-8",
    )

    ctx_file = Path.home() / ".planning" / "pitch_context.json"
    try:
        ctx_file.write_text(
            json.dumps(context, indent=2, ensure_ascii=False), encoding="utf-8"
        )
    except Exception:
        pass

    print(f"\n  Total sources: {context['total_sources']}")
    domains = Counter(r["domain"] for r in context["akasha_results"])
    for d, c in domains.most_common():
        print(f"    {d}: {c}")
    print(f"\n  Prompt saved: {output}")
    print(f"  NEXT: Paste prompt into Claude Code to generate presentation")


if __name__ == "__main__":
    main()
