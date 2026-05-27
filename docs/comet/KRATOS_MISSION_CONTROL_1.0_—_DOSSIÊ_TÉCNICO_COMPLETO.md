# KRATOS MISSION CONTROL 1.0 — DOSSIÊ TÉCNICO COMPLETO

**Data:** 13 de Maio de 2026  
**Versão Base:** KRATOS 0.9 (operacional, 304 testes, SSE live, React 19 + Vite 8)  
**Objetivo:** Elevar ao **KRATOS 1.0** com frontend visual Apple-clean + mundo vivo + ilhas + neurocompatível

***

## 1. EXECUTIVE SUMMARY

Este dossiê consolida **todos os arquivos do espaço KRATOS**, **benchmarks globais** e **40+ repositórios GitHub validados** para construir o **KRATOS Mission Control 1.0** — um cockpit operacional neurocompatível, visual, espacial e AI-native que transforma caos digital em próxima ação clara.

**KRATOS 0.9 já funciona**. Backend FastAPI + 25 tabelas SQLite + 71 endpoints + SSE live + 304 testes passando. O frontend React/Vite tem 10 páginas e 32 componentes. A missão agora é **redesenhar visualmente** para parecer um mundo operacional vivo, mantendo 100% do backend intacto.[^1]

**Stack confirmada:** React 19, Vite 8, TypeScript 6, Tailwind 4.2, shadcn/ui, Radix UI, Lucide Icons, Framer Motion, EventSource SSE. **Não mexer:** FastAPI, SQLite, collectors, endpoints, Mission Lens v1.[^2][^1]

**Direção visual decidida nos arquivos do espaço:**[^3]
- 80% Apple/Linear/Raycast clean
- 15% Jarvis/Mission Control operacional  
- 5% emoção visual controlada (ilhas flutuantes, HUD, glassmorphism sutil, mundo azul vivo)
- **Não:** cyberpunk escuro, dashboard SaaS genérico, carnaval sci-fi[^4]

**11 Ilhas do KRATOS mapeadas nos arquivos:**[^3]
1. **Palco Central** — hub principal, missão ativa, castelo K  
2. **Omnis Lab** — IA, agentes, automações, Claude Code, squads  
3. **Akasha/Gringotts** — memória, prompts, RAG, conhecimento  
4. **Arena Comercial** — vendas, negociação, metas, CRM  
5. **Agência/Estúdio** — conteúdo, campanhas, marca, comunicação  
6. **Vila Viva** — família, rotina, vida real, equilíbrio  
7. **Observatório** — filosofia, estratégia, visão, decisões  
8. **Nimbus Academy** — aprendizado, evolução, coragem  
9. **Tesouro/Finanças** — caixa, metas financeiras, patrimônio  
10. **Forja/Corpo** — corpo, treino, sono, energia, hábitos  
11. **Finalizar** — itens próximos de concluir, checkpoint de progresso

**Entregáveis deste dossiê:**
- Diagnóstico completo do KRATOS 0.9 operacional
- 40+ repositórios GitHub validados com licenças, estrelas e casos de uso
- Design system completo (tokens, cores, tipografia, componentes)
- Arquitetura de componentes React/TypeScript
- 20+ snippets de código TypeScript/React prontos para Codex
- Estratégia SSE + performance com EventSource
- Padrões ADHD-first UX com base em pesquisa neurodivergente
- Aurora/Jarvis conversacional integrado
- Roadmap de 8 fases para Claude Code/Codex executar
- 10 prompts sequenciais plug-and-play
- Checklist de validação final

***

## 2. ESTADO ATUAL — KRATOS 0.9 OPERACIONAL

### 2.1 Backend (Preservar 100%)

**Stack confirmada:**[^1]
- FastAPI 0.115.6 + Uvicorn 0.34.0
- SQLite WAL mode com 25 tabelas
- Pydantic 2.10.4 para validação
- 71 endpoints REST distribuídos em 26 routers
- 16 services de lógica de negócio
- 7 collectors read-only (System, Docker, Git, OMNIS, ActivityWatch, Outputs, Context)
- Sistema de fallback em 3 camadas: CLI real → cache TTL → mock JSON

**Endpoints críticos para o frontend:**[^1]
- `GET /live/stream` — SSE push a cada 5s com Mission Lens
- `GET /live/snapshot` — fallback REST quando SSE cai
- `GET /mission/lens` — Mission Lens v1 direto
- `GET /context/current` — contexto atual (app, janela, projeto inferido)
- `GET /now` — visão geral do "agora"
- `GET /projects` — projetos com status, fase, prioridade, risco
- `GET /deadlines` — deadlines atrasados e próximos
- `GET /checkpoints` — save-games com snapshot JSON

**Banco de dados — 25 tabelas:**[^1]
- Core: projects, missions, checkpoints, tasks, project_goals, deliverables, reminders
- Observabilidade: collector_runs, alert_events, metric_timeseries, mentor_recommendations
- Operacionais: calendar_events, execution_plans, daily_plans, weekly_plans, deadline_rules, activity_windows, activity_sessions, browser_contexts, context_switches

**Testes:** 304 passando em 12 arquivos, cobertura completa de SSE, Mission Lens, drift, checkpoint engine, collectors.[^1]

### 2.2 Frontend Atual (Redesenhar Visualmente)

**Stack confirmada:**[^1]
- React 19.2.5 + React Router DOM 7.15.0
- Vite 8.0.10
- TypeScript 6.0.2
- Tailwind CSS 4.2.4
- 10 páginas: Agora, Contexto, Checkpoints, Agenda, Deadlines, Projetos, Tarefas, Sistema, Finalizar, OmnisSnapshot
- 32 componentes prontos: MissionLensPanel, NextBestActionCard, LiveStatusIndicator, ExecutionPlanCard, FocusModeCard, AlertList, RiskBanner, DeadlineCalendar, CheckpointPanel, AuroraPanel (conceitual), etc.[^1]

**Hook crítico:** `useLiveKratos.ts`[^1]
- Abre EventSource para `/live/stream` (SSE preferencial)
- Se falhar → modo `reconnecting` → fallback HTTP polling em `/live/snapshot` a cada 10s
- Retry SSE a cada 5s
- States: `live | reconnecting | polling | fallback | offline`
- Cleanup: fecha EventSource + limpa timers no unmount

**Tema dark atual:**[^1]
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--bg-card: #1a1a24
--border: #2a2a3a
--text-primary: #e8e8ed
--text-secondary: #8888a0
--text-muted: #585870
--blue: #4a90d9
--green: #34c759
--yellow: #f0c040
--red: #e04050
--purple: #8b5cf6
```

### 2.3 Mission Lens v1 (Contrato Canônico)

O **Mission Lens** é a fonte da verdade do cockpit. Ele aparece em:[^1]
- `/mission/lens` (REST direto)
- `/live/snapshot` (campo `mission_lens` no JSON)
- `/live/stream` (eventos SSE a cada 5s com `mission_lens`)

**Envelope padrão:**
```json
{
  "contract_version": "mission_lens.v1",
  "source": "mock|activitywatch|fallback",
  "collector_status": "ok|degraded|error",
  "generated_at": "ISO 8601 UTC",
  "stale_after_ms": 12000,
  "data": { ... }
}
```

**8 blocos de dados obrigatórios:**[^1]

1. **current_mission** (object)  
   - `title`, `project`, `focus_state`, `confidence`, `drift`  
   - **Display:** barra superior, highlight se `off_focus`

2. **next_action** (object)  
   - `title`, `rationale`, `priority`, `source`, `cta_label`  
   - **Display:** mais proeminente da tela, card central destacado

3. **do_not_do** (array[1..5])  
   - `title`, `reason`, `severity`  
   - **Display:** lista colapsável, sempre >=1 item

4. **risks** (array[0..6])  
   - `title`, `severity`, `entity`, `reason`, `suggested_action`  
   - **Display:** cards vermelho/amarelo/cinza

5. **deadlines** (array[0..5])  
   - `title`, `project_id`, `severity`, `due_at`  
   - **Display:** não renderizar se vazio

6. **checkpoint** (object)  
   - `available`, `label`, `last_checkpoint_at`, `resume_hint`  
   - **Display:** sempre renderizar, cinza se não disponível

7. **system_pulse** (object)  
   - `status`, `live_status`, `degraded_count`, `critical_count`  
   - **Display:** barra de status colorida

8. **mentor_summary** (object)  
   - `text`, `tone`, `urgency`  
   - **Display:** abaixo do next_action, cor por tone

**Regras de mapeamento frontend:**
- Criar TypeScript interfaces para cada bloco
- Criar selectors memoizados para mapear payload grande → props pequenas
- Criar fallback states: loading/stale/degraded/offline/empty
- Nunca hardcodar dados do Mission Lens
- Respeitar `stale_after_ms` para mostrar estado stale visualmente

***

## 3. PESQUISA DE BENCHMARKS E PADRÕES UX

### 3.1 Produtos de Referência Visual

**Linear** (25% de peso no DNA visual)[^4]
- Tipografia densa + limpa, hierarquia de status com cores semânticas minimalistas
- Sidebar com grupos colapsáveis, kbd shortcuts visíveis
- **Aplicar no KRATOS:** sidebar esquerda, status badges clean, cmd+k sempre visível

**Raycast** (20% de peso)[^5][^4]
- O melhor command palette do mundo: ícone + label + shortcut em linha única, zero decoração, velocidade percebida altíssima
- **Aplicar no KRATOS:** usar `cmdk` lib para Aurora/Jarvis command palette[^6][^5]

**macOS Sequoia** (15% de peso)[^4]
- Espacamento, blur, profundidade de layers, consistência
- **Aplicar no KRATOS:** glassmorphism sutil, backdrop-filter: blur(10px), rgba backgrounds com alpha 0.1-0.25[^7][^8]

**Vercel Dashboard** (10% de peso)[^9][^4]
- Cards de status com live indicators (ponto verde pulsante), degraded states com amarelo sutil, empty states com microcopy útil
- **Aplicar no KRATOS:** painel Sistema/Serviços com cards de Docker/Git/OMNIS status

**Things 3** (10% de peso)[^4]
- Hierarquia Hoje → Em seguida → Em algum dia é o modelo mental do KRATOS
- **Aplicar no KRATOS:** tela Agora com next_action único destacado

**Cursor** (modelo para Aurora)[^4]
- Sidebar de chat contextual que não toma espaço principal
- **Aplicar no KRATOS:** Aurora como sidebar direita colapsável, não modal

### 3.2 Padrões ADHD-First UX (Pesquisa Neurodivergente)

**Princípios baseados em pesquisa recente:**[^10][^11][^12]

1. **Visual clarity e mínimas distrações**[^10]
   - Eliminar conteúdo e elementos que competem por atenção
   - Auto-playing videos, animações agressivas e pop-ups são os maiores inimigos para ADHD[^12]
   - **No KRATOS:** sem autoplay, motion moderado (max 200ms), prefers-reduced-motion obrigatório

2. **Estrutura previsível com navegação clara**[^10]
   - Consistência ajuda pessoas com ADHD a se sentirem orientadas e confiantes
   - Manter navegação, search bar e elementos-chave na mesma posição em toda página[^12]
   - **No KRATOS:** sidebar fixa, topbar fixa, bottom mission bar fixa

3. **Feedback interativo e indicadores de progresso**[^10]
   - Mostrar progresso, passos completos ou tarefas pendentes ajuda a manter foco e motivação
   - **No KRATOS:** progress rings, checkpoint markers, mission bar com % de progresso

4. **Configurações ajustáveis e personalização**[^10]
   - Deixar usuários controlarem animações, cues sonoros, contraste e densidade de informação
   - **No KRATOS:** modo foco toggle (menos cor, menos distrações, alvos maiores, motion reduzido)

5. **Dashboard com "today's tasks", "in progress", "up next"**[^10]
   - Usar badges para deadlines, bold no item mais urgente, tarefas secundárias esmaecidas
   - Pessoa com ADHD olha a tela e sabe exatamente o que fazer a seguir
   - **No KRATOS:** tela Agora com next_action em destaque, do_not_do sempre visível

6. **Fluxos de interação passo-a-passo**[^10]
   - Para forms, uploads, guias multi-step: usar progressive disclosure — mostrar um passo por vez, marcar progresso claramente (ex: "Step 2 of 4")
   - **No KRATOS:** checkpoint creation, missão wizard se necessário

7. **Clareza visual integrada**[^11][^10]
   - Fontes importam: usar sans-serifs de alta legibilidade, ótimo line spacing (min 1.5), contraste moderado
   - Evitar backdrops pesados, conteúdo auto-play ou muitas partes em movimento
   - **No KRATOS:** Inter/SF Pro para body, line-height 1.5, texto calm sem tremor

8. **Lembretes com propósito**[^10]
   - Oferecer lembretes opcionais — um alerta de que task está pendente ou draft incompleto
   - Nudges gentis ajudam ao invés de interromper
   - **No KRATOS:** checkpoint_suggestion do Mission Lens como nudge suave

9. **Escolha de modos**[^10]
   - Habilitar toggle "focus mode" — menos cor, menos distrações visuais, alvos maiores, motion reduzido
   - **No KRATOS:** botão toggle focus mode no topbar

10. **Minimizar carga cognitiva**[^12]
    - Distrações puxam foco. Auto-playing videos, animações agressivas e pop-ups são os maiores ofensores
    - Manter interface calma e intencional. Se elemento não serve objetivo atual do usuário, provavelmente não deveria estar lá
    - **No KRATOS:** sem pop-ups, sem modals desnecessários, comando palette em overlay leve

11. **Task flows claros**[^12]
    - Forms longos e complexos são especialmente desafiadores para ADHD
    - Quebrá-los em wizards passo-a-passo reduz carga cognitiva massivamente e torna conclusão gerenciável ao invés de assustadora
    - **No KRATOS:** criar tarefa/projeto com wizard se necessário

12. **UI perdoadora**[^12]
    - Erros acontecem mais facilmente quando atenção e working memory estão esticados
    - Tornar simples desfazer ações, voltar um passo ou corrigir erro sem penalidade
    - Mensagens de erro devem ser impossíveis de perder
    - **No KRATOS:** checkpoint system como undo/redo mental, errors destacados

### 3.3 Glassmorphism e Depth (Pesquisa de Implementação)

**Propriedades core CSS para glassmorphism:**[^8][^7]

```css
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
```

**Ajustes por tipo de background:**[^8]
- Gradients coloridos: usar opacity menor (0.1-0.15)
- Image backgrounds: aumentar blur para 12-15px
- Cores sólidas: reduzir blur para 6-8px para sutileza

**Fallback para navegadores antigos:**[^8]
```css
.glass-card {
  /* Fallback */
  background: rgba(255, 255, 255, 0.9);
}

