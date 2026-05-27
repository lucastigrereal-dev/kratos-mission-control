# W11-B2 — Browser Console Audit (P1-A)
**Data:** 2026-05-27
**Branch:** main @ `29bf944` + W11-B2 local
**Método:** Análise estática + tentativa de preview browser (Preview MCP sem bridge de rede no ambiente Windows desta sessão)

---

## Status

**Verificação estática: COMPLETA** — 6 categorias auditadas via `tsc`, `grep`, análise de padrões.
**Verificação browser live: PENDENTE** — requer `bun run dev` + DevTools manual por Lucas.
**Erros P0 de runtime identificados: 0** — nenhum crash garantido encontrado estaticamente.
**Erros P1 identificados: 3** — type mismatches com potencial de runtime warning.

---

## Categoria 1 — React Key Anti-Patterns

**Status: ✅ OK (com nota)**

| Arquivo | Padrão | Risco |
|---|---|---|
| `BridgeSystem.tsx:56` | `key={index}` em `connections.map()` | ✅ Aceitável — array de partículas SVG fixas, não reordena |
| `CloudLayer.tsx:65` | `key={index}` em `clouds.map()` | ✅ Aceitável — array de nuvens decorativas geradas uma vez |

Nenhum `key={index}` em listas dinâmicas (checkpoints, missões, projetos). Listas de dados usam `key={item.id}`.

---

## Categoria 2 — TypeScript Errors com Potencial de Runtime Warning

**Status: ⚠️ 3 padrões P1**

### P1 — `null` onde `string` é esperado (3 ocorrências)

```
CurrentMissionBar.tsx:93 — Type 'null' is not assignable to type 'string'
DriftIndicator.tsx:90    — Type 'null' is not assignable to type 'string'
AgoraView.tsx:235        — Type 'string | null' is not assignable to type 'string'
```

**Risco de runtime:** Se o componente receptor chamar `.toUpperCase()` ou similar em null → `TypeError: Cannot read properties of null`. Ou se passado direto ao JSX → "Objects are not valid as React child" não se aplica (null é válido), mas string operators sim.

**Probabilidade:** Média (só acontece quando dado não está disponível ainda).

### P1 — `"mission-lens"` / `"drift"` não existem em DataSource enum

```
CurrentMissionBar.tsx:90 — '"mission-lens"' not assignable to DataSource
DriftIndicator.tsx:87    — '"drift"' not assignable to DataSource
AgoraView.tsx:232        — '"mission-lens"' not assignable to DataSource
StatusBarDock.tsx:153    — '"mission-lens"' not assignable to DataSource
```

**Risco de runtime:** `SourceBadgeIndicator` provavelmente renderiza fallback/muted para valores desconhecidos. Não é crash, mas UI pode mostrar badge errado.

**Probabilidade:** Alta (acontece toda vez que /agora carrega).

### P1 — `ProjetosView.tsx:193` callback mismatch

```
Type '(project: {...}) => void' is not assignable to type '(id: string) => void'
```

**Risco de runtime:** Se o código que chama o callback espera `id: string` mas recebe o objeto `project` inteiro, pode causar erro downstream. Precisa de inspeção manual no caminho de execução.

### P2 — `ringColor` CSS property não reconhecida

```
OperatorWelcomeCard.tsx:39 — 'ringColor' does not exist in CSS Properties
TopBarV2.tsx:70            — 'ringColor' does not exist in CSS Properties
```

**Risco de runtime:** Zero — CSS vars customizadas não causam erro de browser. Só type error.

### P2 — `DashboardView.tsx` propriedades ausentes no tipo

```
DashboardView.tsx:144 — Property 'isError' does not exist on DashboardSummary
DashboardView.tsx:235 — Property 'degraded' does not exist
```

**Risco de runtime:** `undefined` silencioso — não vai crash, vai renderizar fallback/vazio.

---

## Categoria 3 — Hydration (SSR/Client Mismatch)

**Status: ✅ OK**

5 pontos de guarda `typeof window === "undefined"` encontrados:
- `ReducedMotionProvider.tsx` — ✅ correto
- `AuroraDrawer.tsx` — ✅ correto
- `AuroraOrb.tsx` — ✅ correto
- `useDriftDetection.ts` — ✅ correto
- `usePWAInstall.ts` — ✅ correto

