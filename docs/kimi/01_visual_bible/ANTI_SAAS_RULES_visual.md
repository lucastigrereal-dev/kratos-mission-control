# ANTI-SAAS RULES — KRATOS Mission Control

## Regras de quem o KRATOS NUNCA deve parecer

---

### ❌ NUNCA FAZER

**Visual:**
- Fundo branco ou cinza claro
- Cards sem glassmorphism em fundo escuro
- Sidebar plana sem profundidade
- Headers com gradiente roxo-para-rosa estilo startup
- Tabelas de dados sem personalidade
- Gráficos Recharts padrão sem customização
- Ícones Lucide em tamanho mínimo sem contexto visual
- Avatar genérico "U" inicial em cinza
- Progress bar verde horizontal padrão html
- Tooltip básico sem glassmorphism
- Loading spinner azul centralizado sem contexto

**Arquitetura:**
- Múltiplos sidebars ou navbars empilhados
- Modal que cobre 100% da tela sem backdrop blur
- Breadcrumbs como navegação principal
- Tabs horizontais como páginas principais (exceto dentro de ilhas)
- Dashboard com 20+ cards todos do mesmo tamanho

**Conteúdo:**
- "Bem-vindo ao Dashboard" como título
- "Você não tem itens" sem personalidade
- Textos de loading genéricos "Carregando..."
- Empty state sem ícone e sem personalidade
- Métricas sem contexto temporal ou comparativo

---

### ✅ FAZER SEMPRE

**Visual:**
- Fundo oceano azul-escuro sempre presente
- Glassmorphism com `backdrop-blur-xl` e `bg-slate-900/60-75`
- Borda sutil `border-white/[0.08-0.15]`
- Sombras de profundidade `shadow-kratos-glass`
- Glow temático por ilha (cor da ilha em 25-30% opacidade)
- Gradientes apenas sutis (no máximo `from-white/5 to-transparent`)
- Ilhas com `rotateX(10-12deg)` para pseudo-3D
- Nuvens sempre em movimento (exceto reduced motion)
- Aurora sempre presente no RightRail

**Texto:**
- Missão atual em destaque no banner do castelo
- "Próxima Ação" sempre clicável no BottomDock
- Labels de ilha em UPPERCASE tracking-wide
- Números de métricas em `tabular-nums font-bold`

---

# UI PRINCIPLES — KRATOS Mission Control

## Os 7 Princípios Inegociáveis

### 1. Fio da Missão (10 segundos)
> Em 10 segundos ao abrir o app, o operador deve ver Missão Atual, Próxima Ação e Foco do Dia.

**Implementação:** Banner do Castelo + BottomDock StatusBar + RightRail FocoDoDia

### 2. Mundo Vivo (Não Dashboard Morto)
> O app deve parecer um lugar que existe, não um formulário que aguarda input.

**Implementação:** Nuvens em movimento + ilhas flutuantes + glow ativo + Aurora sempre presente

### 3. Neurocompatibilidade TDAH
> Hierarquia clara. Uma coisa por vez. Redução de culpa. Próxima ação sempre óbvia.

**Implementação:** EmptyState amigável + ProgressRing com sublabel contextual + BottomDock com única próxima ação

### 4. Identidade por Ilha
> Cada ilha tem personalidade visual única. Entrar em OMNIS parece entrar em laboratório. Entrar em Vila Viva parece chegar em casa.

**Implementação:** Tema cromático por ilha + componentes temáticos específicos + glow exclusivo

### 5. Backend Intocável
> O frontend nunca quebra o contrato com backend, SSE, Mission Lens ou useLiveKratos.

**Implementação:** SourceBadge sempre visível. Nunca hardcodar dados reais. Sempre consumir do hook.

### 6. Glassmorphism Funcional
> Blur não é decoração. É hierarquia visual. Quanto mais importante, mais blur e mais sombra.

**Implementação:** HUD em `backdrop-blur-xl`. Cards em `backdrop-blur-glass`. Labels em `bg-slate-900/75`.

### 7. Motion com Propósito
> Animação que não comunica nada, não existe. Float-slow = ilha viva. Pulse-glow = atividade. PageTransition = mudança de contexto.

**Implementação:** `kratosMotion` variants para cada tipo de transição. CSS fallback para tudo.
