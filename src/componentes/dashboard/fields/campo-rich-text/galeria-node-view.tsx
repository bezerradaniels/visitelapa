"use client";

import Image from "next/image";
import { ChangeEvent, useId, useRef } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { arquivosParaMidia, normalizarRichTextMediaItems } from "./utils";

export default function GaleriaNodeView({
  node,
  selected,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const imagens = normalizarRichTextMediaItems(node.attrs.images);

  function abrirSeletor() {
    inputRef.current?.click();
  }

  async function handleAdicionar(event: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(event.target.files ?? []);

    if (!arquivos.length) {
      return;
    }

    const novasImagens = await arquivosParaMidia(arquivos);

    if (!novasImagens.length) {
      event.target.value = "";
      return;
    }

    updateAttributes({
      images: [...imagens, ...novasImagens].slice(0, 12),
    });
    event.target.value = "";
  }

  function removerImagem(indice: number) {
    const restantes = imagens.filter((_, itemIndice) => itemIndice !== indice);

    if (!restantes.length) {
      deleteNode();
      return;
    }

    updateAttributes({
      images: restantes,
    });
  }

  return (
    <NodeViewWrapper
      className={`my-6 rounded-[28px] border bg-white p-4 ${
        selected ? "border-sky-300 shadow-[0_0_0_4px_rgba(56,182,255,0.12)]" : "border-slate-200"
      }`}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleAdicionar}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Galeria no conteúdo
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {imagens.length} {imagens.length === 1 ? "imagem" : "imagens"} neste bloco
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={abrirSeletor}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-main transition hover:border-slate-300 hover:bg-slate-50"
          >
            Adicionar imagens
          </button>
          <button
            type="button"
            onClick={deleteNode}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Remover bloco
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {imagens.map((imagem, indice) => (
          <figure
            key={`${imagem.src}-${indice}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={imagem.src}
                alt={imagem.alt}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="truncate text-xs font-medium text-slate-600">
                {imagem.alt}
              </span>
              <button
                type="button"
                onClick={() => removerImagem(indice)}
                className="shrink-0 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
              >
                Remover
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </NodeViewWrapper>
  );
}
