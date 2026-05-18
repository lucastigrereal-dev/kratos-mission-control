# KRATOS — Acceptance Checklist v1.0

> Use este arquivo ao final de cada sprint para validar a entrega.
> Cada item deve ser verificado visualmente e/ou via código.
> Sprint só é aprovado quando TODOS os itens do bloco correspondente estão ✅.

---

## CHECKLIST GLOBAL (aplica a todos os sprints)

### Tokens e Visual Bible
- [ ] Todas as cores usando tokens CSS (`--kratos-*`), sem hex hardcoded
- [ ] Todas as fontes usando `--font-body` ou `--font-mono`
- [ ] Todos os espaçamentos usando `--space-*`
- [ ] Todos os border-radius usando `--radius-*`
- [ ] Todas as sombras usando `--shadow-*`
- [ ] Glassmorphism seguindo as regras exatas do VISUALBIBLE.md
- [ ] Aurora com `opacity ≤ 0.15` e `z-index: 0`

### TypeScript
- [ ] Zero erros de TypeScript (`tsc --noEmit` passa limpo)
- [ ] Zero usos de `any` (usar `unknown` + type guards)
- [ ] Todas as interfaces de props nomeadas e explícitas
- [ ] Hooks com retorno tipado explicitamente

### Performance
- [ ] Componentes pesados com `dynamic()` + skeleton de loading
- [ ] Imagens usando `next/image` com dimensões definidas
- [ ] Sem `console.log` no código de produção
- [ ] Sem `useEffect` desnecessário (preferir Server Components)

### Acessibilidade
- [ ] Todos os ícones standalone com `aria-label`
- [ ] Todos os `<img>` com `alt` descritivo
- [ ] Navegação por teclado funcional em todos os elementos interativos
- [ ] Focus ring visível (`outline: 2px solid --kratos-primary`)
- [ ] `prefers-reduced-motion` respeitado em todas as animações

### Estados
- [ ] Todo componente interativo tem: default, hover, active, focus, disabled
- [ ] Todo estado de loading usa skeleton (não spinner genérico)
- [ ] Todo empty state tem ícone + título + descrição (+ CTA quando aplicável)
- [ ] Estados de erro inline (não modal nem toast para validação)

---

## SPRINT 1 — HUD Base

### AppShell
- [ ] Layout correto: TopBar fixo + Sidebar fixo + Main rolável + RightRail fixo + BottomDock fixo
- [ ] UMA região de scroll (apenas Main Content Area)
- [ ] Sem scroll horizontal em nenhum breakpoint
- [ ] Transição suave ao colapsar Sidebar e RightRail

### TopBar
- [ ] Logo KRATOS renderizado (SVG, não imagem)
- [ ] XP bar animada (contagem numérica com `tabular-nums`)
- [ ] Level badge visível
- [ ] Streak counter com ícone de fogo
- [ ] Avatar do usuário com dropdown acessível
- [ ] Glassmorphism correto (background semi-transparente, blur 20px)

### Sidebar
- [ ] 5 itens de navegação principais
- [ ] Item ativo com highlight `--kratos-primary` (não bold apenas)
- [ ] Ícones Lucide corretos para cada seção
- [ ] Tooltip com nome da seção ao colapsar
- [ ] Animação de colapsar/expandir suave (220ms spring)

### BottomDock
- [ ] Sempre visível (não some em scroll)
- [ ] Missão ativa exibida em destaque
- [ ] Botão de ação principal acessível
- [ ] Responsivo (expande em mobile)

### RightRail
- [ ] Painel colapsável (280px → 0)
- [ ] Animação de colapso correta (não pisca)
- [ ] Conteúdo não vaza quando colapsado

---

## SPRINT 2 — Mission Control

### MissionHero
- [ ] Missão ativa visível em ≤ 10 segundos de leitura
- [ ] Título da missão destacado (22px, bold, branco)
- [ ] Prazo exibido com cor semântica (verde/amarelo/vermelho)
- [ ] Barra de progresso animada ao carregar
- [ ] Glow `--kratos-primary-glow` em torno do card quando ativo
- [ ] Empty state com CTA quando não há missão ativa

