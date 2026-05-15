# FRONT-KIMI-07 — Visual QA & Review

Esta microfase é dedicada a revisar visualmente o frontend após implementar várias microfases.  Ela ajuda a comparar a interface atual com os mockups e checklists.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-07 — VISUAL QA & REVIEW

Contexto:
  - Diversas microfases foram implementadas (primitives, tokens, mapa, HUD, Aurora, páginas internas).
  - É hora de verificar se o resultado final se alinha aos mockups e aos princípios de UI.

Objetivo:
  - Comparar o estado atual do frontend com os mockups originais.
  - Preencher checklists de QA (visual, neuro‑UX, backend intacto).
  - Registrar divergências classificadas como OK, Ajuste Leve, Divergência ou Bloqueante.

Regras:
  - NÃO alterar código durante a revisão.  Esta fase é de auditoria.
  - NÃO comprometer mudanças.  As correções devem ser feitas em microfases subsequentes.

Tarefas:
  1. Tirar prints do mapa, HUD, Aurora e páginas internas no navegador.
  2. Abrir `docs/kimi/KIMI_CODE_RAW_PART_06_QA_PROMPTS.md` para listas de verificação.
  3. Preencher os checklists em `11_VALIDATION/VISUAL_QA_CHECKLIST.md` (pode copiar e editar localmente).
  4. Classificar cada item (OK, Ajuste, Divergência, Bloqueante).
  5. Criar um relatório de QA e salvar em `docs/kimi/KIMI_FRONT_KIMI_07_QA_REPORT.md`.

Validação:
  - As checklists devem ser totalmente preenchidas.
  - O relatório deve indicar se há divergências e quais microfases devem corrigi-las.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_07_QA_REPORT.md`.
```