# KRATOS — API Error Taxonomy

**Date:** 2026-05-17  
**Wave:** K19  
**File:** `api-contract/error-taxonomy.ts`

---

## Error Codes

| Code | When | Example |
|---|---|---|
| `missing_config` | GITHUB_TOKEN absent, OMNIS_BASE_URL not set | "Configuração necessária ausente" |
| `external_unavailable` | GitHub API timeout, OMNIS offline | "Serviço externo indisponível" |
| `stale_data` | Context snapshot > 5min old | "Dados desatualizados" |
| `validation_error` | Zod schema parse failure on response | "Erro de validação" |
| `forbidden_action` | OMNIS POST attempted from KRATOS | "Ação não permitida" |
| `internal_error` | Unexpected throw in store/handler | "Erro interno" |
| `not_found` | Repo not in tracked list, checkpoint ID missing | "Recurso não encontrado" |
| `rate_limited` | GitHub 60 req/hr exceeded (no token) | "Limite de requisições atingido" |

---

## Usage Pattern

```typescript
import { createApiError, API_ERROR_MESSAGES } from "../../api-contract/error-taxonomy";

// In server function:
if (!token) {
  return { data: null, error: API_ERROR_MESSAGES.missing_config };
}

// With code for client-side logic:
return { 
  data: null, 
  error: createApiError("missing_config", API_ERROR_MESSAGES.missing_config, "GITHUB_TOKEN")
};
```

---

## Response Envelope Convention

All API responses use:
```typescript
{ data: T | null, error: string | null }
```

`error` is a human-readable string (not the code object) for backward compat.  
`error-taxonomy.ts` provides the codes for structured error handling where needed.
