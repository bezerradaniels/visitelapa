import { FormFieldDefinition, FormValue, FormValues } from "@/tipos/plataforma";

export type FieldComponentProps = {
  field: FormFieldDefinition;
  value: FormValues[string] | undefined;
  values: FormValues;
  error?: string;
  onChange: (name: string, value: FormValue) => void;
};
