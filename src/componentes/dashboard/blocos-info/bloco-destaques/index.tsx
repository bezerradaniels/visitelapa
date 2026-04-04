type BlocoDestaquesProps = {
  titulo: string;
  itens: string[];
};

export default function BlocoDestaques({
  titulo,
  itens,
}: BlocoDestaquesProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">{titulo}</h3>

      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
        {itens.map((item) => (
          <li
            key={item}
            className="rounded-[32px] bg-slate-50 px-4 py-3"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
