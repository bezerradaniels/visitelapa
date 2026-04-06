"use client";

import { RichTextMediaItem } from "./tipos";

function normalizarAlt(texto: string) {
  return texto
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function srcMidiaEhSeguro(src: string) {
  return /^(https?:\/\/|\/|data:image\/)/i.test(src);
}

export function normalizarRichTextMediaItems(value: unknown): RichTextMediaItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const media = item as Partial<RichTextMediaItem>;
      const src = typeof media.src === "string" ? media.src.trim() : "";

      if (!src || !srcMidiaEhSeguro(src)) {
        return null;
      }

      const alt = typeof media.alt === "string" ? media.alt.trim() : "";
      const title = typeof media.title === "string" ? media.title.trim() : "";

      return {
        src,
        alt: alt || "Imagem do post",
        ...(title ? { title } : {}),
      };
    })
    .filter((item): item is RichTextMediaItem => Boolean(item));
}

function lerArquivoComoDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Nao foi possivel carregar a imagem."));

    reader.readAsDataURL(file);
  });
}

export async function arquivosParaMidia(files: File[]) {
  const imagens = files.filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    imagens.map(async (file) => ({
      src: await lerArquivoComoDataUrl(file),
      alt: normalizarAlt(file.name) || "Imagem do post",
      title: file.name,
    }))
  );
}
