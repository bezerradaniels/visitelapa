"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PublicSubmissionAction } from "@/tipos/plataforma";

type AcoesEditoriaisProps = {
  tituloItem: string;
  statusAtual?: string;
  actionPath?: string;
  redirectHref?: string;
  observacao?: string;
};

type AcaoEditorial = {
  action: Exclude<PublicSubmissionAction, "salvar">;
  label: string;
  feedback: string;
  className: string;
};

const ACOES_REAIS: AcaoEditorial[] = [
  {
    action: "aprovar",
    label: "Aprovar publicação",
    feedback: "Solicitação aprovada e publicação concluída.",
    className: "bg-emerald-600 text-white hover:bg-emerald-500",
  },
  {
    action: "solicitar_revisao",
    label: "Solicitar revisão",
    feedback: "Solicitação movida para revisão editorial.",
    className: "bg-sky-600 text-white hover:bg-sky-500",
  },
  {
    action: "rejeitar",
    label: "Rejeitar solicitação",
    feedback: "Solicitação rejeitada na fila editorial.",
    className: "bg-rose-600 text-white hover:bg-rose-500",
  },
  {
    action: "arquivar",
    label: "Arquivar solicitação",
    feedback: "Solicitação arquivada no fluxo editorial.",
    className:
      "border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950",
  },
];

const ACOES_MOCK: AcaoEditorial[] = [
  {
    action: "aprovar",
    label: "Aprovar publicação",
    feedback: "Ação preparada: publicação aprovada.",
    className: "bg-emerald-600 text-white hover:bg-emerald-500",
  },
  {
    action: "solicitar_revisao",
    label: "Solicitar revisão",
    feedback: "Ação preparada: item enviado para revisão.",
    className: "bg-sky-600 text-white hover:bg-sky-500",
  },
  {
    action: "arquivar",
    label: "Arquivar solicitação",
    feedback: "Ação preparada: item arquivado no fluxo editorial.",
    className:
      "border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950",
  },
];

export default function AcoesEditoriais({
  tituloItem,
  statusAtual,
  actionPath,
  redirectHref,
  observacao,
}: AcoesEditoriaisProps) {
  const router = useRouter();
  const [statusAcao, setStatusAcao] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const acoes = actionPath ? ACOES_REAIS : ACOES_MOCK;

  function executarAcao(acao: AcaoEditorial) {
    if (!actionPath) {
      setErroAcao(null);
      setStatusAcao(acao.feedback);
      return;
    }

    startTransition(() => {
      void (async () => {
        setErroAcao(null);
        setStatusAcao(null);

        try {
          const response = await fetch(actionPath, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: acao.action,
            }),
          });
          const data = await response.json();

          if (!response.ok) {
            setErroAcao(data.erro ?? "Não foi possível concluir a ação editorial.");
            return;
          }

          setStatusAcao(acao.feedback);

          if (redirectHref) {
            router.push(redirectHref);
            router.refresh();
            return;
          }

          router.refresh();
        } catch {
          setErroAcao("Não foi possível conectar ao endpoint editorial.");
        }
      })();
    });
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">
        Aprovação administrativa
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {actionPath
          ? `Use esta área para decidir o destino editorial de ${tituloItem}.`
          : `O fluxo editorial já está preparado para aprovar, solicitar revisão ou arquivar registros como ${tituloItem}.`}
      </p>

      {statusAtual ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Status atual: {statusAtual}
        </p>
      ) : null}

      {observacao ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">{observacao}</p>
      ) : null}

      {statusAcao ? (
        <div className="mt-4 rounded-[32px] border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {statusAcao}
        </div>
      ) : null}

      {erroAcao ? (
        <div className="mt-4 rounded-[32px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {erroAcao}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {acoes.map((acao) => (
          <button
            key={acao.action}
            type="button"
            onClick={() => executarAcao(acao)}
            disabled={isPending}
            className={`w-full rounded-[32px] px-4 py-3 text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${acao.className}`}
          >
            {isPending ? "Processando..." : acao.label}
          </button>
        ))}
      </div>
    </div>
  );
}
