"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon, Note01Icon } from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import MenuLink from "./menu-link";

type NavItem = {
  href: string;
  label: string;
  icon: IconSvgElement;
};

type MenuMobileProps = {
  items: readonly NavItem[];
};

export default function MenuMobile({ items }: MenuMobileProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAberto((atual) => !atual)}
        aria-expanded={aberto}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        className="inline-flex items-center justify-center rounded-[32px] border border-gray-200 p-3 text-gray-700 transition hover:border-gray-300 hover:text-main"
      >
        <Icone
          icon={aberto ? Cancel01Icon : Menu01Icon}
          size={20}
        />
      </button>

      {aberto ? (
        <div className="absolute inset-x-0 top-full z-40 border-b border-gray-200 bg-white">
          <Container>
            <div className="flex flex-col gap-6 py-6">
              <nav className="grid gap-4">
                {items.map((item) => (
                  <MenuLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    onClick={() => setAberto(false)}
                    className="w-fit"
                  >
                    {item.label}
                  </MenuLink>
                ))}
              </nav>

              <div className="flex flex-col gap-3">
                <Link
                  href="/cadastrar-conteudo"
                  onClick={() => setAberto(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-main px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Icone
                    icon={Note01Icon}
                    size={18}
                  />
                  Cadastrar conteúdo
                </Link>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
