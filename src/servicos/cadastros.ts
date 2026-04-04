import { assetsEstaticos } from "@/dados/assets";
import {
  CadastroTipoId,
  FieldOption,
  FormFieldDefinition,
  FormValues,
} from "@/tipos/plataforma";
import { obterUsernamesNegociosProibidos } from "./portal";

type CadastroTipoConfig = {
  id: CadastroTipoId;
  href: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
};

const TIPOS_CADASTRO: CadastroTipoConfig[] = [
  {
    id: "pacotes",
    href: "/cadastro?tipo=pacotes",
    titulo: "Cadastre um pacote",
    subtitulo: "Receba solicitações públicas e envie sua proposta para aprovação.",
    descricao:
      "Use este formulário para sugerir pacotes de viagem, romaria ou experiências organizadas.",
  },
  {
    id: "eventos",
    href: "/cadastro?tipo=eventos",
    titulo: "Cadastre um evento",
    subtitulo: "Divulgue sua programação e envie a publicação para análise da equipe.",
    descricao:
      "Ideal para shows, eventos religiosos, encontros culturais e agendas sazonais.",
  },
  {
    id: "hoteis",
    href: "/cadastro?tipo=hoteis",
    titulo: "Cadastre sua hospedagem",
    subtitulo: "Apresente sua estrutura e envie os dados para aprovação editorial.",
    descricao:
      "Use para hotéis, pousadas e hostels que desejam aparecer no portal.",
  },
  {
    id: "negocios",
    href: "/cadastro?tipo=negocios",
    titulo: "Cadastre seu negócio",
    subtitulo: "Mostre sua empresa ou serviço e solicite sua página no Visite Lapa.",
    descricao:
      "Negócios publicados podem ganhar uma URL curta personalizada no portal.",
  },
  {
    id: "restaurantes",
    href: "/cadastro?tipo=restaurantes",
    titulo: "Cadastre seu restaurante",
    subtitulo: "Apresente seu cardápio, seu perfil e envie para revisão da equipe.",
    descricao:
      "Voltado para restaurantes, cafeterias, bistrôs e lanchonetes.",
  },
  {
    id: "turismo",
    href: "/cadastro?tipo=turismo",
    titulo: "Cadastre sua experiência turística",
    subtitulo: "Envie roteiros, passeios e vivências para avaliação editorial.",
    descricao:
      "Ideal para experiências guiadas, passeios e atividades turísticas locais.",
  },
];

const OPCOES_CATEGORIAS: Record<CadastroTipoId, FieldOption[]> = {
  pacotes: [
    { label: "Religioso", value: "Religioso" },
    { label: "Cultura e sabores", value: "Cultura e sabores" },
    { label: "Fim de semana", value: "Fim de semana" },
  ],
  eventos: [
    { label: "Religioso", value: "Religioso" },
    { label: "Cultural", value: "Cultural" },
    { label: "Empresarial", value: "Empresarial" },
    { label: "Esportivo", value: "Esportivo" },
  ],
  hoteis: [
    { label: "Hotel", value: "Hotel" },
    { label: "Pousada", value: "Pousada" },
    { label: "Hostel", value: "Hostel" },
  ],
  negocios: [
    { label: "Comércio", value: "Comércio" },
    { label: "Serviços", value: "Serviços" },
    { label: "Saúde", value: "Saúde" },
    { label: "Educação", value: "Educação" },
  ],
  restaurantes: [
    { label: "Restaurante", value: "Restaurante" },
    { label: "Bistrô", value: "Bistrô" },
    { label: "Cafeteria", value: "Cafeteria" },
    { label: "Lanchonete", value: "Lanchonete" },
  ],
  turismo: [
    { label: "Turismo religioso", value: "Turismo religioso" },
    { label: "Cultura e sabores", value: "Cultura e sabores" },
    { label: "Natureza e contemplação", value: "Natureza e contemplação" },
  ],
};

