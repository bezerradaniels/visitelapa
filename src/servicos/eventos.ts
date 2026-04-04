import { Evento } from "@/dados/eventos";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Evento {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    data: row.data_inicio ?? "",
    local: row.local,
    contato: row.contato,
    sobre: row.sobre ?? [],
    programacao: row.programacao ?? [],
    destaques: row.destaques ?? [],
    destaqueListagem: row.destaque_listagem,
  };
}

export async function listarEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("status", "publicado")
    .order("data_inicio", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarEventoPorSlug(slug: string): Promise<Evento | undefined> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function listarFiltrosEventos() {
  const itens = await listarEventos();
  return criarFiltrosPorCategoria(itens);
}
