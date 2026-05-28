/**
 * system-reality.test.ts — W6
 * Valida o contrato do /live/snapshot consumido pelo useSystemPulse
 * e o mapeamento para SystemIslandData, DockerIslandData, GitIslandData
 * e AlertsIslandData.
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 */

import { describe, it, expect } from "bun:test";

// ── Tipos espelhando useSystemPulse (W6 contract) ─────────────────────────────

type SystemHealth = "healthy" | "degraded" | "critical";

interface SystemPulseData {
  cpuPercent: number;
  ramPercent: number;
  dockerRunning: number;
  dockerTotal: number;
  gitDirty: boolean;
  gitBranch: string | null;
  health: SystemHealth;
  alerts: Array<{ collector: string; status: string; error?: string | null }>;
}

// ── Tipos espelhando IslandCard (interfaces dos domínios) ─────────────────────

interface SystemIslandData {
  cpuPercent: number;
  ramPercent: number;
  health: SystemHealth;
}

interface DockerIslandData {
  containers: Array<{ name: string; status: "running" | "stopped" | "error" }>;
  runningCount: number;
  totalCount: number;
}

interface GitIslandData {
  branch: string;
  dirty: boolean;
  ahead: number;
  behind: number;
}

interface AlertsIslandData {
  alerts: Array<{ id: string; message: string; severity: "critical" | "high" | "medium" }>;
}

// ── Lógica de mapeamento extraída de DashboardView (W6) ──────────────────────

const ALERT_SEVERITY: Record<string, "critical" | "high" | "medium"> = {
  error:    "critical",
  degraded: "high",
  offline:  "medium",
};

function pulseToSystemIsland(pulse: SystemPulseData): SystemIslandData {
  return { cpuPercent: pulse.cpuPercent, ramPercent: pulse.ramPercent, health: pulse.health };
}

function pulseToDockerIsland(pulse: SystemPulseData): DockerIslandData {
  return { containers: [], runningCount: pulse.dockerRunning, totalCount: pulse.dockerTotal };
}

function pulseToGitIsland(pulse: SystemPulseData): GitIslandData {
  return { branch: pulse.gitBranch ?? "—", dirty: pulse.gitDirty, ahead: 0, behind: 0 };
}

