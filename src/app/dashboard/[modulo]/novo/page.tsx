import { notFound } from "next/navigation";
import EdicaoModuloPagina from "@/paginas/dashboard/edicao-modulo";
import { obterModuloDashboard } from "@/servicos/dashboard";
import { DashboardModuloId } from "@/tipos/plataforma";

type PageProps = {
  params: Promise<{
    modulo: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { modulo } = await params;
  const definicao = obterModuloDashboard(modulo);

  if (!definicao || !definicao.supportsCreate) {
    notFound();
  }

  return <EdicaoModuloPagina modulo={modulo as DashboardModuloId} />;
}
