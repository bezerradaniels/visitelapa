import type { Metadata } from "next";
import { buscarNegocioPorSlug } from "@/servicos/negocios";
import NegocioDetalhePagina from "@/paginas/negocios/[slug]/index";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarNegocioPorSlug(slug);

  if (!item) {
    return { title: "Negócio não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/negocios/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/negocios/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <NegocioDetalhePagina params={resolvedParams} />;
}