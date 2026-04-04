import type { Metadata } from "next";
import TurismoPagina from "@/paginas/turismo";

export const metadata: Metadata = {
  title: "Turismo",
  description:
    "Explore roteiros turísticos em Bom Jesus da Lapa. Passeios religiosos, culturais, gastronômicos e experiências à beira do São Francisco.",
  alternates: {
    canonical: "https://visitelapa.com.br/turismo",
  },
};

export default function Page() {
  return <TurismoPagina />;
}
