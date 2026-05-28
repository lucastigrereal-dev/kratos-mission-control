import { useEffect } from "react";
import { Plane } from "lucide-react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { useIslandDock } from "./shared/IslandDockContext";

function DreamPortal() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative flex items-center justify-center h-[180px] w-[180px]">
        <div
          className="absolute inset-0 rounded-full kratos-pulse"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--kr-island-nimbus, #0EA5E9) 50%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full"
          style={{
            border: "4px solid color-mix(in oklab, var(--kr-island-nimbus, #0EA5E9) 20%, transparent)",
            background: "color-mix(in oklab, var(--kr-surface-deep, #0F172A) 40%, transparent)",
            boxShadow: "0 0 60px color-mix(in oklab, var(--kr-island-nimbus, #0EA5E9) 15%, transparent)",
          }}
        >
          {[0, 20, 40].map((offset, i) => (
            <svg
              key={i}
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              style={{
                animation: `spin ${6 + i * 2}s linear infinite ${i % 2 === 0 ? "normal" : "reverse"}`,
              }}
              aria-hidden
            >
              <circle
                cx="100"
                cy="100"
                r={80 - offset}
                fill="none"
                stroke="url(#portalGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${120 + i * 30} ${240}`}
                opacity={0.7 - i * 0.12}
              />
              <defs>
                <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--kr-accent-blue-cyan)" />
                  <stop offset="50%" stopColor="var(--kr-island-nimbus)" />
                  <stop offset="100%" stopColor="var(--kr-castle-roof)" />
                </linearGradient>
              </defs>
            </svg>
          ))}
          <div
            className="z-20 h-14 w-14 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--kr-accent-cyan-bright, #22D3EE), var(--kr-island-nimbus))",
              boxShadow: "0 0 30px color-mix(in oklab, var(--kr-accent-cyan-bright, #67E8F9) 80%, transparent)",
              animation: "kratos-pulse 3s ease-in-out infinite",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

export function NimbusScreen() {
  const { setData } = useIslandDock();

  useEffect(() => {
    setData({
      islandId: "nimbus",
      label: "Viagens",
      value: "—",
      progress: 0,
      progressColor: "var(--kr-island-nimbus)",
      quickActions: [{ label: "+ Destino" }, { label: "Checklist" }],
    });
    return () => setData(null);
  }, [setData]);

  return (
    <IslandPageFrame theme="nimbus">
      <IslandPageHeader
        title="NIMBUS ACADEMY"
        subtitle="Viagens, Aventuras e Bucket List"
        theme="nimbus"
      />
      <DreamPortal />
      <EmptyState
        icon={<Plane className="h-4 w-4" />}
        title="Nenhuma viagem programada"
        description="Esta ilha exibirá viagens e aventuras quando integrada a um tracker externo."
      />
    </IslandPageFrame>
  );
}
