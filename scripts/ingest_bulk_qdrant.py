"""FASE 14 M1 — Bulk Qdrant Expansion: embed chunks via nomic-embed-text and ingest.

Usage:
    python scripts/ingest_bulk_qdrant.py --dry-run --max-chunks 2100
    python scripts/ingest_bulk_qdrant.py --max-chunks 2100
    python scripts/ingest_bulk_qdrant.py --max-chunks 500 --resume
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
from qdrant_client.models import PointStruct

# ── Config ──────────────────────────────────────────────────────────────────────

AKASHA_DSN = "dbname=akasha user=akasha password=akasha123 host=127.0.0.1 port=5432"
QDRANT_URL = "http://127.0.0.1:6333"
OLLAMA_URL = "http://127.0.0.1:11434"
COLLECTION_NAME = "jarvis_memory_v2"
VECTOR_DIM = 768
BATCH_SIZE = 50
EMBED_BATCH_SIZE = 50  # How many chunks to embed per Ollama call
MAX_TEXT_LEN = 8000  # Safe truncation for nomic-embed-text

REPORTS_DIR = Path(
    r"C:\Users\lucas\Desktop\OMNIS_KRATOS_CCOO_ROADMAP_EXECUTION_2026-05-19"
    r"\reports\fase13\memory"
)
CHECKPOINT_FILE = REPORTS_DIR / "bulk_checkpoint.json"
DEAD_LETTER_FILE = REPORTS_DIR / "bulk_dead_letter.json"


def fetch_chunks_without_nomic(max_chunks: int, offset: int = 0) -> list[dict]:
    """Fetch chunks without nomic embeddings from Akasha, diverse domains."""
    conn = psycopg2.connect(AKASHA_DSN)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        WITH ranked AS (
            SELECT dc.id AS chunk_id, dc.document_id AS doc_id, dc.chunk_text,
                   dc.chunk_index, dc.section_title,
                   d.title, d.domain, d.source_type, d.file_name,
                   ROW_NUMBER() OVER (PARTITION BY d.domain ORDER BY dc.chunk_index) AS rn
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            LEFT JOIN chunk_embeddings ce ON dc.id = ce.chunk_id
            WHERE (ce.embedding_nomic IS NULL OR ce.id IS NULL)
              AND d.domain IS NOT NULL
        )
        SELECT chunk_id, doc_id, chunk_text, chunk_index, section_title,
               title, domain, source_type, file_name
        FROM ranked
        ORDER BY rn, domain
        LIMIT %s OFFSET %s
    """, (max_chunks, offset))
    chunks = cur.fetchall()
    cur.close()
    conn.close()
    return chunks


