type BlocoResumoProps = {
  titulo: string;
  paragrafos: string[];
};

export default function BlocoResumo({
  titulo,
  paragrafos,
}: BlocoResumoProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8">
      <h2 className="text-2xl font-semibold text-slate-950">{titulo}</h2>

      <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
        {paragrafos.map((paragrafo) => (
          <p key={paragrafo}>{paragrafo}</p>
        ))}
      </div>
    </section>
  );
}
