import { Negocio } from "@/dados/negocios";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Negocio {
  return {
    slug: row.slug,
    username: row.username ?? "",
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    endereco: row.endereco,
    atendimento: row.atendimento,
    contato: row.contato,
    sobre: row.sobre ?? [],
    especialidades: row.especialidades ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem: row.destaque_listagem,
  };
}

export async function listarNegocios(): Promise<Negocio[]> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .eq("status", "publicado")
    .order("atualizado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarNegocioPorSlug(slug: string): Promise<Negocio | undefined> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function buscarNegocioPorUsername(username: string): Promise<Negocio | undefined> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .eq("username", username)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function buscarNegocioPorSlugOuUsername(identifier: string): Promise<Negocio | undefined> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .or(`slug.eq.${identifier},username.eq.${identifier}`)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function listarFiltrosNegocios() {
  const itens = await listarNegocios();
  return criarFiltrosPorCategoria(itens);
}
