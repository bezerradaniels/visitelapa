import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  aplicarFormatacoesCadastro,
  formatarMoedaBrlPorNumero,
} from "@/servicos/formulario-formatacao";
import {
  CadastroTipoId,
  FormValues,
  ImageFieldValue,
  PublicSubmission,
  PublicSubmissionAction,
  PublicSubmissionDetail,
  StatusEditorial,
} from "@/tipos/plataforma";
import {
  criarValoresIniciais,
  obterCamposCadastro,
  validarCamposObrigatorios,
} from "./cadastros";
import { salvarRegistroDashboard } from "./dashboard-persistencia";

const TABELA_POR_TIPO: Record<CadastroTipoId, string> = {
  pacotes: "pacotes",
  eventos: "eventos",
  hoteis: "hoteis",
  negocios: "negocios",
  restaurantes: "restaurantes",
};

const TIPOS_CADASTRO_PUBLICO = Object.keys(TABELA_POR_TIPO) as CadastroTipoId[];

const STATUSS_DA_FILA: StatusEditorial[] = [
  "pendente_aprovacao",
  "revisao",
  "rejeitado",
  "arquivado",
];

const STATUS_EDITORIAIS = new Set<StatusEditorial>([
  "rascunho",
  "pendente_aprovacao",
  "revisao",
  "publicado",
  "rejeitado",
  "arquivado",
]);

type ResultadoSolicitacaoPublica = {
  id: string;
};

type ResultadoAcaoSolicitacaoPublica = {
  id: string;
  tipo: CadastroTipoId;
  status: StatusEditorial;
  slugPublicacao?: string;
};

