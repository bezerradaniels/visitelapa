import { formatarMoedaBrl } from "@/servicos/formulario-formatacao";
import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoMoeda({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
      htmlFor={field.name}
    >
      <input
        id={field.name}
        type="text"
        inputMode="numeric"
        value={String(value ?? "")}
        readOnly={field.readOnly}
        placeholder={field.placeholder ?? "R$ 0,00"}
        onChange={(event) => onChange(field.name, formatarMoedaBrl(event.target.value))}
        className={`w-full rounded-md border border-slate-200 px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400 ${
          field.readOnly ? "bg-slate-50 text-slate-500" : "bg-white"
        }`}
      />
    </FieldWrapper>
  );
}
