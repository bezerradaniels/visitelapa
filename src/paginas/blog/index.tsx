import HeroListagem from "@/componentes/secoes/hero-listagem";
import ListagemFiltrada from "@/componentes/listagem/listagem-filtrada";
import { assetsEstaticos } from "@/dados/assets";
import { listarFiltrosBlog, listarBlog } from "@/servicos/blog";

type BlogPaginaProps = {
  initialFilter?: string;
};

export default async function BlogPagina({ initialFilter }: BlogPaginaProps) {
  const [filtros, itens] = await Promise.all([
    listarFiltrosBlog(),
    listarBlog(),
  ]);
  return (
    <div className="bg-page">
      <HeroListagem
        titulo="Blog e novidades de Bom Jesus da Lapa"
        subtitulo="Acompanhe artigos, guias, dicas e conteúdos para descobrir a cidade de forma mais completa."
        imagem={assetsEstaticos.listagens.blog}
      />
      <ListagemFiltrada
        key={initialFilter ?? "Todos"}
        filtros={filtros}
        itens={itens}
        baseHref="/blog"
        initialFilter={initialFilter}
      />
    </div>
  );
}
