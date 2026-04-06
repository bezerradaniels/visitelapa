import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import CardsEstatisticas from "@/componentes/dashboard/cards-estatisticas";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import EstadoVazio from "@/componentes/dashboard/estado-vazio";
import TabelaAdmin from "@/componentes/dashboard/tabela-admin";
import {
  listarEstatisticasDashboard,
  listarSolicitacoesPendentes,
} from "@/servicos/dashboard";

export default async function DashboardPagina() {
  const [stats, solicitacoesRaw] = await Promise.all([
    listarEstatisticasDashboard(),
    listarSolicitacoesPendentes(),
  ]);

  const solicitacoes = solicitacoesRaw.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    categoria: item.tipo,
    status: item.status,
    atualizado: item.criadoEm,
    href: `/dashboard/aprovacoes/${item.id}`,
  }));

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Dashboard"
        titulo="Painel administrativo"
        descricao="Gerencie cadastros públicos, conteúdos, blog, taxonomias e contatos recebidos pelo portal."
      />

      <CardsEstatisticas stats={stats} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Solicitações públicas em andamento
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Toda publicação enviada pelos formulários públicos passa primeiro
              por esta fila de análise administrativa.
            </p>
          </div>

          {solicitacoes.length === 0 ? (
            <EstadoVazio
              titulo="Nenhuma solicitação pendente"
              descricao="Quando novos cadastros públicos forem enviados, eles aparecerão aqui para revisão administrativa."
            />
          ) : (
            <TabelaAdmin
              columns={[
                { key: "titulo", label: "Solicitação" },
                { key: "categoria", label: "Tipo" },
                { key: "status", label: "Status" },
                { key: "atualizado", label: "Recebido em" },
              ]}
              rows={solicitacoes}
            />
          )}
        </div>
      </div>
    </ContainerConteudo>
  );
}
