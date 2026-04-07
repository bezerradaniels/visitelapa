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
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  children: ReactNode;
  aside: ReactNode;
};

function obterFallbackAvatar(valor?: string) {
  const palavras = (valor ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (palavras.length === 0) {
    return "VL";
  }

  return palavras.map((palavra) => palavra[0]?.toUpperCase() ?? "").join("");
}

export default function LayoutDetalhe({
  titulo,
  descricao,
  imagem,
  whatsapp,
  instagram,
  avatarSrc,
  avatarAlt,
  avatarFallback,
  children,
  aside,
}: LayoutDetalheProps) {
  const fallback = obterFallbackAvatar(avatarFallback ?? titulo);
  const temAvatar = Boolean(avatarSrc || fallback);

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
            <div className="flex min-h-72 flex-col justify-center py-10 md:min-h-80 md:py-12">
              <div className="max-w-5xl">
                {temAvatar ? (
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="shrink-0">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/85 bg-linear-to-br from-slate-100 to-white text-2xl font-semibold tracking-tight text-main shadow-[0_18px_45px_-18px_rgba(15,23,42,0.8)] md:h-24 md:w-24 md:text-3xl">
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt={avatarAlt ?? titulo}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{fallback}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-center">
                      <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white md:text-4xl">
                        {titulo}
                      </h1>

                      <p className="mt-1.5 max-w-2xl text-base leading-7 text-gray-100 md:mt-2 md:text-lg">
                        {descricao}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white md:text-4xl">
                      {titulo}
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-base leading-7 text-gray-100 md:mt-2 md:text-lg">
                      {descricao}
                    </p>
                  </div>
                )}

                <SocialButtons
                  whatsapp={whatsapp}
                  instagram={instagram}
                />
              </div>
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
