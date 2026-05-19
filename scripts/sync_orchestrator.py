"""
Unified Sync Orchestrator — keeps Akasha, Obsidian, and Notion in sync.

USAGE:
  python scripts/sync_orchestrator.py status    # Check sync health of all 3 systems
  python scripts/sync_orchestrator.py sync      # Run full sync cycle
  python scripts/sync_orchestrator.py watch     # Continuous sync (polling)
  python scripts/sync_orchestrator.py search "query"  # Unified search across all 3

Architecture:
  Notion ──→ Obsidian ──→ Akasha (PostgreSQL pgvector)
     ↑                       │
     └───────────────────────┘
         (bidirectional via manual sync + RAG)
"""
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"
PLANNING = Path.home() / ".planning"
SCRIPTS = Path(__file__).parent


def psql(sql):
    """Run a query against Akasha, return rows."""
    result = subprocess.run(
        ["docker", "exec", "-i", "akasha-postgres",
         "psql", "-U", "akasha", "-d", "akasha",
         "-t", "-A", "-F", "\x1f"],
        input=(sql + "\n").encode("utf-8"), capture_output=True, timeout=30,
    )
    stdout = result.stdout.decode("utf-8", errors="replace")
    stderr = result.stderr.decode("utf-8", errors="replace")
    if "ERROR" in stderr:
        print(f"  SQL error: {stderr.strip()[:200]}")
        return []
    rows = []
    for line in stdout.strip().split("\n"):
        if line.strip():
            rows.append(line.split("\x1f"))
    return rows


def check_akasha():
    """Check Akasha health."""
    rows = psql("""
        SELECT
            (SELECT count(*) FROM documents) as docs,
            (SELECT count(*) FROM document_chunks) as chunks,
            (SELECT count(*) FROM chunk_embeddings) as embeddings,
            (SELECT count(DISTINCT domain) FROM documents WHERE domain IS NOT NULL) as domains
    """)
    if rows and len(rows[0]) >= 4:
        return {
            "status": "healthy",
            "documents": int(rows[0][0]),
            "chunks": int(rows[0][1]),
            "embeddings": int(rows[0][2]),
            "domains": int(rows[0][3]),
        }
    return {"status": "offline"}


def check_obsidian():
    """Check Obsidian vault health."""
    if not OBSIDIAN_PATH.exists():
        return {"status": "missing", "path": str(OBSIDIAN_PATH)}

    total = sum(1 for _ in OBSIDIAN_PATH.rglob("*.md"))
    inbox = len(list((OBSIDIAN_PATH / "0-Inbox").rglob("*.md"))) if (OBSIDIAN_PATH / "0-Inbox").exists() else 0
    projects = len(list((OBSIDIAN_PATH / "1-Projects").rglob("*.md"))) if (OBSIDIAN_PATH / "1-Projects").exists() else 0
    areas = len(list((OBSIDIAN_PATH / "2-Areas").rglob("*.md"))) if (OBSIDIAN_PATH / "2-Areas").exists() else 0
    resources = len(list((OBSIDIAN_PATH / "3-Resources").rglob("*.md"))) if (OBSIDIAN_PATH / "3-Resources").exists() else 0

    return {
        "status": "healthy",
        "total_notes": total,
        "by_para": {
            "inbox": inbox,
            "projects": projects,
            "areas": areas,
            "resources": resources,
        }
    }


def check_notion():
    """Check Notion connection state."""
    state_file = PLANNING / "notion_sync_state.json"
    if state_file.exists():
        state = json.loads(state_file.read_text())
        return {
            "status": "configured",
            "last_sync": state.get("last_sync", "never"),
            "last_count": state.get("synced_count", 0),
            "note": "Run 'python scripts/ingest_notion.py --full' to sync"
        }
    return {
        "status": "unconfigured",
        "note": "No sync yet. First share Notion pages with 'AKASHA+OBSIDIAN' integration, then run ingest_notion.py"
    }


def check_ollama():
    """Check if Ollama is available for embeddings."""
    import urllib.request
    try:
        req = urllib.request.Request("http://localhost:11434/api/tags")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            models = [m["name"] for m in data.get("models", [])]
            return {
                "status": "running",
                "models": models,
                "has_embed": "nomic-embed-text" in str(models),
            }
    except Exception:
        return {"status": "offline"}


def print_status():
    """Print full sync status of all systems."""
    print("=" * 60)
    print("SYNC ORCHESTRATOR — STATUS REPORT")
    print(f"Time: {datetime.now().isoformat()}")
    print("=" * 60)

    # Akasha
    a = check_akasha()
    print(f"\n[Akasha PostgreSQL]")
    print(f"  Status:     {a['status']}")
    if a['status'] == 'healthy':
        print(f"  Documents:  {a['documents']:,}")
        print(f"  Chunks:     {a['chunks']:,}")
        print(f"  Embeddings: {a['embeddings']:,}")
        print(f"  Domains:    {a['domains']}")

    # Obsidian
    o = check_obsidian()
    print(f"\n[Obsidian Vault] {OBSIDIAN_PATH}")
    print(f"  Status:     {o['status']}")
    if o['status'] == 'healthy':
        print(f"  Total .md:  {o['total_notes']:,}")
        for para, count in o['by_para'].items():
            print(f"  {para:>12}: {count:,}")

    # Notion
    n = check_notion()
    print(f"\n[Notion Connector]")
    print(f"  Status:     {n['status']}")
    if n.get('note'):
        print(f"  Note:       {n['note']}")

    # Ollama
    ol = check_ollama()
    print(f"\n[Ollama Embedding]")
    print(f"  Status:     {ol['status']}")
    if ol['status'] == 'running':
        print(f"  Has embed:  {ol['has_embed']}")

    # Pipeline status
    print(f"\n[Sync Pipeline]")
    print(f"  Akasha -> Obsidian:   python scripts/build_obsidian_vault.py")
    print(f"  Obsidian -> Akasha:   python scripts/ingest_obsidian_to_akasha.py [--full|--incremental]")
    print(f"  Notion -> Obsidian:   python scripts/ingest_notion.py --full")
    print(f"  Unified RAG Search:   python scripts/rag_pitch_generator.py \"query\"")


def run_full_sync():
    """Run complete sync cycle."""
    print("=" * 60)
    print("FULL SYNC CYCLE")
    print("=" * 60)

    print("\n[1/3] Notion → Obsidian")
    print("(Run manually after sharing Notion pages with integration)")
    # subprocess.run([sys.executable, str(SCRIPTS / "ingest_notion.py"), "--full"])

    print("\n[2/3] Obsidian → Akasha")
    subprocess.run([sys.executable, str(SCRIPTS / "ingest_obsidian_to_akasha.py"), "--incremental"])

    print("\n[3/3] Akasha → Obsidian (vault rebuild)")
    subprocess.run([sys.executable, str(SCRIPTS / "build_obsidian_vault.py")])

    print("\n" + "=" * 60)
    print("SYNC CYCLE COMPLETE")
    print("=" * 60)
    print_status()


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"

    if cmd == "status":
        print_status()
    elif cmd == "sync":
        run_full_sync()
    elif cmd == "watch":
        print("Watch mode: syncing every 5 minutes... (Ctrl+C to stop)")
        import time
        try:
            while True:
                print(f"\n--- Sync cycle {datetime.now().isoformat()} ---")
                run_full_sync()
                time.sleep(300)
        except KeyboardInterrupt:
            print("\nWatch stopped.")
    else:
        print("Usage: python sync_orchestrator.py [status|sync|watch]")
