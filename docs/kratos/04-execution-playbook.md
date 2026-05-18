# KRATOS Execution Playbook — Checklist + Sprint Order + Prompt

> **Para Manus/Kimi:** Este é o checklist operacional. Siga a ordem. Não pule etapas.

---

## 1. Definition of Done (antes de qualquer commit)

### TypeScript
- [ ] `bun run lint` — sem erros **novos**
- [ ] Zero `any` no código novo
- [ ] Todas as props com `interface` definida
- [ ] Named exports (nunca `export default`)

### Build
- [ ] `bun run build` — **zero erros** (client + SSR)
- [ ] Sem regressão de bundle size > 10%

### Funcional
- [ ] Componente renderiza sem erro no dev (`bun run dev`)
- [ ] Loader retorna dados corretos (se rota)
- [ ] Schemas Zod validando entrada (se API)
- [ ] Todo botão/CTA tem handler funcional — **nenhum botão decorativo**

### Visual
- [ ] Dark mode verificado
- [ ] Mobile 375px sem quebra de layout
- [ ] Nenhum `style={{ color: "#..." }}` — usar tokens `var(--kr-*)`
- [ ] `prefers-reduced-motion` testado
- [ ] Loading, Empty, Error states implementados
- [ ] Console do navegador sem erros

### Final
- [ ] Nenhum `console.log` no código final
- [ ] Commit com mensagem seguindo convenção

---

## 2. Ordem dos Sprints (histórico e futuro)

### ✅ DONE — Sprint P1-P4 (2026-05-18)
- Mission Lens governa o cockpit
- Checkpoint save/restore
- SourceBadge em 6+ componentes
- Aurora comandos reais (/retomar, /salvar, /foco)
- Drift detection visual
- Timestamps reais
- Teste dos 10 segundos: 6/6

### 🔜 PRÓXIMO — P6 QA Visual Aprofundado
- Screenshot baseline real
- Mobile 375px verificação
- Contraste e acessibilidade
- Anti-carnaval: remover excessos visuais

### 🔒 BLOCKED — P5 OMNIS Gate
- Backend OMNIS inexistente
- Contrato documentado em `docs/KRATOS_P5_OMNIS_GATE_DECISION.md`

### 🔒 BLOCKED — P7 Akasha Real
- Backend pgvector não integrado
- Placeholder honesto documentado

---

## 3. Comandos Essenciais

```bash
# Desenvolvimento
bun run dev                    # Inicia dev server (procura porta livre)

# Build (OBRIGATÓRIO ANTES DE COMMIT)
bun run build                  # client + SSR, zero erros

# Testes
bun test                       # 270 pass esperado

# Lint
bun eslint src/                # zero erros NOVOS

# Git
git status --short             # ver working tree
git log --oneline -5           # ver commits recentes
```

---

## 4. Como Adicionar uma Nova Rota

```
1. Criar src/routes/minha-rota.tsx:
   export const Route = createFileRoute('/minha-rota')({
     component: MinhaRotaPage,
   })
   function MinhaRotaPage() {
     return <MinhaView />
   }

2. Criar src/components/kratos/views/MinhaView.tsx:
   interface MinhaViewProps { ... }
   export function MinhaView({ ... }: MinhaViewProps) { ... }

3. routeTree.gen.ts é REGENERADO AUTOMATICAMENTE pelo Vite
   (NUNCA editar manualmente)

4. Adicionar rota em src/lib/kratos-routes.ts (VISIBLE_ROUTES)
   se quiser que apareça na sidebar

5. bun run build → verificar zero erros
```

---

## 5. Como Adicionar uma Nova Tela de Ilha

```
1. Criar src/components/kratos/islands/NovaIlhaScreen.tsx
   Seguir template do 02-visual-system.md seção 6

2. Adicionar ao barrel src/components/kratos/islands/index.ts

3. Registrar em src/routes/ilhas.$islandId.tsx:
   import { NovaIlhaScreen } from "..."
   const ISLAND_SCREENS: Record<string, React.LazyExoticComponent<...>> = {
     ...
     "nova-ilha": lazy(() => import("...").then(m => ({ default: m.NovaIlhaScreen }))),
   }

4. Adicionar ilha ao KratosWorldMap se necessário:
   Em src/components/kratos/world/KratosWorldMap.tsx

5. bun run build → verificar zero erros
```

