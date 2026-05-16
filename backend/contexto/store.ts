import type { ContextSnapshot } from "../../api-contract/contexto.schema";

let latest: ContextSnapshot;

function nowISO(): string {
  return new Date().toISOString();
}

function seed(): ContextSnapshot {
  const ts = nowISO();
  return {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    capturedAt: ts,
    project: "KRATOS",
    mission: "W05 — Contexto data/API/UI com telemetria observada.",
    app: "Claude Code",
    window: "KRATOS Mission Control",
    focusStatus: "on_focus",
    confidence: 86,
    drift: "light",
    driftMinutes: 18,
    activeWindowApp: "Claude Code",
    activeWindowTitle: "KRATOS Mission Control · /contexto",
    activeWindowDomain: "kratos.local",
    activeWindowDuration: "42 min",
    reasons: [
      "Detectado pela rota /contexto e título da janela.",
      "Projeto KRATOS marcado como ativo na sessão.",
      "Última ação registrada foi no W04.",
    ],
    browserTabs: [
      {
        title: "KRATOS Mission Control · /contexto",
        domain: "kratos.local",
        project: "KRATOS",
        status: "active",
      },
      {
        title: "Plano da W06 (rascunho)",
        domain: "notion.so",
        project: "KRATOS · Planejamento",
        status: "idle",
      },
    ],
  };
}

export function getLatest(): ContextSnapshot {
  if (!latest) {
    latest = seed();
    latest.capturedAt = nowISO();
  }
  return { ...latest, capturedAt: nowISO() };
}

export function refresh(): ContextSnapshot {
  latest = seed();
  latest.capturedAt = nowISO();
  return { ...latest };
}