@supports (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
```

**Performance optimization:**[^8]
- Limitar elementos glass a 2-3 por viewport
- Evitar animação em elementos com backdrop-filter
- Usar `will-change: backdrop-filter` com moderação
- Testar em dispositivos mid-range
- Para mobile, considerar reduzir blur intensity ou prover estilos alternativos

**Acessibilidade:**[^8]
- Adicionar text shadows para contraste: `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);`
- Aumentar background opacity para áreas de texto crítico
- Testar contrast ratios com WebAIM's Contrast Checker
- Aim for min 4.5:1 para texto normal, 3:1 para texto grande

### 3.4 Framer Motion Best Practices (Performance)

**Instalação e import:**[^13][^14]
```bash
npm install framer-motion
```

```tsx
import { motion } from 'framer-motion';
```

**Exemplo básico de animação:**[^13]
```tsx
const MyComponent = () => (
  <motion.div animate={{ scale: 1.5 }}>
    Hello, Framer Motion!
  </motion.div>
);
```

**Performance best practices:**[^14]
- Framer Motion é pesadamente otimizado para usar hardware acceleration
- Animações ficam buttery smooth quando seguem boas práticas
- **Priorizar:** opacity e transform (x, y, scale, rotate) — são GPU-accelerated
- **Evitar:** animações em width/height/top/left/margin — causam reflow/repaint
- **Duração máxima:** 200ms para microinterações, 400ms para transições grandes
- **Usar `layoutId`** para transições compartilhadas entre componentes

**Exemplo de card hover com motion:**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
  className="glass-card"
>
  {children}
</motion.div>
```

**Exemplo de live indicator pulse:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="w-2 h-2 rounded-full bg-green-500"
/>
```

***

## 4. REPOSITÓRIOS GITHUB VALIDADOS (40+ SELECIONADOS)

### 4.1 Dashboards Base (Estrutura React + Vite + shadcn/ui)

#### 1. satnaing/shadcn-admin
- **Link:** github.com/satnaing/shadcn-admin[^15]
- **Estrelas:** ~11,857[^9]
- **Stack:** React + Vite + shadcn/ui + Tailwind + TypeScript[^16][^15]
- **Licença:** MIT[^17]
- **Por que serve:** Fastest-growing React dashboard no GitHub. Estrutura mais próxima do KRATOS. Sidebar colapsável, Cmd+K, dark mode first-class.[^9]
- **Componentes a usar:** Sidebar, Command Palette, Cards, Badges, Data Tables[^16]
- **Riscos:** Estrutura opinativa — Lovable/Codex pode tentar refatorar. Passar como referência visual, não estrutural.
- **Maturidade:** Alta, última atualização recente[^18][^19]
- **Compatibilidade Vite:** ✅ Excelente — foi construído com Vite[^20][^16]
- **Comando instalação:** `git clone https://github.com/satnaing/shadcn-admin.git`
- **Arquivos principais:** `/src/components`, `/src/pages`, `/src/hooks`
- **Nota KRATOS:** 9/10 utilidade, 2/10 risco

#### 2. shadcn/ui (oficial)
- **Link:** github.com/shadcn-ui/ui[^16]
- **Stack:** React + Radix UI + Tailwind[^21]
- **Licença:** MIT
- **Por que serve:** Blocos copy-paste. Codex/Claude conhecem profundamente esse sistema.[^21]
- **Componentes a usar:** Card, Badge, Alert, Command, Sheet, Separator, Tooltip, Dialog, Dropdown Menu[^6]
- **Riscos:** Nenhum crítico
- **Nota KRATOS:** 10/10 utilidade, 0/10 risco
- **Observação:** shadcn/ui é implementação de Radix UI Tailwind examples, não lib proprietária[^22]

#### 3. hariadiarief/react-vite-shadcn-dashboard-starter-kit
- **Link:** github.com/hariadiarief/react-vite-shadcn-dashboard-starter-kit[^23]
- **Stack:** React + Vite + shadcn/ui
- **Licença:** MIT
- **Por que serve:** Sidebar auto-gerada, responsivo. Boa base de layout.[^23]
- **Features:** Responsive Web Design, Auto generated sidebar menu from react-router[^23]
- **Nota KRATOS:** 8/10 utilidade, 1/10 risco

#### 4. TailwindAdmin
- **Link:** github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template
- **Stack:** React + Tailwind CSS
- **Licença:** MIT
- **Por que serve:** Componentes de dashboard prontos, muito limpos[^16]
- **Nota KRATOS:** 7/10 utilidade, 1/10 risco

#### 5. n2duc/shadcn-dashboard
- **Link:** github.com/n2duc/shadcn-dashboard[^20]
- **Stack:** React + Vite + HMR + ESLint
- **Por que serve:** Template mínimo para começar React com Vite e shadcn[^20]
- **Nota KRATOS:** 7/10 utilidade, 0/10 risco

#### 6. rohitsoni007/shadcn-admin
- **Link:** github.com/rohitsoni007/shadcn-admin[^24]
- **Features:** TypeScript support, Form validation com Zod, React Hook Form integration, TanStack Query para data fetching, Hot module replacement[^24]
- **Nota KRATOS:** 8/10 utilidade, 1/10 risco

#### 7. DashboardPack Premium Templates (Referência Comercial)
- **Apex, Fortress, Signal, Vault, Flux**[^9]
- **Stack:** Next.js 16 + React 19 + shadcn/ui + Tailwind v4[^9]
- **Licença:** Comercial ($69+)
- **Por que serve:** Referências visuais premium de dark mode production-grade, live theme customizer, 125+ rotas[^9]
- **Nota KRATOS:** 9/10 inspiração visual, N/A para uso direto (comercial)

### 4.2 Command Palettes (Aurora/Jarvis)

#### 8. pacocoursey/cmdk
- **Link:** github.com/pacocoursey/cmdk[^25][^5]
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** A base do Cmd+K do shadcn/ui. O melhor command menu do ecossistema React. Fast, unstyled, acessível.[^5][^25][^6]
- **Arquitetura:** Mantém todos items/groups renderizados na árvore React. Cada item adiciona/remove do DOM baseado em search input. DOM é autoritativo.[^25]
- **Uso no KRATOS:** Command palette da Aurora, "salva checkpoint", "próxima ação", "resuma meu dia"
- **Instalação:** Vem com shadcn/ui Command component[^6]
- **Nota KRATOS:** 10/10 utilidade, 0/10 risco

#### 9. timc1/kbar
- **Link:** github.com/timc1/kbar[^5]
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** Command bar extensível com ações programáticas. Alternativa ao cmdk.[^26][^5]
- **Features:** Supports instant keyboard, GitHub/VSCode-style[^26]
- **Nota KRATOS:** 9/10 utilidade, 0/10 risco

#### 10. stefanjudis/awesome-command-palette (Curated List)
- **Link:** github.com/stefanjudis/awesome-command-palette[^5]
- **Por que serve:** Lista curada de implementações command palette[^5]
- **Nota KRATOS:** 7/10 referência

### 4.3 Live Updates / SSE / Estado

#### 11. TanStack Query (react-query)
- **Link:** github.com/TanStack/query[^27]
- **Stack:** React/TS
- **Licença:** MIT
- **Por que serve:** Cache de dados + invalidação controlada. Usar para fallback polling quando SSE cair. Evita re-renders desnecessários.[^28][^27]
- **Foco:** Server state management[^29][^28]
- **Benefícios:** request caching, error handling, automatic cache management, optimistic updates[^27]
- **Uso no KRATOS:** Fallback polling de `/live/snapshot` quando EventSource falha. TanStack Query gerencia cache e retry.[^29]
- **Nota KRATOS:** 9/10 utilidade para fallback, 1/10 risco

