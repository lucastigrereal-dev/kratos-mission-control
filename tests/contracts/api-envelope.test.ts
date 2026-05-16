import { describe, it, expect } from "bun:test";

interface Envelope<T> {
  data: T | null;
  error: string | null;
}

function isEnvelope(value: unknown): value is Envelope<unknown> {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return "data" in obj && "error" in obj;
}

describe("API envelope contract", () => {
  it("valid envelope is recognized", () => {
    expect(isEnvelope({ data: "ok", error: null })).toBe(true);
    expect(isEnvelope({ data: null, error: "fail" })).toBe(true);
    expect(isEnvelope({ data: [], error: null })).toBe(true);
  });

  it("invalid shapes are rejected", () => {
    expect(isEnvelope({ data: "x" })).toBe(false);
    expect(isEnvelope({ error: "x" })).toBe(false);
    expect(isEnvelope({})).toBe(false);
    expect(isEnvelope(null)).toBe(false);
    expect(isEnvelope("string")).toBe(false);
    expect(isEnvelope(undefined)).toBe(false);
  });

  it("error field is always string | null", () => {
    const valid1: Envelope<string> = { data: "x", error: null };
    const valid2: Envelope<null> = { data: null, error: "msg" };
    expect(typeof valid1.error === "string" || valid1.error === null).toBe(true);
    expect(typeof valid2.error === "string" || valid2.error === null).toBe(true);
  });

  it("envelope type constrains data to T | null", () => {
    const withData: Envelope<number> = { data: 42, error: null };
    const withoutData: Envelope<number> = { data: null, error: "gone" };
    expect(withData.data).toBe(42);
    expect(withoutData.data).toBeNull();
  });
});
