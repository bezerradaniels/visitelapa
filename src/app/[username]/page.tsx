import NegocioDetalhePagina from "@/paginas/negocios/[slug]/index";
import { buscarNegocioPorUsername } from "@/servicos/negocios";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const negocio = await buscarNegocioPorUsername(username);

  if (!negocio) {
    notFound();
  }

  return <NegocioDetalhePagina params={{ slug: negocio.slug }} />;
}
