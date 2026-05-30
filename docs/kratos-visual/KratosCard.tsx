import React from 'react';
import GlassPanel from './GlassPanel';

interface KratosCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'strong' | 'light' | 'deep';
  style?: React.CSSProperties;
}

export default function KratosCard({
  children,
  className = '',
  title,
  variant = 'default',
  style
}: KratosCardProps) {
  return (
    <GlassPanel
      className={`kr-card ${className}`.trim()}
      variant={variant}
      style={style}
    >
      {title && (
        <h3 className="kr-section-title" style={{ marginTop: 0 }}>
          {title}
        </h3>
      )}
      {children}
    </GlassPanel>
  );
}