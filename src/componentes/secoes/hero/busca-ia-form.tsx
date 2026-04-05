"use client";

import type { KeyboardEvent } from "react";
import { ArtificialIntelligence08Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { useBuscaIA } from "./use-busca-ia";

type BuscaIAFormProps = {
  sugestoes: readonly string[];
};

export default function BuscaIAForm({ sugestoes }: BuscaIAFormProps) {
  const { pergunta, setPergunta, carregando, buscar } = useBuscaIA();

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      buscar(pergunta);
    }
  }

  function handleSugestao(texto: string) {
    setPergunta(texto);
    buscar(texto);
  }

  return (
    <>
      <div className="mt-8 w-full max-w-2xl rounded-[32px] border border-gray-200 bg-white p-2 transition focus-within:border-blue">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={pergunta}
            onChange={(event) => setPergunta(event.target.value)}
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
        {sugestoes.map((sugestao) => (
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
    </>
  );
}
