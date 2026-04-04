"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconSvgElement } from "@hugeicons/react";
import Icone from "@/componentes/ui/icone";

type MenuLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: IconSvgElement;
  onClick?: () => void;
  className?: string;
};

export default function MenuLink({
  href,
  children,
  icon,
  onClick,
  className,
}: MenuLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-sm font-medium transition ${
        isActive
          ? "text-main"
          : "text-gray-600 hover:text-blue"
      } ${className ?? ""}`}
    >
      {icon ? (
        <Icone
          icon={icon}
          size={16}
          className={isActive ? "text-main" : "text-gray-400"}
        />
      ) : null}
      {children}
    </Link>
  );
}
