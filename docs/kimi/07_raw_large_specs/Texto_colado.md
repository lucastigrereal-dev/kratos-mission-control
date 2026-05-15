Bom, Tigrão. Postura ereta. Agora vou te dizer exatamente o que entendi, com 5 alertas, 10 ideias e 12 perguntas de alinhamento — antes de executar qualquer coisa.

---

## O QUE ENTENDI QUE É PRA FAZER

Você me deu **21.872 linhas de material** distribuídas assim:

**Material de INPUT (o que o Kimi produziu):**
- `kratos_visualspec4.md` — 7.641 linhas: diagnóstico visual + specs Fase 3A (UI Primitives com código TSX completo) + Fase 3B (World Map pseudo-3D) + Ultra Prompt teórico sobre Kimi K2.6
- `KRATOS_Visual_Spec_Fase2.md` — 5.371 linhas: specs Fase 2 completas (shell, AppShell, sidebar, etc.)
- `KRATOS_Visual_Spec_Fase3.md` — 403 linhas: spec consolidada Fase 3 FINAL com design tokens, arquitetura de pastas, componentes chave por ilha
- `kratos_visual_spec5.md` — 6.043 linhas: spec 3.1-FINAL-FRONTEND-ONLY compilando tudo (Agência, Tesouro, Forja, Arena + documento único)
- `KIMI_CODIGOS_ORGANIZADO.md` — 2.195 linhas: o prompt que você me mandou pra organizar tudo + instruções do protocolo docs/kimi/

**Material de CONTEXTO (estado atual do repo):**
- DEC-007: commit `05a4eaa` — 23 arquivos, 2.297 inserções, shell visual + mundo de ilhas implementado
- DEC-008: commit `c2edc94` — 11 skills de Claude Code adicionadas, docs de setup

**Imagens de referência (mockups visuais):**
9 imagens de alta fidelidade mostrando: Visão Geral (mapa de ilhas), OMNIS Lab, Agência/Estúdio (2 versões), Nimbus, Akasha/Gringotts, Filosofia & Sabedoria, Vila Viva, Observatório

**MISSÃO:** Organizar TUDO isso em um ZIP `KRATOS_KIMI_FRONTEND_PACK_V1.zip` com a estrutura de 11 pastas que você especificou — sem perder nenhuma linha de código, deixando pronto pra Claude Code recorrer por microfase.

---

## ⚠️ 5 ALERTAS ANTES DE EXECUTAR

**ALERTA 1 — Duplicação massiva nos arquivos**
Os arquivos `Fase2.md`, `Fase3.md`, `spec4.md` e `spec5.md` contêm o mesmo prompt de setup repetido 3-4 vezes cada. Se eu copiar bruto sem filtrar, o ZIP vai ter ~40% de lixo repetido. Preciso deduplicar agora, ou você prefere tudo bruto mesmo?

**ALERTA 2 — class-variance-authority no código do Kimi**
O `GlassPanel.tsx` gerado pelo Kimi usa `cva` (class-variance-authority). O DEC-008 proíbe isso se o projeto não usa. Preciso sinalizar claramente no ZIP — ou você confirma que o projeto já tem CVA?

**ALERTA 3 — Framer Motion não está no repo atual**
A spec5 assume `framer-motion` para animações. O repo atual usa CSS puro (tokens de keyframes no Tailwind). Se Claude Code seguir o código de referência sem checar isso, vai quebrar o build.

**ALERTA 4 — 9 mockups visuais não foram incluídos nos arquivos .md**
As imagens (Akasha, OMNIS, Agência, etc.) são referência visual canônica mas estão só no chat. O ZIP precisa de uma pasta `00_VISUAL_REFERENCES/` com as imagens ou pelo menos um índice visual com links descritivos. Você quer que eu inclua as imagens no ZIP ou só uma referência descritiva?

**ALERTA 5 — spec5 tem componentes novos não listados na estrutura do ZIP**
`Arena Comercial`, `Tesouro`, `Forja`, `Filosofia` têm specs detalhadas no spec5 mas a estrutura do ZIP não tem pasta específica pra elas (só 07_ISLAND_PAGES/ com 6 arquivos). Preciso expandir ou comprimir?

---

## 💡 10 IDEIAS DE OTIMIZAÇÃO

1. **Criar um `MASTER_TOKENS.ts`** único exportável — hoje os tokens estão espalhados em 4 arquivos diferentes, cada um com leves variações. Um arquivo canônico evita conflito.

2. **Gerar um `ISLAND_CONFIG.ts`** com posicionamento de todas as 11 ilhas em objeto JS — Claude Code consulta uma fonte e não precisa deduzir % de posição de cada arquivo.

