import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoCheckbox({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const isChecked = Boolean(value);

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
      htmlFor={field.name}
    >
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3">
        <input
          id={field.name}
          type="checkbox"
          checked={isChecked}
          onChange={(event) => onChange(field.name, event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-main focus:ring-slate-500"
        />
        <span className="text-sm text-slate-600">
          {isChecked ? "Marcado" : "Desmarcado"}
        </span>
      </div>
    </FieldWrapper>
  );
}
