"""Safe ingestion: Akasha → Qdrant jarvis_memory_v2 (768d nomic embeddings).

FASE 13A.4 — Sample Population.

Rules:
- NEVER delete collection
- NEVER re-embed 600K chunks
- Batch max 50 points per upsert
- Hash-check chunk_text before importing stale embeddings
- --dry-run validates without writing
"""

import argparse
import hashlib
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import psycopg2
import psycopg2.extras
import requests
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

# ── Config ──────────────────────────────────────────────────────────────────────

AKASHA_DSN = "dbname=akasha user=akasha password=akasha123 host=127.0.0.1 port=5432"
QDRANT_URL = "http://127.0.0.1:6333"
OLLAMA_URL = "http://127.0.0.1:11434"
COLLECTION_NAME = "jarvis_memory_v2"
VECTOR_DIM = 768
BATCH_SIZE = 50
EMBED_BATCH_SIZE = 100

REPORTS_DIR = Path(
    r"C:\Users\lucas\Desktop\OMNIS_KRATOS_CCOO_ROADMAP_EXECUTION_2026-05-19"
    r"\reports\fase13\memory"
)
CHECKPOINT_FILE = REPORTS_DIR / "checkpoint.json"
DEAD_LETTER_FILE = REPORTS_DIR / "dead_letter.json"


# ── Pre-flight checks ───────────────────────────────────────────────────────────

def check_qdrant() -> dict:
    """Verify Qdrant is online and jarvis_memory_v2 exists."""
    client = QdrantClient(url=QDRANT_URL, timeout=10)
    collections = client.get_collections()
    names = [c.name for c in collections.collections]

    if COLLECTION_NAME not in names:
        return {"ok": False, "error": f"Collection '{COLLECTION_NAME}' not found"}

    info = client.get_collection(COLLECTION_NAME)
    return {
        "ok": True,
        "points": info.points_count,
        "dimensions": info.config.params.vectors.size,
        "status": info.status,
    }


def check_ollama() -> dict:
    """Verify Ollama is online and nomic-embed-text is available."""
    try:
        resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        resp.raise_for_status()
        models = [m["name"] for m in resp.json().get("models", [])]
        has_nomic = any("nomic-embed-text" in m for m in models)
        return {"ok": has_nomic, "models": models}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def check_akasha() -> dict:
    """Verify Akasha PostgreSQL is accessible."""
    try:
        conn = psycopg2.connect(AKASHA_DSN)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM chunk_embeddings WHERE embedding_nomic IS NOT NULL")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return {"ok": True, "nomic_embeddings": count}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ── Safe ingestion ──────────────────────────────────────────────────────────────

def fetch_seed_chunks(limit: int | None = None) -> list[dict]:
    """Fetch chunks with existing nomic embeddings from Akasha."""
    conn = psycopg2.connect(AKASHA_DSN)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    query = """
        SELECT
            dc.id AS chunk_id,
            dc.document_id AS doc_id,
            dc.chunk_text,
            dc.chunk_index,
            dc.section_title,
            d.title,
            d.domain,
            d.source_type,
            d.file_name,
            ce.embedding_nomic
        FROM document_chunks dc
        JOIN chunk_embeddings ce ON dc.id = ce.chunk_id
        JOIN documents d ON dc.document_id = d.id
        WHERE ce.embedding_nomic IS NOT NULL
        ORDER BY d.domain, dc.chunk_index
    """
    if limit:
        query += f" LIMIT {limit}"

    cur.execute(query)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Convert embedding_nomic from pgvector string to list
    for row in rows:
        emb = row["embedding_nomic"]
        if isinstance(emb, str):
            emb = emb.strip("[]")
            row["embedding_nomic"] = [float(x) for x in emb.split(",")]
        row["chunk_hash"] = hashlib.md5(row["chunk_text"].encode()).hexdigest()

    return rows


