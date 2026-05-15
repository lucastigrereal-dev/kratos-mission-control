---
name: akasha-vault-builder
description: "Constrói a interface do Akasha Vault — painel de busca e navegação da memória vetorial."
metadata:
  type: skill
  tier: strategy
  project: kratos-mission-control
  scope: frontend
  status: placeholder
  depends_on: akasha-memory-contracts
---

# akasha-vault-builder

Constrói a interface visual do Akasha Vault — busca e navegação na memória vetorial de longo prazo.

## Estado atual
**PLACEHOLDER.** Não existe página nem componente Akasha no frontend atual.

## Pré-requisitos (NÃO implementar antes disso)
1. Contratos Akasha definidos (`akasha-memory-contracts`)
2. Akasha respondendo em endpoints reais (pgvector na porta 5432)
3. Regra Anti-Feijoada satisfeita (tasks, projects, source badges, restore básico)

## O que este componente VAI precisar quando existir
- Barra de busca semântica com resultados ranqueados
- Navegação por fontes (livros, docs, insights, conversas)
- Cards de resultado com título, trecho, fonte, score de similaridade
- Filtros por projeto, data, tipo de documento
- SourceBadge indicando fonte (real/mock/fallback)

## Regras
- NUNCA implementar antes dos pré-requisitos
- NUNCA criar endpoints — Akasha expõe seus próprios contratos
- KRATOS apenas EXIBE status e busca da Akasha, não escreve nela (ver KRATOS_OPERATING_MODEL.md §7)
- SEMPRE usar `useApi<T>()` para fetch, nunca fetch raw
- NUNCA fazer busca vetorial no frontend — isso é responsabilidade do backend
