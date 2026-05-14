---
name: visual-qa-kimi
description: "Checklist de validação visual pós-implementação: tokens, glass, ilhas, HUD, acessibilidade, responsividade."
metadata:
  type: skill
  tier: analytics
  project: kratos-mission-control
  scope: frontend
---

# visual-qa-kimi

Checklist de validação visual para auditar componentes após implementação.

## Checklist de 12 pontos

### 1. Tokens
- [ ] Nenhum `style={{ color: "#..." }}` nos componentes
- [ ] Todas as cores usam `var(--kr-*)`
- [ ] Todos os espaçamentos usam `var(--kr-space-*)`
- [ ] Nenhum token novo foi adicionado sem aprovação

### 2. Glass
- [ ] Painéis de vidro usam classe `.glass-panel` ou tokens `var(--kr-glass-*)`
- [ ] Blur não causa náusea (testar com `prefers-reduced-motion: reduce`)
- [ ] Texto sobre vidro tem contraste suficiente

### 3. Ilhas
- [ ] Mundo 3D existe (`.kr-world` com perspectiva)
- [ ] 7 ilhas + castelo + 9 pontes + nuvens + oceano intactos
- [ ] Animações desligam com `prefers-reduced-motion`
- [ ] Navegação por clique nas ilhas funciona

### 4. HUD
- [ ] Shell grid 5 áreas intacto
- [ ] TopHUD mostra greeting + relógio BRT + connection dot
- [ ] Sidebar 8 itens com NavLink ativo
- [ ] BottomDock mostra missão + próxima ação + progresso

### 5. Source Badge
- [ ] Todo componente que mostra dados tem `<SourceBadge source={...} />`
- [ ] Badge não mente: `mock` quando dados são mock, `live` quando backend respondeu

### 6. Estados
- [ ] Loading: skeleton ou spinner (não tela branca)
- [ ] Error: mensagem com cor `var(--kr-red-400)` (não crash)
- [ ] Empty: estado vazio com texto (não tela em branco)
- [ ] Offline: overlay quando `connectionState === "offline"`

### 7. Acessibilidade
- [ ] `prefers-reduced-motion` desliga animações
- [ ] `prefers-contrast: high` fortalece bordas
- [ ] Skip link funciona com Tab
- [ ] `:focus-visible` visível em todos os elementos interativos

### 8. TypeScript
- [ ] `npx tsc --noEmit` retorna 0 erros
- [ ] Nenhum `any` nos componentes (usar interfaces)
- [ ] Todas as props têm interface definida

### 9. Build
- [ ] `npx vite build` retorna 0 erros
- [ ] Bundle size não aumentou >10% sem justificativa

### 10. Backend health
- [ ] `curl /live/snapshot` retorna 200
- [ ] Dados exibidos batem com o que o backend entrega
- [ ] Fallback funciona quando backend offline

### 11. Console do navegador
- [ ] Zero erros no console
- [ ] Zero warnings de React (keys, lifecycle, etc.)

### 12. Kimi spec fidelity
- [ ] Componentes implementados batem com o spec visual de origem
- [ ] Nada foi adicionado além do spec (sem feature creep)
- [ ] Nada foi removido do spec (sem escopo cortado)
