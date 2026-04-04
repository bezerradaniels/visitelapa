import Link from "next/link";
import {
  InstagramIcon,
  Mail01Icon,
  MapPinpoint01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { obterConfiguracaoPortal } from "@/servicos/portal";

const configuracao = obterConfiguracaoPortal();

export default function InformacoesContato() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Atendimento
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Fale com a equipe do portal
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use este canal para dúvidas comerciais, correções de dados, parcerias,
          cadastros públicos e sugestões editoriais.
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
              <Icone
                icon={Mail01Icon}
                size={18}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </p>
              <Link
                href={`mailto:${configuracao.email}`}
                className="mt-2 block text-sm text-slate-700 transition hover:text-slate-950"
              >
                {configuracao.email}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
              <Icone
                icon={Message01Icon}
                size={18}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                WhatsApp
              </p>
              <Link
                href={`https://wa.me/${configuracao.whatsappNumero}`}
                target="_blank"
                className="mt-2 block text-sm text-slate-700 transition hover:text-slate-950"
              >
                {configuracao.whatsappExibicao}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
              <Icone
                icon={InstagramIcon}
                size={18}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Instagram
              </p>
              <Link
                href={configuracao.instagramUrl}
                target="_blank"
                className="mt-2 block text-sm text-slate-700 transition hover:text-slate-950"
              >
                {configuracao.instagramHandle}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
              <Icone
                icon={MapPinpoint01Icon}
                size={18}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Base local
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {configuracao.endereco}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-slate-950">
          Cadastros públicos dependem de aprovação
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Toda solicitação enviada pelo portal entra como pendente até análise
          de um administrador no dashboard.
        </p>
      </div>
    </div>
  );
}
