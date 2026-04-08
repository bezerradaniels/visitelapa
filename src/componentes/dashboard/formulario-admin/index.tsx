"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import CampoCheckbox from "@/componentes/dashboard/fields/campo-checkbox";
import CampoCheckboxGrupo from "@/componentes/dashboard/fields/campo-checkbox-grupo";
import CampoData from "@/componentes/dashboard/fields/campo-data";
import CampoImagem from "@/componentes/dashboard/fields/campo-imagem";
import CampoIntervaloData from "@/componentes/dashboard/fields/campo-intervalo-data";
import CampoMoeda from "@/componentes/dashboard/fields/campo-moeda";
import CampoNumero from "@/componentes/dashboard/fields/campo-numero";
import CampoRichText from "@/componentes/dashboard/fields/campo-rich-text";
import CampoSelect from "@/componentes/dashboard/fields/campo-select";
import CampoSwitch from "@/componentes/dashboard/fields/campo-switch";
import CampoTags from "@/componentes/dashboard/fields/campo-tags";
import CampoTextoArray from "@/componentes/dashboard/fields/campo-texto-array";
import CampoTextarea from "@/componentes/dashboard/fields/campo-textarea";
import CampoTexto from "@/componentes/dashboard/fields/campo-texto";
import { FieldComponentProps } from "@/componentes/dashboard/fields/types";
import FormGrupo from "@/componentes/dashboard/form-grupo";
import { FieldKind } from "@/tipos/plataforma";
import { aplicarFormatacoesCadastro } from "@/servicos/formulario-formatacao";
import {
  campoPreenchido,
  criarValoresIniciais,
  moduloEhTipoCadastro,
  validarCamposObrigatorios,
  validarUsernameNegocio,
} from "@/servicos/cadastros";
import { FormFieldDefinition, FormValue, FormValues } from "@/tipos/plataforma";

const CAMPO_POR_TIPO: Partial<Record<FieldKind, ComponentType<FieldComponentProps>>> = {
  textarea: CampoTextarea,
  "rich-text": CampoRichText,
  select: CampoSelect,
  "checkbox-group": CampoCheckboxGrupo,
  checkbox: CampoCheckbox,
  switch: CampoSwitch,
  date: CampoData,
  "date-range": CampoIntervaloData,
  currency: CampoMoeda,
  number: CampoNumero,
  tags: CampoTags,
  "text-array": CampoTextoArray,
  "image-single": CampoImagem,
  "image-gallery": CampoImagem,
};

type FormularioAdminProps = {
  modulo?: string;
  registroId?: string;
  fields: FormFieldDefinition[];
  initialValues?: FormValues;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  variant?: "dashboard" | "publico";
  currentUsername?: string;
  submitPath?: string;
  submitBody?: Record<string, unknown>;
  successRedirectHref?: string;
  requiresPublishedEditConfirmation?: boolean;
  publishedEditConfirmMessage?: string;
};

const DEFAULT_PUBLISHED_EDIT_CONFIRM_MESSAGE =
  "Este conteúdo já está publicado. As alterações serão exibidas no portal imediatamente após salvar. Deseja continuar?";

function groupFieldsBySection(fields: FormFieldDefinition[]) {
  return fields.reduce<Record<string, FormFieldDefinition[]>>((acc, field) => {
    acc[field.section] = acc[field.section] ? [...acc[field.section], field] : [field];
    return acc;
  }, {});
}

