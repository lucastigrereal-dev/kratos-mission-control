# KRATOS Build EPERM Blocker Report

Data: 2026-05-16

## Contexto

Diretorio confirmado: `C:\Users\lucas\kratos-mission-control`

Branch confirmada: `main`

O build local do KRATOS segue bloqueado antes de carregar `vite.config.ts`, com falha no spawn do servico do esbuild usado pelo Vite.

## Erro exato

```text
$ vite build
failed to load config from C:\Users\lucas\kratos-mission-control\vite.config.ts
error during build:
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\lucas\kratos-mission-control\node_modules\esbuild\lib\main.js:2268:29)
    at build (C:\Users\lucas\kratos-mission-control\node_modules\esbuild\lib\main.js:2166:26)
    at bundleConfigFile (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:35819:23)
    at bundleAndLoadConfigFile (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:35806:24)
    at loadConfigFromFile (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:35775:179)
    at resolveConfig (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:35424:28)
    at resolveConfigToBuild (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:33447:9)
    at createBuilder (file:///C:/Users/lucas/kratos-mission-control/node_modules/vite/dist/node/chunks/config.js:33879:25)
error: script "build" exited with code 1
```

## Comandos rodados

Preflight:

```powershell
pwd
git status --short
git branch --show-current
git log --oneline -5
bun --version
node --version
Get-Command bun
Get-Command node
Get-Process node,bun,esbuild -ErrorAction SilentlyContinue
Get-ChildItem node_modules\@esbuild\win32-x64\ -Force
```

Diagnostico:

```powershell
bun run build
$env:DEBUG='vite:*'; bun run build
bunx vite build
bunx tsc --noEmit --pretty false
Get-Process esbuild,node,bun -ErrorAction SilentlyContinue
node_modules\@esbuild\win32-x64\esbuild.exe --version
Get-Item node_modules\@esbuild\win32-x64\esbuild.exe | Format-List FullName,Attributes,Length,LastWriteTime
Get-Process node,bun,esbuild -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,Path,StartTime | Format-List
Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('node.exe','bun.exe','esbuild.exe') } | Select-Object ProcessId,Name,CommandLine | Format-List
```

Tentativas seguras:

```powershell
bun install
bun run build
bunx vite build
bunx tsc --noEmit --pretty false
```

## Evidencias coletadas

- `bun --version`: `1.3.10`
- `node --version`: `v24.13.0`
- `bun.exe`: `C:\Users\lucas\.bun\bin\bun.exe`
- `node.exe`: `C:\Program Files\nodejs\node.exe`
- `node_modules\@esbuild\win32-x64\esbuild.exe --version`: `0.27.7`
- `esbuild.exe` existe, tem atributo `Archive`, tamanho `11386368`, e executa diretamente.
- `bun install` rodou sem mudancas: `Checked 510 installs across 646 packages (no changes)`.
- `bun run build` e `bunx vite build` falham com o mesmo `Error: spawn EPERM`.
- Consulta de command line via WMI falhou com `Acesso negado`, entao nao houve evidencia suficiente para encerrar processos `node.exe` com seguranca.
- A remocao de caches regeneraveis foi tentada apenas para alvos conhecidos, mas foi bloqueada pela politica do ambiente antes de executar.

## Hipotese provavel

O bloqueio parece ambiental no Windows, no ponto em que Node/Vite tenta iniciar o servico do esbuild por child process. Como o `esbuild.exe` executa diretamente e o `bun install` nao encontrou inconsistencias de instalacao, a causa mais provavel e permissao, antivirus/Windows Defender, politica corporativa/local de execucao, bloqueio temporario de processo, ou restricao do proprio sandbox.

## Observacao TypeScript

`bunx tsc --noEmit --pretty false` tambem falhou, mas esse comando passa do ponto de carregamento do Vite e revela erros TypeScript em arquivos fora do escopo imediato do EPERM. Portanto ha dois gates pendentes:

1. destravar o spawn do esbuild/Vite;
2. tratar erros TypeScript antes de considerar o build/release verde.

## Arquivos alterados no working tree no momento do bloqueio

Arquivos modificados:

```text
docs/KRATOS_DOCS_INDEX.md
docs/KRATOS_PLACEHOLDER_AUDIT.md
docs/README.md
src/components/kratos/views/AgendaView.tsx
src/components/kratos/views/AgoraView.tsx
src/components/kratos/views/DashboardView.tsx
src/styles.css
```

