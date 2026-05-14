interface SectionTitleProps {
  children: string;
  action?: string;
  onAction?: () => void;
  subtitle?: string;
  divider?: boolean;
}

export default function SectionTitle({ children, action, onAction, subtitle, divider = false }: SectionTitleProps) {
  return (
    <div className={`kr-section-title-wrap${divider ? " kr-section-title-wrap--divider" : ""}`}>
      <div className="kr-section-title-header">
        <h6 className="kr-section-title">{children}</h6>
        {action && onAction && (
          <button className="kr-section-title-action" onClick={onAction} type="button">
            {action}
          </button>
        )}
      </div>
      {subtitle && <p className="kr-section-title-sub">{subtitle}</p>}
      {divider && <div className="kr-section-title-divider" />}
    </div>
  );
}
