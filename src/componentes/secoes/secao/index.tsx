import { ReactNode } from "react";
import Container from "@/componentes/ui/container";

type SecaoProps = {
  children: ReactNode;
};

export default function Secao({ children }: SecaoProps) {
  return (
    <section className="py-12">
      <Container>{children}</Container>
    </section>
  );
}