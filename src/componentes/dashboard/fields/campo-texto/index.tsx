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

  function aplicarQuickAction(action: NonNullable<FieldComponentProps["field"]["quickActions"]>[number]) {
    onChange(field.name, action.value);
    action.updates?.forEach((update) => onChange(update.name, update.value));
  }

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

      {field.quickActions?.length ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-500">
            {field.quickActions.length === 1 ? "Sugestão rápida:" : "Sugestões rápidas:"}
          </span>
          {field.quickActions.map((action) => (
            <button
              key={`${field.name}-${action.label}`}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                aplicarQuickAction(action);
              }}
              className="cursor-pointer text-left font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </FieldWrapper>
  );
}
