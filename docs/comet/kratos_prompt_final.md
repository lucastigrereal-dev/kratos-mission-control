# KRATOS Mission Control — Sessão de Finalização Completa
**Contexto:** Projeto `kratos-mission-control` | Stack: React 19 + TanStack Start + TanStack Router + Tailwind v4 + shadcn/ui + Hono + Bun

---

## IDENTIDADE DA SESSÃO

Você é o **KRATOS Build Agent** — engenheiro sênior responsável por levar o sistema de 95% para 100% de qualidade. Seu objetivo desta sessão é único e cirúrgico: **corrigir os 14 testes E2E falhando e preparar o sistema para deploy em produção**, sem quebrar nada que já funciona.

---

## ESTADO ATUAL DO SISTEMA (leia antes de qualquer coisa)

```
✅ 270 testes unitários: PASS
✅ 8 rotas implementadas com loader
✅ 59 componentes KRATOS + 47 shadcn/ui
✅ 11 hooks customizados (React Query)
✅ 10 schemas Zod (api-contract/)
✅ Build limpo: bun run build passa
⚠️  E2E: 32/46 passando — 14 falhando
⚠️  Deploy: aguardando IDs Cloudflare D1/KV
⚠️  Backend Python: aguardando servidor
```

---

## REGRAS ABSOLUTAS — NUNCA VIOLE

```
❌ NUNCA editar src/routeTree.gen.ts (gerado automaticamente)
❌ NUNCA alterar src/styles.css (design tokens protegidos)
❌ NUNCA alterar AppShell, Topbar, StatusBar, AuroraPanel sem autorização explícita
❌ Zero `any` em TypeScript novo
❌ Zero console.log em código novo
✅ bun run build deve passar limpo ANTES de qualquer commit
✅ bun run test deve manter 270 pass, 0 fail após cada mudança
✅ Sidebar pode ser alterada APENAS para o fix do collapse (BUG 3)
```

---

## FASE 0 — DIAGNÓSTICO (execute primeiro, não toque em código ainda)

Antes de alterar qualquer arquivo, execute este diagnóstico completo:

```bash
# 1. Confirmar estado dos testes unitários
bun run test 2>&1 | tail -5

# 2. Rodar E2E e capturar saída completa
bun run test:e2e 2>&1 | grep -E "(FAIL|PASS|Error|×|✓)" | head -60

# 3. Listar arquivos de teste E2E
ls tests/e2e/

# 4. Verificar os headings reais das 4 views problemáticas
grep -n "h1\|h2\|heading" src/routes/agora.tsx src/routes/agenda.tsx src/routes/contexto.tsx src/routes/sistema.tsx 2>/dev/null || \
grep -rn "Você está aqui\|Plano do dia\|Onde você está\|Saúde dos serviços" src/components/ src/routes/

# 5. Verificar o componente de lista de serviços em /agora
grep -rn "key=" src/components/kratos/agora/ 2>/dev/null | head -20

# 6. Ver o SourceBadgeIndicator atual
cat src/components/kratos/base/SourceBadgeIndicator.tsx 2>/dev/null || \
find src -name "SourceBadgeIndicator*" -exec cat {} \;
```

Leia os resultados. Só avance para a FASE 1 após entender o diagnóstico.

---

## FASE 1 — BUG 1: Duplicate React Keys (mais simples, comece aqui)

**Teste falhando:** `console error scan › /agora`
**Erro:** `Encountered two children with the same key` para OLLAMA, SUPABASE DB, REDIS, N8N

### Passo a passo:

```bash
# Encontrar o componente culpado
grep -rn "\.map(" src/components/kratos/agora/ | grep -v "node_modules"
grep -rn "key={service\|key={item\.name\|key={s\.name\|key={name" src/components/kratos/agora/
```

**Correção esperada:** Qualquer lugar que use o nome do serviço como `key` em uma lista `.map()`:

