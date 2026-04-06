import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

function extrairValoresSelecionados(value: FieldComponentProps["value"]) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CampoCheckboxGrupo({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const selecionados = extrairValoresSelecionados(value);
  const setSelecionados = new Set(selecionados);

  function alternarOpcao(valor: string) {
    const next = setSelecionados.has(valor)
      ? selecionados.filter((item) => item !== valor)
      : [...selecionados, valor];

    const ordenados =
      field.options?.filter((option) => next.includes(option.value)).map((option) => option.value) ??
      next;

    onChange(field.name, ordenados.join(", "));
  }

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
    >
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {field.options?.map((option) => {
          const ativo = setSelecionados.has(option.value);

          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition ${
                ativo
                  ? "border-teal-500 bg-teal-50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={ativo}
                onChange={() => alternarOpcao(option.value)}
                className="h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
