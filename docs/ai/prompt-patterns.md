# KRATOS — Prompt Patterns para Engenharia

Templates prontos. Cole, preencha os `<>` e mande.

---

## 🏗️ Criar Componente

```
Crie o componente <Nome> em src/components/kratos/<dominio>/<Nome>.tsx

Contexto: <onde aparece — qual tela, qual posição>
Propósito: <o que resolve para o usuário>
Dados: <tipos TypeScript ou descrição do que recebe como props>
Hierarquia visual: <o que o olho deve ver primeiro — 1 ação primária>

Restrições:
- Tokens: var(--kr-*) apenas — zero hex inline
- KRATOS é dark-only — não criar light mode
- Framer Motion apenas se há transição de entrada/saída
- Zero any em tipos
- Named export (não default)

DoD:
- Loading state com Skeleton (não spinner genérico)
- Empty state com título + ação sugerida
- Error state com mensagem útil
- bun run build passando
- Nenhum botão decorativo
```

---

## 📄 Criar Rota/Tela

```
Crie a rota /<nome> em src/routes/<nome>.tsx

Objetivo: <o que o usuário precisa fazer/ver nesta tela>
Dados necessários: <endpoint(s), hook(s) ou store(s)>
Layout: <descrição das seções — sem sidebar quadrada>

Restrições:
- Dados no loader — NUNCA useEffect para fetch de rota
- routeTree.gen.ts é gerado automaticamente — não editar
- Layout HUD-first: mundo/conteúdo ocupa o máximo da tela
- shadcn/ui sempre com tokens KRATOS (não raw)
- Framer Motion na entrada da página (opacity 0→1, 0.2s)
- SEMPRE em src/routes/ — NUNCA em frontend/

DoD:
- Loading + Empty + Error states
- bun run build passando (routeTree.gen.ts atualizado)
- Dark mode verificado
- Mobile 375px sem quebra horizontal
- Source badge se exibe dado de API
```

---

## 🐛 Corrigir Bug

```
Corrija o bug: <sintoma observado>

Contexto:
- Arquivo/componente afetado: <caminho>
- Quando ocorre: <reprodução>
- Comportamento esperado: <o que deveria acontecer>
- Últimas mudanças: <commits ou arquivos recentes>

Processo exigido:
1. Verificar estado sem mudar nada (git log, bun build)
2. Classificar tipo (TypeScript, runtime, visual, dados, SSE)
3. Formular hipótese de causa raiz
4. Confirmar hipótese sem mudar código
5. Fix mínimo apenas no arquivo causador
6. Verificar: bun run build + bun test

Restrições:
- Escopo mínimo — não refatorar fora do bug
- Não adicionar features durante o fix
- Comentário de causa: // Fix: <causa em uma linha>

DoD:
- Causa raiz identificada e documentada
- bun run build passando
- bun test passando
- Bug reproduzido → confirmado corrigido
```

---

## 🔌 Integração com Serviço Externo

```
Implemente integração read-only com <serviço>

Endpoint: <URL ou descrição>
Dados esperados: <descrição ou tipos>
Consumidor: <qual componente vai usar>

Processo:
1. Schema Zod em api-contract/<nome>.schema.ts primeiro
2. Hook em src/hooks/use<Nome>.ts usando useApi<T>()
3. Source badge obrigatório: live | cached | mock | offline
4. Fallback se endpoint indisponível (não quebrar o frontend)
5. Testes em tests/stores/<nome>.test.ts

Restrições:
- KRATOS apenas lê — zero POST/PUT/DELETE sem autorização
- Zero fetch() raw — usar useApi<T>() sempre
- Sem process.env — usar c.env no servidor
- Fallback explícito se offline

DoD:
- Schema Zod validando
- Hook com loading/error/data/source
- Source badge visível no componente
- bun test passando (schema + fallback)
```

---

## 🎨 Revisar / Polir UI

```
Faça QA visual completo em <componente ou rota>

Verificar e corrigir:
[ ] Tokens: zero hex inline, apenas var(--kr-*)
[ ] Família legada: zero var(--kratos-*) → migrar para var(--kr-*)
[ ] Dark mode: funcional (dark-only no KRATOS)
[ ] Mobile 375px: sem scroll horizontal
[ ] Loading state: Skeleton com forma real (não spinner)
[ ] Empty state: título + descrição + ação
[ ] Error state: mensagem útil + possível ação
[ ] Anti-slop: sem gradiente decorativo, ícone circular, grid simétrico
[ ] Framer Motion: duração ≤ 0.3s, prefers-reduced-motion verificado
[ ] Source badge: presente se dados de API
[ ] Hierarquia visual: 1 elemento dominante por bloco

Output: lista arquivo:linha → ação para cada problema encontrado
```

---

## ⚡ Refatorar com Segurança

```
Refatore <arquivo ou componente> para <objetivo>

Motivação: <por que refatorar — performance, padrão, legibilidade>
Escopo exato: apenas <arquivos listados>

Restrições:
- Zero mudança de comportamento externo
- Zero nova feature durante refactor
- Zero mudança de API pública do componente
- Testes existentes devem continuar passando

Sequência:
1. Rodar bun test antes — baseline
2. Refatorar em pequenos passos
3. bun test após cada passo
4. bun run build ao final

DoD:
- bun run build passando
- bun test passando (mesmo número de testes)
- Diff revisado: zero mudança de comportamento
- Sem console.log no código
```

---

## 🚀 Preparar Deploy (sem executar)

```
Prepare o KRATOS para deploy — NÃO executar wrangler deploy

Verificar:
1. bun run build — deve passar limpo
2. bun test — deve passar
3. wrangler.jsonc — sem placeholders de ID
4. Secrets necessários — listar para Lucas configurar no dashboard
5. Variáveis de ambiente — mapear todas

Output esperado:
- Checklist READY/BLOCKED com motivo por item
- Lista de secrets que Lucas precisa configurar manualmente
- Comando exato para Lucas executar após aprovação

Restrições:
- NÃO executar wrangler deploy
- NÃO fazer push sem autorização explícita
- Deploy = ação irreversível = Lucas decide
```

---

## 🗺️ Mapear Repositório

```
Faça um mapeamento rápido do estado atual do KRATOS

Verificar:
1. git status + git log --oneline -10
2. bun run build (estado do build)
3. bun test (estado dos testes)
4. Rotas existentes em src/routes/
5. Componentes em src/components/kratos/
6. Hooks em src/hooks/
7. Skills em .claude/skills/

Output:
- Build: PASS/FAIL
- Tests: N pass / M fail
- Rotas: lista
- Domínios de componentes: lista
- Riscos ativos: lista
- Próxima ação recomendada: <ação concreta>
```
