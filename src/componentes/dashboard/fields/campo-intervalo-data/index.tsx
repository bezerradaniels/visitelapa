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
  const singleDayFieldName = field.singleDayFieldName;
  const isSingleDay = singleDayFieldName ? values[singleDayFieldName] === true : false;

  function handleToggleSingleDay() {
    if (!singleDayFieldName) {
      return;
    }

    const nextValue = !isSingleDay;
    onChange(singleDayFieldName, nextValue);

    if (nextValue) {
      onChange(endName, String(values[startName] ?? ""));
      return;
    }

    if (String(values[endName] ?? "") === String(values[startName] ?? "")) {
      onChange(endName, "");
    }
  }

  function handleChangeStartDate(value: string) {
    onChange(startName, value);

    if (isSingleDay) {
      onChange(endName, value);
    }
  }

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      required={field.required}
    >
      {singleDayFieldName ? (
        <label className="inline-flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isSingleDay}
            onChange={handleToggleSingleDay}
            className="h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
          />
          <span>{field.singleDayLabel ?? "Acontece em um único dia"}</span>
        </label>
      ) : null}

      <div className={`grid gap-4 ${isSingleDay ? "" : "md:grid-cols-2"}`}>
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {field.startLabel ?? "Data inicial"}
          </span>
          <input
            id={startName}
            type="date"
            value={String(values[startName] ?? "")}
            onChange={(event) => handleChangeStartDate(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
          />
        </div>

        {isSingleDay ? null : (
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {field.endLabel ?? "Data final"}
            </span>
            <input
              id={endName}
              type="date"
              value={String(values[endName] ?? "")}
              onChange={(event) => onChange(endName, event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
            />
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
