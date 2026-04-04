import type { Metadata } from "next";
import LoginPagina from "@/paginas/login";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse a área administrativa do Visite Lapa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginPagina />;
}
