# KRATOS Design Rules — Anti-Slop Guide

> Visual premium não é complexo. É intencional.

## Princípios Fundamentais

### 1. Beleza só vale se aumentar clareza
Cada elemento visual deve ter uma função. Decoração pura é ruído cognitivo — o oposto do que o KRATOS precisa.

### 2. Mundo-primeiro, painéis são convidados
O world map de ilhas é o palco. Nenhum painel lateral permanente compete com ele.

### 3. Uma próxima ação vence uma lista infinita
A tela mais importante do KRATOS deve ter 1 elemento dominante: a próxima ação.

### 4. Drift não é fracasso, é evento operacional
A interface nunca pune o usuário. Ela pergunta, não acusa.

---

## Tipografia

### Hierarquia (dark mode, oklch)
```css
/* Título de missão / destaque máximo */
font-size: 1.5rem; font-weight: 700; color: var(--kr-text-primary);

/* Subtítulo / seção */
font-size: 1rem; font-weight: 600; color: var(--kr-text-primary);

/* Corpo / dado */
font-size: 0.875rem; font-weight: 400; color: var(--kr-text-secondary);

/* Muted / meta */
font-size: 0.75rem; font-weight: 400; color: var(--kr-text-muted);
```

### Regras
- Mínimo 3 níveis de hierarquia por tela com dados
- Nunca flat: título e corpo no mesmo peso/tamanho
- Labels de dado: SEMPRE muted, nunca mesmo peso do valor

---

## Espaçamento

| Contexto | Valor |
|---|---|
| Padding de card | `p-4` (16px) ou `p-6` (24px) |
| Gap entre cards | `gap-4` (16px) |
| Gap entre seções | `gap-8` (32px) |
| Padding de tela | `p-6` desktop, `p-4` mobile |
| Altura de dock/hud | 48-64px |

**Regra:** consistência supera criatividade. Usar sempre o mesmo espaçamento para o mesmo contexto.

---

## Cores — Tokens KRATOS

```css
/* Usar SEMPRE var(--kr-*), nunca hex inline */

/* Backgrounds */
--kr-glass-bg: cor de fundo com transparência
--background: fundo base da tela

/* Texto */
--kr-text-primary: texto principal
--kr-text-secondary: texto secundário
--kr-text-muted: labels, meta

/* Semânticas */
--kr-color-mission: cor da missão ativa (destaque máximo)
--kr-color-risk: cor de risco/alerta
--kr-color-aurora: cor da Aurora

/* Bordas */
--kr-border-subtle: bordas de card, separadores
```

**Proibido:**
- `style={{ color: '#3b82f6' }}`
- `var(--kratos-*)` — família legada
- Cores Tailwind sem token equivalente: `bg-blue-500`, `text-gray-400`

---

## Sombras e Profundidade

```css
/* Glass panels */
.kr-glass { backdrop-filter: blur(12px); }
.kr-glass-strong { backdrop-filter: blur(20px); }

/* Elevação de cards */
/* Level 1: card padrão — sem sombra pesada */
/* Level 2: card ativo/hover — sombra sutil */
/* Level 3: overlay/drawer — sombra mais pronunciada */

/* Nunca sombra colorida decorativa */
/* box-shadow: 0 0 20px rgba(59, 130, 246, 0.5) → PROIBIDO */
```

---

## Grid e Layout

### Layout HUD-first (padrão KRATOS)
```
┌────────────────────────────────────┐
│     Top HUD (48px, leve)           │
├──┬─────────────────────────┬───────┤
│  │                         │ (draw)│
│R │    MUNDO (flex-1)       │  er   │
│a │    Ilhas / Conteúdo     │  sob  │
│i │                         │  dem  │
│l │                         │  and  │
├──┴─────────────────────────┴───────┤
│     Bottom Dock (56px)             │
└────────────────────────────────────┘
```

### PROIBIDO
```
grid-cols-[240px_1fr_320px]  ← mata o mundo
sidebar fixa > 64px permanente
dois painéis laterais simultâneos pesados
```

---

## Radius

```css
--radius-sm:  4px  — badges, tags pequenas
--radius-md:  8px  — inputs, botões
--radius-lg:  12px — cards, painéis
--radius-xl:  16px — modais, drawers
--radius-2xl: 24px — islands, overlays grandes
```

---

## Animações (Framer Motion)

### Quando usar
- Entrada de painéis contextuais (drawer, overlay)
- Aurora orb → drawer expand
- Island click → overlay entrance
- Dock items em hover state
- Notificações/nudges suaves

### Quando NÃO usar
- Cards em lista estática
- Background animations decorativas
- Loading spinners
- Texto qualquer

### Parâmetros obrigatórios
```typescript
// Padrão para entradas
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}

// Drawer/painel lateral
initial={{ x: '100%' }}
animate={{ x: 0 }}
transition={{ duration: 0.25, ease: 'easeOut' }}

// prefers-reduced-motion SEMPRE
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
transition={{ duration: reduced ? 0 : 0.2 }}
```

---

## Estados Interativos

Todo elemento interativo tem 4 estados:
1. **Default** — estado de repouso
2. **Hover** — indicação de interatividade (sutil)
3. **Active/Pressed** — feedback de clique
4. **Disabled** — quando não disponível

```tsx
// Padrão correto
className="
  transition-colors duration-150
  hover:bg-[var(--kr-glass-bg)]
  active:scale-[0.98]
  disabled:opacity-40 disabled:cursor-not-allowed
"
```

---

## Responsividade

KRATOS é **desktop-first** mas não quebra em mobile.

| Breakpoint | Comportamento |
|---|---|
| < 640px | Rail colapsa, bottom dock simplifica |
| 640-1024px | Layout tablet: mundo menor, painéis em bottom sheet |
| > 1024px | Layout completo: HUD + mundo + rail + dock |
| 1440px | Tela de referência |

---

## Acessibilidade

- Contraste mínimo texto normal: 4.5:1
- Contraste mínimo texto grande: 3:1
- Focus visible em TODOS os elementos interativos
- `aria-label` em botões sem texto visível
- Não depender só de cor para comunicar estado
- `prefers-reduced-motion` em toda animação

---

## Anti-patterns Visuais — PROIBIDO

| Anti-pattern | Por quê | Alternativa |
|---|---|---|
| Gradiente `from-blue-500 to-purple-500` | AI-slop clássico | Cor sólida com token |
| Ícone em círculo colorido | Sem hierarquia | Ícone direto com cor semântica |
| Grid 3 colunas simétricas | Preguiça de layout | Layout com intenção |
| Card title + text + button clone | Template genérico | Hierarquia intencional |
| Sidebar quadrada permanente | Mata o mundo | Rail fino + drawers |
| Confete / animação de sucesso exagerada | Cassino dopaminérgico | Progresso sutil |
| Streak com culpa | Punição = abandono | Checkpoint de retomada |
| 20 métricas na tela | Paralisia cognitiva | 1 próxima ação |
| Empty state só com texto | Inútil | Título + descrição + ação |
| Loading spinner básico | Sem contexto | Skeleton com forma real |
