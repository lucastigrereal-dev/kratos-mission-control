# AKASHA DISCOVERY — ABA23

**Date:** 2026-05-21 | **Project:** KRATOS Mission Control

---

## Akasha System Overview

Akasha is a **CLI-based local-first RAG system** ("segundo cérebro"). It has no HTTP API. It connects directly to PostgreSQL 16 with pgvector extension.

### Discovery Claims

| Claim | Evidence | Status |
|-------|----------|--------|
| Akasha lives at `~/akasha/` | `ls ~/akasha/` shows `src/`, `pyproject.toml`, `docker-compose.yml` | **CONFIRMED** |
| Akasha uses PostgreSQL with pgvector | `pyproject.toml` has `psycopg[binary]>=3.2`, `pgvector>=0.3` | **CONFIRMED** |
| Akasha uses pgvector:16 Docker image | `akasha_collector.py` reports `vector_engine: pgvector/pgvector:pg16` | **CONFIRMED** |
| Akasha has sentence-transformers embeddings | `pyproject.toml` has `sentence-transformers>=3.0` | **CONFIRMED** |
| Akasha has hybrid search (BM25 + vector) | `search/hybrid.py` implements RRF fusion | **CONFIRMED** |
| Akasha has RAG pipeline with Ollama | `rag/pipeline.py` calls `ask_ollama()` | **CONFIRMED** |
| Akasha has no HTTP/FastAPI server | `pyproject.toml` has no FastAPI/uvicorn/flask deps | **CONFIRMED** |
| Akasha is CLI-only (typer) | `cli/main.py` is entry point, `pyproject.toml` has `typer>=0.12` | **CONFIRMED** |
| Akasha uses port 5432 | `akasha_collector.py` checks TCP :5432 | **CONFIRMED** |
| KRATOS already has `GET /akasha/status` | `routes/akasha.py` + collector | **CONFIRMED** |
| KRATOS collector checks Docker + TCP | `collectors/akasha_collector.py` | **CONFIRMED** |

### Module Map

| Module | Path | Purpose |
|--------|------|---------|
| CLI | `src/akasha/cli/` | typer commands |
| Config | `src/akasha/config.py` | Settings (DB, Ollama, models) |
| Database | `src/akasha/core/database.py` | psycopg connection |
| Models | `src/akasha/core/models.py` | SQL/ORM models |
| Embeddings | `src/akasha/embeddings/` | sentence-transformers |
| Ingestion | `src/akasha/ingestion/` | Parsers (pdf, docx, md, txt) + dedup + queue |
| Processing | `src/akasha/processing/` | Chunking |
| Search | `src/akasha/search/` | BM25, vector, hybrid |
| RAG | `src/akasha/rag/` | Context building, LLM calls, pipeline |
| Watcher | `src/akasha/watcher.py` | File watcher |

### Gaps

| Gap | Impact |
|-----|--------|
| No HTTP API | Cannot bridge via REST — must import Python modules or query DB directly |
| No authentication | Internal only, no exposure needed |
| No privacy classification on documents | All stored content is personal |
| No public/private boundary | Every document is accessible via search |