const CAMPOS_COMUNS_CADASTRO: FormFieldDefinition[] = [
  {
    kind: "text",
    name: "titulo",
    label: "Título",
    section: "Apresentação",
    placeholder: "Nome principal do cadastro",
    required: true,
  },
  {
    kind: "text",
    name: "slug",
    label: "Slug interno",
    section: "Apresentação",
    placeholder: "nome-da-pagina",
    required: true,
  },
  {
    kind: "select",
    name: "categoria",
    label: "Categoria",
    section: "Apresentação",
    required: true,
  },
  {
    kind: "textarea",
    name: "descricao",
    label: "Descrição curta",
    section: "Apresentação",
    placeholder: "Resumo para cards e listagens",
    rows: 3,
    required: true,
  },
  {
    kind: "image-single",
    name: "logo",
    label: "Logo",
    section: "Mídia",
    description: "Opcional. Formato 1:1 com até 1 imagem e ajuste de enquadramento.",
    aspectRatio: "1:1",
    maxFiles: 1,
    buttonLabel: "Selecionar",
    placeholderSrc: assetsEstaticos.placeholders.logoPadrao,
  },
  {
    kind: "image-single",
    name: "capa",
    label: "Capa",
    section: "Mídia",
    description: "Opcional. Formato 16:10 com até 1 imagem para cards e destaques.",
    aspectRatio: "16:10",
    maxFiles: 1,
    buttonLabel: "Selecionar",
    placeholderSrc: assetsEstaticos.placeholders.cardPadrao,
  },
  {
    kind: "image-gallery",
    name: "galeria",
    label: "Galeria",
    section: "Mídia",
    description: "Opcional. Formato 16:10 com até 10 imagens e ajuste individual.",
    aspectRatio: "16:10",
    maxFiles: 10,
    buttonLabel: "Selecionar",
    placeholderSrc: assetsEstaticos.placeholders.cardPadrao,
  },
  {
    kind: "textarea",
    name: "sobre",
    label: "Sobre / conteúdo principal",
    section: "Conteúdo",
    placeholder: "Descreva detalhes importantes do cadastro",
    rows: 5,
  },
  {
    kind: "text",
    name: "destaqueListagem",
    label: "Destaque da listagem",
    section: "Conteúdo",
    placeholder: "Texto curto para badge",
  },
  {
    kind: "text",
    name: "nomeContato",
    label: "Nome do responsável",
    section: "Contato",
    placeholder: "Quem responde por este cadastro",
    required: true,
  },
  {
    kind: "text",
    name: "emailContato",
    label: "Email",
    section: "Contato",
    placeholder: "contato@empresa.com",
    required: true,
  },
  {
    kind: "text",
    name: "whatsapp",
    label: "WhatsApp",
    section: "Contato",
    placeholder: "(77) 99999-9999",
    required: true,
  },
  {
    kind: "text",
    name: "instagram",
    label: "Instagram",
    section: "Contato",
    placeholder: "@nomedoperfil",
  },
  {
    kind: "switch",
    name: "aceitaTermos",
    label: "Confirmo que os dados podem ser analisados para publicação",
    section: "Publicação",
    description: "Todo cadastro público entra em aprovação antes de ser publicado.",
    required: true,
  },
];

