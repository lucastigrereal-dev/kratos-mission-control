# /criar-feature — Nova Feature KRATOS

Antes de escrever uma linha de código, classifica e planeja a feature.

## Uso
```
/criar-feature <descrição da feature>
```

## Processo obrigatório

**Passo 1 — Classificar**
Qual tipo?
- [ ] Nova rota (`src/routes/`)
- [ ] Novo componente (`src/components/kratos/<dominio>/`)
- [ ] Nova ilha (`src/components/kratos/world/`)
- [ ] Nova integração (`src/hooks/` + `api-contract/`)

**Passo 2 — Plano (máx. 40 linhas)**
```
FEATURE: <nome>
Tipo:      <tipo>
Objetivo:  <uma linha>
Arquivos:  CRIAR: [...] | MODIFICAR: [...]
Sequência: 1. schema → 2. hook → 3. componente → 4. rota → 5. test
Riscos:    <riscos>
DoD:       build + test + dark mode + mobile + estados
```

**Passo 3 — Aguardar "ok" do Lucas**

**Passo 4 — Implementar em sequência**

**Passo 5 — Gate final**
```bash
bun run build
bun test
```

## Restrições
- SEMPRE `src/` — NUNCA `frontend/`
- NUNCA editar `routeTree.gen.ts`
- NUNCA stores globais (sem Redux/Zustand)
- NUNCA hex inline — usar `var(--kr-*)`
- NUNCA botão sem handler
- SEMPRE Loading + Empty + Error states
