"use client";

import { ArtificialIntelligence08Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";
import { useBuscaIA } from "./use-busca-ia";

const SUGESTOES = [
  "Hotéis perto do santuário",
  "Eventos desta semana",
  "Restaurantes bem avaliados",
  "O que fazer em 1 dia",
];

export default function Hero() {
  const { pergunta, setPergunta, carregando, buscar } = useBuscaIA();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") buscar(pergunta);
  }

  function handleSugestao(texto: string) {
    setPergunta(texto);
    buscar(texto);
  }

  return (
    <section className="relative min-h-[40vh] py-20 overflow-hidden px-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${assetsEstaticos.hero.aurora})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-slate-950 opacity-85" />

      <div className="relative mx-auto flex min-h-[40vh] py-20 max-w-4xl flex-col items-center justify-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-main bg-linear-to-r from-sky-200 via-fuchsia-200 to-pink-200">
          Portal turístico de Bom Jesus da Lapa
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-4xl">
          Descubra Bom Jesus da Lapa de um jeito mais inteligente
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white opacity-80 md:text-xl">
          Encontre hotéis, eventos, restaurantes, negócios e experiências com
          ajuda de inteligência artificial.
        </p>

        {/* area de IA */}
        <div className="mt-8 w-full max-w-2xl rounded-[32px] border border-gray-200 bg-white p-2 transition focus-within:border-blue">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: me indique um hotel perto do santuário"
              className="h-12 flex-1 rounded-full px-4 text-sm text-main outline-none placeholder:text-gray-400"
              disabled={carregando}
            />
            <button
              onClick={() => buscar(pergunta)}
              disabled={carregando || !pergunta.trim()}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-main px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icone
                icon={ArtificialIntelligence08Icon}
                size={26}
              />
              {carregando ? "Buscando..." : "Perguntar"}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => handleSugestao(sugestao)}
              disabled={carregando}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-main transition hover:border-blue hover:text-blue disabled:opacity-50"
            >
              {sugestao}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
