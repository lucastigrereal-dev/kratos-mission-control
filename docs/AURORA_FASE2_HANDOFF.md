# Aurora Fase 2 — HANDOFF para Codex

**Status:** ✅ IMPLEMENTADO — aguardando auditoria  
**Commit:** `2eea345`  
**Data:** 2026-05-26  
**Arquitetura:** Opção A (OMNIS escreve → state.json → KRATOS lê)

---

## O que foi feito

### 6 arquivos criados/modificados

| Arquivo | Tipo | O que faz |
|---|---|---|
| `api-contract/aurora.schema.ts` | novo | Schema Zod para AuroraInsight + envelope |
| `backend/app/routes/aurora.py` | novo | GET /aurora/insight — lê state.json do OMNIS |
| `backend/app/main.py` | modificado | Monta aurora_router |
| `src/hooks/useAuroraInsight.ts` | novo | TanStack Query, poll 2min, stale 60s |
| `src/components/kratos/aurora/AuroraInsightCard.tsx` | novo | Card visual com EmptyState honesto |
| `src/components/kratos/aurora/AuroraPanelContent.tsx` | modificado | Integra AuroraInsightCard |

### Fluxo de dados

```
OMNIS → escreve aurora_insight em state.json
       ↓
backend/app/routes/aurora.py → GET /aurora/insight
       ↓ (lê state.json via omnis_collector._read_state_file)
src/hooks/useAuroraInsight.ts → fetch + Zod parse
       ↓
AuroraInsightCard → exibe ou EmptyState honesto
       ↓
AuroraPanelContent → renderiza no painel lateral do KRATOS
```

### Estado atual do state.json

O OMNIS **ainda não escreve** `aurora_insight`. O campo não existe hoje.
Quando existir, o painel exibe automaticamente. Sem campo = EmptyState honesto.

### Schema do aurora_insight esperado no state.json

```json
{
  "aurora_insight": {
    "text": "Texto do insight gerado pelo Ollama",
    "generated_at": "2026-05-26T10:00:00Z",
    "source": "omnis_ollama",
    "confidence": "high",
    "focus_recommendation": "Ação recomendada"
  }
}
```

Também aceita string simples: `"aurora_insight": "texto direto"`

---

## Anti-teatro: o que foi provado

3 cenários testados com Python puro (lógica de aurora.py):

| Cenário | Input | Output |
|---|---|---|
| 1 | sem `aurora_insight` no state.json | `data: null` ✅ |
| 2 | `aurora_insight` como string | `{text: "...", source: "omnis_ollama"}` ✅ |
| 3 | `aurora_insight` como dict completo | dict com confidence + focus_recommendation ✅ |

Suite: **98 pass / 13 fail** — baseline preservado (13 fails = zod/ambiente, pré-existentes).

---

## O que Codex precisa auditar

### Backend
- [ ] GET `/aurora/insight` responde com `{data: null, source: "live"}` quando `aurora_insight` ausente no state.json
- [ ] GET `/aurora/insight` responde com dados quando campo presente
- [ ] `OMNIS_STATE_PATH` resolve para o caminho correto (`C:\Users\lucas\omnis-control\data\state.json`)
- [ ] Nenhum crash se state.json ilegível/malformado

### Frontend — AuroraInsightCard
- [ ] EmptyState aparece no painel Aurora quando insight é null
- [ ] Card de insight aparece quando insight é fornecido (pode simular via mock)
- [ ] Badge de confidence renderiza com cor correta (high=verde, medium=amarelo, low=cinza)
- [ ] `focus_recommendation` aparece com borda lateral roxa
- [ ] Botão "Tentar novamente" no EmptyState de erro
- [ ] `prefers-reduced-motion` — sem animação de pulse/animate-pulse quando preferência ativa

### TypeScript
- [ ] Zero `any` nos novos arquivos
- [ ] Props com interface definida
- [ ] Schema Zod matchando a resposta real do endpoint

### Integração
- [ ] AuroraPanelContent renderiza sem erro com backend offline (EmptyState honesto)
- [ ] Hook `useAuroraInsight` faz poll a cada 2min sem memory leak
- [ ] Não quebra `useMissionLens` existente (ambos rodam em paralelo)

---

## Próximo passo (Fila 2)

Quando Aurora Fase 2 passar auditoria:
→ **Ligar mais ilhas com fonte real** (FILA KRATOS item 2 do MASTER_PLAN)

---

**Assinado:** opusplan  
**Entregue a:** Codex (auditoria)
