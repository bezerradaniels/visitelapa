"use client";

import { useState } from "react";
import type { BuscaIAResultado } from "@/tipos/busca-ia";

export function useBuscaIA() {
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<BuscaIAResultado | null>(null);

  async function buscar(texto: string) {
    const termo = texto.trim();
    if (!termo) return;

    setCarregando(true);
    setResultado(null);
    try {
      const res = await fetch("/api/busca-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: termo }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro ?? "Falha ao buscar sugestões");
      }

      setResultado(data as BuscaIAResultado);
    } catch {
      setResultado({
        dominio: "negocios",
        filtro: "Todos",
        mensagem:
          "Tive uma instabilidade rápida aqui, mas você ainda pode explorar alguns conteúdos do portal pelo link abaixo.",
        labelExplorar: "Explorar conteúdos",
        linkExplorar: "/negocios",
        sugestoes: [],
      });
    } finally {
      setCarregando(false);
    }
  }

  return { pergunta, setPergunta, carregando, buscar, resultado };
}
