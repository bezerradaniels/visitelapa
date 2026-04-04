"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen01Icon,
  Building03Icon,
  Calendar03Icon,
  City01Icon,
  ContactBookIcon,
  DashboardSquare01Icon,
  Hotel01Icon,
  Layers01Icon,
  Location01Icon,
  Note01Icon,
  Restaurant01Icon,
  Tag01Icon,
  Ticket01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";

const GRUPOS = [
  {
    titulo: "Resumo",
    itens: [
      {
        href: "/dashboard",
        label: "Visão geral",
        icon: DashboardSquare01Icon,
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
    itens: [
      { href: "/dashboard/pacotes", label: "Pacotes", icon: Ticket01Icon },
      { href: "/dashboard/eventos", label: "Eventos", icon: Calendar03Icon },
      { href: "/dashboard/hoteis", label: "Hotéis", icon: Hotel01Icon },
      { href: "/dashboard/negocios", label: "Negócios", icon: Building03Icon },
      {
        href: "/dashboard/restaurantes",
        label: "Restaurantes",
        icon: Restaurant01Icon,
      },
      { href: "/dashboard/turismo", label: "Turismo", icon: Location01Icon },
    ],
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-slate-950 text-slate-100 xl:min-h-screen xl:w-80 xl:border-b-0 xl:border-r">
      <div className="sticky top-0 flex flex-col gap-8 p-6 xl:p-8">
        <div>
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
        </div>

        <div className="space-y-6">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="text-sm font-semibold text-slate-500">
                {grupo.titulo}
              </p>

              <nav className="mt-3">
                {grupo.itens.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-[32px] px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-950"
                          : "text-slate-300 hover:bg-main hover:text-white"
                      }`}
                    >
                      <Icone
                        icon={item.icon}
                        size={18}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
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
