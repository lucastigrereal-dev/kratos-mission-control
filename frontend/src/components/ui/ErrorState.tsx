type ErrorSeverity = "warning" | "error" | "info";

interface ErrorStateProps {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  severity?: ErrorSeverity;
}

const ICON_MAP: Record<ErrorSeverity, string> = {
  error: "⚠",
  warning: "⚡",
  info: "ℹ",
};

const TONE_MAP: Record<ErrorSeverity, string> = {
  error: "kr-error-state--danger",
  warning: "kr-error-state--warning",
  info: "kr-error-state--info",
};

export default function ErrorState({ title, description, retryLabel, onRetry, severity = "error" }: ErrorStateProps) {
  return (
    <div className={`kr-error-state ${TONE_MAP[severity]}`} role="alert">
      <span className="kr-error-state-icon" aria-hidden="true">{ICON_MAP[severity]}</span>
      <h3 className="kr-error-state-title">{title}</h3>
      {description && <p className="kr-error-state-desc">{description}</p>}
      {retryLabel && onRetry && (
        <button className="kr-error-state-retry" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
