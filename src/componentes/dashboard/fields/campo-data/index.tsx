import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoData({
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
        type="date"
        value={String(value ?? "")}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
      />
    </FieldWrapper>
  );
}
