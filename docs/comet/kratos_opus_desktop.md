# KRATOS Mission Control — Entrega Final de Código

Você é um engenheiro sênior React/TypeScript. Vou te dar o contexto completo de um projeto e você vai **escrever o código completo de cada arquivo que precisa ser corrigido ou criado**, pronto para eu copiar e colar.

**NÃO me dê instruções. NÃO me diga o que fazer. ESCREVA O CÓDIGO COMPLETO de cada arquivo.**

---

## CONTEXTO DO PROJETO

**Stack:** React 19 + TanStack Start + TanStack Router (file-based) + Tailwind v4 + shadcn/ui + Hono + Bun + Playwright (E2E) + Vitest (unit)

**Estado atual:**
- 270 testes unitários: ✅ PASS
- Build: ✅ limpo
- E2E: ⚠️ 32/46 passando — 14 falhando
- Componentes: 59 KRATOS + 47 shadcn/ui prontos
- 8 rotas implementadas
- 11 hooks (React Query)
- 10 schemas Zod

**REGRAS QUE VOCÊ DEVE RESPEITAR NO CÓDIGO:**
- Zero `any` em TypeScript
- Zero `console.log`
- NUNCA alterar `src/styles.css`
- NUNCA alterar `src/routeTree.gen.ts`
- NUNCA alterar AppShell, Topbar, StatusBar, AuroraPanel

---

## OS 5 BUGS A CORRIGIR — CÓDIGO COMPLETO DE CADA ARQUIVO

---

### BUG 1 — Duplicate React Keys em /agora

**Arquivo:** `src/components/kratos/agora/SystemPulseStrip.tsx`

**Problema:** A lista de serviços usa o nome do serviço como `key`, causando duplicatas quando OLLAMA, SUPABASE DB, REDIS, N8N aparecem mais de uma vez.

**Escreva o arquivo completo corrigido.** O componente exibe uma lista de serviços/pulsos do sistema na rota `/agora`. Use `key={`service-${item.name}-${index}`}` em qualquer `.map()`. O componente deve:
- Receber prop `services` tipada (array de objetos com pelo menos `name: string` e `status: string`)
- Renderizar cada serviço com badge de status
- Usar design tokens do projeto (classes Tailwind v4)
- Ter variante de status: `online` (verde), `offline` (vermelho), `degraded` (amarelo), `unknown` (cinza)

---

### BUG 2 — SourceBadgeIndicator atributos HTML errados

**Arquivo:** `src/components/kratos/base/SourceBadgeIndicator.tsx`

**Problema:** Os testes E2E buscam:
1. `span[role='status']` com texto `Ao vivo|Simulado|Cache|Parcial|Desatualizado`
2. `span[title*='Fonte:']` (dashboard.spec.ts)
3. `aria-label` contendo `"Fonte:"`

**Escreva o arquivo completo.** O componente deve:

```typescript
// Tipos aceitos:
type DataSource = 'live' | 'mock' | 'cache' | 'partial' | 'stale'

// Mapeamento de labels em português:
// live → 'Ao vivo'
// mock → 'Simulado'
// cache → 'Cache'
// partial → 'Parcial'
// stale → 'Desatualizado'
```

O `<span>` final deve ter TODOS estes atributos simultaneamente:
- `role="status"`
- `aria-label={`Fonte: ${label}`}`
- `title={`Fonte: ${label}`}`
- `data-source={source}`
- Texto visível com o label em português
- Classes visuais por tipo (cores diferentes por fonte)

---

### BUG 3 — Sidebar collapse não esconde texto

**Arquivo:** `src/components/kratos/shell/Sidebar.tsx`

**Problema:** Quando o sidebar colapsa, o texto dos itens de navegação continua visível ao Playwright. O teste busca `getByText('Operação')` e espera que NÃO seja encontrado após o clique no toggle.

**Escreva o arquivo completo.** O componente deve:
- Receber prop `collapsed: boolean`
- Quando `collapsed=true`: labels devem ter `aria-hidden={true}` E classe `sr-only` (ou `hidden`)
- Quando `collapsed=false`: labels visíveis normalmente
- Ícone de cada item: sempre visível em ambos estados
- Tooltip com o label deve aparecer no hover quando colapsado
- Items de navegação: `Início`, `Agora`, `Agenda`, `Checkpoints`, `Projetos`, `Contexto`, `Sistema`, `Operação`
- Cada item com ícone (use Lucide icons) + label + link para a rota correspondente
- Botão toggle visível para expandir/colapsar
- Não alterar nada fora do Sidebar (AppShell não é tocado)

