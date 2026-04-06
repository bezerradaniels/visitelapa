import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CadastroTipoId, FieldOption, StatusEditorial } from "@/tipos/plataforma";
import { listarOpcoesCategoriaPadrao, obterRotuloTipoCadastro } from "./cadastros";

export type CategoriaCadastro = {
  id: string;
  tipo: CadastroTipoId;
  nome: string;
  slug: string;
  descricao: string;
  status: StatusEditorial;
  atualizadoEm: string;
};

function deduplicarOpcoes(options: FieldOption[]) {
  const vistos = new Set<string>();

  return options.filter((option) => {
    const chave = option.value.trim().toLowerCase();

    if (!chave || vistos.has(chave)) {
      return false;
    }

    vistos.add(chave);
    return true;
  });
}

function fallbackCategorias(tipo?: CadastroTipoId): CategoriaCadastro[] {
  if (tipo) {
    return listarOpcoesCategoriaPadrao(tipo).map((option) => ({
      id: `${tipo}-${option.value.toLowerCase()}`,
      tipo,
      nome: option.label,
      slug: option.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      descricao: "",
      status: "publicado" as const,
      atualizadoEm: "",
    }));
  }

  return ([] as CategoriaCadastro[]).concat(
    ...(["pacotes", "eventos", "hoteis", "negocios", "restaurantes"] as CadastroTipoId[]).map(
      (tipoCadastro) => fallbackCategorias(tipoCadastro)
    )
  );
}

function encontrarCategoriaFallback(id: string) {
  return fallbackCategorias().find((item) => item.id === id) ?? null;
}

export async function listarCategoriasCadastro(tipo?: CadastroTipoId) {
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("categorias_cadastro")
      .select("id, tipo_cadastro, nome, slug, descricao, status, updated_at")
      .order("tipo_cadastro", { ascending: true })
      .order("nome", { ascending: true });

    if (tipo) {
      query = query.eq("tipo_cadastro", tipo);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []).map((row) => ({
      id: String(row.id),
      tipo: row.tipo_cadastro as CadastroTipoId,
      nome: row.nome ?? "",
      slug: row.slug ?? "",
      descricao: row.descricao ?? "",
      status: (row.status ?? "publicado") as StatusEditorial,
      atualizadoEm: row.updated_at ?? "",
    }));
  } catch {
    return fallbackCategorias(tipo);
  }
}

export async function obterCategoriaCadastro(id: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categorias_cadastro")
      .select("id, tipo_cadastro, nome, slug, descricao, status, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return encontrarCategoriaFallback(id);
    }

    return {
      id: String(data.id),
      tipo: data.tipo_cadastro as CadastroTipoId,
      nome: data.nome ?? "",
      slug: data.slug ?? "",
      descricao: data.descricao ?? "",
      status: (data.status ?? "publicado") as StatusEditorial,
      atualizadoEm: data.updated_at ?? "",
    } satisfies CategoriaCadastro;
  } catch {
    return encontrarCategoriaFallback(id);
  }
}

export async function listarOpcoesCategoriasCadastro(tipo: CadastroTipoId) {
  const categorias = await listarCategoriasCadastro(tipo);
  const opcoes = categorias.map((item) => ({
    label: item.nome,
    value: item.nome,
  }));

  if (opcoes.length === 0) {
    return listarOpcoesCategoriaPadrao(tipo);
  }

  return deduplicarOpcoes(opcoes);
}

export function obterRotuloCategoriaCadastro(tipo: CadastroTipoId) {
  return obterRotuloTipoCadastro(tipo);
}
