import { RoteiroTuristico } from "@/dados/turismo";
import { supabase } from "@/lib/supabase";
import { criarFiltrosPorCategoria } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): RoteiroTuristico {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    duracao: row.duracao,
    formato: row.formato,
    contato: row.contato,
    sobre: row.sobre ?? [],
    inclui: row.inclui ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem: row.destaque_listagem,
  };
}

export async function listarTurismo(): Promise<RoteiroTuristico[]> {
  const { data, error } = await supabase
    .from("turismo")
    .select("*")
    .eq("status", "publicado")
    .order("atualizado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function buscarTurismoPorSlug(slug: string): Promise<RoteiroTuristico | undefined> {
  const { data, error } = await supabase
    .from("turismo")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function listarFiltrosTurismo() {
  const itens = await listarTurismo();
  return criarFiltrosPorCategoria(itens);
}
