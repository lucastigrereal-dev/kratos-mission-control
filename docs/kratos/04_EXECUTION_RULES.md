# KRATOS Execution Rules — 10 Regras Inegociáveis + Stack + Sprint Order

> **Para MANUS:** Estas são as regras absolutas. Violar qualquer uma = rejeição do PR.

---

## 1. As 10 Regras Inegociáveis

### REGRA #0 — Route Tree é Auto-Gerado
`src/routeTree.gen.ts` é gerado automaticamente pelo plugin Vite do TanStack Router. **NUNCA editar manualmente.** Se precisar de uma rota nova, crie o arquivo em `src/routes/` e o Vite regenera sozinho.

### REGRA #1 — Build Gate Obrigatório
`bun run build` deve passar LIMPO (zero erros) antes de qualquer commit. Client + SSR. Sem exceções.

### REGRA #2 — Tokens CSS, Nunca Hex Inline
```tsx
// CERTO
style={{ color: "var(--kr-text-primary)" }}

// ERRADO — rejeitado
style={{ color: "#E5E7EB" }}
```

### REGRA #3 — Named Exports, Nunca Default
```tsx
// CERTO
export function MeuComponente() {}

// ERRADO
export default function MeuComponente() {}
```

### REGRA #4 — Zero `any` no TypeScript
Toda prop precisa de `interface` definida. Todo hook precisa de tipo de retorno.

### REGRA #5 — useApi() ou TanStack Query, Nunca fetch() Raw
```tsx
// CERTO
const { data } = useApi<MeuTipo>("/api/endpoint");

// ERRADO
useEffect(() => { fetch("/api/endpoint").then(...) }, []);
```

### REGRA #6 — Estados Obrigatórios em Toda Tela com Dados
Loading → Error → Empty → Dados. Nesta ordem. Sempre.
```tsx
if (isLoading) return <LoadingState lines={5} />;
if (error) return <ErrorState title="..." onRetry={refetch} />;
if (isEmpty) return <EmptyState title="..." />;
return <ConteudoReal />;
```

### REGRA #7 — Todo Botão Tem Handler Funcional
Nada de botão decorativo. Se tem CTA, tem ação. Se é placeholder, usa `SourceBadgeIndicator`.

### REGRA #8 — NUNCA criar animação nova
Já existem 12 keyframe animations. Use as existentes. Criar nova = rejeitado.

### REGRA #9 — NUNCA mock parecendo dado real
Usar `SourceBadgeIndicator` com `sourceType` explícito: `"live"`, `"cache"`, `"mock"`, `"error"`.

### REGRA #10 — Console Limpo
Zero `console.log` no código commitado. Zero erro no console do navegador.

---

## 2. Stack Obrigatória (NUNCA mudar)

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19 |
| Meta-framework | TanStack Start | latest |
| Router | TanStack Router | file-based |
| Data fetching | TanStack Query | latest |
| Estilo | Tailwind CSS | v4 |
| UI base | Radix UI + shadcn/ui | 47 componentes |
| Validação | Zod | latest |
| Bundler | Vite | 7 |
| Runtime | Bun | latest |
| Deploy | Cloudflare Workers | wrangler.jsonc |
| Ícones | lucide-react | latest |
| Testes | bun test | 270 pass |

### O que NUNCA adicionar
- Three.js / WebGL / 3D pesado
- Redux / Zustand / stores globais
- CSS-in-JS (styled-components, emotion)
- Outra biblioteca de componentes (MUI, Chakra, Ant)
- Animações novas (já temos 12)
- Fetch raw com useEffect

---

## 3. O que NUNCA Tocar

### Arquivos Protegidos (🔒)
- `src/components/kratos/shell/AppShell.tsx`
- `src/components/kratos/shell/Topbar.tsx`
- `src/components/kratos/shell/Sidebar.tsx`
- `src/components/kratos/shell/StatusBar.tsx`
- `src/components/kratos/shell/AuroraPanel.tsx`
- `src/styles.css`
- `src/styles/kratos-tokens.css`
- `src/routeTree.gen.ts` (auto-gerado)
- `backend/app/main.py`

