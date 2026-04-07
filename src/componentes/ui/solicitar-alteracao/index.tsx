import Link from "next/link";
import { Message01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import {
  criarLinkWhatsappPortal,
  criarMensagemSolicitacaoAlteracao,
} from "@/servicos/portal";

type SolicitarAlteracaoProps = {
  tipo: string;
  titulo: string;
  url: string;
};

export default function SolicitarAlteracao({
  tipo,
  titulo,
  url,
}: SolicitarAlteracaoProps) {
  const mensagem = criarMensagemSolicitacaoAlteracao({
    tipo,
    titulo,
    url,
  });

  return (
    <div className="rounded-4xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-4xl bg-white p-3 text-amber-700">
          <Icone
            icon={Message01Icon}
            size={20}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-950">
            Solicitar alteração
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Encontrou uma informação desatualizada? Envie uma solicitação pelo
            WhatsApp e a equipe editorial faz a revisão antes de publicar a mudança.
          </p>

          <Link
            href={criarLinkWhatsappPortal(mensagem)}
            target="_blank"
            className="mt-5 inline-flex items-center gap-2 rounded-4xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Icone
              icon={Message01Icon}
              size={18}
            />
            Solicitar via WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
