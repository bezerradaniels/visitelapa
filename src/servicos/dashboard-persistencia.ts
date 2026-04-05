import { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardModuloId, FormValues, ImageFieldValue } from "@/tipos/plataforma";

type ResultadoPersistenciaDashboard = {
  id: string;
  slug?: string;
};

function asString(value: FormValues[string]) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: FormValues[string]) {
  return value === true;
}

function asNumber(value: FormValues[string]) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function splitLines(value: FormValues[string]) {
  return asString(value)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value: FormValues[string]) {
  return asString(value)
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extrairPrimeiraImagem(value: FormValues[string]) {
  if (!Array.isArray(value)) {
    return "";
  }

  const imagens = value as ImageFieldValue;
  return imagens[0]?.src?.trim() ?? "";
}

function parseMoeda(value: FormValues[string]) {
  const texto = asString(value);

  if (!texto) {
    return null;
  }

  const normalizado = texto.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalizado);
  return Number.isFinite(parsed) ? parsed : null;
}

function obterStatusPublicacao(values: FormValues, fallback = "rascunho") {
  return asBoolean(values.publicado) ? "publicado" : fallback;
}

async function salvarPorSlug(
  tabela: string,
  payload: Record<string, unknown>,
  slugAtual?: string
): Promise<ResultadoPersistenciaDashboard> {
  const supabase = createServerSupabaseClient();

  if (slugAtual) {
    const { data, error } = await supabase
      .from(tabela)
      .update(payload)
      .eq("slug", slugAtual)
      .select("id, slug")
      .single();

    if (error) {
      throw error;
    }

    return {
      id: String(data.id ?? data.slug),
      slug: typeof data.slug === "string" ? data.slug : undefined,
    };
  }

  const { data, error } = await supabase
    .from(tabela)
    .insert(payload)
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: String(data.id ?? data.slug),
    slug: typeof data.slug === "string" ? data.slug : undefined,
  };
}

async function salvarContato(values: FormValues, id: string) {
  const supabase = createServerSupabaseClient();
  const payload = {
    nome: asString(values.nome),
    email: asString(values.email),
    whatsapp: asString(values.whatsapp),
    assunto: asString(values.assunto),
    mensagem: asString(values.mensagem),
    status: asString(values.status) || "novo",
  };

  const { data, error } = await supabase
    .from("contatos")
    .update(payload)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return { id: String(data.id) };
}

async function obterCidadeBomJesusDaLapaId() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cidades")
    .select("id")
    .eq("slug", "bom-jesus-da-lapa")
    .single();

  if (error) {
    throw error;
  }

  return data.id as number;
}

async function obterEstadoBahiaId() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("estados")
    .select("id")
    .eq("sigla", "BA")
    .single();

  if (error) {
    throw error;
  }

  return data.id as number;
}

export async function salvarRegistroDashboard(
  modulo: DashboardModuloId,
  values: FormValues,
  slugAtual?: string
) {
  try {
    switch (modulo) {
      case "eventos":
        return await salvarPorSlug(
          "eventos",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            data_inicio: asString(values.dataEventoInicio),
            data_fim: asString(values.dataEventoFim),
            local: asString(values.localEvento),
            contato: asString(values.nomeContato),
            sobre: splitParagraphs(values.sobre),
            programacao: [],
            destaques: [],
            destaque_listagem: asString(values.destaqueListagem),
            valor_ingresso: parseMoeda(values.valorIngresso),
            gratuito: asBoolean(values.eventoGratuito),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "hoteis":
        return await salvarPorSlug(
          "hoteis",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            localizacao: "",
            check_in: asString(values.checkIn),
            check_out: asString(values.checkOut),
            contato: asString(values.nomeContato),
            sobre: splitParagraphs(values.sobre),
            comodidades: [],
            diferenciais: [],
            destaque_listagem: asString(values.destaqueListagem),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "negocios":
        return await salvarPorSlug(
          "negocios",
          {
            slug: asString(values.slug),
            username: asString(values.username).toLowerCase(),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            endereco: "",
            atendimento: "",
            contato: asString(values.nomeContato),
            sobre: splitParagraphs(values.sobre),
            especialidades: splitLines(values.descricao),
            diferenciais: [],
            destaque_listagem: asString(values.destaqueListagem),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "restaurantes":
        return await salvarPorSlug(
          "restaurantes",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            endereco: "",
            funcionamento: "",
            contato: asString(values.nomeContato),
            sobre: splitParagraphs(values.sobre),
            especialidades: splitLines(values.tipoComida),
            diferenciais: [],
            destaque_listagem: asString(values.destaqueListagem),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "turismo":
        return await salvarPorSlug(
          "turismo",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            duracao: asString(values.duracao),
            formato: asString(values.formato),
            contato: asString(values.nomeContato),
            sobre: splitParagraphs(values.sobre),
            inclui: [],
            diferenciais: [],
            destaque_listagem: asString(values.destaqueListagem),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "blog":
        return await salvarPorSlug(
          "blog_posts",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: asString(values.imagem),
            publicado_em: new Date().toISOString(),
            leitura: "",
            autor: asString(values.autor),
            conteudo: splitParagraphs(values.conteudo),
            fechamento: "",
            destaque_listagem: "",
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "cidades":
        return await salvarPorSlug(
          "cidades",
          {
            nome: asString(values.titulo),
            slug: asString(values.slug),
            descricao: asString(values.descricao),
            estado_id: await obterEstadoBahiaId(),
            ordem: 1,
            status: "publicado",
          },
          slugAtual
        );
      case "bairros":
        return await salvarPorSlug(
          "bairros",
          {
            nome: asString(values.titulo),
            slug: asString(values.slug),
            descricao: asString(values.descricao),
            cidade_id: await obterCidadeBomJesusDaLapaId(),
            ordem: asNumber(values.ordem) ?? 999,
            status: "publicado",
          },
          slugAtual
        );
      case "contatos":
        if (!slugAtual) {
          throw new Error("O módulo de contatos exige um identificador para atualização.");
        }

        return await salvarContato(values, slugAtual);
      default:
        throw new Error("A persistência deste módulo ainda não foi implementada.");
    }
  } catch (error) {
    if (error instanceof PostgrestError) {
      throw new Error(error.message);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Não foi possível salvar o registro no Supabase.");
  }
}