3. **Criar pasta `00_VISUAL_REFERENCES/` com descrições OCR das imagens** — como as imagens não ficam no ZIP facilmente (são PNG pesados), um arquivo `IMAGE_DESCRIPTIONS.md` com descrição detalhada de cada mockup serve de âncora visual pro Claude Code.

4. **Separar `KIMI_DO_NOT_USE.md` em dois** — "risco técnico" (CVA, Framer, any) vs "risco arquitetural" (duplicar componentes existentes). Claude Code precisa de granularidade aqui.

5. **Incluir `CURRENT_REPO_INVENTORY.md`** listando os 23 arquivos já commitados (do DEC-007) pra Claude Code saber o que JÁ EXISTE antes de criar qualquer coisa.

6. **Gerar `motionVariants.ts` como dual-mode** — versão com Framer Motion E versão CSS puro, pra Claude Code escolher baseado no que estiver instalado.

7. **Criar `ISLAND_THEME_MATRIX.md`** — tabela completa: ilha → cor primária → glow → ícone → componentes chave → rota → microfase. Tudo numa tabela. Claude Code ama isso.

8. **Versionar o ZIP como v1.0** e incluir `CHANGELOG.md` vazio pronto pra próximas versões — quando o Kimi atualizar specs, fica fácil fazer diff.

9. **Gerar prompts de microfase como arquivos `.md` separados** em `09_CLAUDE_PROMPTS/` — não como uma lista num único arquivo. Cada arquivo = um prompt autocontido = Claude Code não precisa navegar.

10. **Incluir `BUILD_GUARD.sh`** — script bash que roda antes de cada microfase: verifica que backend não foi tocado, roda pytest, roda npm build. Protocolo de segurança executável.

---

## ❓ 12 PERGUNTAS DE ALINHAMENTO

**Sobre o escopo:**
1. Os arquivos de spec têm muito conteúdo repetido (o mesmo prompt de setup aparece 3-4x). Devo deduplicar tudo e entregar só o que é código/spec útil, ou você quer os arquivos brutos sem edição pra ter o histórico completo?

2. A spec menciona `Filosofia & Sabedoria` como ilha (vi no mockup), mas ela não aparece na lista do ZIP em `07_ISLAND_PAGES/`. Incluo ela ou deixo de fora por ora?

3. `class-variance-authority` — o repo atual usa? Confirma sim/não pra eu sinalizar corretamente no `KIMI_DO_NOT_USE.md`.

4. `framer-motion` — está instalado no projeto atual? O spec5 inteiro assume que sim.

**Sobre as imagens:**
5. Você quer as imagens PNG dentro do ZIP (vão pesar ~15-20MB) ou só um `IMAGE_DESCRIPTIONS.md` com referência textual detalhada de cada mockup?

**Sobre o conteúdo dos arquivos TSX:**
6. O código de referência do Kimi (ProgressRing, GlassPanel, KratosCard) — devo colocar "como está" com aviso de adaptação, ou devo adaptar já para remover os itens do `DO_NOT_USE` (CVA, any, etc.)?

7. Os componentes da pasta `07_ISLAND_PAGES/` — você quer páginas completas como o Kimi gerou (com mock data inline), ou prefere que eu remova os dados mock e deixe só estrutura + props?

**Sobre o roadmap:**
8. A ordem das microfases no ZIP deve seguir exatamente a sua lista (00→11) ou posso reordenar se fizer mais sentido técnico? Por exemplo: colocar Tokens antes de Primitives.

9. `FRONT-KIMI-00` no ZIP é sobre criar a estrutura do docs/kimi/ — mas isso já foi feito (DEC-008). Devo remover essa microfase do roadmap ou mantê-la como histórico?

**Sobre o protocolo:**
10. O `09_CLAUDE_PROMPTS/` — os prompts devem referenciar os arquivos do ZIP pelo caminho relativo (`docs/kimi/03_SAFE_PRIMITIVES/EmptyState.tsx`) ou pelo nome do arquivo apenas?

11. Qual o modelo que o Claude Code deve usar pra executar cada microfase? Sonnet 4.6 pra tudo, ou Haiku pra microfases simples (só mover arquivo, criar estrutura) e Sonnet pra implementação real?

12. Você quer que eu gere o ZIP agora mesmo aqui nessa sessão, ou prefere validar as respostas das perguntas acima primeiro? (Recomendo validar pelo menos as críticas: 1, 3, 4 e 5 antes de eu executar.)

---

Me responde o que precisar e executo o ZIP completo. As perguntas críticas são 1, 3, 4 e 5 — o resto eu posso assumir com bom senso se você quiser acelerar. 🐅