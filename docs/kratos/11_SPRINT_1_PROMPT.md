# KRATOS — Sprint 1 Prompt (HUD Base)

> Este é o prompt completo para enviar à Manus para executar o Sprint 1.
> Copie e cole integralmente. Não resuma nem reescreva.

---

## CONTEXTO DO PROJETO

Você está implementando o **KRATOS** — um sistema de gamificação pessoal de alta fidelidade visual. Não é um dashboard SaaS genérico. É um centro de comando militar-orgânico com identidade visual forte.

Você recebeu 6 arquivos de especificação. Leia todos antes de escrever qualquer linha de código:
- `VISUALBIBLE.md` — lei visual absoluta
- `DESIGN_TOKENS.json` — tokens de design em JSON e Tailwind
- `ARCHITECTURE.md` — estrutura de arquivos, stack, convenções
- `ACCEPTANCE-CHECKLIST.md` — critérios de aceite por sprint
- `SCREEN_SPECS.md` — specs detalhadas de cada tela
- `SPRINT-1-PROMPT.md` — este arquivo (instrução de execução)

---

## REGRAS INEGOCIÁVEIS ANTES DE COMEÇAR

1. **NÃO altere** nenhum arquivo em `lib/supabase/`, hooks de auth, endpoints de API ou arquivos SSE
2. **NÃO instale** nenhuma dependência sem listar e aguardar aprovação
3. **NÃO use** cores hardcoded — somente tokens CSS `--kratos-*`
4. **NÃO use** TypeScript `any` — sempre `unknown` + type guards
5. **NÃO crie** arquivos fora da estrutura definida em `ARCHITECTURE.md`
6. Stack é **imutável**: Next.js 14 App Router + TypeScript strict + Tailwind + Radix UI + Lucide + Zustand + TanStack Query + Framer Motion

---

## OBJETIVO DO SPRINT 1

Implementar o **HUD Base** — a estrutura visual da aplicação que envolve todo o conteúdo. Ao final do Sprint 1, a aplicação deve ter o AppShell completo funcionando com navegação, sem conteúdo real nas páginas internas (use skeletons/placeholders).

---

## ENTREGÁVEIS DO SPRINT 1

### 1. `styles/kratos-tokens.css`

Criar arquivo com todos os tokens CSS do KRATOS conforme `DESIGN_TOKENS.json`:

```css
:root {
  /* Superfícies */
  --kratos-bg: #0a0a0f;
  --kratos-surface: #111118;
  --kratos-surface-2: #17171f;
  --kratos-surface-3: #1e1e28;
  --kratos-glass: rgba(17,17,24,0.72);
  --kratos-border: rgba(255,255,255,0.06);
  --kratos-divider: rgba(255,255,255,0.04);

  /* Primário */
  --kratos-primary: #7c3aed;
  --kratos-primary-glow: rgba(124,58,237,0.20);
  --kratos-primary-muted: rgba(124,58,237,0.12);
  --kratos-primary-hover: #6d28d9;

  /* Status */
  --kratos-success: #10b981;
  --kratos-warning: #f59e0b;
  --kratos-danger: #ef4444;
  --kratos-info: #3b82f6;
  --kratos-ghost: rgba(255,255,255,0.35);

  /* Aurora */
  --kratos-aurora-a: #7c3aed;
  --kratos-aurora-b: #0ea5e9;
  --kratos-aurora-c: #10b981;

  /* Tipografia */
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Espaçamento */
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --radius-xl: 24px; --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.30);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.40);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.50);
  --shadow-glow-primary: 0 0 20px rgba(124,58,237,0.25);

  /* Motion */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 120ms;
  --duration-normal: 220ms;
  --duration-slow: 380ms;
}
```

### 2. `components/shell/AppShell.tsx`

Layout raiz com:
- `TopBar` (64px, sticky top, glassmorphism)
- `Sidebar` (220px, sticky, colapsável)
- Main content area (flex: 1, único elemento com overflow-y: auto)
- `RightRail` (280px, colapsável)
- `BottomDock` (60px, sticky bottom)

**Regras de layout:**
```tsx
// Estrutura obrigatória
<div className="h-screen flex flex-col overflow-hidden" style={{background: 'var(--kratos-bg)'}}>
  <TopBar />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
    <RightRail />
  </div>
  <BottomDock />
</div>
```

### 3. `components/shell/TopBar.tsx`