def upsert_batch(client: QdrantClient, points: list[PointStruct], batch_id: str) -> dict:
    """Upsert a batch of points into Qdrant. Returns result summary."""
    try:
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
            wait=True,
        )
        return {"ok": True, "batch_id": batch_id, "count": len(points)}
    except Exception as e:
        return {"ok": False, "batch_id": batch_id, "count": len(points), "error": str(e)}


def save_checkpoint(stage: str, data: dict) -> None:
    """Save checkpoint to disk for resume capability."""
    checkpoint = {
        "stage": stage,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **data,
    }
    CHECKPOINT_FILE.write_text(json.dumps(checkpoint, indent=2, default=str))


def ingest_seed(dry_run: bool = False, max_chunks: int | None = None) -> dict:
    """Ingest existing nomic embeddings (433 chunks) into Qdrant."""
    if dry_run:
        print("[DRY RUN] Would fetch and validate seed chunks without upserting.")

    chunks = fetch_seed_chunks(limit=max_chunks)
    print(f"Fetched {len(chunks)} chunks with nomic embeddings from Akasha.")

    client = QdrantClient(url=QDRANT_URL, timeout=10)

    # Validate
    valid: list[dict] = []
    skipped_stale = 0
    skipped_dim = 0

    for ch in chunks:
        emb = ch["embedding_nomic"]
        if len(emb) != VECTOR_DIM:
            skipped_dim += 1
            continue

        # Re-hash current chunk_text and compare
        current_hash = hashlib.md5(ch["chunk_text"].encode()).hexdigest()
        if current_hash != ch["chunk_hash"]:
            skipped_stale += 1
            continue

        valid.append(ch)

    print(f"Valid: {len(valid)}, skipped stale: {skipped_stale}, skipped dim mismatch: {skipped_dim}")

    if dry_run:
        print(f"[DRY RUN] Would upsert {len(valid)} points in batches of {BATCH_SIZE}.")
        return {"dry_run": True, "valid": len(valid), "total": len(chunks)}

    # Batch upsert
    total_upserted = 0
    batch_id = None
    failed_batches = []

    for i in range(0, len(valid), BATCH_SIZE):
        batch = valid[i : i + BATCH_SIZE]
        batch_id = f"seed_{i // BATCH_SIZE}_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}"

        points = []
        for ch in batch:
            payload = {
                "chunk_id": ch["chunk_id"],
                "doc_id": ch["doc_id"],
                "domain": ch["domain"] or "",
                "source_type": ch["source_type"] or "",
                "title": ch["title"] or "",
                "chunk_text": ch["chunk_text"][:1000],  # Truncate for payload size
                "section_title": ch["section_title"] or "",
                "file_name": ch["file_name"] or "",
                "batch_id": batch_id,
                "ingested_at": datetime.now(timezone.utc).isoformat(),
            }
            points.append(PointStruct(id=ch["chunk_id"], vector=ch["embedding_nomic"], payload=payload))

        result = upsert_batch(client, points, batch_id)
        if result["ok"]:
            total_upserted += result["count"]
            print(f"  Batch {i // BATCH_SIZE}: upserted {result['count']} points")
        else:
            failed_batches.append(result)
            print(f"  Batch {i // BATCH_SIZE}: FAILED — {result.get('error', 'unknown')}")

        # Small delay between batches
        time.sleep(0.1)

    # Save checkpoint
    save_checkpoint("seed", {
        "total_upserted": total_upserted,
        "total_chunks": len(valid),
        "last_batch_id": batch_id,
    })

    # Save dead letters if any failures
    if failed_batches:
        DEAD_LETTER_FILE.write_text(json.dumps(failed_batches, indent=2, default=str))

    return {
        "stage": "seed",
        "total_chunks": len(valid),
        "total_upserted": total_upserted,
        "failed_batches": len(failed_batches),
    }


