# OMNIS LAB — Island Page Spec & Code
## FRONT-KIMI-07

**Mockup de referência:** `00_VISUAL_REFERENCES/images/02_OMNIS_LAB.png`  
**Temática:** Tech, IA, automações — Roxo `#7C3AED` + Ciano `#06B6D4`  
**Template:** Tech

---

## Estrutura da Página

```
OmnisLabPage
├── TopHud (global, não alterar)
├── Sidebar (global, não alterar)
├── Main Content (área central)
│   ├── Header da ilha (título + tagline + ícone robô)
│   ├── HolographicCore (centro visual)
│   └── Labels sobrepostos (Agentes IA, Automações, Workflows, Dados, Execuções)
├── RightRail
│   ├── AuroraPanel
│   ├── ResumoDoLab (4 métricas: agentes, automações, workflows, execuções)
│   ├── AgentList (lista de agentes ativos)
│   ├── AutomationList (automações em andamento com %)
│   └── WorkflowStatusList (workflows com status)
└── BottomDock
    ├── AudioPlayer
    ├── EconomyCounter (tempo economizado)
    ├── SystemHealth (98%)
    └── IntegrationGrid (n8n, Make, Notion, Slack, Google Drive, Supabase, OpenAI)
```

---

## Componentes NOVOS (criar em `frontend/src/components/islands/omnis/`)

### HolographicCore

```tsx
// HolographicCore.tsx
// Núcleo holográfico central do OMNIS Lab
// Anéis SVG rotativos + Cubo CSS 3D + Glow violeta/ciano

// COM FRAMER MOTION:
import { motion } from "framer-motion";

export function HolographicCore() {
  return (
    <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-2 border-violet-500/30 bg-slate-900/60 shadow-[0_0_60px_rgba(139,92,246,0.4)]">
      {/* Anel externo — rotação horária */}
      <svg
        className="absolute inset-0 h-full w-full animate-[spin-slow_10s_linear_infinite]"
        viewBox="0 0 224 224"
      >
        <circle
          cx="112" cy="112" r="100"
          fill="none"
          stroke="rgba(139,92,246,0.3)"
          strokeWidth="1"
          strokeDasharray="12 8"
        />
        <circle
          cx="112" cy="112" r="100"
          fill="none"
          stroke="rgba(6,182,212,0.5)"
          strokeWidth="1.5"
          strokeDasharray="30 180"
          strokeLinecap="round"
        />
      </svg>

      {/* Anel interno — rotação anti-horária */}
      <svg
        className="absolute inset-4 animate-[spin-slow_7s_linear_infinite] [animation-direction:reverse]"
        viewBox="0 0 192 192"
      >
        <circle
          cx="96" cy="96" r="80"
          fill="none"
          stroke="rgba(139,92,246,0.2)"
          strokeWidth="1"
          strokeDasharray="8 16"
        />
        <circle
          cx="96" cy="96" r="80"
          fill="none"
          stroke="rgba(6,182,212,0.4)"
          strokeWidth="1.5"
          strokeDasharray="20 150"
          strokeLinecap="round"
        />
      </svg>

      {/* Cubo CSS 3D central */}
      <motion.div
        animate={{ rotateY: [0, 360], rotateX: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d", width: 48, height: 48 }}
      >
        {/* 6 faces do cubo */}
        {[
          { transform: "translateZ(24px)", bg: "rgba(139,92,246,0.4)" },
          { transform: "translateZ(-24px) rotateY(180deg)", bg: "rgba(6,182,212,0.4)" },
          { transform: "rotateY(90deg) translateZ(24px)", bg: "rgba(139,92,246,0.3)" },
          { transform: "rotateY(-90deg) translateZ(24px)", bg: "rgba(6,182,212,0.3)" },
          { transform: "rotateX(90deg) translateZ(24px)", bg: "rgba(139,92,246,0.2)" },
          { transform: "rotateX(-90deg) translateZ(24px)", bg: "rgba(6,182,212,0.2)" },
        ].map((face, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-violet-400/20"
            style={{
              transform: face.transform,
              backgroundColor: face.bg,
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </motion.div>

      {/* Glow central ciano */}
      <div className="absolute h-16 w-16 rounded-full bg-cyan-400/20 blur-xl animate-[pulse-glow_2s_ease-in-out_infinite]" />

      {/* Label central */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">OMNIS CORE</p>
      </div>
    </div>
  );
}

// SEM FRAMER MOTION (CSS fallback):
// Substituir <motion.div> por <div> com style animation
// style={{ animation: "spinCube 20s linear infinite", transformStyle: "preserve-3d" }}
// @keyframes spinCube { from { transform: rotateY(0) rotateX(0); } to { transform: rotateY(360deg) rotateX(360deg); } }
```

---

### TechPanel

```tsx
// TechPanel.tsx — Especialização do GlassPanel para OMNIS
import { GlassPanel } from "../../ui/GlassPanel";
import { cn } from "@/lib/utils";

export function TechPanel({ className, children, ...props }: React.ComponentProps<typeof GlassPanel>) {
  return (
    <GlassPanel
      variant="dark"
      className={cn(
        "border-violet-500/20 bg-slate-900/80 rounded-[8px]",
        className
      )}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}
```

