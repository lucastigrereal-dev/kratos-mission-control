# KRATOS — MICROFASES DE FECHAMENTO DE GAP (KIG)

**Data:** 2026-05-15 | **Baseline:** Gap Audit 29/100 | **Meta:** Sair do VERMELHO (29) → AMARELO (50+) → VERDE (65+)

---

## ORDEM E DEPENDÊNCIAS

```
KIG-01 (fundação)
  └── KIG-02 (depende de tokens limpos)
        └── KIG-03 (depende de ícones SVG)
              └── KIG-04 (depende de regiões com identidade)
                    └── KIG-05 (depende de camada visual pronta)
```

Cada microfase tem: objetivo, arquivos prováveis, risco, tempo estimado, validação, critério de aceite.

---

## KIG-01 — UNIFICAR E LIMPAR O DESIGN SYSTEM CSS

**Objetivo:** Eliminar a ambiguidade dos dois arquivos de tokens, remover código morto, garantir que todo `var()` referencia um token que EXISTE.

### Por que esta ordem?
Tudo que vem depois (ícones, regiões, animações) referencia tokens CSS. Se os tokens estão quebrados/duplicados, cada microfase seguinte acumula débito.

### Escopo
1. **Auditar `kratos-tokens.css` (355 linhas, NÃO importado):**
   - Identificar tokens usados por componentes que SÓ existem neste arquivo (ex: `--kr-purple-*`, `--kr-space-*`, `--kr-font-*`)
   - Migrar esses tokens para `tokens.css` com a mesma naming convention
2. **Deletar `kratos-tokens.css`** (após migração confirmada)
3. **Auditar todos os `var()` no código:**
   - `grep -r "var(--kr-" src/` e verificar cada token contra `tokens.css`
   - Corrigir referências quebradas (`--kr-purple-900`, `--kr-purple-200` em `ProjectContinuityCard.tsx:64`)
4. **Remover hardcoded colors restantes:**
   - `ApprovalsPage.tsx:138` — `color: "#fff"` → `var(--kr-text-inverse)`
   - `AuroraCommandInput.tsx:115` — `color: "#fff"` → `var(--kr-text-inverse)`
   - `ResumeFromHereCard.tsx:93` — `color: "#000"` → `var(--kr-text-inverse)`
   - `AuroraPage.tsx:23` — fallback `#0a0d1a` → token existente
5. **Padronizar naming convention em `tokens.css`:**
   - Escolher UMA convenção (ex: `--kr-font-*` OU `--kr-text-*`, não os dois)
   - Atualizar referências nos componentes