const CAMPOS_EXCLUSIVOS: Record<CadastroTipoId, FormFieldDefinition[]> = {
  pacotes: [
    {
      kind: "date-range",
      name: "dataIda",
      label: "Período do pacote",
      section: "Operação",
      startName: "dataIda",
      endName: "dataRetorno",
      startLabel: "Data de ida",
      endLabel: "Data de retorno",
      required: true,
    },
    {
      kind: "text",
      name: "origem",
      label: "Local de saída",
      section: "Operação",
      placeholder: "Cidade de partida",
      required: true,
    },
    {
      kind: "text",
      name: "destino",
      label: "Destino",
      section: "Operação",
      placeholder: "Destino principal",
      required: true,
    },
    {
      kind: "currency",
      name: "valorVista",
      label: "Valor à vista",
      section: "Valores",
      placeholder: "R$ 0,00",
    },
    {
      kind: "currency",
      name: "valorParcelado",
      label: "Valor parcelado",
      section: "Valores",
      placeholder: "R$ 0,00",
    },
    {
      kind: "number",
      name: "parcelas",
      label: "Quantidade de parcelas",
      section: "Valores",
      min: 1,
      step: 1,
    },
  ],
  eventos: [
    {
      kind: "date-range",
      name: "dataEvento",
      label: "Período do evento",
      section: "Operação",
      startName: "dataEventoInicio",
      endName: "dataEventoFim",
      startLabel: "Data inicial",
      endLabel: "Data final",
      required: true,
    },
    {
      kind: "switch",
      name: "eventoGratuito",
      label: "Evento gratuito",
      section: "Valores",
    },
    {
      kind: "currency",
      name: "valorIngresso",
      label: "Valor do ingresso",
      section: "Valores",
      placeholder: "R$ 0,00",
    },
    {
      kind: "text",
      name: "localEvento",
      label: "Local do evento",
      section: "Operação",
      placeholder: "Onde o evento acontece",
      required: true,
    },
  ],
  hoteis: [
    {
      kind: "text",
      name: "checkIn",
      label: "Check-in",
      section: "Operação",
      placeholder: "14h",
      required: true,
    },
    {
      kind: "text",
      name: "checkOut",
      label: "Check-out",
      section: "Operação",
      placeholder: "12h",
      required: true,
    },
  ],
  negocios: [
    {
      kind: "select",
      name: "tipoNegocio",
      label: "Tipo de negócio",
      section: "Operação",
      options: [
        { label: "Empresa", value: "empresa" },
        { label: "Prestador de serviço", value: "prestador" },
      ],
      required: true,
    },
    {
      kind: "text",
      name: "username",
      label: "Nome de usuário público",
      section: "Operação",
      placeholder: "nomedaempresa",
      description:
        "Até 20 caracteres com letras, números e underscore para a URL curta do portal.",
      required: true,
      maxLength: 20,
    },
  ],
  restaurantes: [
    {
      kind: "text",
      name: "tipoComida",
      label: "Tipo de comida",
      section: "Operação",
      placeholder: "Regional, caseira, cafeteria, etc.",
      required: true,
    },
  ],
  turismo: [
    {
      kind: "text",
      name: "duracao",
      label: "Duração",
      section: "Operação",
      placeholder: "Meio período, 1 dia, 3 horas...",
      required: true,
    },
    {
      kind: "text",
      name: "formato",
      label: "Formato",
      section: "Operação",
      placeholder: "Passeio guiado, experiência privada...",
      required: true,
    },
  ],
};

const CAMPOS_BLOG: FormFieldDefinition[] = [
  {
    kind: "text",
    name: "titulo",
    label: "Título do post",
    section: "Post",
    required: true,
  },
  {
    kind: "text",
    name: "slug",
    label: "Slug",
    section: "Post",
    required: true,
  },
  {
    kind: "select",
    name: "categoria",
    label: "Categoria",
    section: "Post",
    options: [
      { label: "Turismo", value: "Turismo" },
      { label: "Hospedagem", value: "Hospedagem" },
      { label: "Gastronomia", value: "Gastronomia" },
      { label: "Eventos", value: "Eventos" },
    ],
    required: true,
  },
  {
    kind: "tags",
    name: "tags",
    label: "Tags",
    section: "Post",
    placeholder: "romeiros, roteiro, gastronomia",
  },
  {
    kind: "textarea",
    name: "descricao",
    label: "Resumo",
    section: "Post",
    rows: 3,
    required: true,
  },
  {
    kind: "text",
    name: "imagem",
    label: "Imagem de capa",
    section: "Mídia",
    placeholder: "https://...",
  },
  {
    kind: "textarea",
    name: "conteudo",
    label: "Conteúdo",
    section: "Conteúdo",
    rows: 10,
    required: true,
  },
  {
    kind: "text",
    name: "autor",
    label: "Autor",
    section: "Metadados",
    placeholder: "Equipe Visite Lapa",
    required: true,
  },
  {
    kind: "text",
    name: "seoTitulo",
    label: "SEO title",
    section: "SEO",
    placeholder: "Título otimizado para buscadores",
  },
  {
    kind: "textarea",
    name: "seoDescricao",
    label: "SEO description",
    section: "SEO",
    rows: 3,
  },
];