def embed_and_ingest_high_priority(
    dry_run: bool = False, max_docs: int = 5
) -> dict:
    """Embed high-priority documents with nomic-embed-text and upsert.

    Keeps sample small (max_docs=5) for safe validation.
    """
    conn = psycopg2.connect(AKASHA_DSN)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT d.id AS doc_id, d.title, d.domain, d.source_type, d.file_name
        FROM documents d
        WHERE d.domain IN ('pessoal_estrategico', 'projetos_digitais')
          AND d.source_type = 'produced'
          AND d.id NOT IN (
              SELECT DISTINCT dc.document_id FROM document_chunks dc
              JOIN chunk_embeddings ce ON dc.id = ce.chunk_id
              WHERE ce.embedding_nomic IS NOT NULL
          )
        ORDER BY d.updated_at DESC
        LIMIT %s
    """, (max_docs,))
    docs = cur.fetchall()

    if not docs:
        print("No high-priority docs without nomic embeddings found.")
        cur.close()
        conn.close()
        return {"stage": "high_priority", "docs_found": 0}

    doc_ids = tuple(d["doc_id"] for d in docs)
    cur.execute("""
        SELECT dc.id AS chunk_id, dc.document_id AS doc_id, dc.chunk_text,
               dc.chunk_index, dc.section_title
        FROM document_chunks dc
        WHERE dc.document_id IN %s
        ORDER BY dc.document_id, dc.chunk_index
    """, (doc_ids,))
    chunks = cur.fetchall()
    cur.close()
    conn.close()

    print(f"High-priority: {len(docs)} docs, {len(chunks)} chunks to embed")

    if dry_run:
        print(f"[DRY RUN] Would embed {len(chunks)} chunks via nomic-embed-text.")
        return {"dry_run": True, "docs": len(docs), "chunks": len(chunks)}

    # Embed in batches
    client = QdrantClient(url=QDRANT_URL, timeout=10)
    total_upserted = 0
    batch_id = None

    for i in range(0, len(chunks), EMBED_BATCH_SIZE):
        batch = chunks[i : i + EMBED_BATCH_SIZE]
        texts = [ch["chunk_text"] for ch in batch]

        try:
            resp = requests.post(
                f"{OLLAMA_URL}/api/embed",
                json={"model": "nomic-embed-text", "input": texts},
                timeout=60,
            )
            resp.raise_for_status()
            result = resp.json()
            embeddings = result.get("embeddings", [])
        except Exception as e:
            print(f"Embedding failed for batch {i // EMBED_BATCH_SIZE}: {e}")
            continue

        if len(embeddings) != len(batch):
            print(f"  Mismatch: got {len(embeddings)} embeddings for {len(batch)} texts")
            continue

        # Prepare points
        points = []
        for ch, emb in zip(batch, embeddings):
            if len(emb) != VECTOR_DIM:
                continue
            payload = {
                "chunk_id": ch["chunk_id"],
                "doc_id": ch["doc_id"],
                "domain": docs[0]["domain"] if docs else "",  # simplified
                "source_type": "produced",
                "title": "",
                "chunk_text": ch["chunk_text"][:1000],
                "section_title": ch["section_title"] or "",
                "batch_id": f"hp_{i // EMBED_BATCH_SIZE}",
                "ingested_at": datetime.now(timezone.utc).isoformat(),
            }
            point_id = int(f"1{ch['chunk_id']}")  # prefix with 1 to avoid collision with seed
            points.append(PointStruct(id=point_id, vector=emb, payload=payload))

        # Upsert sub-batches
        for j in range(0, len(points), BATCH_SIZE):
            sub = points[j : j + BATCH_SIZE]
            sub_batch_id = f"hp_{i // EMBED_BATCH_SIZE}_{j // BATCH_SIZE}"
            result = upsert_batch(client, sub, sub_batch_id)
            if result["ok"]:
                total_upserted += result["count"]
            else:
                print(f"  Upsert failed: {result.get('error', 'unknown')}")

    save_checkpoint("high_priority", {"total_upserted": total_upserted})

    return {"stage": "high_priority", "total_upserted": total_upserted}


def validate_ingestion() -> dict:
    """Validate Qdrant collection after ingestion."""
    client = QdrantClient(url=QDRANT_URL, timeout=10)
    info = client.get_collection(COLLECTION_NAME)
    points_count = info.points_count

    # Sample retrieval
    test_queries = [
        "viagem em família",
        "estratégia de conteúdo",
        "desenvolvimento de projeto",
        "automação com IA",
        "marketing digital",
    ]

    retrieval_results = []
    for query in test_queries:
        try:
            resp = requests.post(
                f"{OLLAMA_URL}/api/embed",
                json={"model": "nomic-embed-text", "input": [query]},
                timeout=30,
            )
            resp.raise_for_status()
            query_vector = resp.json()["embeddings"][0]

            results = client.query_points(
                collection_name=COLLECTION_NAME,
                query=query_vector,
                limit=3,
            )
            hits = results.points if results else []
            retrieval_results.append({
                "query": query,
                "hits": len(hits),
                "top_score": hits[0].score if hits else 0,
                "top_chunk": hits[0].payload.get("chunk_text", "")[:100] if hits else "",
            })
        except Exception as e:
            retrieval_results.append({"query": query, "error": str(e)})

    return {
        "points_count": points_count,
        "retrieval_tests": retrieval_results,
    }


# ── Main ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Safe Akasha → Qdrant ingestion")
    parser.add_argument("--dry-run", action="store_true", help="Validate without writing")
    parser.add_argument("--max-chunks", type=int, default=None, help="Max seed chunks to ingest")
    parser.add_argument("--max-hp-docs", type=int, default=5, help="Max high-priority docs")
    parser.add_argument("--skip-hp", action="store_true", help="Skip high-priority fresh embedding")
    parser.add_argument("--validate-only", action="store_true", help="Only validate existing data")
    args = parser.parse_args()

    print("=" * 60)
    print("FASE 13A -- Memory Population: Akasha -> Qdrant")
    print(f"Time: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)

    if args.validate_only:
        print("\n[VALIDATE ONLY]")
        result = validate_ingestion()
        print(json.dumps(result, indent=2, default=str))
        return

    # Pre-flight
    print("\n-- Pre-flight Checks --")
    qdrant_status = check_qdrant()
    print(f"  Qdrant: {qdrant_status}")
    if not qdrant_status["ok"]:
        print("ABORT: Qdrant not ready.")
        sys.exit(1)

    ollama_status = check_ollama()
    print(f"  Ollama: {ollama_status}")
    if not ollama_status["ok"]:
        print("ABORT: Ollama not ready or nomic-embed-text missing.")
        sys.exit(1)

    akasha_status = check_akasha()
    print(f"  Akasha: {akasha_status}")
    if not akasha_status["ok"]:
        print("ABORT: Akasha not accessible.")
        sys.exit(1)

    print(f"  Qdrant points before: {qdrant_status['points']}")

    # Stage 1: Seed
    print("\n-- Stage 1: Seed (existing nomic embeddings) --")
    seed_result = ingest_seed(dry_run=args.dry_run, max_chunks=args.max_chunks)
    print(f"  Seed result: {json.dumps(seed_result, indent=2)}")

    # Stage 2: High-priority fresh
    if not args.skip_hp and not args.dry_run:
        print("\n-- Stage 2: High-Priority Fresh Embedding --")
        hp_result = embed_and_ingest_high_priority(
            dry_run=args.dry_run, max_docs=args.max_hp_docs
        )
        print(f"  HP result: {json.dumps(hp_result, indent=2)}")

    # Validate
    print("\n-- Validation --")
    validation = validate_ingestion()
    print(json.dumps(validation, indent=2, default=str))

    # Final report
    final = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "seed": seed_result,
        "validation": validation,
    }
    report_path = REPORTS_DIR / "ingestion_result.json"
    report_path.write_text(json.dumps(final, indent=2, default=str))
    print(f"\nReport saved to: {report_path}")


if __name__ == "__main__":
    main()
