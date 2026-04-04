import Link from "next/link";
import { Add01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";

type CabecalhoSecaoProps = {
  eyebrow?: string;
  titulo: string;
  descricao: string;
  actionHref?: string;
  actionLabel?: string;
  backHref?: string;
  backLabel?: string;
};

export default function CabecalhoSecao({
  eyebrow,
  titulo,
  descricao,
  actionHref,
  actionLabel,
  backHref,
  backLabel,
}: CabecalhoSecaoProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 md:flex-row md:items-end md:justify-between md:p-8">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {titulo}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{descricao}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            <Icone
              icon={ArrowLeft01Icon}
              size={18}
            />
            {backLabel}
          </Link>
        ) : null}

        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Icone
              icon={Add01Icon}
              size={18}
            />
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
