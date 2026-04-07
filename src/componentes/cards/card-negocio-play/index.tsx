import Link from "next/link";
import { CircleArrowRight01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { criarLogoFallbackNegocio } from "@/servicos/negocios-fallback";

type CardNegocioPlayProps = {
  href: string;
  label: string;
  titulo: string;
  descricao: string;
  logo?: string;
};

export default function CardNegocioPlay({
  href,
  label,
  titulo,
  descricao,
  logo,
}: CardNegocioPlayProps) {
  const logoResolvendo = logo || criarLogoFallbackNegocio(titulo);

  return (
    <Link
      href={href}
      className="group flex h-full items-start gap-4 rounded-[28px] bg-white p-4 transition hover:-translate-y-0.5"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-gray-200 bg-gray-50 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)]">
        <img
          src={logoResolvendo}
          alt={`Logo de ${titulo}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-700">
          {label}
        </span>

        <h3 className="mt-1.5 line-clamp-1 text-xl font-semibold tracking-tight text-main transition group-hover:text-black">
          {titulo}
        </h3>

        <p className="mt-0.5 line-clamp-2 text-sm leading-6 text-gray-600">
          {descricao}
        </p>

        <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-500 transition group-hover:text-sky-600">
          Acessar
          <Icone
            icon={CircleArrowRight01Icon}
            size={16}
          />
        </span>
      </div>
    </Link>
  );
}
