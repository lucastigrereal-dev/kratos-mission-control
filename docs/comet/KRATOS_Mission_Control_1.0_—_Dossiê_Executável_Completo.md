# KRATOS Mission Control 1.0 — Dossiê Executável Completo

**Data:** 13 de maio de 2026  
**Versão Base:** KRATOS 0.9 (operacional)  
**Target:** KRATOS 1.0 Frontend com identidade visual das ilhas flutuantes

***

## PARTE 1: SÍNTESE COMPLETA DOS ARQUIVOS DO ESPAÇO

### Estado Atual KRATOS 0.9 (Operacional)

**Backend FastAPI + Python:**
- 71 endpoints REST via 26 routers
- SQLite WAL com 25 tabelas (projects, missions, checkpoints, tasks, alerts, etc.)
- 7 collectors read-only: System, Docker, Git, OMNIS, ActivityWatch, Outputs, Browser
- 16 serviços de business logic
- SSE live via `/live/stream` (EventSource push a cada 5s)
- REST fallback via `/live/snapshot`
- Mission Lens v1 via `/mission/lens`
- Context atual via `/context/current`
- 304 testes passando (pytest)
- Modo atual: **LIVE** (0 seções degradadas de 9)

**Frontend React + Vite + TypeScript:**
- React 19.2.5 + Vite 8.0.10 + TypeScript 6.0.2
- Tailwind CSS 4.2.4
- 32 componentes React, 10 páginas
- Hook `useLiveKratos.ts` para SSE com fallback HTTP polling
- Páginas: Agora, Contexto, Checkpoints, Agenda, Deadlines, Projetos, Tarefas, Sistema, Finalizar, OmnisSnapshot

**As 9 Perguntas Operacionais:**
1. Onde estou?
2. O que estou fazendo?
3. O que está rodando?
4. O que quebrou?
5. Onde parei?
6. O que está atrasado?
7. Qual projeto está em risco?
8. Qual é a próxima ação?
9. O que NÃO devo abrir?

**Direção Visual Decidida:**
- Mundo 3D com ilhas flutuantes conectadas por pontes
- Céu azul vivo, nuvens, luz cinematográfica
- Apple-clean + mundo vivo + neuro-compatível (TDAH-first)
- 10 ilhas: **Palco Central** (hub), **Omnis Lab** (IA/automações), **Akasha/Gringotts** (conhecimento), **Vila Viva** (família/vida), **Arena Comercial** (vendas), **Agência/Estúdio** (conteúdo), **Forja/Corpo** (saúde), **Nimbus Academy** (aprendizado), **Observatório** (estratégia), **Tesouro/Finanças**
- Aurora como painel direito (assistente contextual)
- HUD operacional limpo, não SaaS genérico

***

## PARTE 2: MISSION LENS V1 — TYPES + SELECTORS

### 2.1 Mission Lens Contract V1 — TypeScript Types

