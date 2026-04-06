"use client";

import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChangeEvent, useEffect, useRef } from "react";
import { GaleriaNode } from "./galeria-node";
import { arquivosParaMidia } from "./utils";
import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

type ToolbarButtonProps = {
  label: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-w-9 items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm"
          : "border-slate-200 bg-white text-main hover:border-slate-300 hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-45`}
    >
      {label}
    </button>
  );
}

function garantirProtocolo(url: string) {
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export default function CampoRichText({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const currentValue = typeof value === "string" ? value : "";
  const placeholder = field.placeholder ?? "Escreva o conteúdo do artigo aqui...";
  const onChangeRef = useRef(onChange);
  const fieldNameRef = useRef(field.name);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    fieldNameRef.current = field.name;
  }, [field.name]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        code: false,
        codeBlock: false,
      }),
      Underline,
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          "data-type": "post-image",
        },
      }),
      GaleriaNode,
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          rel: "noreferrer noopener",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: currentValue || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "tiptap-rich-editor min-h-[360px] px-5 py-4 text-sm leading-7 text-main outline-none [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-slate-400 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_a]:font-semibold [&_a]:text-sky-700 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-main [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-main [&_hr]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChangeRef.current(fieldNameRef.current, currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const htmlAtual = editor.getHTML();
    const proximoHtml = currentValue || "<p></p>";

    if (htmlAtual !== proximoHtml) {
      editor.commands.setContent(proximoHtml, {
        emitUpdate: false,
      });
    }
  }, [currentValue, editor]);

  function inserirLink() {
    if (!editor) {
      return;
    }

    const hrefAtual = editor.getAttributes("link").href as string | undefined;
    const resposta = window.prompt("Informe a URL do link", hrefAtual ?? "");
    const url = resposta?.trim();

    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: garantirProtocolo(url) })
      .run();
  }

  async function handleImagemSelecionada(event: ChangeEvent<HTMLInputElement>) {
    if (!editor) {
      return;
    }

    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const [imagem] = await arquivosParaMidia([arquivo]);

    if (imagem) {
      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "image",
            attrs: {
              src: imagem.src,
              alt: imagem.alt,
              title: imagem.title,
            },
          },
          {
            type: "paragraph",
          },
        ])
        .run();
    }

    event.target.value = "";
  }

  async function handleGaleriaSelecionada(event: ChangeEvent<HTMLInputElement>) {
    if (!editor) {
      return;
    }

    const arquivos = Array.from(event.target.files ?? []);

    if (!arquivos.length) {
      return;
    }

    const imagens = await arquivosParaMidia(arquivos);

    if (imagens.length) {
      editor.chain().focus().setGalleryBlock(imagens).run();
    }

    event.target.value = "";
  }

  const palavras = editor
    ? editor
        .getText()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  if (!editor) {
    return (
      <FieldWrapper
        label={field.label}
        description={field.description}
        error={error}
        required={field.required}
      >
        <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-white" />
      </FieldWrapper>
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
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImagemSelecionada}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleGaleriaSelecionada}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="space-y-3 border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-4">
          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              label="P"
              title="Parágrafo"
              active={editor.isActive("paragraph")}
              onClick={() => editor.chain().focus().setParagraph().run()}
            />
            <ToolbarButton
              label="H2"
              title="Título nível 2"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              label="H3"
              title="Título nível 3"
              active={editor.isActive("heading", { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            />
            <ToolbarButton
              label="B"
              title="Negrito"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              label="I"
              title="Itálico"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              label="U"
              title="Sublinhado"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ToolbarButton
              label="S"
              title="Riscado"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              label="Lista"
              title="Lista com marcadores"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              label="Num."
              title="Lista numerada"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              label="Citação"
              title="Citação"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
              label="Link"
              title="Inserir ou editar link"
              active={editor.isActive("link")}
              onClick={inserirLink}
            />
            <ToolbarButton
              label="Imagem"
              title="Adicionar imagem ao conteúdo"
              onClick={() => imageInputRef.current?.click()}
            />
            <ToolbarButton
              label="Galeria"
              title="Adicionar galeria ao conteúdo"
              onClick={() => galleryInputRef.current?.click()}
            />
            <ToolbarButton
              label="Rem. link"
              title="Remover link"
              disabled={!editor.isActive("link")}
              onClick={() => editor.chain().focus().unsetLink().run()}
            />
            <ToolbarButton
              label="Linha"
              title="Inserir linha horizontal"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />
            <ToolbarButton
              label="Limpar"
              title="Remover formatação"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-500">
              Atalhos: `Cmd/Ctrl + B`, `I`, `U`, listas, links e histórico nativo do editor.
            </p>

            <div className="flex flex-wrap gap-2">
              <ToolbarButton
                label="Desfazer"
                title="Desfazer"
                disabled={!editor.can().chain().focus().undo().run()}
                onClick={() => editor.chain().focus().undo().run()}
              />
              <ToolbarButton
                label="Refazer"
                title="Refazer"
                disabled={!editor.can().chain().focus().redo().run()}
                onClick={() => editor.chain().focus().redo().run()}
              />
            </div>
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs leading-5 text-slate-500">
        <p>
          Editor React com toolbar completa, histórico e suporte a imagens e galerias no corpo do post.
        </p>
        <p>{palavras} {palavras === 1 ? "palavra" : "palavras"}</p>
      </div>
    </FieldWrapper>
  );
}