Arquivos nao rastreados:

```text
.claude/agents/<nome corrompido relacionado a kratos-data-layer.md>
.claude/agents/<nome corrompido relacionado a kratos-ui-builder.md>
docs/KRATOS_BUILD_EPERM_BLOCKER_REPORT.md
docs/KRATOS_CODEX_CONTINUATION_REPORT_2026-05-16.md
docs/KRATOS_IDEALIZATION_GAP_AUDIT.md
docs/KRATOS_IDEALIZATION_NEXT_MICROPHASES.md
docs/KRATOS_IDEALIZATION_VISUAL_QA.md
docs/KRATOS_P15_AGENDA_REAL_DATA_REPORT.md
docs/KRATOS_RECONCILIACAO_VISUAL_MVP_VS_FUNCIONAL.md
```

## Proximos passos manuais recomendados

1. Fechar terminais/dev servers que possam estar segurando `node.exe`, `bun.exe` ou `esbuild.exe`.
2. Abrir PowerShell normal e PowerShell como Administrador e comparar:
   ```powershell
   cd C:\Users\lucas\kratos-mission-control
   node_modules\@esbuild\win32-x64\esbuild.exe --version
   bun run build
   bunx vite build
   ```
3. Verificar Windows Defender/antivirus:
   - quarentena ou historico de protecao envolvendo `esbuild.exe`, `node.exe`, `bun.exe` ou o diretorio do repo;
   - Controlled Folder Access;
   - bloqueio por reputacao/SmartScreen;
   - exclusao temporaria controlada para `C:\Users\lucas\kratos-mission-control` e `C:\Users\lucas\.bun`.
4. Se o bloqueio persistir, remover caches manualmente com o repo fechado:
   ```powershell
   Remove-Item -LiteralPath C:\Users\lucas\kratos-mission-control\node_modules\.vite -Recurse -Force
   Remove-Item -LiteralPath C:\Users\lucas\kratos-mission-control\dist -Recurse -Force
   Remove-Item -LiteralPath C:\Users\lucas\kratos-mission-control\.tanstack -Recurse -Force
   ```
5. Se ainda persistir, reiniciar o Windows para liberar handles de processo e repetir `bun run build`.
6. Depois do EPERM resolvido, rodar:
   ```powershell
   bunx tsc --noEmit --pretty false
   bun run build
   bun test tests/
   bunx eslint src\components\kratos\views\AgendaView.tsx src\components\kratos\views\AgoraView.tsx src\components\kratos\views\DashboardView.tsx
   ```

## Status

Nao avancar waves de produto ate `bun run build` deixar de falhar por `spawn EPERM` e os erros TypeScript/build serem resolvidos.

## Bloqueio adicional: Git index.lock

Foi tentado commit seletivo apenas deste relatorio:

```powershell
git add -- docs/KRATOS_BUILD_EPERM_BLOCKER_REPORT.md
git commit -m "docs(kratos): document build eperm blocker"
```

Resultado:

```text
fatal: Unable to create 'C:/Users/lucas/kratos-mission-control/.git/index.lock': Permission denied
fatal: Unable to create 'C:/Users/lucas/kratos-mission-control/.git/index.lock': Permission denied
```

Evidencias:

- `.git/index.lock` nao existia no momento da checagem.
- `.git/index` existe e esta com atributo `Archive`.
- `Get-Process git` nao retornou processo ativo.
- `Get-Acl .git` mostrou regras `Deny` explicitas para um SID, alem das regras `Allow`.

Conclusao: alem do EPERM do spawn do esbuild, o ambiente tambem bloqueou escrita no indice Git. Nenhum commit foi criado por esta sessao.

## Gates apos o relatorio

```powershell
bun test tests/
bunx eslint src\components\kratos\views\AgendaView.tsx src\components\kratos\views\AgoraView.tsx src\components\kratos\views\DashboardView.tsx
git status --short
git diff --stat
```

Resultado:

- `bun test tests/`: 73 pass, 0 fail. O Bun imprimiu avisos `Cannot read file "C:\Users\lucas\": EPERM` e `Cannot read file "C:\Users\lucas\tsconfig.json": EPERM`, mas retornou exit code 0.
- ESLint focado: passou sem erros.
- `git diff --stat`: 7 arquivos preexistentes modificados, sem incluir este relatorio por ainda estar nao rastreado no momento da consulta.
