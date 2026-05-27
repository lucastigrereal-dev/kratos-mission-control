---
id: prompt-engineering-swe
name: Prompt Engineering SWE
description: Templates de prompt de engenharia para o KRATOS — cada tipo de task tem estrutura comprovada que reduz ambiguidade, aumenta consistência e evita retrabalho.
tags: [prompts, engineering, templates, workflow]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P1
anthropic_principle: be-explicit — contexto + escopo + restrições + DoD em todo prompt técnico
---

# SKILL: Prompt Engineering SWE

## Propósito
Dar ao Lucas templates prontos e comprovados para interagir com o Claude Code no KRATOS. Cada template tem contexto, escopo, restrições e definição de sucesso — elimina ambiguidade e retrabalho.

## Quando Usar
- Iniciar qualquer task técnica nova
- Quando um prompt anterior gerou output fora do escopo
- Quando precisar garantir consistência entre sessões

## Templates

---

### 🏗️ CRIAR COMPONENTE
```
Crie o componente <Nome> em src/components/kratos/<dominio>/<Nome>.tsx

Contexto: <onde aparece, qual problema resolve>
Dados: <tipos TypeScript ou descrição do que recebe>
Hierarquia visual: <o que o olho deve ver primeiro>

Restrições:
- Tokens KRATOS: var(--kr-*) — zero hex inline
- Dark mode: dark-only (KRATOS é dark-first)
- Framer Motion: usar apenas em <especificar quando>
- Sem Redux/Zustand/stores globais

DoD:
- Loading + Empty + Error states
- Zero any em tipos
- bun run build passando
- Dark mode verificado
```

---

### 📄 CRIAR ROTA/TELA
```
Crie a rota /<nome> em src/routes/<nome>.tsx

Objetivo: <o que o usuário precisa fazer nesta tela>
Dados: <endpoint(s) que alimentam a tela>
Layout: <descrição de seções — não sidebar quadrada>

Restrições:
- Dados no loader — NUNCA useEffect para fetch
- routeTree.gen.ts é gerado, não editar
- Layout HUD-first: mundo ocupa o máximo
- shadcn/ui com tokens KRATOS (não raw)
- Framer Motion para entrada da página

DoD:
- Loading + Empty + Error states
- bun run build passando (routeTree.gen.ts atualizado)
- Dark mode verificado
- Mobile 375px sem quebra
```

---

### 🐛 CORRIGIR BUG
```
Corrija o bug em <arquivo:linha ou descrição>

Sintoma: <o que está acontecendo>
Esperado: <o que deveria acontecer>
Contexto: <quando ocorre, dados relevantes>

Restrições:
- Escopo mínimo: toque apenas o necessário
- Não refatorar código fora do bug
- Não alterar testes existentes que passam
- Não mexer em backend nesta task

DoD:
- Causa raiz identificada e documentada em comentário
- bun run build passando
- bun test passando
- Comportamento esperado verificado
```

---

### ⚡ REFATORAR COM SEGURANÇA
```
Refatore <arquivo ou componente> para <objetivo>

Motivação: <por que refatorar — performance, legibilidade, padrão>
Escopo: apenas <arquivos explícitos>

Restrições:
- Zero mudança de comportamento externo
- Testes existentes devem continuar passando
- Não adicionar features durante refactor
- Não mudar API pública do componente

DoD:
- bun run build passando
- bun test passando
- Diff revisado: zero mudança de comportamento
```

---

### 🎨 REVISAR UI
```
Faça QA visual de <componente ou rota>

Verificar:
- Tokens: zero hex inline, apenas var(--kr-*)
- Dark mode: funcional
- Mobile 375px: sem quebra
- Loading/Empty/Error: implementados
- Anti-slop: sem gradiente, grid simétrico, ícone circular
- Source badge: presente se dados de API
- Framer Motion: com prefers-reduced-motion

Output: relatório com arquivo:linha → ação para cada problema
```

---

### 🔌 IMPLEMENTAR INTEGRAÇÃO
```
Implemente integração com <serviço/endpoint>

Endpoint: <URL ou descrição>
Contrato: <schema Zod ou tipos esperados>
Uso: <qual componente vai consumir>

Restrições:
- Schema Zod em api-contract/<nome>.ts primeiro
- Hook em src/hooks/use<Nome>.ts
- KRATOS apenas lê — não dispara ações em <OMNIS/backend>
- Source badge obrigatório: live | cached | mock | offline
- Fallback para mock se endpoint indisponível

DoD:
- Schema validado
- Hook com loading/error/data
- Source badge no componente
- bun test passando
```

---

### 🚀 PREPARAR DEPLOY
```
Prepare o KRATOS para deploy em <ambiente>

Verificar:
- bun run build limpo
- bun test passando
- wrangler.jsonc válido (não executar deploy)
- Secrets Cloudflare documentados
- Variáveis de ambiente mapeadas

Restrições:
- NÃO executar wrangler deploy
- NÃO fazer push sem autorização explícita do Lucas
- Apenas preparar e documentar

Output: checklist de readiness com PASS/FAIL por item
```

## Princípio Anthropic Aplicado
Prompts com **contexto + escopo + restrições + DoD** reduzem:
- Outputs fora do escopo
- Retrabalho por ambiguidade
- Drift de arquitetura entre sessões
- Implementações que violam regras do projeto

## Saída Esperada
Template selecionado, preenchido com contexto específico, pronto para colar no Claude Code.
