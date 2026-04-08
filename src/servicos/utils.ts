import { supabase } from "@/lib/supabase";

type ItemComCategoria = {
  categoria: string;
};

export function criarFiltrosPorCategoria<T extends ItemComCategoria>(itens: T[]) {
  const categorias = Array.from(new Set(itens.map((item) => item.categoria)));

  return [
    { label: "Todos" },
    ...categorias.map((categoria) => ({ label: categoria })),
  ];
}

export type OrdemConfig = {
  coluna: string;
  ascendente?: boolean;
};

type ServicoConfig<T extends ItemComCategoria> = {
  tabela: string;
  ordem: OrdemConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRow: (row: any) => T;
};

async function listarRegistrosTabela<T>(
  tabela: string,
  ordem: OrdemConfig,
  apenasPublicados: boolean
): Promise<T[]> {
  let query = supabase
    .from(tabela)
    .select("*")
    .order(ordem.coluna, { ascending: ordem.ascendente ?? false });

  if (apenasPublicados) {
    query = query.eq("status", "publicado");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as T[];
}

async function buscarRegistroPorSlugNaTabela<T>(
  tabela: string,
  slug: string,
  apenasPublicados: boolean
): Promise<T | undefined> {
  let query = supabase
    .from(tabela)
    .select("*")
    .eq("slug", slug);

  if (apenasPublicados) {
    query = query.eq("status", "publicado");
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? (data as T) : undefined;
}

export function listarRegistrosAdmin<T>(tabela: string, ordem: OrdemConfig) {
  return listarRegistrosTabela<T>(tabela, ordem, false);
}

export function buscarRegistroAdminPorSlug<T>(tabela: string, slug: string) {
  return buscarRegistroPorSlugNaTabela<T>(tabela, slug, false);
}

export function criarServico<T extends ItemComCategoria>({ tabela, ordem, mapRow }: ServicoConfig<T>) {
  async function listar(): Promise<T[]> {
    const data = await listarRegistrosTabela<Record<string, unknown>>(tabela, ordem, true);
    return data.map(mapRow);
  }

  async function buscarPorSlug(slug: string): Promise<T | undefined> {
    const data = await buscarRegistroPorSlugNaTabela<Record<string, unknown>>(tabela, slug, true);
    return data ? mapRow(data) : undefined;
  }

  async function listarFiltros() {
    const itens = await listar();
    return criarFiltrosPorCategoria(itens);
  }

  return { listar, buscarPorSlug, listarFiltros };
}
