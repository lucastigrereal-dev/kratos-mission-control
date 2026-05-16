import CardShell from "../ui/CardShell";

const ITEMS = [
  "3 tarefas importantes",
  "2 projetos em andamento",
  "1 reunião marcada",
  "Foco principal: Construir o futuro",
];

export default function FocusDayCard() {
  return (
    <CardShell title="FOCO DO DIA">
      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, color: "#e2e8f0", lineHeight: 1.6 }}>
        {ITEMS.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </CardShell>
  );
}
