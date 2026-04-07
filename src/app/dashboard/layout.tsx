import { cookies } from "next/headers";
import { ReactNode } from "react";
import RedirecionarLogin from "@/componentes/auth/redirecionar-login";
import Sidebar from "@/componentes/dashboard/sidebar";
import {
  cookieDashboardAutoriza,
  obterCookieDashboardAdmin,
} from "@/servicos/admin-auth";
import { contarSolicitacoesPendentes } from "@/servicos/solicitacoes-publicas";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieConfig = obterCookieDashboardAdmin();
  const cookieStore = await cookies();
  const autorizado = cookieDashboardAutoriza(cookieStore.get(cookieConfig.nome)?.value);

  if (!autorizado) {
    return <RedirecionarLogin />;
  }

  const aprovacoesPendentes = await contarSolicitacoesPendentes();

  return (
    <div className="min-h-screen bg-slate-50 xl:grid xl:grid-cols-[320px_minmax(0,1fr)]">
      <Sidebar aprovacoesPendentes={aprovacoesPendentes} />
      <main>{children}</main>
    </div>
  );
}