### O que NUNCA Fazer
- Criar app novo
- Reescrever o projeto
- Trocar a stack
- Adicionar Three.js/WebGL
- Fazer deploy (`wrangler deploy`) — requer autorização explícita
- Deixar Aurora fingir execução
- Liberar OMNIS/HOMINIS sem gate humano
- Mascarar falha de teste

---

## 4. Ordem dos Sprints

### ✅ DONE — Sprint P1-P4 (2026-05-18)
- Mission Lens governa o cockpit
- Checkpoint save/restore
- SourceBadge em 6+ componentes
- Aurora comandos reais (/retomar, /salvar, /foco)
- Drift detection visual
- Timestamps reais
- Build limpo, 270 testes pass

### 🔜 PRÓXIMO — P6 QA Visual Aprofundado
- Screenshot baseline real
- Mobile 375px verificação completa
- Contraste e acessibilidade (WCAG AA)
- Anti-carnaval: remover excessos visuais
- Verificar todos os 12 keyframes

### 🔒 BLOCKED — P5 OMNIS Gate
- Backend OMNIS inexistente
- Contrato documentado, placeholder honesto

### 🔒 BLOCKED — P7 Akasha Real
- Backend pgvector não integrado
- Placeholder honesto documentado

---

## 5. Como Adicionar uma Rota Nova

```
1. Criar src/routes/minha-rota.tsx:
   export const Route = createFileRoute('/minha-rota')({
     component: MinhaRotaPage,
   })
   function MinhaRotaPage() {
     return <MinhaView />
   }

2. Criar view em src/components/kratos/views/MinhaView.tsx
   - interface MinhaViewProps { ... }
   - export function MinhaView({ ... }: MinhaViewProps) { ... }

3. routeTree.gen.ts é REGENERADO AUTOMATICAMENTE
   (NUNCA editar manualmente)

4. Adicionar em src/lib/kratos-routes.ts (VISIBLE_ROUTES)
   se quiser que apareça na sidebar

5. bun run build → verificar zero erros
```

---

## 6. Como Adicionar uma Ilha Nova

```
1. Criar src/components/kratos/islands/NovaIlhaScreen.tsx
   Usar template do IslandPageFrame + IslandPageHeader
   Seguir 02_VISUALBIBLE.md para tokens e cores

2. Adicionar ao barrel src/components/kratos/islands/index.ts

3. Registrar em src/routes/ilhas.$islandId.tsx:
   const ISLAND_SCREENS = {
     ...
     "nova-ilha": lazy(() => import("...").then(m => ({ default: m.NovaIlhaScreen }))),
   }

4. Adicionar ilha ao KratosWorldMap:
   Em src/components/kratos/world/KratosWorldMap.tsx

5. bun run build → verificar zero erros
```

---

## 7. Relatório Obrigatório Pós-Tarefa

Toda tarefa concluída deve reportar:

```
- O que foi feito (1 linha)
- Arquivos modificados (lista)
- bun run build: PASS/FAIL
- bun test: N pass, M fail
- bun eslint src/: N erros (novos/pré-existentes)
- Screenshot ou descrição do estado visual
```

---

## 8. Commits

```
Formato: <tipo>(kratos): <mensagem curta>

Tipos: feat | fix | chore | refactor | docs

Exemplos:
feat(kratos): adiciona tela de checkpoint
fix(kratos): corrige hydration error no world page
chore(kratos): atualiza documentação de tokens
refactor(kratos): extrai hook useMissionLens
docs(kratos): adiciona spec da tela de agenda
```

---

## 9. Comandos Essenciais

```bash
bun run dev           # Dev server (procura porta livre)
bun run build         # Build client + SSR (OBRIGATÓRIO pré-commit)
bun test              # 270 pass esperado
bun eslint src/       # Zero erros NOVOS
git status --short    # Ver working tree
git log --oneline -5  # Commits recentes
```
