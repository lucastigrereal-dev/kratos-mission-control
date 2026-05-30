/**
 * KRATOS Test Setup — Anti-Freeze Global Mock
 *
 * REGRA ANTI-TRAVAMENTO:
 * Testes NUNCA chamam APIs reais (omnis-server, GitHub, SSE, qualquer rede externa).
 * Este arquivo é carregado antes de todos os testes via bunfig.toml [test].preload.
 *
 * O que faz:
 * — Intercepta globalThis.fetch
 * — Qualquer chamada a host externo (não localhost/127.0.0.1) retorna 503 instantaneamente
 * — Sem esperar timeout de rede → testes rodam em ms, não em segundos
 * — Fallbacks internos (MOCK_REPOS, in-memory stores) ativam corretamente
 *
 * Exceções (localhost/127.0.0.1): permitidas para testes de integração local.
 * SSE/EventSource: não existe nos testes unitários — sempre mockar no nível do hook.
 */

const _realFetch = globalThis.fetch;

const mockFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : (input as Request).url ?? "";

  // Permite chamadas locais (integração local se necessário)
  if (
    url.startsWith("http://localhost") ||
    url.startsWith("http://127.0.0.1") ||
    url.startsWith("https://localhost")
  ) {
    return _realFetch(input, init);
  }

  // Bloqueia todas as chamadas externas — retorna erro imediato sem esperar rede
  // Isso faz o backend/github/store.ts cair no fallback MOCK_REPOS sem delay
  console.debug(`[test:mock-fetch] Bloqueado (externo): ${url.slice(0, 80)}`);
  return new Response(
    JSON.stringify({ error: "blocked_in_tests", url: url.slice(0, 80) }),
    {
      status: 503,
      statusText: "Service Unavailable (test mock)",
      headers: { "Content-Type": "application/json" },
    },
  );
};

globalThis.fetch = Object.assign(mockFetch, {
  preconnect: () => undefined,
}) as typeof fetch;

// Restaurar fetch real ao final (por precaução — bun isola workers mas não custa)
// afterAll(() => { globalThis.fetch = _realFetch; });
// Nota: não exportamos nada — este arquivo é efeito colateral puro (preload)
