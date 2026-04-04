import { ReactNode } from "react";
import Container from "@/componentes/ui/container";

type GradeCardsProps = {
  children: ReactNode;
};

export default function GradeCards({ children }: GradeCardsProps) {
  return (
    <section className="bg-white py-10">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      </Container>
    </section>
  );
}