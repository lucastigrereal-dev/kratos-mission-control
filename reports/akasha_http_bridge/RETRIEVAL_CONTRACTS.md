# RETRIEVAL CONTRACTS — ABA23 P0

**Date:** 2026-05-21 | **Project:** KRATOS Mission Control | **Phase:** P0 Read-Only Bridge

---

## Endpoint Contracts

### 1. GET /akasha/health (extend existing)

Extended health beyond existing `/akasha/status`.

**Request:** None

**Response `AkashaHealthResponse`:**
```json
{
  "status": "healthy|degraded|offline",
  "postgres": true,
  "pgvector": true,
  "embeddings_model": "nomic-embed-text",
  "embeddings_dims": 768,
  "document_count": 20345,
  "chunk_count": 606000,
  "source_badge": "confirmed|partial|offline",
  "timestamp": "2026-05-21T10:00:00Z"
}
```

### 2. POST /akasha/search

Search Akasha knowledge base.

**Request `AkashaSearchRequest`:**
```json
{
  "query": "viagem em família",
  "domain": null,
  "file_type": null,
  "limit": 8,
  "include_chunks": false
}
```

**Response `AkashaSearchResponse`:**
```json
{
  "results": [
    {
      "chunk_id": 1234,
      "document_id": 56,
      "file_name": "viagem_familia.md",
      "domain": "pessoal",
      "file_type": "markdown",
      "section_path": "/Viagens/Familia",
      "page_number": null,
      "score": 0.89,
      "chunk_text": "trecho controlado de até 500 chars..."
    }
  ],
  "total": 8,
  "query": "viagem em família",
  "source_badge": "confirmed|mock"
}
```

**Privacy Rules:**
- `chunk_text` truncated to 500 chars max
- No full document content
- No file_path if it contains system paths

### 3. POST /akasha/context

Get context for a specific mission/project.

**Request `AkashaContextRequest`:**
```json
{
  "project_id": "projeto-123",
  "query": "status atual",
  "limit": 5
}
```

**Response `AkashaContextResponse`:**
```json
{
  "context": "trecho controlado...",
  "sources": [
    {
      "document_id": 56,
      "file_name": "projeto-123.md",
      "relevance": "alta"
    }
  ],
  "source_badge": "confirmed|mock"
}
```

### 4. GET /akasha/sources

List available source domains/categories.

**Response:**
```json
{
  "domains": [
    {"name": "pessoal", "count": 5000},
    {"name": "projetos", "count": 3000},
    {"name": "conhecimento", "count": 12000}
  ],
  "total_documents": 20345,
  "total_chunks": 606000,
  "source_badge": "confirmed|mock"
}
```

## Pydantic Schemas

```python
class AkashaHealthResponse(BaseModel):
    status: str
    postgres: bool
    pgvector: bool
    embeddings_model: str = "nomic-embed-text"
    embeddings_dims: int = 768
    document_count: int | None = None
    chunk_count: int | None = None
    source_badge: str
    timestamp: datetime

class AkashaSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    domain: str | None = Field(None, max_length=100)
    file_type: str | None = Field(None, max_length=20)
    limit: int = Field(8, ge=1, le=50)
    include_chunks: bool = False

class AkashaSearchResult(BaseModel):
    chunk_id: int
    document_id: int
    file_name: str
    domain: str
    file_type: str
    section_path: str | None
    page_number: int | None
    score: float = Field(..., ge=0.0, le=1.0)
    chunk_text: str | None = None

class AkashaSearchResponse(BaseModel):
    results: list[AkashaSearchResult]
    total: int
    query: str
    source_badge: str

class AkashaContextRequest(BaseModel):
    project_id: str = Field(..., max_length=200)
    query: str = Field("", max_length=500)
    limit: int = Field(5, ge=1, le=20)

class AkashaContextResponse(BaseModel):
    context: str
    sources: list[dict]
    source_badge: str

class AkashaSourceSummary(BaseModel):
    domains: list[dict]
    total_documents: int
    total_chunks: int
    source_badge: str
```

## Auth Classification (L0-L5)

| Endpoint | Risk | Auth Phase | Scope |
|----------|------|-----------|-------|
| GET /akasha/health | L1 | A | memory:read |
| POST /akasha/search | L2 | A | memory:read |
| POST /akasha/context | L2 | A | memory:read |
| GET /akasha/sources | L1 | A | memory:read |
