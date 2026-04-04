import CabecalhoSecao from "@/componentes/dashboard/cabecalho-secao";
import ContainerConteudo from "@/componentes/dashboard/container-conteudo";
import EstadoVazio from "@/componentes/dashboard/estado-vazio";
import ListaModuloInterativa from "@/componentes/dashboard/lista-modulo-interativa";
import {
  listarColunasModulo,
  listarLinhasModulo,
  obterModuloDashboard,
} from "@/servicos/dashboard";
import { DashboardModuloId } from "@/tipos/plataforma";

type ListaModuloPaginaProps = {
  modulo: DashboardModuloId;
};

export default async function ListaModuloPagina({
  modulo,
}: ListaModuloPaginaProps) {
  const definicao = obterModuloDashboard(modulo);
  const [linhas, colunas] = await Promise.all([
    listarLinhasModulo(modulo),
    Promise.resolve(listarColunasModulo(modulo)),
  ]);

  if (!definicao) {
    return null;
  }

  return (
    <ContainerConteudo>
      <CabecalhoSecao
        eyebrow="Módulo"
        titulo={definicao.label}
        descricao={definicao.descricao}
        actionHref={definicao.supportsCreate ? `${definicao.href}/novo` : undefined}
        actionLabel={definicao.acaoLabel}
      />

      {linhas.length === 0 ? (
        <EstadoVazio
          titulo={`Nenhum item em ${definicao.label.toLowerCase()}`}
          descricao="A estrutura do módulo já está pronta. O próximo passo é alimentar os registros reais ou conectar a persistência."
          actionHref={definicao.supportsCreate ? `${definicao.href}/novo` : undefined}
          actionLabel={definicao.acaoLabel}
        />
      ) : (
        <ListaModuloInterativa
          columns={colunas}
          rows={linhas}
          emptyTitle={`Nenhum resultado para ${definicao.label.toLowerCase()}`}
          emptyDescription="Ajuste a busca ou o filtro de status para encontrar outros registros neste módulo."
          actionHref={definicao.supportsCreate ? `${definicao.href}/novo` : undefined}
          actionLabel={definicao.acaoLabel}
        />
      )}
    </ContainerConteudo>
  );
}
