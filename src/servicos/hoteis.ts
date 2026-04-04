import { Hotel } from "@/dados/hoteis";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Hotel {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    localizacao: row.localizacao,
    checkIn: row.check_in,
    checkOut: row.check_out,
    contato: row.contato,
    sobre: row.sobre ?? [],
    comodidades: row.comodidades ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem: row.destaque_listagem,
  };
}

export async function listarHoteis(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hoteis")
    .select("*")
    .eq("status", "publicado")
    .order("atualizado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarHotelPorSlug(slug: string): Promise<Hotel | undefined> {
  const { data, error } = await supabase
    .from("hoteis")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function listarFiltrosHoteis() {
  const itens = await listarHoteis();
  return criarFiltrosPorCategoria(itens);
}
