import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { MissionBanner } from "./MissionBanner";

/* --------------------------------------------------*\
 * CentralCastleMission — CSS-only 3D castle
 *
 * The emotional anchor and mission center of the
 * KRATOS world map. Built purely with CSS shapes
 * and design tokens. No images, no canvas.
\* --------------------------------------------------*/

interface CentralCastleMissionProps {
  /** The current mission text shown in the banner overlay */
  currentMission?: string;
  /** Mission execution status */
  missionStatus?: "active" | "paused" | "completed";
  /** Drift risk level — controls Energy Portal glow color */
  driftRisk?: "low" | "medium" | "high";
  /** Click handler for the entire castle region */
  onCastleClick?: () => void;
  className?: string;
}

export function CentralCastleMission({
  currentMission = "Definir foco do dia",
  missionStatus = "active",
  driftRisk,
  onCastleClick,
  className,
}: CentralCastleMissionProps) {
  const portalColor =
    driftRisk === "high"
      ? "var(--kr-color-risk, #EF4444)"
      : driftRisk === "medium"
        ? "var(--kr-color-warn, #F59E0B)"
        : "var(--kr-accent-purple, #A855F7)";
  return (
    <div
      role={onCastleClick ? "button" : undefined}
      tabIndex={onCastleClick ? 0 : undefined}
      onClick={onCastleClick}
      onKeyDown={
        onCastleClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onCastleClick();
            }
          : undefined
      }
      className={cn(
        "relative flex flex-col items-center justify-center",
        "kr-animate-float-slow select-none",
        className,
      )}
      style={{
        zIndex: "var(--kr-z-central-castle)",
      }}
    >
      {/* --------------------------------------------------
       * GOLDEN PERIMETER GLOW
       * -------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[50%]"
        style={{
          boxShadow: "0 0 60px rgba(255,215,0,0.12), 0 0 120px rgba(255,215,0,0.06)",
        }}
      />

      {/* --------------------------------------------------
       * BASE ISLAND PLATFORM
       * Organic shape, largest variant
       * -------------------------------------------------- */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "240px",
          height: "90px",
          borderRadius: "42% 58% 52% 48% / 46% 44% 56% 54%",
          background:
            "linear-gradient(180deg, var(--kr-grass) 0%, var(--kr-grass-light) 18%, var(--kr-earth) 55%, var(--kr-earth-dark) 100%)",
          boxShadow: "0 28px 72px rgba(3,7,18,0.4)",
        }}
      >
        {/* Grass highlight stripe */}
        <div
          className="absolute left-[12%] right-[12%]"
          style={{
            top: "12%",
            height: "6px",
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, transparent, var(--kr-grass-light) 20%, var(--kr-grass-light) 80%, transparent)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* --------------------------------------------------
       * CASTLE STRUCTURE — towers + body + gate
       * Built on top of the island platform
       * -------------------------------------------------- */}
      <div
        className="absolute flex items-end gap-0"
        style={{ bottom: "30px" }}
      >
        {/* ---- LEFT TOWER (medium, 90px) ---- */}
        <div className="relative flex flex-col items-center" style={{ marginRight: "-2px" }}>
          {/* Roof triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "22px solid transparent",
              borderRight: "22px solid transparent",
              borderBottom: "28px solid var(--kr-castle-roof)",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            }}
          />
          {/* Tower body */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "36px",
              height: "62px",
              background:
                "linear-gradient(180deg, var(--kr-castle-stone), var(--kr-castle-wall) 30%, var(--kr-castle-stone))",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            {/* Window slot */}
            <div
              style={{
                width: "6px",
                height: "14px",
                borderRadius: "3px",
                background: "var(--kr-azure)",
                boxShadow: "0 0 8px var(--kr-azure)",
                opacity: 0.7,
              }}
            />
            {/* Brick line detail */}
            <div
              className="absolute"
              style={{
                left: "4px",
                right: "4px",
                top: "50%",
                height: "1px",
                background: "rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>

        {/* ---- CENTER TOWER (tallest, 120px) ---- */}
        <div className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
          {/* Roof triangle — center is taller */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "26px solid transparent",
              borderRight: "26px solid transparent",
              borderBottom: "34px solid var(--kr-castle-roof)",
              filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))",
            }}
          />
          {/* Tower body */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "44px",
              height: "86px",
              background:
                "linear-gradient(180deg, var(--kr-castle-stone), var(--kr-castle-wall) 30%, var(--kr-castle-stone))",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            {/* Upper window */}
            <div
              style={{
                width: "7px",
                height: "16px",
                borderRadius: "3.5px",
                background: "var(--kr-azure)",
                boxShadow: "0 0 10px var(--kr-azure)",
                opacity: 0.8,
              }}
            />
            {/* Brick line */}
            <div
              className="absolute"
              style={{
                left: "5px",
                right: "5px",
                top: "55%",
                height: "1px",
                background: "rgba(0,0,0,0.25)",
              }}
            />
            {/* Lower window */}
            <div
              className="mt-2"
              style={{
                width: "7px",
                height: "16px",
                borderRadius: "3.5px",
                background: "var(--kr-azure)",
                boxShadow: "0 0 10px var(--kr-azure)",
                opacity: 0.8,
              }}
            />
          </div>

          {/* ---- K SHIELD (above gate, on center tower) ---- */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              bottom: "34px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "rgba(255,215,0,0.08)",
              boxShadow:
                "0 0 20px rgba(255,215,0,0.2), inset 0 0 12px rgba(255,215,0,0.06)",
            }}
          >
            <Shield
              size={18}
              style={{
                color: "var(--kr-gold)",
                filter: "drop-shadow(0 0 6px rgba(255,215,0,0.5))",
              }}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* ---- RIGHT TOWER (medium, 90px) ---- */}
        <div className="relative flex flex-col items-center" style={{ marginLeft: "-2px" }}>
          {/* Roof triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "22px solid transparent",
              borderRight: "22px solid transparent",
              borderBottom: "28px solid var(--kr-castle-roof)",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            }}
          />
          {/* Tower body */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "36px",
              height: "62px",
              background:
                "linear-gradient(180deg, var(--kr-castle-stone), var(--kr-castle-wall) 30%, var(--kr-castle-stone))",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            {/* Window slot */}
            <div
              style={{
                width: "6px",
                height: "14px",
                borderRadius: "3px",
                background: "var(--kr-azure)",
                boxShadow: "0 0 8px var(--kr-azure)",
                opacity: 0.7,
              }}
            />
            {/* Brick line detail */}
            <div
              className="absolute"
              style={{
                left: "4px",
                right: "4px",
                top: "50%",
                height: "1px",
                background: "rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
       * MAIN CASTLE WALL (behind towers)
       * -------------------------------------------------- */}
      <div
        className="absolute flex items-end gap-0"
        style={{ bottom: "40px", zIndex: 1 }}
      >
        {/* Left wall wing */}
        <div
          style={{
            width: "30px",
            height: "44px",
            background: "var(--kr-castle-stone)",
            borderRadius: "3px 0 0 3px",
            borderRight: "1px solid rgba(0,0,0,0.15)",
          }}
        />

        {/* Center wall — contains 3 windows + gate */}
        <div
          className="relative flex items-end justify-center gap-4"
          style={{
            width: "90px",
            height: "54px",
            background:
              "linear-gradient(180deg, var(--kr-castle-stone), var(--kr-castle-wall) 40%, var(--kr-castle-stone))",
          }}
        >
          {/* Left window */}
          <div
            style={{
              width: "8px",
              height: "18px",
              borderRadius: "4px 4px 0 0",
              background: "var(--kr-azure)",
              boxShadow: "0 0 10px rgba(30,144,255,0.5)",
              opacity: 0.65,
              marginBottom: "16px",
            }}
          />
          {/* Center window (over gate) */}
          <div
            style={{
              width: "8px",
              height: "18px",
              borderRadius: "4px 4px 0 0",
              background: "var(--kr-azure)",
              boxShadow: "0 0 10px rgba(30,144,255,0.5)",
              opacity: 0.65,
              marginBottom: "20px",
            }}
          />
          {/* Right window */}
          <div
            style={{
              width: "8px",
              height: "18px",
              borderRadius: "4px 4px 0 0",
              background: "var(--kr-azure)",
              boxShadow: "0 0 10px rgba(30,144,255,0.5)",
              opacity: 0.65,
              marginBottom: "16px",
            }}
          />

          {/* ---- ARCHED GATE ---- */}
          <div
            className="absolute flex flex-col items-center"
            style={{ bottom: 0 }}
          >
            {/* Arch top */}
            <div
              style={{
                width: "28px",
                height: "16px",
                borderRadius: "14px 14px 0 0",
                background: "rgba(0,0,0,0.5)",
                border: "1.5px solid var(--kr-castle-stone)",
                borderBottom: "none",
              }}
            />
            {/* Gate opening — dark with gold inner glow */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "28px",
                height: "18px",
                background: "rgba(2,6,23,0.85)",
                borderLeft: "1.5px solid var(--kr-castle-stone)",
                borderRight: "1.5px solid var(--kr-castle-stone)",
                borderBottom: "1.5px solid var(--kr-castle-stone)",
                boxShadow:
                  "inset 0 0 12px color-mix(in srgb, var(--kr-gold, #FFD700) 12%, transparent), inset 0 0 24px color-mix(in srgb, var(--kr-gold, #FFD700) 4%, transparent)",
              }}
            >
              {/* Inner glow line */}
              <div
                style={{
                  width: "14px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, var(--kr-gold, #FFD700) 30%, transparent), transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right wall wing */}
        <div
          style={{
            width: "30px",
            height: "44px",
            background: "var(--kr-castle-stone)",
            borderRadius: "0 3px 3px 0",
            borderLeft: "1px solid rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* --------------------------------------------------
       * ENERGY PORTAL — pulsing circle at gate base
       * -------------------------------------------------- */}
      <div
        className="absolute kr-animate-pulse-glow"
        style={{
          bottom: "16px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.35) 0%, color-mix(in srgb, ${portalColor} 25%, transparent) 25%, color-mix(in srgb, ${portalColor} 6%, transparent) 55%, transparent 70%)`,
          boxShadow: `0 0 30px color-mix(in srgb, ${portalColor} 20%, transparent)`,
          zIndex: 3,
        }}
      />

      {/* --------------------------------------------------
       * MISSION BANNER OVERLAY
       * -------------------------------------------------- */}
      <div
        className="absolute"
        style={{
          bottom: "-18px",
          zIndex: "var(--kr-z-mission-banner)",
          width: "200px",
        }}
      >
        <MissionBanner
          mission={currentMission}
          status={missionStatus}
          className="shadow-lg"
        />
      </div>
    </div>
  );
}
