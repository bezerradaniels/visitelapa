import Image from "next/image";
import Link from "next/link";
import { Note01Icon } from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";
import MenuLink from "./menu-link";
import MenuMobile from "./menu-mobile";
import { itensMenuCabecalho } from "./nav-items";

export default function Header() {
  return (
    <header className="relative border-b border-gray-200 bg-page">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-bold text-main"
          >
            <Image
              src={assetsEstaticos.logos.principal}
              alt="Visite Lapa"
              width={240}
              height={64}
              className="h-16 w-auto"
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
          </div>

          <MenuMobile items={itensMenuCabecalho} />
        </div>
      </Container>
    </header>
  );
}