---

## 6. Prompt Operacional para Manus/Kimi

```
Você está trabalhando no KRATOS Mission Control, um cockpit React 19 + TanStack Start.
Leia docs/kratos/01-master-context.md antes de começar.

Regras absolutas:
1. NÃO criar app novo, NÃO reescrever projeto, NÃO trocar stack
2. Sempre usar tokens CSS var(--kr-*), nunca hex inline
3. Sempre usar componentes de ui-primitives/ (GlassPanel, KratosCard, etc.)
4. NUNCA editar src/routeTree.gen.ts (é auto-gerado)
5. NUNCA editar componentes protegidos (shell/, tokens CSS)
6. Toda tela com dados precisa de Loading, Empty, Error states
7. Todo botão precisa de handler funcional — nada decorativo
8. Zero console.log no código final
9. Zero any no TypeScript
10. bun run build deve passar LIMPO antes de commit

Antes de começar:
- Leia api-contract/ relevante
- Verifique se já existe componente similar em src/components/kratos/
- Use os hooks existentes em src/hooks/

Depois de terminar:
- bun run build (zero erros)
- bun test (sem regressões)
- bun eslint src/ (sem erros novos)
```

---

## 7. Checklist de Verificação Pré-Commit

```bash
# 1. Build limpo
bun run build

# 2. Testes sem regressão
bun test

# 3. Lint sem erros novos
bun eslint src/

# 4. Working tree organizado
git status --short

# 5. Dif review (sem debug, sem console.log, sem hex inline)
git diff --stat
git diff | grep -E "console\.(log|warn)|style.*#"

# 6. Commit
git add <arquivos relevantes>
git commit -m "feat|fix|chore|docs(kratos): mensagem curta"
```

---

## 8. Neuro-UX (TDAH-first)

O operador tem TDAH. Cada elemento compete por atenção limitada.

- **Máximo 7±2 elementos de decisão** visíveis por tela
- **1 ação primária** — a mais proeminente visualmente
- **Posições fixas** — componentes não reordenam sozinhos
- **Zero popups** sem trigger explícito
- **Notificações**: apenas no right rail, nunca no centro
- **Cores vibrantes**: só para alertas críticos
- **Animações**: sem loops infinitos, máximo 2 simultâneas, duração ≤ 0.6s
- **Tom da UI**: operacional, focado, sem frescura
- **Referência**: Linear + Vercel Dashboard
- **Retomada sem vergonha**: checkpoint 1-clique, sem fricção

---

## 9. Erros Comuns a Evitar

| Erro | Por que |
|---|---|
| Criar componente novo em vez de reusar | Já existe GlassPanel, KratosCard, etc. em ui-primitives/ |
| Usar hex inline em vez de token | `var(--kr-text-primary)` não `#E5E7EB` |
| `export default` | Usar named exports |
| `useEffect + fetch()` | Usar `useApi<T>()` ou TanStack Query |
| Adicionar animação nova | Já temos float, pulse-glow, cloud-drift, spin-slow |
| Criar card/panel próprio | Usar KratosCard ou GlassPanel |
| Esquecer estados loading/empty/error | Toda tela com dados precisa dos 3 |
| `console.log` no commit | Remover antes de commitar |
| Editar routeTree.gen.ts | É auto-gerado pelo Vite |
| Botão sem handler | Nada decorativo |
| Mock parecendo real | Usar SourceBadge |
| Cores vibrantes em elemento não-crítico | Só alertas usam vermelho/laranja |

---

## 10. Convenção de Commits

```
feat(kratos): nova funcionalidade
fix(kratos): correção de bug
chore(kratos): manutenção, docs, relatórios
refactor(kratos): refatoração sem mudança de comportamento
docs(kratos): documentação

Formato: <tipo>(kratos): <mensagem curta em português ou inglês>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```
