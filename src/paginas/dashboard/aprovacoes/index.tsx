import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import EstadoVazio from "@/componentes/dashboard/estado-vazio";
import ListaModuloInterativa from "@/componentes/dashboard/lista-modulo-interativa";
import { listarSolicitacoesPublicas } from "@/servicos/solicitacoes-publicas";
import { AdminTableAction } from "@/tipos/plataforma";

function montarAcoesSolicitacao(id: string, titulo: string, status: string): AdminTableAction[] {
  const hrefDetalhe = `/dashboard/aprovacoes/${id}`;
  const actionPath = `/api/dashboard/aprovacoes/${id}`;

  return [
    {
      type: "view",
      href: hrefDetalhe,
    },
    {
      type: "edit",
      href: `${hrefDetalhe}#formulario-solicitacao`,
    },
    ...(status !== "publicado"
      ? [
          {
            type: "approve" as const,
            actionPath,
            confirmMessage: `Aprovar a solicitação "${titulo}"?`,
          },
        ]
      : []),
    ...(status !== "publicado" && status !== "rejeitado"
      ? [
          {
            type: "reject" as const,
            actionPath,
            confirmMessage: `Reprovar a solicitação "${titulo}"?`,
          },
        ]
      : []),
  ];
}

export default async function AprovacoesDashboardPagina() {
  const solicitacoes = await listarSolicitacoesPublicas();
  const rows = solicitacoes.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    categoria: item.tipo,
    responsavel: item.responsavel,
    status: item.status,
    atualizado: item.criadoEm,
    href: `/dashboard/aprovacoes/${item.id}`,
    actions: montarAcoesSolicitacao(item.id, item.titulo, item.status),
  }));

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Aprovação"
        titulo="Fila de aprovação"
        descricao="Revise as solicitações públicas enviadas ao portal, salve ajustes quando necessário e publique somente o que estiver aprovado."
      />

      {rows.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma solicitação recebida"
          descricao="Quando novos cadastros públicos forem enviados, eles aparecerão aqui para revisão administrativa."
        />
      ) : (
        <ListaModuloInterativa
          columns={[
            { key: "titulo", label: "Solicitação" },
            { key: "categoria", label: "Tipo" },
            { key: "responsavel", label: "Responsável" },
            { key: "status", label: "Status" },
            { key: "atualizado", label: "Recebido em" },
          ]}
          rows={rows}
          emptyTitle="Nenhuma solicitação encontrada"
          emptyDescription="Ajuste a busca ou o filtro de status para localizar outra solicitação."
        />
      )}
    </ContainerConteudo>
  );
}
