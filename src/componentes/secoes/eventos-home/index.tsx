import Link from "next/link";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";
import { listarEventos } from "@/servicos/eventos";

export default async function EventosHome() {
  const eventos = (await listarEventos()).slice(0, 3);

  if (eventos.length === 0) {
    return null;
  }

  return (
    <Secao>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <TituloSecao
          titulo="Eventos em destaque"
          subtitulo="Descubra celebrações, encontros e programações importantes em Bom Jesus da Lapa."
        />

        <Link
          href="/eventos"
          className="text-sm font-semibold text-main transition hover:text-gray-700"
        >
          Ver todos os eventos
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {eventos.map((evento) => (
          <Link
            key={evento.slug}
            href={`/eventos/${evento.slug}`}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300"
          >
            <div className="flex h-48 items-start justify-between bg-gray-100 p-5">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {evento.categoria}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {evento.data}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-main transition group-hover:text-black">
                {evento.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {evento.descricao}
              </p>

              <div className="mt-5 text-sm font-medium text-gray-500">
                {evento.local}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Secao>
  );
}