#### 12. pmndrs/zustand
- **Link:** github.com/pmndrs/zustand[^30]
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** Store global leve para estado do SSE. Muito mais performático que Context API para live data.[^28][^30]
- **Foco:** Client state management[^28][^29]
- **Features:** Small, fast, bearbones state management. API baseada em hooks, sem boilerplate.[^30]
- **Por que zustand over redux:** Simples, hooks como meio primário de consumir state, não envolve app em context providers, pode informar components transientemente sem causar render.[^30]
- **Por que zustand over context:** Menos boilerplate, renderiza components apenas em changes, gerenciamento centralizado de estado baseado em actions.[^30]
- **Uso no KRATOS:** Store para estado SSE connection (`live | reconnecting | polling | fallback | offline`), Mission Lens data cache, live indicators[^29].
- **Exemplo básico:**[^30]
```tsx
import { create } from 'zustand'

const useKratosStore = create((set) => ({
  connectionStatus: 'connecting',
  missionLens: null,
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setMissionLens: (lens) => set({ missionLens: lens }),
}))

// No component
const status = useKratosStore(state => state.connectionStatus)
```
- **Nota KRATOS:** 10/10 utilidade, 0/10 risco

#### 13. Server-Sent Events Patterns (Artigos e Guias)
- **Auth0 Guide:** "Developing Real-Time Web Applications with Server-Sent Events"[^31]
- **OneUptime Guide:** "How to Implement Server-Sent Events (SSE) in React"[^32]
- **Tiger Abradi Guide:** "Server-Sent Events: A Practical Guide for the Real World"[^33]
- **LinkedIn Guide:** "Build Real-Time Dashboards with Server-Sent Events (SSE)"[^34]

**Padrão EventSource React confirmado:**[^31][^32]
```tsx
const eventSource = new EventSource('http://localhost:5100/live/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // update state
};

eventSource.onerror = (err) => {
  console.error('SSE error', err);
  // fallback to polling
};

// cleanup
return () => eventSource.close();
```

**Headers SSE no backend (já no KRATOS):**[^34]
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Performance tips para SSE:**[^33]
- Live notifications e alerts
- Real-time dashboard updates
- Streaming AI-generated content
- Activity feeds
- Status updates para operações long-running

**Nota KRATOS:** Padrão já implementado no `useLiveKratos.ts`, validar com guias[^32][^31]

### 4.4 Animações (Com Moderação)

#### 14. framer/motion
- **Link:** github.com/framer/motion[^13]
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** Microinterações premium. Usar apenas em: aparição de alertas, transição de telas, live indicator pulse.[^14][^13]
- **Performance:** Heavily optimized para hardware acceleration[^14]
- **Priorizar:** opacity e transform — são GPU-accelerated[^14]
- **Evitar:** width/height/top/left/margin — causam reflow/repaint[^14]
- **Riscos:** Fácil exagerar. Regra: máx 200ms de duração, apenas opacity e transform.[^14]
- **Nota KRATOS:** 8/10 utilidade, 3/10 risco de overuse

#### 15. emilkowalski/sonner
- **Link:** github.com/emilkowalski/sonner
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** O melhor toast/notificação do ecossistema. Limpo, não-intrusivo. Para alertas do KRATOS.[^16]
- **Nota KRATOS:** 10/10 utilidade, 0/10 risco

### 4.5 Ícones

#### 16. lucide-icons/lucide
- **Link:** github.com/lucide-icons/lucide
- **Stack:** React/SVG
- **Licença:** ISC
- **Por que serve:** Consistente, leve, 1000+ ícones, perfeito com shadcn/ui.[^16]
- **Já usado no KRATOS 0.9**[^1]
- **Nota KRATOS:** 10/10 utilidade, 0/10 risco

### 4.6 Observability Visual (Gráficos e HUD)

#### 17. recharts/recharts
- **Link:** github.com/recharts/recharts
- **Stack:** React + D3
- **Licença:** MIT
- **Por que serve:** Gráficos leves para CPU/mem no painel Sistema. Usar com moderação.[^16]
- **Nota KRATOS:** 7/10 utilidade, 1/10 risco

#### 18. tremorlabs/tremor
- **Link:** github.com/tremorlabs/tremor[^35][^36]
- **Stack:** React + Tailwind + Radix UI[^36]
- **Licença:** Apache 2.0
- **Por que serve:** Componentes de observability prontos (sparklines, badges de status, progress bars). Visual premium sem esforço.[^35][^16]
- **Features:** 35+ fully open-source, accessible components for dashboards and charts[^36]
- **Descrição:** Low-level, opinionated UI component library to build dashboards. Oferece componentes como charts, layouts, input elements, cobrindo partes essenciais de dashboard ou analytical interface.[^35]
- **Nota KRATOS:** 9/10 utilidade, 1/10 risco

### 4.7 3D / Mundo / Ilhas

#### 19. pmndrs/react-three-fiber
- **Link:** github.com/pmndrs/react-three-fiber[^37][^38]
- **Stack:** React + Three.js
- **Licença:** MIT
- **Por que serve:** React renderer para Three.js. Build scene declaratively com componentes React reutilizáveis que reagem a state.[^39][^37]
- **Instalação:**
```bash
npm install three @react-three/fiber
```
- **Exemplo básico de cena:**[^38]
```tsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}
```
- **Uso no KRATOS:** Mundo de ilhas 3D (Fase 8 opcional, apenas se necessário). Prioridade é 2D/pseudo-3D com CSS/SVG primeiro.
- **Nota KRATOS:** 8/10 potencial futuro, 4/10 risco de complexidade prematura

#### 20. pmndrs/drei
- **Link:** github.com/pmndrs/drei[^40][^41]
- **Stack:** React Three Fiber
- **Licença:** MIT
- **Por que serve:** Growing collection de helpers úteis e abstrações prontas para @react-three/fiber.[^40]
- **Helpers:** Environment, useHelper, OrbitControls, Sky, Stars, etc.[^41][^42]
- **Environment helper:**[^42]
```tsx
import { Environment } from '@react-three/drei'

<Environment preset="forest" background backgroundBlurriness={0.5} />
```
- **Uso no KRATOS:** Se fase 3D for necessária, usar Environment para céu/atmosfera, OrbitControls para navegação
- **Nota KRATOS:** 8/10 utilidade 3D, 4/10 risco prematuridade

#### 21. greenMakaroni/three-floating-island
- **Link:** github.com/greenMakaroni/three-floating-island[^43]
- **Stack:** Three.js + Vite + Blender
- **Por que serve:** Projeto small de floating island low poly com Three.js + Vite. Modelos 3D low poly feitos em Blender, animações simples.[^43]
- **Referência visual:** Inspiração para estética das ilhas do KRATOS
- **Nota KRATOS:** 7/10 inspiração visual, 5/10 risco de complexidade

#### 22. Fantasy-Themed Floating Island Portfolio (Discourse)
- **Link:** discourse.threejs.org (Fantasy-Themed Floating Island Portfolio)[^44]
- **Stack:** React Three Fiber + Hunyuan3D-2
- **Por que serve:** "Wanted portfolio to feel like immersive experience rather than just another modern flat design — so I built a 3D floating island scene"[^44]
- **Nota KRATOS:** 8/10 inspiração visual de como fazer portfolio/cockpit imersivo

### 4.8 Layout Especializado

#### 23. bvaughn/react-resizable-panels
- **Link:** github.com/bvaughn/react-resizable-panels
- **Stack:** React
- **Licença:** MIT
- **Por que serve:** Painéis redimensionáveis. Útil se Aurora sidebar ou painel direito precisarem resize.[^16]
- **Nota KRATOS:** 6/10 utilidade (nice-to-have), 1/10 risco

### 4.9 Game UI / HUD Inspiration (Dribbble/Reddit)

#### 24. Dribbble Game Menu Search
- **Link:** dribbble.com/search/game-menu[^45]
- **Por que serve:** Milhares de high-quality game menu images[^45]
- **Nota KRATOS:** 9/10 inspiração visual

#### 25. Reddit r/gamedev UI/UX Thread
- **Link:** reddit.com/r/gamedev "Show me your game's menu/HUD/UI/UX design"[^46]
- **Por que serve:** Thread com devs mostrando HUD/menu designs de jogos[^46]
- **Nota KRATOS:** 8/10 inspiração de padrões HUD

### 4.10 Benchmarks UX Modernos (Artigos)

#### 26. Muz.li: "What's Changing in Mobile App Design? UI Patterns That Matter in 2026"
- **Link:** muz.li/blog (Mobile App Design 2026)[^47]
- **Conteúdo:** Apps como Arc Browser, Linear, Warp (terminal), Raycast lançaram dark-first. Light modes existem mas sentem secundários.[^47]
- **Nota KRATOS:** 9/10 validação da direção dark-first

#### 27. Din Studio: "UI/UX for ADHD: Designing Interfaces That Actually Help Students"
- **Link:** din-studio.com (ADHD UI/UX)[^10]
- **Conteúdo:** Princípios práticos de ADHD-first design: simplificar interfaces, reduzir carga cognitiva, fornecer hierarquia clara[^10]
- **Nota KRATOS:** 10/10 validação científica dos princípios TDAH

#### 28. AccessibilityChecker.org: "The Principles of Neurodivergent UX Design"
- **Link:** accessibilitychecker.org (Neurodivergent UX)[^12]
- **Conteúdo:** Minimizar distrações (auto-play videos, animações agressivas, pop-ups são os maiores ofensores ADHD), clear task flows, progressive disclosure, forgiving UI[^12]
- **Nota KRATOS:** 10/10 validação científica

#### 29. Adchitects: "Website Design for Neurodiversity: Rules & Best Practices"
- **Link:** adchitects.co (Neurodiversity Design)[^11]
- **Conteúdo:** Breaking down information em chunks menores com headings claros e bullet points ajuda processamento de informação. Hierarquia visual clara é vital.[^11]
- **Nota KRATOS:** 9/10 validação científica

### 4.11 CSS Glassmorphism Guides

#### 30. Dev.to: "Build a Stunning Glassmorphism Dashboard with HTML CSS"
- **Link:** dev.to (Glassmorphism Dashboard)[^7]
- **Conteúdo:** backdrop-filter: blur(12px) cria frosted glass, rgba permite transparência, box-shadow adiciona profundidade e realismo[^7]
- **Nota KRATOS:** 9/10 guia técnico

#### 31. OpenReplay Blog: "How to Create Glassmorphic UI Effects with Pure CSS"
- **Link:** blog.openreplay.com (Glassmorphic CSS)[^8]
- **Conteúdo:** Guia completo de glassmorphism: 4 core properties, fallbacks para browsers antigos, performance optimization, accessibility[^8]
- **Nota KRATOS:** 10/10 guia técnico definitivo

### 4.12 React Three Fiber Tutorials

