"use client";

import { useState } from "react";

type AcoesEditoriaisProps = {
  tituloItem: string;
};

export default function AcoesEditoriais({
  tituloItem,
}: AcoesEditoriaisProps) {
  const [statusAcao, setStatusAcao] = useState<string | null>(null);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">
        Aprovação administrativa
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        O fluxo editorial já está preparado para aprovar, solicitar revisão ou
        arquivar registros como <strong>{tituloItem}</strong>.
      </p>

      {statusAcao ? (
        <div className="mt-4 rounded-[32px] border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {statusAcao}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => setStatusAcao("Ação preparada: publicação aprovada.")}
          className="w-full rounded-[32px] bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Aprovar publicação
        </button>
        <button
          type="button"
          onClick={() => setStatusAcao("Ação preparada: item enviado para revisão.")}
          className="w-full rounded-[32px] bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Solicitar revisão
        </button>
        <button
          type="button"
          onClick={() => setStatusAcao("Ação preparada: item arquivado no fluxo editorial.")}
          className="w-full rounded-[32px] border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          Arquivar solicitação
        </button>
      </div>
    </div>
  );
}
