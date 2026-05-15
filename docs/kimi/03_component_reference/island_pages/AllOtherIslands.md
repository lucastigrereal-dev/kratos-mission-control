# AGÊNCIA / ESTÚDIO — Island Page Spec
## FRONT-KIMI-09

**Mockups:** `03_AGENCIA_ESTUDIO_V2.png`, `04_AGENCIA_ESTUDIO_V1.png`  
**Tema:** Laranja `#F97316` | Template: Criativa

## Componentes novos: `src/components/islands/agencia/`

### KpiQuadPanel
```tsx
const KPIS = [
  { id: "ideias", label: "Ideias", value: 23, icon: "💡", color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "producao", label: "Em Produção", value: 7, icon: "🎬", color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "agendados", label: "Agendados", value: 12, icon: "📅", color: "text-sky-400", bg: "bg-sky-400/10" },
  { id: "publicados", label: "Publicados", value: 48, icon: "✅", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export function KpiQuadPanel({ kpis = KPIS }) {
  return (
    <GlassPanel padding="md">
      <SectionTitle>PAINEL CRIATIVO</SectionTitle>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {kpis.map(k => (
          <div key={k.id} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xl", k.bg)}>
              {k.icon}
            </div>
            <span className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</span>
            <span className="text-[9px] text-white/50 text-center leading-tight">{k.label}</span>
          </div>
        ))}
      </div>
      {/* Sparkline SVG simples */}
      <div className="h-8 w-full rounded-lg bg-gradient-to-r from-orange-500/20 via-amber-400/30 to-emerald-400/20" />
    </GlassPanel>
  );
}
```

### ContentCalendar
```tsx
const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const TODAY = 21; // dinâmico em produção

export function ContentCalendar({ currentDay = TODAY }) {
  return (
    <GlassPanel padding="sm">
      <SectionTitle>CALENDÁRIO DE CONTEÚDO</SectionTitle>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => <p key={d} className="text-center text-[9px] text-white/40">{d}</p>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }, (_, i) => i + 15).map(day => (
          <div key={day} className={cn(
            "flex h-8 w-full items-center justify-center rounded-lg text-xs",
            day === currentDay
              ? "ring-2 ring-orange-500 bg-orange-500/20 font-bold text-orange-300"
              : "bg-white/5 text-white/60 hover:bg-white/10 cursor-pointer"
          )}>
            {day}
            {/* dots for content scheduled */}
            {[19,21,23,24].includes(day) && (
              <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-orange-400" />
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
```

### IdeaTracker
```tsx
const MOCK_IDEAS = [
  { id: "1", name: "Série: Bastidores do KRATOS", progress: 75, color: "bg-orange-400" },
  { id: "2", name: "Reels: Dicas rápidas", progress: 50, color: "bg-amber-400" },
  { id: "3", name: "Vídeo: Como uso IA", progress: 30, color: "bg-sky-400" },
];

export function IdeaTracker({ ideas = MOCK_IDEAS }) {
  return (
    <div className="flex flex-col gap-2">
      {ideas.map(idea => (
        <div key={idea.id} className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white/80 mb-1">{idea.name}</p>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className={cn("h-full rounded-full", idea.color)} style={{ width: `${idea.progress}%` }} />
            </div>
          </div>
          <span className="text-[10px] text-white/40">{idea.progress}%</span>
        </div>
      ))}
    </div>
  );
}
```

**RightRail:** AuroraPanel + KpiQuadPanel + MetricBadgeV2 (Alcance/Engajamento/Cliques) + ContentCalendar + IdeaTracker  
**Critério:** Visual idêntico aos mockups Agência V1 e V2.

---

# VILA VIVA — Island Page Spec

**Mockup:** `08_VILA_VIVA.png` | **Tema:** Verde `#16A34A` + Terra | Template: Vida

## Componentes: `src/components/islands/vila/`

### DailyRoutines
```tsx
const MOCK_ROUTINES = [
  { icon: "☀️", label: "Acordar cedo", done: true },
  { icon: "🧘", label: "Meditar", done: true },
  { icon: "💪", label: "Treinar", done: true },
  { icon: "📖", label: "Ler", done: false },
  { icon: "🌙", label: "Dormir cedo", done: false },
];
export function DailyRoutines({ routines = MOCK_ROUTINES }) {
  const done = routines.filter(r => r.done).length;
  return (
    <GlassPanel padding="sm">
      <SectionTitle>ROTINAS DO DIA</SectionTitle>
      <div className="flex flex-col gap-1.5">
        {routines.map(r => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="text-sm">{r.icon}</span>
            <span className={cn("flex-1 text-xs", r.done ? "text-white/80" : "text-white/40")}>{r.label}</span>
            {r.done && <span className="text-emerald-400 text-xs">✓</span>}
          </div>
        ))}
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(done/routines.length)*100}%` }} />
      </div>
    </GlassPanel>
  );
}
```

**Outros componentes:** FamilyAgenda, RelationshipReminders, QualityTimePanel (ProgressRing verde 78%), LifeAgendaCalendar  
**RightRail:** AuroraPanel + FamilyAgenda + RelationshipReminders + DailyRoutines + QualityTimePanel  
**Critério:** Visual idêntico ao mockup Vila Viva.

---

# ARENA COMERCIAL — Island Page Spec

**Tema:** Vermelho `#DC2626` + Dourado | Template: Impacto

## Componentes: `src/components/islands/arena/`

