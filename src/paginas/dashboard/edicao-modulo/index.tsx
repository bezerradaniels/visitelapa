import AcoesEditoriais from "@/componentes/dashboard/acoes-editoriais";
import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import BlocoMidia from "@/componentes/dashboard/blocos-info/bloco-midia";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import FormularioAdmin from "@/componentes/dashboard/formulario-admin";
import LayoutEdicao from "@/componentes/dashboard/layout-edicao";
import {
  listarLinhasModulo,
  obterCamposModulo,
  obterValoresModulo,
  obterModuloDashboard,
} from "@/servicos/dashboard";
import { DashboardModuloId, FormValues } from "@/tipos/plataforma";

const MODULOS_COM_CONFIRMACAO_EDICAO_PUBLICADA = new Set<DashboardModuloId>([
  "blog",
  "pacotes",
  "eventos",
  "hoteis",
  "negocios",
  "restaurantes",
]);

type EdicaoModuloPaginaProps = {
  modulo: DashboardModuloId;
  slug?: string;
  initialValues?: FormValues;
};

export default async function EdicaoModuloPagina({
  modulo,
  slug,
  initialValues,
}: EdicaoModuloPaginaProps) {
  const definicao = obterModuloDashboard(modulo);

  if (!definicao) {
    return null;
  }

  const isNew = !slug;
  const campos = obterCamposModulo(modulo);
  const [valores, linhas] = await Promise.all([
    obterValoresModulo(modulo, slug),
    listarLinhasModulo(modulo),
  ]);
  const valoresFormulario =
    isNew && initialValues
      ? {
          ...valores,
          ...initialValues,
        }
      : valores;
  const linha = slug
    ? linhas.find((item: { id: string }) => item.id === slug)
    : undefined;
  const requerConfirmacaoEdicaoPublicada =
    Boolean(slug) &&
    linha?.status === "publicado" &&
    MODULOS_COM_CONFIRMACAO_EDICAO_PUBLICADA.has(modulo);
  const imagem =
    Array.isArray(valoresFormulario.capa) && valoresFormulario.capa[0] && typeof valoresFormulario.capa[0] === "object" && "src" in valoresFormulario.capa[0]
      ? (valoresFormulario.capa[0] as { src: string }).src
      : Array.isArray(valoresFormulario.logo) && valoresFormulario.logo[0] && typeof valoresFormulario.logo[0] === "object" && "src" in valoresFormulario.logo[0]
        ? (valoresFormulario.logo[0] as { src: string }).src
        : Array.isArray(valoresFormulario.galeria) && valoresFormulario.galeria[0] && typeof valoresFormulario.galeria[0] === "object" && "src" in valoresFormulario.galeria[0]
          ? (valoresFormulario.galeria[0] as { src: string }).src
          : typeof valoresFormulario.imagem === "string" && valoresFormulario.imagem.length > 0
            ? valoresFormulario.imagem
            : undefined;

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Edição"
        titulo={isNew ? definicao.acaoLabel ?? `Novo ${definicao.label}` : `Editar ${definicao.label}`}
        descricao={
          isNew
            ? `Estrutura de criação pronta para o módulo ${definicao.label.toLowerCase()}.`
            : `Fluxo de edição preparado para ${definicao.label.toLowerCase()} com campos reutilizáveis e preview lateral.`
        }
        backHref={definicao.href}
        backLabel={`Voltar para ${definicao.label.toLowerCase()}`}
      />

      <LayoutEdicao
        aside={
          <>
            <BlocoListaInformacoes
              titulo="Contexto editorial"
              itens={[
                {
                  label: "Módulo",
                  value: definicao.label,
                },
                {
                  label: "Fluxo",
                  value: isNew ? "Criação de registro" : "Edição de registro existente",
                },
                ...(linha
                  ? [
                      {
                        label: "Status atual",
                        value: linha.status,
                      },
                    ]
                  : []),
                {
                  label: "Publicação",
                  value:
                    modulo === "contatos"
                      ? "Consulta administrativa"
                      : requerConfirmacaoEdicaoPublicada
                        ? "Conteúdo ao vivo no portal"
                      : "Pronto para aprovação, revisão ou publicação",
                },
                ...(requerConfirmacaoEdicaoPublicada
                  ? [
                      {
                        label: "Atenção ao salvar",
                        value:
                          "Este conteúdo já está publicado. Depois da confirmação, qualquer alteração salva passa a valer imediatamente no portal.",
                      },
                    ]
                  : []),
              ]}
            />

            {!isNew && modulo !== "contatos" ? (
              <AcoesEditoriais tituloItem={String(valoresFormulario.titulo ?? definicao.label)} />
            ) : null}

            {imagem ? <BlocoMidia imagem={imagem} /> : null}
          </>
        }
      >
        <FormularioAdmin
          key={`${modulo}-${slug ?? "novo"}`}
          modulo={modulo}
          registroId={slug}
          fields={campos}
          initialValues={valoresFormulario}
          submitLabel={
            modulo === "contatos"
              ? "Salvar atendimento"
              : isNew
                ? "Salvar novo registro"
                : "Salvar alterações"
          }
          successTitle={
            modulo === "contatos"
              ? "Contato atualizado"
              : isNew
                ? "Registro salvo"
                : "Alterações salvas"
          }
          successDescription={
            modulo === "contatos"
              ? "As informações do contato foram atualizadas no Supabase com sucesso."
              : isNew
              ? "O novo registro foi enviado ao Supabase com sucesso."
              : "As alterações deste registro foram persistidas no Supabase."
          }
          currentUsername={
            typeof valores.username === "string" ? valores.username : undefined
          }
          requiresPublishedEditConfirmation={requerConfirmacaoEdicaoPublicada}
        />
      </LayoutEdicao>
    </ContainerConteudo>
  );
}
