import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosTurismo, listarTurismo } from "@/servicos/turismo";

type TurismoPaginaProps = {
  initialFilter?: string;
};

export default async function TurismoPagina({ initialFilter }: TurismoPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosTurismo(),
    listarTurismo(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Turismo em Bom Jesus da Lapa"
        subtitulo="Descubra roteiros, experiências e formas de conhecer a cidade com mais profundidade."
        imagem={assetsEstaticos.listagens.turismo}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/turismo"
        initialFilter={initialFilter}
      />
    </div>
  );
}
