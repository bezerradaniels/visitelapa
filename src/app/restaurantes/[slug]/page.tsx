import type { Metadata } from "next";
import { buscarRestaurantePorSlug } from "@/servicos/restaurantes";
import RestauranteDetalhePagina from "@/paginas/restaurantes/[slug]/index";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarRestaurantePorSlug(slug);

  if (!item) {
    return { title: "Restaurante não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/restaurantes/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/restaurantes/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <RestauranteDetalhePagina params={resolvedParams} />;
}