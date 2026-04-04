"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useBuscaIA() {
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function buscar(texto: string) {
    const termo = texto.trim();
    if (!termo) return;

    setCarregando(true);
    try {
      const res = await fetch("/api/busca-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: termo }),
      });
      const { dominio, filtro } = await res.json();
      const url = filtro && filtro !== "Todos"
        ? `/${dominio}?filtro=${encodeURIComponent(filtro)}`
        : `/${dominio}`;
      router.push(url);
    } catch {
      router.push("/negocios");
    } finally {
      setCarregando(false);
    }
  }

  return { pergunta, setPergunta, carregando, buscar };
}