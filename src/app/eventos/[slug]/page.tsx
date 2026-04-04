import type { Metadata } from "next";
import { buscarEventoPorSlug } from "@/servicos/eventos";
import EventoDetalhePagina from "@/paginas/eventos/[slug]/index";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarEventoPorSlug(slug);

  if (!item) {
    return { title: "Evento não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/eventos/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/eventos/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <EventoDetalhePagina params={resolvedParams} />;
}