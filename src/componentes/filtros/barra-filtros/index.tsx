type FiltroItem = {
  label: string;
  ativo?: boolean;
};

type BarraFiltrosProps = {
  filtros: FiltroItem[];
  onFiltroClick?: (label: string) => void;
};

export default function BarraFiltros({ filtros, onFiltroClick }: BarraFiltrosProps) {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3 px-4 py-5">
        {filtros.map((filtro) => (
          <button
            key={filtro.label}
            type="button"
            onClick={() => onFiltroClick?.(filtro.label)}
            className={
              filtro.ativo
                ? "rounded-full bg-main px-4 py-2 text-sm font-medium text-white transition cursor-pointer"
                : "rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition cursor-pointer hover:border-gray-300 hover:bg-gray-50"
            }
          >
            {filtro.label}
          </button>
        ))}
      </div>
    </section>
  );
}