### Arquivos prováveis
| Alteração | Arquivo |
|-----------|---------|
| MODIFICAR | `frontend/src/styles/tokens.css` (receber tokens migrados) |
| DELETAR | `frontend/src/styles/kratos-tokens.css` (código morto) |
| MODIFICAR | `frontend/src/components/ProjectContinuityCard.tsx` (cores quebradas L:64) |
| MODIFICAR | `frontend/src/pages/ApprovalsPage.tsx` (hardcoded #fff L:138) |
| MODIFICAR | `frontend/src/components/AuroraCommandInput.tsx` (hardcoded #fff L:115) |
| MODIFICAR | `frontend/src/components/ResumeFromHereCard.tsx` (hardcoded #000 L:93) |
| MODIFICAR | `frontend/src/pages/AuroraPage.tsx` (fallback hex L:23) |
| VERIFICAR | `frontend/src/index.css` (remover import de kratos-tokens se existir) |

### Risco: BAIXO
- Mudanças puramente mecânicas (search/replace de tokens)
- Nenhuma lógica de negócio afetada
- Rollback trivial (git revert)

### Tempo estimado: 45-60 minutos

### Validação
```bash
cd frontend && npm run build  # Deve compilar 0 erros TypeScript
grep -r "var(--kr-" src/ | grep -o "var(--kr-[^)]*)" | sort -u > tokens_used.txt
grep -o "--kr-[a-z0-9-]*" src/styles/tokens.css | sort -u > tokens_defined.txt
diff tokens_used.txt tokens_defined.txt
# ZERO tokens usados e não definidos
```

### Critério de aceite
- [ ] `kratos-tokens.css` deletado
- [ ] `tokens.css` é a ÚNICA fonte de tokens CSS
- [ ] Nenhum `var(--kr-*)` referencia token inexistente
- [ ] Nenhum `#fff` ou `#000` hardcoded em TSX/JSX
- [ ] `npm run build` passa limpo
- [ ] Frontend visualmente IDÊNTICO ao estado pré-KIG-01

---

## KIG-02 — SUBSTITUIR UNICODE POR SVG ICONS

**Objetivo:** Trocar todos os caracteres unicode (◈ ◉ ☰ ⬡ ◎ ⚙ ◆ ◬ ◷ ✦ ⊘ ⏸) por ícones SVG com personalidade Nintendo/sci-fi.

### Por que esta ordem?
KIG-01 limpou os tokens. Agora podemos criar ícones SVG que usam `currentColor` e respeitam o sistema de cores. Esta é a mudança visual de maior impacto por menor esforço — os unicode chars são o sintoma mais visível de "protótipo".

### Escopo
1. **Criar `public/icons/kratos-icons.svg`** (sprite sheet):
   - Cada região ganha um ícone com personalidade:
     - Mundo/VisãoGeral: hexágono com centro pulsante (substitui ◈)
     - Missão: olho/visor estilizado (substitui ◉)
     - Ações/Tarefas: espada ou raio estilizado (substitui ☰)
     - Iniciativas/Projetos: cristal/joia com facetas (substitui ⬡)
     - Contexto: radar/sonar concêntrico (substitui ◎)
     - Sistemas: engrenagem minimalista sci-fi (substitui ⚙)
     - Checkpoints: bandeira/marcador flutuante (substitui ◆)
     - OMNIS Lab: átomo/núcleo com órbitas (substitui ◬)
     - Approvals: balança/martelo de juiz minimalista (substitui ◷)
     - Aurora: estrela de 4 pontas holográfica (substitui ✦)
   - Aurora decisions: ícones próprios para blocker (⊘), recomendação (◈), doNotDo (⏸)
2. **Modificar `KratosSidebar.tsx`:**
   - Substituir `icon: "◈"` por `icon: "world"` (sprite ID)
   - Renderizar `<svg><use href="/icons/kratos-icons.svg#world" /></svg>`
   - Manter unicode como fallback se SVG não carregar
3. **Modificar `KratosWorldMap.tsx`:**
   - Mesma substituição nos ISLANDS[].icon
4. **Modificar `AuroraPanel.tsx`:**
   - Substituir ícones de decisão no painel
5. **Adicionar componente `KratosIcon.tsx`:**
   ```tsx
   interface KratosIconProps {
     name: string;
     size?: number;
     className?: string;
   }
   // Renderiza <svg><use href={...} /></svg> com fallback
   ```

### Arquivos prováveis
| Alteração | Arquivo |
|-----------|---------|
| NOVO | `frontend/public/icons/kratos-icons.svg` (sprite sheet) |
| NOVO | `frontend/src/components/KratosIcon.tsx` |
| MODIFICAR | `frontend/src/components/KratosSidebar.tsx` (trocar unicode → SVG) |
| MODIFICAR | `frontend/src/components/KratosWorldMap.tsx` (ISLANDS[].icon) |
| MODIFICAR | `frontend/src/components/FloatingIsland.tsx` (receber SVG, não unicode) |
| MODIFICAR | `frontend/src/components/AuroraPanel.tsx` (ícones de decisão) |
| MODIFICAR | `frontend/src/components/AuroraFullScreenPanel.tsx` (ícones inline) |

### Risco: MÉDIO
- SVG sprite sheet precisa ser criado com design tool (Figma/Illustrator) ou código manual
- Cross-browser testing necessário (Chrome, Firefox, Edge, Safari)
- Fallback para unicode é safety net

### Tempo estimado: 90-120 minutos (mais se precisar criar SVGs do zero com design tool)

### Validação
```bash
cd frontend && npm run build
# Verificar visualmente: sidebar, world map, aurora panel
# Testar em Chrome + Firefox + Edge
# Verificar fallback: remover /icons/kratos-icons.svg, deve mostrar unicode
```

### Critério de aceite
- [ ] Nenhum caractere unicode como ícone em produção (fora de fallback)
- [ ] `KratosIcon` componente reutilizável
- [ ] SVG sprite sheet com todos os ícones listados
- [ ] Ícones respeitam `currentColor` (herdam cor do tema)
- [ ] Fallback funcional se SVG falhar
- [ ] Visualmente distinto e com personalidade (não genérico Material Icons)

---

## KIG-03 — DAR IDENTIDADE VISUAL A CADA REGIÃO

**Objetivo:** Cada região (página) ter atmosfera visual própria — não serem todas o mesmo template de glass panels.

### Por que esta ordem?
KIG-02 deu ícones. Agora cada região precisa de "clima": cor ambiente, textura de fundo, elemento decorativo. Sem isso, continuam sendo "cards com ícone diferente no título".

### Escopo
1. **Criar `RegionShell` componente:**
   - Wrapper que aplica identidade visual por região
   - Props: `regionId`, `ambientColor`, `backgroundPattern?`, `children`
   - Aplica: cor de fundo sutil, gradiente radial, elemento decorativo (ex: linhas de grade para "Sistemas", partículas para "OMNIS Lab")
2. **Definir identidade por região:**
   | Região | Cor Ambiente | Elemento Decorativo |
   |--------|-------------|---------------------|
   | HUB (visao-geral) | Manter mundo existente | Nuvens + oceano (já tem) |
   | Mission Lens | Âmbar/dourado (missão) | Feixes de luz radial |
   | Ações (tarefas) | Teal/oceano | Linhas de fluxo vertical |
   | Iniciativas (projetos) | Azure/azul | Grid hexagonal sutil |
   | Contexto | Aurora/roxo | Ondas concêntricas (radar) |
   | Sistemas | Ember/laranja | Linhas de circuito |
   | Checkpoints | Dourado | Timeline vertical luminosa |
   | OMNIS Lab | Ciano/verde | Partículas flutuantes |
   | Approvals | Púrpura | Linhas de grade (contrato) |
   | Aurora FS | Manter tela cheia | Orbe + anéis (já tem) |
3. **Refatorar cada Page para usar `RegionShell`:**
   - Substituir `padding: var(--kr-space-page)` genérico por `<RegionShell regionId="...">`
4. **Adicionar transição entre regiões:**
   - CSS `@keyframes region-enter` com fade + slide direcional
   - `.kr-region-enter` classe aplicada na montagem

### Arquivos prováveis
| Alteração | Arquivo |
|-----------|---------|
| NOVO | `frontend/src/components/RegionShell.tsx` |
| NOVO | `frontend/src/styles/regions.css` (identidades visuais) |
| MODIFICAR | `frontend/src/pages/VisaoGeralPage.tsx` |
| MODIFICAR | `frontend/src/pages/MissionLensPage.tsx` |
| MODIFICAR | `frontend/src/pages/TarefasPage.tsx` |
| MODIFICAR | `frontend/src/pages/ProjetosPage.tsx` |
| MODIFICAR | `frontend/src/pages/ContextoPage.tsx` |
| MODIFICAR | `frontend/src/pages/SistemaPage.tsx` |
| MODIFICAR | `frontend/src/pages/CheckpointsPage.tsx` |
| MODIFICAR | `frontend/src/pages/OmnisPage.tsx` |
| MODIFICAR | `frontend/src/pages/ApprovalsPage.tsx` |
| MODIFICAR | `frontend/src/index.css` (import regions.css) |
| MODIFICAR | `frontend/src/styles/motion.css` (region-enter animation) |

### Risco: MÉDIO-ALTO
- Muitos arquivos tocados (11 páginas)
- Mudanças visuais podem causar regressões de contraste/legibilidade
- Cada região precisa de ajuste fino

### Tempo estimado: 3-4 horas

### Validação
```bash
cd frontend && npm run build
# Navegar por todas as 10 rotas
# Cada uma deve ter ATMOSFERA distinta
# Nenhuma deve ter regressão de legibilidade
# npm test (31 frontend tests)
```

### Critério de aceite
- [ ] Cada região tem cor ambiente distinta
- [ ] Cada região tem elemento decorativo de fundo (não genérico)
- [ ] Transição entre regiões com animação
- [ ] Nenhuma região é "só cards num fundo escuro"
- [ ] Contraste mantido (texto legível sobre fundos coloridos)
- [ ] 31/31 testes passando

---

## KIG-04 — FAZER INFORMAÇÃO CRÍTICA GRITAR

**Objetivo:** Urgência, blockers, risco crítico e oportunidades não podem ter o mesmo peso visual de um card normal. Precisam PULSAR, TINGIR, GRITAR.

### Por que esta ordem?
KIG-03 deu identidade às regiões. Agora a informação crítica dentro dessas regiões precisa de hierarquia visual extrema. Não adianta ter região bonita se o blocker crítico parece um badge azul igual aos outros.

### Escopo
1. **Criar sistema de severidade visual com 4 níveis:**
   - `kr-severity-critical`: borda glow vermelha pulsante, fundo tinge região, sombra colorida
   - `kr-severity-warning`: borda glow amarela/âmbar, fundo sutil
   - `kr-severity-info`: azul neutro (estado atual de todos os cards)
   - `kr-severity-opportunity`: verde/dourado (dinheiro!) — destaque positivo
2. **Aplicar nos componentes certos:**
   - `BlockedItemsCard` → `kr-severity-critical` quando tem blockers
   - `KratosRightRail` riscos → severidade por risco (critical/warning)
   - `ApprovalCard` com risco "critical" → `kr-severity-critical`
   - Nova: `OpportunitySignal` (quando existir pipeline, KIG-05)
3. **Criar `CriticalPulse` animação CSS:**
   - `@keyframes kr-pulse-critical` — borda glow expande e contrai
   - Aplicado em elementos com severidade critical
   - Respeita `prefers-reduced-motion`
4. **Adicionar "ambiente tinge" no `RegionShell`:**
   - Prop `severity?: "critical" | "warning" | "none"`
   - Quando critical, fundo da região ganha overlay vermelho sutil + vinheta
5. **Fix `VisaoGeralPage` placeholders:**
   - Tarefas e Projetos com `"..."` → buscar dados reais de `/tasks` e `/projects`
   - Conectar com o `taskCount` que `Layout.tsx` já computa (linha 60)

### Arquivos prováveis
| Alteração | Arquivo |
|-----------|---------|
| NOVO | `frontend/src/styles/severity.css` |
| MODIFICAR | `frontend/src/styles/motion.css` (kr-pulse-critical) |
| MODIFICAR | `frontend/src/components/RegionShell.tsx` (severity prop) |
| MODIFICAR | `frontend/src/components/BlockedItemsCard.tsx` (severity critical) |
| MODIFICAR | `frontend/src/components/KratosRightRail.tsx` (severidade por risco) |
| MODIFICAR | `frontend/src/components/ApprovalCard.tsx` (severidade visual) |
| MODIFICAR | `frontend/src/pages/VisaoGeralPage.tsx` (remover "..." placeholders) |
| MODIFICAR | `frontend/src/styles/components.css` (kr-severity-* classes) |

### Risco: BAIXO-MÉDIO
- Animações novas, precisam testar com `prefers-reduced-motion`
- Mudanças de cor precisam manter contraste WCAG AA

### Tempo estimado: 2-3 horas

### Validação
```bash
cd frontend && npm run build
# Simular blocker crítico (editar mock-data manualmente)
# Verificar se:
#   - Card brilha/pulsa vermelho
#   - Fundo da região tem overlay
#   - É IMPOSSÍVEL ignorar visualmente
# Verificar com prefers-reduced-motion: ON → sem pulsação
# Verificar contraste: WCAG AA 4.5:1 nos textos sobre fundos de severidade
```

### Critério de aceite
- [ ] Informação crítica visualmente distinta (cor, glow, animação)
- [ ] 4 níveis de severidade implementados e aplicados
- [ ] `VisaoGeralPage` sem placeholders "..." (dados reais)
- [ ] `prefers-reduced-motion` respeitado
- [ ] Contraste WCAG AA mantido

---

## KIG-05 — CONECTAR DADOS DE NEGÓCIO REAIS

**Objetivo:** O KRATOS saber que o operador tem 6 perfis Instagram, 2.3M seguidores, pipeline comercial, pacotes de venda. Responder "o que gera dinheiro hoje?"

### Por que esta ordem?
Esta é a microfase mais ambiciosa — requer novos endpoints backend, novos componentes, possível integração com APIs externas (Instagram, CRM). A fundação visual (KIG-01 a KIG-04) precisa estar pronta para que os novos componentes nasçam com a linguagem visual correta.

### Escopo
1. **Novos endpoints backend (FastAPI):**
   - `GET /business/profiles` — status dos 6 perfis Instagram (mock inicial, real depois)
   - `GET /business/pipeline` — pipeline comercial (collabs em negociação, follow-ups)
   - `GET /business/revenue` — resumo de receita (mês atual, projetado)
   - `GET /business/metrics` — seguidores, engajamento, posts/dia
2. **Novos componentes frontend:**
   - `ProfilesOverview` — grid dos 6 perfis com seguidores, status, última publicação
   - `PipelineFunnel` — visualização do funil comercial (prospecção → negociação → fechado)
   - `RevenueCard` — receita do mês com indicador de tendência (subindo/descendo)
3. **Nova região: Arena Comercial (`/arena`)**
   - Página dedicada a vendas e pipeline
   - Acesso via ilha no mapa mundi (nova ilha "Arena" ou integrada ao Observatório)
4. **Adicionar "money signal" na `VisaoGeralPage`:**
   - Badge de receita do mês com tom dourado (positivo) ou neutro
   - "Oportunidades quentes" (pipeline ativo)
5. **Integrar com `Publisher OS` (MCP):**
   - Conexão com o JARVIS para dados de produção de conteúdo
   - `get_briefing()` — integrar no KRATOS como fonte de verdade operacional

### Arquivos prováveis
| Alteração | Arquivo |
|-----------|---------|
| NOVO | `backend/app/routers/business.py` |
| NOVO | `backend/app/services/business_service.py` |
| NOVO | `frontend/src/pages/ArenaComercialPage.tsx` |
| NOVO | `frontend/src/components/ProfilesOverview.tsx` |
| NOVO | `frontend/src/components/PipelineFunnel.tsx` |
| NOVO | `frontend/src/components/RevenueCard.tsx` |
| MODIFICAR | `frontend/src/components/KratosWorldMap.tsx` (nova ilha Arena) |
| MODIFICAR | `frontend/src/components/KratosSidebar.tsx` (nova rota) |
| MODIFICAR | `frontend/src/pages/VisaoGeralPage.tsx` (metric badges de negócio) |
| MODIFICAR | `frontend/src/App.tsx` (nova rota /arena) |
| MODIFICAR | `backend/app/main.py` (novo router business) |

### Risco: ALTO
- Maior escopo (backend + frontend + possivelmente integração externa)
- Depende de dados que podem não estar disponíveis (APIs Instagram bloqueadas)
- Mock data strategy precisa ser definida para desenvolvimento local
- Publisher OS MCP pode não estar 100% operacional

### Tempo estimado: 4-6 horas (sem integração real com Instagram) + tempo de integração externa

### Validação
```bash
cd backend && python -m pytest tests/ -k business
cd frontend && npm run build && npm test
# Verificar visualmente:
#   - Nova ilha "Arena" no mapa
#   - /arena com pipeline + perfis + receita
#   - VisaoGeralPage com métricas de negócio
#   - Dados mock realistas (não "..." nem "N/A")
```

### Critério de aceite
- [ ] `GET /business/profiles` retorna dados dos 6 perfis (mock)
- [ ] `GET /business/pipeline` retorna pipeline comercial (mock)
- [ ] Página `/arena` funcional com 3 seções (perfis, pipeline, receita)
- [ ] Nova ilha "Arena" no mapa mundi
- [ ] `VisaoGeralPage` mostra indicador de receita
- [ ] Dados mockados mas REALISTAS (números plausíveis, não placeholder)
- [ ] Build e testes passando

---

## MAPA DE PROGRESSO PROJETADO

| Microfase | Nota Antes | Nota Depois | Faixa |
|-----------|-----------|-------------|-------|
| **Agora** | **29/100** | — | VERMELHO |
| KIG-01 | 29 | 33 | VERMELHO |
| KIG-02 | 33 | 42 | AMARELO |
| KIG-03 | 42 | 55 | AMARELO |
| KIG-04 | 55 | 62 | VERDE |
| KIG-05 | 62 | 72 | VERDE |

**Meta final após KIG-05: 72/100 — "CAMINHO CERTO, ALMA PRESENTE"**

---

## O QUE FICA PARA DEPOIS (KIG-06 a KIG-10, futuro)

- KIG-06: Parallax e profundidade real (mousemove 3D, scroll-triggered layers)
- KIG-07: Aurora como presença onipresente (não chat, orbe sentinel proativo)
- KIG-08: Animações e partículas sci-fi (scanlines, edge glow animado, feixes de luz)
- KIG-09: Regiões restantes (Akasha, Tesouro, Vila Viva, Forja, Nimbus, Agência)
- KIG-10: Integração real com Instagram API + Publisher OS + CRM

---

## REGRA DE EXECUÇÃO

1. **Uma microfase por vez.** Não adianta começar KIG-02 sem KIG-01 validada.
2. **Validar build + testes a cada microfase.** Regressão é proibida.
3. **Commit separado por microfase.** Atomicidade. Se der ruim, reverte UM commit.
4. **Não commitar sem autorização explícita.** Regra do operador.
5. **"Feito > Perfeito"** — mas sem quebrar o que já funciona.