Implementar com:
- Logo KRATOS em SVG inline (não imagem)
- XP atual + barra de progresso de nível (`tabular-nums`)
- Level badge (ex: "Nv. 12")
- Streak counter com ícone Lucide `Flame`
- Avatar do usuário (Radix UI DropdownMenu)
- Glassmorphism: `background: var(--kratos-glass)`, `backdrop-filter: blur(20px) saturate(1.4)`

### 4. `components/shell/Sidebar.tsx`

Implementar com:
- 5 itens de navegação usando `next/navigation` `usePathname`
- Ícones Lucide: `LayoutDashboard`, `Swords`, `Map`, `Trophy`, `User`
- Item ativo: background `var(--kratos-primary-muted)`, left border `var(--kratos-primary)` 2px
- Tooltip ao colapsar (Radix UI Tooltip)
- Animação de colapso: Framer Motion `animate={{ width: collapsed ? 64 : 220 }}`
- Transição: `--duration-normal` com `--ease-spring`

### 5. `components/shell/BottomDock.tsx`

Implementar com:
- Área de missão ativa resumida (nome + progresso)
- Botão de ação principal ("Ver Missão")
- Glassmorphism + border-top `var(--kratos-border)`
- Sempre visível (não some em scroll)

### 6. `components/shell/RightRail.tsx`

Implementar com:
- Painel colapsável (280px ↔ 0)
- Framer Motion `animate={{ width: collapsed ? 0 : 280 }}`
- Overflow hidden quando colapsado
- Conteúdo placeholder para Sprint 1 (skeleton de 3 cards)
- Botão de toggle

### 7. `components/ui/GlassCard.tsx`

Componente base reutilizável:
```tsx
interface GlassCardProps {
  variant?: 'default' | 'elevated' | 'critical';
  className?: string;
  children: React.ReactNode;
}
```

Aplicar estilos exatos do VISUALBIBLE.md seção 4.

### 8. `components/ui/Skeleton.tsx`

Componente de skeleton com shimmer conforme VISUALBIBLE.md seção 10.

### 9. `components/hud/AuroraBackground.tsx`

Background animado com 2 blobs:
- `position: fixed`, `z-index: 0`, `pointer-events: none`
- `opacity: 0.10`, `filter: blur(80px)`
- Framer Motion com `animation-duration: 8000ms`
- Para com `prefers-reduced-motion`

### 10. Atualizar `app/dashboard/layout.tsx`

Usar `AppShell` como wrapper das rotas de dashboard.

---

## CRITÉRIOS DE ACEITE DO SPRINT 1

Antes de entregar, verificar TODOS estes itens:

- [ ] Layout não tem scroll horizontal em nenhum breakpoint
- [ ] Apenas o Main Content Area rola (TopBar, Sidebar, BottomDock são fixos)
- [ ] TopBar com glassmorphism visível e funcional
- [ ] Sidebar colapsa e expande com animação suave
- [ ] Sidebar item ativo destacado corretamente
- [ ] BottomDock sempre visível
- [ ] RightRail colapsa sem bug visual
- [ ] Zero erros TypeScript (`tsc --noEmit`)
- [ ] Zero cores hardcoded (apenas tokens)
- [ ] `prefers-reduced-motion` para todas as animações
- [ ] Funciona em 375px (mobile)

---

## FORMATO DO RELATÓRIO DE ENTREGA

Ao finalizar, entregue obrigatoriamente:

```markdown
## Sprint 1 — Relatório de Entrega

### Arquivos criados/modificados
- [lista]

### Decisões tomadas
- [lista com justificativa]

### Desvios do spec
- [lista ou "Nenhum"]

### Dependências instaladas
- [lista ou "Nenhuma"]

### Pontos de atenção para Sprint 2
- [lista]

### Checklist: [N/10 itens aprovados]
```

---

## IMPORTANTE — O QUE NÃO FAZER

❌ Não criar páginas com conteúdo real (Sprint 1 = estrutura apenas)
❌ Não integrar dados reais do Supabase no Sprint 1
❌ Não implementar lógica de negócio (XP real, missões reais)
❌ Não modificar arquivos de auth ou Supabase client
❌ Não usar gradientes em botões
❌ Não adicionar `colored side-borders` em cards
❌ Não usar emoji como elemento de design
❌ Não criar arquivos fora da estrutura de `ARCHITECTURE.md`
