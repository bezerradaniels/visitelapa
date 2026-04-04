"use client";

import { useState, useTransition } from "react";
import CampoCheckbox from "@/componentes/dashboard/fields/campo-checkbox";
import CampoData from "@/componentes/dashboard/fields/campo-data";
import CampoImagem from "@/componentes/dashboard/fields/campo-imagem";
import CampoIntervaloData from "@/componentes/dashboard/fields/campo-intervalo-data";
import CampoMoeda from "@/componentes/dashboard/fields/campo-moeda";
import CampoNumero from "@/componentes/dashboard/fields/campo-numero";
import CampoSelect from "@/componentes/dashboard/fields/campo-select";
import CampoSwitch from "@/componentes/dashboard/fields/campo-switch";
import CampoTags from "@/componentes/dashboard/fields/campo-tags";
import CampoTextarea from "@/componentes/dashboard/fields/campo-textarea";
import CampoTexto from "@/componentes/dashboard/fields/campo-texto";
import FormGrupo from "@/componentes/dashboard/form-grupo";
import {
  criarValoresIniciais,
  validarCamposObrigatorios,
  validarUsernameNegocio,
} from "@/servicos/cadastros";
import { FormFieldDefinition, FormValue, FormValues } from "@/tipos/plataforma";

type FormularioAdminProps = {
  fields: FormFieldDefinition[];
  initialValues?: FormValues;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  variant?: "dashboard" | "publico";
  currentUsername?: string;
};

function groupFieldsBySection(fields: FormFieldDefinition[]) {
  return fields.reduce<Record<string, FormFieldDefinition[]>>((acc, field) => {
    acc[field.section] = acc[field.section] ? [...acc[field.section], field] : [field];
    return acc;
  }, {});
}

export default function FormularioAdmin({
  fields,
  initialValues,
  submitLabel,
  successTitle,
  successDescription,
  variant = "dashboard",
  currentUsername,
}: FormularioAdminProps) {
  const [values, setValues] = useState<FormValues>(() =>
    criarValoresIniciais(fields, initialValues)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [isPending, startTransition] = useTransition();
  const sections = groupFieldsBySection(fields);

  function handleChange(name: string, value: FormValue) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function renderField(field: FormFieldDefinition) {
    const error =
      errors[field.name] ??
      (field.kind === "date-range"
        ? errors[field.startName ?? `${field.name}Inicio`] ||
          errors[field.endName ?? `${field.name}Fim`]
        : undefined);

    const props = {
      field,
      value: values[field.name],
      values,
      error,
      onChange: handleChange,
    };

    switch (field.kind) {
      case "textarea":
        return <CampoTextarea {...props} />;
      case "select":
        return <CampoSelect {...props} />;
      case "checkbox":
        return <CampoCheckbox {...props} />;
      case "switch":
        return <CampoSwitch {...props} />;
      case "date":
        return <CampoData {...props} />;
      case "date-range":
        return <CampoIntervaloData {...props} />;
      case "currency":
        return <CampoMoeda {...props} />;
      case "number":
        return <CampoNumero {...props} />;
      case "tags":
        return <CampoTags {...props} />;
      case "image-single":
      case "image-gallery":
        return <CampoImagem {...props} />;
      default:
        return <CampoTexto {...props} />;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validarCamposObrigatorios(fields, values);

    if (typeof values.username === "string") {
      const usernameError = await validarUsernameNegocio(values.username, currentUsername);
      if (usernameError) {
        nextErrors.username = usernameError;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    startTransition(() => {
      setErrors({});
      setSubmittedValues(values);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {submittedValues ? (
        <div
          className={`rounded-4xl border px-6 py-5 ${
            variant === "publico"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-sky-200 bg-sky-50 text-sky-950"
          }`}
        >
          <p className="text-lg font-semibold">{successTitle}</p>
          <p className="mt-2 text-sm leading-6">{successDescription}</p>
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
                field.kind === "textarea" ||
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

      <div className="flex flex-col gap-3 rounded-4xl border border-slate-200 bg-slate-950 px-6 py-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {variant === "publico"
              ? "Todo envio público entra em fila de aprovação antes de aparecer no portal."
              : "Os botões e o fluxo administrativo já estão prontos para a integração com persistência."}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {variant === "publico"
              ? "Os dados ficam registrados como pendentes até análise de um administrador."
              : "Nesta fase, o formulário valida campos, organiza seções e prepara o fluxo de edição."}
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-44 items-center justify-center rounded-[32px] bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
