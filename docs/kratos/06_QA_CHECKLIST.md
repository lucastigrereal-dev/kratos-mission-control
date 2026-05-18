# KRATOS QA Checklist — Validação Sprint a Sprint

> **Para MANUS:** Use este checklist para validar o que foi entregue. Cada sprint tem critérios específicos. Cada item deve ser marcado com evidência.

---

## Sprint P1-P4: Mission Control Foundation ✅

### P1 — Build & Deploy Foundation
- [ ] `bun run build` — zero erros (client + SSR)
- [ ] `bun test` — 270 pass
- [ ] `bun eslint src/` — zero erros NOVOS
- [ ] Rotas 9/9 HTTP 200
- [ ] Home `/` sem hydration error

### P2 — Mission Lens Binding
- [ ] `useMissionLens()` retorna dados ou fallback
- [ ] MissionLensData schema Zod válido
- [ ] current_mission visível na UI
- [ ] phase e status expostos
- [ ] mentor_signals com tone (critical/warning/info/neutral)
- [ ] next_best_action com action + rationale + score
- [ ] collector_status array com health por collector
- [ ] SourceBadge visível (live/cache/mock/error)

### P3 — Checkpoint System
- [ ] CRUD checkpoints funcional
- [ ] Checkpoint save: título + descrição + status
- [ ] Checkpoint restore: retomar do paused
- [ ] Status flow: in_progress → paused → in_progress
- [ ] Timeline visual com ordenação por data
- [ ] FilterBar funcional (status + projeto)
- [ ] ResumeFromHereCard visível quando há paused

### P4 — Aurora Commands
- [ ] `/retomar` — retoma checkpoint pausado + refetch lens
- [ ] `/salvar` — cria checkpoint com nextAction/missão atual
- [ ] `/foco` — navega para /agora + refetch lens
- [ ] AuroraChatDock com chips de comando
- [ ] Feedback visual no clique (200ms pulse glow)
- [ ] Mensagens contextuais Aurora (drift/lost/zombie/normal)

---

## Sprint P6: QA Visual Aprofundado 🔜

### TypeScript
- [ ] `bun run lint` — sem erros novos
- [ ] Zero `any` no diff
- [ ] Toda prop com interface definida
- [ ] Named exports (nunca default)

### Build
- [ ] `bun run build` — zero erros
- [ ] Bundle size sem regressão > 10%

### Visual — Tokens
- [ ] Zero `style={{ color: "#..." }}` no diff
- [ ] Zero `style={{ background: "#..." }}` no diff
- [ ] Todos os tokens CSS com prefixo `var(--kr-*)`
- [ ] Glass panels usando `.kr-glass` ou `.kr-glass-strong`

### Visual — Dark Mode
- [ ] Background `#0c0c0e` ou `var(--kr-ocean-deep)`
- [ ] Texto legível em todos os cards
- [ ] Bordas visíveis (não desaparecem no escuro)
- [ ] Sombras visíveis

### Visual — Mobile 375px
- [ ] Sem overflow horizontal
- [ ] Sidebar colapsada (ícones)
- [ ] AuroraPanel fechado (toggle)
- [ ] Cards em coluna única
- [ ] Touch targets ≥ 44px
- [ ] Texto não truncado sem sentido

### Visual — Estados
- [ ] Loading: shimmer animation funcional
- [ ] Empty: mensagem clara + CTA opcional
- [ ] Error: mensagem + botão retry
- [ ] Offline: ZombieBadge visível
- [ ] Transições entre estados sem flicker

### Visual — Animações
- [ ] Máximo 2 animações simultâneas
- [ ] Nenhum loop infinito (exceto nuvens 120s)
- [ ] Duração ≤ 0.6s para UI (exceto nuvens)
- [ ] `prefers-reduced-motion: reduce` desliga TUDO

### Visual — Console
- [ ] Zero erros no console do navegador
- [ ] Zero warnings relevantes
- [ ] Zero `console.log` no código commitado

