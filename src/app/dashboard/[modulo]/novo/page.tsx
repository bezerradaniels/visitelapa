import { notFound } from "next/navigation";
import EdicaoModuloPagina from "@/paginas/dashboard/edicao-modulo";
import { moduloEhTipoCadastro } from "@/servicos/cadastros";
import { obterModuloDashboard } from "@/servicos/dashboard";
import { DashboardModuloId } from "@/tipos/plataforma";

type PageProps = {
  params: Promise<{
    modulo: string;
  }>;
  searchParams: Promise<{
    tipo?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { modulo } = await params;
  const { tipo } = await searchParams;
  const definicao = obterModuloDashboard(modulo);

  if (!definicao || !definicao.supportsCreate) {
    notFound();
  }

  const initialValues =
    modulo === "categorias" && tipo && moduloEhTipoCadastro(tipo)
      ? { tipoCadastro: tipo }
      : undefined;

  return (
    <EdicaoModuloPagina
      modulo={modulo as DashboardModuloId}
      initialValues={initialValues}
    />
  );
}
