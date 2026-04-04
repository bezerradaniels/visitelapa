import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import Link from "next/link";
import { buscarPostPorSlug, listarBlog } from "@/servicos/blog";

type BlogDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function BlogDetalhePagina({
  params,
}: BlogDetalhePaginaProps) {
  const post = await buscarPostPorSlug(params.slug);
  const todosBlog = await listarBlog();

  if (!post) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Artigo não encontrado
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos um artigo com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LayoutDetalhe
      categoria={post.categoria}
      titulo={post.titulo}
      descricao={post.descricao}
      imagem={post.imagem}
      whatsapp={post.whatsapp}
      instagram={post.instagram}
      aside={
        <div className="space-y-6">
          <BlocoListaInformacoes
            titulo="Informações do artigo"
            itens={[
              { label: "Categoria", value: post.categoria },
              { label: "Publicado em", value: post.publicadoEm },
              { label: "Leitura", value: post.leitura },
              { label: "Autor", value: post.autor },
            ]}
          />

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-main">
              Continue explorando
            </h3>

            <div className="mt-4 space-y-3">
              {todosBlog
                .filter((item) => item.slug !== post.slug)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="block text-sm leading-6 text-gray-600 transition hover:text-main"
                  >
                    {item.titulo}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      }
    >
      <article className="rounded-3xl border border-gray-200 bg-white p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{post.publicadoEm}</span>
          <span>•</span>
          <span>Leitura de {post.leitura}</span>
        </div>

        <div className="mt-8 space-y-6 text-base leading-8 text-gray-700">
          {post.conteudo.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}

          {post.secoes.map((secao) => (
            <div key={secao.titulo}>
              <h2 className="text-2xl font-semibold text-main">
                {secao.titulo}
              </h2>

              <p className="mt-4">{secao.texto}</p>
            </div>
          ))}

          <p>{post.fechamento}</p>
        </div>
      </article>
    </LayoutDetalhe>
  );
}
