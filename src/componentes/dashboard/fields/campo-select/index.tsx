import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoSelect({
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
      <select
        id={field.name}
        value={String(value ?? "")}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
      >
        <option value="">Selecione</option>
        {field.options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
