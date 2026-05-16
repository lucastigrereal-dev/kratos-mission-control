import CardShell from "../ui/CardShell";

const EVENTS = [
  { time: "10:00", title: "Reunião Omnis Lab" },
  { time: "14:30", title: "Call Comercial" },
  { time: "16:00", title: "Tempo com Laura e Apolo" },
];

export default function AgendaTodayCard() {
  return (
    <CardShell title="AGENDA DE HOJE">
      {EVENTS.map((ev, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 8,
            fontSize: 11,
            padding: "3px 0",
            color: "#cbd5e1",
          }}
        >
          <span style={{ color: "#64748b", fontVariantNumeric: "tabular-nums", flexShrink: 0, width: 34 }}>
            {ev.time}
          </span>
          <span>{ev.title}</span>
        </div>
      ))}
      <button
        onClick={() => console.log("Agenda: open full agenda")}
        aria-label="Ver agenda completa"
        style={{
          background: "none",
          border: "none",
          color: "#38bdf8",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          padding: "8px 0",
          minHeight: 44,
          marginTop: 2,
        }}
      >
        Ver agenda completa &gt;
      </button>
    </CardShell>
  );
}
