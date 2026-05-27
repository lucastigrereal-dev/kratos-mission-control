# KRATOS WORLD — OMNIS LAB Screen Report

**Data:** 2026-05-24
**Sessão:** feature/kratos-0-10-operational-truth
**Rota:** `/ilhas/omnis`
**Build:** `bun run build` ✅ zero erros

---

## Arquivo alterado

| Arquivo | Tipo |
|---|---|
| `src/components/kratos/islands/OmnisLabScreen.tsx` | Rewrite — 5 adições ao spec |

**Backend intocado.** ✅

---

## Componentes adicionados

### 1. `MockBadge`
Badge âmbar idêntico ao padrão do `WorldTopHud`. Exibido inline ao lado do valor em cada summary card e no cabeçalho do `RealtimeFlowStepper` (seção 100% hardcoded).

```
[valor]  MOCK
```

### 2. `AuroraCard`
Cartão roxo/aurora no topo do conteúdo, abaixo do header. Identidade Aurora + modo seguro explicado ao operador:

> "Tigrão, aqui é onde intenção vira execução. Por enquanto, estamos no modo visual seguro — nenhuma automação real está ativa. Defina o contrato KRATOS ↔ OMNIS antes de ligar o motor."

### 3. `ProximaAcaoCard`
Cartão com borda superior em gradiente púrpura OMNIS. Ação dominante clara:

> "Definir contrato KRATOS ↔ OMNIS antes de permitir execução real."

Com descrição de contexto sobre o escopo do contrato.

### 4. `GuardrailCard`
Cartão âmbar listando 5 itens com `XCircle` vermelho — o que NÃO deve ser feito agora:
- Executar automação real
- Apagar arquivo ou dado
- Publicar conteúdo
- Commitar no repositório
- Conectar API sensível

### 5. Botão "Voltar ao Mapa" funcional
`IslandPageHeader` agora recebe `onBack={() => navigate({ to: "/" })}` via `useNavigate` do TanStack Router. O botão "Voltar ao Castelo" existente no header fica ativo e navega de volta ao mapa.

---

## Layout da tela (ordem vertical)

```
IslandPageHeader (com back button → /)
AuroraCard
HolographicCore (hero centralizado, animações CSS)
OmnisSummaryCards (4 cards — MOCK badge em cada valor)
[ProximaAcaoCard] | [GuardrailCard]   ← 2 colunas
[AutomationBoard] | [ActiveAgentsList] ← 2 colunas
[RecentExecutionsList (2/5)] | [RealtimeFlowStepper (3/5) + MOCK badge]
```

---

## Dados com badge MOCK

| Dado | Origem | Badge |
|---|---|---|
| Testes OMNIS | API real / fallback `—` | ✅ |
| Workflows | API real / fallback `—` | ✅ |
| Docs Akasha | API real / fallback `—` | ✅ |
| Último Run | API real / fallback `—` | ✅ |
| Fluxo em Tempo Real | 100% hardcoded | ✅ (no header da seção) |

Crews e Jobs **não** levam badge MOCK — vêm de API real; quando vazios exibem `EmptyState`.

---

## Dados NÃO mockados

| Dado | Origem |
|---|---|
| Crews OMNIS | `useOmnisCrews()` — API real |
| Jobs recentes | `useOmnisJobs(5)` — API real |
| Últimas execuções | `useOmnisJobs(5)` — API real |

---

## Build

```
bun run build
→ ✓ built in 5.12s (client)
→ ✓ built in 4.25s (server)
→ zero erros TypeScript
→ zero erros de lint
→ OmnisLabScreen-*.js: 15.86 kB client / 30.14 kB server
```

---

## Próximo passo sugerido

Com OMNIS LAB entregue:
→ QA visual da tela `/ilhas/omnis` (screenshot Playwright)
→ Criar próxima ilha individual ou evoluir `IslandPageFrame` para suportar fundo temático por ilha
