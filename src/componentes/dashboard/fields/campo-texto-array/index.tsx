import { FieldComponentProps } from "../types";
import FieldWrapper from "../field-wrapper";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";

export default function CampoTextoArray({
  field,
  value,
  error,
  onChange,
}: FieldComponentProps) {
  const itens = Array.isArray(value) ? (value as unknown as string[]) : value ? [String(value)] : [""];

  if (itens.length === 0) {
    itens.push("");
  }

  const handleChange = (index: number, val: string) => {
    const newItens = [...itens];
    newItens[index] = val;
    onChange(field.name, newItens as unknown as NonNullable<FieldComponentProps["value"]>);
  };

  const handleAdd = () => {
    onChange(field.name, [...itens, ""] as unknown as NonNullable<FieldComponentProps["value"]>);
  };

  const handleRemove = (index: number) => {
    const newItens = itens.filter((_, i) => i !== index);
    onChange(field.name, (newItens.length > 0 ? newItens : [""]) as unknown as NonNullable<FieldComponentProps["value"]>);
  };

  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      required={field.required}
      error={error}
      htmlFor={`${field.name}-0`}
    >
      <div className="flex flex-col gap-3">
        {itens.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <input
              id={`${field.name}-${index}`}
              type="text"
              value={item}
              placeholder={field.placeholder || "Insira um valor"}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-main outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            />
            {itens.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                title="Remover"
              >
                <Icone icon={Cancel01Icon} size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="mr-auto mt-1 inline-flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          <Icone icon={Add01Icon} size={16} />
          <span>Adicionar {field.label.toLowerCase()}</span>
        </button>
      </div>
    </FieldWrapper>
  );
}