interface LegendItem {
  label: string;
  dotClass: string;
  description?: string;
}

const DEFAULT_LEGEND: LegendItem[] = [
  { label: "Ativo", dotClass: "kr-dot-live", description: "Operação normal" },
  { label: "Em risco", dotClass: "kr-dot-degraded", description: "Atenção necessária" },
  { label: "Aguardando", dotClass: "kr-dot-offline", description: "Pendente ou offline" },
  { label: "Concluído", dotClass: "kr-dot-healthy", description: "Finalizado com sucesso" },
];

interface WorldMapLegendProps {
  items?: LegendItem[];
}

export default function WorldMapLegend({ items = DEFAULT_LEGEND }: WorldMapLegendProps) {
  return (
    <div className="kr-world-map-legend" role="list" aria-label="Legenda do mundo">
      {items.map((item) => (
        <div key={item.label} className="kr-world-map-legend-item" role="listitem">
          <span className={item.dotClass} style={{ width: 8, height: 8 }} />
          <span className="kr-world-map-legend-label">{item.label}</span>
          {item.description && (
            <span className="kr-world-map-legend-desc">{item.description}</span>
          )}
        </div>
      ))}
    </div>
  );
}
