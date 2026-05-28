# HANDOFF W3 — Context Reality

**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w3-context-real`  
**Data:** 2026-05-28  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Substituir o seed TypeScript hardcoded em `backend/contexto/store.ts` por dados
reais do Python backend via `GET /context/current` (ActivityWatch + drift analysis).

A ContextoView já estava bem estruturada — apenas a fonte de dados era um mock.
Após W3: ContextoView lê ActivityWatch real (ou fallback transparente quando AW offline).

---

## O que foi feito

### B1 — api-contract: context-api.schema.ts (novo)
`api-contract/context-api.schema.ts`:
- `ContextDriftAPISchema` — sub-objeto drift com state, severity, minutes_out_of_focus, etc.
- `ContextCurrentAPISchema` — schema permissivo para resposta bruta de `/context/current`
  - Campos: current_app, current_title, project_guess, mission_guess, confidence,
    on_focus, drift_minutes, active_since, source, collector_status, drift
  - Todos os campos têm `.default()` — parse nunca falha por campo ausente
  - `.catchall(z.unknown())` — backend pode adicionar campos sem quebrar o frontend

### B2 — MOCK_REGISTRY
`src/lib/api/client.ts` — `/context/current` adicionado ao MOCK_REGISTRY:
- Simula cenário AW offline com source="mock", collector_status="offline"
- Projeto KRATOS detectado via janela ativa do Claude Code

### B3 — Hook: useContextAPI()
`src/hooks/useContexto.ts` — adicionado ao arquivo existente:
- `normalizeConfidence()` — normaliza 0.0–1.0 float e 0–100 int para int 0–100
- `mapDriftLevel()` — severity "high"→"high", "medium"/"low"→"light", default→"none"
- `contextAPIToSnapshot()` — mapeia ContextCurrentAPI → ContextSnapshot (shape canônica)
  - `activeWindowDuration`: extrai HH:MM de ISO datetime (safe para string vazia)
  - `focusStatus`: on_focus flag > drift.state > "unknown"
  - `browserTabs: []` — não exposto pelo `/context/current` endpoint
- `fetchContextFromAPI()` — usa apiGet("/context/current"), throw em Zod mismatch
- `useContextAPI()`: query ["context", "api"], refetch 30s, stale 20s
  - Retorna: snapshot, meta (SourceBadgeMeta), sourceType, isLoading, isError, error, refetch
  - source "real"→"live", "mock"→"mock", outros→"partial"
  - meta.stale=true quando source ≠ "real" (AW offline ou fallback)

### B4 — ContextoView: wiring real
`src/components/kratos/views/ContextoView.tsx`:
- `useContextSnapshot()` + `useContextoMissionSnapshot()` → substituídos por `useContextAPI()`
- `mission.meta` → `meta` (do hook unificado)
- `mission.meta?.stale` → `meta?.stale`
- SourceBadge agora reflete a fonte real (AW real vs fallback)

### B5 — Testes: context-reality.test.ts (novo)
`tests/stores/context-reality.test.ts` — 28 testes cobrindo:
- Schema validation (4 testes)
- normalizeConfidence (6 testes)
- mapDriftLevel (5 testes)
- mapFocusStatus (3 testes)
- mapDuration (3 testes)
- mapSourceToDataSource (4 testes)
- Null safety (3 testes)

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 0 erros novos (13 pré-existentes inalterados) |
| `bun run test` | ✅ 409 pass, 0 fail (28 novos W3 testes) |
| `bun run build` | ✅ clean (25.7s SSR) |
| code-review | ✅ integrado inline — normalizeConfidence clamp, drift null safety, meta via hook |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `api-contract/context-api.schema.ts` | Criado — Layer 2 schema Python /context/current |
| `src/lib/api/client.ts` | Modificado — MOCK_REGISTRY /context/current |
| `src/hooks/useContexto.ts` | Modificado — useContextAPI() adicionado |
| `src/components/kratos/views/ContextoView.tsx` | Modificado — wiring useContextAPI() |
| `tests/stores/context-reality.test.ts` | Criado — 28 testes |

---

## Noção de Done (Notion criteria)

- [x] `GET /context/current` Python consumido pelo frontend
- [x] AW online → `source: "real"` → SourceBadge "live"
- [x] AW offline → `source: "fallback"` → SourceBadge "partial", stale badge visível
- [x] AW mock → `source: "mock"` → SourceBadge "mock"
- [x] Confidence normalizado (float 0-1 e int 0-100 ambos tratados)
- [x] Drift level mapeado corretamente (none/light/high)
- [x] focusStatus derivado (on_focus flag > drift.state > "unknown")
- [x] activeWindowDuration: HH:MM extraído do ISO datetime com safe fallback "—"
- [x] browserTabs: [] (não exposto pelo endpoint atual)
- [x] SourceBadge vem do hook real (não do TypeScript store)
- [x] `contextAPIToSnapshot()` exportado (testável isoladamente)
- [x] 28 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W4 — Missions Reality** (usuário autorizou "vai ate o goal")

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → W6 ✅ → W3 ✅ → **W4** → W4.5 → W5 → [MARCO P0]

---

_HANDOFF gerado automaticamente — Wave W3 concluída_