#### 32. React Three Fiber Docs: "Your First Scene"
- **Link:** r3f.docs.pmnd.rs/getting-started/your-first-scene[^38]
- **Conteúdo:** Tutorial oficial R3F setup[^38]
- **Nota KRATOS:** 9/10 se fase 3D for necessária

#### 33. sbcode.net: "Environment - React Three Fiber Tutorials"
- **Link:** sbcode.net/react-three-fiber/environment/[^42]
- **Conteúdo:** Como usar Environment helper do Drei para skyboxes e lighting[^42]
- **Nota KRATOS:** 8/10 se fase 3D for necessária

#### 34. Wawa Sensei: "O que é React Three Fiber?"
- **Link:** wawasensei.dev (R3F)[^39]
- **Conteúdo:** React Three Fiber é renderizador React para Three.js que permite usar Three.js de forma declarativa, similar a React para construir UIs[^39]
- **Nota KRATOS:** 8/10 conceitual

#### 35. YouTube Playlist: "Three.js / React Three Fiber Tutorials"
- **Link:** youtube.com/playlist (R3F Tutorials)[^48]
- **Conteúdo:** Playlist com tutoriais incluindo "Making React Three Fiber Scene Looks Better", "React Spring Animations", "Scene Transitions"[^48]
- **Nota KRATOS:** 8/10 se fase 3D for necessária

### 4.13 Outros Repos Úteis

#### 36. AdminLTE
- **Estrelas:** 45,369[^9]
- **Stack:** Bootstrap 5.3.8
- **Licença:** Free (MIT)
- **Por que serve:** Maior dashboard open-source. Built-in toggle dark mode + OS detection[^9]
- **Nota KRATOS:** 7/10 referência (não React)

#### 37. Horizon UI
- **Estrelas:** 2,800[^49]
- **Stack:** React + Chakra UI
- **Licença:** Free / MIT
- **Por que serve:** Distinctive look para crypto, web3, fintech projects[^49]
- **Nota KRATOS:** 6/10 inspiração visual

#### 38. Mosaic Lite
- **Estrelas:** 2,779[^9]
- **Stack:** React + Tailwind
- **Licença:** Free
- **Por que serve:** Analytics-focused dashboard com melhor dark mode no free tier[^9]
- **Nota KRATOS:** 7/10 inspiração visual

#### 39. React Admin with Shadcn UI
- **Link:** marmelab.com/blog/react-admin-with-shadcn[^21]
- **Stack:** React Admin + Shadcn UI
- **Por que serve:** Design-agnostic framework react-admin agora com suporte premium para Shadcn UI[^21]
- **Nota KRATOS:** 6/10 referência (diferente use case)

#### 40. Nexus Dashboard
- **Link:** dev.to/praveen-sripati (Nexus)[^50]
- **Stack:** Vite + React + shadcn/ui
- **Por que serve:** Modern, single-page intranet dashboard. Clean, intuitive interface[^50]
- **Nota KRATOS:** 7/10 inspiração visual

***

## 5. DESIGN SYSTEM KRATOS 1.0

### 5.1 Filosofia Visual

**Direção confirmada nos arquivos do espaço:**[^3][^4]
- 80% Apple/Linear/Raycast clean
- 15% Jarvis/Mission Control operacional  
- 5% emoção visual controlada (ilhas, HUD, glassmorphism sutil)
- **Evitar:** cyberpunk escuro poluído, dashboard SaaS genérico, carnaval sci-fi, RPG infantil

**Frases-guia:**[^3]
- "Você está aqui."
- "Você não está perdido."
- "Um passo de cada vez."
- "KRATOS devolve o fio da missão."
- "O quadro ainda está na minha frente."

**Mundo vivo, não SaaS morto:**[^3]
- Ilhas flutuantes com oceano azul, céu vivo, nuvens, luz cinematográfica
- Castelo central (Palco Central) como hub de missão
- Pontes conectando módulos/ilhas
- Sensação de jogo 3D, mas prioritariamente 2D/pseudo-3D na fase 1

### 5.2 Paleta de Cores

**Base dark (herdar do 0.9, refinar):**[^1]
```css
/* Backgrounds */
--bg-primary: #0a0a0f;      /* near black */
--bg-secondary: #12121a;    /* card backdrop */
--bg-card: #1a1a24;         /* cards */
--bg-glass: rgba(26, 26, 36, 0.15); /* glassmorphism overlay */

/* Borders */
--border: #2a2a3a;
--border-glass: rgba(255, 255, 255, 0.2);

/* Text */
--text-primary: #e8e8ed;    /* main text */
--text-secondary: #8888a0;  /* secondary */
--text-muted: #585870;      /* tertiary */

/* Accents */
--blue: #4a90d9;            /* default accent */
--blue-bright: #60a5ff;     /* Aurora, links, sky */
--green: #34c759;           /* success, healthy */
--yellow: #f0c040;          /* warning, attention */
--red: #e04050;             /* critical, risk */
--purple: #8b5cf6;          /* highlight, special */
--orange: #ff9500;          /* energy, fire */
--cyan: #5ac8fa;            /* water, calm */
```

**Cores por ilha (inspiração visual dos arquivos):**[^3]
- **Palco Central:** roxo/dourado (#8b5cf6 + gold)
- **Omnis Lab:** azul tecnológico (#4a90d9)
- **Akasha/Gringotts:** dourado/âmbar (#f0c040)
- **Arena Comercial:** vermelho/dourado (#e04050 + gold)
- **Agência/Estúdio:** rosa/magenta (#ff6b9d)
- **Vila Viva:** verde/terra (#34c759)
- **Observatório:** azul profundo (#5ac8fa)
- **Nimbus Academy:** roxo/azul (#8b5cf6)
- **Tesouro/Finanças:** dourado (#f0c040)
- **Forja/Corpo:** laranja/vermelho (#ff9500)

### 5.3 Tipografia

**Body:**
- Font: Inter ou SF Pro (system default fallback)
- Size base: 14px / 0.875rem
- Line height: 1.5 (ADHD compliance)[^11][^12]
- Weight normal: 400
- Weight medium: 500
- Weight semibold: 600

**Headings:**
- H1: 32px / 2rem, weight 700
- H2: 24px / 1.5rem, weight 600
- H3: 18px / 1.125rem, weight 600
- H4: 16px / 1rem, weight 600

**Code/Mono:**
- Font: JetBrains Mono ou Fira Code
- Size: 13px / 0.8125rem

**Regras ADHD:**[^11][^10]
- Sans-serif alta legibilidade
- Linha altura mínima 1.5
- Evitar itálico (distorce shape)[^12]
- Bold para ênfase, nunca ALL CAPS[^12]
- Left-align body text sempre[^12]

### 5.4 Spacing (Sistema de 4px)

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### 5.5 Border Radius

```css
--radius-sm: 8px;   /* small cards, badges */
--radius-md: 12px;  /* default cards */
--radius-lg: 16px;  /* large panels, glassmorphism */
--radius-xl: 24px;  /* modals, dialogs */
--radius-full: 9999px; /* avatars, indicators */
```

### 5.6 Shadows

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.18);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1); /* glassmorphism */
```

### 5.7 Componentes Base

#### GlassCard
```tsx
// components/kratos/ui/GlassCard.tsx
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => (
  <div 
    className={cn(
      'bg-white/10 dark:bg-white/5',
      'backdrop-blur-[10px]',
      'border border-white/20',
      'rounded-[16px]',
      'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
      'p-6',
      className
    )}
  >
    {children}
  </div>
);
```

#### HudCard
```tsx
// components/kratos/ui/HudCard.tsx
import { cn } from '@/lib/utils';

interface HudCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const HudCard: React.FC<HudCardProps> = ({ title, children, className }) => (
  <div 
    className={cn(
      'bg-[#1a1a24]',
      'border border-[#2a2a3a]',
      'rounded-xl',
      'p-4',
      className
    )}
  >
    <h3 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">
      {title}
    </h3>
    {children}
  </div>
);
```

#### StatusBadge
```tsx
// components/kratos/ui/StatusBadge.tsx
import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  default: 'bg-white/10 text-white/70 border-white/20',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, children, className }) => (
  <span 
    className={cn(
      'inline-flex items-center px-2.5 py-0.5',
      'text-xs font-medium',
      'rounded-full border',
      variantStyles[variant],
      className
    )}
  >
    {children}
  </span>
);
```

#### ProgressRing
```tsx
// components/kratos/ui/ProgressRing.tsx
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = '#4a90d9'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        ircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        ircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
```

#### LiveIndicator
```tsx
// components/kratos/ui/LiveIndicator.tsx
import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  status: 'live' | 'reconnecting' | 'polling' | 'offline';
}

const statusColors = {
  live: '#34c759',
  reconnecting: '#f0c040',
  polling: '#ff9500',
  offline: '#e04050',
};

const statusLabels = {
  live: 'Live',
  reconnecting: 'Reconectando',
  polling: 'Polling',
  offline: 'Offline',
};

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ status }) => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{
        scale: status === 'live' ? [1, 1.2, 1] : 1,
        opacity: status === 'live' ? [1, 0.8, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: status === 'live' ? Infinity : 0,
        ease: 'easeInOut',
      }}
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: statusColors[status] }}
    />
    <span className="text-xs font-medium" style={{ color: statusColors[status] }}>
      {statusLabels[status]}
    </span>
  </div>
);
```

### 5.8 Estados Visuais

**Loading:**
- Skeleton screens (evitar layout shift)
- Pulse animation sutil
- Texto: "Carregando contexto..."

**Stale (dados desatualizados):**
- Overlay amarelo translúcido sobre card
- Badge "Desatualizado" com ícone de relógio
- Texto: "Dados de X segundos atrás"

**Degraded (collector falhou, usando cache):**
- Badge laranja "Degradado"
- Indicador que está usando cache
- Não bloquear uso, apenas avisar

**Offline (SSE caiu, polling também falhou):**
- Banner vermelho no topo "Offline — Tentando reconectar..."
- Retry button manual
- Mostrar último timestamp de dados válidos

**Empty (sem dados):**
- Ilustração minimalista
- Microcopy útil: "Nenhuma tarefa para hoje. Bom trabalho!" ou "Crie seu primeiro projeto."
- CTA claro quando aplicável

### 5.9 Motion (Framer Motion)

**Regras estritas:**[^13][^14]
- Max duration: 200ms para micro, 400ms para transições grandes
- Priorizar: opacity, x, y, scale, rotate (GPU-accelerated)[^14]
- Evitar: width, height, margin (causam reflow)[^14]
- `prefers-reduced-motion` obrigatório

**Card hover:**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>
```

**Alert entry:**
```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {alert}
</motion.div>
```

**Live pulse:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
  className="w-2 h-2 rounded-full bg-green-500"
