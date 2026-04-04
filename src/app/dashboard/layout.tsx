import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/componentes/dashboard/sidebar";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieConfig = obterCookieDashboardAdmin();
  const cookieStore = await cookies();
  const autorizado =
    cookieStore.get(cookieConfig.nome)?.value === cookieConfig.valorAutorizado;

  if (!autorizado) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 xl:grid xl:grid-cols-[320px_minmax(0,1fr)]">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