type RegistroPublicacaoRow = {
  id?: unknown;
  slug?: unknown;
  titulo?: unknown;
  categoria?: unknown;
  descricao?: unknown;
  imagem?: unknown;
  logo?: unknown;
  whatsapp?: unknown;
  instagram?: unknown;
  contato?: unknown;
  status?: unknown;
  created_at?: unknown;
  criado_em?: unknown;
  updated_at?: unknown;
  atualizado_em?: unknown;
  [key: string]: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asId(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function asStatusEditorial(
  value: unknown,
  fallback: StatusEditorial = "rascunho"
): StatusEditorial {
  return typeof value === "string" && STATUS_EDITORIAIS.has(value as StatusEditorial)
    ? (value as StatusEditorial)
    : fallback;
}

function criarIdentificadorSolicitacao(tipo: CadastroTipoId, id: string) {
  return `${tipo}:${id}`;
}

function lerIdentificadorSolicitacao(identificador: string) {
  const separador = identificador.indexOf(":");

  if (separador <= 0) {
    throw new Error("Identificador de solicitação inválido.");
  }

  const tipo = identificador.slice(0, separador);
  const id = identificador.slice(separador + 1).trim();

  if (!id || !(tipo in TABELA_POR_TIPO)) {
    throw new Error("Identificador de solicitação inválido.");
  }

  return {
    tipo: tipo as CadastroTipoId,
    id,
  };
}

function criarValorInicialImagem(
  src?: string | null,
  nome = "Imagem atual"
): ImageFieldValue {
  if (!src?.trim()) {
    return [];
  }

  return [
    {
      id: `${nome.toLowerCase().replace(/\s+/g, "-")}-existente`,
      name: nome,
      src: src.trim(),
      cropFocus: "center",
      zoom: 1,
    },
  ];
}

function normalizarListaStrings(valor: unknown): string[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function formatarListaStrings(valor: unknown) {
  return normalizarListaStrings(valor).join(", ");
}

function formatarMoedaInicial(valor: unknown) {
  return typeof valor === "number" && Number.isFinite(valor)
    ? formatarMoedaBrlPorNumero(valor)
    : "";
}

function decomporEndereco(enderecoCompleto: unknown) {
  const texto = typeof enderecoCompleto === "string" ? enderecoCompleto.trim() : "";

  if (!texto) {
    return {
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    };
  }

  const partes = texto
    .split(",")
    .map((parte) => parte.trim())
    .filter(Boolean);

  if (partes.length >= 5) {
    const estado = partes.pop() ?? "";
    const cidade = partes.pop() ?? "";
    const bairro = partes.pop() ?? "";
    const numero = partes.pop() ?? "";

    return {
      endereco: partes.join(", "),
      numero,
      bairro,
      cidade,
      estado,
    };
  }

  if (partes.length === 4) {
    return {
      endereco: partes[0] ?? "",
      numero: "",
      bairro: partes[1] ?? "",
      cidade: partes[2] ?? "",
      estado: partes[3] ?? "",
    };
  }

  if (partes.length === 3) {
    return {
      endereco: partes[0] ?? "",
      numero: "",
      bairro: "",
      cidade: partes[1] ?? "",
      estado: partes[2] ?? "",
    };
  }

  if (partes.length === 2) {
    return {
      endereco: partes[0] ?? "",
      numero: "",
      bairro: "",
      cidade: partes[1] ?? "",
      estado: "",
    };
  }

  return {
    endereco: texto,
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  };
}

function decomporLocalEvento(localCompleto: unknown) {
  const texto = typeof localCompleto === "string" ? localCompleto.trim() : "";

  if (!texto) {
    return {
      localEvento: "",
      ...decomporEndereco(""),
    };
  }

  const separador = " - ";
  const indiceSeparador = texto.lastIndexOf(separador);

  if (indiceSeparador === -1) {
    return {
      localEvento: texto,
      ...decomporEndereco(""),
    };
  }

  const localEvento = texto.slice(0, indiceSeparador).trim();
  const endereco = texto.slice(indiceSeparador + separador.length).trim();

  return {
    localEvento,
    ...decomporEndereco(endereco),
  };
}

function obterCriadoEm(row: RegistroPublicacaoRow) {
  return (
    asString(row.created_at) ||
    asString(row.criado_em) ||
    asString(row.updated_at) ||
    asString(row.atualizado_em)
  );
}

function obterAtualizadoEm(row: RegistroPublicacaoRow) {
  return asString(row.updated_at) || asString(row.atualizado_em) || obterCriadoEm(row);
}

function obterContatoWhatsapp(row: RegistroPublicacaoRow) {
  return asString(row.contato) || asString(row.whatsapp);
}

function criarSeedBaseCadastro() {
  return {
    nomeContato: "",
    whatsappResponsavel: "",
    whatsapp: "",
    instagram: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    origemCidade: "",
    origemEstado: "",
    destinoCidade: "",
    destinoEstado: "",
    horariosEvento: "",
    valorFinalParcelado: "",
    aceitaTermos: false,
    seoTitulo: "",
    seoDescricao: "",
    username: "",
  } satisfies FormValues;
}

function montarPayloadCadastro(tipo: CadastroTipoId, row: RegistroPublicacaoRow): FormValues {
  const campos = obterCamposCadastro(tipo);
  const seedBase = criarSeedBaseCadastro();
  const status = asStatusEditorial(row.status);
  const slug = asString(row.slug);
  const titulo = asString(row.titulo);
  const categoria = asString(row.categoria);
  const descricao = asString(row.descricao);

  switch (tipo) {
    case "pacotes":
      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo,
        slug,
        categoria,
        descricao,
        logo: criarValorInicialImagem(asString(row.logo), "Logo atual"),
        capa: criarValorInicialImagem(
          asString(row.imagem) || asString(row.logo),
          "Capa atual"
        ),
        dataIda: asString(row.data_ida),
        dataRetorno: asString(row.data_retorno),
        origemCidade: asString(row.origem_cidade),
        origemEstado: asString(row.origem_estado),
        destinoCidade: asString(row.destino_cidade),
        destinoEstado: asString(row.destino_estado),
        valorVista: formatarMoedaInicial(row.valor_vista),
        valorParcelado: formatarMoedaInicial(row.valor_parcelado),
        parcelas: row.parcelas ? String(row.parcelas) : "",
        comodidades: formatarListaStrings(row.comodidades),
        valorFinalParcelado: formatarMoedaInicial(row.valor_final_parcelado),
        publicado: status === "publicado",
        seoTitulo: titulo,
        whatsapp: asString(row.whatsapp),
        instagram: asString(row.instagram),
      });
    case "eventos": {
      const localizacaoEvento = decomporLocalEvento(row.local);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo,
        slug,
        categoria,
        descricao,
        capa: criarValorInicialImagem(asString(row.imagem), "Capa atual"),
        destaqueListagem: asString(row.destaque_listagem),
        localEvento: localizacaoEvento.localEvento,
        endereco: localizacaoEvento.endereco,
        numero: localizacaoEvento.numero,
        bairro: localizacaoEvento.bairro,
        cidade: localizacaoEvento.cidade,
        estado: localizacaoEvento.estado,
        dataEventoInicio: asString(row.data_inicio),
        dataEventoFim: asString(row.data_fim) || asString(row.data_inicio),
        dataEventoDiaUnico:
          Boolean(asString(row.data_inicio)) &&
          (!asString(row.data_fim) || asString(row.data_inicio) === asString(row.data_fim)),
        horariosEvento: formatarListaStrings(row.programacao),
        extrasEvento: formatarListaStrings(row.destaques),
        valorIngresso: formatarMoedaInicial(row.valor_ingresso),
        eventoGratuito: row.gratuito === true,
        publicado: status === "publicado",
        seoTitulo: titulo,
        whatsapp: asString(row.whatsapp),
        instagram: asString(row.instagram),
        whatsappResponsavel: asString(row.contato),
      });
    }
    case "hoteis": {
      const localizacaoHotel = decomporEndereco(row.localizacao);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo,
        slug,
        categoria,
        descricao,
        logo: criarValorInicialImagem(asString(row.logo), "Logo atual"),
        capa: criarValorInicialImagem(
          asString(row.imagem) || asString(row.logo),
          "Capa atual"
        ),
        comodidades: formatarListaStrings(row.comodidades),
        diferenciais: formatarListaStrings(row.diferenciais),
        destaqueListagem:
          asString(row.destaque_listagem) ||
          normalizarListaStrings(row.diferenciais)[0] ||
          normalizarListaStrings(row.comodidades)[0] ||
          "",
        checkIn: asString(row.check_in),
        checkOut: asString(row.check_out),
        publicado: status === "publicado",
        seoTitulo: titulo,
        whatsapp: asString(row.whatsapp),
        instagram: asString(row.instagram),
        whatsappResponsavel: asString(row.contato),
        endereco: localizacaoHotel.endereco,
        numero: localizacaoHotel.numero,
        bairro: localizacaoHotel.bairro,
        cidade: localizacaoHotel.cidade,
        estado: localizacaoHotel.estado,
      });
    }
    case "negocios": {
      const localizacaoNegocio = decomporEndereco(row.endereco);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo,
        slug,
        categoria,
        descricao,
        logo: criarValorInicialImagem(asString(row.logo), "Logo atual"),
        capa: criarValorInicialImagem(
          asString(row.imagem) || asString(row.logo),
          "Capa atual"
        ),
        destaqueListagem: asString(row.destaque_listagem),
        subcategoria: asString(row.destaque_listagem),
        tipoNegocio: "empresa",
        username: asString(row.username),
        especialidades: normalizarListaStrings(row.especialidades),
        diferenciais: normalizarListaStrings(row.diferenciais),
        publicado: status === "publicado",
        seoTitulo: titulo,
        whatsapp: asString(row.whatsapp),
        instagram: asString(row.instagram),
        whatsappResponsavel: asString(row.contato),
        endereco: localizacaoNegocio.endereco,
        numero: localizacaoNegocio.numero,
        bairro: localizacaoNegocio.bairro,
        cidade: localizacaoNegocio.cidade,
        estado: localizacaoNegocio.estado,
      });
    }
    case "restaurantes": {
      const localizacaoRestaurante = decomporEndereco(row.endereco);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo,
        slug,
        categoria,
        descricao,
        logo: criarValorInicialImagem(asString(row.logo), "Logo atual"),
        capa: criarValorInicialImagem(
          asString(row.imagem) || asString(row.logo),
          "Capa atual"
        ),
        destaqueListagem:
          asString(row.destaque_listagem) || normalizarListaStrings(row.especialidades)[0] || "",
        funcionamento: asString(row.funcionamento),
        especialidades: formatarListaStrings(row.especialidades),
        diferenciais: formatarListaStrings(row.diferenciais),
        publicado: status === "publicado",
        seoTitulo: titulo,
        whatsapp: asString(row.whatsapp),
        instagram: asString(row.instagram),
        whatsappResponsavel: asString(row.contato),
        endereco: localizacaoRestaurante.endereco,
        numero: localizacaoRestaurante.numero,
        bairro: localizacaoRestaurante.bairro,
        cidade: localizacaoRestaurante.cidade,
        estado: localizacaoRestaurante.estado,
      });
    }
  }
}

