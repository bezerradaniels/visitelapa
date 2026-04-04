import { notFound } from "next/navigation";
import EdicaoModuloPagina from "@/paginas/dashboard/edicao-modulo";
import { listarLinhasModulo, obterModuloDashboard } from "@/servicos/dashboard";
import { DashboardModuloId } from "@/tipos/plataforma";

type PageProps = {
  params: Promise<{
    modulo: string;
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { modulo, slug } = await params;
  const definicao = obterModuloDashboard(modulo);

  if (!definicao || !definicao.supportsEdit) {
    notFound();
  }

  const linha = (await listarLinhasModulo(modulo as DashboardModuloId)).find(
    (item) => item.id === slug
  );

  if (!linha) {
    notFound();
  }

  return (
    <EdicaoModuloPagina
      modulo={modulo as DashboardModuloId}
      slug={slug}
    />
  );
}
