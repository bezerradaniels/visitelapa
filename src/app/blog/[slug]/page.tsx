import type { Metadata } from "next";
import { buscarPostPorSlug } from "@/servicos/blog";
import BlogDetalhePagina from "@/paginas/blog/[slug]/index";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await buscarPostPorSlug(slug);

  if (!item) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `https://visitelapa.com.br/blog/${slug}`,
    },
    openGraph: {
      title: item.titulo,
      description: item.descricao,
      url: `https://visitelapa.com.br/blog/${slug}`,
      images: item.imagem ? [{ url: item.imagem, alt: item.titulo }] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return <BlogDetalhePagina params={resolvedParams} />;
}