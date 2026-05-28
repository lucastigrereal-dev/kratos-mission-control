# KRATOS — Bugs Incidentais (fora de escopo)

> Encontrados durante execução de waves. NÃO corrigidos inline (regra W0).
> Fix proposto mas aguardando wave adequada.

---

## #001 — TypeScript typecheck baseline: 13 erros pré-existentes

**Encontrado em:** W0-B1 (ao criar script `bun run typecheck`)  
**Wave adequada para fix:** W2 (Projects Reality) para AgenciaScreen/BillingScreen; wave de refactor TypeScript se necessário  
**Severidade:** P1 (gate travado, mas pré-existente — não bloqueia W0)

### Arquivos afetados:

| Arquivo | Linha | Erro |
|---|---|---|
| `src/components/kratos/islands/AgenciaScreen.tsx` | 415 | `total_items` não existe no tipo retornado |
| `src/components/kratos/islands/AgenciaScreen.tsx` | 416 | `pending_items` não existe no tipo retornado |
| `src/components/kratos/pro/BillingScreen.tsx` | 95 | Prop `padding` incompatível com `GlassPanelProps` |
| `src/components/kratos/pro/UserProfileScreen.tsx` | 235 | Idem BillingScreen |
| `src/hooks/useAkasha.ts` | 75, 76 | `result` de tipo `unknown` |
| `src/hooks/useAkashaDailyInsight.ts` | 121, 126 | `result` de tipo `unknown` |
| `src/lib/akasha-server-fns.ts` | 70 | Assinatura ServerFn incompatível |
| `tests/setup.ts` | 20 | `preconnect` ausente no mock de `fetch` |

### Hipótese de fix:
- `AgenciaScreen`: mapear propriedades do tipo retornado pela API
- `BillingScreen`/`UserProfileScreen`: verificar prop `padding` no `GlassPanelProps`
- `useAkasha`/`useAkashaDailyInsight`: tipar o `result` corretamente (não `unknown`)
- `akasha-server-fns`: alinhar assinatura com TanStack Start `ServerFn` type
- `tests/setup.ts`: usar cast ou mock mais completo do `fetch`

### Notas:
- Esses erros existiam ANTES de W0 (typecheck script não existia)
- W0 introduziu o script e revelou o baseline
- Nenhum erro introduzido pelos arquivos criados em W0 (scripts/, docs/, logs/)

---

---

## #002 — AppShell: stale closure no useEffect de `kratos:toggle-aurora`

**Encontrado em:** W0-B5 (code-review, revisor automático)  
**Wave adequada para fix:** W6 (offline/UI hardening) ou qualquer wave que toque AppShell  
**Severidade:** HIGH (comportamento incorreto após re-renders, mas caso raro na prática)

### Arquivo afetado:

`src/components/kratos/shell/AppShell.tsx` — linhas 34-38

```tsx
// BUG: toggleAurora capturado por closure na montagem — stale reference
useEffect(() => {
  const handler = () => toggleAurora();
  window.addEventListener("kratos:toggle-aurora", handler);
  return () => window.removeEventListener("kratos:toggle-aurora", handler);
}, []); // ← deps vazia, mas toggleAurora não está incluída
```

### Hipótese de fix:

```tsx
// Opção A: wrap toggleAurora em useCallback (mais limpo)
const toggleAurora = useCallback(() => { ... }, []);

// Opção B: usar ref para evitar re-render desnecessário
const toggleAuroraRef = useRef(toggleAurora);
useEffect(() => { toggleAuroraRef.current = toggleAurora; });
useEffect(() => {
  const handler = () => toggleAuroraRef.current();
  window.addEventListener("kratos:toggle-aurora", handler);
  return () => window.removeEventListener("kratos:toggle-aurora", handler);
}, []);
```

### Notas:

- Não introduzido por W0 — pré-existente
- Efeito prático: evento `kratos:toggle-aurora` pode usar estado stale após hot-reload em dev
- Em produção o impacto é mínimo (componente monta uma vez, estado é simples)

---

---

## #003 — project-store.test.ts: sort flaky em execução paralela

**Encontrado em:** W1-B9 (gate de testes final)  
**Wave adequada para fix:** Qualquer wave que toque stores/tests  
**Severidade:** LOW (flaky apenas em paralelo, passa 100% em isolamento)

### Arquivo afetado:

`tests/stores/project-store.test.ts` — linha 155

```typescript
// Teste: "lists all sorted by prioridade desc then atualizadoEm desc"
// A e C criados com prioridade=3. Quando timestamps são iguais (mesma milissegundo
// em CPUs rápidas), a ordem entre A e C é não-determinística.
expect(all[1].nome).toBe("A"); // Flaky: às vezes recebe "C"
```

### Hipótese de fix:

```typescript
// Usar Bun.sleepSync(1) entre criação de A e C para garantir timestamps distintos
const a = store.create({ nome: "A", prioridade: 3 });
Bun.sleepSync(1); // ← adicionar aqui
const b = store.create({ nome: "B", prioridade: 5 });
const c = store.create({ nome: "C", prioridade: 3 });
```

### Notas:

- Não introduzido por W1 — pré-existente (sort não-estável para timestamps iguais)
- Em `bun test tests/stores/project-store.test.ts` isolado: 14/14 pass, 0 fail
- Em `bun test tests/stores tests/contracts` paralelo: falha esporadicamente
- Não bloqueia W1 (teste passa em isolamento, falha só por race condition de timestamp)

---

_Atualizado em: 2026-05-28 | Wave W1_
