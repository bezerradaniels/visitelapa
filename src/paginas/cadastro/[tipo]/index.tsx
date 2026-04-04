import Link from "next/link";
import { ArrowLeft01Icon, Building03Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import FormularioAdmin from "@/componentes/dashboard/formulario-admin";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { obterCamposCadastro, obterTipoCadastroPublico } from "@/servicos/cadastros";
import { obterConfiguracaoPortal } from "@/servicos/portal";
import { CadastroTipoId } from "@/tipos/plataforma";

type CadastroTipoPaginaProps = {
  tipo: CadastroTipoId;
};

export default function CadastroTipoPagina({
  tipo,
}: CadastroTipoPaginaProps) {
  const configuracao = obterConfiguracaoPortal();
  const cadastro = obterTipoCadastroPublico(tipo);

  if (!cadastro) {
    return null;
  }

  const campos = obterCamposCadastro(tipo);

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

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <FormularioAdmin
            key={tipo}
            fields={campos}
            submitLabel="Enviar solicitação"
            successTitle="Solicitação enviada para aprovação"
            successDescription="O cadastro foi estruturado no fluxo público do projeto. A publicação depende da aprovação de um administrador no dashboard."
            variant="publico"
          />

          <div className="space-y-6">
            <BlocoListaInformacoes
              titulo="Fluxo de publicação"
              itens={[
                {
                  label: "Etapa 1",
                  value: "O formulário é enviado publicamente pelo interessado.",
                  icon: Shield01Icon,
                },
                {
                  label: "Etapa 2",
                  value: "Um administrador revisa e aprova antes de publicar.",
                  icon: Shield01Icon,
                },
                {
                  label: "Etapa 3",
                  value: "Depois da aprovação, a página pode entrar no portal.",
                  icon: Shield01Icon,
                },
              ]}
            />

            <BlocoListaInformacoes
              titulo="Contato editorial"
              itens={[
                {
                  label: "Email",
                  value: configuracao.email,
                },
                {
                  label: "WhatsApp",
                  value: configuracao.whatsappExibicao,
                },
              ]}
            />

            {tipo === "negocios" ? (
              <div className="rounded-4xl border border-sky-200 bg-sky-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-[32px] bg-white p-3 text-sky-700">
                    <Icone
                      icon={Building03Icon}
                      size={20}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      URL curta com username
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Negócios podem solicitar uma URL pública no formato
                      `visitelapa.com.br/nomedaempresa`. O username aceita até 20
                      caracteres com letras, números e underscore.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
