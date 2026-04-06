type Props = {
  paginaAtual: number;
  totalPaginas: number;
  onAnterior: () => void;
  onProxima: () => void;
};

export default function Paginacao({ paginaAtual, totalPaginas, onAnterior, onProxima }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-4 py-8">
      <button
        type="button"
        onClick={onAnterior}
        disabled={paginaAtual === 1}
        className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      <span className="text-sm text-gray-500">
        Página <strong className="text-main/90">{paginaAtual}</strong> de{" "}
        <strong className="text-main/90">{totalPaginas}</strong>
      </span>

      <button
        type="button"
        onClick={onProxima}
        disabled={paginaAtual === totalPaginas}
        className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima →
      </button>
    </div>
  );
}
