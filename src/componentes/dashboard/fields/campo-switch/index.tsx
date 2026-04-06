import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoSwitch({
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
      <button
        id={field.name}
        type="button"
        onClick={() => onChange(field.name, !isChecked)}
        className="flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300"
      >
        <span className="text-sm text-slate-600">
          {isChecked ? "Ativado" : "Desativado"}
        </span>

        <span
          className={`relative inline-flex h-7 w-12 rounded-full transition ${
            isChecked ? "bg-main" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              isChecked ? "left-6" : "left-1"
            }`}
          />
        </span>
      </button>
    </FieldWrapper>
  );
}
