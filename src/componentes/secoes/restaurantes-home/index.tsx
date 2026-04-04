import Link from "next/link";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";
import { listarRestaurantes } from "@/servicos/restaurantes";

export default async function RestaurantesHome() {
  const restaurantes = (await listarRestaurantes()).slice(0, 3);

  if (restaurantes.length === 0) {
    return null;
  }

  return (
    <Secao>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <TituloSecao
          titulo="Restaurantes em destaque"
          subtitulo="Explore lugares para comer bem e viver boas experiências gastronômicas em Bom Jesus da Lapa."
        />

        <Link
          href="/restaurantes"
          className="text-sm font-semibold text-main transition hover:text-gray-700"
        >
          Ver todos os restaurantes
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {restaurantes.map((restaurante) => (
          <Link
            key={restaurante.slug}
            href={`/restaurantes/${restaurante.slug}`}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300"
          >
            <div className="flex h-48 items-start justify-between bg-gray-100 p-5">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {restaurante.categoria}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {restaurante.destaqueListagem}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-main transition group-hover:text-black">
                {restaurante.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {restaurante.descricao}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Secao>
  );
}
