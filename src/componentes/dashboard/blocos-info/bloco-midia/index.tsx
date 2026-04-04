import Link from "next/link";
import { Image01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";

type BlocoMidiaProps = {
  imagem: string;
  titulo?: string;
};

export default function BlocoMidia({
  imagem,
  titulo = "Imagem de capa",
}: BlocoMidiaProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${imagem})` }}
      />
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
            <Icone
              icon={Image01Icon}
              size={18}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{titulo}</p>
            <p className="text-sm text-slate-500">Referência visual atual</p>
          </div>
        </div>

        <Link
          href={imagem}
          target="_blank"
          className="mt-5 inline-flex text-sm font-semibold text-slate-700 transition hover:text-slate-950"
        >
          Abrir imagem
        </Link>
      </div>
    </div>
  );
}
