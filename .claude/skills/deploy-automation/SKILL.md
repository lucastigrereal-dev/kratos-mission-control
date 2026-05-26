---
id: deploy-automation
name: Deploy Automation
description: Checklist e documentação de deploy do KRATOS para Cloudflare Workers — prepara, verifica e documenta sem executar sem autorização explícita.
tags: [deploy, cloudflare, wrangler, ci-cd]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P2
anthropic_principle: minimal-footprint — nunca executar deploy sem autorização explícita do Lucas
---

# SKILL: Deploy Automation

## Propósito
Preparar e verificar o KRATOS para deploy em Cloudflare Workers. NUNCA executa deploy automaticamente. Apenas prepara, documenta e entrega checklist.

## ⚠️ REGRA ABSOLUTA
```
NÃO executar: wrangler deploy
NÃO executar: bunx wrangler deploy
NÃO fazer push sem autorização do Lucas
Deploy = ação irreversível = autorização explícita SEMPRE
```

## Quando Usar
- Lucas pedir "prepara o deploy"
- Antes de qualquer release candidate
- Para documentar o processo atual
- Para auditar se wrangler.jsonc está correto

## Processo

### Passo 1 — Gate de qualidade
```bash
bun run build          # DEVE passar — zero erros
bun test               # DEVE passar — zero falhas
bun run lint           # zero erros novos
```
Se qualquer um falhar → **PARAR. Não continuar para deploy.**

### Passo 2 — Auditoria do wrangler.jsonc
Verificar:
```
[ ] name configurado?
[ ] compatibility_date atual?
[ ] D1 database ID real (não placeholder)?
[ ] KV namespace ID real (não placeholder)?
[ ] R2 bucket configurado (se necessário)?
[ ] Secrets declarados (não valores, apenas nomes)?
[ ] main/build/dist apontando para o correto?
```

### Passo 3 — Variáveis de ambiente
Listar todas as variáveis necessárias:
```
OBRIGATÓRIAS para funcionar:
- <lista de vars com descrição>

OPCIONAIS (features desabilitadas sem elas):
- <lista>

SECRETS (nunca em wrangler.jsonc, apenas no dashboard):
- <lista>
```

### Passo 4 — Checklist pré-deploy
```
PRÉ-DEPLOY CHECKLIST
Build:          [ ] PASS
Tests:          [ ] PASS
Lint:           [ ] PASS
wrangler.jsonc: [ ] válido
D1/KV IDs:      [ ] reais (não placeholders)
Secrets:        [ ] configurados no Cloudflare Dashboard
Branch:         [ ] main ou release branch
Working tree:   [ ] CLEAN
────────
Status: READY / BLOCKED (<motivo>)
```

### Passo 5 — Instruções manuais (se necessário)
```bash
# Lucas executa manualmente após aprovação:
cd kratos-mission-control
bun run build
bunx wrangler deploy --config dist/server/wrangler.json
```

## Ambientes
| Ambiente | Branch | Comando | Autorização |
|---|---|---|---|
| Preview | feature/* | wrangler deploy --env preview | Lucas |
| Staging | develop | wrangler deploy --env staging | Lucas |
| Production | main | wrangler deploy --env production | Lucas (explícita) |

## Anti-patterns
- Executar deploy sem checklist completo
- Fazer push para main sem gate de qualidade
- Committar secrets em wrangler.jsonc
- Deploy com working tree suja
- Deploy com testes falhando

## Saída Esperada
Checklist READY/BLOCKED com motivo, instruções manuais para Lucas executar.
