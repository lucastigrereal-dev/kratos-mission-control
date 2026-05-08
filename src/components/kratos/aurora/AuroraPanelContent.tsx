import { StatusDot } from "@/components/kratos/base/StatusDot";
import { AuroraMessagePreview } from "./AuroraMessagePreview";
import { AuroraQuickActions } from "./AuroraQuickActions";
import { AuroraInputMock } from "./AuroraInputMock";

const MOCK_AURORA = {
  greeting: "Bom te ver de volta.",
  state: "Observando contexto",
  message:
    "Você está no meio do Crédito 4. Não abra outra frente antes de validar contexto e checkpoints.",
};

export function AuroraPanelContent() {
  return (
    <>
      <div className="flex-1 overflow-y-auto kratos-scrollbar p-4 space-y-4">
        <div>
          <div
            className="text-[13px] font-medium"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {MOCK_AURORA.greeting}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StatusDot severity="ghost" size="xs" pulse />
            <span
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {MOCK_AURORA.state}
            </span>
          </div>
        </div>

        <AuroraMessagePreview message={MOCK_AURORA.message} />

        <div>
          <div
            className="mb-2 text-[10px] kratos-mono uppercase tracking-[0.15em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Ações rápidas
          </div>
          <AuroraQuickActions />
        </div>
      </div>

      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <AuroraInputMock />
      </div>
    </>
  );
}
