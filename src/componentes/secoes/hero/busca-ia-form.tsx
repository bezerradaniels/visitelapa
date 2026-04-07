"use client";

import type { KeyboardEvent } from "react";
import Link from "next/link";
import { ArtificialIntelligence08Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { useBuscaIA } from "./use-busca-ia";

type BuscaIAFormProps = {
  sugestoes: readonly string[];
};

export default function BuscaIAForm({ sugestoes }: BuscaIAFormProps) {
  const { pergunta, setPergunta, carregando, buscar, resultado } = useBuscaIA();

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
      <div className="mt-8 w-full max-w-2xl rounded-4xl border border-gray-200 bg-white p-2 transition focus-within:border-blue">
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
            type="button"
            onClick={() => buscar(pergunta)}
            disabled={carregando || !pergunta.trim()}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-main px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            type="button"
            onClick={() => handleSugestao(sugestao)}
            disabled={carregando}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-main transition cursor-pointer hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sugestao}
          </button>
        ))}
      </div>

      {carregando ? (
        <div
          aria-live="polite"
          className="mt-6 w-full max-w-3xl rounded-4xl border border-slate-200 bg-white p-6 text-left shadow-sm backdrop-blur"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Agente Visite Lapa
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Estou separando algumas publicações que combinam com o seu pedido.
          </p>
        </div>
      ) : null}

      {resultado ? (
        <div
          aria-live="polite"
          className="mt-6 w-full max-w-3xl rounded-4xl border border-slate-200 bg-white p-6 text-left shadow-sm backdrop-blur"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Agente Visite Lapa
          </p>

          <p className="mt-3 text-base leading-7 text-slate-700">
            {resultado.mensagem}
          </p>

          {resultado.sugestoes.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {resultado.sugestoes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-sky-300 hover:bg-white hover:shadow-sm"
                >
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                    {item.categoria}
                  </span>

                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {item.titulo}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.descricao}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-5">
            <Link
              href={resultado.linkExplorar}
              className="inline-flex items-center rounded-full bg-main px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {resultado.labelExplorar}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
