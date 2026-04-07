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
  categoria,
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
            <div className="flex min-h-90 flex-col justify-end py-16">
              <div className={`max-w-5xl ${temAvatar ? "md:flex md:items-end md:gap-6" : ""}`}>
                {temAvatar ? (
                  <div className="mb-6 shrink-0 md:mb-0">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/85 bg-gradient-to-br from-slate-100 to-white text-3xl font-semibold tracking-tight text-main shadow-[0_18px_45px_-18px_rgba(15,23,42,0.8)] md:h-36 md:w-36 md:text-4xl">
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
                ) : null}

                <div>
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
