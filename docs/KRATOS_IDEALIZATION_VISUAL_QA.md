# KRATOS — VISUAL QA: ADERÊNCIA À IDEALIZAÇÃO

**Data:** 2026-05-15 | **Tipo:** Checklist de verificação visual para Lucas
**Instrução:** Abrir o KRATOS no navegador (`http://localhost:5173`) e verificar cada item.
**Nota:** Esta é uma auditoria de CÓDIGO — não temos screenshots. Cada verificação descreve o que PROCURAR visualmente.

---

## COMO USAR ESTE CHECKLIST

1. Suba o backend: `cd backend && uvicorn app.main:app --port 5100`
2. Suba o frontend: `cd frontend && npm run dev`
3. Abra `http://localhost:5173` no Chrome/Edge
4. Para cada item abaixo, marque: PASSOU / FALHOU / NÃO SE APLICA
5. Tire screenshot dos FALHOS para anexar ao report

---

## SEÇÃO 1 — PRIMEIRA IMPRESSÃO (5 segundos)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 1.1 | **Parece um mundo ou um dashboard?** | Abrir `/visao-geral`. A primeira impressão é de "mundo de fantasia" ou "sistema corporativo com fundo escuro"? Se a sidebar à esquerda domina a atenção → FAIL. | |
| 1.2 | **Responde "o que está urgente?" em 3 segundos?** | Olhar a tela 3 segundos e desviar. Algo pulsava, brilhava ou gritava "URGENTE"? Se tudo tem o mesmo peso visual → FAIL. | |
| 1.3 | **Responde "o que fazer agora?" em 3 segundos?** | Há um botão ou texto ÓBVIO de próxima ação sem precisar ler nada? | |
| 1.4 | **Tem alma ou é genérico?** | Se você trocasse o logo "KRATOS" por "Salesforce", a interface ainda faria sentido? Se SIM → FAIL (é genérico). | |

---

## SEÇÃO 2 — MAPA MUNDI (World Map)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 2.1 | **Ilhas flutuam ou estão coladas?** | As ilhas têm sombra projetada no "oceano"? A sensação é de elevação? | |
| 2.2 | **Castelo central tem portal pulsante?** | O glow laranja/dourado no centro do castelo pulsa visivelmente? | |
| 2.3 | **Nuvens se movem?** | As nuvens (`WorldClouds`) driftam lentamente? (espere 10 segundos) | |
| 2.4 | **Oceano tem gradiente de profundidade?** | O fundo do oceano escurece na parte inferior? Tem sensação de distância? | |
| 2.5 | **Pontes conectam ilhas ao castelo?** | Linhas/pontes de corda visíveis entre castelo e ilhas principais? | |
| 2.6 | **Ilhas têm status visual?** | Ilhas "live" têm glow/pulsação diferente das "active"? Dá para saber quais regiões estão vivas? | |
| 2.7 | **Clicar numa ilha navega?** | Ao clicar em "Ações" (ilha esquerda), vai para `/tarefas`? Tem transição? | |
| 2.8 | **Labels das ilhas são legíveis?** | "Ações", "Iniciativas", "Contexto" — fonte legível sem zoom? | |
| 2.9 | **Ícones das ilhas são unicode estranho?** | ◈ ◉ ☰ ⬡ — parecem placeholder ou design intencional? Renderizam igual no Chrome e no Firefox? | |
| 2.10 | **Castelo mostra missão atual?** | O banner abaixo do castelo exibe o nome da missão ou "—"? | |

---

## SEÇÃO 3 — TOP HUD (Barra Superior)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 3.1 | **Saudação + hora visíveis?** | "Bom dia/Boa tarde/Boa noite, Lucas" + hora BRT no canto direito? | |
| 3.2 | **Status de conexão claro?** | "Operacional" com bolinha verde? Ou "Offline" com vermelha? | |
| 3.3 | **Fonte legível?** | Texto nítido, sem serifa, tamanho confortável? | |
| 3.4 | **Marca "KRATOS CONTROL" visível?** | No centro ou esquerda, sem poluir? | |

---

## SEÇÃO 4 — SIDEBAR (Navegação Esquerda)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 4.1 | **Itens têm altura >= 44px?** | Cada item da sidebar tem altura suficiente para toque? (Use DevTools para medir) | |
| 4.2 | **Item ativo é claramente destacado?** | A página atual tem highlight/glow/borda distinta? | |
| 4.3 | **Ícones são unicode (◈ ◉ ☰)?** | A sidebar inteira usa caracteres unicode como ícones? | |
| 4.4 | **Sidebar compete com o mapa?** | A sidebar rouba atenção do mundo central? Ela é necessária ou é muleta de navegação? | |
| 4.5 | **Divisor entre nav principal e secundária?** | Separação clara entre TOP_NAV e BOTTOM_NAV? | |

