import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosHoteis, listarHoteis } from "@/servicos/hoteis";

type HoteisPaginaProps = {
  initialFilter?: string;
};

export default async function HoteisPagina({ initialFilter }: HoteisPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosHoteis(),
    listarHoteis(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Hotéis em Bom Jesus da Lapa"
        subtitulo="Encontre hospedagens para romarias, turismo, viagens em família e estadias com conforto."
        imagem={assetsEstaticos.listagens.hoteis}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/hoteis"
        initialFilter={initialFilter}
      />
    </div>
  );
}