---

### AgentList (com mock data)

```tsx
// AgentList.tsx
const MOCK_AGENTS = [
  { id: "core", name: "Omnis Core", role: "Orquestrador Principal", status: "online" as const },
  { id: "aurora", name: "Aurora AI", role: "Mentora & Inteligência", status: "online" as const },
  { id: "scribe", name: "Scribe Bot", role: "Documentação & Registro", status: "online" as const },
  { id: "insight", name: "Insight Bot", role: "Análises & Relatórios", status: "online" as const },
  { id: "builder", name: "Builder Bot", role: "Desenvolvimento & Código", status: "executing" as const },
];

export function AgentList({ agents = MOCK_AGENTS }: { agents?: typeof MOCK_AGENTS }) {
  return (
    <div className="flex flex-col gap-2">
      {agents.map((agent) => (
        <div key={agent.id} className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-900/50 ring-1 ring-violet-500/30 text-lg">
              🤖
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900",
                agent.status === "online" ? "bg-emerald-400" :
                agent.status === "executing" ? "bg-cyan-400 animate-pulse" :
                "bg-slate-500"
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{agent.name}</p>
            <p className="text-[10px] text-white/40 truncate">{agent.role}</p>
          </div>
          <StatusChip status={agent.status} size="sm" />
        </div>
      ))}
    </div>
  );
}
```

---

### IntegrationGrid (com mock data)

```tsx
const MOCK_INTEGRATIONS = [
  { id: "n8n", name: "n8n", icon: "⚙️", connected: true },
  { id: "make", name: "Make", icon: "🔧", connected: true },
  { id: "notion", name: "Notion", icon: "📝", connected: true },
  { id: "slack", name: "Slack", icon: "💬", connected: true },
  { id: "gdrive", name: "Google Drive", icon: "📁", connected: true },
  { id: "supabase", name: "Supabase", icon: "🗄️", connected: true },
  { id: "openai", name: "OpenAI", icon: "🧠", connected: true },
  { id: "add", name: "Adicionar", icon: "+", connected: false },
];

export function IntegrationGrid({ integrations = MOCK_INTEGRATIONS }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {integrations.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-800/60 p-2 text-center"
        >
          <span className="text-2xl">{item.icon}</span>
          <p className="text-[9px] text-white/50 leading-tight">{item.name}</p>
          {item.connected && (
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-400">
              Conectado
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## RightRail Slots (ordem fixa)

```tsx
// OmnisRightRail.tsx
export function OmnisRightRail() {
  return (
    <>
      <AuroraPanel context="omnis" />
      
      {/* Resumo do Lab */}
      <KratosCard title="Resumo do Lab">
        <div className="grid grid-cols-2 gap-3">
          <MetricBadge label="Agentes Ativos" value="15" />
          <MetricBadge label="Automações" value="23" />
          <MetricBadge label="Workflows" value="8" />
          <MetricBadge label="Execuções Hoje" value="156" delta={12} />
        </div>
      </KratosCard>

      {/* Agentes */}
      <KratosCard title="Agentes Ativos" icon={<Bot size={14} />}
        footer={<button className="text-xs text-white/40 hover:text-white/70">Ver todos</button>}
      >
        <AgentList />
      </KratosCard>

      {/* Automações */}
      <KratosCard title="Automações em Andamento">
        {MOCK_AUTOMATIONS.map(a => (
          <div key={a.id} className="flex items-center gap-3 py-1.5">
            <span className="text-lg">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{a.name}</p>
              <div className="mt-1 h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${a.progress}%` }} />
              </div>
            </div>
            <span className="text-xs text-white/50">{a.progress}%</span>
          </div>
        ))}
      </KratosCard>
    </>
  );
}
```

---

## Dados Mock (remover quando dados reais conectados)

```ts
const MOCK_AUTOMATIONS = [
  { id: "1", icon: "📸", name: "Post Instagram → Reels → Stories", progress: 76 },
  { id: "2", icon: "📊", name: "Relatório Semanal de Performance", progress: 62 },
  { id: "3", icon: "💾", name: "Backup Inteligente de Projetos", progress: 45 },
  { id: "4", icon: "📈", name: "Coleta de Métricas (IA)", progress: 33 },
];

const MOCK_ECONOMY = { hours: 12, minutes: 45, delta: 18 };
```

---

## Critério de Aceite

- [ ] Visual idêntico ao mockup `02_OMNIS_LAB.png`
- [ ] HolographicCore animando (ou CSS fallback ativo)
- [ ] AgentList com status dots corretos
- [ ] IntegrationGrid com 7+ ícones visíveis
- [ ] BottomDock mostra EconomyCounter + SystemHealth + IntegrationGrid
- [ ] `npm run build` 0 erros
- [ ] `python -m pytest -q` 128/128
- [ ] Backend INTOCADO