def embed_batch(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts via Ollama nomic-embed-text."""
    resp = requests.post(
        f"{OLLAMA_URL}/api/embed",
        json={"model": "nomic-embed-text", "input": texts},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json().get("embeddings", [])


def save_embedding_to_db(chunk_id: int, embedding: list[float]) -> bool:
    """Save nomic embedding back to chunk_embeddings table."""
    conn = psycopg2.connect(AKASHA_DSN)
    cur = conn.cursor()
    try:
        emb_str = f"[{','.join(str(x) for x in embedding)}]"
        cur.execute("""
            INSERT INTO chunk_embeddings (chunk_id, model_name, embedding_nomic)
            VALUES (%s, 'nomic-embed-text', %s::vector)
            ON CONFLICT (chunk_id) DO UPDATE SET embedding_nomic = EXCLUDED.embedding_nomic
        """, (chunk_id, emb_str))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        return False
    finally:
        cur.close()
        conn.close()


def save_checkpoint(data: dict) -> None:
    """Save checkpoint for resume capability."""
    CHECKPOINT_FILE.write_text(json.dumps(data, indent=2, default=str))


def load_checkpoint() -> dict:
    """Load existing checkpoint if any."""
    if CHECKPOINT_FILE.exists():
        try:
            return json.loads(CHECKPOINT_FILE.read_text())
        except Exception:
            pass
    return {}


def run_bulk(dry_run: bool = False, max_chunks: int = 2100, resume: bool = False) -> dict:
    """Execute bulk embedding and ingestion."""
    # Load checkpoint for resume
    checkpoint = load_checkpoint() if resume else {}
    offset = checkpoint.get("offset", 0)
    total_upserted = checkpoint.get("total_upserted", 0)
    total_embedded = checkpoint.get("total_embedded", 0)

    print(f"Bulk ingestion: target={max_chunks}, offset={offset}, resume={resume}")

    # Fetch chunks
    chunks = fetch_chunks_without_nomic(max_chunks, offset)
    print(f"Fetched {len(chunks)} chunks without nomic embeddings")

    # Domain distribution
    domains: dict = {}
    for ch in chunks:
        d = ch.get("domain") or "unknown"
        domains[d] = domains.get(d, 0) + 1
    print(f"Domain distribution:")
    for d, c in sorted(domains.items(), key=lambda x: -x[1]):
        print(f"  {d}: {c} chunks")

    if dry_run:
        eta_batches = (len(chunks) + EMBED_BATCH_SIZE - 1) // EMBED_BATCH_SIZE
        print(f"\n[DRY RUN] Would embed {len(chunks)} chunks in ~{eta_batches} batches "
              f"({EMBED_BATCH_SIZE}/batch) via nomic-embed-text.")
        print(f"[DRY RUN] Would upsert in sub-batches of {BATCH_SIZE} to Qdrant.")
        return {"dry_run": True, "chunks": len(chunks), "domains": domains,
                "eta_batches": eta_batches}

    # Qdrant client
    client = QdrantClient(url=QDRANT_URL, timeout=10)
    initial_points = client.get_collection(COLLECTION_NAME).points_count
    print(f"Qdrant points before: {initial_points}")

    # Process in embed batches
    dead_letter_embeds = []
    failed_upserts = []
    batch_timings = []

    for i in range(0, len(chunks), EMBED_BATCH_SIZE):
        batch = chunks[i : i + EMBED_BATCH_SIZE]
        batch_num = i // EMBED_BATCH_SIZE
        batch_start = time.time()

        # Truncate long texts
        texts = []
        for ch in batch:
            t = ch["chunk_text"] or ""
            if len(t) > MAX_TEXT_LEN:
                t = t[:MAX_TEXT_LEN]
            texts.append(t)

        # Embed with retry on failure (halve batch size)
        embeddings = None
        retry_texts = texts[:]
        retry_batch = batch[:]
        retry_multiplier = 1

        while retry_texts and retry_multiplier <= 4:
            try:
                embeddings = embed_batch(retry_texts)
                break
            except Exception:
                if len(retry_texts) <= 10:
                    # Too small to split further, give up
                    break
                retry_multiplier *= 2
                half = len(retry_texts) // 2
                print(f"  Batch {batch_num}: retrying with {half} texts (split {retry_multiplier}x)")
                retry_texts = retry_texts[:half]
                retry_batch = retry_batch[:half]
                time.sleep(1.0)

        if embeddings is None:
            print(f"  Batch {batch_num}: EMBED FAILED after retries")
            dead_letter_embeds.append({
                "batch": batch_num, "offset": offset + i,
                "count": len(batch), "error": "failed after retries",
            })
            # Re-fetch batch from original to process remaining half
            remaining_start = len(retry_batch)
            if remaining_start > 0 and remaining_start < len(batch):
                remaining_batch = batch[remaining_start:]
                remaining_texts = []
                for ch in remaining_batch:
                    t = ch["chunk_text"] or ""
                    if len(t) > MAX_TEXT_LEN:
                        t = t[:MAX_TEXT_LEN]
                    remaining_texts.append(t)
                try:
                    embeddings = embed_batch(remaining_texts)
                    batch = remaining_batch
                    texts = remaining_texts
                    print(f"  Batch {batch_num}: second half OK, {len(remaining_texts)} texts")
                except Exception as e2:
                    print(f"  Batch {batch_num}: second half also FAILED - {e2}")
                    continue
            else:
                continue

        if len(embeddings) != len(batch):
            print(f"  Batch {batch_num}: MISMATCH - got {len(embeddings)} for {len(batch)} texts")
            continue

        # Prepare points for Qdrant
        points = []
        for ch, emb in zip(batch, embeddings):
            if len(emb) != VECTOR_DIM:
                continue

            ch_id = ch["chunk_id"]
            try:
                point_id = int(ch_id)
            except (ValueError, TypeError):
                point_id = abs(hash(str(ch_id))) % (10 ** 15)

            payload = {
                "chunk_id": ch_id,
                "doc_id": ch["doc_id"],
                "domain": ch["domain"] or "",
                "source_type": ch["source_type"] or "",
                "title": ch["title"] or "",
                "chunk_text": (ch["chunk_text"] or "")[:1000],
                "section_title": ch["section_title"] or "",
                "file_name": ch["file_name"] or "",
                "batch_id": f"bulk_{batch_num}",
                "ingested_at": datetime.now(timezone.utc).isoformat(),
            }
            points.append(PointStruct(id=point_id, vector=emb, payload=payload))

        # Upsert in sub-batches of BATCH_SIZE
        upserted_this_batch = 0
        for j in range(0, len(points), BATCH_SIZE):
            sub = points[j : j + BATCH_SIZE]
            sub_id = f"bulk_{batch_num}_{j // BATCH_SIZE}"
            try:
                client.upsert(collection_name=COLLECTION_NAME, points=sub, wait=True)
                upserted_this_batch += len(sub)
            except Exception as e:
                failed_upserts.append({"batch": sub_id, "count": len(sub), "error": str(e)})
                print(f"    Upsert FAILED {sub_id}: {e}")

        total_upserted += upserted_this_batch
        total_embedded += len(batch)
        batch_elapsed = time.time() - batch_start
        batch_timings.append(batch_elapsed)

        # Save embeddings back to DB (best effort)
        db_saved = 0
        for ch, emb in zip(batch, embeddings):
            if len(emb) == VECTOR_DIM:
                if save_embedding_to_db(ch["chunk_id"], emb):
                    db_saved += 1

        # Checkpoint
        new_offset = offset + i + EMBED_BATCH_SIZE
        save_checkpoint({
            "offset": new_offset,
            "total_upserted": total_upserted,
            "total_embedded": total_embedded,
            "last_batch": batch_num,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })

        # Progress
        avg_time = sum(batch_timings) / len(batch_timings)
        remaining = (len(chunks) - i - EMBED_BATCH_SIZE) // EMBED_BATCH_SIZE + 1
        eta_min = (avg_time * remaining) / 60
        print(f"  Batch {batch_num}: +{upserted_this_batch} points "
              f"({len(batch)} embedded, {db_saved} saved to DB) "
              f"in {batch_elapsed:.1f}s | total: {total_upserted} | "
              f"ETA: {eta_min:.0f}min remaining")

        # Rate-limit between batches
        time.sleep(2.0)

    # Final checkpoint (mark complete)
    save_checkpoint({
        "offset": offset + len(chunks),
        "total_upserted": total_upserted,
        "total_embedded": total_embedded,
        "completed": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Save dead letters
    if dead_letter_embeds or failed_upserts:
        DEAD_LETTER_FILE.write_text(json.dumps({
            "embed_errors": dead_letter_embeds,
            "upsert_errors": failed_upserts,
        }, indent=2, default=str))

    # Final count
    final_points = client.get_collection(COLLECTION_NAME).points_count

    return {
        "stage": "bulk_embed",
        "chunks_fetched": len(chunks),
        "total_embedded": total_embedded,
        "total_upserted": total_upserted,
        "failed_embed_batches": len(dead_letter_embeds),
        "failed_upsert_batches": len(failed_upserts),
        "qrant_before": initial_points,
        "qrant_after": final_points,
        "domains": domains,
        "total_time_min": sum(batch_timings) / 60,
    }


def validate() -> dict:
    """Run retrieval quality tests against Qdrant."""
    client = QdrantClient(url=QDRANT_URL, timeout=10)
    info = client.get_collection(COLLECTION_NAME)
    points_count = info.points_count

    test_queries = [
        "viagem em familia",
        "estrategia de conteudo marketing Instagram",
        "desenvolvimento de projeto software",
        "automacao com inteligencia artificial",
        "marketing digital hoteis turismo",
        "estrategia pessoal produtividade",
        "codigo cloud programacao",
        "estudos juridicos direito",
        "vendas hotelaria turismo",
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
                "top_score": round(hits[0].score, 4) if hits else 0,
                "top_domain": hits[0].payload.get("domain", "") if hits else "",
                "top_chunk": (hits[0].payload.get("chunk_text", "") or "")[:120] if hits else "",
            })
        except Exception as e:
            retrieval_results.append({"query": query, "error": str(e)})

    return {
        "points_count": points_count,
        "retrieval_tests": retrieval_results,
    }


def main():
    parser = argparse.ArgumentParser(description="FASE 14 M1 — Bulk Qdrant Expansion")
    parser.add_argument("--dry-run", action="store_true", help="Validate without writing")
    parser.add_argument("--max-chunks", type=int, default=2100, help="Max chunks to embed")
    parser.add_argument("--resume", action="store_true", help="Resume from checkpoint")
    parser.add_argument("--validate-only", action="store_true", help="Only validate existing data")
    parser.add_argument("--skip-seed", action="store_true",
                        help="Skip seed stage (only embed new chunks)")
    args = parser.parse_args()

    print("=" * 60)
    print("FASE 14 M1 — Bulk Qdrant Expansion")
    print(f"Time: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)

    # Pre-flight
    print("\n-- Pre-flight Checks --")
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=10)
        info = client.get_collection(COLLECTION_NAME)
        print(f"  Qdrant: OK - {info.points_count} points, {info.config.params.vectors.size}d")
    except Exception as e:
        print(f"  Qdrant: FAILED - {e}")
        sys.exit(1)

    try:
        resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        models = [m["name"] for m in resp.json().get("models", [])]
        if any("nomic-embed-text" in m for m in models):
            print(f"  Ollama: OK - nomic-embed-text available")
        else:
            print(f"  Ollama: FAILED - nomic-embed-text not found in {models}")
            sys.exit(1)
    except Exception as e:
        print(f"  Ollama: FAILED - {e}")
        sys.exit(1)

    try:
        conn = psycopg2.connect(AKASHA_DSN)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM chunk_embeddings WHERE embedding_nomic IS NOT NULL")
        nomic = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM document_chunks")
        total = cur.fetchone()[0]
        print(f"  Akasha: OK - {nomic}/{total} chunks have nomic embeddings")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"  Akasha: FAILED - {e}")
        sys.exit(1)

    if args.validate_only:
        print("\n[VALIDATE ONLY]")
        result = validate()
        print(json.dumps(result, indent=2, default=str))
        return

    # Run bulk embedding
    print(f"\n-- Bulk Embedding (target: {args.max_chunks} chunks) --")
    bulk_result = run_bulk(
        dry_run=args.dry_run,
        max_chunks=args.max_chunks,
        resume=args.resume,
    )
    print(f"Bulk result:")
    print(json.dumps(bulk_result, indent=2, default=str))

    # Validate
    print("\n-- Retrieval Validation --")
    validation = validate()
    print(json.dumps(validation, indent=2, default=str))

    # Final report
    final = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "bulk": bulk_result,
        "validation": validation,
    }
    report_path = REPORTS_DIR / "bulk_ingestion_result.json"
    report_path.write_text(json.dumps(final, indent=2, default=str))
    print(f"\nReport saved to: {report_path}")


if __name__ == "__main__":
    main()
