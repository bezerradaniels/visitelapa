type BlocoDestaquesProps = {
  titulo: string;
  itens: string[];
};

export default function BlocoDestaques({
  titulo,
  itens,
}: BlocoDestaquesProps) {
  const itensValidos = itens.filter((item) => typeof item === "string" && item.trim().length > 0);

  if (itensValidos.length === 0) {
    return null;
  }

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">{titulo}</h3>

      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
        {itensValidos.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="rounded-4xl bg-slate-50 px-4 py-3"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
