import IconGlyph from "../ui/IconGlyph";

interface NavItemProps {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavItem({ label, icon, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        minHeight: 44,
        padding: "10px 16px",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? "#e2e8f0" : "#cbd5e1",
        background: active ? "rgba(56, 189, 248, 0.12)" : "transparent",
        borderLeft: active ? "3px solid #38bdf8" : "3px solid transparent",
        transition: "background 0.15s, color 0.15s",
        textAlign: "left" as const,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(148, 163, 184, 0.08)";
          e.currentTarget.style.color = "#e2e8f0";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#cbd5e1";
        }
      }}
    >
      <IconGlyph name={icon} size={20} />
      <span>{label}</span>
    </button>
  );
}
