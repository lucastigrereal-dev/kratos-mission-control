import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--kr-bg-abyss)",
          color: "var(--kr-text-primary)",
          padding: "2rem",
          gap: "var(--kr-space-section)",
        }}>
          <div style={{ fontSize: "var(--kr-text-display)", fontWeight: 700 }}>
            Algo deu errado
          </div>
          <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-muted)", textAlign: "center", maxWidth: 480 }}>
            {this.state.error?.message ?? "Erro inesperado"}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--kr-radius-md)",
              border: "none",
              background: "var(--kr-azure-500)",
              color: "var(--kr-text-primary)",
              fontSize: "var(--kr-text-sm)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recarregar KRATOS
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
