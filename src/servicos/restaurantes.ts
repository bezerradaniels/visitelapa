import { Restaurante } from "@/dados/restaurantes";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Restaurante {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    logo: row.logo ?? row.imagem ?? "",
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    endereco: row.endereco,
    funcionamento: row.funcionamento,
    contato: row.contato,
    sobre: row.sobre ?? [],
    especialidades: row.especialidades ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem: row.destaque_listagem || row.especialidades?.[0] || row.categoria,
  };
}

export async function listarRestaurantes(): Promise<Restaurante[]> {
  const { data, error } = await supabase
    .from("restaurantes")
    .select("*")
    .eq("status", "publicado")
    .order("atualizado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarRestaurantePorSlug(slug: string): Promise<Restaurante | undefined> {
  const { data, error } = await supabase
    .from("restaurantes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function listarFiltrosRestaurantes() {
  const itens = await listarRestaurantes();
  return criarFiltrosPorCategoria(itens);
}
