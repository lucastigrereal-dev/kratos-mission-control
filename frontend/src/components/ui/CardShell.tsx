interface CardShellProps {
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function CardShell({ title, children, style }: CardShellProps) {
  return (
    <div style={{ ...cardBase, ...style }}>
      {title && <div style={titleStyle}>{title}</div>}
      {children}
    </div>
  );
}

export const cardBase: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.7)",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "12px 14px",
};

export const titleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#cbd5e1",
  letterSpacing: "0.08em",
  marginBottom: 6,
};