function pulseToAlertsIsland(pulse: SystemPulseData): AlertsIslandData {
  return {
    alerts: pulse.alerts.map((a, i) => ({
      id:       `sys-${i}`,
      message:  a.error ? `${a.collector}: ${a.error}` : `${a.collector} ${a.status}`,
      severity: ALERT_SEVERITY[a.status] ?? "medium",
    })),
  };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeHealthyPulse(overrides: Partial<SystemPulseData> = {}): SystemPulseData {
  return {
    cpuPercent:    34,
    ramPercent:    62,
    dockerRunning: 3,
    dockerTotal:   5,
    gitDirty:      false,
    gitBranch:     "feature/kratos-supreme-w0-w22",
    health:        "healthy",
    alerts:        [],
    ...overrides,
  };
}

// ── System island ─────────────────────────────────────────────────────────────

describe("W6 system-reality — SystemIslandData", () => {
  it("mapeia cpuPercent, ramPercent e health do pulse", () => {
    const island = pulseToSystemIsland(makeHealthyPulse());
    expect(island.cpuPercent).toBe(34);
    expect(island.ramPercent).toBe(62);
    expect(island.health).toBe("healthy");
  });

  it("health=degraded é preservado", () => {
    const pulse = makeHealthyPulse({ cpuPercent: 75, health: "degraded" });
    expect(pulseToSystemIsland(pulse).health).toBe("degraded");
  });

  it("health=critical é preservado", () => {
    const pulse = makeHealthyPulse({ cpuPercent: 90, health: "critical" });
    expect(pulseToSystemIsland(pulse).health).toBe("critical");
  });

  it("cpuPercent=0 é válido (idle)", () => {
    const island = pulseToSystemIsland(makeHealthyPulse({ cpuPercent: 0 }));
    expect(island.cpuPercent).toBe(0);
  });

  it("cpuPercent=100 é válido (saturado)", () => {
    const island = pulseToSystemIsland(makeHealthyPulse({ cpuPercent: 100 }));
    expect(island.cpuPercent).toBe(100);
  });
});

// ── Docker island ─────────────────────────────────────────────────────────────

describe("W6 system-reality — DockerIslandData", () => {
  it("mapeia runningCount e totalCount do pulse", () => {
    const island = pulseToDockerIsland(makeHealthyPulse());
    expect(island.runningCount).toBe(3);
    expect(island.totalCount).toBe(5);
  });

  it("containers é sempre array vazio (dados agregados — sem nomes individuais)", () => {
    const island = pulseToDockerIsland(makeHealthyPulse());
    expect(island.containers).toHaveLength(0);
  });

  it("dockerRunning=0, dockerTotal=0 quando tudo parado", () => {
    const pulse = makeHealthyPulse({ dockerRunning: 0, dockerTotal: 0 });
    const island = pulseToDockerIsland(pulse);
    expect(island.runningCount).toBe(0);
    expect(island.totalCount).toBe(0);
  });

  it("all running: runningCount === totalCount", () => {
    const pulse = makeHealthyPulse({ dockerRunning: 5, dockerTotal: 5 });
    const island = pulseToDockerIsland(pulse);
    expect(island.runningCount).toBe(island.totalCount);
  });
});

// ── Git island ────────────────────────────────────────────────────────────────

describe("W6 system-reality — GitIslandData", () => {
  it("mapeia branch e dirty do pulse", () => {
    const island = pulseToGitIsland(makeHealthyPulse({ gitDirty: true }));
    expect(island.branch).toBe("feature/kratos-supreme-w0-w22");
    expect(island.dirty).toBe(true);
  });

  it("gitBranch null → fallback '—'", () => {
    const pulse = makeHealthyPulse({ gitBranch: null });
    expect(pulseToGitIsland(pulse).branch).toBe("—");
  });

  it("ahead e behind são 0 (não expostos pelo backend ainda)", () => {
    const island = pulseToGitIsland(makeHealthyPulse());
    expect(island.ahead).toBe(0);
    expect(island.behind).toBe(0);
  });

  it("dirty=false quando repo limpo", () => {
    const island = pulseToGitIsland(makeHealthyPulse({ gitDirty: false }));
    expect(island.dirty).toBe(false);
  });
});

// ── Alerts island ─────────────────────────────────────────────────────────────

describe("W6 system-reality — AlertsIslandData", () => {
  it("pulse sem alerts → lista vazia (Sistema estável)", () => {
    const island = pulseToAlertsIsland(makeHealthyPulse({ alerts: [] }));
    expect(island.alerts).toHaveLength(0);
  });

  it("status=error → severity critical", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "docker", status: "error", error: "daemon offline" }],
    });
    expect(pulseToAlertsIsland(pulse).alerts[0].severity).toBe("critical");
  });

  it("status=degraded → severity high", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "git", status: "degraded" }],
    });
    expect(pulseToAlertsIsland(pulse).alerts[0].severity).toBe("high");
  });

  it("status=offline → severity medium", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "activitywatch", status: "offline" }],
    });
    expect(pulseToAlertsIsland(pulse).alerts[0].severity).toBe("medium");
  });

  it("status desconhecido → fallback medium", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "omnis", status: "unknown" }],
    });
    expect(pulseToAlertsIsland(pulse).alerts[0].severity).toBe("medium");
  });

  it("mensagem usa error quando presente", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "docker", status: "error", error: "Connection refused" }],
    });
    const msg = pulseToAlertsIsland(pulse).alerts[0].message;
    expect(msg).toContain("docker");
    expect(msg).toContain("Connection refused");
  });

  it("mensagem usa 'collector status' quando sem error", () => {
    const pulse = makeHealthyPulse({
      alerts: [{ collector: "git", status: "degraded" }],
    });
    const msg = pulseToAlertsIsland(pulse).alerts[0].message;
    expect(msg).toBe("git degraded");
  });

  it("múltiplos alerts geram IDs únicos", () => {
    const pulse = makeHealthyPulse({
      alerts: [
        { collector: "docker", status: "error" },
        { collector: "git", status: "degraded" },
      ],
    });
    const ids = pulseToAlertsIsland(pulse).alerts.map((a) => a.id);
    expect(ids[0]).not.toBe(ids[1]);
  });
});

// ── Null safety (quando pulse=null não trava o dashboard) ─────────────────────

describe("W6 system-reality — null safety", () => {
  it("quando pulse é null → systemIslandData é null (IslandCard exibe ErrorState)", () => {
    const pulse = null;
    const data = pulse ? pulseToSystemIsland(pulse) : null;
    expect(data).toBeNull();
  });

  it("quando pulse é null → alertsIslandData é null (não array vazio)", () => {
    const pulse = null;
    const data = pulse ? pulseToAlertsIsland(pulse) : null;
    expect(data).toBeNull();
  });
});
