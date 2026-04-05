import type { Metadata } from "next";
import HoteisPagina from "@/paginas/hoteis";

export const metadata: Metadata = {
  title: "Hotéis e Pousadas",
  description:
    "Encontre hotéis, pousadas e hospedagens em Bom Jesus da Lapa. Opções perto do santuário, à beira do rio São Francisco e no centro da cidade.",
  alternates: {
    canonical: "https://visitelapa.com.br/hoteis",
  },
};

export default function Page() {
  return <HoteisPagina />;
}
