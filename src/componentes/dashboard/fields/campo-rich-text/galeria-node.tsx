"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import GaleriaNodeView from "./galeria-node-view";
import { RichTextMediaItem } from "./tipos";
import { normalizarRichTextMediaItems } from "./utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    galleryBlock: {
      setGalleryBlock: (images: RichTextMediaItem[]) => ReturnType;
    };
  }
}

export const GaleriaNode = Node.create({
  name: "galleryBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element) => {
          const imagens = Array.from(element.querySelectorAll("img")).map((imagem) => ({
            src: imagem.getAttribute("src") ?? "",
            alt: imagem.getAttribute("alt") ?? "Imagem da galeria",
            title: imagem.getAttribute("title") ?? "",
          }));

          return normalizarRichTextMediaItems(imagens);
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-type='gallery-block']",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const imagens = normalizarRichTextMediaItems(node.attrs.images);

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": "gallery-block",
        "data-count": String(imagens.length),
      }),
      ...imagens.map((imagem) => [
        "img",
        {
          src: imagem.src,
          alt: imagem.alt,
          title: imagem.title ?? null,
        },
      ]),
    ];
  },

  addCommands() {
    return {
      setGalleryBlock:
        (images) =>
        ({ commands }) =>
          commands.insertContent([
            {
              type: this.name,
              attrs: {
                images: normalizarRichTextMediaItems(images),
              },
            },
            {
              type: "paragraph",
            },
          ]),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(GaleriaNodeView);
  },
});
