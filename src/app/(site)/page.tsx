import type { Metadata } from "next";
import HomePagina from "@/paginas/home";

export const metadata: Metadata = {
  title: "Visite Lapa — Portal de Bom Jesus da Lapa",
  description:
    "Descubra hotéis, restaurantes, eventos, negócios e conteúdos locais em Bom Jesus da Lapa, Bahia. O portal inteligente da cidade.",
  alternates: {
    canonical: "https://visitelapa.com.br",
  },
};

export default function Page() {
  return <HomePagina />;
}
