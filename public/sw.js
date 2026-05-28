/**
 * KRATOS Service Worker — W14
 *
 * Strategy:
 *  - Shell (HTML): network-first with cache fallback (offline.html)
 *  - Static assets (/_build/, /assets/): cache-first, immutable
 *  - API routes (/api/): network-only (never cache sensitive data)
 *  - SSE (/live/): network-only (streaming, no cache)
 *  - Everything else: network-first with stale cache fallback
 */

const CACHE_VERSION = "kratos-v1";
const SHELL_CACHE   = `${CACHE_VERSION}-shell`;
const ASSET_CACHE   = `${CACHE_VERSION}-assets`;

const SHELL_URLS = [
  "/",
  "/agora",
  "/agenda",
  "/checkpoints",
  "/projetos",
  "/sistema",
];

const NEVER_CACHE = ["/api/", "/live/"];

// ── Install: pre-cache shell ─────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_URLS).catch(() => {
        // Non-fatal: shell pages may not exist at install time in SSR setup
      })
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ───────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ──────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const path = url.pathname;

  // Never cache API or SSE streams
  if (NEVER_CACHE.some((prefix) => path.startsWith(prefix))) return;

  // Static assets: cache-first (Vite chunks are content-hashed = immutable)
  if (
    path.startsWith("/_build/") ||
    path.startsWith("/assets/") ||
    /\.(js|css|woff2?|png|svg|ico|webp|avif)(\?.*)?$/.test(path)
  ) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Navigation (HTML): network-first with shell cache fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Default: network-first, stale cache as fallback
  event.respondWith(networkFirst(request, SHELL_CACHE));
});

// ── Strategy helpers ─────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Asset offline", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request, { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Offline", { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request, { signal: AbortSignal.timeout(6000) });
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try cached version first
    const cached = await caches.match(request) ?? await caches.match("/");
    if (cached) return cached;
    // Last resort: minimal offline response
    return new Response(
      `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>KRATOS — Offline</title>
      <style>body{background:#030B19;color:#E2E8F0;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;flex-direction:column;gap:1rem;text-align:center}
      h1{font-size:1.5rem;color:#3B82F6}p{color:#64748B;max-width:300px}</style>
      </head><body>
      <h1>KRATOS</h1>
      <p>Sem conexão. O cockpit voltará quando a rede estiver disponível.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
