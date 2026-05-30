import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'light' | 'deep';
  style?: React.CSSProperties;
}

export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  style
}: GlassPanelProps) {
  const variantClass = variant !== 'default' ? `kr-glass-panel--${variant}` : '';

  return (
    <div
      className={`kr-glass-panel ${variantClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}