# AKASHA / GRINGOTTS — Island Page Spec & Code
## FRONT-KIMI-08

**Mockup de referência:** `00_VISUAL_REFERENCES/images/01_AKASHA_GRINGOTTS.png`  
**Temática:** Vault, memória, conhecimento — Esmeralda `#059669` + Ouro `#F59E0B`  
**Template:** Vault

---

## Estrutura da Página

```
AkashaGringottsPage
├── TopHud (global)
├── Sidebar (global)
├── Main Content
│   ├── Header (Akasha Gringotts, O Seu Cérebro Estendido)
│   ├── Edifício Central visual (dôme esmeralda + Escudo K + cristais)
│   └── Labels: Hall da Sabedoria, Câmara de IA, Mesa de Pesquisa,
│              Portal da Memória, Arquivos Organizados,
│              Observatório de Dados, Mapa Semântico, Cristais de Memória
├── RightRail
│   ├── AuroraPanel
│   ├── DocumentosRecentes (4 cards com ícone doc + título + hora)
│   ├── PromptsSalvos (lista com ícone + nome)
│   ├── PesquisasAtivas (3 itens com barra de progresso)
│   ├── VaultIntegrityBadge (100% — Todos os sistemas seguros)
│   └── MemorySparkline (+23.6% últimos 30 dias)
└── BottomDock (padrão Akasha)
```

---

## Visão Geral (Left Widget — não substitui Sidebar)

```tsx
// KnowledgeStatPanel.tsx
const MOCK_STATS = [
  { icon: "📄", label: "Documentos", value: "12.458" },
  { icon: "💬", label: "Prompts Salvos", value: "3.287" },
  { icon: "📁", label: "Projetos Arquivados", value: "74" },
  { icon: "💡", label: "Insights Descobertos", value: "1.024" },
  { icon: "🔗", label: "Links de Conhecimento", value: "8.932" },
  { icon: "💾", label: "Memória Total", value: "98.7 GB" },
];

export function KnowledgeStatPanel() {
  return (
    <GlassPanel
      className="border-amber-500/25 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
      padding="md"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">📚</span>
        <div>
          <h3 className="font-serif text-sm font-bold text-amber-400">VISÃO GERAL</h3>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-base">{stat.icon}</span>
            <span className="flex-1 text-xs text-white/60">{stat.label}</span>
            <span className="text-xs font-bold tabular-nums text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
```

---

## Componentes NOVOS

### GoldBorderCard

```tsx
export function GoldBorderCard({
  icon,
  title,
  subtitle,
  timestamp,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  timestamp?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/[0.06] bg-slate-900/40 p-3 border-l-[3px] border-l-amber-500">
      {icon && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{title}</p>
        {subtitle && <p className="text-[10px] text-white/50 truncate">{subtitle}</p>}
        {timestamp && <p className="text-[9px] text-white/30 mt-0.5">{timestamp}</p>}
        {children}
      </div>
    </div>
  );
}
```

### VaultIntegrityBadge

```tsx
import { ShieldCheck } from "lucide-react";

export function VaultIntegrityBadge({ integrity = 100 }: { integrity?: number }) {
  return (
    <GlassPanel padding="sm" className="border-emerald-500/20">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-emerald-400" strokeWidth={1.5} />
        <div>
          <p className="text-2xl font-bold tabular-nums text-white">{integrity}%</p>
          <p className="text-[10px] text-emerald-400">Todos os sistemas seguros</p>
        </div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${integrity}%` }}
        />
      </div>
    </GlassPanel>
  );
}
```

### MemorySparkline

```tsx
// SVG sparkline simples de crescimento
export function MemorySparkline({ delta = 23.6 }: { delta?: number }) {
  // Dados mock para o sparkline
  const points = [40, 45, 38, 52, 48, 60, 55, 70, 65, 80, 75, 90];
  const w = 200, h = 60;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - ((p - min) / (max - min)) * h * 0.8 - h * 0.1,
  }));
  const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

  return (
    <GlassPanel padding="sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-white/40">Crescimento da Memória</p>
        <span className="text-sm font-bold text-emerald-400">+{delta}%</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 60 }}>
        <defs>
          <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#sparkline-grad)" />
        <path d={pathD} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-[9px] text-white/30 mt-1">Últimos 30 dias</p>
    </GlassPanel>
  );
}
```

---

## Mock Data (RightRail)

```ts
const MOCK_DOCS = [
  { title: "Plano de Produto KRATOS", time: "Hoje • 10:24", icon: "📋" },
  { title: "Estratégia de Conteúdo 2026", time: "Hoje • 09:15", icon: "📊" },
  { title: "Arquitetura OMNIS v2", time: "Ontem • 18:42", icon: "🏗️" },
  { title: "Mapa de Lançamento", time: "Ontem • 16:08", icon: "🗺️" },
];

const MOCK_PROMPTS = [
  { name: "Copy Persuasiva", icon: "✍️" },
  { name: "Análise de Risco", icon: "⚠️" },
  { name: "Ideação Criativa", icon: "💡" },
  { name: "Mentor IA", icon: "🧠" },
];

const MOCK_SEARCHES = [
  { name: "IA + Produtividade", progress: 75 },
  { name: "Arquétipos de Marca", progress: 50 },
  { name: "Mercados Digitais", progress: 30 },
];
```

---

## Critério de Aceite

- [ ] Visual idêntico ao mockup `01_AKASHA_GRINGOTTS.png`
- [ ] KnowledgeStatPanel com 6 métricas visíveis
- [ ] GoldBorderCard com borda âmbar à esquerda
- [ ] VaultIntegrityBadge mostrando 100%
- [ ] MemorySparkline com gráfico SVG verde
- [ ] `npm run build` 0 erros
- [ ] Backend INTOCADO