```tsx
// ❌ ERRADO — nome como key causa duplicata se aparecer mais de uma vez
{services.map((service) => (
  <ServiceItem key={service.name} {...service} />
))}

// ✅ CORRETO — usar index como fallback ou id único
{services.map((service, index) => (
  <ServiceItem key={`service-${service.name}-${index}`} {...service} />
))}

// ✅ MELHOR — se o objeto tiver id único
{services.map((service) => (
  <ServiceItem key={service.id ?? `service-${service.name}`} {...service} />
))}
```

**Verificação:**
```bash
bun run build && bun run test
```

---

## FASE 2 — BUG 4: Route Headings Mismatch

**Testes falhando:** route smoke para `/agora`, `/agenda`, `/contexto`, `/sistema`

### Passo a passo:

```bash
# Ler o arquivo de teste para ver os strings exatos esperados
cat tests/e2e/routes.smoke.spec.ts

# Ler cada view problemática
cat src/routes/agora.tsx 2>/dev/null || find src -name "agora*" -path "*/routes/*"
cat src/routes/agenda.tsx 2>/dev/null
cat src/routes/contexto.tsx 2>/dev/null  
cat src/routes/sistema.tsx 2>/dev/null

# Alternativa se as views usam componentes separados:
find src/components -name "AgoraView*" -o -name "AgendaView*" -o -name "ContextoView*" -o -name "SistemaView*" | xargs grep -n "h1\|h2\|heading"
```

**Headings EXATOS que os testes esperam (não altere os testes, altere os componentes):**

| Rota | Texto exato do heading |
|------|----------------------|
| `/agora` | `Você está aqui.` |
| `/agenda` | `Plano do dia, prazos e decisões` |
| `/contexto` | `Onde você está, onde se perdeu e como voltar.` |
| `/sistema` | `Saúde dos serviços e referência visual` |

**Correção:** Para cada view, verificar o `<h1>` ou `<h2>` principal e alinhar o texto. Importante:

```tsx
// ✅ CORRETO
<h1>Você está aqui.</h1>

// ❌ ERRADO — text-transform CSS pode exibir diferente mas string real é diferente
<h1 className="uppercase">você está aqui.</h1>
// Playwright lê o texto DOM, não o CSS

// ❌ ERRADO — ponto final faltando
<h1>Você está aqui</h1>
```

**Verificação:**
```bash
bun run build && bun run test
```

---

## FASE 3 — BUG 3: Sidebar Collapse — Texto não some

**Teste falhando:** `sidebar toggle collapses and expands`
**Erro:** `getByText('Operação')` ainda visível após colapso

### Passo a passo:

```bash
# Ler o teste para entender o que exatamente ele espera
cat tests/e2e/navigation.spec.ts

# Ler o Sidebar atual
cat src/components/kratos/shell/Sidebar.tsx
```

**Padrão de correção — quando `collapsed={true}`, os labels devem ser invisíveis ao Playwright:**

```tsx
// ❌ ERRADO — apenas visualmente escondido via CSS width, Playwright ainda encontra o texto
<span>{item.label}</span>

// ✅ CORRETO — usar aria-hidden ou hidden para que Playwright não encontre
<span 
  className={collapsed ? 'sr-only' : ''} 
  aria-hidden={collapsed}
>
  {item.label}
</span>

// ✅ ALTERNATIVA — renderização condicional (mais simples)
{!collapsed && <span>{item.label}</span>}
```

**Requisitos desta correção:**
1. Quando `collapsed=true`: texto some do DOM (invisível ao Playwright)
2. Ícone continua visível em ambos estados
3. Tooltip deve aparecer no hover quando colapsado (acessibilidade)
4. AppShell NÃO deve ser alterado — apenas o span/label interno do Sidebar

**Exemplo de tooltip acessível quando colapsado:**
```tsx
<Tooltip content={item.label} disabled={!collapsed}>
  <NavLink to={item.to}>
    <Icon name={item.icon} />
    <span aria-hidden={collapsed} className={collapsed ? 'sr-only' : ''}>
      {item.label}
    </span>
  </NavLink>
</Tooltip>
```

**Verificação:**
```bash
bun run build && bun run test
```

---

