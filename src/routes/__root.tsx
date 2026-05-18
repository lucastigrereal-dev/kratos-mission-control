import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import tokensCss from "../styles/kratos-tokens.css?url";
import { AppShell } from "@/components/kratos/shell/AppShell";
import { ReducedMotionProvider } from "@/components/kratos/base/ReducedMotionProvider";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--kratos-surface-0)" }}
    >
      <div className="max-w-md text-center">
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.2em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          KRATOS · 404
        </div>
        <h1
          className="text-5xl font-semibold"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          Rota não encontrada
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          A página que você procura não existe neste sandbox visual.
        </p>
        <div className="mt-6">
          <Link
            to="/agora"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--kratos-accent)",
              color: "var(--kratos-surface-0)",
            }}
          >
            Voltar para Agora
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--kratos-surface-0)" }}
    >
      <div className="max-w-md text-center">
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          Esta tela não carregou
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Algo falhou no shell visual. Tente recarregar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--kratos-accent)",
              color: "var(--kratos-surface-0)",
            }}
          >
            Tentar de novo
          </button>
          <a
            href="/agora"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--kratos-surface-2)",
              border: "1px solid var(--kratos-border)",
              color: "var(--kratos-text-primary)",
            }}
          >
            Voltar para Agora
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "dark" },
      { title: "KRATOS · Mission Control" },
      {
        name: "description",
        content:
          "Cockpit operacional local-first — foco, próxima ação, alertas e deadlines em uma só tela.",
      },
      { name: "author", content: "KRATOS" },
      { property: "og:title", content: "KRATOS · Mission Control" },
      {
        property: "og:description",
        content:
          "Cockpit operacional local-first — foco, próxima ação, alertas e deadlines em uma só tela.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: tokensCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWorld = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <ReducedMotionProvider>
        {isWorld ? (
          <Outlet />
        ) : (
          <AppShell>
            <Outlet />
          </AppShell>
        )}
      </ReducedMotionProvider>
    </QueryClientProvider>
  );
}
