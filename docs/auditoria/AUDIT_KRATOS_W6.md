# AUDITORIA KRATOS WAVE W6 — Performance + PWA
**Data:** 2026-05-27 02:59:14 -03:00 | **Auditor:** Codex  
**Veredito:** ❌ REPROVADO

## Resumo executivo
A build de produção (client + SSR) passa, os testes de contratos/stores estão verdes (270/270), e não encontrei violação direta da boundary "KRATOS lê, Aurora comanda" em componentes de UI.  
Porém, a base está com type safety quebrado no estado atual (`npx tsc --noEmit` com 94 erros), o que bloqueia avanço de wave.  
Além disso, a parte de PWA do W6 não está completa no Vite config (sem `vite-plugin-pwa`) e os schemas Zod não usam `.strict()`.

## Checklist por dimensão
| Dimensão | Status | Detalhe |
|---|---|---|
| Build + TypeScript | ❌ | Build ok; TypeScript falha com **94 erros** (`npx tsc --noEmit`) |
| Boundary (lê/comanda) | ✅ | Sem `apiPost/apiPatch/apiDelete` em `src/components`; sem mutação direta em cards W7 read-only |
| Testes passam | ✅ | `bun test tests/stores tests/contracts` → **270/270 verdes** |
| Zod validação | ❌ | Há `safeParse/parse` em hooks/server-fns, mas **nenhum `.strict()`** em schemas encontrados |
| Data fetching | ✅ | Predomínio de TanStack Query; sem `fetch` manual em componentes (apenas `refetch`) |
| Performance/bundle | ❌ | Main chunk `index-*.js` **660.53 kB raw / 205.38 kB gzip** (gzip < 250KB, mas raw > 600KB red flag do checklist) |
| SSE real-time | ✅ | `useLiveStatus` cria `EventSource`, reconecta com backoff e fecha no cleanup |
| Secrets/env | ✅ | Sem secrets hardcoded em `src`; `.env` e `.env.*` no `.gitignore` |
| Aderência ao spec | ❌ | W6-B1 parcialmente ok (lazy/chunks), W6-B2 incompleta (sem `vite-plugin-pwa` no `vite.config.ts`) |

## 🔴 P0 (bloqueiam — corrigir AGORA)
1. [src/hooks/useLiveStatus.ts:9](/C:/Users/lucas/kratos-mission-control/src/hooks/useLiveStatus.ts:9) — import inválido de schema (`../../api-contract/...`) e uso de campos não existentes (`s.status`, `s.port`) gerando erro de typecheck.  
2. [src/components/kratos/views/ContextoView.tsx:14](/C:/Users/lucas/kratos-mission-control/src/components/kratos/views/ContextoView.tsx:14) — import de contrato com caminho inválido (`../../../api-contract/contexto.schema`).  
3. [src/lib/appointment-server-fns.ts:31](/C:/Users/lucas/kratos-mission-control/src/lib/appointment-server-fns.ts:31) — assinatura incompatível com `createServerFn` (ctx/data), quebrando tipagem.  
4. [src/hooks/useSafeQuery.ts:25](/C:/Users/lucas/kratos-mission-control/src/hooks/useSafeQuery.ts:25) — tipagem genérica incompatível com overload de `useQuery`.  
5. [src/routes/index.tsx:66](/C:/Users/lucas/kratos-mission-control/src/routes/index.tsx:66) — acesso a propriedades em arrays como se fossem objeto singular (`status`, `data`), causando erros TS.

## 🟡 P1 (corrigir antes da próxima wave)
1. [vite.config.ts:14](/C:/Users/lucas/kratos-mission-control/vite.config.ts:14) — W6-B2 pede PWA; config atual não mostra `vite-plugin-pwa`/SW registrado.  
2. [api-contract/missions.schema.ts:3](/C:/Users/lucas/kratos-mission-control/api-contract/missions.schema.ts:3) (e demais schemas) — ausência de `.strict()` em contratos Zod.  
3. [dist/client/assets/index-*.js](/C:/Users/lucas/kratos-mission-control/dist/client/assets/index-BeKLF3hi.js:1) — chunk principal acima de 600KB raw (red flag de performance do checklist).  
4. `bun run typecheck` não existe em `package.json` (script ausente), dificultando ritual padrão de validação.

## 🟢 P2 (melhorias)
1. Adicionar script explícito `"typecheck": "tsc --noEmit"` no `package.json` para padronizar gate local/CI.  
2. Cobrir `useLiveStatus` com teste de unidade para garantir mapping correto dos campos do schema de serviço e cleanup do SSE.

## Veredito final
- [ ] PODE seguir para próxima wave
- [x] PRECISA corrigir P0 antes