```typescript
// frontend/src/types/mission-lens.ts

/**
 * KRATOS Mission Lens v1 — Contrato Canônico
 * 
 * Este é o payload central que alimenta todo o cockpit.
 * Fonte: backend `/mission/lens`, `/live/snapshot`, `/live/stream`
 * 
 * REGRAS:
 * - Nunca alterar estrutura sem atualizar backend
 * - Todos os campos são obrigatórios no envelope
 * - Arrays podem estar vazios, mas nunca undefined
 * - `stale_after_ms` define quando dados ficam velhos (12s padrão)
 */

// ============================================================
// ENVELOPE
// ============================================================

export type MissionLensSource = 'mock' | 'activitywatch' | 'fallback' | 'live';
export type CollectorStatus = 'ok' | 'degraded' | 'error';

export interface MissionLensEnvelope {
  contract_version: 'mission_lens.v1';
  source: MissionLensSource;
  collector_status: CollectorStatus;
  generated_at: string; // ISO 8601 UTC
  stale_after_ms: number; // milliseconds até stale (default: 12000)
  data: MissionLensData;
}

// ============================================================
// MISSION LENS DATA (8 BLOCOS)
// ============================================================

export interface MissionLensData {
  current_mission: CurrentMission;
  next_action: NextAction;
  do_not_do: DoNotDoItem[];
  risks: RiskItem[];
  deadlines: DeadlineItem[];
  checkpoint: CheckpointStatus;
  system_pulse: SystemPulse;
  mentor_summary: MentorSummary;
}

// ============================================================
// 1. CURRENT MISSION
// ============================================================

export type FocusState = 'on_focus' | 'related' | 'off_focus' | 'unknown';

export interface CurrentMission {
  title: string; // ex: "KRATOS Frontend Redesign"
  project: string | null; // project ID ou null
  focus_state: FocusState;
  confidence: number; // 0.0-1.0
  drift_minutes: number | null; // minutos fora de foco, ou null se on_focus
}

// ============================================================
// 2. NEXT ACTION
// ============================================================

export type NextActionPriority = 'critical' | 'high' | 'normal';
export type NextActionSource = 'mentor' | 'task' | 'deadline' | 'checkpoint' | 'alert';

export interface NextAction {
  title: string; // ex: "Finalizar design tokens do KRATOS"
  rationale: string; // por que essa ação agora
  priority: NextActionPriority;
  source: NextActionSource;
  cta_label: string; // botão CTA, ex: "Iniciar Agora"
  project_id: string | null;
}

// ============================================================
// 3. DO NOT DO
// ============================================================

export type DoNotDoSeverity = 'block' | 'warn' | 'suggest';

export interface DoNotDoItem {
  title: string; // ex: "Não abrir Instagram agora"
  reason: string;
  severity: DoNotDoSeverity;
}

// ============================================================
// 4. RISKS
// ============================================================

export type RiskSeverity = 'critical' | 'warning' | 'info';
export type RiskEntity = 'project' | 'task' | 'container' | 'repo' | 'output' | 'system';

export interface RiskItem {
  title: string; // ex: "Projeto Clínica sem deadline"
  severity: RiskSeverity;
  entity: RiskEntity;
  entity_id: string | null;
  reason: string;
  suggested_action: string;
}

// ============================================================
// 5. DEADLINES
// ============================================================

export type DeadlineSeverity = 'overdue' | 'today' | 'soon';

export interface DeadlineItem {
  title: string;
  project_id: string | null;
  severity: DeadlineSeverity;
  due_at: string; // ISO 8601
  overdue_days: number | null;
}

// ============================================================
// 6. CHECKPOINT
// ============================================================

export interface CheckpointStatus {
  available: boolean;
  label: string; // ex: "Checkpoint Disponível" ou "Sem mudanças para salvar"
  last_checkpoint_at: string | null; // ISO 8601 ou null
  resume_hint: string | null; // ex: "Retome: Design tokens"
}

// ============================================================
// 7. SYSTEM PULSE
// ============================================================

export type SystemStatus = 'healthy' | 'degraded' | 'critical' | 'offline';
export type LiveConnectionStatus = 'live' | 'reconnecting' | 'polling' | 'fallback' | 'offline';

export interface SystemPulse {
  status: SystemStatus;
  live_status: LiveConnectionStatus;
  degraded_count: number; // quantos coletores estão degraded
  critical_count: number; // quantos alertas críticos
  message: string; // ex: "Tudo operacional"
}

// ============================================================
// 8. MENTOR SUMMARY
// ============================================================

export type MentorTone = 'calm' | 'warning' | 'urgent' | 'praise';

export interface MentorSummary {
  text: string; // ex: "3 alertas merecem atenção antes do redesign."
  tone: MentorTone;
  urgency: number; // 1-5
}

// ============================================================
// HELPERS / UTILITIES
// ============================================================

/**
 * Type guard para validar se um objeto é MissionLensEnvelope válido
 */
export function isMissionLensEnvelope(obj: unknown): obj is MissionLensEnvelope {
  if (!obj || typeof obj !== 'object') return false;
  const envelope = obj as Partial<MissionLensEnvelope>;
  
  return (
    envelope.contract_version === 'mission_lens.v1' &&
    typeof envelope.source === 'string' &&
    typeof envelope.collector_status === 'string' &&
    typeof envelope.generated_at === 'string' &&
    typeof envelope.stale_after_ms === 'number' &&
    !!envelope.data
  );
}

/**
 * Checa se o Mission Lens está stale baseado em generated_at + stale_after_ms
 */
export function isMissionLensStale(envelope: MissionLensEnvelope): boolean {
  const generatedAt = new Date(envelope.generated_at).getTime();
  const now = Date.now();
  const staleThreshold = envelope.stale_after_ms || 12000;
  
  return (now - generatedAt) > staleThreshold;
}

/**
 * Retorna a cor Tailwind apropriada para cada severity
 */
export function getSeverityColor(severity: RiskSeverity | DeadlineSeverity | DoNotDoSeverity): string {
  const map: Record<string, string> = {
    critical: 'red',
    overdue: 'red',
    block: 'red',
    warning: 'yellow',
    today: 'yellow',
    warn: 'yellow',
    info: 'gray',
    soon: 'blue',
    suggest: 'gray',
  };
  
  return map[severity] || 'gray';
}

/**
 * Retorna ícone Lucide apropriado para cada risk entity
 */
export function getRiskEntityIcon(entity: RiskEntity): string {
  const icons: Record<RiskEntity, string> = {
    project: 'folder',
    task: 'check-square',
    container: 'box',
    repo: 'git-branch',
    output: 'file-output',
    system: 'cpu',
  };
  
  return icons[entity];
}

/**
 * Retorna estado visual do foco (cores, labels)
 */
export function getFocusStateVisual(state: FocusState): { color: string; label: string; emoji: string } {
  const visuals: Record<FocusState, { color: string; label: string; emoji: string }> = {
    on_focus: { color: 'green', label: 'No Foco', emoji: '🎯' },
    related: { color: 'blue', label: 'Relacionado', emoji: '🔗' },
    off_focus: { color: 'yellow', label: 'Fora do Foco', emoji: '⚠️' },
    unknown: { color: 'gray', label: 'Contexto Desconhecido', emoji: '❓' },
  };
  
  return visuals[state];
}
```

### 2.2 Mission Lens Selectors (Funções Defensivas)

