import { NextRequest, NextResponse } from "next/server";
import { listarBlog } from "@/servicos/blog";
import { listarEventos } from "@/servicos/eventos";
import { listarHoteis } from "@/servicos/hoteis";
import { listarNegocios } from "@/servicos/negocios";
import { listarRestaurantes } from "@/servicos/restaurantes";
import { criarFiltrosPorCategoria } from "@/servicos/utils";
import type { BuscaIADominio, BuscaIAResultado, BuscaIASugestao } from "@/tipos/busca-ia";

type ClassificacaoBuscaIA = {
  dominio: BuscaIADominio;
  filtro: string;
  termos?: string[];
};

type ItemBuscaIA = {
  titulo: string;
  descricao: string;
  categoria: string;
  href: string;
  termos: string[];
  destaque: boolean;
  ordem: number;
};

type DominioBuscaIA = {
  dominio: BuscaIADominio;
  rotulo: string;
  palavrasChave: string[];
  filtros: string[];
  linkLista: string;
  itens: ItemBuscaIA[];
};

const STOPWORDS = new Set([
  "a",
  "as",
  "o",
  "os",
  "ao",
  "aos",
  "de",
  "da",
  "das",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "para",
  "por",
  "com",
  "sem",
  "um",
  "uma",
  "uns",
  "umas",
  "me",
  "meu",
  "minha",
  "quero",
  "queria",
  "procuro",
  "buscar",
  "busco",
  "indique",
  "indicar",
  "sugira",
  "sugestao",
  "sugestoes",
  "perto",
  "sobre",
]);

function extrairJSON(texto: string): ClassificacaoBuscaIA {
  const limpo = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const match = limpo.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("Nenhum JSON encontrado");
  return JSON.parse(match[0]);
}

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extrairTokens(texto: string) {
  return Array.from(
    new Set(
      normalizarTexto(texto)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 2 && !STOPWORDS.has(token))
    )
  );
}

function calcularScoreTexto(texto: string, tokens: string[]) {
  return tokens.reduce((score, token) => (texto.includes(token) ? score + 1 : score), 0);
}

function calcularScoreItem(item: ItemBuscaIA, pergunta: string, tokens: string[], filtro: string) {
  const perguntaNormalizada = normalizarTexto(pergunta);
  const titulo = normalizarTexto(item.titulo);
  const descricao = normalizarTexto(item.descricao);
  const categoria = normalizarTexto(item.categoria);
  const termos = normalizarTexto(item.termos.join(" "));

  let score = 0;

  if (perguntaNormalizada && (titulo.includes(perguntaNormalizada) || descricao.includes(perguntaNormalizada))) {
    score += 18;
  }

  score += calcularScoreTexto(titulo, tokens) * 8;
  score += calcularScoreTexto(categoria, tokens) * 6;
  score += calcularScoreTexto(descricao, tokens) * 4;
  score += calcularScoreTexto(termos, tokens) * 3;

  if (filtro !== "Todos" && categoria === normalizarTexto(filtro)) {
    score += 12;
  }

  if (item.destaque) {
    score += 2;
  }

  return score;
}

function escolherFiltroLocalmente(pergunta: string, dominio: DominioBuscaIA) {
  const perguntaNormalizada = normalizarTexto(pergunta);
  const filtroEncontrado = dominio.filtros.find((filtro) => {
    if (filtro === "Todos") return false;
    return perguntaNormalizada.includes(normalizarTexto(filtro));
  });

  return filtroEncontrado ?? "Todos";
}

function classificarBuscaLocalmente(pergunta: string, dominios: DominioBuscaIA[]): ClassificacaoBuscaIA {
  const tokens = extrairTokens(pergunta);

  const melhorDominio = dominios
    .map((dominio) => {
      const scorePalavrasChave = dominio.palavrasChave.reduce((score, palavra) => {
        return normalizarTexto(pergunta).includes(normalizarTexto(palavra)) ? score + 10 : score;
      }, 0);
      const melhoresItens = dominio.itens
        .map((item) => calcularScoreItem(item, pergunta, tokens, "Todos"))
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((total, score) => total + score, 0);

      return {
        dominio: dominio.dominio,
        filtro: escolherFiltroLocalmente(pergunta, dominio),
        score: scorePalavrasChave + melhoresItens,
      };
    })
    .sort((a, b) => b.score - a.score)[0];

  if (!melhorDominio || melhorDominio.score <= 0) {
    return { dominio: "negocios", filtro: "Todos", termos: tokens };
  }

  return {
    dominio: melhorDominio.dominio,
    filtro: melhorDominio.filtro,
    termos: tokens,
  };
}