export function listarTiposCadastroPublico() {
  return TIPOS_CADASTRO;
}

export function obterTipoCadastroPublico(tipo: string) {
  return TIPOS_CADASTRO.find((item) => item.id === tipo);
}

export function obterCamposCadastro(tipo: CadastroTipoId) {
  return CAMPOS_COMUNS_CADASTRO.map((campo) =>
    campo.name === "categoria"
      ? { ...campo, options: OPCOES_CATEGORIAS[tipo] }
      : campo
  ).concat(CAMPOS_EXCLUSIVOS[tipo]);
}

export function obterCamposBlog() {
  return CAMPOS_BLOG;
}

export function criarValoresIniciais(campos: FormFieldDefinition[], seed?: FormValues) {
  return campos.reduce<FormValues>((acc, campo) => {
    if (campo.kind === "switch" || campo.kind === "checkbox") {
      acc[campo.name] = seed?.[campo.name] ?? false;
    } else if (campo.kind === "image-single" || campo.kind === "image-gallery") {
      const value = seed?.[campo.name];
      acc[campo.name] = Array.isArray(value) ? value : [];
    } else if (campo.kind === "date-range") {
      acc[campo.startName ?? `${campo.name}Inicio`] =
        seed?.[campo.startName ?? `${campo.name}Inicio`] ?? "";
      acc[campo.endName ?? `${campo.name}Fim`] =
        seed?.[campo.endName ?? `${campo.name}Fim`] ?? "";
    } else {
      acc[campo.name] = seed?.[campo.name] ?? "";
    }
    return acc;
  }, {});
}

export async function validarUsernameNegocio(username: string, currentUsername?: string) {
  const valor = username.trim().toLowerCase();

  if (!valor) {
    return "Informe um nome de usuário.";
  }

  if (!/^[a-z0-9_]{1,20}$/.test(valor)) {
    return "Use até 20 caracteres com letras, números e underscore.";
  }

  if (obterUsernamesNegociosProibidos().includes(valor)) {
    return "Esse nome é reservado e não pode ser usado.";
  }

  const { supabase } = await import("@/lib/supabase");
  let query = supabase.from("negocios").select("username").eq("username", valor);
  if (currentUsername) {
    query = query.neq("username", currentUsername);
  }
  const { data } = await query.maybeSingle();

  if (data) {
    return "Esse nome de usuário já está em uso.";
  }

  return undefined;
}

export function validarCamposObrigatorios(
  campos: FormFieldDefinition[],
  values: FormValues
) {
  const errors: Record<string, string> = {};

  for (const campo of campos) {
    if (!campo.required) continue;

    if (campo.kind === "switch" || campo.kind === "checkbox") {
      if (!values[campo.name]) {
        errors[campo.name] = "Este campo é obrigatório.";
      }
      continue;
    }

    if (campo.kind === "date-range") {
      const startName = campo.startName ?? `${campo.name}Inicio`;
      const endName = campo.endName ?? `${campo.name}Fim`;

      if (!values[startName]) {
        errors[startName] = "Preencha a data inicial.";
      }

      if (!values[endName]) {
        errors[endName] = "Preencha a data final.";
      }
      continue;
    }

    if (campo.kind === "image-single" || campo.kind === "image-gallery") {
      const value = values[campo.name];

      if (!Array.isArray(value) || value.length === 0) {
        errors[campo.name] = "Este campo é obrigatório.";
      }
      continue;
    }

    const value = `${values[campo.name] ?? ""}`.trim();
    if (!value) {
      errors[campo.name] = "Este campo é obrigatório.";
    }
  }

  return errors;
}
