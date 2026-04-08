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

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-4xl">
            <FormularioAdmin
              key={tipo}
              modulo={tipo}
              fields={campos}
              submitLabel="Enviar cadastro"
              successTitle="Cadastro enviado para aprovação"
              successDescription="Recebemos seu cadastro e ele já entrou na fila editorial. A publicação depende da aprovação de um administrador no dashboard."
              variant="publico"
              submitPath="/api/solicitacoes-publicas"
              submitBody={{ tipo }}
              successRedirectHref={`/obrigado?origem=cadastro&tipo=${tipo}`}
            />
          </div>

          <aside className="space-y-5 xl:sticky xl:top-8 xl:self-start">
            <div className="rounded-4xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Como funciona
              </p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                <p>
                  Preencha as informações principais primeiro: título, categoria,
                  descrição, contato e localização.
                </p>
                <p>
                  Seu cadastro entra como pendente e só aparece no portal depois
                  da aprovação da equipe editorial.
                </p>
                <p>
                  Se faltar algum detalhe, você pode voltar depois e continuar o
                  preenchimento no mesmo navegador.
                </p>
              </div>
            </div>

            <div className="rounded-4xl border border-sky-200 bg-sky-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Preenchimento rápido
              </p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-sky-950">
                <p>
                  Quando fizer sentido para o tipo de cadastro, cidade e estado já
                  vêm preenchidos com <strong>Bom Jesus da Lapa</strong> e{" "}
                  <strong>BA</strong>.
                </p>
                <p>
                  No cadastro de pacotes, esse preenchimento automático vale para a
                  origem. O destino continua livre para você escolher.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
