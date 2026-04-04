import type { Metadata } from "next";
import NegociosPagina from "@/paginas/negocios";

export const metadata: Metadata = {
  title: "Negócios",
  description:
    "Encontre os melhores negócios, lojas e prestadores de serviço em Bom Jesus da Lapa. Clínicas, escritórios, comércio local e muito mais.",
  alternates: {
    canonical: "https://visitelapa.com.br/negocios",
  },
};

export default function Page() {
  return <NegociosPagina />;
}
