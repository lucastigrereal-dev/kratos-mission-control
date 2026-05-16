import CardShell from "../ui/CardShell";

export default function QuoteCard() {
  return (
    <CardShell title="CITAÇÃO DO DIA">
      <div style={{ fontSize: 12, color: "#e2e8f0", fontStyle: "italic", lineHeight: 1.5, marginBottom: 6 }}>
        "Disciplina é a ponte entre meta e realização."
      </div>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>
        — Jim Rohn
      </div>
    </CardShell>
  );
}
