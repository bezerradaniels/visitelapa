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
  const imagemCapaOuvGenerica = imagem || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-6 px-4 md:py-10">
        <Container>
          <div className="relative overflow-hidden bg-gray-900 rounded-3xl h-112 flex items-end shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${imagemCapaOuvGenerica})`,
              }}
            />
            {/* Dark gradient mapping bottom of image to black to ensure text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

            <div className="relative z-20 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                {temAvatar && (
                  <div className="shrink-0 flex translate-y-2 md:translate-y-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/95 bg-white text-2xl font-bold tracking-tight text-main shadow-lg md:h-[6.5rem] md:w-[6.5rem] md:text-3xl">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={avatarAlt ?? titulo}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span>{fallback}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex min-w-0 flex-col pt-2 pb-1 md:pb-2">
                  <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-white md:text-[2.5rem]">
                    {titulo}
                  </h1>

                  <p className="mt-1 md:mt-2 max-w-2xl text-sm leading-snug md:leading-6 text-gray-200 md:text-lg">
                    {categoria}
                  </p>
                </div>
              </div>

              {(whatsapp || instagram) && (
                <div className="shrink-0 mt-auto md:pb-2 flex justify-end">
                  <SocialButtons
                    whatsapp={whatsapp}
                    instagram={instagram}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-10 pt-2 md:pt-4">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">{children}</div>

            <aside className="h-fit space-y-6">{aside}</aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
