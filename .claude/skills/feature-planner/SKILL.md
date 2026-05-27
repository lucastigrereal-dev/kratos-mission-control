---
id: feature-planner
name: Feature Planner
description: Planeja features do KRATOS com tipo explícito, arquivos impactados, sequência e DoD — obrigatório antes de escrever código.
tags: [planning, architecture, feature, pre-implementation]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P0
anthropic_principle: plan-before-execute — toda tarefa não-trivial exige plano aprovado antes de implementação
---

# SKILL: Feature Planner

## Propósito
Garantir que toda feature nova tem plano explícito antes da primeira linha de código. Evita drift, retrabalho e violação de componentes protegidos.

## Quando Usar
- Qualquer feature nova no KRATOS
- Modificação significativa em componente existente
- Nova rota, nova ilha, novo domínio
- Quando escopo parecer nebuloso

## Quando NÃO Usar
- Correções < 5 linhas com causa raiz clara
- Hotfix de bug com caminho único óbvio

## Inputs
- Descrição da feature em linguagem natural
- Contexto: tela, fluxo, problema que resolve
- Urgência (se houver)

## Processo

### Passo 1 — Classificar o tipo
Feature no KRATOS é UMA dessas quatro coisas:

| Tipo | Exemplo | Árvore |
|---|---|---|
| Nova rota | `/forja`, `/arena` | `src/routes/` |
| Novo componente | `AdaptiveHud`, `AuroraOrb` | `src/components/kratos/<dominio>/` |
| Nova ilha | `Forja/Corpo`, `Tesouro` | `src/components/kratos/world/` |
| Nova integração | OMNIS status, ActivityWatch | `src/hooks/` + `api-contract/` |

**Nunca classificar como "feature visual" e mexer em backend.**
**Nunca classificar como "pequena" e pular o plano.**

### Passo 2 — Mapear arquivos exatos
```
CRIAR:
- src/components/kratos/<dominio>/<Componente>.tsx
- src/hooks/use<Feature>.ts  (se necessário)
- tests/<feature>.test.ts

MODIFICAR:
- src/routes/<rota>.tsx
- api-contract/<schema>.ts  (se endpoint novo)

PROTEGIDOS — não tocar sem autorização:
- src/routeTree.gen.ts       (gerado pelo Vite plugin)
- src/components/kratos/shell/*.tsx
- src/styles.css             (tokens — editar com cuidado)
```

### Passo 3 — Sequência por dependência
1. Schema Zod em `api-contract/` (se há endpoint novo)
2. Hook em `src/hooks/`
3. Componente(s) em `src/components/kratos/`
4. Rota em `src/routes/`
5. Testes
6. Gate: `bun run build` + `bun test`

### Passo 4 — Definition of Done específico
- [ ] `bun run build` limpo
- [ ] `bun test` passando
- [ ] Dark mode verificado
- [ ] Mobile 375px sem quebra
- [ ] Loading + Empty + Error states
- [ ] Zero botão decorativo (todo CTA tem handler)
- [ ] Zero hex inline (`var(--kr-*)` apenas)
- [ ] Source badge se componente exibe dado de API

### Passo 5 — Apresentar e aguardar aprovação
```
FEATURE PLAN: <nome>
Tipo:         rota | componente | ilha | integração
Objetivo:     <uma linha>
Arquivos:     <N> criar, <M> modificar
Sequência:    1. X → 2. Y → 3. Z
Riscos:       <riscos>
DoD:          <checklist específico>
```
**Aguardar "ok" explícito antes de implementar.**

## Critérios de Qualidade
- Plano cabe em < 40 linhas
- Cada arquivo com path completo a partir de `src/`
- Riscos nomeados, não ignorados
- Tipo da feature classificado explicitamente

## Anti-patterns
- "Vou organizar melhor o estado" sem definir o quê exatamente
- Ignorar componentes protegidos no plano
- Criar store global sem justificativa (proibido Redux/Zustand)
- Começar sem aprovação em features médias/grandes
- Classificar como "componente" e acabar criando rota também

## Saída Esperada
Plano aprovado em < 40 linhas: tipo, objetivo, arquivos, sequência, riscos, DoD.
