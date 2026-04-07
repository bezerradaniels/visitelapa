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

type OrdemConfig = {
  coluna: string;
  ascendente?: boolean;
};

type ServicoConfig<T extends ItemComCategoria> = {
  tabela: string;
  ordem: OrdemConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRow: (row: any) => T;
};

export function criarServico<T extends ItemComCategoria>({ tabela, ordem, mapRow }: ServicoConfig<T>) {
  async function listar(): Promise<T[]> {
    const { data, error } = await supabase
      .from(tabela)
      .select("*")
      .eq("status", "publicado")
      .order(ordem.coluna, { ascending: ordem.ascendente ?? false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  }

  async function buscarPorSlug(slug: string): Promise<T | undefined> {
    const { data, error } = await supabase
      .from(tabela)
      .select("*")
      .eq("slug", slug)
      .eq("status", "publicado")
      .maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : undefined;
  }

  async function listarFiltros() {
    const itens = await listar();
    return criarFiltrosPorCategoria(itens);
  }

  return { listar, buscarPorSlug, listarFiltros };
}
