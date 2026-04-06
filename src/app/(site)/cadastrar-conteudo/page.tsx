import type { Metadata } from "next";
import CadastrarConteudoPagina from "@/paginas/cadastrar-conteudo";

export const metadata: Metadata = {
  title: "Cadastrar Conteúdo",
  description:
    "Cadastre seu negócio, hotel, restaurante, evento ou pacote no Visite Lapa. Faça parte do portal de Bom Jesus da Lapa.",
  alternates: {
    canonical: "https://visitelapa.com.br/cadastrar-conteudo",
  },
};

export default function Page() {
  return <CadastrarConteudoPagina />;
}
