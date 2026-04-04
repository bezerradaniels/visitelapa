import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

export default function CampoIntervaloData({
  field,
  values,
  error,
  onChange,
}: FieldComponentProps) {
  const startName = field.startName ?? `${field.name}Inicio`;
  const endName = field.endName ?? `${field.name}Fim`;

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {field.startLabel ?? "Data inicial"}
          </span>
          <input
            id={startName}
            type="date"
            value={String(values[startName] ?? "")}
            onChange={(event) => onChange(startName, event.target.value)}
            className="w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {field.endLabel ?? "Data final"}
          </span>
          <input
            id={endName}
            type="date"
            value={String(values[endName] ?? "")}
            onChange={(event) => onChange(endName, event.target.value)}
            className="w-full rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
          />
        </div>
      </div>
    </FieldWrapper>
  );
}
