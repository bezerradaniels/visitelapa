import Link from "next/link";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";
import { listarNegocios } from "@/servicos/negocios";

export default async function NegociosHome() {
  const negocios = (await listarNegocios()).slice(0, 3);

  if (negocios.length === 0) {
    return null;
  }

  return (
    <Secao>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <TituloSecao
          titulo="Negócios em destaque"
          subtitulo="Conheça empresas, serviços e profissionais que movimentam Bom Jesus da Lapa."
        />

        <Link
          href="/negocios"
          className="text-sm font-semibold text-main transition hover:text-gray-700"
        >
          Ver todos os negócios
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {negocios.map((negocio) => (
          <Link
            key={negocio.slug}
            href={`/negocios/${negocio.slug}`}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300"
          >
            <div className="flex h-48 items-start justify-between bg-gray-100 p-5">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {negocio.categoria}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {negocio.destaqueListagem}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-main transition group-hover:text-black">
                {negocio.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {negocio.descricao}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Secao>
  );
}