function criarSlugAutomatico(value: FormValue) {
  const base = typeof value === "string" ? value : "";

  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizarValoresFormulario(fields: FormFieldDefinition[], values: FormValues) {
  const nextValues = aplicarFormatacoesCadastro({ ...values });

  for (const field of fields) {
    if (field.kind !== "date-range" || !field.singleDayFieldName) {
      continue;
    }

    if (nextValues[field.singleDayFieldName] !== true) {
      continue;
    }

    const startName = field.startName ?? `${field.name}Inicio`;
    const endName = field.endName ?? `${field.name}Fim`;
    nextValues[endName] = nextValues[startName] ?? "";
  }

  if (nextValues.eventoGratuito === true) {
    nextValues.valorIngresso = "";
  }

  return nextValues;
}

function normalizarOpcoesCategoria(value: unknown): FormFieldDefinition["options"] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const vistos = new Set<string>();
  const options = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const option = item as { label?: unknown; value?: unknown };
      const label = typeof option.label === "string" ? option.label.trim() : "";
      const optionValue =
        typeof option.value === "string" ? option.value.trim() : label;

      if (!label || !optionValue) {
        return null;
      }

      return {
        label,
        value: optionValue,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => {
      const chave = item.value.toLowerCase();

      if (vistos.has(chave)) {
        return false;
      }

      vistos.add(chave);
      return true;
    });

  return options.length ? options : undefined;
}

function useCategoriaOptions(modulo: string | undefined, hasCategoriaField: boolean) {
  const [categoriaOptions, setCategoriaOptions] = useState<FormFieldDefinition["options"]>();

  useEffect(() => {
    if (!modulo || !moduloEhTipoCadastro(modulo) || !hasCategoriaField) {
      return;
    }

    let ativo = true;

    void (async () => {
      try {
        const response = await fetch(`/api/categorias?tipo=${modulo}`, {
          cache: "no-store",
        });

        if (!response.ok || !ativo) {
          return;
        }

        const data = await response.json();

        if (!ativo) {
          return;
        }

        const options = normalizarOpcoesCategoria(data.options);
        if (options?.length) {
          setCategoriaOptions(options);
        }
      } catch {
        // Mantemos as opções estáticas já fornecidas pelo campo quando a API falha.
      }
    })();

    return () => {
      ativo = false;
    };
  }, [hasCategoriaField, modulo]);

  return categoriaOptions;
}

