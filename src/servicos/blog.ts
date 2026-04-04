import { PostBlog } from "@/dados/blog";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): PostBlog {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp ?? "",
    instagram: row.instagram ?? "",
    publicadoEm: row.publicado_em ?? "",
    leitura: row.leitura,
    autor: row.autor,
    conteudo: row.conteudo ?? [],
    secoes: [],
    fechamento: row.fechamento,
    destaqueListagem: row.destaque_listagem,
  };
}

export async function listarBlog(): Promise<PostBlog[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "publicado")
    .order("publicado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarPostPorSlug(slug: string): Promise<PostBlog | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_secoes(*)")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const post = mapRow(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post.secoes = (data.blog_secoes ?? []).sort((a: any, b: any) => a.ordem - b.ordem).map((s: any) => ({ titulo: s.titulo, texto: s.texto }));
  return post;
}

export async function listarFiltrosBlog() {
  const itens = await listarBlog();
  return criarFiltrosPorCategoria(itens);
}
