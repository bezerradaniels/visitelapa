import Link from "next/link";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";

const destaques = [
  {
    titulo: "Encontre os melhores hotéis da cidade",
    descricao:
      "Descubra opções de hospedagem para romarias, turismo e viagens em família.",
    href: "/hoteis",
    tag: "Hospedagem",
  },
  {
    titulo: "Acompanhe os principais eventos",
    descricao:
      "Veja celebrações, programações religiosas, shows e eventos locais.",
    href: "/eventos",
    tag: "Agenda",
  },
  {
    titulo: "Explore experiências e roteiros turísticos",
    descricao:
      "Encontre ideias para conhecer Bom Jesus da Lapa de forma mais completa.",
    href: "/turismo",
    tag: "Turismo",
  },
];

export default function DestaquesHome() {
  return (
    <Secao>
      <TituloSecao
        titulo="Explore o portal"
        subtitulo="Navegue pelos principais caminhos do Visite Lapa enquanto o conteúdo editorial e comercial é consolidado."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {destaques.map((destaque) => (
          <Link
            key={destaque.href}
            href={destaque.href}
            className="group rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-gray-300"
          >
            <div className="flex h-44 items-end rounded-[32px] bg-gray-100 p-4">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                {destaque.tag}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-main transition group-hover:text-black">
              {destaque.titulo}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {destaque.descricao}
            </p>
          </Link>
        ))}
      </div>
    </Secao>
  );
}
