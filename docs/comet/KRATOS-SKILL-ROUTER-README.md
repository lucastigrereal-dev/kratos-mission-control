# KRATOS Skill Router — Guia Rápido

## O que é
Script PowerShell que detecta automaticamente qual skill usar
baseado nas palavras da sua tarefa, e injeta o contexto correto
no Claude Code antes de executar.

## Instalação (1 vez)

```powershell
# 1. Coloque os dois arquivos na mesma pasta:
#    kratos-skill-router.ps1
#    kratos-alias-setup.ps1

# 2. Execute o setup (como administrador se precisar):
.\kratos-alias-setup.ps1

# 3. Reinicie o PowerShell ou recarregue o profile:
. $PROFILE

# 4. Coloque seus arquivos .md de skills em:
#    C:\Users\<você>\.kratos\skills\
```

## Uso no dia a dia

```powershell
# Roteamento automático — só descrever a tarefa
ks "criar componente GlassPanel com blur para o KRATOS"
ks "implementar HolographicCore do OMNIS com animação SVG"
ks "vault AKASHA — query de memória semântica"
ks "checar tokens de cor inline no componente novo"
ks "qa visual da tela de lab do OMNIS"

# Comandos especiais
ks list              # lista todas as skills e status
ks install           # cria pastas e explica estrutura
ks -Interactive      # modo menu (bom para TDAH 😄)
ks -DryRun "tarefa"  # simula sem executar claude
```

## Como funciona o roteamento

1. Você digita: `ks "criar island flutuante para OMNIS"`
2. O router detecta keywords: "island", "flutuante", "omnis"
3. Score island-composer=3, omnis-lab-builder=1
4. **island-composer.md** é selecionada automaticamente
5. O conteúdo da skill é injetado no prompt do Claude
6. Claude abre já com todo o contexto canônico carregado

## Score visual

```
Score: █████ (5) → match forte
Score: ███░░ (3) → match moderado
Score: █░░░░ (1) → match fraco
```

Se dois scores forem iguais, o router pergunta qual usar.

## Estrutura de arquivos

```
C:\Users\<você>\.kratos\
├── kratos-skill-router.ps1    ← o motor
├── skill-router.log           ← log de uso
└── skills\
    ├── glass-panel-builder.md
    ├── island-composer.md
    ├── omnis-lab-builder.md
    ├── akasha-vault-builder.md
    ├── omnis-agent-contracts.md
    ├── akasha-memory-contracts.md
    ├── token-enforcer.md
    ├── visual-qa-kimi.md
    ├── motion-guardian.md
    ├── neuro-ux-checker.md
    └── kimi-to-code.md
```

## Adicionar nova skill

1. Crie o arquivo `.md` em `~/.kratos/skills/`
2. Abra `kratos-skill-router.ps1`
3. Adicione um bloco no `$SKILL_MAP`:

```powershell
@{
    keywords    = @("palavra1","palavra2","palavra3")
    skill       = "nome-do-arquivo.md"
    name        = "Nome Legível"
    projects    = @("OMNIS","KRATOS")
    description = "O que essa skill faz"
}
```

Pronto. O router detecta automaticamente na próxima chamada.

