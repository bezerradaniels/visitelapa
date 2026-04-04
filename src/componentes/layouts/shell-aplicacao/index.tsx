"use client";

import Header from "@/componentes/header";
import Footer from "@/componentes/footer";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type ShellAplicacaoProps = {
  children: ReactNode;
};

export default function ShellAplicacao({ children }: ShellAplicacaoProps) {
  const pathname = usePathname();
  const ocultarChromePublico =
    pathname === "/login" || pathname.startsWith("/dashboard");

  return (
    <>
      {!ocultarChromePublico && <Header />}
      <main>{children}</main>
      {!ocultarChromePublico && <Footer />}
    </>
  );
}
