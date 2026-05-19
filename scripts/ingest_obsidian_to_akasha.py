"""
Obsidian → Akasha ingestion pipeline.

Reads Obsidian vault .md files, chunks them, embeds via Ollama nomic-embed-text,
and stores in Akasha PostgreSQL.

USAGE:
  python scripts/ingest_obsidian_to_akasha.py --full           # backfill all notes
  python scripts/ingest_obsidian_to_akasha.py --incremental     # notes changed since last sync
  python scripts/ingest_obsidian_to_akasha.py --watch           # watch mode (via polling)

State stored in .planning/obsidian_to_akasha_state.json
"""
import hashlib
import json
import subprocess
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path

# Force UTF-8 on Windows
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

OBSIDIAN_PATH = Path.home() / "Documents" / "Obsidian"
STATE_FILE = Path.home() / ".planning" / "obsidian_to_akasha_state.json"

# Files/dirs to skip
SKIP_PATTERNS = [".obsidian", "_templates", ".trash", ".git", "Dashboards"]


def get_embedding(text, model="nomic-embed-text"):
    """Get embedding vector from Ollama."""
    url = "http://localhost:11434/api/embeddings"
    body = json.dumps({"model": model, "prompt": text[:2000]}).encode()
    try:
        req = urllib.request.Request(url, data=body,
                                      headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("embedding", [])
    except Exception as e:
        print(f"  Embed error: {e}")
        return None


def chunk_text(text, chunk_size=800, overlap=100):
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if len(chunk) > 50:
            chunks.append(chunk)
    return chunks


def compute_hash(text):
    return hashlib.sha256(text.encode("utf-8", errors="replace")).hexdigest()[:16]


def psql(sql):
    """Run SQL via psql, return rows as list of dicts."""
    result = subprocess.run(
        ["docker", "exec", "-i", "akasha-postgres",
         "psql", "-U", "akasha", "-d", "akasha",
         "-t", "-A", "-F", "\x1f"],
        input=sql.encode("utf-8"), capture_output=True, timeout=60,
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


def upsert_document(file_path, file_name, domain, tags, source_type="produced"):
    """Insert or update document, return doc_id."""
    file_hash = compute_hash(file_name + domain)
    clean_tags = "{" + ",".join(f'"{t}"' for t in tags) + "}"
    sql = f"""
        INSERT INTO documents (file_path, file_name, file_type, file_hash, domain, source_type, tags, trust_score)
        VALUES ('{file_path}', '{file_name}', 'md', '{file_hash}', '{domain}', '{source_type}', '{clean_tags}', 0.8)
        ON CONFLICT (file_path) DO UPDATE SET
            file_hash = '{file_hash}',
            domain = '{domain}',
            tags = '{clean_tags}',
            updated_at = now()
        RETURNING id;
    """
    rows = psql(sql)
    return int(rows[0][0]) if rows else None


def delete_chunks(doc_id):
    psql(f"DELETE FROM document_chunks WHERE document_id = {doc_id};")


def insert_chunk(doc_id, chunk_idx, text, section=""):
    """Insert one chunk and its embedding."""
    chash = compute_hash(text)
    safe_text = text.replace("'", "''")
    safe_section = section.replace("'", "''") if section else ""

    sql = f"""
        INSERT INTO document_chunks (document_id, chunk_index, chunk_text, chunk_hash, section_title, char_count)
        VALUES ({doc_id}, {chunk_idx}, '{safe_text}', '{chash}', '{safe_section}', {len(text)})
        ON CONFLICT (document_id, chunk_index) DO UPDATE SET
            chunk_text = '{safe_text}',
            chunk_hash = '{chash}',
            section_title = '{safe_section}',
            char_count = {len(text)}
        RETURNING id;
    """
    rows = psql(sql)
    return int(rows[0][0]) if rows else None


def insert_embedding(chunk_id, embedding):
    """Insert nomic embedding for a chunk."""
    if not embedding or len(embedding) != 768:
        return
    vec_str = "[" + ",".join(str(e) for e in embedding) + "]"
    sql = f"""
        INSERT INTO chunk_embeddings (chunk_id, model_name, embedding_nomic)
        VALUES ({chunk_id}, 'nomic-embed-text', '{vec_str}')
        ON CONFLICT (chunk_id) DO UPDATE SET
            embedding_nomic = '{vec_str}',
            model_name = 'nomic-embed-text';
    """
    psql(sql)


def parse_frontmatter(content):
    """Extract YAML frontmatter fields from Obsidian note."""
    domain = ""
    tags = []
    if content.startswith("---"):
        end = content.find("---", 3)
        if end > 0:
            fm = content[3:end]
            for line in fm.split("\n"):
                line = line.strip()
                if line.startswith("domain:"):
                    domain = line.split(":", 1)[1].strip()
                elif line.startswith("tags:"):
                    tag_str = line.split(":", 1)[1].strip()
                    tags = [t.strip().strip("[]'\"") for t in tag_str.replace("[", "").replace("]", "").split(",") if t.strip()]
    return domain, tags


def scan_vault():
    """Scan Obsidian vault for .md files to ingest (excluding system dirs)."""
    files = []
    for md in OBSIDIAN_PATH.rglob("*.md"):
        path_str = str(md)
        if any(p in path_str for p in SKIP_PATTERNS):
            continue
        files.append(md)
    return files


def ingest_note(filepath: Path):
    """Ingest one Obsidian note into Akasha."""
    try:
        content = filepath.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return None

    if len(content) < 50:
        return None

    domain, tags = parse_frontmatter(content)
    if not domain:
        domain = "obsidian-inbox"
    if not tags:
        tags = ["obsidian"]

    # Remove frontmatter for chunking
    if content.startswith("---"):
        end = content.find("---", 3)
        body = content[end + 3:] if end > 0 else content
    else:
        body = content

    rel_path = str(filepath.relative_to(OBSIDIAN_PATH))
    doc_id = upsert_document(rel_path, filepath.stem, domain, tags)

    if not doc_id:
        return None

    # Re-chunk
    delete_chunks(doc_id)
    chunks = chunk_text(body, chunk_size=800, overlap=100)

    for idx, chunk in enumerate(chunks):
        cid = insert_chunk(doc_id, idx, chunk)
        if cid:
            emb = get_embedding(chunk)
            if emb:
                insert_embedding(cid, emb)

    return {"file": rel_path, "domain": domain, "chunks": len(chunks)}


def run_full():
    """Full backfill: ingest all Obsidian notes into Akasha."""
    files = scan_vault()
    total = len(files)
    print(f"Scanning {total} notes...")

    synced = []
    domains = {}
    ok, skip, err = 0, 0, 0

    for i, fp in enumerate(files, 1):
        result = ingest_note(fp)
        if result:
            ok += 1
            d = result["domain"]
            domains[d] = domains.get(d, 0) + 1
        else:
            skip += 1

        if i % 100 == 0:
            print(f"  [{i}/{total}] {ok} ok, {skip} skip")

        # Rate limit: 2 embeds/sec via Ollama
        time.sleep(0.5)

    print(f"\n  Done: {ok} ingested, {skip} skipped")
    for d, c in sorted(domains.items()):
        print(f"    {d}: {c}")

    # Save state
    state = {
        "last_sync": datetime.now().isoformat(),
        "synced_count": ok,
        "skipped_count": skip,
    }
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def run_incremental():
    """Incremental sync: only notes modified since last sync."""
    if STATE_FILE.exists():
        state = json.loads(STATE_FILE.read_text())
        last_sync = datetime.fromisoformat(state["last_sync"])
    else:
        last_sync = datetime(2000, 1, 1)

    files = scan_vault()
    changed = [f for f in files if datetime.fromtimestamp(f.stat().st_mtime) > last_sync]

    print(f"Incremental: {len(changed)} changed since {last_sync.isoformat()}")
    for fp in changed:
        result = ingest_note(fp)
        if result:
            # Clean encoding for Windows console
            fname = result['file'].encode('ascii', errors='replace').decode('ascii')
            print(f"  + {fname} ({result['chunks']} chunks)")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "--full"
    print("=" * 55)
    print("OBSIDIAN -> AKASHA INGESTION")
    print("=" * 55)

    if cmd == "--full":
        run_full()
    elif cmd == "--incremental":
        run_incremental()
    elif cmd == "--watch":
        print("Watch mode: polling every 60s... (Ctrl+C to stop)")
        try:
            while True:
                run_incremental()
                time.sleep(60)
        except KeyboardInterrupt:
            print("\nWatch stopped.")
    else:
        print("Usage: python ingest_obsidian_to_akasha.py [--full|--incremental|--watch]")
