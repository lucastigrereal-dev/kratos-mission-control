import CardShell from "../ui/CardShell";

export default function ProgressCard() {
  return (
    <CardShell title="PROGRESSO GERAL">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="52" height="52" viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
          <circle cx="26" cy="26" r="22" fill="none" stroke="#334155" strokeWidth="4" />
          <circle
            cx="26" cy="26" r="22"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray={`${(78 / 100) * 138.23} 138.23`}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
          />
          <text
            x="26" y="26"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#e2e8f0"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            78%
          </text>
        </svg>
        <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.4 }}>
          Do mês concluído
        </div>
      </div>
    </CardShell>
  );
}
