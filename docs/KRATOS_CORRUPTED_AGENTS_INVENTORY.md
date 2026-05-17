# KRATOS — Inventario de Agents Corrompidos

Data: 2026-05-16

## Escopo

Auditoria restrita aos arquivos corrompidos relacionados a `kratos-data-layer.md` e `kratos-ui-builder.md`.

Nenhum arquivo foi apagado, renomeado ou movido. Os arquivos originais continuam em `.claude/`. Copias de preservacao foram criadas em `.claude/_quarantine_corrupted_agents_2026-05-16/`.

## Arquivos corrompidos encontrados

### 1. Nome corrompido relacionado a `kratos-data-layer.md`

- Nome exato: `agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-data-layer.md CUserslucaskratos-mission-control.claudeagents`
- Caminho original: `.claude/agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-data-layer.md CUserslucaskratos-mission-control.claudeagents`
- Caminho em quarentena: `.claude/_quarantine_corrupted_agents_2026-05-16/agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-data-layer.md CUserslucaskratos-mission-control.claudeagents`
- Tamanho: `609` bytes
- SHA256: `E759550A5A5F500A57BAB311E642B45EC2C646655BF002A842F65EE7AD7B2342`

Primeira parte do conteudo:

```md
# Agente: Kratos API Builder

## Papel
Constrói endpoints Hono em src/server.ts e lógica em backend/.

## Regras
- Sempre validar entrada com Zod (api-contract/)
- Resposta padrão: { data: T | null, error: string | null }
- Endpoints prefixados /api/
- Usar c.env para variáveis — nunca process.env
- NUNCA ler .env ou secrets
- NUNCA fazer deploy ou push
```

Analise:

- Parece duplicata: sim. O hash e o tamanho batem com `.claude/agents/kratos-api-builder.md`.
- Parece comando quebrado: sim. O nome contem fragmento de comando `&& cp` e caminhos de origem/destino concatenados.
- Existe versao limpa de `kratos-data-layer.md`: sim, em `.claude/agents/kratos-data-layer.md`.
- Recomendacao: manter em quarentena por enquanto; depois remover com autorizacao explicita, porque o conteudo nao e o Data Layer e sim uma duplicata do API Builder com nome corrompido.

### 2. Nome corrompido relacionado a `kratos-ui-builder.md`

- Nome exato: `agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-ui-builder.md CUserslucaskratos-mission-control.claudeagents`
- Caminho original: `.claude/agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-ui-builder.md CUserslucaskratos-mission-control.claudeagents`
- Caminho em quarentena: `.claude/_quarantine_corrupted_agents_2026-05-16/agents && cp CUserslucasDownloadsKRATOS_PACK_REVIEWkratos-pack.claudeagentskratos-ui-builder.md CUserslucaskratos-mission-control.claudeagents`
- Tamanho: `529` bytes
- SHA256: `3468EA531BEC9265232F1F29D34A72AC28E02DB505022DE5F1572111362E411B`

Primeira parte do conteudo:

````md
# Agente: Kratos Architect

## Papel
Agente de planejamento e arquitetura. Não escreve código de produto.

## Quando convocar
- Antes de iniciar qualquer frente nova
- Para decidir onde arquivos devem viver
- Para revisar PRs de arquitetura

## Prompt base
```
````

Analise:

- Parece duplicata: sim. O hash e o tamanho batem com `.claude/agents/kratos-architect.md`.
- Parece comando quebrado: sim. O nome contem fragmento de comando `&& cp` e caminhos de origem/destino concatenados.
- Existe versao limpa de `kratos-ui-builder.md`: sim, em `.claude/agents/kratos-ui-builder.md`.
- Recomendacao: manter em quarentena por enquanto; depois remover com autorizacao explicita, porque o conteudo nao e o UI Builder e sim uma duplicata do Architect com nome corrompido.

## Versoes limpas confirmadas

| Arquivo limpo | Tamanho | Primeira linha | SHA256 |
|---|---:|---|---|
| `.claude/agents/kratos-data-layer.md` | `549` | `# Agente: Kratos Data Layer` | `52F4C9060575019A8417D9E8D7DE82721651D34E4F261B18EEE6F191E613C900` |
| `.claude/agents/kratos-ui-builder.md` | `731` | `# Agente: Kratos UI Builder` | `DCF61DE7B5F549824A9559F1C414C86A5D36B30A10CAB06722BC67D12940E244` |

## Conclusao

Os dois arquivos corrompidos parecem ter sido criados por uma tentativa de copiar agents a partir de `C:\Users\lucas\Downloads\KRATOS_PACK_REVIEW\kratos-pack\.claude\agents\...`, mas o comando foi incorporado ao nome do arquivo.

Eles nao parecem conter conteudo unico necessario para recuperar `kratos-data-layer.md` ou `kratos-ui-builder.md`, porque as versoes limpas existem em `.claude/agents/`.

Recomendacao operacional: manter a quarentena ate o ambiente Git/EPERM ser estabilizado; depois remover os dois originais corrompidos somente com autorizacao explicita.
