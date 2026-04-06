import { ReactNode } from "react";

type FormGrupoProps = {
  titulo: string;
  children: ReactNode;
};

export default function FormGrupo({ titulo, children }: FormGrupoProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Seção
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            {titulo}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}
