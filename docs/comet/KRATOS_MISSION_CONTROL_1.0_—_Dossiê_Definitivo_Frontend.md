# KRATOS MISSION CONTROL 1.0 — Dossiê Definitivo Frontend

**Arquiteto Sênior Full Stack | Design System Specialist | Neuro UX Researcher | Performance Engineer**

**Versão:** 1.0 | **Data:** 2026-05-13 | **Status:** EXECUTÁVEL

***

## 1. EXECUTIVE SUMMARY

Este dossiê é o **plano definitivo** para construir o frontend KRATOS 1.0 — um Mission Control pessoal, local-first, neurocompatível, colorido, vivo, com identidade Apple-clean + mundo operacional + ilhas flutuantes + HUD inteligente + Aurora como consciência contextual.

**O objetivo é transformar o KRATOS 0.9 funcional em KRATOS 1.0 visual-operacional**, preservando 100% do backend FastAPI + SQLite + SSE + Mission Lens v1, e elevando o frontend React/Vite/Tailwind para um cockpit que **devolve o fio da missão**.

**Resultado esperado:**
- Frontend 2D/pseudo-3D seguro, Apple-clean, colorido, com mundo vivo de ilhas
- Componentes modulares shadcn/ui + Tailwind v4 + Framer Motion
- Design System completo com tokens semânticos
- Performance otimizada com SSE + selectors memoizados
- Aurora como sidebar contextual + command palette
- Neuro UX compatível com TDAH (baixa carga cognitiva, próxima ação única)
- Roadmap em 8 fases para Codex/Claude Code executar
- Código TypeScript/React pronto para copiar/adaptar

***

## 2. SÍNTESE DOS ARQUIVOS DO ESPAÇO

### 2.1 KRATOS_ULTRA_DEV_REPORT_COMPLETO.md

**Status:** KRATOS 0.9 OPERACIONAL | 304 testes | Backend FastAPI + Frontend React

**Arquitetura atual:**
- **Backend:** FastAPI 0.115.6 + Uvicorn 0.34.0 + SQLite (WAL mode) com 25 tabelas
- **Frontend:** React 19.2.5 + Vite 8.0.10 + TypeScript 6.0.2 + Tailwind CSS 4.2.4
- **Comunicação:** REST + SSE via `/live/stream` (push a cada 5s) + `/live/snapshot` (fallback JSON)
- **Collectors:** 7 módulos read-only (system, Docker, Git, OMNIS, AW, outputs, context)
- **Services:** 16 módulos de business logic, destaque para `mission_intelligence_service.py` (Mission Lens v1)
- **Routes:** 71 endpoints REST + 1 SSE stream
- **Frontend:** 10 páginas + 32 componentes

**As 9 perguntas que o KRATOS responde:**

| # | Pergunta | Onde é respondida |
|---|----------|-------------------|
| 1 | Onde estou? | `/contexto`, `context.current_mission` |
| 2 | O que estou fazendo? | `/agora`, `context.current_context` |
| 3 | O que está rodando? | `/sistema`, `/docker` |
| 4 | O que quebrou? | `/sistema`, `alerts` |
| 5 | Onde parei? | `/checkpoints`, `checkpoint` |
| 6 | O que está atrasado? | `/deadlines`, `deadlines.overdue` |
| 7 | Qual projeto está em risco? | `/projetos`, `risks` |
| 8 | Qual é a próxima ação? | `next_action` |
| 9 | O que NÃO devo abrir agora? | `do_not_do` |

**Contrato Mission Lens v1 (canônico):**
- `current_mission`: string
- `next_action`: string
- `do_not_do`: array de strings
- `risks`: array de objetos
- `deadlines`: array de objetos
- `checkpoint`: objeto com `last_checkpoint` + `suggestion`
- `system_pulse`: objeto com `status` + `alerts`
- `mentor_summary`: string
- `collector_status`: objeto com status de cada collector
- `generated_at`: ISO timestamp
- `stale_after_ms`: número
- `source`: string
- `contract_version`: "1.0"

**Hook frontend principal:** `useLiveKratos.ts` (SSE + HTTP polling hybrid)

**Observação crítica:** O backend já está pronto. O redesign visual **NÃO pode quebrar** o contrato SSE, os endpoints, o SQLite, os collectors ou o Mission Lens v1.

### 2.2 KRATOS_ARQUITETURA_COMPLETA.md

**Definição canônica:**
> KRATOS Mission Control é o cockpit local-first que transforma o caos do computador, projetos, containers, código, agenda e contexto em uma próxima ação clara. KRATOS devolve o fio da missão.

**Posicionamento no ecossistema:**

```
OPERADOR (Lucas Tigre)
   ├── KRATOS (vê)    → estado real do sistema
   ├── AURORA (fala)  → interpretação do estado
   └── OMNIS (age)    → execução de missões
```

**O que o KRATOS É:**
1. Cockpit operacional — painel de comando do operador Lucas
2. Lente de missão — filtra ruído, mostra o que importa agora
3. Sistema de contexto — sabe onde você está e quando perdeu o fio
4. Painel de risco — mostra o que está em risco antes de virar problema
5. Mentor de próxima ação — recomenda a ação de maior impacto
6. Torre de controle local-first — roda na máquina, sem cloud, sem latência

**O que o KRATOS NÃO É:**
- App de tarefas (não é Notion, Todoist, Linear)
- Dashboard genérico (não mostra métricas por mostrar)
- Frontend bonito (estética serve clareza, não o contrário)
- OMNIS (OMNIS executa; KRATOS observa)
- Chatbot (Aurora interpreta, mas KRATOS não é chat)
- Sistema de monitoramento técnico (não é Grafana, Datadog)