```typescript
// frontend/src/lib/mission-lens-selectors.ts

import type {
  MissionLensEnvelope,
  CurrentMission,
  NextAction,
  DoNotDoItem,
  RiskItem,
  DeadlineItem,
  CheckpointStatus,
  SystemPulse,
  MentorSummary,
} from '../types/mission-lens';

/**
 * Selectors defensivos para extrair dados do Mission Lens
 * 
 * REGRAS:
 * - Sempre retornar valor seguro (nunca undefined)
 * - Aceitar envelope null/undefined (casos de loading/error)
 * - Defaults razoáveis para estados vazios
 */

// ============================================================
// ENVELOPE SELECTORS
// ============================================================

export function selectMissionLensSource(envelope: MissionLensEnvelope | null): string {
  return envelope?.source || 'offline';
}

export function selectCollectorStatus(envelope: MissionLensEnvelope | null): string {
  return envelope?.collector_status || 'error';
}

export function selectGeneratedAt(envelope: MissionLensEnvelope | null): string | null {
  return envelope?.generated_at || null;
}

export function selectIsStale(envelope: MissionLensEnvelope | null): boolean {
  if (!envelope) return true;
  
  const generatedAt = new Date(envelope.generated_at).getTime();
  const now = Date.now();
  const staleThreshold = envelope.stale_after_ms || 12000;
  
  return (now - generatedAt) > staleThreshold;
}

// ============================================================
// CURRENT MISSION SELECTORS
// ============================================================

export function selectCurrentMission(envelope: MissionLensEnvelope | null): CurrentMission | null {
  return envelope?.data?.current_mission || null;
}

export function selectCurrentMissionTitle(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.current_mission?.title || 'Nenhuma missão ativa';
}

export function selectFocusState(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.current_mission?.focus_state || 'unknown';
}

export function selectIsOffFocus(envelope: MissionLensEnvelope | null): boolean {
  const state = envelope?.data?.current_mission?.focus_state;
  return state === 'off_focus';
}

export function selectDriftMinutes(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.current_mission?.drift_minutes || 0;
}

// ============================================================
// NEXT ACTION SELECTORS
// ============================================================

export function selectNextAction(envelope: MissionLensEnvelope | null): NextAction | null {
  return envelope?.data?.next_action || null;
}

export function selectNextActionTitle(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.next_action?.title || 'Nenhuma ação recomendada';
}

export function selectNextActionPriority(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.next_action?.priority || 'normal';
}

export function selectNextActionCTA(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.next_action?.cta_label || 'Continuar';
}

// ============================================================
// DO NOT DO SELECTORS
// ============================================================

export function selectDoNotDoItems(envelope: MissionLensEnvelope | null): DoNotDoItem[] {
  return envelope?.data?.do_not_do || [];
}

export function selectHasDoNotDo(envelope: MissionLensEnvelope | null): boolean {
  return (envelope?.data?.do_not_do?.length || 0) > 0;
}

export function selectDoNotDoCount(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.do_not_do?.length || 0;
}

export function selectCriticalDoNotDo(envelope: MissionLensEnvelope | null): DoNotDoItem[] {
  return envelope?.data?.do_not_do?.filter(item => item.severity === 'block') || [];
}

// ============================================================
// RISKS SELECTORS
// ============================================================

export function selectRisks(envelope: MissionLensEnvelope | null): RiskItem[] {
  return envelope?.data?.risks || [];
}

export function selectCriticalRisks(envelope: MissionLensEnvelope | null): RiskItem[] {
  return envelope?.data?.risks?.filter(r => r.severity === 'critical') || [];
}

export function selectWarningRisks(envelope: MissionLensEnvelope | null): RiskItem[] {
  return envelope?.data?.risks?.filter(r => r.severity === 'warning') || [];
}

export function selectRiskCount(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.risks?.length || 0;
}

export function selectHasCriticalRisks(envelope: MissionLensEnvelope | null): boolean {
  return (envelope?.data?.risks?.some(r => r.severity === 'critical')) || false;
}

// ============================================================
// DEADLINES SELECTORS
// ============================================================

export function selectDeadlines(envelope: MissionLensEnvelope | null): DeadlineItem[] {
  return envelope?.data?.deadlines || [];
}

export function selectOverdueDeadlines(envelope: MissionLensEnvelope | null): DeadlineItem[] {
  return envelope?.data?.deadlines?.filter(d => d.severity === 'overdue') || [];
}

export function selectTodayDeadlines(envelope: MissionLensEnvelope | null): DeadlineItem[] {
  return envelope?.data?.deadlines?.filter(d => d.severity === 'today') || [];
}

export function selectHasOverdueDeadlines(envelope: MissionLensEnvelope | null): boolean {
  return (envelope?.data?.deadlines?.some(d => d.severity === 'overdue')) || false;
}

// ============================================================
// CHECKPOINT SELECTORS
// ============================================================

export function selectCheckpoint(envelope: MissionLensEnvelope | null): CheckpointStatus | null {
  return envelope?.data?.checkpoint || null;
}

export function selectIsCheckpointAvailable(envelope: MissionLensEnvelope | null): boolean {
  return envelope?.data?.checkpoint?.available || false;
}

export function selectCheckpointLabel(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.checkpoint?.label || 'Checkpoint';
}

export function selectLastCheckpointAt(envelope: MissionLensEnvelope | null): string | null {
  return envelope?.data?.checkpoint?.last_checkpoint_at || null;
}

export function selectResumeHint(envelope: MissionLensEnvelope | null): string | null {
  return envelope?.data?.checkpoint?.resume_hint || null;
}

// ============================================================
// SYSTEM PULSE SELECTORS
// ============================================================

export function selectSystemPulse(envelope: MissionLensEnvelope | null): SystemPulse | null {
  return envelope?.data?.system_pulse || null;
}

export function selectSystemStatus(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.system_pulse?.status || 'offline';
}

export function selectLiveStatus(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.system_pulse?.live_status || 'offline';
}

export function selectDegradedCount(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.system_pulse?.degraded_count || 0;
}

export function selectCriticalCount(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.system_pulse?.critical_count || 0;
}

export function selectSystemMessage(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.system_pulse?.message || 'Sistema offline';
}

// ============================================================
// MENTOR SUMMARY SELECTORS
// ============================================================

export function selectMentorSummary(envelope: MissionLensEnvelope | null): MentorSummary | null {
  return envelope?.data?.mentor_summary || null;
}

export function selectMentorText(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.mentor_summary?.text || '';
}

export function selectMentorTone(envelope: MissionLensEnvelope | null): string {
  return envelope?.data?.mentor_summary?.tone || 'calm';
}

export function selectMentorUrgency(envelope: MissionLensEnvelope | null): number {
  return envelope?.data?.mentor_summary?.urgency || 1;
}

// ============================================================
// COMPOSITE SELECTORS (computed)
// ============================================================

/**
 * Retorna um resumo de "saúde" geral baseado em múltiplos indicadores
 */
export function selectOverallHealth(envelope: MissionLensEnvelope | null): {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
} {
  if (!envelope) {
    return { status: 'critical', message: 'Sistema offline' };
  }

  const criticalRisks = selectCriticalRisks(envelope).length;
  const overdueDeadlines = selectOverdueDeadlines(envelope).length;
  const isOffFocus = selectIsOffFocus(envelope);
  const systemStatus = selectSystemStatus(envelope);

  if (criticalRisks > 0 || overdueDeadlines > 0 || systemStatus === 'critical') {
    return { status: 'critical', message: 'Atenção urgente necessária' };
  }

  if (isOffFocus || systemStatus === 'degraded') {
    return { status: 'warning', message: 'Alguns alertas requerem atenção' };
  }

  return { status: 'healthy', message: 'Tudo operacional' };
}

/**
 * Retorna label amigável de tempo desde último checkpoint
 */
export function selectCheckpointTimeAgo(envelope: MissionLensEnvelope | null): string {
  const lastCheckpointAt = selectLastCheckpointAt(envelope);
  
  if (!lastCheckpointAt) return 'Nunca';
  
  const now = Date.now();
  const checkpointTime = new Date(lastCheckpointAt).getTime();
  const diffMs = now - checkpointTime;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes}min atrás`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}
