import {
  formatarTelefoneBrasil,
  normalizarInstagramUsername,
} from "@/servicos/formulario-formatacao";
import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoTexto({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const type = field.name.toLowerCase().includes("email") ? "email" : "text";
  const isTelefone = /(whatsapp|telefone)/i.test(field.name);
  const isInstagram = /instagram/i.test(field.name);

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
        type={type}
        value={String(value ?? "")}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        inputMode={isTelefone ? "numeric" : undefined}
        readOnly={field.readOnly}
        onChange={(event) => {
          const rawValue = event.target.value;
          const nextValue = isTelefone
            ? formatarTelefoneBrasil(rawValue)
            : isInstagram
              ? normalizarInstagramUsername(rawValue)
              : rawValue;

          onChange(field.name, nextValue);
        }}
        className={`w-full rounded-md border border-slate-200 px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400 ${
          field.readOnly ? "bg-slate-50 text-slate-500" : "bg-white"
        }`}
      />
    </FieldWrapper>
  );
}
