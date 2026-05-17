/**
 * K22 — Health Utility Tests
 * Tests pure health derivation logic extracted to backend/lib/health-utils.ts
 * Bun-native, no jsdom.
 */

import { describe, it, expect } from "bun:test";
import { serviceHealthToSeverity, deriveLiveState } from "../../backend/lib/health-utils";

describe("serviceHealthToSeverity", () => {
  it("returns ok for healthy", () => expect(serviceHealthToSeverity("healthy")).toBe("ok"));
  it("returns ok for up", () => expect(serviceHealthToSeverity("up")).toBe("ok"));
  it("returns ok for ok", () => expect(serviceHealthToSeverity("ok")).toBe("ok"));
  it("returns ok for live", () => expect(serviceHealthToSeverity("live")).toBe("ok"));
  it("returns warn for degraded", () => expect(serviceHealthToSeverity("degraded")).toBe("warn"));
  it("returns critical for down", () => expect(serviceHealthToSeverity("down")).toBe("critical"));
  it("returns critical for failed", () => expect(serviceHealthToSeverity("failed")).toBe("critical"));
  it("returns critical for offline", () => expect(serviceHealthToSeverity("offline")).toBe("critical"));
  it("returns muted for unknown status", () => expect(serviceHealthToSeverity("unknown_xyz")).toBe("muted"));
});

describe("deriveLiveState", () => {
  it("returns live when all ok and no issues", () => {
    expect(deriveLiveState(3, 0, 0, 5, 0, 0)).toBe("live");
  });

  it("returns degraded when any critical", () => {
    expect(deriveLiveState(3, 0, 1, 5, 0, 0)).toBe("degraded");
    expect(deriveLiveState(3, 0, 0, 5, 0, 1)).toBe("degraded");
  });

  it("returns degraded when any warn", () => {
    expect(deriveLiveState(3, 1, 0, 5, 0, 0)).toBe("degraded");
    expect(deriveLiveState(3, 0, 0, 5, 1, 0)).toBe("degraded");
  });

  it("returns offline when no ok services at all", () => {
    expect(deriveLiveState(0, 0, 0, 0, 0, 0)).toBe("offline");
  });

  it("crit takes priority over warn", () => {
    expect(deriveLiveState(3, 2, 1, 0, 0, 0)).toBe("degraded");
  });

  it("only kratos ok is enough for live", () => {
    expect(deriveLiveState(1, 0, 0, 0, 0, 0)).toBe("live");
  });

  it("only omnis ok is enough for live", () => {
    expect(deriveLiveState(0, 0, 0, 1, 0, 0)).toBe("live");
  });
});
