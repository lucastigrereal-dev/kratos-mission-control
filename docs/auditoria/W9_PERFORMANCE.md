# W9 — Performance + Bundle Audit
**Data:** 2026-05-27 | **Wave:** W9-B8 | **Branch:** feature/fase14-integration

---

## Resumo executivo

| Métrica | Valor | Alvo | Status |
|---|---|---|---|
| Bundle principal (gzip) | 205 kB | < 200 kB | ⚠️ +5KB |
| CSS (gzip) | 18.8 kB | — | ✅ |
| Code splitting (rotas) | ✅ 9 lazy chunks | ✅ | ✅ |
| PWA Manifest | ✅ existe | ✅ | ✅ |
| Service Worker | ❌ não configurado | Desejável | ⚠️ P2 |
| Build clean | ✅ 0 erros | ✅ | ✅ |

---

## Bundle Analysis

### Chunks principais
| Chunk | Raw | Gzip est. | Tipo |
|---|---|---|---|
| `index-CBv8nx11.js` | 660 kB | **205 kB** | Vendor + app core |
| `styles-0u6hN4PQ.css` | 108 kB | 19 kB | Tailwind + tokens |
| `index-Di0GQqrh.js` | 28 kB | 7.7 kB | SSR entry |

### Lazy chunks por rota (code splitting ativo ✅)
| Rota | Chunk | Tamanho raw |
|---|---|---|
| `/agora` | `agora-*.js` | 22 kB |
| `/agenda` | `agenda-*.js` | 22 kB |
| `/checkpoints` | `checkpoints-*.js` | 15 kB |
| `/projetos` | `projetos-*.js` | 8 kB |
| `/contexto` | `contexto-*.js` | 14 kB |
| `/sistema` | `sistema-*.js` | 11 kB |
| `/ilhas/agencia` | `AgenciaScreen-*.js` | 13 kB |
| `/ilhas/omnis` | `OmnisLabScreen-*.js` | 42 kB |
| OMNIS hooks | `useOmnis-*.js` | 1.2 kB |

**Avaliação:** Code splitting funcionando — nenhuma rota carrega o bundle inteiro.
OmnisLabScreen é o maior chunk de ilha (42 kB raw) — candidato a split em W10.

### Por que o bundle está em 205 kB gzip (5 kB acima do alvo)?
Principais contribuidores estimados:
- `@tanstack/react-query` + `@tanstack/react-router`: ~80 kB gzip
- `framer-motion`: ~30 kB gzip (instalado como @12.40.0)
- `@radix-ui/*` (47 componentes shadcn/ui): ~40 kB gzip
- React 19: ~15 kB gzip
- KRATOS app code: ~40 kB gzip
- Misc Lucide icons carregados estaticamente: ~5 kB gzip

**Oportunidade de redução (P2):**
1. Lazy loading de `framer-motion` apenas nas ilhas que usam animação
2. Auditar ícones Lucide: usar `import { X } from 'lucide-react/dist/esm/icons/x'` individualmente
3. Verificar se todos os 47 componentes shadcn estão sendo usados

---

## PWA Status

### O que existe
- ✅ `public/manifest.webmanifest` — instalável no mobile/desktop
- ✅ `src/hooks/usePWAInstall.ts` — captura `beforeinstallprompt`, threshold 3 visitas
- ✅ `src/components/kratos/shell/PWAInstallPrompt.tsx` — chip bottom-left
- ✅ `src/hooks/useOffline.ts` — detecta `navigator.onLine`
- ✅ `src/components/kratos/shell/OfflineBanner.tsx` — banner âmbar offline

### O que falta (P2)
- ❌ **Service Worker não configurado** — sem cache offline de assets
  - `vite-plugin-pwa` não instalado/configurado
  - Sem `sw.ts` no src
  - Implicação: "instalar PWA" funciona mas app quebra offline (sem SW cache)
  
**Impacto:** P2 — para uso diário do Lucas a partir de localhost/Vercel, SW não é bloqueante.
Para uso mobile offline é necessário.

---

## Lighthouse (estimativa baseada no bundle)

Sem ambiente de dev rodando, estimativa baseada nos indicadores:

| Métrica | Estimativa | Base |
|---|---|---|
| Performance | ~85-90 | Bundle 205KB gzip, code split por rota |
| Accessibility | ~90+ | Aria roles implementados (Sprint C) |
| Best Practices | ~90+ | HTTPS, manifest, sem console.log |
| SEO | ~85 | Meta tags presentes |

**Para score > 90 em Performance:** reduzir bundle 5KB (P2) + adicionar SW cache (P2).

---

## Recomendações

### P2 — Não bloqueiam merge, mas melhoram score
1. **Service Worker:** `bun add vite-plugin-pwa` + configuração Workbox
   - Cache offline de assets → app funciona sem rede
   - Lighthouse +5-10 pontos
   
2. **Framer Motion lazy:** Importar apenas nas rotas que usam animação
   - Potencial -20-30 kB gzip no bundle principal
   
3. **Lucide tree-shaking:** Verificar se Vite está tree-shaking ícones corretamente
   - `import { X, Check } from 'lucide-react'` já deve funcionar com Vite

4. **OmnisLabScreen split:** 42 kB raw é grande — candidato a split adicional

---

*Auditoria executada por: Claude Sonnet 4.6 | KRATOS W9-B8 | 2026-05-27*
