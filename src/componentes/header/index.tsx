import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { LayoutGridIcon, Note01Icon } from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";
import {
  cookieDashboardAutoriza,
  obterCookieDashboardAdmin,
} from "@/servicos/admin-auth";
import { contarSolicitacoesPendentes } from "@/servicos/solicitacoes-publicas";
import MenuLink from "./menu-link";
import MenuMobile from "./menu-mobile";
import { itensMenuCabecalho } from "./nav-items";

export default async function Header() {
  const cookieConfig = obterCookieDashboardAdmin();
  const cookieStore = await cookies();
  const logado = cookieDashboardAutoriza(cookieStore.get(cookieConfig.nome)?.value);
  const aprovacoesPendentes = logado ? await contarSolicitacoesPendentes() : 0;

  return (
    <header className="relative border-b border-gray-200 bg-page">
      <Container>
        <div className="flex min-h-11 items-center justify-between gap-4 py-2 lg:min-h-16 lg:py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-bold text-main"
          >
            <Image
              src={assetsEstaticos.logos.principal}
              alt="Visite Lapa"
              width={240}
              height={64}
              className="h-10 w-auto lg:h-16"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {itensMenuCabecalho.map((item) => (
              <MenuLink
                key={item.href}
                href={item.href}
                icon={item.icon}
              >
                {item.label}
              </MenuLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {logado ? (
              <Link
                href="/dashboard"
                className="relative inline-flex items-center justify-center gap-2 rounded-full bg-main px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Icone
                  icon={LayoutGridIcon}
                  size={18}
                />
                Painel
                {aprovacoesPendentes > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {aprovacoesPendentes > 99 ? "99+" : aprovacoesPendentes}
                  </span>
                ) : null}
              </Link>
            ) : (
              <Link
                href="/cadastrar-conteudo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-main px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Icone
                  icon={Note01Icon}
                  size={18}
                />
                Cadastrar conteúdo
              </Link>
            )}
          </div>

          <MenuMobile
            items={itensMenuCabecalho}
            logado={logado}
            aprovacoesPendentes={aprovacoesPendentes}
          />
        </div>
      </Container>
    </header>
  );
}
