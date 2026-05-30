import React from 'react';

type StatusVariant = 'healthy' | 'degraded' | 'critical' | 'offline' | 'stale' | 'info' | 'neutral';

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  healthy: 'kr-chip-healthy',
  degraded: 'kr-chip-degraded',
  critical: 'kr-chip-critical',
  offline: 'kr-chip-offline',
  stale: 'kr-chip-degraded',
  info: 'kr-chip-info',
  neutral: 'kr-chip-neutral',
};

export default function StatusChip({
  label,
  variant = 'neutral',
  className = ''
}: StatusChipProps) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral;

  return (
    <span className={`kr-chip ${variantClass} ${className}`.trim()}>
      {label}
    </span>
  );
}