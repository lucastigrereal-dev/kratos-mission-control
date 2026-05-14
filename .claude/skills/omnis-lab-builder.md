---
name: omnis-lab-builder
description: "Constrói a interface do laboratório OMNIS — painel de controle de skills, crews e execuções."
metadata:
  type: skill
  tier: strategy
  project: kratos-mission-control
  scope: frontend
  status: placeholder
  depends_on: omnis-agent-contracts
---

# omnis-lab-builder

Constrói a interface visual do OMNIS Lab — o painel onde o operador visualiza e supervisiona skills, crews e execuções.

## Estado atual
**PLACEHOLDER.** A página `/omnis` atualmente é estática (`OmnisPage.tsx`, 14 linhas):
```
"OMNIS — executor de acoes baseado em inteligencia Aurora.
Conecte o OMNIS para executar tarefas automaticamente com supervisao humana."
```

## Pré-requisitos (NÃO implementar antes disso)
1. Contratos OMNIS definidos (`omnis-agent-contracts`)
2. Backend OMNIS responder em endpoints reais (não mock)
3. Tasks e Projects 100% no SQLite (Regra Anti-Feijoada)

## O que este componente VAI precisar quando existir
- Lista de skills disponíveis com status (idle/running/done/failed)
- Painel de crew ativa com agentes e progresso
- Log de execuções recentes
- Botão "Executar skill" → chama endpoint OMNIS
- Botão "Parar crew" → chama endpoint OMNIS
- SourceBadge indicando fonte dos dados (real/mock/fallback)

## Regras
- NUNCA implementar antes dos pré-requisitos
- NUNCA criar endpoints — OMNIS expõe seus próprios contratos
- KRATOS apenas LÊ status do OMNIS, não comanda (ver KRATOS_OPERATING_MODEL.md §2)
- SEMPRE usar `useApi<T>()` para fetch, nunca fetch raw
