import type { Metadata } from "next";
import ContatoPagina from "@/paginas/contato";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o Visite Lapa. Envie sua mensagem, dúvida ou sugestão sobre o portal de Bom Jesus da Lapa.",
  alternates: {
    canonical: "https://visitelapa.com.br/contato",
  },
};

export default function Page() {
  return <ContatoPagina />;
}
