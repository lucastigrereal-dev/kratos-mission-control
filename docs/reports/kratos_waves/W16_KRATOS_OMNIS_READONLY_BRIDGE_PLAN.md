# W16 — KRATOS-OMNIS Readonly Bridge Plan

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Tipo:** Planejamento (read-only)

---

## Objetivo

Definir contrato de API para KRATOS consumir status do OMNIS
modo readonly, sem acoplamento ou capacidade de comando.

---

## Contrato de API proposto

### Endpoint: `GET /api/omnis/status`

OMNIS expõe endpoint HTTP (ou Cloudflare Worker binding):

```ts
// api-contract/omnis-status.schema.ts
import { z } from "zod";

export const OmnisAgentStatusSchema = z.object({
  name: z.string(),
  status: z.enum(["idle", "running", "error", "completed"]),
  lastRun: z.string().datetime().nullable(),
  lastResult: z.string().optional(),
});

export const OmnisStatusSchema = z.object({
  timestamp: z.string().datetime(),
  agents: z.array(OmnisAgentStatusSchema),
  activeJobs: z.number().int().min(0),
  queueDepth: z.number().int().min(0),
  systemHealth: z.enum(["live", "degraded", "offline"]),
});

export type OmnisStatus = z.infer<typeof OmnisStatusSchema>;
export type OmnisAgentStatus = z.infer<typeof OmnisAgentStatusSchema>;
```

### KRATOS consumer

```ts
// src/lib/omnis-bridge.ts
import { createServerFn } from "@tanstack/react-start";
import { OmnisStatusSchema, type OmnisStatus } from "../../api-contract/omnis-status.schema";

export const getOmnisStatus = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ data: OmnisStatus | null; error: string | null }> => {
    try {
      const res = await fetch("https://omnis.internal/api/status");
      if (!res.ok) return { data: null, error: `HTTP ${res.status}` };
      const json = await res.json();
      const parsed = OmnisStatusSchema.safeParse(json);
      return parsed.success
        ? { data: parsed.data, error: null }
        : { data: null, error: parsed.error.message };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "OMNIS unreachable" };
    }
  });
```

---

## Regras de segurança

| Regra | Implementação |
|---|---|
| Readonly | Apenas `GET` — sem POST/PUT/DELETE |
| Sem credenciais OMNIS no KRATOS | OMNIS expõe endpoint público ou token de service |
| Timeout curto | 5s — KRATOS não espera OMNIS |
| Fallback gracioso | Se OMNIS offline, exibe status "desconhecido" |
| Zero efeitos colaterais | Chamada não altera estado do OMNIS |

---

## UI planejada

- Nova seção no `/sistema`: "OMNIS Agents"
- Cards de agent com StatusDot (live=running, degraded=error, offline=offline)
- Número de jobs ativos e profundidade da fila
- Atualização via `refetchInterval: 60_000` (1min)

---

## Dependências

- OMNIS precisa expor endpoint `/api/status` (fora do escopo KRATOS)
- URL base do OMNIS como variável de ambiente (`OMNIS_API_URL`)
- Sem deploy até endpoint existir

---

## Status

Plano definido. Implementação requer:
1. Endpoint `/api/status` no OMNIS (time estimado: externo)
2. Schema Zod no KRATOS (time: 15min)
3. Server-fn bridge (time: 15min)
4. Hook + UI no `/sistema` (time: 30min)