export default function FormularioAdmin({
  modulo,
  registroId,
  fields,
  initialValues,
  submitLabel,
  successTitle,
  successDescription,
  variant = "dashboard",
  currentUsername,
  submitPath,
  submitBody,
  successRedirectHref,
  requiresPublishedEditConfirmation = false,
  publishedEditConfirmMessage,
}: FormularioAdminProps) {
  const router = useRouter();
  const storageKey = variant === "publico" && modulo ? `cadastro_draft_${modulo}` : null;
  const [values, setValues] = useState<FormValues>(() => {
    const base = criarValoresIniciais(fields, initialValues);
    if (variant !== "publico" || !modulo || typeof window === "undefined") return base;
    try {
      const salvo = window.localStorage.getItem(`cadastro_draft_${modulo}`);
      if (salvo) {
        const restaurado = JSON.parse(salvo) as FormValues;
        return { ...base, ...restaurado };
      }
    } catch {
      // ignora erros de localStorage
    }
    return base;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasCategoriaField = fields.some((field) => field.name === "categoria");
  const categoriaOptions = useCategoriaOptions(modulo, hasCategoriaField);
  const fieldsResolvidos = fields.map((field) => {
    if (field.name !== "categoria" || !categoriaOptions?.length) {
      return field;
    }

    return {
      ...field,
      options: categoriaOptions,
    };
  });
  const termsField = fieldsResolvidos.find((field) => field.name === "aceitaTermos");
  const sections = groupFieldsBySection(
    fieldsResolvidos.filter((field) => field.name !== "aceitaTermos")
  );
  const camposParaProgresso = fieldsResolvidos.filter(
    (field) => field.name !== "aceitaTermos" && !field.readOnly
  );
  const preenchidos = camposParaProgresso.filter((field) => campoPreenchido(field, values)).length;
  const progresso = camposParaProgresso.length
    ? Math.round((preenchidos / camposParaProgresso.length) * 100)
    : 0;

  function handleChange(name: string, value: FormValue) {
    setValues((current) => {
      const nextValues: FormValues = {
        ...current,
        [name]: value,
      };

      if (name === "titulo") {
        const slugAtual = typeof current.slug === "string" ? current.slug : "";
        const tituloAtual = typeof current.titulo === "string" ? current.titulo : "";
        const slugGeradoAnterior = criarSlugAutomatico(tituloAtual);

        if (!slugAtual || slugAtual === slugGeradoAnterior) {
          nextValues.slug = criarSlugAutomatico(value);
        }
      }

      const normalized = normalizarValoresFormulario(fields, nextValues);

      if (storageKey) {
        try {
          // Salva apenas campos de texto (sem imagens/arrays grandes)
          const padraoSalvar: FormValues = {};
          for (const [k, v] of Object.entries(normalized)) {
            if (typeof v === "string" || typeof v === "boolean" || typeof v === "number") {
              padraoSalvar[k] = v;
            } else if (Array.isArray(v) && v.every((i) => typeof i === "string")) {
              padraoSalvar[k] = v;
            }
          }
          window.localStorage.setItem(storageKey, JSON.stringify(padraoSalvar));
        } catch {
          // ignora erros de localStorage
        }
      }

      return normalized;
    });

    setErrors((current) => {
      const nomesRelacionados = new Set([name]);

      for (const field of fields) {
        if (field.kind !== "date-range") {
          continue;
        }

        const startName = field.startName ?? `${field.name}Inicio`;
        const endName = field.endName ?? `${field.name}Fim`;

        if (
          name === startName ||
          name === endName ||
          name === field.singleDayFieldName
        ) {
          nomesRelacionados.add(startName);
          nomesRelacionados.add(endName);

          if (field.singleDayFieldName) {
            nomesRelacionados.add(field.singleDayFieldName);
          }
        }
      }

      if (name === "eventoGratuito") {
        nomesRelacionados.add("valorIngresso");
      }

      if (![...nomesRelacionados].some((campo) => current[campo])) {
        return current;
      }

      const nextErrors = { ...current };
      for (const campo of nomesRelacionados) {
        delete nextErrors[campo];
      }
      return nextErrors;
    });
  }

  function renderField(field: FormFieldDefinition) {
    const fieldAjustado =
      field.name === "valorIngresso" && values.eventoGratuito === true
        ? {
            ...field,
            readOnly: true,
            description: "Como o evento está marcado como gratuito, este campo fica desativado.",
            placeholder: "Evento gratuito",
          }
        : field;
    const error =
      errors[fieldAjustado.name] ??
      (fieldAjustado.kind === "date-range"
        ? errors[fieldAjustado.startName ?? `${fieldAjustado.name}Inicio`] ||
          errors[fieldAjustado.endName ?? `${fieldAjustado.name}Fim`]
        : undefined);

    const props = {
      field: fieldAjustado,
      value: values[fieldAjustado.name],
      values,
      error,
      onChange: handleChange,
    };

    const Componente = CAMPO_POR_TIPO[fieldAjustado.kind] ?? CampoTexto;
    return <Componente {...props} />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slugNormalizado =
      typeof values.slug === "string" && values.slug.trim()
        ? criarSlugAutomatico(values.slug)
        : criarSlugAutomatico(values.titulo);
    const payloadValues = aplicarFormatacoesCadastro({
      ...values,
      slug: slugNormalizado,
    });
    const valoresNormalizados = normalizarValoresFormulario(fields, payloadValues);

    const nextErrors = validarCamposObrigatorios(fields, valoresNormalizados);

    if (typeof valoresNormalizados.username === "string") {
      const usernameError = await validarUsernameNegocio(
        valoresNormalizados.username,
        currentUsername,
        registroId
      );
      if (usernameError) {
        nextErrors.username = usernameError;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (
      variant === "dashboard" &&
      registroId &&
      requiresPublishedEditConfirmation &&
      !window.confirm(
        publishedEditConfirmMessage ?? DEFAULT_PUBLISHED_EDIT_CONFIRM_MESSAGE
      )
    ) {
      return;
    }

    startTransition(() => {
      void (async () => {
        setValues(valoresNormalizados);
        setErrors({});
        setSubmitError(null);

        if (!submitPath && (variant !== "dashboard" || !modulo)) {
          if (successRedirectHref) {
            router.push(successRedirectHref);
            return;
          }

          setSubmittedValues(valoresNormalizados);
          return;
        }

        try {
          if (submitPath) {
            const response = await fetch(submitPath, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...submitBody,
                values: valoresNormalizados,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setSubmitError(data.erro ?? "Não foi possível concluir o envio.");
              return;
            }

            if (successRedirectHref) {
              if (storageKey) {
                try { window.localStorage.removeItem(storageKey); } catch { /* noop */ }
              }
              router.push(successRedirectHref);
              return;
            }

            setSubmittedValues(valoresNormalizados);
            return;
          }
          const response = await fetch(`/api/dashboard/${modulo}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: registroId,
              values: valoresNormalizados,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setSubmitError(data.erro ?? "Não foi possível salvar no Supabase.");
            return;
          }

          if (successRedirectHref) {
            router.push(successRedirectHref);
            return;
          }

          setSubmittedValues(valoresNormalizados);
        } catch {
          setSubmitError("Não foi possível conectar ao endpoint de persistência.");
        }
      })();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {variant === "publico" ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Progresso
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {progresso}% do cadastro preenchido
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{preenchidos}/{camposParaProgresso.length}</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-md bg-slate-100">
            <div
              className="h-full rounded-md bg-linear-to-r from-sky-500 via-violet-500 to-pink-500 transition-all duration-500 ease-out animate-pulse"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Rascunho salvo neste navegador
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800">
              BA e Bom Jesus da Lapa já vêm preenchidos quando aplicável
            </span>
          </div>
        </div>
      ) : null}

      {submittedValues ? (
        <div
          className={`rounded-2xl border px-6 py-5 ${
            variant === "publico"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-sky-200 bg-sky-50 text-sky-950"
          }`}
        >
          <p className="text-lg font-semibold">{successTitle}</p>
          <p className="mt-2 text-sm leading-6">{successDescription}</p>
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">
          <p className="text-lg font-semibold">Não foi possível salvar</p>
          <p className="mt-2 text-sm leading-6">{submitError}</p>
        </div>
      ) : null}

      {Object.entries(sections).map(([section, sectionFields]) => (
        <FormGrupo
          key={section}
          titulo={section}
        >
          {sectionFields.map((field) => (
            <div
              key={field.name}
              className={
                field.fullWidth ||
                field.kind === "textarea" ||
                field.kind === "rich-text" ||
                field.kind === "checkbox-group" ||
                field.kind === "image-single" ||
                field.kind === "image-gallery"
                  ? "md:col-span-2"
                  : undefined
              }
            >
              {renderField(field)}
            </div>
          ))}
        </FormGrupo>
      ))}

      {termsField ? (
        <div className="space-y-2">
          <label
            htmlFor={termsField.name}
            className="flex items-start gap-3 text-sm leading-6 text-slate-600"
          >
            <input
              id={termsField.name}
              type="checkbox"
              checked={Boolean(values[termsField.name])}
              onChange={(event) => handleChange(termsField.name, event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
            />
            <span>
              Li e aceito os{" "}
              <Link
                href="/termos-de-uso"
                className="font-semibold text-slate-950 underline underline-offset-4"
              >
                termos de uso
              </Link>{" "}
              e a{" "}
              <Link
                href="/termos-de-privacidade"
                className="font-semibold text-slate-950 underline underline-offset-4"
              >
                política de privacidade
              </Link>
              .
            </span>
          </label>

          {errors[termsField.name] ? (
            <p className="text-sm font-medium text-rose-600">{errors[termsField.name]}</p>
          ) : null}
        </div>
      ) : null}

      <div className={variant === "publico" ? "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" : "flex justify-start"}>
        {variant === "publico" ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-950">
                Revise os contatos e a localização antes de enviar
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Esses dados ajudam a equipe editorial a validar o cadastro com mais rapidez.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-w-52 cursor-pointer items-center justify-center rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Enviando cadastro..." : submitLabel}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-w-44 cursor-pointer items-center justify-center rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Salvando..." : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}
