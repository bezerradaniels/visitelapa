import Link from "next/link";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Building03Icon,
  Calendar03Icon,
  Hotel01Icon,
  Location01Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";
import Icone from "@/componentes/ui/icone";

const atalhos = [
  {
    titulo: "Negócios",
    descricao: "Encontre empresas e profissionais da cidade.",
    href: "/negocios",
    tag: "Guia comercial",
    icon: Building03Icon,
  },
  {
    titulo: "Hotéis",
    descricao: "Descubra opções de hospedagem em Bom Jesus da Lapa.",
    href: "/hoteis",
    tag: "Hospedagem",
    icon: Hotel01Icon,
  },
  {
    titulo: "Eventos",
    descricao: "Veja eventos, celebrações e programações da cidade.",
    href: "/eventos",
    tag: "Agenda",
    icon: Calendar03Icon,
  },
  {
    titulo: "Blog",
    descricao: "Leia artigos, novidades e conteúdos sobre a cidade.",
    href: "/blog",
    tag: "Conteúdo",
    icon: BookOpen01Icon,
  },
  {
    titulo: "Restaurantes",
    descricao: "Explore lugares para comer e viver boas experiências.",
    href: "/restaurantes",
    tag: "Gastronomia",
    icon: Restaurant01Icon,
  },
  {
    titulo: "Turismo",
    descricao: "Descubra roteiros, pacotes e experiências turísticas.",
    href: "/turismo",
    tag: "Experiências",
    icon: Location01Icon,
  },
] as const satisfies Array<{
  titulo: string;
  descricao: string;
  href: string;
  tag: string;
  icon: IconSvgElement;
}>;

export default function AtalhosPortal() {
  return (
    <Secao>
      <TituloSecao
        titulo="Explore o portal"
        subtitulo="Acesse rapidamente as principais áreas do Visite Lapa."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {atalhos.map((atalho) => (
          <Link
            key={atalho.href}
            href={atalho.href}
            className="group rounded-[32px] border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-gray-300"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {atalho.tag}
              </span>

              <div className="flex items-center gap-2 text-gray-400 transition group-hover:text-gray-700">
                <Icone
                  icon={atalho.icon}
                  size={18}
                />
                <Icone
                  icon={ArrowRight01Icon}
                  size={16}
                />
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-main">
              {atalho.titulo}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {atalho.descricao}
            </p>
          </Link>
        ))}
      </div>
    </Secao>
  );
}