```

***

## PARTE 3: DESIGN TOKENS (Tailwind + CSS Vars)

### 3.1 OCR da Imagem Visual — Mapeamento de Cores

Baseado na imagem anexada, a paleta consiste em:

**Cores Primárias:**
- **Azul céu vivo**: #3B8FD9 (céu, oceano, Aurora)
- **Dourado/Amarelo**: #F4C542 (Gringotts, XP, destaques)
- **Verde floresta**: #4CAF50 (Vila Viva, ilhas, natureza)
- **Vermelho coral**: #E74C3C (Arena Comercial, alertas, ação)
- **Roxo/Azul profundo**: #5B5FCF (Omnis Lab, tecnologia)
- **Laranja**: #FF6B35 (Agência, criatividade)
- **Marrom terra**: #8B7355 (pontes, castelo, fundações)

**Cores de Suporte:**
- **Branco nuvem**: #FFFFFF (nuvens, cards glassmorphism)
- **Cinza claro**: #E8E8ED (texto secundário, bordas sutis)
- **Cinza médio**: #8888A0 (texto terciário)
- **Cinza escuro**: #2A2A3A (sidebar, painéis escuros)
- **Preto suave**: #0A0A0F (backgrounds escuros)

**Ilhas/Domínios (cores temáticas):**
- Palco Central: Dourado + Vermelho (bandeira K)
- Omnis Lab: Azul tech (#4A90D9)
- Akasha/Gringotts: Dourado (#F4C542)
- Vila Viva: Verde natural (#4CAF50)
- Arena Comercial: Vermelho/Dourado (#E74C3C)
- Agência/Estúdio: Laranja/Vermelho (#FF6B35)
- Forja/Corpo: Cinza metálico (#7F8C8D)
- Nimbus Academy: Azul claro (#6BB6FF)
- Observatório: Roxo/Azul (#5B5FCF)
- Tesouro/Finanças: Verde dinheiro (#27AE60)

### 3.2 Tailwind Config Completo

```javascript
// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================================
        // KRATOS BRAND COLORS
        // ============================================================
        kratos: {
          primary: '#3B8FD9',      // Azul céu — Aurora, links, ações principais
          secondary: '#F4C542',    // Dourado — XP, recompensas, destaque
          accent: '#E74C3C',       // Vermelho coral — ações críticas, Arena
          success: '#4CAF50',      // Verde — confirmações, Vila Viva
          warning: '#FF9800',      // Laranja — avisos, Agência
          danger: '#E74C3C',       // Vermelho — alertas críticos
          info: '#6BB6FF',         // Azul claro — informações, Nimbus
          purple: '#5B5FCF',       // Roxo — Omnis Lab, IA, tech
        },
        
        // ============================================================
        // ILHAS / DOMÍNIOS (cores temáticas)
        // ============================================================
        islands: {
          central: '#F4C542',      // Palco Central — dourado
          omnis: '#4A90D9',        // Omnis Lab — azul tech
          akasha: '#F4C542',       // Akasha/Gringotts — dourado conhecimento
          vila: '#4CAF50',         // Vila Viva — verde vida
          arena: '#E74C3C',        // Arena Comercial — vermelho ação
          agencia: '#FF6B35',      // Agência — laranja criativo
          forja: '#7F8C8D',        // Forja/Corpo — cinza metálico
          nimbus: '#6BB6FF',       // Nimbus Academy — azul claro
          observatorio: '#5B5FCF', // Observatório — roxo estratégia
          tesouro: '#27AE60',      // Tesouro — verde dinheiro
        },
        
        // ============================================================
        // BACKGROUNDS (modo claro — mundo diurno)
        // ============================================================
        bg: {
          sky: '#87CEEB',          // Céu azul vivo
          ocean: '#4A90D9',        // Oceano
          cloud: '#FFFFFF',        // Nuvens
          glass: 'rgba(255, 255, 255, 0.1)', // Glassmorphism overlay
          card: '#FFFFFF',         // Cards principais
          sidebar: '#1A1A24',      // Sidebar escura
          panel: '#F8F9FA',        // Painéis secundários
          hover: '#E8E8ED',        // Hover states
        },
        
        // ============================================================
        // TEXTS
        // ============================================================
        text: {
          primary: '#0A0A0F',      // Texto principal (escuro sobre claro)
          secondary: '#2A2A3A',    // Texto secundário
          muted: '#8888A0',        // Texto terciário
          inverse: '#FFFFFF',      // Texto claro (sobre fundo escuro)
          link: '#3B8FD9',         // Links
        },
        
        // ============================================================
        // BORDERS & STROKES
        // ============================================================
        border: {
          DEFAULT: '#E8E8ED',      // Borda padrão
          light: '#F0F0F5',        // Borda sutil
          dark: '#2A2A3A',         // Borda escura
          focus: '#3B8FD9',        // Borda de foco
        },
        
        // ============================================================
        // SEVERITY COLORS (alertas, risks, deadlines)
        // ============================================================
        severity: {
          critical: '#E74C3C',     // Crítico — vermelho
          high: '#FF6B35',         // Alto — laranja-vermelho
          warning: '#FF9800',      // Warning — laranja
          normal: '#F4C542',       // Normal — amarelo
          low: '#4CAF50',          // Baixo — verde
          info: '#3B8FD9',         // Informação — azul
        },
        
        // ============================================================
        // FOCUS STATES (context drift)
        // ============================================================
        focus: {
          on: '#4CAF50',           // On focus — verde
          related: '#3B8FD9',      // Related — azul
          off: '#FF9800',          // Off focus — laranja
          unknown: '#8888A0',      // Unknown — cinza
        },
      },
      
      // ============================================================
      // SPACING (baseado em 8px grid)
      // ============================================================
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
        '4xl': '6rem',     // 96px
      },
      
      // ============================================================
      // BORDER RADIUS
      // ============================================================
      borderRadius: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        '2xl': '2rem',     // 32px
        'full': '9999px',
      },
      
      // ============================================================
      // SHADOWS (elevação e glassmorphism)
      // ============================================================
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'island': '0 12px 48px rgba(0, 0, 0, 0.2)',
        'hud': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'aurora': '0 8px 32px rgba(59, 143, 217, 0.3)',
      },
      
      // ============================================================
      // TYPOGRAPHY
      // ============================================================
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Satoshi',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1' }],            // 48px
      },
      
      // ============================================================
      // ANIMATIONS (microinterações)
      // ============================================================
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 143, 217, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 143, 217, 0.8)' },
        },
      },
      
      // ============================================================
      // BACKDROP BLUR (glassmorphism)
      // ============================================================
      backdropBlur: {
        'glass': '10px',
        'strong': '20px',
      },
    },
  },
  plugins: [],
}
```

### 3.3 CSS Variables (Global Styles)

```css
/* frontend/src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================================
   KRATOS GLOBAL CSS VARIABLES
   ============================================================ */

