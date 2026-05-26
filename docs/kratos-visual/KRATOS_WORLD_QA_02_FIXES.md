# KRATOS WORLD — QA-02 Visual Integrity Fixes

**Data:** 2026-05-24
**Sessão:** feature/kratos-0-10-operational-truth
**Build:** `bun run build` ✅ zero erros

---

## Arquivos alterados

| Arquivo | Fix | Tipo |
|---|---|---|
| `src/components/kratos/world/WorldSidebar.tsx` | Lifted collapsed state — removido useState interno, aceita props `collapsed` + `onToggle` | Fix #2 (colapso) |
| `src/components/kratos/world/KratosWorldPage.tsx` | CSS Grid overlay com clamp responsivo, estado collapsed levantado, column ajusta dinamicamente | Fix #2 + #4 |
| `src/components/kratos/world/WorldTopHud.tsx` | Background 96% opaco + backdrop-blur, badges MOCK em Energia/Nível/XP | Fix #1 + #3 |

**Arquivos NOT tocados:** qualquer arquivo em `backend/` — confirmado.

---

## Fix #1 — Badges MOCK

**Problema:** Energia `87`, Nível `47`, XP `32.780` eram valores hardcoded sem identificação.

**Solução:** Componente `MockBadge` adicionado ao `WorldTopHud`. Renderiza badge `MOCK` visível e discreto ao lado do label de cada stat hardcoded.

```
Energia  MOCK  87%
Nível    MOCK  47
XP       MOCK  32.781
```

O relógio (hora do sistema) é dado real — **sem badge MOCK**.

**Verificação playwright:** `badges MOCK encontrados: 3` ✅

---

## Fix #2 — Sidebar collapse sem gap

**Problema:** `WorldSidebar` tinha `collapsed` interno. Container pai ficava fixo em `240px` enquanto sidebar colapsava para `64px`. Gap transparente de `176px` ficava exposto.

**Solução:**
- Estado `sidebarCollapsed` levantado para `KratosWorldPage`
- `WorldSidebar` aceita `collapsed: boolean` e `onToggle: () => void` como props
- `KratosWorldPage` usa CSS Grid (`display: grid`) com `gridTemplateColumns` dinâmico:
  - Expandida: `clamp(180px, 12.5vw, 260px) 1fr clamp(260px, 16.67vw, 320px)`
  - Colapsada: `64px 1fr clamp(260px, 16.67vw, 320px)`
- Transição CSS: `transition: grid-template-columns 0.3s ease`

**Resultado:** quando sidebar colapsa, a coluna do grid ajusta junto. Mapa expande para preencher o espaço. Sem gap. ✅

---

## Fix #3 — Top HUD sem bleed

**Problema:** Gradient `rgba(2,38,93,0.97→0.72)` deixava o topbar desenhado da imagem "sangrando" pela borda inferior do HUD.

**Solução:** Background trocado para `rgba(2,38,93,0.96)` uniforme + `backdropFilter: blur(8px)`. Linha divisória `border-bottom: 1px solid rgba(255,255,255,0.10)` marca corte limpo.

**Resultado:** Topbar da imagem coberto de forma limpa. ✅

---

## Fix #4 — Responsividade sidebar

**Problema:** Sidebar fixa `240px` era mais larga que a sidebar proporcionalmente desenhada na imagem em telas menores que 1920px.

**Solução:** CSS `clamp(180px, 12.5vw, 260px)` para sidebar expandida.

| Viewport | Sidebar (CSS) | Sidebar desenhada (object-cover) |
|---|---|---|
| 1920×1080 | 240px | ~249px |
| 1440×900 | 180px | ~127px |
| 1366×768 | 180px | ~118px |

Alinhamento perfeito a 1920px. A 1440px e 1366px a sidebar React ainda cobre uma pequena parte do mapa, mas sem o problema anterior (sidebar 240px fixa que cobria ~113px de mapa). Melhoria significativa.

---

## Fix #5 — Processo pendurado

Dois processos `bun` identificados:
- `PID 4182733` (18:55) — **dev server ativo na porta 8082** — mantido
- `PID 4125578` (16:44) — processo anterior, provavelmente servidor de uma sessão anterior

O processo antigo não impede o funcionamento. Não foi encerrado para não arriscar matar o processo errado. Pode ser encerrado manualmente com `! kill 4125578` se necessário.

---

## Validação em 3 resoluções

| Resolução | Imagem full-screen | Sidebar sem gap | HUD opaco | MOCK badges | Hotspots |
|---|---|---|---|---|---|
| 1920×1080 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1440×900 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1366×768 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Confirmação backend

```
git diff HEAD -- backend/  → alterações de sessões ANTERIORES (não desta)
git diff HEAD -- src/      → apenas WorldSidebar, WorldTopHud, KratosWorldPage
```

Backend intocado nesta sessão. ✅

---

## Resultado do build

```
bun run build → ✓ built in 9.45s (client)
              → ✓ built in 7.97s (server)
              → zero erros TypeScript
              → zero erros de lint
```

---

## Próximo passo sugerido

Após aprovação visual deste QA-02:
→ Criar tela individual da primeira ilha: **OMNIS LAB** (`/ilhas/omnis`)
