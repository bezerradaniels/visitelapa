import { SecaoBlog } from "@/dados/blog";
import { ImageCropFocus, ImageFieldItem, ImageFieldValue } from "@/tipos/plataforma";

const FOCOS_IMAGEM_VALIDOS = new Set<ImageCropFocus>([
  "center",
  "top",
  "bottom",
  "left",
  "right",
]);

const TAGS_PERMITIDAS = new Set([
  "p",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "s",
  "u",
  "a",
  "figure",
  "img",
  "br",
  "hr",
]);

const TAGS_AUTOCONTIDAS = new Set(["br", "hr", "img"]);

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodificarEntidadesBasicas(texto: string): string {
  return texto
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function extrairAtributo(attrs: string, nome: string): string {
  const quotedMatch = attrs.match(new RegExp(`${nome}\\s*=\\s*(['"])(.*?)\\1`, "i"));

  if (quotedMatch) {
    return quotedMatch[2]?.trim() ?? "";
  }

  const unquotedMatch = attrs.match(new RegExp(`${nome}\\s*=\\s*([^\\s>]+)`, "i"));
  return unquotedMatch?.[1]?.trim() ?? "";
}

function hrefEhSeguro(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(href);
}

function srcEhSeguro(src: string): boolean {
  return /^(https?:\/\/|\/|data:image\/)/i.test(src);
}

function normalizarTextoLivreComoHtml(texto: string): string {
  return texto
    .split(/\n\s*\n/)
    .map((bloco) => bloco.trim())
    .filter(Boolean)
    .map((bloco) => `<p>${escapeHtml(bloco).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function criarIdImagemPadrao(indice: number): string {
  return `blog-imagem-${indice + 1}`;
}

function nomeImagemPadrao(indice: number): string {
  return `Imagem ${indice + 1}`;
}

export function normalizarHtmlBlog(value: unknown): string {
  const texto = typeof value === "string" ? value.trim() : "";

  if (!texto) {
    return "";
  }

  if (!texto.includes("<")) {
    return normalizarTextoLivreComoHtml(texto);
  }

  let sanitizado = texto
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\s*(script|style|iframe|object|embed|form|input|button|textarea|select)\b[^>]*>[\s\S]*?<\s*\/\s*\1>/gi,
      ""
    )
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select)\b[^>]*\/?>/gi, "")
    .replace(/<(\/?)b(\s|>)/gi, "<$1strong$2")
    .replace(/<(\/?)i(\s|>)/gi, "<$1em$2")
    .replace(/<(\/?)strike(\s|>)/gi, "<$1s$2")
    .replace(/<(\/?)div(\s|>)/gi, "<$1p$2")
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]+/gi, "");

  sanitizado = sanitizado.replace(/<([a-z0-9]+)([^>]*)>/gi, (_match, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();

    if (!TAGS_PERMITIDAS.has(tag)) {
      return "";
    }

    if (tag === "br" || tag === "hr") {
      return `<${tag}>`;
    }

    if (tag === "img") {
      const src = extrairAtributo(rawAttrs, "src");
      const alt = extrairAtributo(rawAttrs, "alt");
      const title = extrairAtributo(rawAttrs, "title");

      if (!src || !srcEhSeguro(src)) {
        return "";
      }

      const atributos = [`src="${escapeHtml(src)}"`];

      if (alt) {
        atributos.push(`alt="${escapeHtml(alt)}"`);
      }

      if (title) {
        atributos.push(`title="${escapeHtml(title)}"`);
      }

      return `<img ${atributos.join(" ")}>`;
    }

    if (tag === "a") {
      const href = extrairAtributo(rawAttrs, "href");

      if (!href || !hrefEhSeguro(href) || /^javascript:/i.test(href)) {
        return "<a>";
      }

      return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer noopener">`;
    }

    if (tag === "figure") {
      const dataType = extrairAtributo(rawAttrs, "data-type");

      if (dataType === "gallery-block") {
        return `<figure data-type="gallery-block">`;
      }
    }

    return `<${tag}>`;
  });

  sanitizado = sanitizado.replace(/<\/([a-z0-9]+)\s*>/gi, (_match, rawTag) => {
    const tag = String(rawTag).toLowerCase();

    if (!TAGS_PERMITIDAS.has(tag) || TAGS_AUTOCONTIDAS.has(tag)) {
      return "";
    }

    return `</${tag}>`;
  });

  sanitizado = sanitizado
    .replace(/<(p|h2|h3|blockquote)>\s*(<br>|\s|&nbsp;)*<\/\1>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!sanitizado) {
    return "";
  }

  if (!/<(p|h2|h3|ul|ol|blockquote|hr|img|figure)\b/i.test(sanitizado)) {
    const textoSemTags = extrairTextoHtmlBlog(sanitizado);
    return textoSemTags ? normalizarTextoLivreComoHtml(textoSemTags) : "";
  }

  return sanitizado;
}

