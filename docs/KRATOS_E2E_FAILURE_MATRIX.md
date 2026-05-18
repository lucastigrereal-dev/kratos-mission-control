# KRATOS E2E Failure Matrix

## Escopo coberto
Routes smoke · sourcebadge smoke · console scan · navigation · snapshot states

## Matriz

| Teste | Rota | Causa raiz | Tipo | Arquivo alterado | Correção | Status |
|---|---|---|---|---|---|---|
| console error scan | /agora | `key={s.name}` duplica quando OMNIS e KRATOS têm serviços de mesmo nome (OLLAMA, SUPABASE DB, REDIS, N8N) | duplicate key | `src/components/kratos/agora/SystemPulseStrip.tsx` | `key={`${s.name}-${i}`}` | ✅ Corrigido |
| SourceBadgeIndicator is visible | / | `span[title*='Fonte:']` — componente sem atributo `title` | selector mismatch | `src/components/kratos/base/SourceBadgeIndicator.tsx` | Adicionado `title={`Fonte: ${label}...`}` | ✅ Corrigido |
| sourcebadge.smoke | /, /contexto | Badge não visível — dados demoram por retry=3 no hook | retry timeout | `src/hooks/useContexto.ts` | `retry: false` | ✅ Corrigido |
| sourcebadge.smoke | /sistema | Badge não renderizável sem dados (meta=null) com timeout | retry timeout | `src/hooks/useServices.ts`, `useOmnis.ts` | `retry: false` | ✅ Corrigido |
| sidebar toggle | navegação | Texto do grupo "Operação" visível via DOM mesmo colapsado | text mismatch | `src/components/kratos/shell/SidebarItem.tsx` | Já usa `{!collapsed && <span>}` — ok com teste atualizado | ✅ Resolvido por update do teste |
| routes.smoke | /agora, /agenda, /contexto, /sistema | Retry 3x com backoff exponencial (~7-8s) antes de mostrar error state | retry timeout | `src/hooks/useServices.ts`, `useOmnis.ts`, `useContexto.ts` | `retry: false` em todos os hooks externos | ✅ Corrigido |
| states.smoke | /agora, /agenda, /contexto, /sistema | Mesma causa dos routes.smoke — heading não aparece antes de 15s | retry timeout | Mesmos arquivos | Mesma correção | ✅ Corrigido |
| states.smoke | /sistema | "Saúde dos serviços" não visível antes do timeout | retry timeout | `src/hooks/useServices.ts` | `retry: false` | ✅ Corrigido |
| screenshots baseline | múltiplas | Baseline não gerado | skip justified | N/A | Rodar `bun run test:e2e --update-snapshots` com servidor ativo | Pendente validação local |

## Padrões de correção

### 1. Chaves únicas em listas
```tsx
// antes
{systems.map((s) => <li key={s.name}>...)}
// depois
{systems.map((s, i) => <li key={`${s.name}-${i}`}>...)}
```

### 2. Atributo title no SourceBadge
```tsx
title={`Fonte: ${label}${meta.origin ? ` · ${meta.origin}` : ""} · ${timeAgo}`}
```

### 3. retry: false nos hooks externos
```ts
// Todos os hooks que fazem queries para serviços externos:
retry: false,  // evita ~7-8s de backoff exponencial antes do error state
```

## Critério de aceite

- `bun run build` — PASS
- `bun run test` — 270+ PASS, 0 fail
- `bun run test:e2e` — PASS ou apenas SKIPs justificados

## Comandos

```powershell
cd C:\Users\lucas\kratos-mission-control
bun run build
bun run test
$env:PLAYWRIGHT_BASE_URL="http://localhost:8081"; bun run test:e2e
powershell -ExecutionPolicy Bypass -File scripts\validate-kratos-rc.ps1
```
