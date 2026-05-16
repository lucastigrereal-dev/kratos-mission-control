# W03 — Keyboard Navigation Pass

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Garantir que toda interação crítica seja acessível via teclado:
Escape para fechar painéis/formulários, Enter/Space para ações,
Tab order lógica através de elementos nativos.

---

## Mudanças

### 1. `src/components/kratos/shell/AuroraPanel.tsx` — Escape key handler

Adicionado `useEffect` com listener global de `keydown`:
- Escape fecha o painel Aurora (`onClose()`)
- Listener registrado apenas quando `open === true`
- Cleanup no unmount/desmontagem do effect

Adicionados imports: `useEffect`, `useRef` do React.

### 2. `src/components/kratos/views/CheckpointsView.tsx` — Escape no formulário de criação

Adicionado `onKeyDown` ao `<form>`:
- Escape fecha o formulário (`setShowCreate(false)`)
- Paridade com ProjetosView (que já tinha este handler)

---

## Verificação de cobertura

| Elemento | Tipo | Keyboard |
|---|---|---|
| Todos os botões | `<button>` | Enter/Space nativos |
| AuroraPanel close | `<button>` + Escape | FEITO |
| CheckpointsView form cancel | `<button>` Cancelar + Escape | FEITO |
| ProjetosView form cancel | `<button>` Cancelar + Escape | Já existia |
| Topbar aurora toggle | `<button>` com `aria-pressed` | Enter/Space nativos |
| FilterBar chips | `<button>` | Enter/Space nativos |
| Sidebar toggle | `<button>` com `aria-label` | Enter/Space nativos |
| Skip-to-main link | `<a>` | Enter nativo |

---

## Dívida de keyboard nav

| Item | Severidade | Nota |
|---|---|---|
| Focus trapping no AuroraPanel | Baixa | Painel é read-only/mock; trapping não crítico agora |
| Arrow key nav em listas (checkpoints, projetos) | Baixa | Fora do escopo — grid layout natural |

---

## Arquivos modificados

- `src/components/kratos/shell/AuroraPanel.tsx` (+10 linhas, Escape handler)
- `src/components/kratos/views/CheckpointsView.tsx` (+3 linhas, Escape handler)
