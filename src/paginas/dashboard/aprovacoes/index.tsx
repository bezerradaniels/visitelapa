import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import EstadoVazio from "@/componentes/dashboard/estado-vazio";
import ListaModuloInterativa from "@/componentes/dashboard/lista-modulo-interativa";
import { obterRotuloTipoCadastro } from "@/servicos/cadastros";
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
    categoria: obterRotuloTipoCadastro(item.tipo),
    status: item.status,
    atualizado: item.criadoEm,
    href: `/dashboard/aprovacoes/${item.id}`,
    actions: montarAcoesSolicitacao(item.id, item.titulo, item.status),
  }));

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Aprovação"
        titulo="Fila editorial"
        descricao="Revise os cadastros pendentes gravados nas tabelas finais, salve ajustes quando necessário e publique somente o que estiver aprovado."
      />

      {rows.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum cadastro em análise"
          descricao="Quando novos cadastros entrarem com status pendente, eles aparecerão aqui para revisão administrativa."
        />
      ) : (
        <ListaModuloInterativa
          columns={[
            { key: "titulo", label: "Cadastro" },
            { key: "categoria", label: "Tipo" },
            { key: "status", label: "Status" },
            { key: "atualizado", label: "Criado em" },
          ]}
          rows={rows}
          emptyTitle="Nenhum cadastro encontrado"
          emptyDescription="Ajuste a busca ou o filtro de status para localizar outro cadastro."
        />
      )}
    </ContainerConteudo>
  );
}
