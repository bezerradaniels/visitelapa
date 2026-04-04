import Link from "next/link";

type CardListagemProps = {
  href: string;
  tag: string;
  destaque: string;
  titulo: string;
  descricao: string;
};

export default function CardListagem({
  href,
  tag,
  destaque,
  titulo,
  descricao,
}: CardListagemProps) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300"
    >
      <div className="flex h-48 items-start justify-between bg-gray-100 p-5">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
          {tag}
        </span>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
          {destaque}
        </span>
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