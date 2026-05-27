# /task-from-brief — Brief → Tasks Executáveis

Transforma um brief ou ideia em tasks concretas e priorizadas.

## Uso
```
/task-from-brief <brief ou descrição da ideia>
```

## Processo

**1. Entender o brief**
- Qual é o problema real?
- Qual é o resultado esperado?
- Qual é a urgência?

**2. Classificar por tipo**
- Visual/UI
- Dados/integração
- Bug/fix
- Infraestrutura/deploy
- Documentação

**3. Quebrar em tasks atômicas**
Cada task deve:
- Ter 1 responsabilidade
- Caber em 1 sessão (< 2h)
- Ter DoD claro
- Ter dependências explícitas

**4. Priorizar**
```
P0 — bloqueia tudo, fazer agora
P1 — importante, fazer hoje
P2 — importante, fazer esta semana
P3 — bom ter, backlog
```

**5. Output**
```
TASKS — <nome do brief>
────────
P0: [ ] <task 1> → DoD: <critério>
P0: [ ] <task 2> → DoD: <critério> (depende de task 1)
P1: [ ] <task 3> → DoD: <critério>
P2: [ ] <task 4> → DoD: <critério>
────────
Estimativa total: <small/medium/large>
Primeira ação: <task P0 mais simples>
```

## Regras
- Task P0 sem DoD claro → reclassificar ou detalhar
- Task sem owner implícito → Claude Code executa
- Task que exige autenticação manual → marcar `[LUCAS]`
- Task de deploy → marcar `[AUTORIZAÇÃO EXPLÍCITA]`