## FASE 4 — BUG 2: SourceBadgeIndicator — Seletor Incorreto

**Testes falhando:** `SourceBadgeIndicator is visible`, `sourcebadge.smoke` em `/`, `/contexto`, `/sistema`

### Passo a passo:

```bash
# Ler os testes para entender TODOS os seletores usados
cat tests/e2e/dashboard.spec.ts
cat tests/e2e/sourcebadge.smoke.spec.ts

# Ver o componente atual
find src -name "SourceBadgeIndicator*" | xargs cat
```

**O componente deve satisfazer AMBOS os seletores que os testes usam:**

```tsx
// ✅ CORRETO — componente com TODOS os atributos necessários
export function SourceBadgeIndicator({ source }: { source: DataSource }) {
  const labels: Record<DataSource, string> = {
    live: 'Ao vivo',
    mock: 'Simulado', 
    cache: 'Cache',
    partial: 'Parcial',
    stale: 'Desatualizado',
  }

  const label = labels[source]

  return (
    <span
      role="status"                          // ← testes buscam span[role='status']
      aria-label={`Fonte: ${label}`}         // ← testes buscam aria-label com 'Fonte:'
      title={`Fonte: ${label}`}              // ← testes buscam span[title*='Fonte:']
      data-source={source}                   // ← útil para E2E e CSS
    >
      {label}                                // ← testes buscam texto: Ao vivo|Simulado|Cache|Parcial|Desatualizado
    </span>
  )
}
```

**Verificação:**
```bash
bun run build && bun run test
```

---

## FASE 5 — BUG 5: States Smoke — Loading Timeout

**Testes falhando:** `/agora`, `/agenda`, `/sistema`, `/contexto` "settles into a final state"
**Causa:** Loading state pode ficar infinito sem backend real

### Passo a passo:

```bash
# Ler o teste de estados
cat tests/e2e/states.smoke.spec.ts

# Ver como os hooks lidam com loading
grep -rn "isLoading\|LoadingState\|loading" src/components/kratos/ | grep -v ".test." | head -20

# Ver se há fallback para mock data
grep -rn "mock\|fallback\|timeout" src/hooks/ | head -20
```

**Padrão de correção — garantir que loading state resolve mesmo sem backend:**

```tsx
// src/hooks/useApi.ts ou hooks específicos
export function useApiData<T>(path: string, mockFallback: T) {
  const { data, isLoading, error } = useQuery({
    queryKey: [path],
    queryFn: () => fetchData<T>(path),
    // ✅ Usar mock como placeholder imediato (sem flash de loading)
    placeholderData: mockFallback,
    // ✅ Se falhar, usar mock — não ficar em loading infinito
    retry: 1,
    retryDelay: 1000,
  })

  // ✅ Sempre retorna algo — nunca undefined com isLoading:true eterno
  return { data: data ?? mockFallback, isLoading: isLoading && !data, error }
}
```

**Alternativa — timeout no loading state do componente:**
```tsx
// No componente da view
const [showContent, setShowContent] = useState(false)

useEffect(() => {
  // Forçar conteúdo após 3s mesmo sem dados reais
  const timer = setTimeout(() => setShowContent(true), 3000)
  return () => clearTimeout(timer)
}, [])

if (isLoading && !showContent) return <LoadingState />
return <ConteudoReal data={data ?? mockData} />
```

**Verificação:**
```bash
bun run build && bun run test
```

---

## FASE 6 — SCREENSHOTS BASELINE (após todos os bugs corrigidos)

```bash
# Verificar quais testes de screenshot estão skipped
cat tests/e2e/screenshots.spec.ts 2>/dev/null || grep -rn "screenshot\|baseline\|toMatchSnapshot" tests/e2e/

# Iniciar servidor de desenvolvimento
bun run dev &
DEV_PID=$!
sleep 5

# Rodar apenas os testes de screenshot para gerar baselines
bun run test:e2e --grep "screenshot\|baseline\|snapshot" --update-snapshots

# Parar servidor
kill $DEV_PID
```

---

## FASE 7 — VERIFICAÇÃO FINAL (definition of done)

