# KRATOS_WORLD_MAP_SPEC_PARA_MANUS.md

Spec extraída dos mockups visuais do KRATOS CONTROL para implementação zero-ambíguidade.

---

## BLOCO 1 — INVENTÁRIO VISUAL COMPLETO

### Sidebar / HUD Lateral Esquerdo
- **Container Sidebar**: Posição left:0, top:100px, bottom:0. Largura ~220px. Fundo azul escuro translúcido (~#0f2a5e com alpha). Borda direita sutil.
- **Avatar + Título (topbar left)**: Fora da sidebar, mas no cluster esquerdo. Círculo com tigre, texto "Bom dia, Lucas! 👋", "KRATOS CONTROL", tagline.
- **Itens de Menu** (12 itens): Cada um com ícone quadrado/circular à esquerda, texto branco, padding ~12px 16px.
- **Item Ativo**: Fundo azul mais claro (~#1e40af) com indicador de seleção (brilho lateral ou bg diferente).

### Topbar / HUD Superior
- **Container**: Topo fixo, largura 100%, altura ~90-100px. Fundo azul escuro ~#0a1628 ou gradiente.
- **User Cluster Esquerdo**: Avatar redondo (tigre), stack de textos.
- **Stats Cluster Centro**: 4 badges de estatísticas + logo central.
- **Aurora Cluster Direito**: Card compacto da Aurora no canto superior direito.

### Central Viewport / Cenário Isométrico
- **Fundo**: Céu azul com nuvens brancas, ilhas flutuantes com grama verde, terra marrom, água azul profundo ao redor.
- **Personagem**: Avatar humano (capa vermelha, cabelo castanho, emblema "K" nas costas) — visível apenas no World Map (Visão Geral).
- **Estruturas de Ilha**: Cada ilha possui plataforma circular ou irregular de terra/grama, edifício temático central, tubos/rochas/vegetação decorativa.
- **Pontes**: Pontes de madeira/pedra conectando ilhas ao hub central.

### Right Panel / Painel Direito
- **Container**: Posição right:0, top:100px, bottom:0 (ou abaixo da topbar). Largura ~320-340px. Fundo azul escuro translúcido similar ao sidebar.
- **Widgets empilhados** verticalmente com gap ~16px e padding interno.

### Player de Música (Rodapé Esquerdo)
- **Container**: Posição bottom-left, largura ~300px, altura ~70px. Fundo azul escuro ~#0f2a5e, cantos arredondados ~12px.
- **Ícone**: Nota musical em quadrado arredondado ~40x40px, fundo roxo/azul gradiente.
- **Textos**: "TRILHA SONORA", nome da música, artista.
- **Scrubber**: Linha fina com knob circular.
- **Controles**: botões <<, ||, >>.

### Elementos de Estado & Badges
- **Status Online**: Círculo verde (#22c55e) ~8px, com texto "Online" verde.
- **Progress Bars**: Barras horizontais com fundo cinza/azul escuro e preenchimento colorido (verde, laranja, vermelho).
- **Checkboxes/Círculos de conclusão**: Círculos verdes com check branco para itens completos; círculos cinza/vazios para pendentes.
- **Badges de integração**: Cards quadrados ~60x60px com logo do serviço e label "Conectado" em verde.

---

## BLOCO 2 — MAPA DE ILHAS (World Map)

Baseado no mockup **VISÃO GERAL** (Image 3). Ilhas dispostas ao redor de um hub central.

### 1. HUB CENTRAL — Castelo KRATOS
- **Posição**: Centro da viewport (~50%, ~50%).
- **Visual**: Castelo medieval com telhados vermelhos/laranja, bandeiras azuis, brasão dourado com "K".
- **Label**: Banner vertical azul escrito:
  - "MISSÃO ATUAL"
  - "CONSTRUIR O FUTURO"
  - "ENQUANTO VIVO O PRESENTE"
- **Personagem**: Avatar humano em pé no hub, encarando o castelo.
- **Cor dominante**: Cinza pedra, vermelho telhado, dourado emblema.
- **Conexões**: Pontes partem daqui para todas as ilhas periféricas.
- **Interativo**: Sim — centro do universo.

### 2. OMNIS LAB
- **Posição**: Topo-esquerda (~20%, ~25%).
- **Visual**: Estação tecnológica com laptop/computador aberto, tela exibindo rosto de robô azul.
- **Label**: "OMNIS LAB" / "Automações e IAs" / "Painel de Controle".
- **Cor dominante**: Azul tecnológico, cinza metálico.
- **Conexão**: Ponte de madeira/pedra até o hub central.
- **Interativo**: Sim.

### 3. AGÊNCIA / ESTÚDIO
- **Posição**: Meio-esquerda (~15%, ~48%).
- **Visual**: Estúdio de gravação com espelho de camarim, luzes, arara de roupas, câmera.
- **Label**: "AGÊNCIA" / "Conteúdo, Marca e Marketing".
- **Cor dominante**: Laranja/marrom madeira, verde tela.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 4. AKASHA / MEMÓRIA
- **Posição**: Topo-direita (~80%, ~20%).
- **Visual**: Templo grego/branco com colunas, livros e pergaminhos.
- **Label**: "AKASHA" / "Banco de Conhecimento" / "Memória e Arquivos".
- **Cor dominante**: Branco/cinza mármore, dourado detalhes.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 5. FILOSOFIA & SABEDORIA
- **Posição**: Meio-direita (~75%, ~45%).
- **Visual**: Templo grego aberto com sábio barbudo (avatar estilo filósofo) ensinando duas crianças sentadas em bancos de madeira.
- **Label**: "FILOSOFIA" / "Aprendizado, Filosofia e Evolução Pessoal".
- **Cor dominante**: Branco/cinza pedra, verde grama, marrom roupas.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 6. TESOURO / FINANÇAS
- **Posição**: Meio-direita/baixa (~78%, ~65%).
- **Visual**: Ilha com cofre de metal cinza (símbolo $ dourado), moedas empilhadas, personagem pato estilo "Tio Patinhas" sentado no ouro.
- **Label**: "FINANÇAS" / "Finanças Pessoais e Investimentos".
- **Cor dominante**: Dourado, cinza metal, verde grama.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 7. OBSERVATÓRIO
- **Posição**: Baixo-direita (~70%, ~78%).
- **Visual**: Observatório com cúpula azul/branca, telescópio apontado para cima, prancheta com desenho de lâmpada (ideia).
- **Label**: "OBSERVATÓRIO" / "Ideias, Inovações e Inspirações".
- **Cor dominante**: Azul cúpula, cinza pedra.
- **Conexão**: Ponte até o hub central (ou às finanças).
- **Interativo**: Sim.

### 8. FORJA / CORPO
- **Posição**: Baixo-centro (~48%, ~80%).
- **Visual**: Forja com bigorna, fogo/chamas, pesos de academia/barra de ferro, equipamentos de treino.
- **Label**: "FORJA" / "Treino, Saúde e Disciplina".
- **Cor dominante**: Cinza metal, laranja fogo, marrom terra.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 9. VILA VIVA
- **Posição**: Baixo-esquerda (~22%, ~75%).
- **Visual**: Casas pequenas de madeira/tijolo, área de playground (gangorra), cenário familiar.
- **Label**: "VILA VIVA" / "Família, Filhos e Vida Real".
- **Cor dominante**: Laranja telhado, verde grama, marrom madeira.
- **Conexão**: Ponte até o hub central.
- **Interativo**: Sim.

### 10. ARENA COMERCIAL
- **Posição**: Baixo-esquerda (~12%, ~85%).
- **Visual**: Coliseu/arena romana com personagem guerreiro (capacete, escudo com estrela dourada, espada).
- **Label**: "ARENA COMERCIAL" / "Vendas, Negociação e Conquistas".
- **Cor dominante**: Areia/dourado, cinza pedra, vermelho telhado.
- **Conexão**: Ponte até a Vila Viva ou hub central.
- **Interativo**: Sim.

### 11. NIMBUS
- **Posição**: Flutuante abaixo do hub (~55%, ~92%).
- **Visual**: Nuvem branca solta com vassoura mágica encostada.
- **Label**: "NIMBUS" / "Sua vassoura mágica. Vá para onde precisar."
- **Cor dominante**: Branco nuvem, azul céu.
- **Conexão**: NENHUMA PONTE VISÍVEL — ilha isolada/flutuante.
- **Interativo**: Sim — parece botão de "navegação rápida/viagem".

---

## BLOCO 3 — HUD LATERAL ESQUERDO

**Container**: Painel vertical fixo à esquerda.  
**Dimensões estimadas**: Largura ~220px, altura 100% da viewport abaixo da topbar.  
**Fundo**: Azul escuro translúcido (~rgba(15, 42, 94, 0.9)). Borda direita sutil azul claro. Cantos arredondados no topo direito e inferior direito (~16px).  
**Tipografia**: Labels em maiúsculas, branco #ffffff, ~13-14px, peso semibold.  
**Separadores**: Nenhum separador explícito visível; itens empilhados com espaçamento uniforme.

### Itens do Menu (de cima para baixo):

1. **VISÃO GERAL**
   - Ícone: 🏠 Casa/Home estilizada em amarelo/dourado.
   - Estado: **ATIVO** no mockup da Visão Geral (fundo azul claro selecionado).
   - Badge: Nenhum.

2. **OMNIS LAB** (ou apenas "OMNIS" na visão simplificada)
   - Ícone: 🤖 Cabeça de robô com olhos azuis brilhantes.
   - Estado: Ativo no mockup do Omnis Lab (bg selecionado ~#1e3a8a, destaque roxo).
   - Badge: Nenhum.

3. **AGÊNCIA / ESTÚDIO**
   - Ícone: 🎬 Claquete de cinema com estrela dourada.
   - Estado: Ativo no mockup da Agência (bg selecionado laranja/vermelho).
   - Badge: Nenhum.

4. **AKASHA / MEMÓRIA**
   - Ícone: 📚/🏛️ Cofre/cripta verde com detalhes dourados (visão detalhada) ou templo (visão simplificada).
   - Estado: Inativo.
   - Badge: Nenhum.

5. **FILOSOFIA & SABEDORIA**
   - Ícone: 🧠 Cérebro rosa/rosa.
   - Estado: Inativo.

6. **TESOURO / FINANÇAS**
   - Ícone: 💰/📦 Baú verde com símbolo de dinheiro/dólar dourado.
   - Estado: Inativo.

7. **FORJA / CORPO**
   - Ícone: 🏋️/⚒️ Bigorna com halteres em laranja/dourado.
   - Estado: Inativo.

8. **VILA VIVA**
   - Ícone: 🏡 Casa amarela/laranja com detalhes acolhedores.
   - Estado: Inativo.

9. **ARENA COMERCIAL**
   - Ícone: 🛡️/🏆 Escudo vermelho com estrela dourada.
   - Estado: Inativo.

10. **OBSERVATÓRIO**
    - Ícone: 👨‍🚀/🔭 Rosto de astronauta ou telescópio em cinza/azul.
    - Estado: Inativo.

11. **NIMBUS**
    - Ícone: ☁️/🌪️ Nuvem ou redemoinho em branco/azul claro.
    - Estado: Inativo.

12. **CONFIGURAÇÕES**
    - Ícone: ⚙️ Engrenagem cinza.
    - Estado: Inativo.

### Indicador de Ativo
O item ativo possui:
- Fundo de destaque azul mais claro (~#1e3a8a).
- Possível borda esquerda ou glow sutil (não explicitamente visível, mas contraste de fundo claro).

---

## BLOCO 4 — HUD SUPERIOR (TOPBAR)

**Dimensões**: Altura estimada ~90-100px. Largura 100%.  
**Fundo**: Gradiente ou sólido azul muito escuro (~#080f1f ou #0a1628), possivelmente com blur/leve transparência.  
**Layout**: 3 clusters (Esquerda, Centro, Direita).

### Cluster Esquerdo
- **Avatar**: Círculo ~50x50px com ilustração de tigre sorridente (listras laranja/preto, fundo amarelo/dourado).
- **Saudação**: "Bom dia, Lucas! 👋" — texto branco, ~14px, peso regular.
- **Título do Sistema**: "KRATOS CONTROL" — texto branco, ~18-20px, peso **bold**, all caps.
- **Tagline**: "Seu mundo. Sua missão. Seu legado." — texto cinza claro/azulado, ~11-12px, peso light.

### Cluster Centro (Stats & Logo)
Disposição horizontal simétrica em torno do logo central:

1. **ENERGIA**
   - Ícone: ⚡ Raio amarelo/dourado.
   - Label: "ENERGIA" — cinza claro, ~10px, uppercase.
   - Valor: "87%" — amarelo/dourado, ~18px, bold.

2. **NÍVEL**
   - Ícone: ⭐ Estrela dourada.
   - Label: "NÍVEL" — cinza claro, ~10px, uppercase.
   - Valor: "47" — amarelo/dourado, ~18px, bold.

3. **LOGO CENTRAL**
   - Visual: Brasão/escudo dourado com "K" central preto/dourado e tigre no topo.
   - Tamanho: ~60x70px (maior que os stats).

4. **XP**
   - Ícone: 💎 Diamante roxo/lilás.
   - Label: "XP" — cinza claro, ~10px, uppercase.
   - Valor: "32.780" — branco ou roxo claro, ~18px, bold.

5. **HORA / DATA**
   - Ícone: 🕐 Relógio amarelo/dourado.
   - Label: "HORA" (ou implícito).
   - Valor Hora: "09:42" — branco, ~18px, bold.
   - Valor Data: "Terça, 21 de Maio" — cinza claro, ~11px, abaixo da hora.

### Cluster Direito (Aurora Compacta)
- **Widget Aurora**: Card arredondado (~12px) azul escuro, largura ~200px, altura ~60px.
- **Avatar**: Miniatura da personagem Aurora (cabelo azul, headset) ~35x35px.
- **Status**: Círculo verde "ONLINE" + texto verde.
- **Título**: "AURORA" — branco/ciano, bold.
- **Texto**: Variável por tela (ver Bloco 5/18).

---

## BLOCO 5 — PAINEL DIREITO (AURORA / SQUADS / AGENDA)

**Dimensões**: Largura estimada ~320-340px. Fundo azul escuro ~rgba(15, 30, 70, 0.85). Padding interno ~16px. Gap entre widgets ~16px.  
**Observação**: O conteúdo do painel direito muda conforme a ilha selecionada. Abaixo estão os widgets identificados em cada visão.

### Widgets na Visão Geral (World Map)

1. **AURORA WIDGET**
   - Título: "AURORA" com badge verde "ONLINE".
   - Texto: "Estou aqui para te ajudar a focar no que realmente importa hoje."
   - Botão/Link: "Falar com Aurora" com ícone de som/microfone.
   - Fundo: Azul escuro ~#0f2a5e com borda sutil.

2. **FOCO DO DIA**
   - Título: "FOCO DO DIA" — laranja/dourado, bold.
   - Itens:
     - ⭐ "3 tarefas importantes"
     - ⭐ "2 projetos em andamento"
     - ✅ "1 reunião marcada"
     - 🎯 "Foco principal: Construir o futuro"
   - Ícones coloridos à esquerda, texto branco.

3. **PROGRESSO GERAL**
   - Título: "PROGRESSO GERAL" — laranja/dourado.
   - Gráfico: Anel circular (donut) azul ciano (#38bdf8) em ~78% preenchido.
   - Valor: "78%" em branco grande, centralizado no donut.
   - Label: "Do mês concluído" em cinza abaixo.

4. **CITAÇÃO DO DIA**
   - Título: "CITAÇÃO DO DIA" — laranja/dourado.
   - Texto: "Disciplina é a ponte entre metas e realização."
   - Autor: "- Jim Rohn"
   - Avatar: Miniatura do Jim Rohn à direita (personagem idoso com óculos, terno).
   - Fundo: Azul escuro.

5. **AGENDA DE HOJE**
   - Título: "AGENDA DE HOJE" — laranja/dourado.
   - Eventos:
     - 🕐 10:00 "Reunião Omnis Lab"
     - 📞 14:30 "Call Comercial"
     - ❤️ 16:00 "Tempo com Laura e Apolo"
   - Horários em branco/ciano, títulos em branco.
   - Link: "Ver agenda completa →"

6. **SQUADS**
   - Título: "SQUADS" — cinza claro, pequeno.
   - Avatares circulares ~40px em fileira horizontal:
     - Aurora (azul)
     - Omnis (robô)
     - Agência (personagem feminino)
     - Yemilla (personagem masculino)
     - "Novo Squad" botão circular com "+".

### Widgets na Visão OMNIS LAB

1. **RESUMO DO LAB**
   - Título: "RESUMO DO LAB" — branco, bold.
   - 4 mini-cards em grid 2x2 ou row:
     - "AGENTES ATIVOS" → "15" grande + "Online" verde
     - "AUTOMAÇÕES" → "23" + "Executando" verde + ícone robô
     - "WORKFLOWS" → "8" + "Ativos" roxo
     - "EXECUÇÕES HOJE" → "156" + "+12% vs ontem" verde
   - Fundo: Azul escuro, cards internos com bg levemente diferente.

2. **AGENTES ATIVOS**
   - Título: "AGENTES ATIVOS" com link "Ver todos".
   - Lista vertical de 5 itens:
     - Omnis Core — "Orquestrador Principal" — 🟢 Online
     - Aurora AI — "Mentora & Inteligência" — 🟢 Online
     - Scribe Bot — "Documentação & Registro" — 🟢 Online
     - Insight Bot — "Análises & Relatórios" — 🟢 Online
     - Builder Bot — "Desenvolvimento & Código" — 🟢 Online
   - Cada item: avatar robô redondo ~30px, nome em branco bold, role em cinza, status verde à direita.

3. **AUTOMAÇÕES EM ANDAMENTO**
   - Título: "AUTOMAÇÕES EM ANDAMENTO" com link "Ver todos".
   - Itens com barra de progresso:
     - 📷 "Post Instagram → Reels → Stories" — 76% (barra verde/limão)
     - 📊 "Relatório Semanal de Performance" — 62% (barra verde/amarela)
     - 💾 "Backup Inteligente de Projetos" — 45% (barra laranja)
     - 📡 "Coleta de Métricas (IA)" — 33% (barra vermelha/laranja)
   - Porcentagens à direita em branco.

4. **WORKFLOWS ATIVOS**
   - Título: "WORKFLOWS ATIVOS" com link "Ver todos".
   - Lista com ícones roxos e status verde:
     - "Fluxo de Automação de Leads" — Executando
     - "Onboarding de Clientes" — Executando
     - "Zap: Leads → CRM → Follow Up" — Executando
     - "Relatório Diário de Vendas" — Executando
   - Ícone de lightning/task roxo à esquerda, texto branco, status verde à direita.

### Widgets na Visão AGÊNCIA / ESTÚDIO

1. **FOCO DO DIA** (variação Agência)
   - Título: "FOCO DO DIA" — vermelho/laranja.
   - Itens com checks:
     - ⭐ "Gravar 2 videos" ✅
     - ⭐ "Publicar 1 post" ✅
     - ⭐ "Roteiro YouTube" ✅
     - ⭐ "Campanha e-mail" ⬜ (não concluído)
   - Rodapé: "3/4 concluídas" + barra de progresso laranja.
   - Ícone de alvo 🎯 decorativo à direita.

2. **DESEMPENHO GERAL**
   - Título: "DESEMPENHO GERAL" — vermelho/laranja.
   - 3 colunas de métricas:
     - 👁️ "Alcance" — "124K" — "+18%" verde
     - ❤️ "Engajamento" — "11,2K" — "+24%" verde
     - 👆 "Cliques" — "2.340" — "+12%" verde
   - Valores grandes em branco/azul, labels cinza.
   - Link: "Ver relatório completo →"

3. **CALENDÁRIO DE CONTEÚDO**
   - Título: "CALENDÁRIO DE CONTEÚDO" — vermelho/laranja.
   - Grid de dias: SEG TER QUA QUI SEX SÁB DOM
   - Números: 19 20 **21** (destaque laranja, dia atual) 22 23 24 25
   - Dots coloridos abaixo de alguns dias (verde, roxo, laranja) indicando status/conteúdo.
   - Link: "Ver calendário completo →"

4. **IDEIAS EM ANDAMENTO**
   - Título: "IDEIAS EM ANDAMENTO" — vermelho/laranja.
   - Lista com barras:
     - 💡 "Série: Bastidores do KRATOS" — 75% (verde)
     - 💡 "Reels: Dicas rápidas" — 50% (laranja)
     - 💡 "Vídeo: Como uso IA" — 30% (vermelho)
   - Link: "Ver todas as ideias →"
   - Ícone de lâmpada 💡 decorativo.

### Widgets Inferiores Globais (Barra de Economia/Saúde/Integrações)
Estes aparecem na parte inferior central/direita da tela, sobrepondo levemente o cenário.

**ECONOMIA RECENTES**
- Título: "ECONOMIA RECENTES" com link "Esta semana".
- Ícone: Relógio/roxo.
- Destaque: "12h 45m" em branco grande.
- Sub: "Tempo economizado com automações".
- Badge: "+18% vs semana passada" em verde.

**SAÚDE DO SISTEMA**
- Título: "SAÚDE DO SISTEMA" com link "Ver detalhes".
- Donut grande verde: "98%".
- Sub: "Sistema Operacional" / "Excelente".
- Lista de checks:
  - 🟢 Banco de Dados — Online
  - 🟢 Servidores — Online
  - 🟢 APIs & Integrações — Online
  - 🟢 IA & Processos — Online

**INTEGRAÇÕES ATIVAS**
- Título: "INTEGRAÇÕES ATIVAS" com link "Ver todas".
- Grid 4x2 de cards quadrados ~60x70px:
  - n8n — Conectado (verde)
  - Make — Conectado (verde)
  - Notion — Conectado (verde)
  - Slack — Conectado (verde)
  - Google Drive — Conectado (verde)
  - Supabase — Conectado (verde)
  - OpenAI — Conectado (verde)
  - [+] Adicionar — Cinza/clique para adicionar.

---

## BLOCO 6 — PLAYER DE MÚSICA (Rodapé)

**Posição**: Fixo bottom-left, flutuando acima do fundo. margin-left ~16px, margin-bottom ~16px.  
**Dimensões**: Largura ~300px, altura ~75px. Cantos arredondados ~16px.  
**Fundo**: Azul escuro opaco ~#0f2a5e. Borda sutil.

### Elementos Internos
- **Capa/Ícone**: Quadrado arredondado ~42x42px à esquerda. Fundo gradiente roxo/azul. Ícone branco: nota musical ♪.
- **Rótulo**: "TRILHA SONORA" — cinza claro, ~9px, uppercase.
- **Faixa**: Nome da música em branco, ~13px, bold. Varia por tela:
  - Visão Geral: "Koopa Road" / "Super Mario 64"
  - Omnis Lab: "Future Is Now" / "Imagine Dragons"
  - Agência: "On Top of the World" / "Imagine Dragons"
- **Scrubber/Progresso**: Linha horizontal fina (~2px) cinza escuro com preenchimento azul/branco até ~40%. Knob circular invisível ou muito pequeno.
- **Tempo**: "1:32 / 3:20" (ou /3:45) — cinza, ~10px, à direita da scrubber.
- **Controles**: 3 botões na base:
  - ⏮ Anterior (skip back)
  - ⏸ Pause (duas barras verticais)
  - ⏭ Próximo (skip forward)
- **Estado**: Play ativo (mostra pause), não visível estado stopped.

---

## BLOCO 7 — PERSONAGEM / AVATAR CENTRAL

### World Map (Visão Geral)
- **Posição**: Centro do hub (~50% horizontal, ~55% vertical), em pé na plataforma central.
- **Visual**: Menino/jovem de costas para o jogador/usuário. Cabelo castanho/marrom. Usa uma capa vermelha/vinho com emblema dourado "K" nas costas. Calças escuras. Botas marrons.
- **Direção**: Olhando para o castelo central (para cima/topo da tela).
- **Ação**: Estático, em pose de contemplação/heroísmo.
- **Animação**: Nenhuma visível (mockup estático), mas postura sugere idle com leve movimento de capa se animado.

### Ilha OMNIS LAB
- **Personagens**: Robôs pequenos brancos com olhos azuis (~5-6 robôs). Nenhum humano.
- **Posição**: Espalhados pela ilha em estações de trabalho.

### Ilha AGÊNCIA / ESTÚDIO
- **Personagem Central**: Menino sentado à mesa central com laptop cinza (emblema "K" no laptop). Moletom laranja com capuz.
- **Posição**: Centro da ilha, de frente para o usuário (olhando para cima/tela).
- **Outros Personagens**:
  - Garota de cabelo roxo/roxo-rosa, sentada à mesa de design, usando tablet. Moletom roxo.
  - Garoto de cabelo castanho/verde, sentado à mesa de design. Moletom verde.
- **Animação**: Estáticos, poses de trabalho.

---

## BLOCO 8 — TIPOGRAFIA OBSERVADA

| Texto de Exemplo | Tamanho Estimado | Peso | Cor | Uso |
|---|---|---|---|---|
| "KRATOS CONTROL" | ~20-24px | Bold (700) | #ffffff | Título do sistema no topbar |
| "Bom dia, Lucas! 👋" | ~14px | Regular (400) | #ffffff | Saudação usuário |
| "Seu mundo. Sua missão..." | ~11-12px | Light (300) | #94a3b8 | Tagline sistema |
| "OMNIS LAB" / "AGÊNCIA" | ~24-28px | Bold (700) | #ffffff | Título da tela/ilha ativa |
| "O cérebro automático..." | ~13-14px | Regular (400) | #cbd5e1 | Subtítulo descritivo da ilha |
| "87%" / "47" / "32.780" | ~18-20px | Bold (700) | #fbbf24 / #ffffff | Valores estatísticos topbar |
| "ENERGIA" / "NÍVEL" / "XP" | ~10-11px | SemiBold (600) | #94a3b8 | Labels de stats |
| "VISÃO GERAL" / "OMNIS LAB" | ~12-13px | SemiBold (600) | #ffffff | Menu lateral |
| "AURORA" / "FOCO DO DIA" | ~14-16px | Bold (700) | #38bdf8 / #f97316 | Títulos de widgets direito |
| "15" / "23" / "8" / "156" | ~28-32px | Bold (700) | #ffffff | Números grandes dashboard |
| "Online" / "Executando" | ~10-11px | Medium (500) | #22c55e | Status badges |
| "Disciplina é a ponte..." | ~13px | Regular (400) | #e2e8f0 | Citação |
| "- Jim Rohn" | ~12px | Italic/Medium | #94a3b8 | Autor citação |
| "12h 45m" | ~32px | Bold (700) | #ffffff | Destaque economia |
| "09:42" | ~18px | Bold (700) | #ffffff | Hora topbar |

**Fonte inferida**: Família sans-serif geométrica e arredondada (estilo Nunito, Varela Round, ou similar). Nenhuma serif visível.

---

## BLOCO 9 — PALETA DE CORES EXTRAÍDA

| Local / Elemento | Hex Estimado | Descrição | Frequência |
|---|---|---|---|
| Fundo oceano/céu | #0a1628 a #1e3a8a | Azul profundo, quase preto-azulado | DOMINANTE |
| HUD Sidebar/Panel | #0f2a5e / rgba(15,42,94,0.9) | Azul escuro translúcido | DOMINANTE |
| Texto primário | #ffffff | Branco puro | DOMINANTE |
| Texto secundário/muted | #94a3b8 | Azul acinzentado | FREQUENTE |
| Destaque dourado/amarelo | #fbbf24 | Âmbar/Dourado | ACENTO |
| Destaque laranja | #f97316 / #ea580c | Laranja vivo | ACENTO (Agência) |
| Destaque roxo/lilás | #a855f7 / #c084fc | Roxo mágico/tecno | ACENTO (Omnis) |
| Destaque ciano/Aurora | #38bdf8 | Azul claro brilhante | ACENTO (Aurora/Online) |
| Verde status/sucesso | #22c55e | Verde esmeralda | ACENTO (Online/Progresso) |
| Fundo ilha grama | #4ade80 / #16a34a | Verde grama | DOMINANTE (cenário) |
| Terra/pedra ilha | #a16207 / #92400e | Marrom terra | DOMINANTE (cenário) |
| Tubulações Omnis | #a855f7 | Roxo neon/brilhante | ACENTO (Omnis Lab) |
| Vermelho capa/arena | #dc2626 / #ef4444 | Vermelho vivo | ACENTO (personagem/arena) |
| Preto/dark UI | #020617 | Azul muito escuro (sombras) | DOMINANTE |

---

## BLOCO 10 — GRID E LAYOUT

1. **Colunas visuais**: 3 colunas principais.
   - Coluna 1 (Sidebar): ~220px fixo.
   - Coluna 2 (Viewport Central): Fluido, ocupando espaço restante (calc(100% - 220px - 340px)).
   - Coluna 3 (Right Panel): ~320-340px fixo.

2. **Larguras estimadas**:
   - Sidebar: 220px.
   - Center: ~60-65% da largura total em resolução desktop grande.
   - Right Panel: 340px.

3. **Header fixo (Topbar)**:
   - Altura estimada: ~90-100px.
   - Comportamento: Fixo no topo, z-index alto.
   - Largura: 100% da viewport.

4. **Footer fixo**:
   - Nenhum footer tradicional visível.
   - **Player de música**: Flutuante bottom-left, não full-width.

5. **Mapa / Viewport**:
   - O cenário isométrico ocupa toda a área central, sem margens internas visíveis (full bleed dentro da coluna central).
   - As ilhas do World Map ocupam ~80% da altura/width do viewport central, flutuando no centro.

6. **Tamanho das ilhas**:
   - VARIADOS. O hub central (castelo) é o maior. Finanças, Agência, Akasha são grandes. Nimbus é pequeno. Vila e Arena são médias.

---

## BLOCO 11 — NAVEGAÇÃO INFERIDA

1. **Clique em uma ilha do World Map**:
   - Navega para a **tela interior da ilha** (ex: clicar em Omnis Lab abre a visão do laboratório isométrico).
   - Transição sugerida: zoom-in na ilha, trocando o cen central.
   - Ilha ativa no sidebar deve refletir a seleção.

2. **Menu Lateral**:
   - Navegação **primária**. Seleciona a ilha/seção correspondente.
   - Clicar em um item inativo muda o cenário central e o painel direito contextual.

3. **Breadcrumb / Indicador de posição**:
   - **AUSENTE** visivelmente. Não há "Você está em > Omnis Lab".
   - A indicação de local se dá apenas pelo item ativo no sidebar e pelo título grande no centro.

4. **Tabs / Abas**:
   - **NÃO HÁ TABS SUPERIORES** visíveis.
   - Dentro de uma ilha, a navegação é feita por estações/áreas temáticas no cenário isométrico (ex: "AGENTES IA", "AUTOMAÇÕES", "WORKFLOWS" dentro do Omnis Lab).

5. **Ícones inferiores de Squad**:
   - Na visão Agência, há uma barra de avatares no bottom-center. Parecem ser **atalhos para filtros ou visões de squad**, não navegação principal.

---

## BLOCO 12 — COMPONENTES REUTILIZÁVEIS IDENTIFICADOS

| Componente | Onde Aparece | Variações Visíveis |
|---|---|---|
| **StatBadge** | Topbar (Energia, Nível, XP, Hora) | Com/Sem data; cores de ícone (amarelo, roxo, branco) |
| **MenuItem** | Sidebar esquerdo | Estado ativo/inativo; ícone custom; comprimento de label varia |
| **WidgetPanel** | Painel direito (todos) | Título colorido variável; conteúdo interno customizável |
| **IslandNode** | World Map | 10+ variações visuais; tamanhos variados; com/sem ponte |
| **ProgressBar** | Automacões, Ideias, Foco | Cores dinâmicas (verde→laranja→vermelho) conforme % |
| **AgentCard** | Omnis Lab > Agentes | Avatar robô + Nome + Role + Badge Online |
| **EventRow** | Agenda | Ícone + Hora + Título; cor de ícone variável |
| **MusicPlayer** | Rodapé esquerdo (global) | Estado play/pause; metadados trocáveis |
| **AuroraWidget** | Topbar direito / Painel direito | Compacto (topbar) vs Expandido (painel direito) |
| **SquadAvatar** | Painel direito / Barra inferior | Círculo com imagem; último item é botão "+" |
| **IntegrationCard** | Integrações Ativas | Logo do serviço + label "Conectado" verde; último é "Adicionar" |
| **StatusDot** | Agentes, Servidores | Verde "Online" padrão; possivelmente outras cores em estados não vistos |

---

## BLOCO 13 — ESTADOS VISÍVEIS

- **Sidebar Ativo vs Inativo**:
  - Ativo: Fundo azul claro ~#1e3a8a, possível glow.
  - Inativo: Fundo transparente/azul escuro, texto branco sem destaque.

- **Status Online**:
  - Visual: Círculo verde sólido #22c55e (~8px diâmetro) + texto "Online".
  - Aplicado a: Aurora, Agentes de IA, Sistema, Servidores.

- **Progresso Completo/Parcial**:
  - Completo (100%): Check verde em círculo.
  - Parcial (76%, 62%, etc): Barra preenchida proporcionalmente.
  - Baixo progresso (<50%): Barra laranja/vermelha.

- **Tarefas Concluídas vs Pendentes**:
  - Concluído: Ícone check verde ✅.
  - Pendente: Ícone estrela cinza ou círculo vazio ⬜.

- **Hover/Destaque**:
  - NÃO VISÍVEL em mockup estático, mas inferido: ilhas provavelmente elevam/brilham no hover.

---

## BLOCO 14 — O QUE CLARAMENTE NÃO ESTÁ NO MOCKUP

- **Telas de Login/Autenticação**: Nenhuma tela de entrada.
- **Modo Escuro/Claro Toggle**: Apenas um tema escuro está representado.
- **Notificações/Bell Icon**: Nenhum ícone de notificação global visível.
- **Busca/Search Bar**: Nenhum campo de busca no topo.
- **Perfil do Usuário**: Avatar do tigre é fixo; não há dropdown de "Meu Perfil", "Sair".
- **Configurações Detalhadas**: O menu "CONFIGURAÇÕES" existe, mas sua tela interna não foi mockada.
- **Telas de Akasha, Forja, Vila, Arena, Observatório, Nimbus**: Apenas as ilhas no World Map existem; seus interiores isométricos NÃO foram desenhados.
- **Animações/Transições**: Mockups são estáticos. Não há specs de motion entre ilhas.
- **Responsividade**: Apenas layout desktop widescreen (~1920px) está representado. Não há tablet/mobile.
- **Gestão de Erros**: Nenhum estado de erro, loading skeleton, ou empty state foi desenhado.
- **Chat com Aurora**: Botão "Falar com Aurora" existe, mas a interface do chat não foi mockada.
- **Modal/Overlay**: Nenhum modal visível (ex: confirmação, formulário).

---

## BLOCO 15 — SPEC TEXTUAL DAS ILHAS (para a Manus implementar)

### ILHA: HUB_CENTRAL_CASTELO
- **Posição**: x: 50%, y: 52% do canvas central.
- **Tamanho**: W: ~280px, H: ~320px (incluindo plataforma).
- **Ícone/visual**: Castelo medieval com 4 torres, telhados vermelhos, bandeiras azuis, brasão dourado "K".
- **Label**: "MISSÃO ATUAL" (banner); "CONSTRUIR O FUTURO" (título); "ENQUANTO VIVO O PRESENTE" (sub).
- **Sublabel**: N/A — é o ponto de spawn do personagem.
- **Cor de fundo da ilha**: Cinza pedra, marrom madeira, vermelho telhado.
- **Hover state sugerido**: Escala 1.05, glow dourado sutil ao redor do brasão.
- **On click**: Navega para tela de "Missão Atual" (não mockada) ou abre modal da jornada.
- **Conexão com**: Todas as ilhas periféricas por pontes de madeira/pedra.

### ILHA: OMNIS_LAB
- **Posição**: x: 22%, y: 28%.
- **Tamanho**: W: ~200px, H: ~180px.
- **Ícone/visual**: Laptop aberto gigante com tela de robô azul, antenas, teclado visível.
- **Label**: "OMNIS LAB".
- **Sublabel**: "Automações e IAs" / "Painel de Controle".
- **Cor de fundo da ilha**: Grama verde, plataforma rochosa azulada.
- **Hover state sugerido**: Brilho roxo (#a855f7) nas bordas, tela do laptop pulsa.
- **On click**: Navega para `/omnis` — tela interior do laboratório isométrico.
- **Conexão com**: Hub Central (ponte superior-esquerda).

### ILHA: AGENCIA
- **Posição**: x: 16%, y: 50%.
- **Tamanho**: W: ~220px, H: ~200px.
- **Ícone/visual**: Estúdio com espelho de camarim com luzes, câmera no tripé, arara de roupas, cadeira vermelha.
- **Label**: "AGÊNCIA".
- **Sublabel**: "Conteúdo, Marca e Marketing".
- **Cor de fundo da ilha**: Grama verde, deck de madeira marrom.
- **Hover state sugerido**: Luzes do camarim acendem (amarelo quente), play button brilha.
- **On click**: Navega para `/agencia` — tela interior do estúdio criativo.
- **Conexão com**: Hub Central (ponte esquerda).

### ILHA: AKASHA
- **Posição**: x: 78%, y: 24%.
- **Tamanho**: W: ~200px, H: ~190px.
- **Ícone/visual**: Templo clássico com colunas brancas, livros empilhados, cristal/disco dourado no topo.
- **Label**: "AKASHA".
- **Sublabel**: "Banco de Conhecimento" / "Memória e Arquivos".
- **Cor de fundo da ilha**: Grama verde, mármore branco/cinza.
- **Hover state sugerido**: Brilho dourado no cristal, livros flutuam levemente.
- **On click**: Navega para `/akasha` — não mockado.
- **Conexão com**: Hub Central (ponte superior-direita).

### ILHA: FILOSOFIA
- **Posição**: x: 74%, y: 48%.
- **Tamanho**: W: ~220px, H: ~200px.
- **Ícone/visual**: Templo aberto com colunas, bancos de madeira, personagem sábio barbudo ensinando 2 crianças.
- **Label**: "FILOSOFIA".
- **Sublabel**: "Aprendizado, Filosofia e Evolução Pessoal".
- **Cor de fundo da ilha**: Grama verde, pedra cinza claro.
- **Hover state sugerido**: Aura dourada ao redor do sábio, pergaminhos brilham.
- **On click**: Navega para `/filosofia` — não mockado.
- **Conexão com**: Hub Central (ponte direita).

### ILHA: FINANCAS
- **Posição**: x: 80%, y: 66%.
- **Tamanho**: W: ~210px, H: ~200px.
- **Ícone/visual**: Cofre metálico cinza com cifrão dourado, moedas empilhadas, personagem pato rico sentado.
- **Label**: "FINANÇAS".
- **Sublabel**: "Finanças Pessoais e Investimentos".
- **Cor de fundo da ilha**: Grama verde, dourado moedas.
- **Hover state sugerido**: Moedas brilham, cofre vibra levemente.
- **On click**: Navega para `/financas` — não mockado.
- **Conexão com**: Hub Central (ponte direita-inferior).

### ILHA: OBSERVATORIO
- **Posição**: x: 72%, y: 78%.
- **Tamanho**: W: ~190px, H: ~180px.
- **Ícone/visual**: Cúpula de observatório azul/branca, telescópio grande, prancheta com desenho de lâmpada.
- **Label**: "OBSERVATÓRIO".
- **Sublabel**: "Ideias, Inovações e Inspirações".
- **Cor de fundo da ilha**: Grama verde, cinza pedra.
- **Hover state sugerido**: Lâmpada na prancheta acende amarela, telescópio gira levemente.
- **On click**: Navega para `/observatorio` — não mockado.
- **Conexão com**: Hub Central (ou Finanças) via ponte inferior-direita.

### ILHA: FORJA
- **Posição**: x: 48%, y: 82%.
- **Tamanho**: W: ~200px, H: ~190px.
- **Ícone/visual**: Bigorna preta, fogueira laranja acesa, pesos de academia, martelo.
- **Label**: "FORJA".
- **Sublabel**: "Treino, Saúde e Disciplina".
- **Cor de fundo da ilha**: Grama verde, cinza pedra, laranja fogo.
- **Hover state sugerido**: Faíscas laranja saltam, metal brilha.
- **On click**: Navega para `/forja` — não mockado.
- **Conexão com**: Hub Central (ponte inferior).

### ILHA: VILA_VIVA
- **Posição**: x: 24%, y: 76%.
- **Tamanho**: W: ~200px, H: ~180px.
- **Ícone/visual**: Casinha de telhado laranja, gangorra, árvores, cenário campestre.
- **Label**: "VILA VIVA".
- **Sublabel**: "Família, Filhos e Vida Real".
- **Cor de fundo da ilha**: Grama verde, marrom terra, laranja telhado.
- **Hover state sugerido**: Fumaça sutil da chaminé, gangorra balança.
- **On click**: Navega para `/vila` — não mockado.
- **Conexão com**: Hub Central (ponte inferior-esquerda).

### ILHA: ARENA_COMERCIAL
- **Posição**: x: 14%, y: 86%.
- **Tamanho**: W: ~220px, H: ~200px.
- **Ícone/visual**: Coliseu redondo de pedra/bege, personagem gladiador/guerreiro com escudo estrela dourada e espada.
- **Label**: "ARENA COMERCIAL".
- **Sublabel**: "Vendas, Negociação e Conquistas".
- **Cor de fundo da ilha**: Areia/dourado, pedra bege, verde grama externo.
- **Hover state sugerido**: Tochas acendem, guerreiro levanta escudo.
- **On click**: Navega para `/arena` — não mockado.
- **Conexão com**: Vila Viva e/ou Hub Central (ponte inferior-longa).

### ILHA: NIMBUS
- **Posição**: x: 56%, y: 94%.
- **Tamanho**: W: ~120px, H: ~100px (menor ilha).
- **Ícone/visual**: Nuvem branca fofa solta, vassoura mágica encostada.
- **Label**: "NIMBUS".
- **Sublabel**: "Sua vassoura mágica. Vá para onde precisar."
- **Cor de fundo da ilha**: Branco nuvem, azul céu (ilha flutuante isolada).
- **Hover state sugerido**: Nuvem pulsa, brilho mágico azul ao redor da vassoura.
- **On click**: Abre **modal/menu de navegação rápida** ou teleporte para ilha.
- **Conexão com**: NENHUMA — ilha isolada, sem ponte.

---

## BLOCO 16 — SPEC DO TOPBAR HUD

Correção do wireframe baseado nos mockups reais:

```jsx
<Topbar height="90px" bg="#0a1628">
  <LeftCluster width="auto" padding="16px">
    <UserAvatar 
      src="tiger_avatar.png" 
      size="50px" 
      border="2px solid #fbbf24" 
    />
    <TextStack>
      <Greeting fontSize="14px" color="#ffffff">Bom dia, Lucas! 👋</Greeting>
      <Title fontSize="20px" fontWeight="700" color="#ffffff">KRATOS CONTROL</Title>
      <Subtitle fontSize="11px" color="#94a3b8">Seu mundo. Sua missão. Seu legado.</Subtitle>
    </TextStack>
  </LeftCluster>

  <CenterCluster flex="1" justify="center" gap="24px">
    <StatBadge 
      icon={<LightningIcon color="#fbbf24" />}
      label="ENERGIA"
      value="87%"
      valueColor="#fbbf24"
      labelColor="#94a3b8"
    />
    <StatBadge 
      icon={<StarIcon color="#fbbf24" />}
      label="NÍVEL"
      value="47"
      valueColor="#fbbf24"
      labelColor="#94a3b8"
    />
    
    <LogoBadge 
      shieldColor="#fbbf24"
      letterColor="#000000"
      icon={<TigerHeadMini />}
      size="60px"
    />

    <StatBadge 
      icon={<DiamondIcon color="#a855f7" />}
      label="XP"
      value="32.780"
      valueColor="#ffffff"
      labelColor="#94a3b8"
    />
    <StatBadge 
      icon={<ClockIcon color="#fbbf24" />}
      label="HORA"
      value="09:42"
      subValue="Terça, 21 de Maio"
      valueColor="#ffffff"
      subValueColor="#94a3b8"
      labelColor="#94a3b8"
    />
  </CenterCluster>

  <RightCluster width="auto" padding="16px">
    <AuroraCompactWidget 
      avatar="aurora_blue_headset.png"
      name="AURORA"
      status="ONLINE"
      statusColor="#22c55e"
      bg="#0f2a5e"
      borderRadius="12px"
      padding="8px 16px"
    />
  </RightCluster>
</Topbar>
```

**Observações adicionais**:
- O `LogoBadge` central é um escudo heráldico dourado com a letra "K" preta e uma cabeça de tigre estilizada no topo do brasão.
- O stat de HORA possui uma sublinha de data menor, diferente dos outros stats.
- O `LeftCluster` é empilhado verticalmente (avatar alinhado à esquerda dos textos).
- O `RightCluster` (Aurora) pode alternar entre modo compacto (topbar) e modo expandido (quando painel direito não existe). Nos mockups atuais, ele aparece no topbar quando o painel direito é contextual (Omnis/Agência), mas no World Map ele também está presente. Confirmado: está sempre no topbar.

---

## BLOCO 17 — SPEC DO SIDEBAR

Lista exata e completa do sidebar, do mockup detalhado (Image 1 / Image 2), que exibe os nomes completos:

```jsx
<Sidebar width="220px" bg="rgba(15,42,94,0.9)" top="90px">
  <MenuItem 
    icon={<HomeIcon color="#fbbf24" />}
    label="VISÃO GERAL"
    href="/"
    active={false} // exceto no World Map
  />
  <MenuItem 
    icon={<RobotFaceIcon color="#38bdf8" />}
    label="OMNIS LAB"
    href="/omnis"
    active={true} // no mockup Omnis
  />
  <MenuItem 
    icon={<ClapperboardStarIcon color="#f97316" />}
    label="AGÊNCIA / ESTÚDIO"
    href="/agencia"
    active={true} // no mockup Agência
  />
  <MenuItem 
    icon={<BookTempleIcon color="#22c55e" />}
    label="AKASHA / MEMÓRIA"
    href="/akasha"
  />
  <MenuItem 
    icon={<BrainIcon color="#ec4899" />}
    label="FILOSOFIA & SABEDORIA"
    href="/filosofia"
  />
  <MenuItem 
    icon={<MoneyChestIcon color="#22c55e" />}
    label="TESOURO / FINANÇAS"
    href="/financas"
  />
  <MenuItem 
    icon={<AnvilDumbbellIcon color="#f97316" />}
    label="FORJA / CORPO"
    href="/forja"
  />
  <MenuItem 
    icon={<HouseHeartIcon color="#fbbf24" />}
    label="VILA VIVA"
    href="/vila"
  />
  <MenuItem 
    icon={<ShieldStarIcon color="#ef4444" />}
    label="ARENA COMERCIAL"
    href="/arena"
  />
  <MenuItem 
    icon={<TelescopeIcon color="#94a3b8" />}
    label="OBSERVATÓRIO"
    href="/observatorio"
  />
  <MenuItem 
    icon={<CloudBroomIcon color="#38bdf8" />}
    label="NIMBUS"
    href="/nimbus"
  />
  <MenuItem 
    icon={<GearIcon color="#64748b" />}
    label="CONFIGURAÇÕES"
    href="/configuracoes"
  />
</Sidebar>
```

**Estado Ativo**:
Quando `active={true}`, o `MenuItem` recebe:
- `background: #1e3a8a` (azul realce)
- `borderLeft: 3px solid #fbbf24` (inferido como padrão de destaque, embora não explicitamente visível, o contraste sugere necessidade de marcador)
- `fontWeight: 600`

**Observação**: No mockup da Visão Geral (Image 3), os labels aparecem ligeiramente encurtados (ex: "OMNIS" ao invés de "OMNIS LAB"). Priorizar os nomes completos do mockup detalhado (Images 1 e 2) como canonical.

---

## BLOCO 18 — SPEC DO PAINEL DIREITO

### World Map View (Visão Geral)

```jsx
<RightPanel width="340px" bg="rgba(10,30,60,0.85)" padding="16px" gap="16px">
  
  <WidgetCard>
    <Header>
      <Title color="#38bdf8">AURORA</Title>
      <Badge color="#22c55e">● ONLINE</Badge>
    </Header>
    <Text color="#cbd5e1">Estou aqui para te ajudar a focar no que realmente importa hoje.</Text>
    <Button variant="ghost" icon={<WaveIcon />}>Falar com Aurora</Button>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">FOCO DO DIA</Title>
    <List>
      <Item icon="⭐" color="#fbbf24">3 tarefas importantes</Item>
      <Item icon="⭐" color="#fbbf24">2 projetos em andamento</Item>
      <Item icon="✅" color="#22c55e">1 reunião marcada</Item>
      <Item icon="🎯" color="#38bdf8">Foco principal: Construir o futuro</Item>
    </List>
  </WidgetCard>

  <WidgetCard align="center">
    <Title color="#f97316">PROGRESSO GERAL</Title>
    <CircularProgress 
      value={78} 
      size="100px" 
      stroke="#38bdf8" 
      track="#1e3a8a"
    />
    <BigText color="#ffffff">78%</BigText>
    <SubText color="#94a3b8">Do mês concluído</SubText>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">CITAÇÃO DO DIA</Title>
    <Quote color="#e2e8f0">"Disciplina é a ponte entre metas e realização."</Quote>
    <Author color="#94a3b8">- Jim Rohn</Author>
    <Avatar src="jim_rohn.png" position="right" />
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">AGENDA DE HOJE</Title>
    <EventList>
      <Event icon="📅" time="10:00" title="Reunião Omnis Lab" />
      <Event icon="📞" time="14:30" title="Call Comercial" />
      <Event icon="❤️" time="16:00" title="Tempo com Laura e Apolo" />
    </EventList>
    <Link color="#38bdf8">Ver agenda completa →</Link>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316" size="small">SQUADS</Title>
    <AvatarRow>
      <SquadAvatar name="Aurora" src="aurora.png" />
      <SquadAvatar name="Omnis" src="omnis.png" />
      <SquadAvatar name="Agência" src="agencia.png" />
      <SquadAvatar name="Yemilla" src="yemilla.png" />
      <AddSquadButton icon="+" />
    </AvatarRow>
  </WidgetCard>

</RightPanel>
```

### Omnis Lab View

```jsx
<RightPanel>
  <WidgetCard>
    <Title color="#ffffff">RESUMO DO LAB</Title>
    <StatsGrid columns={2}>
      <Stat label="AGENTES ATIVOS" value="15" sub="● Online" subColor="#22c55e" />
      <Stat label="AUTOMAÇÕES" value="23" icon={<BotIcon />} sub="● Executando" subColor="#22c55e" />
      <Stat label="WORKFLOWS" value="8" sub="● Ativos" subColor="#a855f7" />
      <Stat label="EXECUÇÕES HOJE" value="156" sub="+12% vs ontem" subColor="#22c55e" />
    </StatsGrid>
  </WidgetCard>

  <WidgetCard>
    <Header>
      <Title color="#ffffff">AGENTES ATIVOS</Title>
      <Link>Ver todos</Link>
    </Header>
    <AgentList>
      <Agent name="Omnis Core" role="Orquestrador Principal" status="Online" />
      <Agent name="Aurora AI" role="Mentora & Inteligência" status="Online" />
      <Agent name="Scribe Bot" role="Documentação & Registro" status="Online" />
      <Agent name="Insight Bot" role="Análises & Relatórios" status="Online" />
      <Agent name="Builder Bot" role="Desenvolvimento & Código" status="Online" />
    </AgentList>
  </WidgetCard>

  <WidgetCard>
    <Header>
      <Title color="#ffffff">AUTOMAÇÕES EM ANDAMENTO</Title>
      <Link>Ver todos</Link>
    </Header>
    <ProgressList>
      <ProgressItem name="Post Instagram → Reels → Stories" pct={76} color="#4ade80" />
      <ProgressItem name="Relatório Semanal de Performance" pct={62} color="#4ade80" />
      <ProgressItem name="Backup Inteligente de Projetos" pct={45} color="#f97316" />
      <ProgressItem name="Coleta de Métricas (IA)" pct={33} color="#ef4444" />
    </ProgressList>
  </WidgetCard>

  <WidgetCard>
    <Header>
      <Title color="#ffffff">WORKFLOWS ATIVOS</Title>
      <Link>Ver todos</Link>
    </Header>
    <WorkflowList>
      <Workflow name="Fluxo de Automação de Leads" status="Executando" />
      <Workflow name="Onboarding de Clientes" status="Executando" />
      <Workflow name="Zap: Leads → CRM → Follow Up" status="Executando" />
      <Workflow name="Relatório Diário de Vendas" status="Executando" />
    </WorkflowList>
  </WidgetCard>

</RightPanel>
```

### Agência View

```jsx
<RightPanel>
  <WidgetCard>
    <Title color="#f97316">FOCO DO DIA</Title>
    <TaskList>
      <Task icon="⭐" label="Gravar 2 videos" done={true} />
      <Task icon="⭐" label="Publicar 1 post" done={true} />
      <Task icon="⭐" label="Roteiro YouTube" done={true} />
      <Task icon="⭐" label="Campanha e-mail" done={false} />
    </TaskList>
    <Footer>
      <ProgressBar value={75} color="#f97316" />
      <Text>3/4 concluídas</Text>
    </Footer>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">DESEMPENHO GERAL</Title>
    <MetricsRow>
      <Metric label="Alcance" value="124K" delta="+18%" />
      <Metric label="Engajamento" value="11,2K" delta="+24%" />
      <Metric label="Cliques" value="2.340" delta="+12%" />
    </MetricsRow>
    <Link color="#38bdf8">Ver relatório completo →</Link>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">CALENDÁRIO DE CONTEÚDO</Title>
    <WeekGrid highlight={21}>
      <Day label="SEG" num={19} dots={["green"]} />
      <Day label="TER" num={20} dots={["purple"]} />
      <Day label="QUA" num={21} dots={["orange"]} active={true} />
      <Day label="QUI" num={22} dots={[]} />
      <Day label="SEX" num={23} dots={["green"]} />
      <Day label="SÁB" num={24} dots={[]} />
      <Day label="DOM" num={25} dots={["purple"]} />
    </WeekGrid>
  </WidgetCard>

  <WidgetCard>
    <Title color="#f97316">IDEIAS EM ANDAMENTO</Title>
    <ProgressList>
      <ProgressItem name="Série: Bastidores do KRATOS" pct={75} color="#4ade80" />
      <ProgressItem name="Reels: Dicas rápidas" pct={50} color="#f97316" />
      <ProgressItem name="Vídeo: Como uso IA" pct={30} color="#ef4444" />
    </ProgressList>
  </WidgetCard>
</RightPanel>
```