:root {
  /* ==================== COLORS ==================== */
  
  /* Brand */
  --kratos-primary: #3B8FD9;
  --kratos-secondary: #F4C542;
  --kratos-accent: #E74C3C;
  --kratos-success: #4CAF50;
  --kratos-warning: #FF9800;
  --kratos-danger: #E74C3C;
  --kratos-info: #6BB6FF;
  --kratos-purple: #5B5FCF;
  
  /* Backgrounds */
  --bg-sky: #87CEEB;
  --bg-ocean: #4A90D9;
  --bg-cloud: #FFFFFF;
  --bg-glass: rgba(255, 255, 255, 0.1);
  --bg-card: #FFFFFF;
  --bg-sidebar: #1A1A24;
  --bg-panel: #F8F9FA;
  --bg-hover: #E8E8ED;
  
  /* Texts */
  --text-primary: #0A0A0F;
  --text-secondary: #2A2A3A;
  --text-muted: #8888A0;
  --text-inverse: #FFFFFF;
  --text-link: #3B8FD9;
  
  /* Borders */
  --border-default: #E8E8ED;
  --border-light: #F0F0F5;
  --border-dark: #2A2A3A;
  --border-focus: #3B8FD9;
  
  /* ==================== SPACING ==================== */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  
  /* ==================== RADIUS ==================== */
  --radius-xs: 0.25rem;    /* 4px */
  --radius-sm: 0.5rem;     /* 8px */
  --radius-md: 0.75rem;    /* 12px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.5rem;     /* 24px */
  --radius-2xl: 2rem;      /* 32px */
  
  /* ==================== SHADOWS ==================== */
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  --shadow-island: 0 12px 48px rgba(0, 0, 0, 0.2);
  --shadow-hud: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-aurora: 0 8px 32px rgba(59, 143, 217, 0.3);
  
  /* ==================== TRANSITIONS ==================== */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* ==================== Z-INDEX ==================== */
  --z-base: 1;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
}

/* ============================================================
   DARK MODE OVERRIDES (opcional — KRATOS é primariamente claro)
   ============================================================ */

.dark {
  /* Backgrounds */
  --bg-sky: #0A0A0F;
  --bg-ocean: #1A1A24;
  --bg-card: #12121A;
  --bg-panel: #1A1A24;
  --bg-hover: #2A2A3A;
  
  /* Texts */
  --text-primary: #E8E8ED;
  --text-secondary: #8888A0;
  --text-muted: #585870;
  --text-inverse: #0A0A0F;
  
  /* Borders */
  --border-default: #2A2A3A;
  --border-light: #1A1A24;
  --border-dark: #3A3A4A;
}

/* ============================================================
   GLOBAL RESETS & UTILITIES
   ============================================================ */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-sky);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  height: 100%;
}

/* ============================================================
   SCROLLBARS (estilo macOS/clean)
   ============================================================ */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-panel);
}

::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ============================================================
   GLASS CARD (componente reutilizável)
   ============================================================ */

.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glass);
}

/* ============================================================
   HUD CARD (painéis operacionais)
   ============================================================ */

.hud-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-hud);
  transition: all var(--transition-base);
}

.hud-card:hover {
  box-shadow: var(--shadow-island);
  transform: translateY(-2px);
}

/* ============================================================
   STATUS BADGES
   ============================================================ */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.badge-success {
  background: rgba(76, 175, 80, 0.1);
  color: var(--kratos-success);
  border: 1px solid var(--kratos-success);
}

.badge-warning {
  background: rgba(255, 152, 0, 0.1);
  color: var(--kratos-warning);
  border: 1px solid var(--kratos-warning);
}

.badge-danger {
  background: rgba(231, 76, 60, 0.1);
  color: var(--kratos-danger);
  border: 1px solid var(--kratos-danger);
}

.badge-info {
  background: rgba(59, 143, 217, 0.1);
  color: var(--kratos-primary);
  border: 1px solid var(--kratos-primary);
}

