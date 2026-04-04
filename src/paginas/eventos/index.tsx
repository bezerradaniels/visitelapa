import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosEventos, listarEventos } from "@/servicos/eventos";

type EventosPaginaProps = {
  initialFilter?: string;
};

export default async function EventosPagina({ initialFilter }: EventosPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosEventos(),
    listarEventos(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Eventos em Bom Jesus da Lapa"
        subtitulo="Acompanhe celebrações, encontros, programações culturais e eventos importantes da cidade."
        imagem={assetsEstaticos.listagens.eventos}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/eventos"
        initialFilter={initialFilter}
      />
    </div>
  );
}
