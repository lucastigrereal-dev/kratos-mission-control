# /modo-foco — Sessão de Foco KRATOS

Inicia sessão de trabalho focada: define missão, bloqueia escopo novo, entrega próxima ação.

## Uso
```
/modo-foco <objetivo da sessão>
```

## O que faz

**1. Estado do repo**
```bash
git status --short --branch
bun run build 2>&1 | tail -3
```

**2. Define missão da sessão**
```
MISSÃO: <objetivo em uma linha>
ESCOPO: apenas <arquivos/componentes permitidos>
FORA DO ESCOPO: <o que não abrir nesta sessão>
```

**3. Próxima ação única**
```
PRÓXIMA AÇÃO: <ação específica, não abstrata>
ESTIMATIVA: <small/medium/large>
```

**4. Checkpoint de saída**
Ao final da sessão, salvar:
```
CHECKPOINT — <timestamp>
Missão:    <o que estava fazendo>
Estado:    <onde parou>
Próximo:   <próximo passo para retomar>
Arquivos:  <arquivos em progresso>
```

## Regras da sessão
- Não abrir nova frente sem concluir a atual
- Não refatorar código fora do escopo
- Não instalar dependência sem decidir com Lucas
- Commit apenas com `bun run build` + `bun test` passando

## Gatilho de saída
Se desviar do escopo: parar, salvar checkpoint, reportar.
"Você saiu do escopo. Quer ajustar a missão ou voltar?"
