import type { Metadata } from "next";
import EventosPagina from "@/paginas/eventos";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Confira os próximos eventos em Bom Jesus da Lapa. Romarias, festivais culturais, feiras de negócios e programação local.",
  alternates: {
    canonical: "https://visitelapa.com.br/eventos",
  },
};

export default function Page() {
  return <EventosPagina />;
}
