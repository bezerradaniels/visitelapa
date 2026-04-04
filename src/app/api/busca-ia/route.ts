import { NextRequest, NextResponse } from "next/server";
import { listarFiltrosBlog } from "@/servicos/blog";
import { listarFiltrosEventos } from "@/servicos/eventos";
import { listarFiltrosHoteis } from "@/servicos/hoteis";
import { listarFiltrosNegocios } from "@/servicos/negocios";
import { listarFiltrosRestaurantes } from "@/servicos/restaurantes";
import { listarFiltrosTurismo } from "@/servicos/turismo";

function extrairJSON(texto: string): { dominio: string; filtro: string } {
  const limpo = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const match = limpo.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("Nenhum JSON encontrado");
  return JSON.parse(match[0]);
}

export async function POST(req: NextRequest) {
  const { pergunta } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;

  if (!pergunta) {
    return NextResponse.json({ erro: "Pergunta vazia" }, { status: 400 });
  }

  const [fHoteis, fRestaurantes, fNegocios, fTurismo, fEventos, fBlog] = await Promise.all([
    listarFiltrosHoteis(),
    listarFiltrosRestaurantes(),
    listarFiltrosNegocios(),
    listarFiltrosTurismo(),
    listarFiltrosEventos(),
    listarFiltrosBlog(),
  ]);

  const DOMINIOS = [
    { dominio: "hoteis", filtros: fHoteis.map((f) => f.label) },
    { dominio: "restaurantes", filtros: fRestaurantes.map((f) => f.label) },
    { dominio: "negocios", filtros: fNegocios.map((f) => f.label) },
    { dominio: "turismo", filtros: fTurismo.map((f) => f.label) },
    { dominio: "eventos", filtros: fEventos.map((f) => f.label) },
    { dominio: "blog", filtros: fBlog.map((f) => f.label) },
  ];

  function normalizarResultado(resultado: { dominio: string; filtro: string }) {
    const dominioEncontrado = DOMINIOS.find((item) => item.dominio === resultado.dominio);
    if (!dominioEncontrado) {
      return { dominio: "negocios", filtro: "Todos" };
    }
    return {
      dominio: dominioEncontrado.dominio,
      filtro: dominioEncontrado.filtros.includes(resultado.filtro)
        ? resultado.filtro
        : "Todos",
    };
  }

  if (!apiKey) {
    return NextResponse.json({ erro: "Chave da API não configurada" }, { status: 500 });
  }

  const prompt = `
Você é um assistente do portal de turismo "Visite Lapa" de Bom Jesus da Lapa, BA.

O usuário digitou: "${pergunta}"

Com base na pergunta, escolha o domínio e filtro mais adequado entre as opções abaixo:
${JSON.stringify(DOMINIOS, null, 2)}

Responda APENAS com um JSON no formato:
{ "dominio": "hoteis", "filtro": "Pousada" }

Se nenhum filtro específico fizer sentido, use "Todos".

Não use markdown. Não use blocos de código. Não explique. Apenas o JSON puro.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ dominio: "negocios", filtro: "Todos" });
  }

  try {
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      throw new Error("Resposta vazia da IA");
    }

    const resultado = extrairJSON(texto);
    return NextResponse.json(normalizarResultado(resultado));
  } catch (err) {
    console.error("[busca-ia] erro ao processar resposta:", err);
    return NextResponse.json({ dominio: "negocios", filtro: "Todos" });
  }
}
