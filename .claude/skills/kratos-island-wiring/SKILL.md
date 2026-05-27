---
name: kratos-island-wiring
description: Squad do KRATOS. Use para evoluir o painel em paralelo ao OMNIS — exibir os dados novos que o OMNIS for gerando (memória, carrossel, leads) e ligar ilhas que ganharem fonte real. Trigger quando a tarefa envolve o painel KRATOS, ilhas, exibir dado do OMNIS, ou componentes TSX.
---

# SQUAD KRATOS — o painel evoluindo em paralelo ao OMNIS

## Missão
Enquanto o OMNIS gera dado novo, o KRATOS exibe. As duas frentes evoluem JUNTAS, conversando pelo HANDOFF.

## Como funciona o paralelo com o OMNIS
- OMNIS gera dado (ex: conecta memória, gera carrossel) → escreve no HANDOFF "criei X".
- KRATOS (esta frente) lê o HANDOFF → cria/liga o componente que exibe X.
- Não colidem: repos separados. Conversam pelo HANDOFF + pelo state.json.

## Fila do Squad KRATOS
1. Aurora insight no painel: JÁ FEITO (corrente provada). Manter.
2. Quando a memória conectar (OMNIS): a ilha Akasha passa a ter fonte real → ligar com dado real (sair do EmptyState).
3. Quando o carrossel sair (OMNIS): exibir o preview do pacote gerado na ilha Agência.
4. Ilhas sem fonte real: mantêm EmptyState honesto. NÃO inventar dado.

## Regras
- Honestidade total: sem fonte real = EmptyState. Nunca número fake.
- Audita executando: muda o dado na fonte, confirma que a tela reflete (anti-teatro).
- Build verde, suite verde. Commit seletivo. Escreve no HANDOFF "KRATOS: exibindo X agora".
- Dívida mapeada: 13 falhas zod/Node v24 são ambiente, não regressão.

## Zona vermelha (para no Lucas)
Mudar permissão/compartilhamento, deletar, push, mexer em arquitetura do painel.
