import Link from "next/link";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import FormularioAdmin from "@/componentes/dashboard/formulario-admin";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import {
  obterCamposCadastroPublico,
  obterTipoCadastroPublico,
} from "@/servicos/cadastros";
import { CadastroTipoId } from "@/tipos/plataforma";

type CadastroTipoPaginaProps = {
  tipo: CadastroTipoId;
};

export default function CadastroTipoPagina({
  tipo,
}: CadastroTipoPaginaProps) {
  const cadastro = obterTipoCadastroPublico(tipo);

  if (!cadastro) {
    return null;
  }

  const campos = obterCamposCadastroPublico(tipo);

  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <Icone
            icon={ArrowLeft01Icon}
            size={16}
          />
          Voltar para tipos de cadastro
        </Link>

        <div className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Cadastro público
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {cadastro.titulo}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            {cadastro.descricao}
          </p>
        </div>

        <div className="mt-12 max-w-4xl">
          <FormularioAdmin
            key={tipo}
            modulo={tipo}
            fields={campos}
            submitLabel="Enviar solicitação"
            successTitle="Solicitação enviada para aprovação"
            successDescription="Recebemos seu cadastro e ele já entrou na fila editorial. A publicação depende da aprovação de um administrador no dashboard."
            variant="publico"
            submitPath="/api/solicitacoes-publicas"
            submitBody={{ tipo }}
            successRedirectHref={`/obrigado?origem=cadastro&tipo=${tipo}`}
          />
        </div>
      </Container>
    </div>
  );
}
