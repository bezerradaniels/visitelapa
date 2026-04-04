"use client";

import Image from "next/image";
import { ChangeEvent, useId, useRef } from "react";
import { assetsEstaticos } from "@/dados/assets";
import {
  ImageCropFocus,
  ImageFieldItem,
  ImageFieldValue,
} from "@/tipos/plataforma";
import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

const ASPECT_RATIO_CLASSES = {
  "1:1": "aspect-square",
  "16:10": "aspect-[16/10]",
} as const;

const OBJECT_POSITIONS: Record<ImageCropFocus, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

const FOCUS_OPTIONS: Array<{
  label: string;
  value: ImageCropFocus;
}> = [
  { label: "Centro", value: "center" },
  { label: "Topo", value: "top" },
  { label: "Base", value: "bottom" },
  { label: "Esquerda", value: "left" },
  { label: "Direita", value: "right" },
];

function isImageFieldValue(value: FieldComponentProps["value"]): value is ImageFieldValue {
  return Array.isArray(value);
}

function criarIdImagem(file: File) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${file.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
}

function lerArquivoComoDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Nao foi possivel carregar a imagem."));

    reader.readAsDataURL(file);
  });
}

export default function CampoImagem({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const imagens = isImageFieldValue(value) ? value : [];
  const aspectRatio = field.aspectRatio ?? "16:10";
  const maxFiles = field.maxFiles ?? (field.kind === "image-gallery" ? 10 : 1);
  const isGallery = field.kind === "image-gallery";
  const placeholderSrc = field.placeholderSrc ?? assetsEstaticos.placeholders.cardPadrao;
  const limiteAtingido = isGallery && imagens.length >= maxFiles;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingSlots = isGallery ? Math.max(maxFiles - imagens.length, 0) : 1;
    const files = selectedFiles.slice(0, remainingSlots);

    const nextImages = await Promise.all(
      files.map(async (file) => ({
        id: criarIdImagem(file),
        name: file.name,
        src: await lerArquivoComoDataUrl(file),
        cropFocus: "center" as const,
        zoom: 1,
      }))
    );

    const nextValue = isGallery
      ? [...imagens, ...nextImages].slice(0, maxFiles)
      : nextImages.slice(0, 1);

    onChange(field.name, nextValue);
    event.target.value = "";
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function atualizarImagem(id: string, patch: Partial<ImageFieldItem>) {
    onChange(
      field.name,
      imagens.map((imagem) => (imagem.id === id ? { ...imagem, ...patch } : imagem))
    );
  }

  function removerImagem(id: string) {
    onChange(
      field.name,
      imagens.filter((imagem) => imagem.id !== id)
    );
  }

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={field.accept ?? "image/*"}
        multiple={isGallery}
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={limiteAtingido}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-main transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {imagens.length > 0
              ? isGallery
                ? limiteAtingido
                  ? "Limite atingido"
                  : "Adicionar"
                : "Trocar"
              : field.buttonLabel ?? "Selecionar"}
          </button>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {isGallery
              ? `${imagens.length}/${maxFiles} imagens`
              : imagens.length > 0
                ? "1 imagem"
                : "0 imagens"}
          </p>
        </div>

        {imagens.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 p-4">
            <div
              className={`relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white ${ASPECT_RATIO_CLASSES[aspectRatio]}`}
            >
              <Image
                src={placeholderSrc}
                alt={`Placeholder de ${field.label.toLowerCase()}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Nenhuma imagem enviada. Um placeholder simples sera usado enquanto este
              campo estiver vazio.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {imagens.map((imagem, index) => (
              <article
                key={imagem.id}
                className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-main">
                      {imagem.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {field.kind === "image-gallery" ? `Imagem ${index + 1}` : "Imagem principal"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removerImagem(imagem.id)}
                    className="text-xs font-semibold text-slate-500 transition hover:text-main"
                  >
                    Remover
                  </button>
                </div>

                <div
                  className={`relative mt-4 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white ${ASPECT_RATIO_CLASSES[aspectRatio]}`}
                >
                  <Image
                    src={imagem.src}
                    alt={imagem.name}
                    fill
                    unoptimized
                    className="object-cover transition"
                    style={{
                      objectPosition: OBJECT_POSITIONS[imagem.cropFocus],
                      transform: `scale(${imagem.zoom})`,
                    }}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,180px)_1fr]">
                  <div className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Enquadramento
                    </span>
                    <select
                      value={imagem.cropFocus}
                      onChange={(event) =>
                        atualizarImagem(imagem.id, {
                          cropFocus: event.target.value as ImageCropFocus,
                        })
                      }
                      className="w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
                    >
                      {FOCUS_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Zoom
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {imagem.zoom.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.1"
                      value={imagem.zoom}
                      onChange={(event) =>
                        atualizarImagem(imagem.id, {
                          zoom: Number(event.target.value),
                        })
                      }
                      className="w-full accent-slate-900"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