### NextActionCard
- [ ] Próxima ação em destaque visual claro
- [ ] Botão de completar ação acessível e destacado
- [ ] Estado de loading com skeleton correto
- [ ] Animação de conclusão (sucesso visual + XP ganho)

### Aurora Background
- [ ] 2 blobs animados com `animation-duration ≥ 8s`
- [ ] `opacity ≤ 0.12`, `filter: blur(80px)`
- [ ] `z-index: 0`, `pointer-events: none`
- [ ] Não interfere na leitura de nenhum texto
- [ ] Para completamente com `prefers-reduced-motion`

### XP e Progresso
- [ ] XP animado ao ganhar (contador sobe visivelmente)
- [ ] Barra de progresso de nível animada
- [ ] Toast/feedback de XP ganho (não bloqueia a tela)

---

## SPRINT 3 — Mapa de Ilhas

### IslandMap
- [ ] Grid/canvas de ilhas renderizado sem overflow
- [ ] Ilhas bloqueadas visualmente distintas (lock icon, opacity reduzida)
- [ ] Ilhas concluídas com badge/glow de conclusão
- [ ] Ilha atual/ativa destacada com `--kratos-primary-glow`
- [ ] Animação de hover nas ilhas desbloqueadas

### IslandCard
- [ ] Nome da ilha visível
- [ ] Progresso (X/Y missões) exibido
- [ ] Estado: locked / active / completed visualmente claro
- [ ] Click navega para lista de missões da ilha

---

## SPRINT 4 — Telas Internas

### Quest List
- [ ] Filtros funcionais (status, prazo, prioridade)
- [ ] Paginação ou scroll infinito sem bug de duplicata
- [ ] Skeleton correto durante loading
- [ ] Empty state com CTA de criar missão

### Quest Detail
- [ ] Todas as informações da missão exibidas
- [ ] Lista de sub-tarefas com checkboxes funcionais
- [ ] Atualização otimista (UI atualiza antes da resposta do servidor)
- [ ] Botão de conclusão de missão com confirmação

---

## SPRINT 5 — Polish e QA Final

### Visual
- [ ] Comparar cada tela com mockup PNG — desvios documentados
- [ ] Consistência de espaçamento entre todas as telas
- [ ] Consistência de tipografia entre todas as telas
- [ ] Dark mode funcionando em 100% das telas (já é dark-first, verificar edge cases)

### Performance
- [ ] Lighthouse Performance ≥ 85 em `/dashboard`
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1
- [ ] Nenhum componente re-renderizando desnecessariamente (React DevTools)

### Mobile
- [ ] Layout funcional em 375px (iPhone SE)
- [ ] Layout funcional em 390px (iPhone 14)
- [ ] Touch targets ≥ 44x44px em todos os botões
- [ ] Drawer de sidebar abre/fecha corretamente
- [ ] BottomDock não cobre conteúdo importante

### Acessibilidade Final
- [ ] Navegação completa por teclado (Tab → Enter → Escape)
- [ ] Screen reader: headings hierárquicos corretos
- [ ] Contraste de texto: WCAG AA em todas as combinações

---

## RELATÓRIO DE ENTREGA (obrigatório por sprint)

A Manus deve entregar ao final de cada sprint um relatório com:

```markdown
## Sprint [N] — Relatório de Entrega

### Arquivos criados/modificados
- [lista de arquivos]

### Decisões tomadas
- [lista de decisões não óbvias e justificativa]

### Desvios do spec
- [lista de desvios com justificativa — se nenhum, escrever "Nenhum"]

### Dependências instaladas
- [lista — se nenhuma, escrever "Nenhuma"]

### Pontos de atenção para o próximo sprint
- [lista]

### Checklist do sprint: [N/N itens aprovados]
```