**Fluxo de dados:**

```
Collectors (ThreadPoolExecutor)
  ├── system_collector   → psutil
  ├── docker_collector   → docker ps --format json
  ├── git_collector      → git status
  ├── omnis_collector    → OMNIS CLI bridge
  ├── activitywatch_col  → http://localhost:5600/api/0
  └── outputs_collector  → filesystem scan
       │
       ▼
Services (composição)
  ├── live_event_service   → 9 seções em paralelo (3s timeout)
  │   ├── context
  │   ├── alerts
  │   ├── mentor_signals
  │   ├── next_best_action
  │   ├── collector_status
  │   ├── today_execution
  │   ├── today_agenda
  │   ├── recent_checkpoints
  │   └── mission_lens
  │
  ▼
Routes (exposição)
  ├── GET  /live/snapshot   → JSON único com todas as 9 seções
  ├── GET  /live/stream     → SSE a cada 5s (mesmo payload)
  ├── GET  /mission/lens    → Mission Lens isolada
  └── GET  /context/current → Contexto + drift + sugestão checkpoint
```

### 2.3 pesquisa-profunda-para-orientar-o-redesign-visual.txt

**Direção visual decidida:**

O KRATOS 1.0 deve ser um **Mission Control pessoal, local-first, neurocompatível, colorido, vivo, com aparência de mundo operacional**.

**Ele deve parecer:**
- Apple Clean
- Videogame premium
- HUD operacional
- Mundo com ilhas
- Cockpit de missão
- Jarvis limpo
- Pixar/Nintendo-like em clareza emocional (sem copiar IP)
- Fantasia + tecnologia
- Game UI adulto
- Painel de produtividade que dá vontade de olhar
- Mundo que organiza a mente

**Ele NÃO deve parecer:**
- SaaS genérico
- Painel de prefeitura
- Dashboard fintech azul genérico
- Grafana/Datadog puro
- Cyberpunk escuro poluído
- RPG infantil
- Canva bonito sem função
- Landing page
- App decorativo sem dados

**Frases centrais:**
- "Você está aqui."
- "Você não está perdido."
- "Um passo de cada vez."
- "KRATOS devolve o fio da missão."
- "O quadro ainda está na minha frente."
- "Não abra outra frente antes de fechar essa."

**Personas do Conselho Supremo (filtros de design):**

1. **Steve Jobs:** Isso é essencial? Corta excesso? Protege a alma do produto?
2. **Don Norman:** Isso é intuitivo? Dá para entender sem manual? O affordance está claro?
3. **Jony Ive:** Isso respira? Tem silêncio, espaço e elegância?
4. **Shigeru Miyamoto:** Isso dá vontade de explorar? A produtividade parece jornada?
5. **Russell Barkley:** Isso ajuda uma mente com TDAH a iniciar, continuar e finalizar?
6. **BJ Fogg:** A próxima ação é pequena o suficiente?
7. **Judson Brewer:** Isso reduz ansiedade, culpa e loop de fuga?
8. **Andrew Huberman:** Isso gera dopamina limpa por progresso real?
9. **Temple Grandin:** A informação virou espaço visual claro?
10. **Pixar Council:** Tem alma, vínculo, humor e humanidade sem infantilizar?
11. **Aquiles:** Isso chama para ação e coragem?
12. **Aurora:** Isso protege Lucas do mundo e dele mesmo?

### 2.4 OCR da Imagem de Referência Visual

**Análise da imagem anexada (KRATOS CONTROL):**

A imagem mostra uma tela desktop wide 16:9 com identidade visual clara:

**TOPO ESQUERDO:**
- Avatar de tigre (círculo laranja com tigre realista)
- "Bom dia, Lucas! 👋"
- "KRATOS CONTROL"
- "Seu mundo. Sua missão. Seu legado."
- Card azul profundo (#1E3A8A ou similar)

**TOPO CENTRO:**
- Energia 87% (ícone raio ⚡)
- Nível 47 (ícone estrela ⭐)
- XP 32.780 (ícone diamante 💎)
- Hora 09:42 (ícone relógio 🕐)
- Data: Terça, 21 de Maio
- Brasão dourado "K" com bordas negras

**TOPO DIREITO:**
- Painel "AURORA" (fundo azul, status "● ONLINE" verde)
- Avatar Aurora (personagem azul com headset)
- Mensagem: "Estou aqui para te ajudar a focar no que realmente importa hoje."
- Botão "Falar com Aurora" (com ícone de voz)

**SIDEBAR ESQUERDA (azul profundo #1E3A8A):**
- 🏠 VISÃO GERAL
- 🎯 MISSÕES
- 📋 PROJETOS
- 📅 AGENDA
- 👥 PESSOAS
- 🎒 RECURSOS
- 📊 ANÁLISES
- 🎓 ACADEMY
- ⚙️ CONFIGURAÇÕES
- 🎵 TRILHA SONORA (rodapé): "Koopa Road" - Super Mario 64 (1:32/3:20)

**MUNDO CENTRAL (estilo low-poly 3D isométrico):**
- Céu azul vivo (#60A5FA ou similar) com nuvens brancas fofas
- Oceano azul profundo (#1E40AF) ao redor
- Ilhas flutuantes verdes com grama, terra, pontes de madeira
- Castelo central com torres vermelhas, bandeiras, brasão "K" dourado
- Personagem no centro (costas, camisa vermelha com "K" dourado)

**ILHAS IDENTIFICADAS:**

1. **Palco Central / Castelo KRATOS** (centro)
   - Missão atual: "CONSTRUIR O FUTURO ENQUANTO VIVO O PRESENTE"
   - Maior ilha, torres vermelhas, escadas

2. **OMNIS LAB** (esquerda superior)
   - Monitores/computadores azuis
   - Label: "Automações e IAs Painel de Controle"

3. **AGÊNCIA / REDES SOCIAIS** (esquerda inferior)
   - Câmera, microfone, ícone YouTube
   - Label: "Conteúdo, Marca e Marketing"

4. **GRINGOTTS / AKASHA** (direita superior)
   - Cofre dourado, baú
   - Label: "Banco de Conhecimento Memória e Arquivos"

5. **FILOSOFIA E SABEDORIA** (direita centro)
   - Templo grego, estátua pensador
   - Label: "Aprendizado, Filosofia e Evolução Pessoal"

6. **TESOURO / FINANÇAS** (direita inferior)
   - Cofre, moedas douradas, personagem pato
   - Label: "Finanças Pessoais e Investimentos"

7. **FORJA / CORPO** (centro inferior)
   - Halteres, equipamento treino
   - Label: "Treino, Saúde e Disciplina"

8. **VILA VIVA** (esquerda inferior)
   - Casa, bicicleta, barril
   - Label: "Família, Filhos e Vida Real"

9. **ARENA COMERCIAL** (centro esquerda)
   - Anfiteatro, bandeiras
   - Label: "Vendas, Negociação e Conquistas"

10. **OBSERVATÓRIO** (direita inferior)
    - Telescópio, portal
    - Label: "Ideias, Inovações e Inspirações"

11. **NIMBUS** (inferior centro)
    - Nuvem mágica, vassoura
    - Label: "Sua vassoura mágica. Vá para onde precisar."

**PAINEL DIREITO (FOCO DO DIA):**
- Card azul escuro com bordas arredondadas
- Ícones vermelhos/laranjas para:
  - ⭐ 3 tarefas importantes
  - 🟠 2 projetos em andamento
  - ✅ 1 reunião marcada
  - 🎯 Foco principal: "Construir o futuro"
- "PROGRESSO GERAL": 78% (anel ciano/azul)
- "CITAÇÃO DO DIA": "Disciplina é a ponte entre metas e realização." - Jim Rohn
- "AGENDA DE HOJE":
  - 🟢 10:00 Reunião Omnis Lab
  - 🟠 14:30 Call Comercial
  - ❤️ 16:00 Tempo com Laura e Apolo
  - Link: "Ver agenda completa >"

**RODAPÉ (SQUADS):**
- Dock com avatares circulares:
  - Aurora (avatar azul IA)
  - Omnis (robô/IA azul)
  - Agência (avatar vermelho)
  - Yemilia (avatar laranja)
  - Botão "+ Novo Squad"

**PALETA DE CORES IDENTIFICADA:**

- **Azul profundo (sidebar/cards):** #1E3A8A, #1E40AF
- **Azul céu (mundo):** #60A5FA, #3B82F6
- **Verde grama (ilhas):** #22C55E, #16A34A
- **Marrom terra:** #78350F, #92400E
- **Vermelho (torres/alertas):** #DC2626, #B91C1C
- **Dourado (brasão/moedas):** #FBBF24, #F59E0B
- **Branco (nuvens/texto):** #FFFFFF, #F9FAFB
- **Cinza claro (fundos):** #F3F4F6, #E5E7EB
- **Ciano (progresso):** #06B6D4, #0EA5E9
- **Verde status:** #10B981
- **Laranja (atenção):** #F97316

**TIPOGRAFIA OBSERVADA:**
- Sans-serif moderna (similar a Inter, Outfit, ou Manrope)
- Títulos: Bold, ~16-20px
- Labels: Regular/Medium, ~12-14px
- Hierarquia clara: títulos > subtítulos > labels

**ÍCONES:**
- Estilo emoji + lucide-react mix
- Simples, coloridos, flat

**MOTION/ANIMAÇÃO (inferido):**
- Ilhas provavelmente tem hover states
- Nuvens podem ter parallax leve
- Cards têm sombras suaves
- Transições suaves entre telas

**ELEMENTOS 3D/PSEUDO-3D:**
- Ilhas: estilo low-poly isométrico
- Profundidade via camadas (foreground/midground/background)
- Ponte de madeira conectando ilhas
- Perspectiva isométrica (~30-45°)

***

## 3. MISSION LENS V1 — TYPES + SELECTORS

### 3.1 TypeScript Types (Mission Lens Contract)

```typescript
// frontend/src/types/mission-lens.ts

/**
 * Mission Lens v1.0 — Contrato Canônico
 * 
 * Este é o contrato imutável entre backend e frontend.
 * NUNCA altere sem versionar o contrato no backend.
 * 
 * Fonte: /mission/lens, /live/snapshot.mission_lens, /live/stream (SSE)
 */

export interface MissionLens {
  // Missão atual
  current_mission: string;
  
  // Próxima ação recomendada (NBA - Next Best Action)
  next_action: string;
  
  // Lista do que NÃO fazer agora (anti-distração)
  do_not_do: string[];
  
  // Riscos ativos do sistema
  risks: MissionRisk[];
  
  // Deadlines relevantes
  deadlines: MissionDeadline[];
  
  // Checkpoint (último + sugestão)
  checkpoint: MissionCheckpoint;
  
  // Pulso do sistema
  system_pulse: SystemPulse;
  
  // Resumo do mentor
  mentor_summary: string;
  
  // Status dos collectors
  collector_status: CollectorStatus;
  
  // Metadata
  generated_at: string; // ISO timestamp
  stale_after_ms: number;
  source: string; // "mission_intelligence_service"
  contract_version: "1.0";
}

export interface MissionRisk {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "system" | "docker" | "git" | "omnis" | "project" | "deadline";
  title: string;
  description: string;
  mitigation?: string;
  created_at: string;
}

export interface MissionDeadline {
  id: string;
  title: string;
  project_name?: string;
  due_date: string; // ISO date
  days_remaining: number;
  is_overdue: boolean;
  status: "upcoming" | "today" | "overdue";
}

export interface MissionCheckpoint {
  last_checkpoint: {
    id: string;
    created_at: string;
    project_name?: string;
    context_summary: string;
  } | null;
  
  suggestion: {
    should_checkpoint: boolean;
    reason: string;
    cooldown_remaining_minutes?: number;
  };
}

export interface SystemPulse {
  status: "healthy" | "warning" | "critical" | "offline";
  alerts_count: number;
  unhealthy_collectors: string[];
  cpu_percent?: number;
  ram_percent?: number;
  disk_percent?: number;
}

export interface CollectorStatus {
  system: CollectorState;
  docker: CollectorState;
  git: CollectorState;
  omnis: CollectorState;
  activitywatch: CollectorState;
  outputs: CollectorState;
}

export interface CollectorState {
  status: "ok" | "degraded" | "error" | "unknown";
  last_run?: string; // ISO timestamp
  source: "real" | "cache" | "mock";
  error_message?: string;
}

/**
 * Live Snapshot completo (parent do Mission Lens)
 * 
 * Este é o payload do /live/snapshot e /live/stream (SSE)
 */
export interface LiveSnapshot {
  context: any; // TODO: tipagem completa
  alerts: any[];
  mentor_signals: any[];
  next_best_action: string;
  collector_status: CollectorStatus;
  today_execution: any;
  today_agenda: any[];
  recent_checkpoints: any[];
  mission_lens: MissionLens;
  generated_at: string;
  stale_after_ms: number;
}

/**
 * Estados de UI derivados
 */
export type MissionLensUIState = 
  | "loading"
  | "fresh"
  | "stale"
  | "degraded"
  | "offline"
  | "error";

export interface MissionLensWithState extends MissionLens {
  ui_state: MissionLensUIState;
  is_stale: boolean;
  age_ms: number;
}
```

### 3.2 Selectors Defensivos (Memoizados)

```typescript
// frontend/src/lib/mission-lens-selectors.ts

import { MissionLens, MissionLensWithState, MissionLensUIState } from '@/types/mission-lens';

/**
 * Selectors defensivos para Mission Lens
 * 
 * Regras:
 * - Sempre retornam valor seguro (nunca undefined/null sem tratamento)
 * - Calculam estados derivados (stale, age, ui_state)
 * - Podem ser memoizados com useMemo no componente
 */

/**
 * Calcula o estado de UI baseado em timestamp e stale_after_ms
 */
export function getMissionLensUIState(
  missionLens: MissionLens | null | undefined,
  isConnected: boolean = true
): MissionLensUIState {
  if (!missionLens) return "loading";
  if (!isConnected) return "offline";
  
  const age_ms = Date.now() - new Date(missionLens.generated_at).getTime();
  const is_stale = age_ms > missionLens.stale_after_ms;
  
  const unhealthy_count = missionLens.collector_status
    ? Object.values(missionLens.collector_status).filter(c => c.status === "error" || c.status === "degraded").length
    : 0;
  
  if (unhealthy_count >= 3) return "degraded";
  if (is_stale) return "stale";
  
  return "fresh";
}

/**
 * Enriquece Mission Lens com estados derivados
 */
export function enrichMissionLens(
  missionLens: MissionLens | null | undefined,
  isConnected: boolean = true
): MissionLensWithState | null {
  if (!missionLens) return null;
  
  const age_ms = Date.now() - new Date(missionLens.generated_at).getTime();
  const is_stale = age_ms > missionLens.stale_after_ms;
  const ui_state = getMissionLensUIState(missionLens, isConnected);
  
  return {
    ...missionLens,
    ui_state,
    is_stale,
    age_ms
  };
}

/**
 * Selectors específicos (sempre retornam valor seguro)
 */

export function getCurrentMission(missionLens: MissionLens | null): string {
  return missionLens?.current_mission || "Carregando missão...";
}

export function getNextAction(missionLens: MissionLens | null): string {
  return missionLens?.next_action || "Aguardando próxima ação...";
}

export function getDoNotDo(missionLens: MissionLens | null): string[] {
  return missionLens?.do_not_do || [];
}

export function getCriticalRisks(missionLens: MissionLens | null): MissionRisk[] {
  if (!missionLens) return [];
  return missionLens.risks.filter(r => r.severity === "critical" || r.severity === "high");
}

export function getOverdueDeadlines(missionLens: MissionLens | null): MissionDeadline[] {
  if (!missionLens) return [];
  return missionLens.deadlines.filter(d => d.is_overdue);
}

export function getUpcomingDeadlines(missionLens: MissionLens | null): MissionDeadline[] {
  if (!missionLens) return [];
  return missionLens.deadlines.filter(d => !d.is_overdue && d.days_remaining <= 7);
}

export function shouldShowCheckpointSuggestion(missionLens: MissionLens | null): boolean {
  if (!missionLens) return false;
  return missionLens.checkpoint.suggestion.should_checkpoint === true;
}

export function getSystemPulseColor(missionLens: MissionLens | null): string {
  if (!missionLens) return "text-gray-400";
  
  switch (missionLens.system_pulse.status) {
    case "healthy": return "text-green-500";
    case "warning": return "text-yellow-500";
    case "critical": return "text-red-500";
    case "offline": return "text-gray-500";
    default: return "text-gray-400";
  }
}

export function getUnhealthyCollectors(missionLens: MissionLens | null): string[] {
  if (!missionLens) return [];
  return missionLens.system_pulse.unhealthy_collectors || [];
}

export function getMentorSummary(missionLens: MissionLens | null): string {
  return missionLens?.mentor_summary || "Aguardando análise do mentor...";
}

// Helpers para UI
export function formatDeadlineDaysRemaining(days: number, isOverdue: boolean): string {
  if (isOverdue) return `${Math.abs(days)}d atrasado`;
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `${days}d restantes`;
}

export function getRiskBadgeColor(severity: MissionRisk["severity"]): string {
  switch (severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}
```

### 3.3 Exemplo de Uso nos Componentes

```typescript
// Exemplo: components/kratos/mission/MissionCurrentCard.tsx

import { useMemo } from 'react';
import { useLiveKratos } from '@/hooks/useLiveKratos';
import { enrichMissionLens, getCurrentMission, getNextAction } from '@/lib/mission-lens-selectors';
import { HudCard } from '@/components/kratos/ui/HudCard';
import { StatusBadge } from '@/components/kratos/ui/StatusBadge';

export function MissionCurrentCard() {
  const { snapshot, isConnected } = useLiveKratos();
  
  // Enriquece Mission Lens com estados derivados (memoizado)
  const enrichedLens = useMemo(() => {
    return enrichMissionLens(snapshot?.mission_lens, isConnected);
  }, [snapshot?.mission_lens, isConnected]);
  
  // Selectors seguros
  const currentMission = getCurrentMission(snapshot?.mission_lens);
  const nextAction = getNextAction(snapshot?.mission_lens);
  
  return (
    <HudCard 
      title="Missão Atual" 
      icon="🎯"
      status={enrichedLens?.ui_state}
    >
      <div className="space-y-4">
        <p className="text-lg font-semibold text-white/90">
          {currentMission}
        </p>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300 font-medium mb-1">
            Próxima Ação:
          </p>
          <p className="text-white/80">
            {nextAction}
          </p>
        </div>
        
        {enrichedLens && (
          <StatusBadge state={enrichedLens.ui_state} />
        )}
      </div>
    </HudCard>
  );
}
```

***

## 4. DESIGN TOKENS — TAILWIND + CSS VARS

### 4.1 Tailwind Config (tailwind.config.ts)

```typescript
// frontend/tailwind.config.ts

import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta KRATOS baseada na imagem de referência
        
        // Azuis (dominantes)
        'kratos-navy': {
          DEFAULT: '#1E3A8A', // sidebar, cards principais
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA', // céu do mundo
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF', // oceano
          900: '#1E3A8A', // sidebar
          950: '#172554',
        },
        
        // Verdes (ilhas, sucesso)
        'kratos-green': {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // grama
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        
        // Dourados (brasão, moedas)
        'kratos-gold': {
          DEFAULT: '#FBBF24',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24', // brasão
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        
        // Vermelhos (torres, alertas críticos)
        'kratos-red': {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626', // torres
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        
        // Laranjas (atenção, avisos)
        'kratos-orange': {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // atenção
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // Cianos (progresso, Aurora)
        'kratos-cyan': {
          DEFAULT: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4', // progresso
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        
        // Neutros (base)
        'kratos-slate': {
          DEFAULT: '#1E293B',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B', // fundos escuros
          900: '#0F172A',
          950: '#020617',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        // Hierarquia tipográfica
        'display-1': ['3rem', { lineHeight: '1.1', fontWeight: '700' }], // 48px
        'display-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'heading-1': ['2rem', { lineHeight: '1.25', fontWeight: '600' }], // 32px
        'heading-2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
        'heading-3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }], // 12px
      },
      
      spacing: {
        // Sistema 4px
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
      
      borderRadius: {
        // KRATOS usa bordas generosas
        'xl': '1rem', // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem', // 32px
      },
      
      boxShadow: {
        // Sombras suaves para profundidade
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### 4.2 CSS Variables (index.css)

```css
/* frontend/src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* KRATOS Design Tokens — CSS Variables */
  
  :root {
    /* Cores Semânticas (light mode base, mas KRATOS é dark-first) */
    --color-background: 15 23 42; /* slate-900 */
    --color-foreground: 248 250 252; /* slate-50 */
    
    --color-primary: 59 130 246; /* blue-500 */
    --color-primary-foreground: 248 250 252;
    
    --color-secondary: 100 116 139; /* slate-500 */
    --color-secondary-foreground: 248 250 252;
    
    --color-accent: 34 197 94; /* green-500 */
    --color-accent-foreground: 248 250 252;
    
    --color-destructive: 239 68 68; /* red-500 */
    --color-destructive-foreground: 248 250 252;
    
    --color-muted: 30 41 59; /* slate-800 */
    --color-muted-foreground: 148 163 184; /* slate-400 */
    
    --color-card: 30 41 59; /* slate-800 */
    --color-card-foreground: 248 250 252;
    
    --color-border: 51 65 85; /* slate-700 */
    --color-ring: 59 130 246; /* blue-500 */
    
    /* Raio de borda padrão */
    --radius: 1rem;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.05);
    
    /* Duração de transição padrão */
    --transition-fast: 150ms;
    --transition-base: 300ms;
    --transition-slow: 500ms;
  }
  
  /* Dark mode (KRATOS default) */
  .dark {
    --color-background: 15 23 42; /* slate-900 */
    --color-foreground: 248 250 252; /* slate-50 */
    
    --color-primary: 59 130 246; /* blue-500 */
    --color-primary-foreground: 248 250 252;
    
    --color-secondary: 100 116 139; /* slate-500 */
    --color-secondary-foreground: 248 250 252;
    
    --color-accent: 34 197 94; /* green-500 */
    --color-accent-foreground: 248 250 252;
    
    --color-destructive: 239 68 68; /* red-500 */
    --color-destructive-foreground: 248 250 252;
    
    --color-muted: 30 41 59; /* slate-800 */
    --color-muted-foreground: 148 163 184; /* slate-400 */
    
    --color-card: 30 41 59; /* slate-800 */
    --color-card-foreground: 248 250 252;
    
    --color-border: 51 65 85; /* slate-700 */
    --color-ring: 59 130 246; /* blue-500 */
  }
  
  /* Reset base */
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-feature-settings: "cv11", "ss01";
    font-variation-settings: "opsz" auto;
  }
  
  /* Scrollbar customizada (KRATOS style) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-slate-900;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-700 rounded-lg;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-600;
  }
  
  /* Prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* Glassmorphism (usado em cards flutuantes) */
  .glass {
    @apply bg-white/5 backdrop-blur-lg border border-white/10;
  }
  
  .glass-blue {
    @apply bg-blue-500/10 backdrop-blur-lg border border-blue-500/20;
  }
  
  .glass-green {
    @apply bg-green-500/10 backdrop-blur-lg border border-green-500/20;
  }
  
  /* HUD Card base */
  .hud-card {
    @apply bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg;
  }
  
  /* Badge de status */
  .status-badge {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium;
  }
  
  .status-badge-success {
    @apply bg-green-500/20 text-green-400 border border-green-500/30;
  }
  
  .status-badge-warning {
    @apply bg-yellow-500/20 text-yellow-400 border border-yellow-500/30;
  }
  
  .status-badge-error {
    @apply bg-red-500/20 text-red-400 border border-red-500/30;
  }
  
  .status-badge-info {
    @apply bg-blue-500/20 text-blue-400 border border-blue-500/30;
  }
  
  /* Progress ring (usado em progressos circulares) */
  .progress-ring-circle {
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
}

@layer utilities {
  /* Text gradient */
  .text-gradient {
    @apply bg-clip-text text-transparent;
  }
  
  .text-gradient-blue {
    @apply bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient;
  }
  
  .text-gradient-gold {
    @apply bg-gradient-to-r from-yellow-400 to-orange-400 text-gradient;
  }
  
  /* Glow effects */
  .glow-blue {
    @apply shadow-glow;
  }
  
  .glow-green {
    @apply shadow-glow-green;
  }
  
  .glow-gold {
    @apply shadow-glow-gold;
  }
}
```

### 4.3 Cores por Ilha/Domínio

```typescript
// frontend/src/lib/kratos-worlds.ts

/**
 * Configuração das ilhas/domínios do KRATOS
 * 
 * Cada ilha tem:
 * - id: identificador único
 * - name: nome exibido
 * - slug: URL path
 * - color: cor temática (Tailwind class)
 * - icon: emoji ou lucide icon name
 * - description: microcopy
 * - position: coordenadas no mundo (x, y para CSS/Canvas)
 */

export const KRATOS_ISLANDS = [
  {
    id: 'central-castle',
    name: 'Palco Central',
    slug: 'agora',
    color: 'kratos-navy-800',
    accentColor: 'kratos-gold-400',
    icon: '🏰',
    description: 'Missão atual e foco principal',
    position: { x: 50, y: 50 }, // centro do mundo
    size: 'large',
  },
  {
    id: 'omnis-lab',
    name: 'OMNIS Lab',
    slug: 'omnis',
    color: 'kratos-cyan-600',
    accentColor: 'kratos-cyan-400',
    icon: '🤖',
    description: 'Automações, IAs e Painel de Controle',
    position: { x: 20, y: 30 },
    size: 'medium',
  },
  {
    id: 'akasha',
    name: 'Gringotts / Akasha',
    slug: 'knowledge',
    color: 'kratos-gold-600',
    accentColor: 'kratos-gold-400',
    icon: '🏛️',
    description: 'Banco de Conhecimento, Memória e Arquivos',
    position: { x: 80, y: 25 },
    size: 'medium',
  },
  {
    id: 'arena-comercial',
    name: 'Arena Comercial',
    slug: 'sales',
    color: 'kratos-red-600',
    accentColor: 'kratos-red-400',
    icon: '🏟️',
    description: 'Vendas, Negociação e Conquistas',
    position: { x: 30, y: 70 },
    size: 'medium',
  },
  {
    id: 'agencia',
    name: 'Agência / Estúdio',
    slug: 'content',
    color: 'kratos-orange-600',
    accentColor: 'kratos-orange-400',
    icon: '🎬',
    description: 'Conteúdo, Marca e Marketing',
    position: { x: 15, y: 60 },
    size: 'medium',
  },
  {
    id: 'vila-viva',
    name: 'Vila Viva',
    slug: 'family',
    color: 'kratos-green-600',
    accentColor: 'kratos-green-400',
    icon: '🏡',
    description: 'Família, Filhos e Vida Real',
    position: { x: 20, y: 80 },
    size: 'small',
  },
  {
    id: 'observatorio',
    name: 'Observatório',
    slug: 'ideas',
    color: 'blue-600',
    accentColor: 'blue-400',
    icon: '🔭',
    description: 'Ideias, Inovações e Inspirações',
    position: { x: 80, y: 70 },
    size: 'small',
  },
  {
    id: 'nimbus',
    name: 'Nimbus Academy',
    slug: 'academy',
    color: 'purple-600',
    accentColor: 'purple-400',
    icon: '🧙',
    description: 'Sua vassoura mágica. Vá para onde precisar.',
    position: { x: 50, y: 85 },
    size: 'small',
  },
  {
    id: 'tesouro',
    name: 'Tesouro / Finanças',
    slug: 'finance',
    color: 'yellow-600',
    accentColor: 'yellow-400',
    icon: '💰',
    description: 'Finanças Pessoais e Investimentos',
    position: { x: 75, y: 60 },
    size: 'medium',
  },
  {
    id: 'forja',
    name: 'Forja / Corpo',
    slug: 'health',
    color: 'kratos-red-700',
    accentColor: 'kratos-red-400',
    icon: '⚒️',
    description: 'Treino, Saúde e Disciplina',
    position: { x: 45, y: 75 },
    size: 'small',
  },
  {
    id: 'filosofia',
    name: 'Filosofia e Sabedoria',
    slug: 'philosophy',
    color: 'indigo-600',
    accentColor: 'indigo-400',
    icon: '📚',
    description: 'Aprendizado, Filosofia e Evolução Pessoal',
    position: { x: 85, y: 45 },
    size: 'small',
  },
] as const;

export type IslandId = typeof KRATOS_ISLANDS[number]['id'];
export type IslandSlug = typeof KRATOS_ISLANDS[number]['slug'];

/**
 * Helper para buscar ilha por slug
 */
export function getIslandBySlug(slug: string) {
  return KRATOS_ISLANDS.find(i => i.slug === slug);
}

/**
 * Helper para gerar classe de cor
 */
export function getIslandColorClass(islandId: IslandId, type: 'bg' | 'text' | 'border' = 'bg') {
  const island = KRATOS_ISLANDS.find(i => i.id === islandId);
  if (!island) return '';
  
  switch (type) {
    case 'bg': return `bg-${island.color}`;
    case 'text': return `text-${island.accentColor}`;
    case 'border': return `border-${island.accentColor}`;
    default: return '';
  }
}
```

***

## 5. REPOSITÓRIOS GITHUB VALIDADOS (40+)

### 5.1 Dashboards React + Tailwind + shadcn/ui

| # | Nome | Link | Stars | Licença | Stack | Nota | Risco |
|---|------|------|-------|---------|-------|------|-------|
| 1 | **Horizon UI Chakra** | https://github.com/horizon-ui/horizon-ui-chakra | ~4.5k | MIT | React + Chakra UI + TypeScript | 9/10 | Baixo |
| 2 | **TailAdmin Free** | https://github.com/TailAdmin/free-react-tailwind-admin-dashboard | ~2k | MIT | React + Tailwind + TypeScript | 9/10 | Baixo |
| 3 | **shadcn-ui Dashboard Example** | https://github.com/shadcn-ui/ui/tree/main/apps/www/app/examples/dashboard | N/A | MIT | React + Tailwind + shadcn/ui | 10/10 | Muito Baixo |
| 4 | **CoreUI React Admin Template** | https://github.com/coreui/coreui-free-react-admin-template | ~5k | MIT | React + Bootstrap/Tailwind | 8/10 | Baixo |
| 5 | **Material Tailwind Dashboard React** | https://github.com/creativetimofficial/material-tailwind-dashboard-react | ~1.2k | MIT | React + Tailwind + Material | 7/10 | Médio |

**Recomendação:** TailAdmin Free e shadcn-ui Dashboard Example são os melhores pontos de partida. TailAdmin tem estrutura completa, shadcn/ui tem componentes premium.[^1][^2][^3][^4]

### 5.2 Command Palette / Raycast-like

| # | Nome | Link | Stars | Licença | Stack | Nota | Risco |
|---|------|------|-------|---------|-------|------|-------|
| 6 | **cmdk** (Padrão Vercel) | https://github.com/dip/cmdk | ~9k | MIT | React + TypeScript | 10/10 | Muito Baixo |
| 7 | **kbar** | https://github.com/timc1/kbar | ~4.5k | MIT | React + TypeScript | 9/10 | Baixo |
| 8 | **react-command-palette** | https://github.com/asabaylus/react-command-palette | ~1k | MIT | React | 7/10 | Médio |
| 9 | **react-cmdk** (Albin Groen) | https://github.com/albingroen/react-cmdk | ~500 | MIT | React + TypeScript | 8/10 | Baixo |

**Recomendação:** **cmdk** é o padrão da indústria (usado por Vercel, Linear, Raycast). kbar é alternativa sólida com mais features out-of-the-box.[^5][^6][^7][^8]

### 5.3 SSE / Real-Time Dashboard

| # | Nome | Link | Stars | Licença | Stack | Nota | Risco |
|---|------|------|-------|---------|-------|------|-------|
| 10 | **react-native-sse** | https://github.com/binaryminds/react-native-sse | ~200 | MIT | React + EventSource | 7/10 | Médio |
| 11 | **Server-Sent Events React Hook** (Gist) | https://gist.github.com/Mosharush/8bbc178bbc7e47c7c7c554dd7b5c5528 | N/A | Public | React Hook | 8/10 | Baixo |
| 12 | **TanStack Query SSE discussion** | https://github.com/TanStack/query/discussions/418 | N/A | N/A | Conceitual | 6/10 | Alto |

**Recomendação:** O hook atual `useLiveKratos.ts` já está funcional. Use como base os patterns do gist Mosharush para otimização.[^9][^10][^11][^12]

### 5.4 Game UI / HUD Components

| # | Nome | Link | Stars | Licença | Stack | Nota | Risco |
|---|------|------|-------|---------|-------|------|-------|
| 13 | **react-game-kit** (Formidable Labs) | https://github.com/FormidableLabs/react-game-kit | ~4.6k | MIT | React + Canvas | 7/10 | Médio |
| 14 | **game-ui** (Tomek Skuta) | https://github.com/tomekskuta/game-ui | ~50 | MIT | React + CSS | 6/10 | Médio |
| 15 | **awesome-react-native** (lista com game libs) | https://github.com/jondot/awesome-react-native | ~34k | MIT | Lista curada | 8/10 | N/A |

**Recomendação:** react-game-kit é útil para entender patterns de game loops, mas KRATOS não precisa de game loop real. Focar em HUD visual puro (CSS/SVG/Tailwind).[^13][^14][^15]

### 5.5 React Three Fiber / 3D (Futuro Opcional)

| # | Nome | Link | Stars | Licença | Stack | Nota | Risco |
|---|------|------|-------|---------|-------|------|-------|
| 16 | **React Three Fiber** (oficial) | https://github.com/pmndrs/react-three-fiber | ~27k | MIT | React + Three.js | 10/10 | Médio |
| 17 | **threejs-floating-island** | https://github.com/nextgtrgod/threejs-floating-island | ~100 | MIT | Three.js + low-poly | 8/10 | Baixo |
| 18 | **drei** (R3F helpers) | https://github.com/pmndrs/drei | ~8k | MIT | React + Three.js | 9/10 | Baixo |

**Recomendação:** NÃO implementar 3D na primeira versão. Planejar para v1.5 ou v2.0. Se implementar, usar R3F com fallback obrigatório 2D.[^16][^17][^18][^19]

### 5.6 Fr

---

## References

1. [17 Best shadcn/ui Templates & Starter Kits for 2026](https://adminlte.io/blog/shadcn-ui-templates/) - Built on Next.js 16, React 19, shadcn/ui, and Tailwind CSS v4. Includes 50+ pages, 6 dashboard varia...

2. [Free React Shadcn Admin Dashboard Template - Tailwind ...](https://tailwind-admin.com) - Tailwindadmin is a modern shadcn dashboard template built with React and Tailwind CSS, offering all ...

3. [25+ Free React Admin Dashboard Template for 2026](https://tailadmin.com/blog/react-admin-dashboard) - Explore 25+ best free React admin dashboard templates for 2026. Discover a curated collection to ele...

4. [19 Best React Dashboards in 2026](https://www.untitledui.com/blog/react-dashboards) - Searching for the best React dashboards to use in your next project? Here's our hand-picked list of ...

5. [dip/cmdk: Fast, unstyled command menu React component.](https://github.com/dip/cmdk) - ⌘K is a command menu React component that can also be used as an accessible combobox. You render ite...

6. [albingroen/react-cmdk: A fast, accessible, and pretty ...](https://github.com/albingroen/react-cmdk) - A package with components for building your dream command palette for your web application. Watch th...

7. [timc1/kbar: fast, portable, and extensible cmd+k interface ...](https://github.com/timc1/kbar) - kbar is a simple plug-n-play React component to add a fast, portable, and extensible command + k (co...

8. [asabaylus/react-command-palette](https://github.com/asabaylus/react-command-palette) - open a boolean, when set to true it forces the command palette to be displayed. Defaults to "false"....

9. [Sample real-time React dashboard to display the message ...](https://gist.github.com/DimuthuKasunWP/2af348751677290046293c6af8a06632) - Sample real-time React dashboard to display the message updates received from the Server via SSE - A...

10. [Build a Server-Sent Events Real-Time Dashboard](https://terminalskills.io/use-cases/build-server-sent-events-dashboard) - Build a real-time monitoring dashboard using Server-Sent Events (SSE) for one-way streaming — lighte...

11. [Supporting a stream-based flow (EventSource, SSE) #418](https://github.com/TanStack/query/discussions/418) - Hi! Just curious if you would be interested in supporting a new use case for streamed data. For inst...

12. [Server-Sent Events (SSE) - React Hook](https://gist.github.com/Mosharush/8bbc178bbc7e47c7c7c554dd7b5c5528) - Server-Sent Events (SSE) are commonly used in real-time applications where the server needs to push ...

13. [FormidableLabs/react-game-kit: Component library for ...](https://github.com/FormidableLabs/react-game-kit) - react-game-kit provides a set of helper components to make it easier to create games with React and ...

14. [jondot/awesome-react-native](https://github.com/jondot/awesome-react-native) - Awesome React Native is an awesome style list that curates the best React Native libraries, tools, t...

15. [tomekskuta/game-ui: UI for online game](https://github.com/tomekskuta/game-ui) - Builds the app for production to the build folder. It correctly bundles React in production mode and...

16. [Examples - React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/examples) - A few examples that demonstrate what you can do with React Three Fiber.

17. [3D Models](https://wawasensei.dev/courses/react-three-fiber/lessons/models) - It's not a mandatory skill to create 3D experiences with threejs and React Three Fiber. You can find...

18. [️Fantasy-Themed Floating Island Portfolio (Built with R3F ...](https://www.reddit.com/r/threejs/comments/1o84lz3/fantasythemed_floating_island_portfolio_built/) - Fascinating how you basically generated assets. I do loe poly 3d modeling for 3js applications, and ...

19. [nextgtrgod/threejs-floating-island: three.js low-poly ...](https://github.com/nextgtrgod/threejs-floating-island) - three.js low-poly floating island. Contribute to nextgtrgod/threejs-floating-island development by c...

