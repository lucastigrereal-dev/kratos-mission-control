import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { MissionBanner } from "./MissionBanner";

/* --------------------------------------------------*\
 * CentralCastleMission — Dominant castle scaled to
 * match mockup proportions.
\* --------------------------------------------------*/

interface CentralCastleMissionProps {
  currentMission?: string;
  missionStatus?: "active" | "paused" | "completed";
  driftRisk?: "low" | "medium" | "high";
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
      ? "#EF4444"
      : driftRisk === "medium"
        ? "#F59E0B"
        : "#A855F7";

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
      style={{ zIndex: 50 }}
    >
      {/* Golden perimeter glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[50%]"
        style={{
          boxShadow:
            "0 0 100px color-mix(in oklab, #FFD700 16%, transparent), 0 0 200px color-mix(in oklab, #FFD700 8%, transparent)",
        }}
      />

      {/* Base island platform — 520x200 */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "520px",
          height: "200px",
          borderRadius: "42% 58% 52% 48% / 46% 44% 56% 54%",
          background:
            "linear-gradient(180deg, #22C55E 0%, #4ADE80 18%, #92400E 55%, #78350F 100%)",
          boxShadow:
            "0 32px 80px color-mix(in oklab, #020617 45%, transparent)",
        }}
      >
        <div
          className="absolute left-[12%] right-[12%]"
          style={{
            top: "12%",
            height: "6px",
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, transparent, #4ADE80 20%, #4ADE80 80%, transparent)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Castle structure — scaled 2.0x */}
      <div
        className="absolute flex items-end gap-0"
        style={{ bottom: "64px" }}
      >
        {/* Left tower */}
        <div className="relative flex flex-col items-center" style={{ marginRight: "-2px" }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "48px solid transparent",
              borderRight: "48px solid transparent",
              borderBottom: "60px solid #DC2626",
              filter: "drop-shadow(0 2px 4px color-mix(in oklab, black 40%, transparent))",
            }}
          />
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "76px",
              height: "130px",
              background:
                "linear-gradient(180deg, #D6D3D1, #E7E5E4 30%, #D6D3D1)",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "30px",
                borderRadius: "7px",
                background: "#1E90FF",
                boxShadow: "0 0 14px #1E90FF",
                opacity: 0.7,
              }}
            />
            <div
              className="absolute"
              style={{
                left: "10px",
                right: "10px",
                top: "50%",
                height: "1px",
                background: "color-mix(in oklab, black 25%, transparent)",
              }}
            />
          </div>
        </div>

        {/* Center tower — tallest */}
        <div className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "56px solid transparent",
              borderRight: "56px solid transparent",
              borderBottom: "70px solid #DC2626",
              filter: "drop-shadow(0 3px 6px color-mix(in oklab, black 45%, transparent))",
            }}
          />
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "92px",
              height: "180px",
              background:
                "linear-gradient(180deg, #D6D3D1, #E7E5E4 30%, #D6D3D1)",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "32px",
                borderRadius: "7.5px",
                background: "#1E90FF",
                boxShadow: "0 0 16px #1E90FF",
                opacity: 0.8,
              }}
            />
            <div
              className="absolute"
              style={{
                left: "10px",
                right: "10px",
                top: "55%",
                height: "1px",
                background: "color-mix(in oklab, black 25%, transparent)",
              }}
            />
            <div
              className="mt-3"
              style={{
                width: "15px",
                height: "32px",
                borderRadius: "7.5px",
                background: "#1E90FF",
                boxShadow: "0 0 16px #1E90FF",
                opacity: 0.8,
              }}
            />
          </div>

          {/* K Shield */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              bottom: "68px",
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "color-mix(in oklab, #FFD700 12%, transparent)",
              boxShadow:
                "0 0 32px color-mix(in oklab, #FFD700 25%, transparent), inset 0 0 20px color-mix(in oklab, #FFD700 8%, transparent)",
            }}
          >
            <Shield
              size={34}
              style={{
                color: "#FFD700",
                filter: "drop-shadow(0 0 8px color-mix(in oklab, #FFD700 50%, transparent))",
              }}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Right tower */}
        <div className="relative flex flex-col items-center" style={{ marginLeft: "-2px" }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "48px solid transparent",
              borderRight: "48px solid transparent",
              borderBottom: "60px solid #DC2626",
              filter: "drop-shadow(0 2px 4px color-mix(in oklab, black 40%, transparent))",
            }}
          />
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "76px",
              height: "130px",
              background:
                "linear-gradient(180deg, #D6D3D1, #E7E5E4 30%, #D6D3D1)",
              borderRadius: "4px 4px 2px 2px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "30px",
                borderRadius: "7px",
                background: "#1E90FF",
                boxShadow: "0 0 14px #1E90FF",
                opacity: 0.7,
              }}
            />
            <div
              className="absolute"
              style={{
                left: "10px",
                right: "10px",
                top: "50%",
                height: "1px",
                background: "color-mix(in oklab, black 25%, transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main castle wall */}
      <div
        className="absolute flex items-end gap-0"
        style={{ bottom: "80px", zIndex: 1 }}
      >
        {/* Left wing */}
        <div
          style={{
            width: "60px",
            height: "86px",
            background: "#D6D3D1",
            borderRadius: "3px 0 0 3px",
            borderRight: "1px solid color-mix(in oklab, black 15%, transparent)",
          }}
        />

        {/* Center wall */}
        <div
          className="relative flex items-end justify-center gap-8"
          style={{
            width: "190px",
            height: "108px",
            background:
              "linear-gradient(180deg, #D6D3D1, #E7E5E4 40%, #D6D3D1)",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "34px",
              borderRadius: "8px 8px 0 0",
              background: "#1E90FF",
              boxShadow: "0 0 16px color-mix(in oklab, #1E90FF 50%, transparent)",
              opacity: 0.65,
              marginBottom: "28px",
            }}
          />
          <div
            style={{
              width: "16px",
              height: "34px",
              borderRadius: "8px 8px 0 0",
              background: "#1E90FF",
              boxShadow: "0 0 16px color-mix(in oklab, #1E90FF 50%, transparent)",
              opacity: 0.65,
              marginBottom: "36px",
            }}
          />
          <div
            style={{
              width: "16px",
              height: "34px",
              borderRadius: "8px 8px 0 0",
              background: "#1E90FF",
              boxShadow: "0 0 16px color-mix(in oklab, #1E90FF 50%, transparent)",
              opacity: 0.65,
              marginBottom: "28px",
            }}
          />

          {/* Arched gate */}
          <div className="absolute flex flex-col items-center" style={{ bottom: 0 }}>
            <div
              style={{
                width: "52px",
                height: "32px",
                borderRadius: "26px 26px 0 0",
                background: "color-mix(in oklab, black 50%, transparent)",
                border: "1.5px solid #A8A29E",
                borderBottom: "none",
              }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                width: "52px",
                height: "34px",
                background: "color-mix(in oklab, #020617 85%, transparent)",
                borderLeft: "1.5px solid #A8A29E",
                borderRight: "1.5px solid #A8A29E",
                borderBottom: "1.5px solid #A8A29E",
                boxShadow:
                  "inset 0 0 20px color-mix(in srgb, #FFD700 12%, transparent), inset 0 0 40px color-mix(in srgb, #FFD700 4%, transparent)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, #FFD700 30%, transparent), transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right wing */}
        <div
          style={{
            width: "60px",
            height: "86px",
            background: "#D6D3D1",
            borderRadius: "0 3px 3px 0",
            borderLeft: "1px solid color-mix(in oklab, black 15%, transparent)",
          }}
        />
      </div>

      {/* Energy portal */}
      <div
        className="absolute kr-animate-pulse-glow"
        style={{
          bottom: "32px",
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          background: `radial-gradient(circle, color-mix(in oklab, white 35%, transparent) 0%, color-mix(in srgb, ${portalColor} 25%, transparent) 25%, color-mix(in srgb, ${portalColor} 6%, transparent) 55%, transparent 70%)`,
          boxShadow: `0 0 56px color-mix(in srgb, ${portalColor} 22%, transparent)`,
          zIndex: 3,
        }}
      />

      {/* Mission banner */}
      <div
        className="absolute"
        style={{
          bottom: "-36px",
          zIndex: 60,
          width: "360px",
        }}
      >
        <MissionBanner
          mission={currentMission}
          status={missionStatus}
        />
      </div>
    </div>
  );
}