export function extrairTextoHtmlBlog(value: unknown): string {
  const html = normalizarHtmlBlog(value);

  if (!html) {
    return "";
  }

  return decodificarEntidadesBasicas(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|h2|h3|blockquote)>/gi, "\n\n")
      .replace(/<\/(ul|ol)>/gi, "\n\n")
      .replace(/<li>/gi, "• ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<hr\s*\/?>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function htmlParaParagrafosBlog(value: unknown): string[] {
  const texto = extrairTextoHtmlBlog(value);

  if (!texto) {
    return [];
  }

  return texto
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function calcularTempoLeituraBlog(value: unknown): string {
  const palavras = extrairTextoHtmlBlog(value)
    .split(/\s+/)
    .filter(Boolean).length;

  if (!palavras) {
    return "";
  }

  const minutos = Math.max(1, Math.ceil(palavras / 200));
  return `${minutos} min`;
}

export function montarHtmlLegadoBlog(
  conteudo: string[] = [],
  secoes: SecaoBlog[] = [],
  fechamento = ""
): string {
  const blocos: string[] = [];

  for (const paragrafo of conteudo) {
    const texto = paragrafo.trim();

    if (!texto) {
      continue;
    }

    blocos.push(`<p>${escapeHtml(texto).replace(/\n/g, "<br>")}</p>`);
  }

  for (const secao of secoes) {
    const titulo = secao.titulo.trim();
    const texto = secao.texto.trim();

    if (titulo) {
      blocos.push(`<h2>${escapeHtml(titulo)}</h2>`);
    }

    if (texto) {
      blocos.push(
        ...texto
          .split(/\n\s*\n/)
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => `<p>${escapeHtml(item).replace(/\n/g, "<br>")}</p>`)
      );
    }
  }

  if (fechamento.trim()) {
    blocos.push(`<p>${escapeHtml(fechamento.trim()).replace(/\n/g, "<br>")}</p>`);
  }

  return blocos.join("");
}

function ehCropFocusValido(value: unknown): value is ImageCropFocus {
  return typeof value === "string" && FOCOS_IMAGEM_VALIDOS.has(value as ImageCropFocus);
}

export function normalizarGaleriaBlog(value: unknown): ImageFieldValue {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, indice) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const imagem = item as Partial<ImageFieldItem>;
      const src = typeof imagem.src === "string" ? imagem.src.trim() : "";

      if (!src) {
        return null;
      }

      const zoom =
        typeof imagem.zoom === "number" && Number.isFinite(imagem.zoom)
          ? Math.min(Math.max(imagem.zoom, 1), 2)
          : 1;

      return {
        id:
          typeof imagem.id === "string" && imagem.id.trim()
            ? imagem.id.trim()
            : criarIdImagemPadrao(indice),
        name:
          typeof imagem.name === "string" && imagem.name.trim()
            ? imagem.name.trim()
            : nomeImagemPadrao(indice),
        src,
        cropFocus: ehCropFocusValido(imagem.cropFocus) ? imagem.cropFocus : "center",
        zoom,
      };
    })
    .filter((item): item is ImageFieldItem => Boolean(item));
}

export function criarValorInicialImagemBlog(
  src: unknown,
  nomePadrao = "Imagem atual"
): ImageFieldValue {
  const url = typeof src === "string" ? src.trim() : "";

  if (!url) {
    return [];
  }

  return [
    {
      id: criarIdImagemPadrao(0),
      name: nomePadrao,
      src: url,
      cropFocus: "center" as const,
      zoom: 1,
    },
  ];
}
