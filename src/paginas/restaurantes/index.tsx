import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosRestaurantes, listarRestaurantes } from "@/servicos/restaurantes";

type RestaurantesPaginaProps = {
  initialFilter?: string;
};

export default async function RestaurantesPagina({
  initialFilter,
}: RestaurantesPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosRestaurantes(),
    listarRestaurantes(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Restaurantes em Bom Jesus da Lapa"
        subtitulo="Explore lugares para comer bem, viver boas experiências gastronômicas e descobrir sabores da cidade."
        imagem={assetsEstaticos.listagens.restaurantes}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/restaurantes"
        initialFilter={initialFilter}
      />
    </div>
  );
}
