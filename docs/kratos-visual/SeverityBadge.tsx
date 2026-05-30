import React from 'react';

type SeverityLevel = 'healthy' | 'degraded' | 'critical' | 'offline' | 'stale' | 'info';

interface SeverityBadgeProps {
  label: string;
  level?: SeverityLevel;
  className?: string;
}

const LEVEL_CLASSES: Record<SeverityLevel, string> = {
  healthy: 'kr-status-badge--live',
  degraded: 'kr-status-badge--degraded',
  critical: 'kr-status-badge--critical',
  offline: 'kr-status-badge--offline',
  stale: 'kr-status-badge--stale',
  info: 'kr-status-badge--live',
};

export default function SeverityBadge({
  label,
  level = 'info',
  className = ''
}: SeverityBadgeProps) {
  const levelClass = LEVEL_CLASSES[level] || LEVEL_CLASSES.info;

  return (
    <span className={`kr-status-badge ${levelClass} ${className}`.trim()}>
      {label}
    </span>
  );
}