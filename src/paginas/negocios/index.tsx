import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosNegocios, listarNegocios } from "@/servicos/negocios";

type NegociosPaginaProps = {
  initialFilter?: string;
};

export default async function NegociosPagina({ initialFilter }: NegociosPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosNegocios(),
    listarNegocios(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Guia comercial de Bom Jesus da Lapa"
        subtitulo="Encontre empresas, serviços, profissionais e negócios que movimentam a cidade."
        imagem={assetsEstaticos.listagens.negocios}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/negocios"
        initialFilter={initialFilter}
      />
    </div>
  );
}
