import FieldWrapper from "../field-wrapper";
import { FieldComponentProps } from "../types";

function extrairValoresSelecionados(value: FieldComponentProps["value"]) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CampoSelect({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  function aplicarQuickAction(action: NonNullable<FieldComponentProps["field"]["quickActions"]>[number]) {
    onChange(field.name, action.value);
    action.updates?.forEach((update) => onChange(update.name, update.value));
  }

  if (field.allowCustom) {
    const listId = `${field.name}-list`;

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
          list={listId}
          value={String(value ?? "")}
          maxLength={field.maxLength}
          readOnly={field.readOnly}
          placeholder={field.placeholder ?? "Digite ou selecione"}
          onChange={(event) =>
            onChange(
              field.name,
              field.maxLength === 2
                ? event.target.value.toUpperCase().slice(0, 2)
                : event.target.value
            )
          }
          className={`w-full rounded-md border border-slate-200 px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400 ${
            field.readOnly ? "bg-slate-50 text-slate-500" : "bg-white"
          }`}
        />
        <datalist id={listId}>
          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
            />
          ))}
        </datalist>

        {field.quickActions?.length ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-500">
              {field.quickActions.length === 1 ? "Sugestão rápida:" : "Destinos sugeridos:"}
            </span>
            {field.quickActions.map((action) => (
              <button
                key={`${field.name}-${action.label}`}
                type="button"
                onClick={() => aplicarQuickAction(action)}
                className="text-left font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </FieldWrapper>
    );
  }

  if (field.multiple) {
    const valoresSelecionados = extrairValoresSelecionados(value);

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
          multiple
          value={valoresSelecionados}
          size={field.size ?? 5}
          disabled={field.readOnly}
          onChange={(event) => {
            const selecionados = Array.from(event.target.selectedOptions, (option) => option.value);
            onChange(field.name, selecionados.join(", "));
          }}
          className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
        >
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
        disabled={field.readOnly}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition focus:border-slate-400"
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
