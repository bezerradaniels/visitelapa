import AcoesEditoriais from "@/componentes/dashboard/acoes-editoriais";
import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import BlocoMidia from "@/componentes/dashboard/blocos-info/bloco-midia";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import FormularioAdmin from "@/componentes/dashboard/formulario-admin";
import LayoutEdicao from "@/componentes/dashboard/layout-edicao";
import { obterCamposCadastro, obterRotuloTipoCadastro } from "@/servicos/cadastros";
import { PublicSubmissionDetail } from "@/tipos/plataforma";

type AprovacaoDetalhePaginaProps = {
  solicitacao: PublicSubmissionDetail;
};

const ROTULOS_STATUS: Record<PublicSubmissionDetail["status"], string> = {
  rascunho: "Rascunho",
  pendente_aprovacao: "Pendente de aprovação",
  revisao: "Em revisão",
  publicado: "Publicado",
  rejeitado: "Rejeitado",
  arquivado: "Arquivado",
};

function formatarData(dataIso: string) {
  if (!dataIso) {
    return "Data indisponível";
  }

  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bahia",
  }).format(data);
}

function extrairPrimeiraImagem(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  const imagem = value.find((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const src = (item as { src?: unknown }).src;
    return typeof src === "string" && src.length > 0;
  }) as { src?: string } | undefined;

  return imagem?.src ?? "";
}

export default function AprovacaoDetalhePagina({
  solicitacao,
}: AprovacaoDetalhePaginaProps) {
  const campos = obterCamposCadastro(solicitacao.tipo);
  const imagem = extrairPrimeiraImagem(solicitacao.payload.capa)
    || extrairPrimeiraImagem(solicitacao.payload.logo);
  const slugPublicacao =
    typeof solicitacao.payload.slugPublicacao === "string"
      ? solicitacao.payload.slugPublicacao
      : "";

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Aprovação"
        titulo={solicitacao.titulo}
        descricao="Revise os dados enviados no formulário público, salve ajustes se necessário e publique apenas depois da validação administrativa."
        backHref="/dashboard/aprovacoes"
        backLabel="Voltar para a fila"
      />

      <LayoutEdicao
        aside={
          <>
            <BlocoListaInformacoes
              titulo="Resumo da solicitação"
              itens={[
                {
                  label: "Tipo",
                  value: obterRotuloTipoCadastro(solicitacao.tipo),
                },
                {
                  label: "Status",
                  value: ROTULOS_STATUS[solicitacao.status],
                },
                {
                  label: "Recebido em",
                  value: formatarData(solicitacao.criadoEm),
                },
                {
                  label: "Atualizado em",
                  value: formatarData(solicitacao.atualizadoEm),
                },
              ]}
            />

            <BlocoListaInformacoes
              titulo="Contato do responsável"
              itens={[
                {
                  label: "Responsável",
                  value: solicitacao.responsavel || "Não informado",
                },
                {
                  label: "Email",
                  value: solicitacao.contatoEmail || "Não informado",
                },
                {
                  label: "WhatsApp",
                  value: solicitacao.contatoWhatsapp || "Não informado",
                },
                ...(slugPublicacao
                  ? [
                      {
                        label: "Slug publicado",
                        value: slugPublicacao,
                      },
                    ]
                  : []),
              ]}
            />

            {solicitacao.status !== "publicado" ? (
              <AcoesEditoriais
                tituloItem={solicitacao.titulo}
                statusAtual={ROTULOS_STATUS[solicitacao.status]}
                actionPath={`/api/dashboard/aprovacoes/${solicitacao.id}`}
                redirectHref="/dashboard/aprovacoes"
                observacao='Se você ajustar o formulário, use primeiro o botão "Salvar ajustes" antes de decidir a aprovação.'
              />
            ) : (
              <BlocoListaInformacoes
                titulo="Publicação concluída"
                itens={[
                  {
                    label: "Resultado",
                    value:
                      slugPublicacao
                        ? `A solicitação já gerou a publicação ${slugPublicacao}.`
                        : "A solicitação já foi publicada no módulo correspondente.",
                  },
                ]}
              />
            )}

            {imagem ? (
              <BlocoMidia
                imagem={imagem}
                titulo="Prévia enviada"
              />
            ) : null}
          </>
        }
      >
        <div id="formulario-solicitacao">
          <FormularioAdmin
            key={solicitacao.id}
            modulo={solicitacao.tipo}
            fields={campos}
            initialValues={solicitacao.payload}
            submitLabel="Salvar ajustes"
            successTitle="Ajustes salvos na solicitação"
            successDescription="As alterações ficaram registradas apenas nesta solicitação pendente. O site público só muda depois da ação de aprovar."
            submitPath={`/api/dashboard/aprovacoes/${solicitacao.id}`}
            submitBody={{ action: "salvar" }}
          />
        </div>
      </LayoutEdicao>
    </ContainerConteudo>
  );
}