function validarCamposSolicitacao(tipo: CadastroTipoId, values: FormValues) {
  const campos = obterCamposCadastro(tipo);
  const errors = validarCamposObrigatorios(campos, values);

  if (Object.keys(errors).length === 0) {
    return;
  }

  throw new Error("Revise os campos obrigatórios antes de continuar.");
}

async function verificarSlugExistente(
  tipo: CadastroTipoId,
  slug: string,
  idIgnorado?: string
): Promise<string | undefined> {
  const supabase = createServerSupabaseClient();
  const tabela = TABELA_POR_TIPO[tipo];

  let query = supabase.from(tabela).select("slug").eq("slug", slug);

  if (idIgnorado) {
    query = query.neq("id", idIgnorado);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.slug ?? undefined;
}

async function listarRegistrosSolicitacaoPorTipo(
  tipo: CadastroTipoId,
  status?: StatusEditorial
) {
  const supabase = createServerSupabaseClient();
  const tabela = TABELA_POR_TIPO[tipo];
  let query = supabase.from(tabela).select("*");

  if (status) {
    query = query.eq("status", status);
  } else {
    query = query.in("status", STATUSS_DA_FILA);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RegistroPublicacaoRow[];
}

async function buscarRegistroSolicitacao(tipo: CadastroTipoId, id: string) {
  const supabase = createServerSupabaseClient();
  const tabela = TABELA_POR_TIPO[tipo];
  const { data, error } = await supabase
    .from(tabela)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as RegistroPublicacaoRow | null) ?? null;
}

function mapResumoSolicitacao(
  tipo: CadastroTipoId,
  row: RegistroPublicacaoRow
): PublicSubmission {
  const id = asId(row.id);

  return {
    id: criarIdentificadorSolicitacao(tipo, id),
    tipo,
    titulo: asString(row.titulo) || asString(row.slug),
    responsavel: "",
    contatoEmail: "",
    status: asStatusEditorial(row.status),
    criadoEm: obterCriadoEm(row),
  };
}

function compararSolicitacoesDesc(a: PublicSubmission, b: PublicSubmission) {
  const dataA = Date.parse(a.criadoEm);
  const dataB = Date.parse(b.criadoEm);

  if (Number.isNaN(dataA) && Number.isNaN(dataB)) {
    return a.titulo.localeCompare(b.titulo, "pt-BR");
  }

  if (Number.isNaN(dataA)) {
    return 1;
  }

  if (Number.isNaN(dataB)) {
    return -1;
  }

  return dataB - dataA;
}

export async function salvarSolicitacaoPublica(
  tipo: CadastroTipoId,
  values: FormValues
): Promise<ResultadoSolicitacaoPublica> {
  validarCamposSolicitacao(tipo, values);

  const resultado = await salvarRegistroDashboard(
    tipo,
    {
      ...values,
      publicado: false,
    },
    undefined,
    {
      statusFallback: "pendente_aprovacao",
    }
  );

  return {
    id: criarIdentificadorSolicitacao(tipo, resultado.id),
  };
}

export async function contarSolicitacoesPendentes() {
  const supabase = createServerSupabaseClient();

  const contagens = await Promise.all(
    TIPOS_CADASTRO_PUBLICO.map(async (tipo) => {
      const { count, error } = await supabase
        .from(TABELA_POR_TIPO[tipo])
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente_aprovacao");

      if (error) {
        throw new Error(error.message);
      }

      return count ?? 0;
    })
  );

  return contagens.reduce((total, count) => total + count, 0);
}

export async function listarSolicitacoesPublicas(status?: StatusEditorial) {
  const registros = await Promise.all(
    TIPOS_CADASTRO_PUBLICO.map(async (tipo) => {
      const itens = await listarRegistrosSolicitacaoPorTipo(tipo, status);
      return itens
        .map((row) => mapResumoSolicitacao(tipo, row))
        .filter((row) => row.id.length > 0);
    })
  );

  return registros.flat().sort(compararSolicitacoesDesc);
}

export async function listarSolicitacoesPendentes(): Promise<PublicSubmission[]> {
  return listarSolicitacoesPublicas("pendente_aprovacao");
}

export async function obterSolicitacaoPublica(identificador: string) {
  const { tipo, id } = lerIdentificadorSolicitacao(identificador);
  const row = await buscarRegistroSolicitacao(tipo, id);

  if (!row) {
    return null;
  }

  const payload = montarPayloadCadastro(tipo, row);
  const status = asStatusEditorial(row.status);
  const slugPublicacao = status === "publicado" ? asString(row.slug) : "";

  if (slugPublicacao) {
    payload.slugPublicacao = slugPublicacao;
  }

  return {
    id: identificador,
    tipo,
    titulo: asString(row.titulo) || asString(payload.titulo),
    responsavel: "",
    contatoEmail: "",
    contatoWhatsapp: obterContatoWhatsapp(row),
    status,
    criadoEm: obterCriadoEm(row),
    atualizadoEm: obterAtualizadoEm(row),
    payload,
  } satisfies PublicSubmissionDetail;
}

function construirValoresPersistencia(
  tipo: CadastroTipoId,
  row: RegistroPublicacaoRow,
  values?: FormValues
) {
  const valoresBase = montarPayloadCadastro(tipo, row);

  return values
    ? {
        ...valoresBase,
        ...values,
      }
    : valoresBase;
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
  const { tipo, id: registroId } = lerIdentificadorSolicitacao(id);
  const registro = await buscarRegistroSolicitacao(tipo, registroId);

  if (!registro) {
    throw new Error("Cadastro pendente não encontrado.");
  }

  const statusAtual = asStatusEditorial(registro.status);
  const valoresFormatados = values
    ? aplicarFormatacoesCadastro({ ...values })
    : undefined;

  if (valoresFormatados) {
    validarCamposSolicitacao(tipo, valoresFormatados);
  }

  const valoresPersistencia = construirValoresPersistencia(tipo, registro, valoresFormatados);
  const slugAtual = asString(registro.slug);

  if (action === "salvar") {
    const atualizado = await salvarRegistroDashboard(
      tipo,
      {
        ...valoresPersistencia,
        publicado: statusAtual === "publicado",
      },
      slugAtual,
      {
        idAtual: registroId,
        statusFallback: statusAtual,
      }
    );

    return {
      id,
      tipo,
      status: statusAtual,
      slugPublicacao:
        statusAtual === "publicado"
          ? atualizado.slug ?? asString(valoresPersistencia.slug)
          : undefined,
    };
  }

  if (action === "aprovar") {
    const slugCandidata = asString(valoresPersistencia.slug);
    const slugExistente = slugCandidata
      ? await verificarSlugExistente(tipo, slugCandidata, registroId)
      : undefined;

    if (slugExistente) {
      throw new Error("Já existe um cadastro com este slug.");
    }

    const atualizado = await salvarRegistroDashboard(
      tipo,
      {
        ...valoresPersistencia,
        publicado: true,
      },
      slugAtual,
      {
        idAtual: registroId,
        statusFallback: "pendente_aprovacao",
      }
    );

    return {
      id,
      tipo,
      status: "publicado",
      slugPublicacao: atualizado.slug ?? slugCandidata,
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

  const proximoStatus = statusPorAcao[action];
  const atualizado = await salvarRegistroDashboard(
    tipo,
    {
      ...valoresPersistencia,
      publicado: false,
    },
    slugAtual,
    {
      idAtual: registroId,
      statusFallback: proximoStatus,
    }
  );

  return {
    id,
    tipo,
    status: proximoStatus,
    slugPublicacao:
      proximoStatus === "publicado"
        ? atualizado.slug ?? asString(valoresPersistencia.slug)
        : undefined,
  };
}
