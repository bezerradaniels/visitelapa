import type { Metadata } from "next";
import { buscarHotelPorSlug } from "@/servicos/hoteis";
import HotelDetalhePagina from "@/paginas/hoteis/[slug]/index";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarHotelPorSlug(slug);

  if (!item) {
    return { title: "Hotel não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/hoteis/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/hoteis/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <HotelDetalhePagina params={resolvedParams} />;
}