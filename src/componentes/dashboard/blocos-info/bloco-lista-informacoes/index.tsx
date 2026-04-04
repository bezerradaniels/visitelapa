import type { IconSvgElement } from "@hugeicons/react";
import Icone from "@/componentes/ui/icone";

type InformacaoItem = {
  label: string;
  value: string;
  icon?: IconSvgElement;
};

type BlocoListaInformacoesProps = {
  titulo: string;
  itens: InformacaoItem[];
};

export default function BlocoListaInformacoes({
  titulo,
  itens,
}: BlocoListaInformacoesProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">{titulo}</h3>

      <div className="mt-5 space-y-4">
        {itens.map((item) => (
          <div key={`${item.label}-${item.value}`}>
            <div className="flex items-center gap-2">
              {item.icon ? (
                <Icone
                  icon={item.icon}
                  size={16}
                  className="text-slate-500"
                />
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
