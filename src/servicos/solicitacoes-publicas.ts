import { createServerSupabaseClient } from "@/lib/supabase-server";
import { aplicarFormatacoesCadastro } from "@/servicos/formulario-formatacao";
import {
  CadastroTipoId,
  FormValue,
  FormValues,
  ImageFieldValue,
  PublicSubmission,
  PublicSubmissionAction,
  PublicSubmissionDetail,
  StatusEditorial,
} from "@/tipos/plataforma";
import { obterCamposCadastro, validarCamposObrigatorios } from "./cadastros";
import { salvarRegistroDashboard } from "./dashboard-persistencia";

type ResultadoSolicitacaoPublica = {
  id: string;
};

type ResultadoAcaoSolicitacaoPublica = {
  id: string;
  tipo: CadastroTipoId;
  status: StatusEditorial;
  slugPublicacao?: string;
};

type SolicitacaoPublicaDbRow = {
  id: string;
  tipo: CadastroTipoId;
  titulo: string;
  responsavel: string;
  contato_email: string;
  contato_whatsapp: string;
  status: StatusEditorial;
  payload: unknown;
  criado_em: string;
  atualizado_em: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isImageFieldValue(value: FormValue): value is ImageFieldValue {
  return Array.isArray(value);
}

function serializarCampoImagem(nomeCampo: string, value: ImageFieldValue) {
  return value.map((imagem, index) => {
    const manterSrcCompleto =
      !imagem.src.startsWith("data:") || nomeCampo === "logo" || nomeCampo === "capa" || index === 0;

    return {
      id: imagem.id,
      name: imagem.name,
      src: manterSrcCompleto ? imagem.src : "",
      srcOmitido: !manterSrcCompleto,
      cropFocus: imagem.cropFocus,
      zoom: imagem.zoom,
    };
  });
}

export function serializarPayloadSolicitacaoPublica(values: FormValues) {
  const valoresNormalizados = aplicarFormatacoesCadastro({ ...values });
  const payload: Record<string, unknown> = {};

  for (const [nomeCampo, value] of Object.entries(valoresNormalizados)) {
    if (isImageFieldValue(value)) {
      payload[nomeCampo] = serializarCampoImagem(nomeCampo, value);
      continue;
    }

    payload[nomeCampo] = value;
  }

  return payload as FormValues;
}

function normalizarPayload(value: unknown): FormValues {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as FormValues;
}

function mapSolicitacaoRow(row: SolicitacaoPublicaDbRow): PublicSubmissionDetail {
  const payload = normalizarPayload(row.payload);

  return {
    id: String(row.id),
    tipo: row.tipo,
    titulo: row.titulo || asString(payload.titulo),
    responsavel: row.responsavel || asString(payload.nomeContato),
    contatoEmail: row.contato_email || asString(payload.emailResponsavel),
    contatoWhatsapp:
      row.contato_whatsapp ||
      asString(payload.whatsappResponsavel) ||
      asString(payload.whatsapp),
    status: row.status,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
    payload,
  };
}

function validarCamposSolicitacao(tipo: CadastroTipoId, values: FormValues) {
  const campos = obterCamposCadastro(tipo);
  const errors = validarCamposObrigatorios(campos, values);

  if (Object.keys(errors).length === 0) {
    return;
  }

  throw new Error("Revise os campos obrigatórios antes de continuar.");
}

function mesclarPayloadSolicitacao(payloadAtual: FormValues, values?: FormValues) {
  if (!values) {
    return payloadAtual;
  }

  return {
    ...payloadAtual,
    ...serializarPayloadSolicitacaoPublica(values),
  };
}

function montarResumoSolicitacao(
  payload: FormValues,
  solicitacaoAtual: PublicSubmissionDetail
) {
  return {
    titulo: asString(payload.titulo) || solicitacaoAtual.titulo,
    responsavel: asString(payload.nomeContato) || solicitacaoAtual.responsavel,
    contatoEmail: asString(payload.emailResponsavel) || solicitacaoAtual.contatoEmail,
    contatoWhatsapp:
      asString(payload.whatsappResponsavel) ||
      asString(payload.whatsapp) ||
      solicitacaoAtual.contatoWhatsapp,
  };
}

async function persistirSolicitacaoPublica(
  solicitacaoAtual: PublicSubmissionDetail,
  status: StatusEditorial,
  values?: FormValues
) {
  const supabase = createServerSupabaseClient();
  const payload = mesclarPayloadSolicitacao(solicitacaoAtual.payload, values);
  const resumo = montarResumoSolicitacao(payload, solicitacaoAtual);
  const { data, error } = await supabase
    .from("solicitacoes_publicas")
    .update({
      titulo: resumo.titulo,
      responsavel: resumo.responsavel,
      contato_email: resumo.contatoEmail,
      contato_whatsapp: resumo.contatoWhatsapp,
      status,
      payload,
    })
    .eq("id", solicitacaoAtual.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSolicitacaoRow(data as SolicitacaoPublicaDbRow);
}

export async function salvarSolicitacaoPublica(
  tipo: CadastroTipoId,
  values: FormValues
): Promise<ResultadoSolicitacaoPublica> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("solicitacoes_publicas")
    .insert({
      tipo,
      titulo: asString(values.titulo),
      responsavel: asString(values.nomeContato),
      contato_email: asString(values.emailResponsavel),
      contato_whatsapp: asString(values.whatsappResponsavel) || asString(values.whatsapp),
      status: "pendente_aprovacao",
      payload: serializarPayloadSolicitacaoPublica(values),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: String(data.id),
  };
}

export async function contarSolicitacoesPendentes() {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("solicitacoes_publicas")
    .select("id", { count: "exact", head: true })
    .eq("status", "pendente_aprovacao");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function listarSolicitacoesPublicas(status?: StatusEditorial) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("solicitacoes_publicas")
    .select("*")
    .order("criado_em", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapSolicitacaoRow(row as SolicitacaoPublicaDbRow));
}

export async function listarSolicitacoesPendentes(): Promise<PublicSubmission[]> {
  const itens = await listarSolicitacoesPublicas("pendente_aprovacao");

  return itens.map((item) => ({
    id: item.id,
    tipo: item.tipo,
    titulo: item.titulo,
    responsavel: item.responsavel,
    contatoEmail: item.contatoEmail,
    status: item.status,
    criadoEm: item.criadoEm,
  }));
}

export async function obterSolicitacaoPublica(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("solicitacoes_publicas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapSolicitacaoRow(data as SolicitacaoPublicaDbRow);
}

export async function executarAcaoSolicitacaoPublica({
  id,
  action,
  values,
}: {
  id: string;
  action: PublicSubmissionAction;
  values?: FormValues;
}): Promise<ResultadoAcaoSolicitacaoPublica> {
  const solicitacao = await obterSolicitacaoPublica(id);

  if (!solicitacao) {
    throw new Error("Solicitação pública não encontrada.");
  }

  const valoresFormatados = values
    ? aplicarFormatacoesCadastro({ ...values })
    : undefined;

  if (valoresFormatados) {
    validarCamposSolicitacao(solicitacao.tipo, valoresFormatados);
  }

  if (action === "salvar") {
    const atualizado = await persistirSolicitacaoPublica(
      solicitacao,
      solicitacao.status,
      valoresFormatados
    );

    return {
      id: atualizado.id,
      tipo: atualizado.tipo,
      status: atualizado.status,
      slugPublicacao: asString(atualizado.payload.slugPublicacao),
    };
  }

  if (action === "aprovar") {
    if (solicitacao.status === "publicado") {
      throw new Error("Esta solicitação já foi publicada.");
    }

    const payloadPublicacao = mesclarPayloadSolicitacao(
      solicitacao.payload,
      valoresFormatados
    );
    const resultado = await salvarRegistroDashboard(solicitacao.tipo, {
      ...payloadPublicacao,
      publicado: true,
    });
    const slugPublicacao = resultado.slug ?? asString(payloadPublicacao.slug);
    const atualizado = await persistirSolicitacaoPublica(solicitacao, "publicado", {
      ...payloadPublicacao,
      slugPublicacao,
    });

    return {
      id: atualizado.id,
      tipo: atualizado.tipo,
      status: atualizado.status,
      slugPublicacao,
    };
  }

  const statusPorAcao: Record<
    Exclude<PublicSubmissionAction, "salvar" | "aprovar">,
    StatusEditorial
  > = {
    solicitar_revisao: "revisao",
    rejeitar: "rejeitado",
    arquivar: "arquivado",
  };

  const atualizado = await persistirSolicitacaoPublica(
    solicitacao,
    statusPorAcao[action],
    valoresFormatados
  );

  return {
    id: atualizado.id,
    tipo: atualizado.tipo,
    status: atualizado.status,
    slugPublicacao: asString(atualizado.payload.slugPublicacao),
  };
}
