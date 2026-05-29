import { useEffect, useState } from "react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { useIslandDock } from "./shared/IslandDockContext";
import { useAkashaStatus, useAkashaSearch, useAkashaCollections } from "@/hooks/useAkasha";
import { AkashaSearchPanel } from "@/components/kratos/akasha/AkashaSearchPanel";
import type { AkashaStatusData } from "@/lib/akasha-server-fns";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Database,
  Activity,
  Server,
  BadgeCheck,
  BadgeAlert,
  BadgeX,
  Search,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function vaultStatusLabel(status: AkashaStatusData["vault_status"]): string {
  if (status === "healthy") return "Saudável";
  if (status === "degraded") return "Degradado";
  return "Offline";
}

function vaultStatusColor(status: AkashaStatusData["vault_status"]): string {
  if (status === "healthy") return "var(--kratos-ok)";
  if (status === "degraded") return "var(--kratos-warn)";
  return "var(--kratos-critical)";
}

function sourceBadgeLabel(badge: AkashaStatusData["source_badge"]): string {
  if (badge === "confirmed") return "Confirmado";
  if (badge === "partial") return "Parcial";
  return "Offline";
}

function sourceBadgeColor(badge: AkashaStatusData["source_badge"]): string {
  if (badge === "confirmed") return "var(--kratos-ok)";
  if (badge === "partial") return "var(--kratos-warn)";
  return "var(--kratos-critical)";
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return ts;
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

function VaultCrystal() {
  return (
    <div className="flex justify-center mb-2">
      <div
        className="relative"
        style={{ animation: "kratos-float-medium 5s ease-in-out infinite" }}
      >
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--kr-accent-emerald, #10B981) 30%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="h-16 w-16 relative"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "linear-gradient(135deg, var(--kr-accent-emerald), var(--kr-island-akasha), var(--kr-accent-green-light, #34D399))",
            boxShadow: "0 0 30px color-mix(in srgb, var(--kr-accent-cyan-bright) 50%, transparent), 0 0 60px color-mix(in srgb, var(--kr-accent-cyan) 20%, transparent)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

interface VaultStatusPanelProps {
  data: AkashaStatusData;
}

function VaultStatusPanel({ data }: VaultStatusPanelProps) {
  const color = vaultStatusColor(data.vault_status);
  const VaultIcon =
    data.vault_status === "healthy"
      ? ShieldCheck
      : data.vault_status === "degraded"
        ? ShieldAlert
        : ShieldX;

  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            boxShadow: `0 0 20px color-mix(in srgb, ${color} 30%, transparent)`,
          }}
        >
          <VaultIcon className="h-5 w-5" style={{ color }} aria-hidden />
        </div>
        <div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Vault {vaultStatusLabel(data.vault_status)}
          </p>
          <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
            Status do armazém de conhecimento
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* PostgreSQL */}
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--kr-island-akasha) 12%, transparent)" }}
          >
            <Database className="h-4 w-4" style={{ color: "var(--kr-accent-green-light)" }} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
              PostgreSQL / pgvector
            </p>
            <p
              className="text-[10px] kratos-mono uppercase"
              style={{ color: data.postgres ? "var(--kratos-ok)" : "var(--kratos-critical)" }}
            >
              {data.postgres ? "Respondendo" : "Inacessível"}
            </p>
          </div>
        </div>

        {/* Bridge */}
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb, var(--kr-island-akasha) 12%, transparent)" }}
          >
            <Activity className="h-4 w-4" style={{ color: "var(--kr-accent-cyan)" }} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
              Bridge
            </p>
            <p className="text-[10px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
              {data.bridge_status}
            </p>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function SourcePanel({ data }: { data: AkashaStatusData }) {
  const badgeColor = sourceBadgeColor(data.source_badge);
  const BadgeIcon =
    data.source_badge === "confirmed"
      ? BadgeCheck
      : data.source_badge === "partial"
        ? BadgeAlert
        : BadgeX;

  return (
    <div className="space-y-4">
      <GlassPanel padding="md">
        <div className="flex items-center gap-2 mb-1">
          <BadgeIcon className="h-4 w-4" style={{ color: badgeColor }} aria-hidden />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: badgeColor }}
          >
            {sourceBadgeLabel(data.source_badge)}
          </span>
        </div>
        <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          Confiabilidade da fonte
        </p>
      </GlassPanel>

      <GlassPanel padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Server className="h-4 w-4" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
          <span className="kratos-eyebrow text-[10px]" style={{ color: "var(--kratos-text-secondary)" }}>
            Container
          </span>
        </div>
        <p className="text-[12px] kratos-mono truncate" style={{ color: "var(--kratos-text-primary)" }}>
          {data.container_name ?? "—"}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "var(--kratos-text-muted)" }}>
          Última leitura: {formatTimestamp(data.timestamp)}
        </p>
      </GlassPanel>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export function AkashaScreen() {
  const { data, isLoading, isError, error } = useAkashaStatus();
  const { setData } = useIslandDock();
  const [searchCollection, setSearchCollection] = useState<string | undefined>(undefined);
  const searchState = useAkashaSearch(6, searchCollection);
  const { collections } = useAkashaCollections();

  // Re-run search when collection filter changes (if query is active)
  useEffect(() => {
    if (searchState.query.trim().length >= 3 && searchState.hasSearched) {
      searchState.search(searchState.query.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCollection]);

  useEffect(() => {
    if (!data) return;
    const isHealthy = data.vault_status === "healthy";
    const isDegraded = data.vault_status === "degraded";
    setData({
      islandId: "akasha",
      label: "Vault",
      value: isHealthy ? "Saudável" : isDegraded ? "Degradado" : "Offline",
      progress: isHealthy ? 100 : isDegraded ? 50 : 0,
      progressColor: "var(--kr-island-akasha)",
      quickActions: [{ label: "Buscar" }, { label: "Sync" }],
    });
  }, [data, setData]);

  return (
    <IslandPageFrame theme="akasha">
      {isLoading ? (
        <LoadingState lines={6} />
      ) : isError ? (
        <ErrorState
          title="Akasha inacessível"
          description={error?.message ?? "Não foi possível conectar ao backend"}
          variant="external_unavailable"
        />
      ) : (
        <>
          <IslandPageHeader
            title="AKASHA / GRINGOTTS"
            subtitle="Banco de Conhecimento, Memória e Arquivos"
            theme="akasha"
          />

          <VaultCrystal />

          {/* Search panel — primary action W13 */}
          <KratosCard header={<SectionTitle icon={Search} title="Busca Semântica no Vault" />}>
            <AkashaSearchPanel
              searchState={searchState}
              collections={collections}
              selectedCollection={searchCollection}
              onCollectionChange={setSearchCollection}
            />
          </KratosCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {data ? (
              <>
                <VaultStatusPanel data={data} />
                <SourcePanel data={data} />
              </>
            ) : (
              <div className="col-span-2">
                <GlassPanel padding="md">
                  <div className="flex items-center gap-3">
                    <ShieldX className="h-5 w-5" style={{ color: "var(--kratos-critical)" }} aria-hidden />
                    <p className="text-[13px]" style={{ color: "var(--kratos-text-secondary)" }}>
                      Backend Akasha não está respondendo. Verifique o container{" "}
                      <span className="kratos-mono">akasha-postgres</span>.
                    </p>
                  </div>
                </GlassPanel>
              </div>
            )}
          </div>
        </>
      )}
    </IslandPageFrame>
  );
}
