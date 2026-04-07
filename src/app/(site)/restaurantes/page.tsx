import type { Metadata } from "next";
import RestaurantesPagina from "@/paginas/restaurantes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurantes",
  description:
    "Descubra os melhores restaurantes, bistrôs, cafés e lanchonetes em Bom Jesus da Lapa. Gastronomia regional e opções para todos os gostos.",
  alternates: {
    canonical: "https://visitelapa.com.br/restaurantes",
  },
};

export default function Page() {
  return <RestaurantesPagina />;
}