---

## SEÇÃO 5 — RIGHT RAIL (Painel Direito)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 5.1 | **Sinais do mentor visíveis?** | Texto do `mentor_summary` aparece com destaque? | |
| 5.2 | **Riscos listados com severidade visível?** | Cada risco tem cor por severidade (vermelho=crítico, amarelo=médio, cinza=baixo)? | |
| 5.3 | **Checkpoint disponível indicado?** | Se há checkpoint, aparece badge/botão no rail? | |
| 5.4 | **Rail tem 320px?** | Não está cortado, não transborda? | |

---

## SEÇÃO 6 — BOTTOM DOCK (Barra Inferior)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 6.1 | **Barra de progresso visível?** | Mostra % de conclusão das tarefas? | |
| 6.2 | **Botão "Continuar" funciona?** | Clica e vai para `/tarefas`? Recarrega a página inteira (ruim) ou navega SPA? | |
| 6.3 | **Squads ativos mostrados?** | Chips "KRATOS" e "AURORA" visíveis? | |
| 6.4 | **Missão atual repetida no dock?** | Nome da missão aparece também aqui? É redundante ou útil? | |

---

## SEÇÃO 7 — VISÃO GERAL (Página Principal)

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 7.1 | **4 metric badges no topo?** | OMNIS, Pendências, Tarefas, Projetos em grid horizontal? | |
| 7.2 | **Tarefas e Projetos mostram "..."?** | Os valores são "..." (placeholder fixo) em vez de números reais? Isso é GRAVE. | |
| 7.3 | **Continuity card aparece?** | Card "Retomar sessão anterior" com borda roxa à esquerda? | |
| 7.4 | **Grid 2x2 de cards tem respiro?** | TodayMission, NextBestAction, BlockedItems, FocusNow — não estão amontoados? | |
| 7.5 | **Sobrecarga informacional?** | A tela tem MUITA coisa? Dá para processar em 10 segundos? | |
| 7.6 | **Scroll necessário?** | Precisa scrollar para ver tudo ou a tela cabe no viewport? | |

---

## SEÇÃO 8 — PÁGINAS SECUNDÁRIAS (navegar em cada uma)

### 8.1 Mission Lens (`/mission-lens`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.1.1 | Cards organizados em grid: Missão, Próxima Ação, Pulso, Não Fazer, Riscos, Checkpoint, Prazos? | |
| 8.1.2 | Banner de `mentor_summary` com destaque no topo? | |
| 8.1.3 | Indicador "Dados desatualizados" aparece quando stale? | |
| 8.1.4 | Todos os cards têm conteúdo real (não placeholder)? | |

### 8.2 Tarefas (`/tarefas`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.2.1 | Lista de tarefas carrega do backend? | |
| 8.2.2 | Status visível por cor/ícone (done, pending, blocked)? | |
| 8.2.3 | Prioridade indicada? | |
| 8.2.4 | Filtro ou ordenação funciona? | |

### 8.3 OMNIS Bridge (`/omnis`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.3.1 | Status da bridge com círculo grande (verde/amarelo/vermelho)? | |
| 8.3.2 | Métricas: Setores, Skills, Jobs Ativos, Jobs Falhos? | |
| 8.3.3 | Blockers listados com dot crítico? | |
| 8.3.4 | Banner degradado/offline aparece quando status não é healthy? | |

### 8.4 Approvals (`/approvals`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.4.1 | Formulário de criação com Título + Risco + botão Criar? | |
| 8.4.2 | Lista de approvals com cards individuais? | |
| 8.4.3 | Botão de deletar (✕) pede confirmação? | |
| 8.4.4 | Status pode ser alterado (aprovar/rejeitar/deferir)? | |

### 8.5 Contexto (`/contexto`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.5.1 | Card de estado de foco com cor por severidade? | |
| 8.5.2 | Janela ativa, projeto inferido, projeto esperado visíveis? | |
| 8.5.3 | Confiança em %? | |
| 8.5.4 | CheckpointSuggestionBanner funcional? | |

