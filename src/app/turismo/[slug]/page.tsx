import type { Metadata } from "next";
import { buscarTurismoPorSlug } from "@/servicos/turismo";
import TurismoDetalhePagina from "@/paginas/turismo/[slug]/index";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarTurismoPorSlug(slug);

  if (!item) {
    return { title: "Roteiro não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/turismo/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/turismo/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <TurismoDetalhePagina params={resolvedParams} />;
}