/>
```

### 5.10 Acessibilidade e Neuro UX

**Checklist obrigatório:**[^11][^12][^10]
- [ ] Navegação por teclado funcional
- [ ] Focus visível em todos elementos interativos
- [ ] Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande[^8]
- [ ] `prefers-reduced-motion` respeitado
- [ ] Sem auto-play videos[^12]
- [ ] Sem pop-ups agressivos[^12]
- [ ] Motion max 200ms, moderado[^14]
- [ ] Próxima ação única destacada[^10]
- [ ] Hierarquia visual clara[^11]
- [ ] Line height min 1.5[^12]
- [ ] Chunks de informação pequenos com headings[^11]
- [ ] Modo foco toggle disponível[^10]
- [ ] Erros impossíveis de perder[^12]
- [ ] Undo/checkpoint fácil[^12]

***

## 6. ARQUITETURA DE COMPONENTES KRATOS 1.0

### 6.1 Estrutura de Pastas Sugerida

```
frontend/
├── src/
│   ├── components/
│   │   └── kratos/
│   │       ├── shell/
│   │       │   ├── KratosShell.tsx
│   │       │   ├── KratosTopBar.tsx
│   │       │   ├── KratosSidebar.tsx
│   │       │   ├── KratosRightRail.tsx
│   │       │   └── KratosBottomBar.tsx
│   │       ├── world/
│   │       │   ├── KratosWorldMap.tsx
│   │       │   ├── WorldIslandCard.tsx
│   │       │   ├── CentralCastleMission.tsx
│   │       │   ├── WorldBackground.tsx
│   │       │   └── IslandPortal.tsx
│   │       ├── hud/
│   │       │   ├── FocusOfDayPanel.tsx
│   │       │   ├── ProgressRingPanel.tsx
│   │       │   ├── QuotePanel.tsx
│   │       │   ├── TodayAgendaPanel.tsx
│   │       │   ├── MusicPlayerPanel.tsx
│   │       │   └── SquadDock.tsx
│   │       ├── aurora/
│   │       │   ├── AuroraPanel.tsx
│   │       │   ├── AuroraOrb.tsx
│   │       │   ├── AuroraCommandPalette.tsx
│   │       │   └── AuroraMessage.tsx
│   │       ├── mission/
│   │       │   ├── MissionCurrentCard.tsx
│   │       │   ├── NextActionCard.tsx
│   │       │   ├── DoNotDoBox.tsx
│   │       │   ├── RisksPanel.tsx
│   │       │   ├── CheckpointSuggestionCard.tsx
│   │       │   └── SystemPulseBar.tsx
│   │       ├── context/
│   │       │   ├── CurrentContextCard.tsx
│   │       │   ├── ContextSwitchPanel.tsx
│   │       │   ├── BrowserContextList.tsx
│   │       │   └── CheckpointButton.tsx
│   │       └── ui/
│   │           ├── GlassCard.tsx
│   │           ├── HudCard.tsx
│   │           ├── StatusBadge.tsx
│   │           ├── ProgressRing.tsx
│   │           ├── LiveIndicator.tsx
│   │           └── SectionTitle.tsx
│   ├── hooks/
│   │   ├── useLiveKratos.ts (já existe)
│   │   ├── useCommandPalette.ts
│   │   ├── useWorldNavigation.ts
│   │   └── useMissionLensSelectors.ts
│   ├── stores/
│   │   ├── kratosStore.ts (Zustand)
│   │   └── auroraStore.ts
│   ├── lib/
│   │   ├── api.ts (69 métodos já existem)
│   │   ├── mission-lens-selectors.ts
│   │   ├── kratos-worlds.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── mission-lens.ts
│   │   ├── worlds.ts
│   │   └── api.ts
│   ├── pages/
│   │   ├── Agora.tsx (já existe)
│   │   ├── Contexto.tsx
│   │   ├── Checkpoints.tsx
│   │   ├── Agenda.tsx
│   │   ├── Deadlines.tsx
│   │   ├── Projetos.tsx
│   │   ├── Tarefas.tsx
│   │   ├── Sistema.tsx
│   │   ├── Finalizar.tsx
│   │   └── OmnisSnapshot.tsx
│   └── styles/
│       └── kratos.css (design tokens)
└── package.json
```

### 6.2 Component Tree

```
KratosShell
├── KratosTopBar
│   ├── UserAvatar
│   ├── GreetingText
│   ├── SystemPulseBar (Mission Lens: system_pulse)
│   └── LiveIndicator
├── KratosSidebar
│   ├── NavItem[] (Visão Geral, Missões, Projetos, etc.)
│   └── CollapseToggle
├── MainContent (slot)
│   └── [Agora | Contexto | Checkpoints | etc.]
├── KratosRightRail
│   ├── AuroraPanel
│   │   ├── AuroraOrb
│   │   ├── AuroraMessage (Mission Lens: mentor_summary)
│   │   └── AuroraCommandPalette
│   ├── FocusOfDayPanel (Mission Lens: current_mission)
│   ├── ProgressRingPanel
│   ├── QuotePanel
│   └── TodayAgendaPanel
└── KratosBottomBar
    ├── MusicPlayerPanel
    ├── MissionCurrentCard (Mission Lens: current_mission)
    ├── NextActionCard (Mission Lens: next_action)
    └── SquadDock
```

**Tela Agora (página principal):**
```
Agora.tsx
├── KratosWorldMap (mundo central com ilhas)
│   ├── WorldBackground (céu azul, oceano, nuvens)
│   ├── CentralCastleMission (castelo K, missão ativa)
│   └── WorldIslandCard[] (11 ilhas)
│       ├── Palco Central
│       ├── Omnis Lab
│       ├── Akasha/Gringotts
│       ├── Arena Comercial
│       ├── Agência/Estúdio
│       ├── Vila Viva
│       ├── Observatório
│       ├── Nimbus Academy
│       ├── Tesouro/Finanças
│       ├── Forja/Corpo
│       └── Finalizar
├── NextActionCard (Mission Lens: next_action, destaque central)
├── DoNotDoBox (Mission Lens: do_not_do)
├── RisksPanel (Mission Lens: risks)
├── CheckpointSuggestionCard (Mission Lens: checkpoint)
└── DeadlineCalendar (Mission Lens: deadlines)
```

### 6.3 Código TypeScript — Types

```typescript
// types/mission-lens.ts

export type CollectorStatus = 'ok' | 'degraded' | 'error';
export type FocusState = 'on_focus' | 'off_focus' | 'related' | 'unknown';
export type Severity = 'critical' | 'warning' | 'info';
export type Tone = 'neutral' | 'encouraging' | 'urgent' | 'warning';
export type LiveStatus = 'live' | 'reconnecting' | 'polling' | 'fallback' | 'offline';

export interface MissionLensEnvelope {
  contract_version: string;
  source: string;
  collector_status: CollectorStatus;
  generated_at: string;
  stale_after_ms: number;
  data: MissionLensData;
}

export interface MissionLensData {
  current_mission: CurrentMission;
  next_action: NextAction;
  do_not_do: DoNotDoItem[];
  risks: RiskItem[];
  deadlines: DeadlineItem[];
  checkpoint: CheckpointState;
  system_pulse: SystemPulse;
  mentor_summary: MentorSummary;
}

export interface CurrentMission {
  title: string;
  project: string | null;
  focus_state: FocusState;
  confidence: number;
  drift: number;
}

export interface NextAction {
  title: string;
  rationale: string;
  priority: number;
  source: string;
  cta_label: string;
}

export interface DoNotDoItem {
  title: string;
  reason: string;
  severity: Severity;
}

export interface RiskItem {
  title: string;
  severity: Severity;
  entity: string;
  reason: string;
  suggested_action: string;
}

export interface DeadlineItem {
  title: string;
  project_id: string | null;
  severity: Severity;
  due_at: string;
}

export interface CheckpointState {
  available: boolean;
  label: string;
  last_checkpoint_at: string | null;
  resume_hint: string | null;
}

export interface SystemPulse {
  status: string;
  live_status: LiveStatus;
  degraded_count: number;
  critical_count: number;
}

export interface MentorSummary {
  text: string;
  tone: Tone;
  urgency: number;
}
```

### 6.4 Código TypeScript — Selectors

```typescript
// lib/mission-lens-selectors.ts
import { MissionLensData, Severity } from '@/types/mission-lens';

export const selectCriticalRisks = (lens: MissionLensData | null) => 
  lens?.risks.filter(r => r.severity === 'critical') ?? [];

export const selectWarningRisks = (lens: MissionLensData | null) => 
  lens?.risks.filter(r => r.severity === 'warning') ?? [];

export const selectOverdueDeadlines = (lens: MissionLensData | null) => 
  lens?.deadlines.filter(d => d.severity === 'critical') ?? [];

export const selectIsOffFocus = (lens: MissionLensData | null) => 
  lens?.current_mission.focus_state === 'off_focus';

export const selectCanCheckpoint = (lens: MissionLensData | null) => 
  lens?.checkpoint.available ?? false;

export const selectSystemHealthy = (lens: MissionLensData | null) => 
  lens?.system_pulse.critical_count === 0 && lens?.system_pulse.degraded_count === 0;

export const selectMentorIsUrgent = (lens: MissionLensData | null) => 
  (lens?.mentor_summary.urgency ?? 0) >= 7;
```

### 6.5 Código TypeScript — Zustand Store

```typescript
// stores/kratosStore.ts
import { create } from 'zustand';
import { MissionLensData, LiveStatus } from '@/types/mission-lens';

interface KratosStore {
  connectionStatus: LiveStatus;
  missionLens: MissionLensData | null;
  lastUpdate: string | null;
  isStale: boolean;
  
  setConnectionStatus: (status: LiveStatus) => void;
  setMissionLens: (lens: MissionLensData, timestamp: string) => void;
  markStale: () => void;
  reset: () => void;
}

export const useKratosStore = create<KratosStore>((set) => ({
  connectionStatus: 'connecting',
  missionLens: null,
  lastUpdate: null,
  isStale: false,
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setMissionLens: (lens, timestamp) => set({ 
    missionLens: lens, 
    lastUpdate: timestamp,
    isStale: false 
  }),
  
  markStale: () => set({ isStale: true }),
  
  reset: () => set({ 
    missionLens: null, 
    lastUpdate: null, 
    isStale: false 
  }),
}));
```

### 6.6 Código TypeScript — Hook SSE Melhorado

```typescript
// hooks/useLiveKratos.ts (evolução do existente)
import { useEffect, useRef } from 'react';
import { useKratosStore } from '@/stores/kratosStore';
import { MissionLensEnvelope } from '@/types/mission-lens';

const SSE_URL = 'http://localhost:5100/live/stream';
const SNAPSHOT_URL = 'http://localhost:5100/live/snapshot';
const POLLING_INTERVAL = 10_000; // 10s
const SSE_RETRY_INTERVAL = 5_000; // 5s

