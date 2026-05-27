# /adaptive-hud — Corrigir Layout para HUD Adaptativo

Transforma o layout atual (sidebar quadrada) em HUD contextual adaptativo.

## Problema a corrigir
```
ANTES (errado):
grid-cols-[240px_1fr_320px]  ← mata o mundo

DEPOIS (correto):
world-first + rail fino + drawers contextuais + bottom dock
```

## Componentes do HUD correto

### Top HUD (leve, não barra pesada)
```tsx
// Altura máx: 48px
// Conteúdo: energia, hora, missão resumida, status live, Aurora orb
// Fixed no topo, z-index alto
```

### Rail lateral (não sidebar)
```tsx
// Largura: 48-56px (ícones apenas)
// Expande em hover/clique para 200px
// Auto-collapse após seleção
// Sem bloco quadrado permanente
```

### Área central (mundo-primeiro)
```tsx
// flex-1, overflow-auto
// Ocupa 100% do espaço disponível
// World map / ilhas são protagonistas
// Painéis contextuais entram como overlays/drawers
```

### Aurora (orb → drawer)
```tsx
// Estado padrão: orb flutuante (canto direito)
// Ao clicar: drawer desliza da direita (w-80)
// Mundo continua visível ao fundo
// Não é sidebar fixa
```

### Bottom Dock (única área semi-persistente)
```tsx
// Altura: 56-64px
// Missão atual + próxima ação + checkpoint + status
// Glass effect
// Fixed no bottom
```

## Processo de migração

1. Identificar onde está `grid-cols-[240px_1fr_320px]`
   ```bash
   grep -rn "240px" src/ --include="*.tsx"
   grep -rn "320px" src/ --include="*.tsx"
   ```

2. Substituir por layout HUD-first

3. Converter sidebar esquerda em rail fino

4. Converter painel direito fixo em Aurora drawer

5. Adicionar bottom dock se não existir

6. Gate: `bun run build` + `/snapshot-visual`

## Restrições
- Não quebrar SSE/Mission Lens
- Não alterar lógica de dados
- Não remover componentes protegidos — refatorar layout apenas
- Framer Motion nas transições (rail expand, drawer slide)
