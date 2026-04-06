"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  BookOpen01Icon,
  Building03Icon,
  Calendar03Icon,
  City01Icon,
  ContactBookIcon,
  DashboardSquare01Icon,
  Hotel01Icon,
  Layers01Icon,
  Location01Icon,
  MenuCollapseIcon,
  Note01Icon,
  Restaurant01Icon,
  Tag01Icon,
  Ticket01Icon,
  Logout01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";

const CADASTROS = [
  {
    id: "pacotes",
    href: "/dashboard/pacotes",
    label: "Pacotes",
    singular: "pacote",
    icon: Ticket01Icon,
  },
  {
    id: "eventos",
    href: "/dashboard/eventos",
    label: "Eventos",
    singular: "evento",
    icon: Calendar03Icon,
  },
  {
    id: "hoteis",
    href: "/dashboard/hoteis",
    label: "Hotéis",
    singular: "hotel",
    icon: Hotel01Icon,
  },
  {
    id: "negocios",
    href: "/dashboard/negocios",
    label: "Negócios",
    singular: "negócio",
    icon: Building03Icon,
  },
  {
    id: "restaurantes",
    href: "/dashboard/restaurantes",
    label: "Restaurantes",
    singular: "restaurante",
    icon: Restaurant01Icon,
  },
] as const;

const GRUPOS = [
  {
    titulo: "Resumo",
    itens: [
      {
        href: "/dashboard",
        label: "Visão geral",
        icon: DashboardSquare01Icon,
      },
      {
        href: "/dashboard/aprovacoes",
        label: "Aprovações",
        icon: Shield01Icon,
      },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { href: "/dashboard/paginas", label: "Páginas", icon: Note01Icon },
      { href: "/dashboard/conteudos", label: "Conteúdos", icon: Layers01Icon },
      { href: "/dashboard/blog", label: "Blog", icon: BookOpen01Icon },
    ],
  },
  {
    titulo: "Cadastros",
    itens: CADASTROS,
  },
  {
    titulo: "Estrutura",
    itens: [
      { href: "/dashboard/categorias", label: "Categorias", icon: Layers01Icon },
      { href: "/dashboard/tags", label: "Tags", icon: Tag01Icon },
      { href: "/dashboard/cidades", label: "Cidades", icon: City01Icon },
      { href: "/dashboard/bairros", label: "Bairros", icon: Location01Icon },
      { href: "/dashboard/contatos", label: "Contatos", icon: ContactBookIcon },
    ],
  },
];

const ESTADO_INICIAL_SECOES = Object.fromEntries(
  GRUPOS.map((grupo) => [grupo.titulo, true])
) as Record<string, boolean>;

type SidebarProps = {
  aprovacoesPendentes?: number;
};

