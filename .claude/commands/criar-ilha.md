# /criar-ilha — Nova Ilha KRATOS

Cria uma ilha nova no world map com todos os requisitos: rota, hotspot, dock data, estados e visual.

## Uso
```
/criar-ilha <nome-da-ilha> <domínio-cognitivo>
```

Exemplo: `/criar-ilha arena-comercial vendas`

## O que uma ilha precisa

**Identidade**
- Nome da ilha
- Domínio cognitivo (o que representa mentalmente)
- Cor/tema visual
- Ícone (Lucide)

**Dados**
- Fonte: qual endpoint alimenta
- Source badge: live | cached | mock | offline
- Fallback: o que mostrar se offline

**Componentes**
- `IslandCard` no world map
- Hotspot clicável com posição fixa
- `IslandOverlay` (expande ao clicar, mundo continua ao fundo)
- `IslandDock` no bottom dock quando ativa
- Empty/Loading/Error states

**Rota** (opcional)
- `src/routes/ilhas/$islandId.tsx` ou rota dedicada

## Processo

1. Definir identidade e dados da ilha
2. Criar schema Zod em `api-contract/` (se endpoint novo)
3. Criar `IslandCard` em `src/components/kratos/world/islands/`
4. Registrar hotspot no `KratosWorldMap.tsx`
5. Criar overlay de conteúdo
6. Atualizar bottom dock
7. Gate: `bun run build` + visual check

## Checklist de qualidade
- [ ] Source badge visível
- [ ] Estado empty/loading/error
- [ ] Animação de entrada (Framer Motion, ≤ 0.3s)
- [ ] Mundo continua visível ao fundo (blur/overlay)
- [ ] Posição fixa no mapa (spatial memory)
- [ ] Dark mode verificado
- [ ] Domínio cognitivo claro para o usuário