### Visual — Acessibilidade
- [ ] Contraste de texto ≥ 4.5:1 (corpo), ≥ 3:1 (grande)
- [ ] Focus ring visível em todos os interativos
- [ ] Labels em botões e inputs
- [ ] Alt text em ícones decorativos (aria-hidden)

### Visual — Anti-Carnaval
- [ ] Sem cores vibrantes em elementos não-críticos
- [ ] Sem animações excessivas
- [ ] Sem elementos puramente decorativos
- [ ] Sem gradientes chamativos fora do sistema
- [ ] Tom operacional mantido (Linear/Vercel reference)

---

## Sprint P5: OMNIS Gate 🔒 BLOCKED

- [ ] Contrato `api-contract/omnis.schema.ts` completo
- [ ] `useOmnisStatus()` hook definido
- [ ] `useOmnisCrews()` hook definido
- [ ] `useOmnisJobs()` hook definido
- [ ] `OmnisServiceStatusCard` renderiza
- [ ] Placeholder honesto quando backend offline
- [ ] SourceBadge `"mock"` visível
- [ ] Nenhum botão de "executar" sem gate humano

---

## Sprint P7: Akasha Real 🔒 BLOCKED

- [ ] Contrato `api-contract/akasha.schema.ts` definido
- [ ] Hook `useAkasha()` definido
- [ ] `AkashaScreen` renderiza com dados ou placeholder
- [ ] Placeholder honesto quando pgvector offline
- [ ] SourceBadge visível
- [ ] Nenhuma escrita na Akasha sem confirmação

---

## Checklist Universal (Todo Commit)

### Pré-Commit
```bash
# 1. Build limpo
bun run build

# 2. Testes sem regressão
bun test

# 3. Lint sem erros novos
bun eslint src/

# 4. Working tree review
git status --short
git diff --stat

# 5. Caça aos hex e console.log
git diff | grep -E "console\.(log|warn)|style.*#"
```

### Code Review
- [ ] Nenhum componente novo duplicando existente
- [ ] Nenhum `fetch()` raw + `useEffect`
- [ ] Nenhum `export default`
- [ ] Nenhum `props: any`
- [ ] Nenhum hex inline (`style={{ color: "#..." }}`)
- [ ] Nenhum botão sem handler
- [ ] Nenhum mock sem SourceBadge
- [ ] Nenhuma animação nova
- [ ] Nenhum `console.log`
- [ ] `routeTree.gen.ts` não foi editado manualmente
- [ ] Shell components não foram alterados

### Funcional
- [ ] Toda rota nova renderiza sem erro
- [ ] Todo CTA tem ação funcional
- [ ] Navegação entre rotas funciona
- [ ] Back button funciona onde aplicável
- [ ] Dados carregam sem erro

### Visual
- [ ] Dark mode verificado
- [ ] Mobile 375px verificado
- [ ] Estados loading/error/empty implementados
- [ ] `prefers-reduced-motion` testado

---

## Pontuação QA

Cada sprint recebe nota de 0-100% baseada nos checklists acima:

| Nota | Significado |
|---|---|
| 100% | PRONTO — merge sem ressalvas |
| 90-99% | PRONTO com notas — itens menores pendentes |
| 70-89% | NÃO PRONTO — correções necessárias |
| < 70% | BLOQUEADO — refatoração grande necessária |

---

## Relatório QA Template

```markdown
## QA Report — Sprint [N] — [DATA]

### Build
- bun run build: PASS/FAIL
- bun test: N pass, M fail
- bun eslint src/: N erros

### Checklist
- TypeScript: X/Y
- Build: X/Y
- Funcional: X/Y
- Visual: X/Y
- Code Review: X/Y

### Issues Encontrados
1. [Descrição] — [Severidade: P0/P1/P2] — [Status]

### Nota Final: XX%
### Veredito: PRONTO / NÃO PRONTO / BLOQUEADO
```