export const useLiveKratos = () => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sseRetryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const staleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { setConnectionStatus, setMissionLens, markStale } = useKratosStore();

  const startStaleTimer = (stale_after_ms: number) => {
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    staleTimerRef.current = setTimeout(() => {
      markStale();
    }, stale_after_ms);
  };

  const handleSnapshot = async () => {
    try {
      const res = await fetch(SNAPSHOT_URL);
      if (!res.ok) throw new Error('Snapshot failed');
      const envelope: MissionLensEnvelope = await res.json();
      setMissionLens(envelope.data, envelope.generated_at);
      startStaleTimer(envelope.stale_after_ms);
    } catch (err) {
      console.error('Snapshot error:', err);
      setConnectionStatus('offline');
    }
  };

  const startPolling = () => {
    setConnectionStatus('polling');
    handleSnapshot(); // immediate
    pollingTimerRef.current = setInterval(handleSnapshot, POLLING_INTERVAL);
  };

  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  };

  const startSSE = () => {
    const es = new EventSource(SSE_URL);
    
    es.onopen = () => {
      setConnectionStatus('live');
      stopPolling();
    };
    
    es.onmessage = (event) => {
      try {
        const envelope: MissionLensEnvelope = JSON.parse(event.data);
        setMissionLens(envelope.data, envelope.generated_at);
        startStaleTimer(envelope.stale_after_ms);
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };
    
    es.onerror = (err) => {
      console.error('SSE error:', err);
      es.close();
      eventSourceRef.current = null;
      setConnectionStatus('reconnecting');
      startPolling();
      
      // Retry SSE after delay
      sseRetryTimerRef.current = setTimeout(() => {
        startSSE();
      }, SSE_RETRY_INTERVAL);
    };
    
    eventSourceRef.current = es;
  };

  useEffect(() => {
    startSSE();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      stopPolling();
      if (sseRetryTimerRef.current) clearTimeout(sseRetryTimerRef.current);
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    };
  }, []);
};
```

### 6.7 Código TypeScript — NextActionCard

```typescript
// components/kratos/mission/NextActionCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/kratos/ui/GlassCard';
import { useKratosStore } from '@/stores/kratosStore';
import { selectIsOffFocus } from '@/lib/mission-lens-selectors';

