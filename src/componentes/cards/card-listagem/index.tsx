import Link from "next/link";
import { assetsEstaticos } from "@/dados/assets";

type CardListagemProps = {
  href: string;
  tag: string;
  destaque: string;
  titulo: string;
  descricao: string;
  imagem?: string;
};

export default function CardListagem({
  href,
  tag,
  destaque,
  titulo,
  descricao,
  imagem,
}: CardListagemProps) {
  const imagemSrc = imagem || assetsEstaticos.placeholders.cardPadrao;

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imagemSrc}
          alt={titulo}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-between p-5">
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {tag}
          </span>
          {destaque && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
              {destaque}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-main transition group-hover:text-black">
          {titulo}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {descricao}
        </p>
      </div>
    </Link>
  );
}