import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  padded?: boolean;
};

export function SystemCard({
  children,
  interactive = false,
  padded = true,
  className = "",
  style,
  ...rest
}: Props) {
  const merged: CSSProperties = {
    background: "var(--kratos-surface-2)",
    border: "1px solid var(--kratos-border)",
    borderRadius: 8,
    transition: interactive
      ? "background 180ms ease, border-color 180ms ease, transform 180ms ease"
      : undefined,
    ...style,
  };
  return (
    <div
      {...rest}
      className={`${padded ? "p-4" : ""} ${
        interactive ? "kratos-card-hover cursor-pointer" : ""
      } kratos-fadein ${className}`}
      style={merged}
    >
      {children}
    </div>
  );
}
