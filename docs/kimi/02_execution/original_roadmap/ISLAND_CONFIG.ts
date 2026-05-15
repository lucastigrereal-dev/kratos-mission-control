// ISLAND_CONFIG.ts — Configuração Canônica das 11 Ilhas
// Fonte única de verdade para posicionamento, temas e roteamento
// NÃO alterar sem aprovação explícita

export interface IslandConfig {
  id: string;
  name: string;
  tagline: string;
  route: string;
  position: { left: string; top: string };
  size: 'sm' | 'md' | 'lg' | 'xl';
  theme: {
    primary: string;
    glow: string;
    label: string;
    tailwindGlow: string;
  };
  icon: string; // emoji temporário até icons finais
  zIndex: number;
}

export const ISLANDS: IslandConfig[] = [
  {
    id: 'palco-central',
    name: 'PALCO CENTRAL',
    tagline: 'Missão. Foco. Visão.',
    route: '/',
    position: { left: '50%', top: '45%' },
    size: 'xl',
    theme: {
      primary: '#1E3A8A',
      glow: '#3B82F6',
      label: '#93C5FD',
      tailwindGlow: 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
    },
    icon: '🏰',
    zIndex: 50,
  },
  {
    id: 'omnis-lab',
    name: 'OMNIS LAB',
    tagline: 'IA. Automações. Workflows.',
    route: '/omnis',
    position: { left: '10%', top: '8%' },
    size: 'lg',
    theme: {
      primary: '#7C3AED',
      glow: '#8B5CF6',
      label: '#C4B5FD',
      tailwindGlow: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]',
    },
    icon: '🤖',
    zIndex: 40,
  },
  {
    id: 'akasha',
    name: 'AKASHA / GRINGOTTS',
    tagline: 'Memória. Conhecimento. Inteligência.',
    route: '/akasha',
    position: { left: '75%', top: '10%' },
    size: 'lg',
    theme: {
      primary: '#059669',
      glow: '#10B981',
      label: '#6EE7B7',
      tailwindGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    },
    icon: '📚',
    zIndex: 40,
  },
  {
    id: 'arena-comercial',
    name: 'ARENA COMERCIAL',
    tagline: 'Vendas. Conquistas. Metas.',
    route: '/arena',
    position: { left: '22%', top: '78%' },
    size: 'lg',
    theme: {
      primary: '#DC2626',
      glow: '#F87171',
      label: '#FCA5A5',
      tailwindGlow: 'shadow-[0_0_40px_rgba(220,38,38,0.25)]',
    },
    icon: '⚔️',
    zIndex: 40,
  },
  {
    id: 'agencia-estudio',
    name: 'AGÊNCIA / ESTÚDIO',
    tagline: 'Conteúdo. Marca. Impacto.',
    route: '/agencia',
    position: { left: '8%', top: '38%' },
    size: 'lg',
    theme: {
      primary: '#F97316',
      glow: '#FB923C',
      label: '#FDBA74',
      tailwindGlow: 'shadow-[0_0_40px_rgba(249,115,22,0.25)]',
    },
    icon: '🎬',
    zIndex: 40,
  },
  {
    id: 'vila-viva',
    name: 'VILA VIVA',
    tagline: 'Família. Rotina. Vida real.',
    route: '/vila',
    position: { left: '12%', top: '62%' },
    size: 'lg',
    theme: {
      primary: '#16A34A',
      glow: '#86EFAC',
      label: '#BBF7D0',
      tailwindGlow: 'shadow-[0_0_40px_rgba(22,163,74,0.25)]',
    },
    icon: '🏡',
    zIndex: 40,
  },
  {
    id: 'observatorio',
    name: 'OBSERVATÓRIO',
    tagline: 'Estratégia. Visão. Decisões.',
    route: '/observatorio',
    position: { left: '65%', top: '82%' },
    size: 'lg',
    theme: {
      primary: '#1E3A8A',
      glow: '#3B82F6',
      label: '#60A5FA',
      tailwindGlow: 'shadow-[0_0_40px_rgba(59,130,246,0.25)]',
    },
    icon: '🔭',
    zIndex: 40,
  },
  {
    id: 'nimbus',
    name: 'NIMBUS ACADEMY',
    tagline: 'Explore. Sonhe. Viva o Extraordinário.',
    route: '/nimbus',
    position: { left: '48%', top: '92%' },
    size: 'md',
    theme: {
      primary: '#0EA5E9',
      glow: '#7DD3FC',
      label: '#BAE6FD',
      tailwindGlow: 'shadow-[0_0_40px_rgba(14,165,233,0.3)]',
    },
    icon: '☁️',
    zIndex: 40,
  },
  {
    id: 'tesouro',
    name: 'TESOURO / FINANÇAS',
    tagline: 'Patrimônio. Metas. Liberdade.',
    route: '/tesouro',
    position: { left: '78%', top: '65%' },
    size: 'lg',
    theme: {
      primary: '#166534',
      glow: '#FACC15',
      label: '#4ADE80',
      tailwindGlow: 'shadow-[0_0_40px_rgba(250,204,21,0.2)]',
    },
    icon: '💰',
    zIndex: 40,
  },
  {
    id: 'forja',
    name: 'FORJA / CORPO',
    tagline: 'Treino. Saúde. Disciplina.',
    route: '/forja',
    position: { left: '45%', top: '72%' },
    size: 'lg',
    theme: {
      primary: '#475569',
      glow: '#EA580C',
      label: '#94A3B8',
      tailwindGlow: 'shadow-[0_0_40px_rgba(234,88,12,0.25)]',
    },
    icon: '⚒️',
    zIndex: 40,
  },
  {
    id: 'filosofia',
    name: 'FILOSOFIA & SABEDORIA',
    tagline: 'Reflexão. Aprendizado. Evolução.',
    route: '/filosofia',
    position: { left: '82%', top: '38%' },
    size: 'lg',
    theme: {
      primary: '#7C3AED',
      glow: '#A855F7',
      label: '#C4B5FD',
      tailwindGlow: 'shadow-[0_0_40px_rgba(168,85,247,0.25)]',
    },
    icon: '🧠',
    zIndex: 40,
  },
];

// Sidebar navigation order (fixed — nunca alterar sem autorização)
export const SIDEBAR_ORDER = [
  'palco-central',
  'omnis-lab',
  'agencia-estudio',
  'akasha',
  'filosofia',
  'tesouro',
  'forja',
  'vila-viva',
  'arena-comercial',
  'observatorio',
  'nimbus',
  // configurações é item separado, não ilha
];

export const getIsland = (id: string) => ISLANDS.find(i => i.id === id);
export const getIslandByRoute = (route: string) => ISLANDS.find(i => i.route === route);
