---
id: shadcn-page-builder
name: shadcn Page Builder
description: Constrói rotas completas do TanStack Router com shadcn/ui + tokens KRATOS + loader pattern + Framer Motion — do zero ao production-ready.
tags: [shadcn, pages, routes, tanstack, ui, framer-motion]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P1
anthropic_principle: complete-output — entrega rota completa com todos os estados, não esqueleto
---

# SKILL: shadcn Page Builder

## Propósito
Construir rotas TanStack Router completas com shadcn/ui customizado com tokens KRATOS. Nunca entrega esqueleto — entrega tela production-ready.

## Quando Usar
- Nova rota em `src/routes/`
- Nova tela de domínio completa
- Migrar tela para padrão correto

## Inputs
- Nome da rota (ex: `/finalizar`, `/arena`)
- Dados necessários (descrição ou tipos)
- Composição desejada (seções, painéis)

## Processo

### Passo 1 — Estrutura de rota obrigatória
```tsx
// src/routes/<nome>.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/<nome>')({
  loader: async ({ context }) => {
    // dados no loader — NUNCA em useEffect
    const data = await fetchData()
    return { data }
  },
  component: <NomeView />,
})

function <NomeView>() {
  const { data } = Route.useLoaderData()
  // TanStack Query para refresh live
  const { data: live, isLoading, error } = useQuery({
    queryKey: ['<nome>'],
    queryFn: () => fetchLive(),
    initialData: data,
    refetchInterval: 10_000,
  })
  // ...
}
```

**CRÍTICO:** `routeTree.gen.ts` é gerado pelo Vite plugin. NUNCA editar manualmente.

### Passo 2 — shadcn/ui disponível em `src/components/ui/`
```
Layout:    Card, Separator, ScrollArea, ResizablePanels
Data:      Table, Badge, Progress, Avatar
Input:     Button, Input, Select, Checkbox, Switch
Feedback:  Alert, Skeleton, Sonner (toast)
Nav:       Tabs, DropdownMenu, NavigationMenu
Overlay:   Dialog, Sheet, Popover, Tooltip
Charts:    Recharts via shadcn chart
```

### Passo 3 — Customização com tokens KRATOS (não usar shadcn raw)
```tsx
// Card com glass effect KRATOS
<Card className="bg-[var(--kr-glass-bg)] border-[var(--kr-border-subtle)] backdrop-blur-sm">
  <CardHeader>
    <CardTitle className="text-[var(--kr-text-primary)] text-lg font-semibold">
      {title}
    </CardTitle>
    <CardDescription className="text-[var(--kr-text-muted)]">
      {description}
    </CardDescription>
  </CardHeader>
</Card>

// Badge de status com cor semântica
<Badge variant="outline" className="border-[var(--kr-color-risk)] text-[var(--kr-color-risk)]">
  Risco
</Badge>
```

### Passo 4 — Estados obrigatórios em toda tela
```tsx
if (isLoading) return (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-64 bg-[var(--kr-glass-bg)]" />
    <Skeleton className="h-48 w-full bg-[var(--kr-glass-bg)]" />
  </div>
)

if (error) return (
  <Alert variant="destructive" className="m-6">
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)

if (!data?.length) return (
  <EmptyState
    title="<título específico para este domínio>"
    description="<próxima ação para o usuário>"
  />
)
```

### Passo 5 — Entrada com Framer Motion
```tsx
import { motion } from 'framer-motion'

// Página entra com fade suave
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
  className="..."
>
  {/* conteúdo */}
</motion.div>
```

### Passo 6 — Layout HUD-first (não sidebar quadrada)
```tsx
// Padrão CORRETO para telas KRATOS — mundo-primeiro
<div className="flex flex-col h-full">
  {/* conteúdo principal ocupa o máximo */}
  <main className="flex-1 overflow-auto p-6">
    {/* painéis contextuais — entram quando necessários */}
  </main>
</div>

// PROIBIDO — sidebar quadrada fixa
// <div className="grid grid-cols-[240px_1fr_320px]">
```

### Passo 7 — Gate final
```bash
bun run build    # routeTree.gen.ts atualizado, zero erros
bun test         # stores não quebrados
# Visual: dark mode + mobile 375px
```

## Anti-patterns
- `useEffect` + `fetch()` para dados de rota (usar loader)
- Editar `routeTree.gen.ts` manualmente
- shadcn/ui sem customização de token = template genérico
- `process.env` no servidor (usar `c.env`)
- `grid-cols-[240px_1fr_320px]` — sidebar quadrada proibida

## Saída Esperada
Arquivo `.tsx` em `src/routes/`: loader, query, 3 estados, shadcn+tokens, Framer Motion, dark mode, mobile responsivo, build limpo.
