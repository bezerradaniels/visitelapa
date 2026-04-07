import {
  Analytics01Icon,
  ContactBookIcon,
  DashboardSquare01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { DashboardStat } from "@/tipos/plataforma";

type CardsEstatisticasProps = {
  stats: DashboardStat[];
};

const ICONES_POR_CARD = {
  publicados: Note01Icon,
  pendentes: DashboardSquare01Icon,
  contatos: ContactBookIcon,
  modulos: Analytics01Icon,
} as const;

export default function CardsEstatisticas({
  stats,
}: CardsEstatisticasProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const icon = ICONES_POR_CARD[stat.id as keyof typeof ICONES_POR_CARD] ?? Analytics01Icon;

        return (
          <article
            key={stat.id}
            className="rounded-4xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-4xl bg-slate-100 p-3 text-slate-700">
                <Icone
                  icon={icon}
                  size={22}
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Dashboard
              </span>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
              {stat.valor}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{stat.descricao}</p>
          </article>
        );
      })}
    </div>
  );
}
