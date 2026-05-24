import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AuroraOrbProps {
  open: boolean;
  onClick: () => void;
}

const prefersReduced =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export function AuroraOrb({ open, onClick }: AuroraOrbProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fechar Aurora" : "Abrir Aurora"}
      aria-pressed={open}
      className="fixed z-[88] flex items-center justify-center rounded-full kratos-focus-ring"
      style={{
        width: 44,
        height: 44,
        bottom: 84,
        right: 16,
        background: open
          ? "linear-gradient(135deg, var(--kr-info,#3b82f6), var(--kr-ghost,#6366f1))"
          : "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.12))",
        border: `1.5px solid ${open ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.25)"}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: open
          ? "0 0 20px rgba(99,102,241,0.4), 0 4px 12px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
      whileTap={prefersReduced ? {} : { scale: 0.92 }}
      animate={
        prefersReduced
          ? {}
          : open
            ? { scale: 1 }
            : {
                boxShadow: [
                  "0 0 0px rgba(99,102,241,0)",
                  "0 0 14px rgba(99,102,241,0.35)",
                  "0 0 0px rgba(99,102,241,0)",
                ],
              }
      }
      transition={
        prefersReduced
          ? {}
          : open
            ? { duration: 0.2 }
            : {
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
      }
    >
      <Sparkles
        className="h-4.5 w-4.5"
        style={{
          color: open ? "#fff" : "var(--kr-ghost, #6366f1)",
          width: 18,
          height: 18,
        }}
      />
    </motion.button>
  );
}
