import { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardModuloId, FormValues, ImageFieldValue } from "@/tipos/plataforma";
import {
  calcularTempoLeituraBlog,
  htmlParaParagrafosBlog,
  normalizarGaleriaBlog,
  normalizarHtmlBlog,
} from "./blog-conteudo";
import { moduloEhTipoCadastro } from "./cadastros";

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

function splitCommaSeparated(value: FormValues[string]) {
  return asString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function montarEndereco(values: FormValues) {
  const endereco = asString(values.endereco);
  const numero = asString(values.numero);
  const bairro = asString(values.bairro);
  const cidade = asString(values.cidade);
  const estado = asString(values.estado);

  return [endereco, numero, bairro, cidade, estado].filter(Boolean).join(", ");
}

function montarLocalEvento(values: FormValues) {
  const localEvento = asString(values.localEvento);
  const endereco = montarEndereco(values);

  return [localEvento, endereco].filter(Boolean).join(" - ");
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

async function resolverPublicadoEmBlog(values: FormValues, slugAtual?: string) {
  if (!slugAtual) {
    return asBoolean(values.publicado) ? new Date().toISOString() : null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("publicado_em")
    .eq("slug", slugAtual)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (typeof data?.publicado_em === "string" && data.publicado_em.trim()) {
    return data.publicado_em;
  }

  return asBoolean(values.publicado) ? new Date().toISOString() : null;
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

async function salvarCategoriaCadastro(values: FormValues, idAtual?: string) {
  const tipoCadastro = asString(values.tipoCadastro);

  if (!moduloEhTipoCadastro(tipoCadastro)) {
    throw new Error("Selecione o cadastro ao qual esta categoria pertence.");
  }

  const supabase = createServerSupabaseClient();
  const payload = {
    tipo_cadastro: tipoCadastro,
    nome: asString(values.titulo),
    slug: asString(values.slug),
    descricao: asString(values.descricao),
    status: "publicado",
  };

  if (idAtual) {
    const { data, error } = await supabase
      .from("categorias_cadastro")
      .update(payload)
      .eq("id", idAtual)
      .select("id, slug")
      .single();

    if (error) {
      throw error;
    }

    return {
      id: String(data.id),
      slug: typeof data.slug === "string" ? data.slug : undefined,
    };
  }

  const { data, error } = await supabase
    .from("categorias_cadastro")
    .insert(payload)
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: String(data.id),
    slug: typeof data.slug === "string" ? data.slug : undefined,
  };
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
): Promise<ResultadoPersistenciaDashboard> {
  try {
    switch (modulo) {
      case "pacotes":
        return await salvarPorSlug(
          "pacotes",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || extrairPrimeiraImagem(values.logo),
            whatsapp: asString(values.whatsapp),
            instagram: asString(values.instagram),
            origem_cidade: asString(values.origemCidade),
            origem_estado: asString(values.origemEstado),
            destino_cidade: asString(values.destinoCidade),
            destino_estado: asString(values.destinoEstado),
            data_ida: asString(values.dataIda),
            data_retorno: asString(values.dataRetorno),
            valor_vista: parseMoeda(values.valorVista),
            valor_parcelado: parseMoeda(values.valorParcelado),
            parcelas: asNumber(values.parcelas),
            comodidades: splitCommaSeparated(values.comodidades),
            valor_final_parcelado: parseMoeda(values.valorFinalParcelado),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
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
            data_fim: asString(values.dataEventoFim) || asString(values.dataEventoInicio),
            local: montarLocalEvento(values),
            contato: asString(values.whatsappResponsavel),
            programacao: splitCommaSeparated(values.horariosEvento),
            destaques: splitCommaSeparated(values.extrasEvento),
            destaque_listagem: "",
            valor_ingresso: parseMoeda(values.valorIngresso),
            gratuito: asBoolean(values.eventoGratuito),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "hoteis": {
        const comodidades = splitCommaSeparated(values.comodidades);
        const diferenciais = splitCommaSeparated(values.diferenciais);

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
            localizacao: montarEndereco(values),
            check_in: asString(values.checkIn),
            check_out: asString(values.checkOut),
            contato: asString(values.whatsappResponsavel),
            comodidades,
            diferenciais,
            destaque_listagem:
              diferenciais[0] ?? comodidades[0] ?? asString(values.categoria),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      }
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
            endereco: montarEndereco(values),
            atendimento: "",
            contato: asString(values.whatsappResponsavel),
            especialidades: splitLines(values.descricao),
            diferenciais: [],
            destaque_listagem: "",
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      case "restaurantes": {
        const especialidades = splitCommaSeparated(values.especialidades);
        const diferenciais = splitCommaSeparated(values.diferenciais);

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
            endereco: montarEndereco(values),
            funcionamento: asString(values.funcionamento),
            contato: asString(values.whatsappResponsavel),
            especialidades,
            diferenciais,
            destaque_listagem: especialidades[0] ?? asString(values.categoria),
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      }
      case "blog": {
        const conteudoHtml = normalizarHtmlBlog(values.conteudo);

        return await salvarPorSlug(
          "blog_posts",
          {
            slug: asString(values.slug),
            categoria: asString(values.categoria),
            titulo: asString(values.titulo),
            descricao: asString(values.descricao),
            imagem: extrairPrimeiraImagem(values.capa) || asString(values.imagem),
            galeria: normalizarGaleriaBlog(values.galeria),
            publicado_em: await resolverPublicadoEmBlog(values, slugAtual),
            leitura: calcularTempoLeituraBlog(conteudoHtml),
            autor: asString(values.autor),
            conteudo: htmlParaParagrafosBlog(conteudoHtml),
            conteudo_html: conteudoHtml,
            fechamento: "",
            destaque_listagem: "",
            status: obterStatusPublicacao(values),
          },
          slugAtual
        );
      }
      case "categorias":
        return await salvarCategoriaCadastro(values, slugAtual);
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
