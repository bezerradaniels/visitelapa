import type { Metadata } from "next";
import BlogPagina from "@/paginas/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Leia artigos, dicas e guias sobre Bom Jesus da Lapa. Roteiros, hospedagem, gastronomia, eventos e tudo sobre a cidade.",
  alternates: {
    canonical: "https://visitelapa.com.br/blog",
  },
};

export default function Page() {
  return <BlogPagina />;
}
