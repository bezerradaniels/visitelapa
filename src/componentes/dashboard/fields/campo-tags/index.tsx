import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoTags({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  return (
    <FieldWrapper
      label={field.label}
      description={field.description ?? "Separe múltiplas tags por vírgula."}
      error={error}
      required={field.required}
      htmlFor={field.name}
    >
      <input
        id={field.name}
        type="text"
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
    </FieldWrapper>
  );
}
