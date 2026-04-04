import { ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
};

export default function FieldWrapper({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
}: FieldWrapperProps) {
  const content = (
    <>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-main">
            {label}
          </span>
          {required ? (
            <span className="text-xs font-medium text-rose-600">*</span>
          ) : null}
        </div>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {children}

      {error ? (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      ) : null}
    </>
  );

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className="flex flex-col gap-3"
      >
        {content}
      </label>
    );
  }

  return <div className="flex flex-col gap-3">{content}</div>;
}
