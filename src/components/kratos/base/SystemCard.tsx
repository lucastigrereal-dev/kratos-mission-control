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
    borderRadius: 10,
    transition:
      "background 180ms ease, border-color 180ms ease, transform 180ms ease",
    ...style,
  };
  return (
    <div
      {...rest}
      className={`${padded ? "p-5" : ""} kratos-card-elevated ${
        interactive ? "kratos-card-hover cursor-pointer" : ""
      } kratos-fadein ${className}`}
      style={merged}
    >
      {children}
    </div>
  );
}