export const NextActionCard: React.FC = () => {
  const { missionLens, isStale } = useKratosStore();
  const nextAction = missionLens?.next_action;
  const isOffFocus = selectIsOffFocus(missionLens);

  if (!nextAction) {
    return (
      <GlassCard>
        <p className="text-white/60 text-center">
          Nenhuma ação identificada. Continue focado.
        </p>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={cn(
        'relative overflow-hidden',
        isOffFocus && 'border-yellow-500/50'
      )}>
        {isStale && (
          <div className="absolute top-2 right-2">
            <span className="text-xs text-yellow-400">Desatualizado</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
              Próxima Ação
            </p>
            <h2 className="text-2xl font-bold text-white">
              {nextAction.title}
            </h2>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed">
            {nextAction.rationale}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">
              Fonte: {nextAction.source}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white font-medium text-sm"
            >
              {nextAction.cta_label}
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
```

### 6.8 Código TypeScript — DoNotDoBox

```typescript
// components/kratos/mission/DoNotDoBox.tsx
import { AlertTriangle } from 'lucide-react';
import { HudCard } from '@/components/kratos/ui/HudCard';
import { StatusBadge } from '@/components/kratos/ui/StatusBadge';
import { useKratosStore } from '@/stores/kratosStore';

export const DoNotDoBox: React.FC = () => {
  const missionLens = useKratosStore(state => state.missionLens);
  const items = missionLens?.do_not_do ?? [];

  if (items.length === 0) return null;

  return (
    <HudCard title="⛔ Não Fazer Agora">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <AlertTriangle 
              size={18} 
              className={cn(
                item.severity === 'critical' && 'text-red-400',
                item.severity === 'warning' && 'text-yellow-400',
                item.severity === 'info' && 'text-blue-400',
              )} 
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <StatusBadge variant={item.severity === 'critical' ? 'error' : 'warning'}>
                  {item.severity}
                </StatusBadge>
              </div>
              <p className="text-xs text-white/60">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </HudCard>
  );
};
```

### 6.9 Código TypeScript — WorldIslandCard

```typescript
// components/kratos/world/WorldIslandCard.tsx
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorldIslandCardProps {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  route: string;
  position: { x: number; y: number }; // CSS % position
}

export const WorldIslandCard: React.FC<WorldIslandCardProps> = ({
  id,
  name,
  tagline,
  icon: Icon,
  color,
  route,
  position,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(route)}
      className="absolute cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="w-32 h-32 rounded-2xl bg-gradient-to-br shadow-xl border border-white/20 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-4 text-center"
        style={{
          backgroundImage: `linear-gradient(135deg, ${color}20, ${color}40)`,
        }}
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}40` }}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">{name}</p>
          <p className="text-[10px] text-white/70 mt-1 leading-tight">{tagline}</p>
        </div>
      </div>
    </motion.div>
  );
};
```

### 6.10 Código TypeScript — KratosWorldMap

```typescript
// components/kratos/world/KratosWorldMap.tsx
import { Home, Cpu, Database, TrendingUp, Video, Users, Eye, GraduationCap, DollarSign, Dumbbell, CheckCircle } from 'lucide-react';
import { WorldIslandCard } from './WorldIslandCard';
import { WorldBackground } from './WorldBackground';
import { CentralCastleMission } from './CentralCastleMission';

const ISLANDS = [
  { id: 'palco', name: 'Palco Central', tagline: 'Sua missão. Seu espetáculo.', icon: Home, color: '#8b5cf6', route: '/agora', position: { x: 50, y: 50 } },
  { id: 'omnis', name: 'Omnis Lab', tagline: 'IA. Agentes. Execução.', icon: Cpu, color: '#4a90d9', route: '/omnis', position: { x: 30, y: 40 } },
  { id: 'akasha', name: 'Akasha', tagline: 'Memória. Conhecimento.', icon: Database, color: '#f0c040', route: '/akasha', position: { x: 70, y: 40 } },
  { id: 'arena', name: 'Arena', tagline: 'Vendas. Conquistas.', icon: TrendingUp, color: '#e04050', route: '/arena', position: { x: 25, y: 60 } },
  { id: 'agencia', name: 'Agência', tagline: 'Conteúdo. Marca.', icon: Video, color: '#ff6b9d', route: '/agencia', position: { x: 75, y: 60 } },
  { id: 'vila', name: 'Vila Viva', tagline: 'Família. Vida real.', icon: Users, color: '#34c759', route: '/vila', position: { x: 20, y: 30 } },
  { id: 'observatorio', name: 'Observatório', tagline: 'Filosofia. Visão.', icon: Eye, color: '#5ac8fa', route: '/observatorio', position: { x: 80, y: 30 } },
  { id: 'nimbus', name: 'Nimbus', tagline: 'Evolução. Coragem.', icon: GraduationCap, color: '#8b5cf6', route: '/nimbus', position: { x: 50, y: 25 } },
  { id: 'tesouro', name: 'Tesouro', tagline: 'Caixa. Patrimônio.', icon: DollarSign, color: '#f0c040', route: '/tesouro', position: { x: 40, y: 70 } },
  { id: 'forja', name: 'Forja', tagline: 'Corpo. Energia.', icon: Dumbbell, color: '#ff9500', route: '/forja', position: { x: 60, y: 70 } },
  { id: 'finalizar', name: 'Finalizar', tagline: 'Concluir. Celebrar.', icon: CheckCircle, color: '#34c759', route: '/finalizar', position: { x: 50, y: 80 } },
];

export const KratosWorldMap: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl">
      <WorldBackground />
      
      <CentralCastleMission />
      
      {ISLANDS.map(island => (
        <WorldIslandCard key={island.id} {...island} />
      ))}
    </div>
  );
};
```

### 6.11 Código TypeScript — AuroraCommandPalette

```typescript
// components/kratos/aurora/AuroraCommandPalette.tsx
import { useEffect, useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Bookmark, Play, Calendar, CheckCircle } from 'lucide-react';

export const AuroraCommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Pergunte à Aurora..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        <CommandGroup heading="Ações Rápidas">
          <CommandItem onSelect={() => { /* salvar checkpoint */ }}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Salvar checkpoint</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* próxima ação */ }}>
            <Play className="mr-2 h-4 w-4" />
            <span>Qual a próxima ação?</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* resumir dia */ }}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Resumir meu dia</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* onde parei */ }}>
            <Search className="mr-2 h-4 w-4" />
            <span>Onde eu parei?</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* plano 25min */ }}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Plano dos próximos 25 minutos</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => { /* ir para Agora */ }}>
            <span>Ir para Agora</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* ir para Contexto */ }}>
            <span>Ir para Contexto</span>
          </CommandItem>
          <CommandItem onSelect={() => { /* ir para Checkpoints */ }}>
            <span>Ir para Checkpoints</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
```

***

## 7. ESTRATÉGIA SSE + PERFORMANCE

### 7.1 Padrão EventSource Confirmado

**Já implementado no KRATOS 0.9 via `useLiveKratos.ts`:**[^1]
1. Abrir EventSource para `/live/stream` (SSE preferencial)
2. Se falhar → `reconnecting` → fallback HTTP polling em `/live/snapshot` a cada 10s
3. Retry SSE a cada 5s
4. States: `live | reconnecting | polling | fallback | offline`
5. Cleanup: fechar EventSource + limpar timers no unmount

**Validação com guias externos:**[^31][^34][^32][^33]
- Auth0 Guide confirma padrão EventSource + onmessage + onerror + cleanup[^31]
- OneUptime Guide confirma headers SSE (Content-Type: text/event-stream, Cache-Control: no-cache)[^32]
- Tiger Abradi Guide confirma SSE é ótimo para live notifications, real-time dashboard updates, activity feeds[^33]
- LinkedIn Guide confirma Go/Node.js SSE para dashboards real-time[^34]

**Conclusão:** Padrão KRATOS 0.9 está correto. Manter `useLiveKratos.ts`, apenas refinar com Zustand store e stale timer.

### 7.2 Evitar Re-render Excessivo

**Problema:** Payload SSE vem a cada 5s. Se todo componente re-renderizar, UI trava.

**Solução:**[^30]
1. **Zustand com selectors:** Componentes assinam apenas slice de state que precisam[^30]
```tsx
// ❌ Ruim: re-render em qualquer change
const state = useKratosStore();

// ✅ Bom: re-render apenas quando next_action muda
const nextAction = useKratosStore(state => state.missionLens?.next_action);
```

2. **React.memo em cards:**
```tsx
export const NextActionCard = React.memo(() => {
  const nextAction = useKratosStore(state => state.missionLens?.next_action);
  // ...
});
```

3. **useMemo para cálculos pesados:**
```tsx
const criticalRisks = useMemo(
  () => missionLens?.risks.filter(r => r.severity === 'critical') ?? [],
  [missionLens?.risks]
);
```

4. **Selectors memoizados em lib:**
```tsx
// lib/mission-lens-selectors.ts
export const selectCriticalRisks = (lens: MissionLensData | null) => 
  lens?.risks.filter(r => r.severity === 'critical') ?? [];
```

### 7.3 TanStack Query para Fallback

**Quando usar TanStack Query:**[^27][^29][^28]
- Fallback polling de `/live/snapshot` quando SSE falha
- Cache automático, retry automático, error handling[^27]
- Server state management[^28]

**Exemplo:**
```tsx
import { useQuery } from '@tanstack/react-query';

const useLiveSnapshotFallback = (enabled: boolean) => {
  return useQuery({
    queryKey: ['live-snapshot'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5100/live/snapshot');
      if (!res.ok) throw new Error('Snapshot failed');
      return res.json();
    },
    enabled,
    refetchInterval: 10_000,
    staleTime: 5_000,
    retry: 3,
  });
};
```

**Quando NÃO usar TanStack Query:**
- SSE está funcionando (usar Zustand + EventSource diretamente)
- Dados já estão em Zustand store

### 7.4 Stale Data Handling

**Problema:** Mission Lens tem `stale_after_ms` (12000ms = 12s). Se não receber update, dados ficam stale.[^1]

**Solução:**
1. Iniciar timer quando receber dados: `setTimeout(() => markStale(), stale_after_ms)`
2. Mostrar indicador visual stale (badge amarelo "Desatualizado")
3. Não bloquear uso, apenas avisar
4. Se stale > 30s, considerar offline

**Já implementado no hook melhorado (seção 6.6).**

### 7.5 Skeleton Loading sem Layout Shift

**Problema:** Enquanto carrega, não mostrar tela vazia tremendo.

**Solução:**
1. Skeleton com mesma estrutura do componente final
2. `aspect-ratio` CSS para manter height
3. `min-height` em containers principais

**Exemplo:**
```tsx
const NextActionSkeleton = () => (
  <div className="bg-white/10 rounded-xl p-6 animate-pulse">
    <div className="h-4 bg-white/20 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-white/20 rounded w-2/3 mb-4"></div>
    <div className="h-16 bg-white/20 rounded w-full"></div>
  </div>
);

// No component
if

---

## References

1. [KRATOS_ULTRA_DEV_REPORT_COMPLETO.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/64087957/25286b41-af02-445d-86ae-96f002aa57d3/KRATOS_ULTRA_DEV_REPORT_COMPLETO.md?AWSAccessKeyId=ASIA2F3EMEYE3OOIEYC7&Signature=ELvWMpEWz4Rwh1GDQMV2RfMMx5I%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJIMEYCIQDLZzsdBMfkG0BklSyLXLlaHcqbXaZ2dIWiP4WRBT2g0QIhAM8kTX4tkza4n73jSalh3W73kQm%2B%2FMIBw8FoqbLOpBEhKvMECEYQARoMNjk5NzUzMzA5NzA1IgyqM%2B9o0TlqU3%2BwT2Aq0ASCY%2FG%2BH1wSxpAODGK%2F0HmQyMY23CQkq4kE1wBf5vCTgxg9WNUYFiPiesNWCsLflADqUMvxxSejeAyg3fCQx3XoK9Z3eG5lRuag0uVCYyYt1s8kFR%2FJRCg2PiYfidy9CzdSuUfnoEHuQ6Yz0ijBPxjiCNK%2FiKN6j7oMdHX0zMQ965tdpusmTUWVIQYW5jDZGMi9J1FK0R9VNVqxISJbIHeKI17U1OPk%2BsDC%2BxbXwiI7ryhRTHXV7nDfJ4YsCKIwtGzmzkur1vE7hX4eEVgLksE4lW1BHN4e723nXNq4Ke5wPbVbiTz3u6aYhaV9Uie8KjLm7XaMqw5ZdRdWpPWaRoWWK9H1OxFF%2FMipQ89LD3K6wM0Kvz9gqg2QXFPN7U0Ij77%2FAap7MhIGdLfR2GnQvaHqNbWbgXrEdPRKGiQH7K%2BVoeSONYJ2h0Y9dWEalipWiuih6K7hhIvAEg8QEsd%2BuwNPT8PXv3qPIz2xYYZZqeBSnQ%2B%2BU91YFV%2BGvUSquPAOOKgP7dNTg6jDArcMeCZr120L0eO8twZyLhi%2FVi4bwkX0VcQjNByMPNFw5oaXb5pe3UGmXt3GCghqMXtewL5lJbNm4FpMC9paKvJu0DmtR4Fiy6%2FS8cd6aozYzg9fKm%2Fpz6%2BO0v1lzU34oU%2FQkkgIRazhR9iSDhErnTYGBhTW73uRakr5cCSrm8Cg0bB7awifh80jnNXzzsiX0kMxlYJYXbMj51CMXSH%2FFL4v0Y7%2FUJDBcytUBFzsYCpUx4daD2TmaCoywv86w1eu5OupGdA7%2BAwhMIDmkdAGOpcBVQFe2q%2BQjK1qAET2VKhXbtH9fBqMAEgf5OrEtv%2Bc3sikhcpfwkapnT5Vjdnn9mR2e5QEGvHJOGTIbqHOQXpCXicYyJLvlRFCZWAJXP3XDB6P%2B%2BXwUm%2FtPBXu1atEMs1XNPBotw3oUrSNGz3NUv91HF7unqlM2z6eFHzW%2BjH3Aws%2BcC7ACgF6ePK8k96jn7zJmyRfGnKApQ%3D%3D&Expires=1778680019) - # KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo

**Versão:** 0.9 | **Data:** 2026-05-13 | **...

2. [Implementation of a Cloud-Integrated Web Platform](https://ijsrem.com/download/implementation-of-a-cloud-integrated-web-platform/) - Abstract This paper presents the design, development, and implementation of a Web Platform — a compr...

3. [KRATOS-POR-PERPLEXITY.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/64087957/d63cacd3-4ea5-4107-b3c9-3484532e3743/KRATOS-POR-PERPLEXITY.txt?AWSAccessKeyId=ASIA2F3EMEYE3OOIEYC7&Signature=iStaRdOmpqJYcNABUHeVyu%2F0pyc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJIMEYCIQDLZzsdBMfkG0BklSyLXLlaHcqbXaZ2dIWiP4WRBT2g0QIhAM8kTX4tkza4n73jSalh3W73kQm%2B%2FMIBw8FoqbLOpBEhKvMECEYQARoMNjk5NzUzMzA5NzA1IgyqM%2B9o0TlqU3%2BwT2Aq0ASCY%2FG%2BH1wSxpAODGK%2F0HmQyMY23CQkq4kE1wBf5vCTgxg9WNUYFiPiesNWCsLflADqUMvxxSejeAyg3fCQx3XoK9Z3eG5lRuag0uVCYyYt1s8kFR%2FJRCg2PiYfidy9CzdSuUfnoEHuQ6Yz0ijBPxjiCNK%2FiKN6j7oMdHX0zMQ965tdpusmTUWVIQYW5jDZGMi9J1FK0R9VNVqxISJbIHeKI17U1OPk%2BsDC%2BxbXwiI7ryhRTHXV7nDfJ4YsCKIwtGzmzkur1vE7hX4eEVgLksE4lW1BHN4e723nXNq4Ke5wPbVbiTz3u6aYhaV9Uie8KjLm7XaMqw5ZdRdWpPWaRoWWK9H1OxFF%2FMipQ89LD3K6wM0Kvz9gqg2QXFPN7U0Ij77%2FAap7MhIGdLfR2GnQvaHqNbWbgXrEdPRKGiQH7K%2BVoeSONYJ2h0Y9dWEalipWiuih6K7hhIvAEg8QEsd%2BuwNPT8PXv3qPIz2xYYZZqeBSnQ%2B%2BU91YFV%2BGvUSquPAOOKgP7dNTg6jDArcMeCZr120L0eO8twZyLhi%2FVi4bwkX0VcQjNByMPNFw5oaXb5pe3UGmXt3GCghqMXtewL5lJbNm4FpMC9paKvJu0DmtR4Fiy6%2FS8cd6aozYzg9fKm%2Fpz6%2BO0v1lzU34oU%2FQkkgIRazhR9iSDhErnTYGBhTW73uRakr5cCSrm8Cg0bB7awifh80jnNXzzsiX0kMxlYJYXbMj51CMXSH%2FFL4v0Y7%2FUJDBcytUBFzsYCpUx4daD2TmaCoywv86w1eu5OupGdA7%2BAwhMIDmkdAGOpcBVQFe2q%2BQjK1qAET2VKhXbtH9fBqMAEgf5OrEtv%2Bc3sikhcpfwkapnT5Vjdnn9mR2e5QEGvHJOGTIbqHOQXpCXicYyJLvlRFCZWAJXP3XDB6P%2B%2BXwUm%2FtPBXu1atEMs1XNPBotw3oUrSNGz3NUv91HF7unqlM2z6eFHzW%2BjH3Aws%2BcC7ACgF6ePK8k96jn7zJmyRfGnKApQ%3D%3D&Expires=1778680019) - Tigrao, recebi o comando. Porém atingi o limite de chamadas de ferramentas nesta rodada antes de con...

4. [pesquisa-profunda-para-orientar-o-redesign-visual-de-um-sistema-chamado-KRATOS-M.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/64087957/508e7cb8-f196-40ab-b003-a2bb7322d68a/pesquisa-profunda-para-orientar-o-redesign-visual-de-um-sistema-chamado-KRATOS-M.txt?AWSAccessKeyId=ASIA2F3EMEYE3OOIEYC7&Signature=zTkklK6fhwQvDo%2FyjXHcS5g9Lnw%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJIMEYCIQDLZzsdBMfkG0BklSyLXLlaHcqbXaZ2dIWiP4WRBT2g0QIhAM8kTX4tkza4n73jSalh3W73kQm%2B%2FMIBw8FoqbLOpBEhKvMECEYQARoMNjk5NzUzMzA5NzA1IgyqM%2B9o0TlqU3%2BwT2Aq0ASCY%2FG%2BH1wSxpAODGK%2F0HmQyMY23CQkq4kE1wBf5vCTgxg9WNUYFiPiesNWCsLflADqUMvxxSejeAyg3fCQx3XoK9Z3eG5lRuag0uVCYyYt1s8kFR%2FJRCg2PiYfidy9CzdSuUfnoEHuQ6Yz0ijBPxjiCNK%2FiKN6j7oMdHX0zMQ965tdpusmTUWVIQYW5jDZGMi9J1FK0R9VNVqxISJbIHeKI17U1OPk%2BsDC%2BxbXwiI7ryhRTHXV7nDfJ4YsCKIwtGzmzkur1vE7hX4eEVgLksE4lW1BHN4e723nXNq4Ke5wPbVbiTz3u6aYhaV9Uie8KjLm7XaMqw5ZdRdWpPWaRoWWK9H1OxFF%2FMipQ89LD3K6wM0Kvz9gqg2QXFPN7U0Ij77%2FAap7MhIGdLfR2GnQvaHqNbWbgXrEdPRKGiQH7K%2BVoeSONYJ2h0Y9dWEalipWiuih6K7hhIvAEg8QEsd%2BuwNPT8PXv3qPIz2xYYZZqeBSnQ%2B%2BU91YFV%2BGvUSquPAOOKgP7dNTg6jDArcMeCZr120L0eO8twZyLhi%2FVi4bwkX0VcQjNByMPNFw5oaXb5pe3UGmXt3GCghqMXtewL5lJbNm4FpMC9paKvJu0DmtR4Fiy6%2FS8cd6aozYzg9fKm%2Fpz6%2BO0v1lzU34oU%2FQkkgIRazhR9iSDhErnTYGBhTW73uRakr5cCSrm8Cg0bB7awifh80jnNXzzsiX0kMxlYJYXbMj51CMXSH%2FFL4v0Y7%2FUJDBcytUBFzsYCpUx4daD2TmaCoywv86w1eu5OupGdA7%2BAwhMIDmkdAGOpcBVQFe2q%2BQjK1qAET2VKhXbtH9fBqMAEgf5OrEtv%2Bc3sikhcpfwkapnT5Vjdnn9mR2e5QEGvHJOGTIbqHOQXpCXicYyJLvlRFCZWAJXP3XDB6P%2B%2BXwUm%2FtPBXu1atEMs1XNPBotw3oUrSNGz3NUv91HF7unqlM2z6eFHzW%2BjH3Aws%2BcC7ACgF6ePK8k96jn7zJmyRfGnKApQ%3D%3D&Expires=1778680019) - Por favor, complete o processo  para usar recursos Enterprise
Você é um pesquisador sênior de UI/UX,...

5. [A list of awesome command palette implementations.](https://github.com/stefanjudis/awesome-command-palette) - react-cmdk – A fast, accessible, and pretty command palette for React. command-pal - The hackable co...

6. [Command - Shadcn UI](https://ui.shadcn.com/docs/components/radix/command) - The <Command /> component uses the cmdk component by Dip. Installation ... Command Palette. Search f...

7. [🔮 Build a Stunning Glassmorphism Dashboard with HTML ...](https://dev.to/chaitanya_chopde_dd0642ed/build-a-stunning-glassmorphism-dashboard-with-html-css-no-js-needed-292j) - Inspired by Apple's macOS and Windows Fluent Design, glassmorphism is now being widely adopted in da...

8. [How to Create Glassmorphic UI Effects with Pure CSS](https://blog.openreplay.com/create-glassmorphic-ui-css/) - This guide walks you through creating pure CSS glassmorphism effects from scratch—no frameworks, no ...

9. [20 Best Dark Admin Dashboard Templates 2026](https://colorlib.com/wp/dark-admin-dashboard-templates/) - The premium picks below are all from DashboardPack — our in-house Next.js 16 dashboard suite. Each i...

10. [UI/UX for ADHD: Designing Interfaces That Actually Help ...](https://din-studio.com/ui-ux-for-adhd-designing-interfaces-that-actually-help-students/) - Discover how thoughtful UI/UX for ADHD supports focus, learning, and inclusion with clear, accessibl...

11. [Website Design for Neurodiversity: Rules & Best Practices](https://adchitects.co/blog/design-for-neurodiversity) - Consider using headings, subheadings, bullet points, and visual cues to create a visual hierarchy th...

12. [The Principles of Neurodivergent UX Design Every ...](https://www.accessibilitychecker.org/blog/neurodivergent-ux-design/) - Neurodivergent UX design is a set of principles that puts cognitive accessibility at the center of t...

13. [Framer Motion React: examples and best practices](https://agence-scroll.com/en/blog/framer-motion) - Framer Motion is a React library designed to create fluid, modern and efficient animations. In this ...

14. [A Guide to Framer Motion React Animation](https://magicui.design/blog/framer-motion-react) - Performance is also front and center. Framer Motion is heavily optimized to use hardware acceleratio...

15. [satnaing/shadcn-admin: Admin Dashboard UI built with ...](https://github.com/satnaing/shadcn-admin) - This project uses Shadcn UI components, but some have been slightly modified for better RTL (Right-t...

16. [Shadcn Admin — Free React Template](https://shadcn.io/template/satnaing-shadcn-admin) - Shadcn Admin is a free, open-source admin dashboard template built with shadcn/ui, Vite, React, and ...

17. [license - satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin/blob/main/LICENSE) - Admin Dashboard UI built with Shadcn and Vite. Contribute to satnaing/shadcn-admin development by cr...

18. [Pull requests · satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin/pulls) - Admin Dashboard UI built with Shadcn and Vite. Contribute to satnaing/shadcn-admin development by cr...

19. [Releases · satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin/releases) - Admin Dashboard UI built with Shadcn and Vite. Contribute to satnaing/shadcn-admin development by cr...

20. [n2duc/shadcn-dashboard: Simple ...](https://github.com/n2duc/shadcn-dashboard) - This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. ...

21. [React-admin With Shadcn UI](https://marmelab.com/blog/2025/04/23/react-admin-with-shadcn.html) - React-admin is a design-agnostic framework, and you can use it with any design system. Today, we're ...

22. [[discussion] radix-ui added tailwindcss for all primitive ...](https://github.com/shadcn-ui/ui/issues/140) - The Radix UI examples are docs for how to use Tailwind with the components. · This repo is an implem...

23. [react-vite-shadcn-dashboard-starter-kit/README.md at main](https://github.com/hariadiarief/react-vite-shadcn-dashboard-starter-kit/blob/main/README.md) - Admin dashboard starter kit developed with React, Vite, Shadcn etc. Features [x] Responsive Web Desi...

24. [rohitsoni007/shadcn-admin: Admin Dashboard UI with ...](https://github.com/rohitsoni007/shadcn-admin) - 🛠️ Developer Experience · TypeScript support · Form validation with Zod · React Hook Form integratio...

25. [cmdk/ARCHITECTURE.md at main - GitHub](https://github.com/pacocoursey/cmdk/blob/main/ARCHITECTURE.md) - Fast, unstyled command menu React component. Contribute to dip/cmdk development by creating an accou...

26. [A flexible React Command Palette : r/reactjs](https://www.reddit.com/r/reactjs/comments/1nxt7ry/a_flexible_react_command_palette/) - It's designed to bring a GitHub- or VSCode-style command palette to any React app with minimal setup...

27. [The Paradigm Shift in Web Application Data Management: An Analysis of React Query and Modern Data Handling Approaches](https://www.ijsrcseit.com/index.php/home/article/view/CSEIT25113380) - This article examines the evolutionary transformation of data management within web applications, fo...

28. [Zustand vs tanstack query : r/reactjs](https://www.reddit.com/r/reactjs/comments/1mugweq/zustand_vs_tanstack_query/) - Tanstack query is a state management tool same way zustand is a state management tool. The differenc...

29. [Separating Concerns with Zustand and TanStack Query](https://volodymyrrudyi.com/blog/separating-concerns-with-zustand-and-tanstack-query/) - Server data is rendered in UI using the TanStack Query hooks. These hooks provide request caching an...

30. [pmndrs/zustand: 🐻 Bear necessities for state management ...](https://github.com/pmndrs/zustand) - A small, fast and scalable bearbones state-management solution using simplified flux principles. Has...

31. [Developing Real-Time Web Applications with Server-Sent ...](https://auth0.com/blog/developing-real-time-web-applications-with-server-sent-events/) - In this article, we will learn how to use this standard by building a flight timetable demo applicat...

32. [How to Implement Server-Sent Events (SSE) in React](https://oneuptime.com/blog/post/2026-01-15-server-sent-events-sse-react/view) - A comprehensive guide to implementing Server-Sent Events in React applications for real-time data st...

33. [Server-Sent Events: A Practical Guide for the Real World](https://tigerabrodi.blog/server-sent-events-a-practical-guide-for-the-real-world) - SSE is great for streaming data from server to client, like: Live notifications and alerts. Real-tim...

34. [Build Real-Time Dashboards with Server-Sent Events ...](https://www.linkedin.com/pulse/build-real-time-dashboards-server-sent-events-sse-go-golang-jain-4vuff) - Server-Sent Events (SSE) is a simple way to push updates from the server to the client in real time....

35. [Tremor - Free React Library for Dashboards](https://dev.to/sm0ke/tremor-free-react-library-for-dashboards-3gm9) - Tremor is a low-level, opinionated UI component library to build dashboards. It offers components, s...

36. [Tremor – Copy-and-Paste Tailwind CSS UI Components for ...](https://tremor.so) - 35+ fully open-source, accessible components for dashboards and charts. Built with React, Tailwind C...

37. [pmndrs/react-three-fiber: 🇨🇭 A React renderer for Three.js](https://github.com/pmndrs/react-three-fiber) - react-three-fiber is a React renderer for threejs. Build your scene declaratively with re-usable, se...

38. [Your first scene - React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/your-first-scene) - This guide will help you setup your first React Three Fiber scene and introduce you to its core conc...

39. [O que é React Three Fiber?](https://wawasensei.dev/pt/courses/react-three-fiber/lessons/react-three-fiber) - O que é React Three Fiber? Antes de começarmos a codificar, vamos dar uma olhada em por que estamos ...

40. [pmndrs/drei: 🥉 useful helpers for react-three-fiber](https://github.com/pmndrs/drei) - A growing collection of useful helpers and fully functional, ready-made abstractions for @react-thre...

41. [Drei usehelper - react-three-fiber by example](https://onion2k.github.io/r3f-by-example/examples/hooks/drei-usehelper/) - A collection of examples of using react-three-fiber.

42. [Environment - React Three Fiber Tutorials](https://sbcode.net/react-three-fiber/environment/) - We can set the scene.environment property to a texture. But since we are using React Three Fiber and...

43. [greenMakaroni/three-floating-island](https://github.com/greenMakaroni/three-floating-island) - This is a small project I've been working on to learn three.js and vite. I've designed the low poly ...

44. [️Fantasy-Themed Floating Island Portfolio (Built with R3F ...](https://discourse.threejs.org/t/fantasy-themed-floating-island-portfolio-built-with-r3f-and-hunyuan3d-2/87480) - I wanted my portfolio to feel like an immersive experience rather than just another modern flat desi...

45. [game menu](https://dribbble.com/search/game-menu) - Explore thousands of high-quality game menu images on Dribbble. Your resource to get inspired, disco...

46. [Show me your game's menu/HUD/UI/UX design! : r/gamedev](https://www.reddit.com/r/gamedev/comments/1h31xcr/show_me_your_games_menuhuduiux_design/) - Having menus or hud from random games won't help you for your specific game. Look at games that have...

47. [What's Changing in Mobile App Design? UI Patterns That ...](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/) - Apps like Arc Browser, Linear, Warp (the terminal), and Raycast all launched dark-first. Their light...

48. [Three.js / React Three Fiber Tutorials](https://www.youtube.com/playlist?list=PLpepLKamtPjiUF6PvVUbIFhx9HaS0qJs_) - Making our React Three Fiber Scene Looks Better. Wawa Sensei · 7:53 · React Three Fiber Tutorial - R...

49. [28 Best React Admin Dashboard Templates 2026](https://adminlte.io/blog/react-admin-dashboard-templates/) - Compare 27 React admin dashboard templates side by side — free and premium picks with MUI, shadcn/ui...

50. [Introducing Nexus: A Polished Dashboard Built with Vite ...](https://dev.to/praveen-sripati/introducing-nexus-a-polished-dashboard-built-with-vite-react-and-shadcnui-494c) - A modern, single-page intranet dashboard designed to be a company's digital heartbeat. My goal was t...

