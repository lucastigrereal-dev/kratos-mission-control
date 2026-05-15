export default function OmnisPage() {
  return (
    <div>
      <h2>OMNIS</h2>
      <div className="kr-empty-state">
        <span style={{ fontSize: "var(--kr-text-3xl)", opacity: 0.4 }}>◬</span>
        <p>OMNIS — executor de ações baseado em inteligência Aurora.</p>
        <p style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
          Conecte o OMNIS para executar tarefas automaticamente com supervisão humana.
        </p>
      </div>
    </div>
  );
}