### 8.6 Aurora Full-Screen (`/aurora`)
| # | Verificação | P/F/NA |
|---|-------------|--------|
| 8.6.1 | Tela cheia, sem shell (sidebar/hud/rail escondidos)? | |
| 8.6.2 | Histórico de mensagens carrega do sessionStorage? | |
| 8.6.3 | Comando "missão" retorna resposta contextual? | |
| 8.6.4 | Comando "próximo" retorna próxima ação? | |
| 8.6.5 | Comando "risco" lista riscos? | |
| 8.6.6 | Escape key volta para `/visao-geral`? | |
| 8.6.7 | Input tem navegação por histórico (ArrowUp/Down)? | |
| 8.6.8 | A sensação é de "oráculo" ou de "chatbot genérico"? | |

---

## SEÇÃO 9 — GLASSMORPHISM & ESTILO

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 9.1 | **Vidro é vidro mesmo?** | Painéis têm `backdrop-filter: blur()` visível — o fundo embaça atrás do painel? | |
| 9.2 | **Bordas sutis?** | `border: 1px solid var(--kr-glass-border)` — borda quase invisível mas presente? | |
| 9.3 | **Sombras de profundidade?** | Cards mais "altos" têm sombra maior? Existe hierarquia de elevação? | |
| 9.4 | **Cores são escuras/etéreas?** | Predomina azul escuro/roxo/ciano — consistente com "sci-fi light"? | |
| 9.5 | **Contraste aceitável?** | Texto legível sobre vidro? Nada "cinza sobre cinza"? | |

---

## SEÇÃO 10 — RESPONSIVO & TOQUE

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 10.1 | **Mobile (375px) não quebra?** | Reduzir viewport para 375px. Layout se adapta? Sidebar colapsa? | |
| 10.2 | **Tablet (768px) funcional?** | Layout usável em tablet? Mapa visível? | |
| 10.3 | **Touch targets >= 44px?** | Botões e itens clicáveis têm área suficiente? Usar DevTools para medir. | |
| 10.4 | **Sem scroll horizontal?** | Nenhuma largura de viewport causa barra de rolagem horizontal? | |

---

## SEÇÃO 11 — ESTADOS E ANIMAÇÕES

| # | Verificação | O que procurar | P/F/NA |
|---|-------------|----------------|--------|
| 11.1 | **Loading → Skeleton aparece?** | Recarregar página com backend offline. Aparecem skeletons cinza pulsando? | |
| 11.2 | **Erro → ErrorState visível?** | Com backend offline, mensagens de erro com botão "Tentar novamente"? | |
| 11.3 | **Vazio → EmptyState amigável?** | Páginas sem dados mostram mensagem + CTA, não tela branca? | |
| 11.4 | **Offline → Overlay amarelo/vermelho?** | Backend offline = banner colorido no topo? | |
| 11.5 | **Reconnecting → Feedback?** | "Reconectando..." visível quando backend volta? | |
| 11.6 | **Hover → Elevação sutil?** | Cards sobem 2-4px no hover? Transição suave? | |
| 11.7 | **Focus Mode funciona?** | Sidebar e rail dimmam para 40% opacidade? | |
| 11.8 | **prefers-reduced-motion respeitado?** | Ativar no DevTools. Animações desligam? | |

---

## RESUMO RÁPIDO

| Seção | Itens | Passou | Falhou | Nota |
|-------|-------|--------|--------|------|
| 1. Primeira Impressão | 4 | | | |
| 2. Mapa Mundi | 10 | | | |
| 3. Top HUD | 4 | | | |
| 4. Sidebar | 5 | | | |
| 5. Right Rail | 4 | | | |
| 6. Bottom Dock | 4 | | | |
| 7. Visão Geral | 6 | | | |
| 8. Páginas Secundárias | 24 | | | |
| 9. Glassmorphism | 5 | | | |
| 10. Responsivo | 4 | | | |
| 11. Estados & Animações | 8 | | | |
| **TOTAL** | **78** | | | |

---

## TOP 5 COISAS QUE DEVEM DOER VISUALMENTE (se doer, a auditoria está certa)

1. **Os "..." em Tarefas e Projetos na tela principal** — placeholder permanente no coração do produto.
2. **Os ícones unicode ◈ ◉ ☰ na sidebar** — parecem placeholder de protótipo, não produto final.
3. **A sidebar existindo ao lado do mapa** — dois sistemas de navegação competindo. Qual é o "de verdade"?
4. **Todas as páginas secundárias com a mesma cara** — glass panel + grid de cards. Onde está a identidade de cada região?
5. **Nada sobre dinheiro, perfis Instagram, ou pipeline comercial** — o negócio real está ausente.

---

**Ao terminar o checklist:** anexar screenshots dos piores offenders e comparar com referências visuais do ideal (Apple HIG, Zelda BOTW/TOTK sheikah slate UI, Mirror's Edge catalyst, interfaces de ficção científica com profundidade).
