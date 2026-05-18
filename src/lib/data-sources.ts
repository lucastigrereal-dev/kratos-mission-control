export const DATA_SOURCES_MAP = {
  mission_lens:  { endpoint: "/mission/lens",      fallback: "/live/snapshot" },
  tasks:         { endpoint: "/tasks/today",       fallback: "mock" },
  projects:      { endpoint: "/projects",          fallback: "mock" },
  system:        { endpoint: "/live/snapshot",     fallback: "cached" },
  docker:        { endpoint: "/live/snapshot",     fallback: "cached" },
  git:           { endpoint: "/live/snapshot",     fallback: "cached" },
  checkpoints:   { endpoint: "/checkpoints",       fallback: "mock" },
  alerts:        { endpoint: "/alerts/active",     fallback: "cached" },
  context:       { endpoint: "/context/current",   fallback: "fallback" },
  mentor:        { endpoint: "/mentor/summary",    fallback: "computed" },
  drift:         { endpoint: "/context/lost",      fallback: "computed" },
} as const;

export type DataDomain = keyof typeof DATA_SOURCES_MAP;
export type FallbackType = "mock" | "cached" | "fallback" | "computed";