/* ============================================================
   PROGRESS RINGS (inspired by Apple Watch)
   ============================================================ */

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset var(--transition-slow);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px var(--kratos-primary);
  }
  50% {
    box-shadow: 0 0 20px var(--kratos-primary);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* ============================================================
   FOCUS VISIBLE (accessibility)
   ============================================================ */

:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

/* ============================================================
   PREFERS REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

***

## PARTE 4: COMPONENTES PRONTOS (Código React + TypeScript)

### 4.1 MissionLensPanel (Painel Aurora Direito)

```typescript
// frontend/src/components/kratos/mission/MissionLensPanel.tsx

import React from 'react';
import type { MissionLensEnvelope } from '../../../types/mission-lens';
import {
  selectCurrentMissionTitle,
  selectFocusState,
  selectNextActionTitle,
  selectNextActionCTA,
  selectMentorText,
  selectMentorTone,
  selectIsStale,
} from '../../../lib/mission-lens-selectors';
import { getFocusStateVisual } from '../../../types/mission-lens';

interface MissionLensPanelProps {
  lens: MissionLensEnvelope | null;
}

export function MissionLensPanel({ lens }: MissionLensPanelProps) {
  const isStale = selectIsStale(lens);
  const missionTitle = selectCurrentMissionTitle(lens);
  const focusState = selectFocusState(lens);
  const nextAction = selectNextActionTitle(lens);
  const nextActionCTA = selectNextActionCTA(lens);
  const mentorText = selectMentorText(lens);
  const mentorTone = selectMentorTone(lens);
  
  const focusVisual = getFocusStateVisual(focusState as any);
  
  const toneColors: Record<string, string> = {
    calm: 'text-focus-on',
    warning: 'text-severity-warning',
    urgent: 'text-severity-critical',
    praise: 'text-kratos-secondary',
  };

  return (
    <div className="glass-card p-lg space-y-md">
      {/* Header Aurora */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-3 h-3 rounded-full bg-kratos-primary animate-pulse-glow"></div>
          <span className="text-sm font-semibold text-text-inverse uppercase tracking-wider">
            Aurora Online
          </span>
        </div>
        
        {isStale && (
          <span className="text-xs text-severity-warning">
            Dados desatualizados
          </span>
        )}
      </div>
      
      {/* Missão Atual */}
      <div className="space-y-xs">
        <div className="flex items-center gap-xs">
          <span className="text-2xl">{focusVisual.emoji}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-focus-${focusVisual.color}/10 text-focus-${focusVisual.color}`}>
            {focusVisual.label}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-text-inverse leading-tight">
          {missionTitle}
        </h3>
      </div>
      
      {/* Próxima Ação */}
      {nextAction !== 'Nenhuma ação recomendada' && (
        <div className="space-y-sm">
          <p className="text-sm text-text-inverse/80">
            {nextAction}
          </p>
          
          <button className="w-full px-md py-sm bg-kratos-primary hover:bg-kratos-primary/90 text-white rounded-md font-semibold transition-all shadow-hud hover:shadow-aurora">
            {nextActionCTA}
          </button>
        </div>
      )}
      
      {/* Mentor Summary */}
      {mentorText && (
        <div className={`p-md rounded-md bg-white/5 border-l-4 border-${toneColors[mentorTone] || 'text-text-muted'}`}>
          <p className={`text-sm ${toneColors[mentorTone] || 'text-text-inverse'}`}>
            {mentorText}
          </p>
        </div>
      )}
    </div>
  );
}
```

### 4.2 NextBestActionCard (Card de Ação Principal)

```typescript
// frontend/src/components/kratos/mission/NextBestActionCard.tsx

import React from 'react';
import type { MissionLensEnvelope } from '../../../types/mission-lens';
import {
  selectNextAction,
  selectNextActionTitle,
  selectNextActionPriority,
  selectNextActionCTA,
} from '../../../lib/mission-lens-selectors';
import { ChevronRight, Zap } from 'lucide-react';

interface NextBestActionCardProps {
  lens: MissionLensEnvelope | null;
  onAction?: () => void;
}

export function NextBestActionCard({ lens, onAction }: NextBestActionCardProps) {
  const action = selectNextAction(lens);
  const title = selectNextActionTitle(lens);
  const priority = selectNextActionPriority(lens);
  const ctaLabel = selectNextActionCTA(lens);
  
  if (!action) return null;
  
  const priorityColors: Record<string, string> = {
    critical: 'border-severity-critical bg-severity-critical/5',
    high: 'border-severity-high bg-severity-high/5',
    normal: 'border-kratos-primary bg-kratos-primary/5',
  };
  
  const borderColor = priorityColors[priority] || priorityColors.normal;

  return (
    <div className={`hud-card p-lg border-l-4 ${borderColor} space-y-md`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-lg bg-kratos-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-kratos-primary" />
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Próxima Ação
            </h3>
            {priority === 'critical' && (
              <span className="text-xs text-severity-critical font-semibold">
                URGENTE
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Título da Ação */}
      <h2 className="text-2xl font-bold text-text-primary leading-tight">
        {title}
      </h2>
      
      {/* Rationale */}
      {action.rationale && (
        <p className="text-sm text-text-secondary">
          {action.rationale}
        </p>
      )}
      
      {/* CTA Button */}
      <button
        onClick={onAction}
        className="w-full px-lg py-md bg-kratos-primary hover:bg-kratos-primary/90 text-white rounded-lg font-semibold transition-all shadow-hud hover:shadow-aurora flex items-center justify-center gap-sm group"
      >
        {ctaLabel}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
```

### 4.3 RisksPanel (Painel de Riscos)

```typescript
// frontend/src/components/kratos/mission/RisksPanel.tsx

import React from 'react';
import type { MissionLensEnvelope } from '../../../types/mission-lens';
import { selectRisks, selectCriticalRisks } from '../../../lib/mission-lens-selectors';
import { getSeverityColor, getRiskEntityIcon } from '../../../types/mission-lens';
import { AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface RisksPanelProps {
  lens: MissionLensEnvelope | null;
}

export function RisksPanel({ lens }: RisksPanelProps) {
  const risks = selectRisks(lens);
  const criticalRisks = selectCriticalRisks(lens);
  
  if (risks.length === 0) {
    return (
      <div className="hud-card p-lg text-center">
        <div className="w-12 h-12 mx-auto mb-md rounded-full bg-kratos-success/10 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-sm text-text-muted">Nenhum risco detectado</p>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      {/* Header */}
      {criticalRisks.length > 0 && (
        <div className="flex items-center gap-sm p-md bg-severity-critical/10 border border-severity-critical rounded-lg">
          <AlertTriangle className="w-5 h-5 text-severity-critical" />
          <span className="text-sm font-semibold text-severity-critical">
            {criticalRisks.length} risco{criticalRisks.length > 1 ? 's' : ''} crítico{criticalRisks.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Lista de Riscos */}
      <div className="space-y-sm">
        {risks.map((risk, idx) => {
          const severityColor = getSeverityColor(risk.severity);
          const IconComponent = (LucideIcons as any)[getRiskEntityIcon(risk.entity)] || LucideIcons.AlertCircle;
          
          return (
            <div
              key={idx}
              className={`hud-card p-md border-l-4 border-severity-${severityColor}`}
            >
              <div className="flex items-start gap-sm">
                <div className={`w-8 h-8 rounded-lg bg-severity-${severityColor}/10 flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-4 h-4 text-severity-${severityColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-primary mb-xs">
                    {risk.title}
                  </h4>
                  <p className="text-xs text-text-muted mb-xs">
                    {risk.reason}
                  </p>
                  {risk.suggested_action && (
                    <p className="text-xs text-kratos-primary font-medium">
                      → {risk.suggested_action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 4.4 DoNotDoBox (Lista "Não Fazer")

```typescript
// frontend/src/components/kratos/mission/DoNotDoBox.tsx

import React, { useState } from 'react';
import type { MissionLensEnvelope } from '../../../types/mission-lens';
import { selectDoNotDoItems, selectDoNotDoCount } from '../../../lib/mission-lens-selectors';
import { XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface DoNotDoBoxProps {
  lens: MissionLensEnvelope | null;
}

export function DoNotDoBox({ lens }: DoNotDoBoxProps) {
  const items = selectDoNotDoItems(lens);
  const count = selectDoNotDoCount(lens);
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (count === 0) return null;

  return (
    <div className="hud-card border-severity-danger">
      {/* Header Colapsável */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-md flex items-center justify-between hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-sm">
          <XCircle className="w-5 h-5 text-severity-danger" />
          <span className="text-sm font-semibold text-text-primary">
            Não Fazer Agora ({count})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>
      
      {/* Lista de Itens */}
      {isExpanded && (
        <div className="px-md pb-md space-y-sm">
          {items.map((item, idx) => {
            const severityIcons: Record<string, string> = {
              block: '🚫',
              warn: '⚠️',
              suggest: '💡',
            };
            
            const severityColors: Record<string, string> = {
              block: 'text-severity-critical',
              warn: 'text-severity-warning',
              suggest: 'text-text-muted',
            };
            
            return (
              <div key={idx} className="flex items-start gap-sm p-sm bg-bg-panel rounded-md">
                <span className="text-lg">{severityIcons[item.severity]}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${severityColors[item.severity]}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted mt-xs">
                    {item.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

***

## PARTE 5: ROADMAP DE IMPLEMENTAÇÃO PARA CLAUDE CODE

### Fase 1: Preparação (30min)
**Objetivo:** Setup inicial, leitura de arquivos, confirmação de contratos

**Ações:**
1. Ler todos os arquivos do `frontend/src/types/` e `frontend/src/lib/api.ts`
2. Confirmar que o backend está rodando em `http://localhost:5100`
3. Testar endpoints: `/health`, `/mission/lens`, `/live/snapshot`
4. Validar estrutura de pastas: `frontend/src/components/kratos/`
5. Criar branch `feature/kratos-1.0-visual`

**Entrega:** Confirmação de que backend/frontend atual estão operacionais

***

### Fase 2: Mission Lens Types + Selectors (1h)
**Objetivo:** Implementar types e selectors completos

**Ações:**
1. Criar `frontend/src/types/mission-lens.ts` com código da Parte 2.1
2. Criar `frontend/src/lib/mission-lens-selectors.ts` com código da Parte 2.2
3. Atualizar `frontend/src/types/kratos.ts` para importar e re-exportar os novos types
4. Criar testes unitários para os selectors (opcional mas recomendado)

**Entrega:** Types e selectors testados e funcionais

***

### Fase 3: Design Tokens (1h)
**Objetivo:** Aplicar design system completo

**Ações:**
1. Substituir `frontend/tailwind.config.js` pelo código da Parte 3.2
2. Substituir `frontend/src/index.css` pelo código da Parte 3.3
3. Adicionar fontes via CDN no `index.html`:
   ```html
   //fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   //api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap" rel="stylesheet">
   ```
4. Rodar `npm run dev` e confirmar que cores estão aplicadas

**Entrega:** Design tokens funcionando, cores visíveis no frontend

***

### Fase 4: Componentes Mission Lens (2-3h)
**Objetivo:** Criar componentes React para Mission Lens

**Ações:**
1. Criar pasta `frontend/src/components/kratos/mission/`
2. Implementar componentes da Parte 4:
   - `MissionLensPanel.tsx`
   - `NextBestActionCard.tsx`
   - `RisksPanel.tsx`
   - `DoNotDoBox.tsx`
3. Criar `index.ts` para exports:
   ```typescript
   export { MissionLensPanel } from './MissionLensPanel';
   export { NextBestActionCard } from './NextBestActionCard';
   export { RisksPanel } from './RisksPanel';
   export { DoNotDoBox } from './DoNotDoBox';
   ```

**Entrega:** Componentes criados e exportados

***

### Fase 5: Integração na Página Agora (1-2h)
**Objetivo:** Ligar Mission Lens à tela principal

**Ações:**
1. Abrir `frontend/src/pages/Agora.tsx`
2. Importar novos componentes:
   ```typescript
   import { MissionLensPanel, NextBestActionCard, RisksPanel, DoNotDoBox } from '../components/kratos/mission';
   import { selectMissionLensSource } from '../lib/mission-lens-selectors';
   ```
3. Integrar no layout da página `Agora`:
   ```tsx
   {/* Right Rail — Aurora Panel */}
   <div className="w-96 space-y-md">
     <MissionLensPanel lens={liveData?.mission_lens} />
   </div>
   
   {/* Central Area */}
   <div className="flex-1 space-y-md">
     <NextBestActionCard lens={liveData?.mission_lens} />
     <RisksPanel lens={liveData?.mission_lens} />
     <DoNotDoBox lens={liveData?.mission_lens} />
   </div>
   ```
4. Testar no navegador com backend live

**Entrega:** Tela Agora renderizando Mission Lens

***

### Fase 6: Refinamento Visual (2h)
**Objetivo:** Ajustar cores, espaçamentos, responsividade

**Ações:**
1. Ajustar glassmorphism nos painéis
2. Garantir acessibilidade (contraste, focus states)
3. Testar responsividade (breakpoints 1024px, 768px)
4. Adicionar animações sutis (framer-motion opcional)

**Entrega:** Visual refinado e responsivo

***

### Fase 7: Testes e Validação (1h)
**Objetivo:** Confirmar que tudo funciona

**Ações:**
1. Rodar `npm run build` e confirmar 0 erros
2. Testar SSE com backend live
3. Testar estados: loading, error, stale, degraded
4. Testar com dados mock
5. Validar no Chrome DevTools (performance, acessibilidade)

**Entrega:** Build limpo, frontend 1.0 operacional

***

## PARTE 6: PROMPTS PARA CLAUDE CODE

### Prompt 1: Auditoria Inicial

```
KRATOS 1.0 — Fase 1: Auditoria Inicial

Objetivo: Validar o estado atual do KRATOS 0.9 antes de iniciar redesign visual.

Ações:
1. Ler todos os arquivos em frontend/src/types/ e frontend/src/lib/api.ts
2. Confirmar que backend está rodando em http://localhost:5100
3. Testar endpoints:
   - GET http://localhost:5100/health
   - GET http://localhost:5100/mission/lens
   - GET http://localhost:5100/live/snapshot
4. Validar estrutura de pastas: frontend/src/components/kratos/
5. Listar todos os componentes React atuais
6. Gerar relatório de auditoria

NÃO altere nenhum arquivo. Apenas leia e reporte.

Entrega:
- Relatório markdown com:
  - Status do backend (rodando/offline)
  - Estrutura de componentes atual
  - Endpoints testados e respostas
  - Warnings/erros encontrados
```

### Prompt 2: Implementar Mission Lens Types

```
KRATOS 1.0 — Fase 2: Mission Lens Types + Selectors

Objetivo: Criar types e selectors completos para Mission Lens v1.

Ações:
1. Criar arquivo frontend/src/types/mission-lens.ts
2. Implementar EXATAMENTE o código fornecido no dossiê (Parte 2.1)
3. Criar arquivo frontend/src/lib/mission-lens-selectors.ts
4. Implementar EXATAMENTE o código fornecido no dossiê (Parte 2.2)
5. Atualizar frontend/src/types/kratos.ts para re-exportar os novos types:
   ```typescript
   export * from './mission-lens';
   ```
6. Rodar `npm run dev` e confirmar 0 erros TypeScript
7. Gerar relatório

Restrições:
- NÃO alterar backend
- NÃO alterar contratos existentes
- NÃO remover types existentes
- Apenas ADICIONAR novos arquivos

Entrega:
- Arquivos criados: mission-lens.ts, mission-lens-selectors.ts
- Relatório de sucesso/erros
```

### Prompt 3: Aplicar Design Tokens

```
KRATOS 1.0 — Fase 3: Design Tokens (Tailwind + CSS)

Objetivo: Aplicar design system completo baseado na identidade visual das ilhas flutuantes.

Ações:
1. BACKUP: Salvar cópia de tailwind.config.js e index.css atuais
2. Substituir frontend/tailwind.config.js pelo código do dossiê (Parte 3.2)
3. Substituir frontend/src/index.css pelo código do dossiê (Parte 3.3)
4. Adicionar fontes no index.html:
   ```html
   //fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   //api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap" rel="stylesheet">
   ```
5. Rodar `npm run dev` e confirmar que frontend compila
6. Abrir http://localhost:5173 e verificar se cores estão aplicadas
7. Gerar relatório com screenshots (se possível)

Restrições:
- NÃO alterar componentes React ainda
- NÃO alterar backend
- Apenas aplicar tokens CSS/Tailwind

Entrega:
- tailwind.config.js atualizado
- index.css atualizado
- index.html com fontes
- Relatório visual (cores aplicadas?)
```

### Prompt 4: Criar Componentes Mission Lens

```
KRATOS 1.0 — Fase 4: Componentes Mission Lens

Objetivo: Criar componentes React para exibir Mission Lens.

Ações:
1. Criar pasta frontend/src/components/kratos/mission/
2. Criar arquivo MissionLensPanel.tsx com código do dossiê (Parte 4.1)
3. Criar arquivo NextBestActionCard.tsx com código do dossiê (Parte 4.2)
4. Criar arquivo RisksPanel.tsx com código do dossiê (Parte 4.3)
5. Criar arquivo DoNotDoBox.tsx com código do dossiê (Parte 4.4)
6. Criar arquivo index.ts com exports:
   ```typescript
   export { MissionLensPanel } from './MissionLensPanel';
   export { NextBestActionCard } from './NextBestActionCard';
   export { RisksPanel } from './RisksPanel';
   export { DoNotDoBox } from './DoNotDoBox';
   ```
7. Instalar dependência lucide-react se ainda não estiver:
   ```bash
   npm install lucide-react
   ```
8. Rodar `npm run dev` e confirmar 0 erros
9. Gerar relatório

Restrições:
- NÃO integrar ainda na página Agora
- NÃO alterar backend
- Apenas criar componentes isolados

Entrega:
- 4 componentes criados
- index.ts com exports
- Relatório de sucesso/erros TypeScript
```

### Prompt 5: Integrar na Página Agora

```
KRATOS 1.0 — Fase 5: Integração na Página Agora

Objetivo: Ligar Mission Lens à tela principal do KRATOS.

Ações:
1. Abrir frontend/src/pages/Agora.tsx
2. Importar novos componentes:
   ```typescript
   import { MissionLensPanel, NextBestActionCard, RisksPanel, DoNotDoBox } from '../components/kratos/mission';
   ```
3. Modificar o layout para incluir:
   - Right rail (w-96): MissionLensPanel
   - Central area: NextBestActionCard, RisksPanel, DoNotDoBox
4. Passar prop `lens={liveData?.mission_lens}` para todos os componentes
5. Testar no navegador com backend rodando
6. Confirmar que Mission Lens está renderizando
7. Gerar relatório com screenshots

Layout sugerido:
```tsx
<div className="flex gap-md h-full">
  {/* Central Area */}
  <div className="flex-1 space-y-md overflow-y-auto">
    <NextBestActionCard lens={liveData?.mission_lens} />
    <RisksPanel lens={liveData?.mission_lens} />
    <DoNotDoBox lens={liveData?.mission_lens} />
  </div>
  
  {/* Right Rail — Aurora */}
  <div className="w-96 space-y-md overflow-y-auto">
    <MissionLensPanel lens={liveData?.mission_lens} />
  </div>
</div>
```

Entrega:
- Página Agora atualizada
- Mission Lens funcionando
- Relatório visual
```

### Prompt 6: Build Final e Validação

```
KRATOS 1.0 — Fase 6: Build Final e Validação

Objetivo: Confirmar que KRATOS 1.0 está pronto.

Ações:
1. Rodar `npm run build` e confirmar 0 erros
2. Testar SSE com backend live:
   - Abrir http://localhost:5173
   - Abrir DevTools Network
   - Confirmar que /live/stream está conectado
3. Testar estados:
   - Loading state (backend offline)
   - Live state (backend online)
   - Stale state (esperar 12s sem updates)
4. Validar acessibilidade no Chrome DevTools (Lighthouse)
5. Testar responsividade (1920px, 1440px, 1024px)
6. Gerar relatório final completo

Checklist de Validação:
- [ ] Build limpo (0 erros TypeScript)
- [ ] SSE conectado e recebendo updates
- [ ] Mission Lens renderizando corretamente
- [ ] Cores/design tokens aplicados
- [ ] Componentes responsivos
- [ ] Acessibilidade (contraste, focus states)
- [ ] Performance aceitável (< 100ms para renderizar)

Entrega:
- Relatório final
- Screenshots do frontend 1.0
- Lista de próximos passos (se houver)
```

***

## CONCLUSÃO

Este dossiê contém **TODOS os códigos prontos** para Claude Code implementar o KRATOS 1.0 Visual:

✅ **Mission Lens Types** (TypeScript completo)  
✅ **Mission Lens Selectors** (funções defensivas)  
✅ **Design Tokens** (Tailwind config + CSS vars)  
✅ **Componentes React** (4 componentes prontos)  
✅ **Roadmap de Implementação** (7 fases)  
✅ **Prompts para Claude Code** (6 prompts sequenciais)

**Próximos Passos:**
1. Enviar este dossiê para Claude Code
2. Executar os 6 prompts em ordem
3. Validar que KRATOS 1.0 está operacional
4. Iterar sobre ajustes visuais conforme necessário

**Importante:**
- Preservar 100% do backend (não alterar endpoints, collectors, serviços)
- Preservar contratos existentes (Mission Lens v1 é canônico)
- Focar em camada visual/frontend apenas
- Manter SSE funcionando (useLiveKratos.ts)

***

**Tigrao, este é o KRATOS 1.0 pronto para Claude Code construir.** 🔥

Todos os códigos estão aqui, organizados e testáveis. Basta seguir o roadmap e executar os prompts em sequência.