// motionVariants.ts — KRATOS Motion System
// Dual-mode: Framer Motion (quando instalado) + CSS fallback
// Usar com AnimatePresence mode="wait" para transições entre ilhas

// =============================================
// FRAMER MOTION VARIANTS (principal)
// =============================================
// Instalar: npm install framer-motion
// Descomentar quando framer-motion estiver no package.json

/*
import { Variants, Transition } from "framer-motion";

export const kratosMotion = {
  // Ilha flutuando no mapa
  islandFloat: {
    initial: { y: 0, rotateX: 12 },
    animate: {
      y: [-8, 8, -8],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
    hover: {
      rotateX: 6,
      scale: 1.04,
      zIndex: 60,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  } satisfies { initial: any; animate: any; hover: any },

  // Reveal de painel glass
  glassReveal: {
    initial: { opacity: 0, backdropFilter: "blur(0px)" },
    animate: {
      opacity: 1,
      backdropFilter: "blur(16px)",
      transition: { duration: 0.5 },
    },
  } as Variants,

  // Stagger container para listas
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  } as Variants,

  // Fade + slide para itens de lista
  fadeInUp: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  } as Variants,

  // Pop para métricas
  metricPop: {
    initial: { scale: 0.85, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  } as Variants,

  // Transição de página entre ilhas
  pageTransition: {
    initial: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(2px)",
      transition: { duration: 0.3 },
    },
  } as Variants,

  // Dock entrando de baixo
  dockEnter: {
    initial: { y: 100 },
    animate: {
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  } as Variants,

  // Orb Aurora pulsando
  auroraOrb: {
    animate: {
      scale: [1, 1.08, 1],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  } as Variants,
};
*/

// =============================================
// CSS FALLBACK (ativo enquanto framer não instalado)
// Copiar para kratos-tokens.css ou usar como style inline
// =============================================

export const CSS_MOTION = {
  // Classes CSS para aplicar em elementos
  islandFloat: "animate-[float-slow_6s_ease-in-out_infinite]",
  cloudDrift:  "animate-[cloud-drift_120s_linear_infinite]",
  pulseGlow:   "animate-[pulse-glow_4s_ease-in-out_infinite]",
  spinSlow:    "animate-[spin-slow_10s_linear_infinite]",
  shimmer:     "animate-[shimmer_3s_ease-in-out_infinite]",

  // Transições básicas
  transition:  "transition-all duration-300 ease-out",
  hoverScale:  "hover:scale-105 transition-transform duration-300",
  hoverGlass:  "hover:bg-slate-900/75 hover:border-white/20 transition-all duration-300",
};

// Keyframes para adicionar ao tailwind.config.ts
export const TAILWIND_KEYFRAMES = {
  "float-slow": {
    "0%,100%": { transform: "translateY(0) rotateX(10deg)" },
    "50%": { transform: "translateY(-12px) rotateX(10deg)" },
  },
  "float-medium": {
    "0%,100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-8px)" },
  },
  "cloud-drift": {
    "0%": { transform: "translateX(-10vw)" },
    "100%": { transform: "translateX(110vw)" },
  },
  "pulse-glow": {
    "0%,100%": { opacity: "0.4" },
    "50%": { opacity: "0.7" },
  },
  "spin-slow": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "shimmer": {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
};

// Animations para adicionar ao tailwind.config.ts
export const TAILWIND_ANIMATIONS = {
  "float-slow":   "float-slow 6s ease-in-out infinite",
  "float-medium": "float-medium 5s ease-in-out infinite",
  "cloud-drift":  "cloud-drift 120s linear infinite",
  "pulse-glow":   "pulse-glow 4s ease-in-out infinite",
  "spin-slow":    "spin-slow 10s linear infinite",
  "shimmer":      "shimmer 3s ease-in-out infinite",
};

// =============================================
// useReducedMotion hook
// =============================================

// Salvar em: frontend/src/hooks/useReducedMotion.ts
export const USE_REDUCED_MOTION_HOOK = `
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// COMO USAR:
// const reduced = useReducedMotion();
// <FloatingIsland animate={!reduced} ... />
// Se reduced: substitui animate por opacity transition simples
`;
