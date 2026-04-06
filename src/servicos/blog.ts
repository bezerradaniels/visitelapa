import { PostBlog } from "@/dados/blog";
import { supabase } from "@/lib/supabase";
import {
  htmlParaParagrafosBlog,
  montarHtmlLegadoBlog,
  normalizarGaleriaBlog,
  normalizarHtmlBlog,
} from "./blog-conteudo";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): PostBlog {
  const conteudoHtml = normalizarHtmlBlog(row.conteudo_html);
  const conteudo = Array.isArray(row.conteudo) ? row.conteudo : htmlParaParagrafosBlog(conteudoHtml);

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
    status: row.status ?? "rascunho",
    conteudo,
    conteudoHtml,
    galeria: normalizarGaleriaBlog(row.galeria),
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

export async function listarBlogAdmin(): Promise<PostBlog[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("publicado_em", { ascending: false, nullsFirst: false });

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
  if (!post.conteudoHtml) {
    post.conteudoHtml = montarHtmlLegadoBlog(post.conteudo, post.secoes, post.fechamento);
  }
  if (!post.conteudo.length) {
    post.conteudo = htmlParaParagrafosBlog(post.conteudoHtml);
  }
  return post;
}

export async function buscarPostPorSlugAdmin(slug: string): Promise<PostBlog | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_secoes(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  const post = mapRow(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post.secoes = (data.blog_secoes ?? []).sort((a: any, b: any) => a.ordem - b.ordem).map((s: any) => ({ titulo: s.titulo, texto: s.texto }));

  if (!post.conteudoHtml) {
    post.conteudoHtml = montarHtmlLegadoBlog(post.conteudo, post.secoes, post.fechamento);
  }

  if (!post.conteudo.length) {
    post.conteudo = htmlParaParagrafosBlog(post.conteudoHtml);
  }

  return post;
}

export async function listarFiltrosBlog() {
  const itens = await listarBlog();
  return criarFiltrosPorCategoria(itens);
}