function criarMensagem(
  rotulo: string,
  filtro: string,
  totalSugestoes: number,
  encontrouNoFiltro: boolean
) {
  if (totalSugestoes === 0) {
    return `Ainda não encontrei publicações exatamente com esse recorte, mas deixei um atalho para você explorar mais conteúdos sobre ${rotulo}.`;
  }

  if (filtro !== "Todos" && !encontrouNoFiltro) {
    return `Não encontrei publicações exatamente na categoria ${filtro}, mas separei algumas sugestões próximas em ${rotulo} para te ajudar melhor.`;
  }

  if (filtro !== "Todos") {
    return `Separei algumas publicações da categoria ${filtro} que combinam com o que você pediu. Espero que elas ajudem na sua busca.`;
  }

  return `Separei algumas sugestões de ${rotulo} que podem combinar com o seu pedido. Dá uma olhada nos links abaixo.`;
}

function montarLinkExplorar(dominio: BuscaIADominio, filtro: string) {
  if (filtro !== "Todos") {
    return `/${dominio}?filtro=${encodeURIComponent(filtro)}`;
  }

  return `/${dominio}`;
}

export async function POST(req: NextRequest) {
  const { pergunta } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!pergunta) {
    return NextResponse.json({ erro: "Pergunta vazia" }, { status: 400 });
  }

  const [hoteis, restaurantes, negocios, eventos, blog] = await Promise.all([
    listarHoteis(),
    listarRestaurantes(),
    listarNegocios(),
    listarEventos(),
    listarBlog(),
  ]);

  const dominios: DominioBuscaIA[] = [
    {
      dominio: "hoteis",
      rotulo: "hotéis",
      palavrasChave: ["hotel", "hoteis", "pousada", "hospedagem", "quarto"],
      filtros: criarFiltrosPorCategoria(hoteis).map((item) => item.label),
      linkLista: "/hoteis",
      itens: hoteis.map((item, ordem) => ({
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        href: `/hoteis/${item.slug}`,
        termos: [item.descricao, item.localizacao, item.contato, ...item.comodidades, ...item.diferenciais],
        destaque: Boolean(item.destaqueListagem),
        ordem,
      })),
    },
    {
      dominio: "restaurantes",
      rotulo: "restaurantes",
      palavrasChave: ["restaurante", "restaurantes", "comida", "almoco", "jantar", "lanche"],
      filtros: criarFiltrosPorCategoria(restaurantes).map((item) => item.label),
      linkLista: "/restaurantes",
      itens: restaurantes.map((item, ordem) => ({
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        href: `/restaurantes/${item.slug}`,
        termos: [item.descricao, item.endereco, item.funcionamento, item.contato, ...item.especialidades, ...item.diferenciais],
        destaque: Boolean(item.destaqueListagem),
        ordem,
      })),
    },
    {
      dominio: "negocios",
      rotulo: "negócios locais",
      palavrasChave: ["negocio", "negocios", "empresa", "servico", "servicos", "loja"],
      filtros: criarFiltrosPorCategoria(negocios).map((item) => item.label),
      linkLista: "/negocios",
      itens: negocios.map((item, ordem) => ({
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        href: `/negocios/${item.slug}`,
        termos: [item.descricao, item.endereco, item.atendimento, item.contato, ...item.especialidades, ...item.diferenciais],
        destaque: Boolean(item.destaqueListagem),
        ordem,
      })),
    },
    {
      dominio: "eventos",
      rotulo: "eventos",
      palavrasChave: ["evento", "eventos", "show", "agenda", "programacao", "festa"],
      filtros: criarFiltrosPorCategoria(eventos).map((item) => item.label),
      linkLista: "/eventos",
      itens: eventos.map((item, ordem) => ({
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        href: `/eventos/${item.slug}`,
        termos: [item.descricao, item.data, item.local, item.contato, ...item.programacao, ...item.destaques],
        destaque: Boolean(item.destaqueListagem),
        ordem,
      })),
    },
    {
      dominio: "blog",
      rotulo: "artigos do blog",
      palavrasChave: ["blog", "artigo", "artigos", "noticia", "noticias", "dica", "dicas", "guia"],
      filtros: criarFiltrosPorCategoria(blog).map((item) => item.label),
      linkLista: "/blog",
      itens: blog.map((item, ordem) => ({
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        href: `/blog/${item.slug}`,
        termos: [item.autor, item.leitura, item.fechamento, ...item.conteudo],
        destaque: Boolean(item.destaqueListagem),
        ordem,
      })),
    },
  ];

  function normalizarResultado(resultado: ClassificacaoBuscaIA) {
    const fallback = classificarBuscaLocalmente(pergunta, dominios);
    const dominioEncontrado = dominios.find((item) => item.dominio === resultado.dominio);

    if (!dominioEncontrado) {
      return fallback;
    }

    return {
      dominio: dominioEncontrado.dominio,
      filtro: dominioEncontrado.filtros.includes(resultado.filtro)
        ? resultado.filtro
        : escolherFiltroLocalmente(pergunta, dominioEncontrado),
      termos: resultado.termos?.flatMap(extrairTokens) ?? fallback.termos,
    };
  }

  const fallback = classificarBuscaLocalmente(pergunta, dominios);

  let classificacao = fallback;

  if (apiKey) {
    const prompt = `
Você é um assistente do portal "Visite Lapa" de Bom Jesus da Lapa, BA.

O usuário digitou: "${pergunta}"

Com base na pergunta, escolha o domínio e filtro mais adequado entre as opções abaixo:
${JSON.stringify(
  dominios.map((item) => ({
    dominio: item.dominio,
    filtros: item.filtros,
  })),
  null,
  2
)}

Extraia também até 6 termos curtos que ajudem a rankear conteúdos relacionados.

Responda APENAS com um JSON no formato:
{ "dominio": "hoteis", "filtro": "Pousada", "termos": ["santuario", "familia"] }

Se nenhum filtro específico fizer sentido, use "Todos".
Não use markdown. Não use blocos de código. Não explique. Apenas o JSON puro.
`;

    try {
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

      if (response.ok) {
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (texto) {
          classificacao = normalizarResultado(extrairJSON(texto));
        }
      }
    } catch (error) {
      console.error("[busca-ia] erro ao classificar busca:", error);
    }
  }

  const dominioSelecionado =
    dominios.find((item) => item.dominio === classificacao.dominio) ??
    dominios.find((item) => item.dominio === fallback.dominio)!;
  const tokens = Array.from(
    new Set([
      ...extrairTokens(pergunta),
      ...(classificacao.termos ?? []).flatMap(extrairTokens),
      ...extrairTokens(classificacao.filtro === "Todos" ? "" : classificacao.filtro),
    ])
  );
  const itensFiltrados = dominioSelecionado.itens.filter((item) => {
    return classificacao.filtro === "Todos" || item.categoria === classificacao.filtro;
  });
  const encontrouNoFiltro =
    classificacao.filtro === "Todos" || itensFiltrados.length > 0;
  const itensParaOrdenar = encontrouNoFiltro
    ? itensFiltrados
    : dominioSelecionado.itens;

  const sugestoes: BuscaIASugestao[] = itensParaOrdenar
    .map((item) => ({
      item,
      score: calcularScoreItem(item, pergunta, tokens, classificacao.filtro),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.item.destaque !== b.item.destaque) return Number(b.item.destaque) - Number(a.item.destaque);
      return a.item.ordem - b.item.ordem;
    })
    .slice(0, 3)
    .map(({ item }) => ({
      dominio: dominioSelecionado.dominio,
      titulo: item.titulo,
      descricao: item.descricao,
      categoria: item.categoria,
      href: item.href,
    }));

  const linkExplorar = montarLinkExplorar(dominioSelecionado.dominio, classificacao.filtro);
  const resultado: BuscaIAResultado = {
    dominio: dominioSelecionado.dominio,
    filtro: classificacao.filtro,
    mensagem: criarMensagem(
      dominioSelecionado.rotulo,
      classificacao.filtro,
      sugestoes.length,
      encontrouNoFiltro
    ),
    labelExplorar:
      classificacao.filtro !== "Todos"
        ? `Ver mais em ${classificacao.filtro}`
        : `Explorar ${dominioSelecionado.rotulo}`,
    linkExplorar,
    sugestoes,
  };

  return NextResponse.json(resultado);
}
