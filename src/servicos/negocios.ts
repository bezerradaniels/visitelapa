import { Negocio } from "@/dados/negocios";
import { supabase } from "@/lib/supabase";
import { criarServico } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Negocio {
  return {
    slug: row.slug,
    username: row.username ?? "",
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    logo: row.logo ?? row.imagem ?? "",
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

const servico = criarServico<Negocio>({
  tabela: "negocios",
  ordem: { coluna: "atualizado_em" },
  mapRow,
});

export const listarNegocios = servico.listar;
export const buscarNegocioPorSlug = servico.buscarPorSlug;
export const listarFiltrosNegocios = servico.listarFiltros;

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

export async function buscarNegociosRelacionados(categoria: string, slugAtual: string, limite = 4): Promise<Negocio[]> {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .eq("categoria", categoria)
    .eq("status", "publicado")
    .neq("slug", slugAtual)
    .limit(limite);
  if (error) throw error;
  return (data ?? []).map(mapRow);
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