**Rotas dos itens:**
```
Início → /
Agora → /agora
Agenda → /agenda
Checkpoints → /checkpoints
Projetos → /projetos
Contexto → /contexto
Sistema → /sistema
Operação → /operacao
```

---

### BUG 4 — Headings das Views divergem dos testes

Os testes `routes.smoke.spec.ts` e `states.smoke.spec.ts` buscam estes headings **exatos** via `role="heading"`:

| Rota | Heading exato |
|------|--------------|
| `/agora` | `Você está aqui.` |
| `/agenda` | `Plano do dia, prazos e decisões` |
| `/contexto` | `Onde você está, onde se perdeu e como voltar.` |
| `/sistema` | `Saúde dos serviços e referência visual` |

**Escreva os 4 arquivos completos abaixo.** Cada view deve:
- Ter um `<h1>` com o texto exato acima (sem text-transform CSS que mude o case)
- Ter `role="heading"` implícito (por ser um `<h1>`)
- Mostrar conteúdo relevante (pode ser mock/placeholder rico)
- Não entrar em loading infinito — se não houver dados, mostrar mock data
- Usar classes Tailwind v4 e design tokens do projeto

**Arquivo:** `src/components/kratos/agora/AgoraView.tsx`
- Heading: `Você está aqui.`
- Conteúdo: painel de estado atual do usuário, SystemPulseStrip, lista de foco atual
- Deve importar e usar o `SystemPulseStrip` corrigido (BUG 1)
- Mock data interno para quando não há dados do backend

**Arquivo:** `src/components/kratos/agenda/AgendaView.tsx`
- Heading: `Plano do dia, prazos e decisões`
- Conteúdo: lista de tarefas do dia, prazos, decisões pendentes
- Mock data com pelo menos 3 itens de agenda realistas

**Arquivo:** `src/components/kratos/contexto/ContextoView.tsx`
- Heading: `Onde você está, onde se perdeu e como voltar.`
- Conteúdo: contexto atual, último ponto de checkpoint, trilha de retorno
- Mock data com contexto de projeto

**Arquivo:** `src/components/kratos/sistema/SistemaView.tsx`
- Heading: `Saúde dos serviços e referência visual`
- Conteúdo: lista de serviços com status, métricas, design tokens visuais
- Deve usar o `SourceBadgeIndicator` corrigido (BUG 2)
- Mock data com serviços: OLLAMA, SUPABASE DB, REDIS, N8N, BACKEND API

---

### BUG 5 — States smoke timeout (loading infinito)

**Arquivo:** `src/hooks/useSystemData.ts` (ou o hook principal de dados)

**Problema:** As views entram em loading state e nunca resolvem sem backend ativo.

**Escreva o arquivo completo.** O hook deve:
- Usar React Query (`useQuery` do `@tanstack/react-query`)
- Ter `placeholderData` com mock data (nunca retornar `undefined` com `isLoading: true` por mais de 3s)
- Em caso de erro/timeout, usar os dados mock como fallback transparente
- Exportar tipos TypeScript de todos os dados
- Configuração: `retry: 1`, `retryDelay: 1000`, `staleTime: 30000`

**Também escreva:** `src/hooks/useMockFallback.ts` — hook utilitário que qualquer view pode usar para garantir que tem dados:

```typescript
// Comportamento esperado:
// 1. Tenta buscar dados reais por até 3s
// 2. Se não resolver, usa mock automaticamente
// 3. Nunca fica em loading > 3s
// 4. Não mostra erro pro usuário, silenciosamente usa mock
```

---

## ENTREGA ESPERADA

Para cada bug acima, quero:

```
### [Nome do arquivo]
**Caminho:** `src/caminho/para/Arquivo.tsx`
**Motivo da mudança:** [1 linha explicando]

\`\`\`tsx
// CÓDIGO COMPLETO AQUI
// Sem omissões, sem "// ... resto do código"
// Pronto para copiar e colar
\`\`\`
```

**IMPORTANTE:**
- Escreva o código completo de CADA arquivo — sem `// ... resto`, sem `// adicione aqui`
- Todo TypeScript com tipagem correta, zero `any`
- Todos os imports necessários incluídos
- Código que funciona no contexto descrito (React 19, TanStack Router, Tailwind v4, Lucide React, @tanstack/react-query)
- Para os imports de componentes internos, use caminhos relativos baseados na estrutura `src/components/kratos/`

Comece pelo BUG 1 (SystemPulseStrip) e entregue todos na sequência.