Execute na ordem exata:

```bash
# 1. Build limpo
echo "=== BUILD ===" && bun run build

# 2. Testes unitários (não pode regredir)
echo "=== UNIT TESTS ===" && bun run test

# 3. Testes E2E completos
echo "=== E2E TESTS ===" && bun run test:e2e 2>&1 | tail -20

# 4. Verificar zero any e zero console.log nos arquivos modificados
echo "=== CODE QUALITY ===" 
git diff --name-only | xargs grep -l "console\.log\|: any" 2>/dev/null && echo "⚠️ Encontrou console.log ou 'any'" || echo "✅ Código limpo"

# 5. Resumo de resultados
echo "=== RESUMO ===" && bun run test:e2e 2>&1 | grep -E "passed|failed|skipped"
```

**Critério de sucesso desta sessão:**
- [ ] `bun run build` — zero erros, zero warnings TypeScript
- [ ] `bun run test` — exatamente 270 pass, 0 fail (sem regressão)
- [ ] `bun run test:e2e` — ≥ 40/46 testes passando (de 32 → 40+)
- [ ] Zero `console.log` em código novo
- [ ] Zero `: any` em TypeScript novo
- [ ] AppShell, Topbar, StatusBar, AuroraPanel: não tocados
- [ ] `src/styles.css`: não tocado
- [ ] `src/routeTree.gen.ts`: não tocado

---

## FASE 8 — PREPARAÇÃO PARA DEPLOY (execute após os testes passarem)

### 8.1 — Cloudflare Workers (não faz deploy, apenas prepara)

```bash
# Ver configuração atual
cat wrangler.jsonc

# Listar variáveis de ambiente necessárias
grep -E "binding|database_id|namespace_id|var " wrangler.jsonc
```

**Criar arquivo de instruções para Lucas:**

```bash
cat > DEPLOY_INSTRUCTIONS.md << 'EOF'
# Instruções de Deploy — KRATOS Mission Control

## Pré-requisitos (Lucas precisa obter):
1. Account ID do Cloudflare Dashboard → Account Settings
2. D1 Database ID → criar com: `wrangler d1 create kratos-db`
3. KV Namespace ID → criar com: `wrangler kv namespace create KRATOS_KV`

## Após obter os IDs, editar wrangler.jsonc:
- Descomentar seção `d1_databases` e preencher `database_id`
- Descomentar seção `kv_namespaces` e preencher `id`

## Sequência de deploy:
1. `bun run build` — confirmar build limpo
2. `wrangler d1 migrations apply kratos-db --remote` — aplicar migrations
3. `wrangler deploy` — fazer deploy (requer confirmação do Lucas)

## Variáveis de ambiente necessárias no Cloudflare Dashboard:
- META_APP_ID
- META_APP_SECRET  
- NOTION_TOKEN
EOF
```

### 8.2 — Backend Python (documentar, não deployar)

```bash
# Ver estrutura do backend
ls backend/
cat backend/requirements.txt 2>/dev/null || cat backend/pyproject.toml 2>/dev/null

# Verificar como o Hono faz proxy para o backend
grep -n "proxy\|backend\|/api" src/server.ts | head -20
```

---

## SEQUÊNCIA FINAL RECOMENDADA

```
FASE 0 → Diagnóstico (leia, não mexa)
FASE 1 → BUG 1: Duplicate keys (5 min)
FASE 2 → BUG 4: Headings mismatch (10 min)
FASE 3 → BUG 3: Sidebar collapse (15 min)
FASE 4 → BUG 2: SourceBadge atributos (10 min)
FASE 5 → BUG 5: States timeout (15 min)
FASE 6 → Screenshots baseline (5 min)
FASE 7 → Verificação final (obrigatório)
FASE 8 → Preparação deploy (opcional nesta sessão)
```

**Tempo estimado:** 60-90 minutos de sessão focada.

**Após cada FASE:** rodar `bun run build && bun run test` antes de avançar.

---

*KRATOS Build Agent — Sessão de Finalização | 2026-05-18*
