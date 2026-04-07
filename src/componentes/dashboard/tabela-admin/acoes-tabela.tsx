"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Edit01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import Icone from "@/componentes/ui/icone";
import { AdminTableAction } from "@/tipos/plataforma";

type AcoesTabelaProps = {
  actions: AdminTableAction[];
};

type ConfiguracaoAcao = {
  icon: IconSvgElement;
  label: string;
  className: string;
};

const CONFIGURACOES_ACAO: Record<AdminTableAction["type"], ConfiguracaoAcao> = {
  view: {
    icon: EyeIcon,
    label: "Visualizar solicitação",
    className:
      "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950",
  },
  edit: {
    icon: Edit01Icon,
    label: "Editar solicitação",
    className:
      "border-sky-200 text-sky-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900",
  },
  approve: {
    icon: CheckmarkCircle01Icon,
    label: "Aprovar solicitação",
    className:
      "border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900",
  },
  reject: {
    icon: CancelCircleIcon,
    label: "Reprovar solicitação",
    className:
      "border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900",
  },
};

const ACAO_API: Record<Extract<AdminTableAction["type"], "approve" | "reject">, string> = {
  approve: "aprovar",
  reject: "rejeitar",
};

export default function AcoesTabela({ actions }: AcoesTabelaProps) {
  const router = useRouter();
  const [acaoPendente, setAcaoPendente] = useState<AdminTableAction["type"] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function executarAcao(action: Extract<AdminTableAction, { actionPath: string }>) {
    if (action.confirmMessage && !window.confirm(action.confirmMessage)) {
      return;
    }

    setAcaoPendente(action.type);
    setErro(null);

    try {
      const response = await fetch(action.actionPath, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: ACAO_API[action.type],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro ?? "Não foi possível concluir esta ação.");
        return;
      }

      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao endpoint editorial.");
    } finally {
      setAcaoPendente(null);
    }
  }

  return (
    <div className="flex min-w-fit flex-col gap-2">
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const configuracao = CONFIGURACOES_ACAO[action.type];
          const label = action.label ?? configuracao.label;
          const conteudo = (
            <Icone
              icon={configuracao.icon}
              size={16}
              className={acaoPendente === action.type ? "animate-pulse" : undefined}
            />
          );

          if ("href" in action) {
            return (
              <Link
                key={`${action.type}-${action.href}`}
                href={action.href}
                aria-label={label}
                title={label}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition cursor-pointer ${configuracao.className}`}
              >
                {conteudo}
              </Link>
            );
          }

          return (
            <button
              key={`${action.type}-${action.actionPath}`}
              type="button"
              aria-label={label}
              title={label}
              disabled={acaoPendente !== null}
              onClick={() => executarAcao(action)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 ${configuracao.className}`}
            >
              {conteudo}
            </button>
          );
        })}
      </div>

      {erro ? <p className="max-w-40 text-xs leading-5 text-rose-600">{erro}</p> : null}
    </div>
  );
}
