import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoTextarea({
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
      <textarea
        id={field.name}
        rows={field.rows ?? 4}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="min-h-32 w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
    </FieldWrapper>
  );
}
