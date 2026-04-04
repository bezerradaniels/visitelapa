import { assetsEstaticos } from "@/dados/assets";

type HeroListagemProps = {
  titulo: string;
  subtitulo: string;
  imagem: string;
};

export default function HeroListagem({
  titulo,
  subtitulo,
  imagem,
}: HeroListagemProps) {
  return (
    <section
      className="relative flex min-h-80 items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${imagem})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: `url(${assetsEstaticos.hero.grade})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl">
          {titulo}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-100 md:text-lg">
          {subtitulo}
        </p>
      </div>
    </section>
  );
}
