---
name: neuro-ux-checker
description: "Valida UX para cérebros TDAH: competição por atenção, clareza, hierarquia visual e carga cognitiva."
metadata:
  type: skill
  tier: analytics
  project: kratos-mission-control
  scope: frontend
---

# neuro-ux-checker

Valida a experiência do operador com TDAH. Cada elemento na tela compete por atenção limitada.

## Princípios (do KRATOS_COGNITIVE_CONTINUITY_SPEC.md)

1. **Próxima ação vence lista infinita** — O operador sempre vê "o que fazer AGORA"
2. **Drift não é fracasso** — Sistema detecta, nomeia e oferece retomada sem culpa
3. **Spatial memory** — Posição fixa > listas abstratas (componentes não mudam de lugar)
4. **Baixa competição por atenção** — Menos elementos, 1 foco claro por vez
5. **Hiperfoco protegido** — Silenciar alertas não-críticos durante flow
6. **Retomada sem vergonha** — Checkpoint 1-clique, sem fricção

## Checklist neuro-UX

### Carga cognitiva
- [ ] Máximo 7±2 elementos de decisão visíveis por tela (Lei de Miller)
- [ ] A próxima ação é o elemento visualmente mais proeminente
- [ ] Nenhuma animação roda em loop infinito (cansa o cérebro)

### Hierarquia visual
- [ ] 1 elemento primário (missão/next action) — maior, mais contraste
- [ ] 2-3 elementos secundários (status, riscos) — tamanho médio
- [ ] Resto é terciário (metadata, timestamps) — menor, muted

### Prevenção de distração
- [ ] Nenhum popup ou modal sem trigger explícito do usuário
- [ ] Notificações só aparecem no Right Rail (nunca no centro da tela)
- [ ] Cores vibrantes (`--kr-red-*`, `--kr-arena-*`) só para alertas críticos

### Memória espacial
- [ ] Componentes têm posição fixa na tela (não reordenam sozinhos)
- [ ] Navegação consistente (sidebar sempre no mesmo lugar)
- [ ] Mundo de ilhas mantém posições entre sessões

### Clareza
- [ ] Todo label tem verbo claro (não "Status", mas "Salvar checkpoint")
- [ ] Toda mensagem de erro diz o que fazer (não "Erro 500", mas "Backend offline — tentar novamente?")
- [ ] Jargão técnico explicado ou removido

### Estados de foco (do Cognitive Continuity Spec)
- [ ] Tier 1 Ambient: Badge "[Você está há 30min no Instagram]" visível sem popup
- [ ] Tier 2 Nudge: "Salvar checkpoint?" após 45min de sessão
- [ ] Tier 3 Block: Bloqueio com justificativa e caminho alternativo
- [ ] Tier 4 Restore: One-click restore de checkpoint

## Anti-padrões neuro-UX
- ❌ Carrossel automático (rouba atenção sem permissão)
- ❌ Toast no canto inferior direito (some antes do operador processar)
- ❌ Scroll infinito (perde referência espacial)
- ❌ Modal sobre modal (caos cognitivo)
- ❌ Botão "Cancelar" sem "Desfazer" (medo de errar paralisa)
