import { notFound } from "next/navigation";
import ListaModuloPagina from "@/paginas/dashboard/lista-modulo";
import { obterModuloDashboard } from "@/servicos/dashboard";
import { DashboardModuloId } from "@/tipos/plataforma";

type PageProps = {
  params: Promise<{
    modulo: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { modulo } = await params;

  if (!obterModuloDashboard(modulo)) {
    notFound();
  }

  return <ListaModuloPagina modulo={modulo as DashboardModuloId} />;
}
