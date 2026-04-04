import Container from "@/componentes/ui/container";
import SocialButtons from "@/componentes/ui/social-buttons";
import { ReactNode } from "react";

type LayoutDetalheProps = {
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp?: string;
  instagram?: string;
  children: ReactNode;
  aside: ReactNode;
};

export default function LayoutDetalhe({
  categoria,
  titulo,
  descricao,
  imagem,
  whatsapp,
  instagram,
  children,
  aside,
}: LayoutDetalheProps) {
  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-main">
        <div className="absolute inset-0 z-10 bg-black/65" />

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imagem})`,
          }}
        />

        <div className="relative z-20">
          <Container>
            <div className="flex min-h-90 flex-col justify-end py-16">
              <span className="inline-flex w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-main/90">
                {categoria}
              </span>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl">
                {titulo}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-100 md:text-lg">
                {descricao}
              </p>

              <SocialButtons
                whatsapp={whatsapp}
                instagram={instagram}
              />
            </div>
          </Container>
        </div>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">{children}</div>

            <aside className="h-fit">{aside}</aside>
          </div>
        </Container>
      </section>
    </div>
  );
}