```tsx
// RankingBoard — Top 3 com ouro/prata/bronze
const MEDAL = ["🥇","🥈","🥉"];
export function RankingBoard({ items }: { items: {rank:number; name:string; score:string}[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={item.rank} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
          <span className="text-base">{MEDAL[i] ?? item.rank}</span>
          <span className="flex-1 text-xs font-medium text-white">{item.name}</span>
          <span className="text-xs font-bold tabular-nums text-amber-400">{item.score}</span>
        </div>
      ))}
    </div>
  );
}

// CurrencyBadge
export function CurrencyBadge({ label, value, delta }: { label:string; value:string; delta?:number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-xl font-bold tabular-nums text-white">{value}</span>
      {delta && <span className="text-xs text-emerald-400">+{delta}%</span>}
    </div>
  );
}
```

**RightRail:** AuroraPanel + Metas de Vendas + Pipeline + Hall of Fame + CurrencyBadge  
**Critério:** Visual de arena — vermelho, dourado, energia competitiva.

---

# FORJA / CORPO — Island Page Spec

**Mockup via contexto** | **Tema:** Cinza `#475569` + Laranja `#EA580C`

## Componentes: `src/components/islands/forja/`
- **Reutiliza** SystemHealth (OMNIS) adaptado para condicionamento físico
- **Reutiliza** DailyRoutines (Vila) para checklist de treinos
- **StreakBadge:** `🔥 47 dias` — número grande + "dias" + flame
- **ProgressRing triplo:** Sono (72%), Hidratação (85%), Meditação (60%)
- **WorkoutTimer:** Contador circular para tempo de treino ativo

---

# OBSERVATÓRIO — Island Page Spec

**Mockup:** `09_OBSERVATORIO.png` | **Tema:** Azul-marinho `#1E3A8A` + Ciano

## Componentes: `src/components/islands/observatorio/`
```tsx
// OpportunityList — nome + potencial %
// TrendBadge — pill "EM ALTA" verde ou "CRESCENDO" âmbar
// FutureProjects — nome + barra fina + %
// InnovationGrid — grid 2x2 com ícone 48px + título + 3 status dots
```
**RightRail:** AuroraPanel + Oportunidades + Tendências + Projetos Futuros + Ideias Inovadoras

---

# TESOURO / FINANÇAS — Island Page Spec

**Tema:** Verde-escuro `#166534` + Ouro `#FACC15`

## Componentes
- **Reutiliza** VaultIntegrityBadge (adaptar: "Segurança Financeira")
- **Reutiliza** GoldBorderCard (transações, investimentos)
- **StreakBadge:** dias de economia seguida
- **PatrimônioRing:** ProgressRing dourado grande
- **FluxoCaixaChart:** Barras simples SVG entrada/saída

---

# FILOSOFIA & SABEDORIA — Island Page Spec

**Mockup:** `07_FILOSOFIA_SABEDORIA.png` | **Tema:** Violeta `#7C3AED` + Lilás `#C4B5FD`

## Componentes: `src/components/islands/filosofia/`
```tsx
// DailyReflections — ícone💡 + insight + hora
const MOCK_REFLECTIONS = [
  { insight: "O foco é a ponte entre ideia e realização.", time: "08:15" },
  { insight: "Sua mente é poderosa, cuide dela bem.", time: "07:42" },
  { insight: "Disciplina hoje, liberdade amanhã.", time: "06:30" },
];

// LessonsLearned — checklist com livro + texto + check
const MOCK_LESSONS = [
  "Persistência transforma talento em conquista.",
  "Errar rápido é aprender mais rápido.",
  "O ambiente molda seu comportamento.",
];

// PrinciplesList — "Clareza > Intensidade", estilo X > Y
const PRINCIPLES = [
  { a: "Clareza", b: "Intensidade", icon: "💎" },
  { a: "Consistência", b: "Motivação", icon: "🎯" },
  { a: "Profundidade", b: "Velocidade", icon: "⛰️" },
];

// QuoteOfDay — card âmbar largo com citação longa + autor
export function QuoteOfDay({ quote, author }: { quote:string; author:string }) {
  return (
    <GlassPanel className="border-amber-500/20 bg-amber-900/10" padding="md">
      <p className="text-[10px] uppercase tracking-wider text-amber-400/60 mb-2">CITAÇÃO DO DIA</p>
      <p className="text-sm italic text-white/80 leading-relaxed">"{quote}"</p>
      <p className="mt-2 text-xs text-amber-400">— {author}</p>
    </GlassPanel>
  );
}
```
**RightRail:** AuroraPanel + DailyReflections + LessonsLearned + PrinciplesList + QuoteOfDay  
**Critério:** Visual idêntico ao mockup Filosofia & Sabedoria.

---

# NIMBUS ACADEMY — Island Page Spec

**Mockup:** `05_NIMBUS_ACADEMY.png` | **Tema:** Azul-ciano `#0EA5E9` + cristal

## Componentes: `src/components/islands/nimbus/`
```tsx
// DreamPortal — cilindro 180px, anéis SVG, glow ciano
// WoodenSign — placa rústica bg-amber-900 com texto
// TravelCard — destino + datas + badge dias restantes
// WishList — estrelas preenchidas/vazias + check
// AdventureTracker — ícone + barra + %

const MOCK_TRAVELS = [
  { destination: "Bali, Indonésia", dates: "15 – 28 Jun", daysLeft: 18 },
  { destination: "Fernando de Noronha", dates: "10 – 15 Jul", daysLeft: 35 },
  { destination: "Japão", dates: "05 – 20 Out", daysLeft: 112 },
];

const MOCK_WISHES = [
  { name: "Ver Aurora Boreal", done: true },
  { name: "Aprender a surfar", done: true },
  { name: "Morar fora por 1 ano", done: false },
  { name: "Dar a volta ao mundo", done: false },
];
```
**RightRail:** AuroraPanel + ProximasViagens + WishList + AdventureTracker + InspirationCard