export default function Sidebar({
  aprovacoesPendentes = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const [secoesAbertas, setSecoesAbertas] = useState<Record<string, boolean>>(
    ESTADO_INICIAL_SECOES
  );
  const [cadastrosAcoesAbertas, setCadastrosAcoesAbertas] = useState(false);
  const todasColapsadas = GRUPOS.every((grupo) => !secoesAbertas[grupo.titulo]);

  function alternarSecao(titulo: string) {
    const proximoAberto = !secoesAbertas[titulo];

    setSecoesAbertas((current) => ({
      ...current,
      [titulo]: proximoAberto,
    }));

    if (titulo === "Cadastros" && !proximoAberto) {
      setCadastrosAcoesAbertas(false);
    }
  }

  function alternarTodasAsSecoes() {
    const proximoEstado = todasColapsadas;

    setSecoesAbertas(
      Object.fromEntries(GRUPOS.map((grupo) => [grupo.titulo, proximoEstado]))
    );

    if (!proximoEstado) {
      setCadastrosAcoesAbertas(false);
    }
  }

  function alternarAcoesCadastros() {
    setSecoesAbertas((current) => ({
      ...current,
      Cadastros: true,
    }));
    setCadastrosAcoesAbertas((current) => !current);
  }

  return (
    <aside className="w-full border-b border-slate-200 bg-slate-950 text-slate-100 xl:min-h-screen xl:w-80 xl:border-b-0 xl:border-r">
      <div className="sticky top-0 flex flex-col gap-8 p-6 xl:p-8">
        <div className="flex items-start justify-between gap-4">
          <Link
            href="/"
            className="inline-flex"
          >
            <Image
              src={assetsEstaticos.logos.principal}
              alt="Visite Lapa"
              width={240}
              height={64}
              className="h-20 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={alternarTodasAsSecoes}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-800 text-slate-300 transition hover:border-slate-700 hover:text-white"
            aria-label={todasColapsadas ? "Expandir seções do menu" : "Colapsar seções do menu"}
            title={todasColapsadas ? "Expandir seções" : "Colapsar seções"}
          >
            <Icone
              icon={MenuCollapseIcon}
              size={18}
            />
          </button>
        </div>

        <div className="space-y-6">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-500">
                    {grupo.titulo}
                  </p>

                  {grupo.titulo === "Cadastros" ? (
                    <button
                      type="button"
                      onClick={alternarAcoesCadastros}
                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-800 text-slate-300 transition hover:border-slate-700 hover:text-white"
                      aria-label={
                        cadastrosAcoesAbertas
                          ? "Fechar ações rápidas de cadastros"
                          : "Abrir ações rápidas de cadastros"
                      }
                      title="Adicionar em cadastros"
                    >
                      <Icone
                        icon={Add01Icon}
                        size={14}
                      />
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => alternarSecao(grupo.titulo)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-900 hover:text-white"
                  aria-label={
                    secoesAbertas[grupo.titulo]
                      ? `Colapsar seção ${grupo.titulo}`
                      : `Expandir seção ${grupo.titulo}`
                  }
                >
                  <Icone
                    icon={secoesAbertas[grupo.titulo] ? ArrowUp01Icon : ArrowDown01Icon}
                    size={16}
                  />
                </button>
              </div>

              {grupo.titulo === "Cadastros" &&
              secoesAbertas[grupo.titulo] &&
              cadastrosAcoesAbertas ? (
                <div className="mt-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-3">
                  <div className="space-y-2">
                    {CADASTROS.map((cadastro) => (
                      <div
                        key={cadastro.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
                      >
                        <Link
                          href={`${cadastro.href}/novo`}
                          className="inline-flex items-center gap-2 rounded-[32px] px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                        >
                          <Icone
                            icon={cadastro.icon}
                            size={16}
                          />
                          {`Novo ${cadastro.singular}`}
                        </Link>

                        <Link
                          href={`/dashboard/categorias/novo?tipo=${cadastro.id}`}
                          className="inline-flex items-center justify-center rounded-[32px] border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                          Nova categoria
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {secoesAbertas[grupo.titulo] ? (
                <nav className="mt-3">
                  {grupo.itens.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const isVisaoGeral = item.href === "/dashboard";
                    const badgeCount =
                      item.href === "/dashboard/aprovacoes" ? aprovacoesPendentes : 0;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-[32px] px-4 py-3 text-sm font-medium transition ${
                          isVisaoGeral
                            ? isActive
                              ? "text-white"
                              : "text-slate-300 hover:text-white"
                            : isActive
                              ? "bg-white text-slate-950"
                              : "text-slate-300 hover:bg-main hover:text-white"
                        }`}
                      >
                        <Icone
                          icon={item.icon}
                          size={18}
                        />
                        <span className="flex min-w-0 items-center gap-2">
                          <span>{item.label}</span>
                          {badgeCount > 0 ? (
                            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-amber-400 px-2 py-1 text-[11px] font-bold leading-none text-slate-950">
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex w-fit rounded-[32px] border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            Voltar ao portal
          </Link>

          <Link
            href="/api/auth/logout"
            className="inline-flex w-fit items-center gap-2 rounded-[32px] border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <Icone
              icon={Logout01Icon}
              size={18}
            />
            Sair do dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
