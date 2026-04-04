import Link from "next/link";

type EstadoVazioProps = {
  titulo: string;
  descricao: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function EstadoVazio({
  titulo,
  descricao,
  actionHref,
  actionLabel,
}: EstadoVazioProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
      <h2 className="text-2xl font-semibold text-slate-950">{titulo}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        {descricao}
      </p>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-[32px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