Nenhuma chamada de `localStorage`/`sessionStorage`/`navigator` sem guarda SSR detectada.

---

## Categoria 4 — Console.log leaks (não-intencionais)

**Status: ✅ OK**

Somente `console.error` em handlers de erro (todos intencionais):
- `errorHandler.ts:74,102` — captura erros não tratados
- `__root.tsx:64` — error boundary SSR
- `server.ts:65,76` — SSR error wrapper
- `start.ts:12` — entry point

**Zero `console.log` ou `console.warn`** em código de produção.

---

## Categoria 5 — Padrões Deprecated React

**Status: ✅ OK**

- Zero `PropTypes` (TypeScript puro)
- Zero class components (tudo functional)
- Zero `componentDidMount`/`componentWillMount`
- `dangerouslySetInnerHTML`: apenas em `ui/chart.tsx` (shadcn — gerenciado, não é risco XSS de input de usuário)

---

## Categoria 6 — Import Path KratosContext (P1 — Módulo Errado)

**Status: ⚠️ P1 — Risco latente**

`src/components/kratos/world/KratosContext.tsx` importa:
```typescript
import type { DataSource } from "../../../api-contract/source-badge.schema";
import type { SourceBadgeMeta } from "../../../api-contract/source-badge.schema";
```

`../../../` de `src/components/kratos/world/` resolve para `src/` — mas `api-contract/` está na **raiz do repo**, não dentro de `src/`. Caminho correto seria `../../../../api-contract/`.

**Por que o build funciona:** Vite/esbuild usa resolver próprio que pode ser mais permissivo que `tsc`. O `@lovable.dev/vite-tanstack-config` com `tsConfigPaths` pode incluir resolução adicional.

**Risco:** Se o resolver do Vite não encontrar o módulo em runtime (CF Workers), o app poderia falhar no boot. Como está em produção sem erro reportado, o resolver provavelmente encontra via outro mecanismo.

**Ação W11-B3:** Corrigir para `../../../../api-contract/source-badge.schema` e verificar se o TS error desaparece.

---

## Lista de Erros para Verificação Manual Browser

Lucas: abrir http://localhost:5173 (após `bun run dev`), DevTools → Console → Filter: Errors+Warnings.

### Verificar especificamente:

| Rota | O que verificar | Provável erro |
|---|---|---|
| `/agora` | Console ao carregar | `"mission-lens"` DataSource badge — warning no SourceBadgeIndicator? |
| `/agora` | Clicar "Pausar" em checkpoint | `null` string access em CurrentMissionBar? |
| `/projetos` | Clicar em projeto | ProjetosView callback mismatch — erro downstream? |
| `/sistema` | Carregar Cost Dashboard | Nenhum esperado (W10 código limpo) |
| Todas | Navegação entre rotas | React Router warnings de key? |

### Critérios de aceitação:
- ✅ Zero erros vermelhos (`console.error`) não-intencionais
- ✅ Warnings de React `key` apenas nas rotas com listas de partículas (OK)
- ⚠️ Se `DataSource "mission-lens"` gerar warning: P1 → fix em W11-B3
- 🔴 Se `null` string access gerar TypeError: P0 → hotfix imediato

---

## Ação Recomendada

1. **Agora (W11-B2 → W11-B3):** Corrigir os 3 padrões P1 mais simples:
   - `KratosContext.tsx` import path (`../../../` → `../../../../`)
   - Adicionar `"mission-lens"` e `"drift"` ao enum `DataSource` em `source-badge.schema.ts`
   - `CurrentMissionBar.tsx` e `DriftIndicator.tsx` — null coalesce para `""` nos campos string

2. **Manual (Lucas):** 10min de DevTools nas 4 rotas listadas acima para confirmar que P1 estático não vira P0 dinâmico.

---

*Nota: Preview MCP browser não estabeleceu conexão de rede no ambiente Windows desta sessão (porta 8082/5173 não acessível pelo browser sandbox). Auditoria concluída via análise estática. Instrução para verificação live documentada acima.*
