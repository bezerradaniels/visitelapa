import type { Metadata } from "next";
import ObrigadoPagina from "@/paginas/obrigado";

export const metadata: Metadata = {
  title: "Obrigado",
  description: "Confirmação de envio do portal Visite Lapa.",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    origem?: string;
    tipo?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { origem, tipo } = await searchParams;

  return (
    <ObrigadoPagina
      origem={origem}
      tipo={tipo}
    />
  );
}
