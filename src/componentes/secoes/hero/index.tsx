import Image from "next/image";
import { assetsEstaticos } from "@/dados/assets";
import BuscaIAForm from "./busca-ia-form";

const SUGESTOES = [
  "Hotéis perto do santuário",
  "Eventos desta semana",
  "Restaurantes bem avaliados",
  "O que fazer em 1 dia",
];

export default function Hero() {
  return (
    <section className="relative min-h-[40vh] py-20 overflow-hidden px-4">
      <Image
        src={assetsEstaticos.hero.aurora}
        alt="Vista da gruta e do santuário de Bom Jesus da Lapa"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-slate-950 opacity-85" />

      <div className="relative mx-auto flex min-h-[40vh] py-20 max-w-4xl flex-col items-center justify-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-main bg-linear-to-r from-sky-200 via-fuchsia-200 to-pink-200">
          Portal de Bom Jesus da Lapa
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-4xl">
          Descubra Bom Jesus da Lapa de um jeito mais inteligente
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white opacity-80 md:text-xl">
          Encontre hotéis, eventos, restaurantes, negócios e informações locais com
          ajuda de inteligência artificial.
        </p>

        <BuscaIAForm sugestoes={SUGESTOES} />
      </div>
    </section>
  );
}
