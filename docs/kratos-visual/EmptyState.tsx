import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "◇",
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`kr-empty-state ${className}`.trim()}>
      <span className="kr-empty-state-icon" aria-hidden="true">{icon}</span>
      <h3 className="kr-empty-state-title">{title}</h3>
      {description && <p className="kr-empty-state-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="kr-empty-state-action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}