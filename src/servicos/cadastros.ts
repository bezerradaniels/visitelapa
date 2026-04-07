import { assetsEstaticos } from "@/dados/assets";
import {
  bairrosBomJesusDaLapa,
  cidadesSugeridas,
  estadosBrasil,
  estadosBrasilSiglas,
} from "@/dados/localidades";
import {
  CadastroTipoId,
  FieldOption,
  FormFieldDefinition,
  FormValues,
} from "@/tipos/plataforma";
import { extrairTextoHtmlBlog } from "./blog-conteudo";
import { obterUsernamesNegociosProibidos } from "./portal";

type CadastroTipoConfig = {
  id: CadastroTipoId;
  href: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
};

const ROTULOS_TIPO_CADASTRO: Record<CadastroTipoId, string> = {
  pacotes: "Pacotes",
  eventos: "Eventos",
  hoteis: "Hotéis",
  negocios: "Negócios",
  restaurantes: "Restaurantes",
};

const TIPOS_CADASTRO: CadastroTipoConfig[] = [
  {
    id: "pacotes",
    href: "/cadastro/pacotes",
    titulo: "Cadastre um pacote",
    subtitulo: "Receba solicitações públicas e envie sua proposta para aprovação.",
    descricao:
      "Use este formulário para sugerir pacotes de viagem, romaria ou experiências organizadas.",
  },
  {
    id: "eventos",
    href: "/cadastro/eventos",
    titulo: "Cadastre um evento",
    subtitulo: "Divulgue sua programação e envie a publicação para análise da equipe.",
    descricao:
      "Ideal para shows, eventos religiosos, encontros culturais e agendas sazonais.",
  },
  {
    id: "hoteis",
    href: "/cadastro/hoteis",
    titulo: "Cadastre sua hospedagem",
    subtitulo: "Apresente sua estrutura e envie os dados para aprovação editorial.",
    descricao:
      "Use para hotéis, pousadas e hostels que desejam aparecer no portal.",
  },
  {
    id: "negocios",
    href: "/cadastro/negocios",
    titulo: "Cadastre seu negócio",
    subtitulo: "Mostre sua empresa ou serviço e solicite sua página no Visite Lapa.",
    descricao:
      "Negócios publicados podem ganhar uma URL curta personalizada no portal.",
  },
  {
    id: "restaurantes",
    href: "/cadastro/restaurantes",
    titulo: "Cadastre seu restaurante",
    subtitulo: "Apresente seu cardápio, seu perfil e envie para revisão da equipe.",
    descricao:
      "Voltado para restaurantes, cafeterias, bistrôs e lanchonetes.",
  },
];

const OPCOES_CATEGORIA_PADRAO: FieldOption[] = [
  { label: "Eventos", value: "Eventos" },
  { label: "Hotéis", value: "Hotéis" },
  { label: "Negócios", value: "Negócios" },
  { label: "Pacotes", value: "Pacotes" },
  { label: "Restaurante", value: "Restaurante" },
];

const OPCOES_CATEGORIA_RESTAURANTES: FieldOption[] = [
  { label: "Restaurante", value: "Restaurante" },
  { label: "Comida regional", value: "Comida regional" },
  { label: "Self-service", value: "Self-service" },
  { label: "Churrascaria", value: "Churrascaria" },
  { label: "Pizzaria", value: "Pizzaria" },
  { label: "Hamburgueria", value: "Hamburgueria" },
  { label: "Lanchonete", value: "Lanchonete" },
  { label: "Cafeteria", value: "Cafeteria" },
  { label: "Padaria", value: "Padaria" },
  { label: "Sorveteria", value: "Sorveteria" },
  { label: "Doceria", value: "Doceria" },
  { label: "Bistrô", value: "Bistrô" },
];

const OPCOES_CATEGORIA_HOTEIS: FieldOption[] = [
  { label: "Hotel", value: "Hotel" },
  { label: "Pousada", value: "Pousada" },
  { label: "Hostel", value: "Hostel" },
  { label: "Apart-hotel", value: "Apart-hotel" },
  { label: "Flat", value: "Flat" },
];

const OPCOES_COMODIDADES_HOTEL: FieldOption[] = [
  { label: "Wi-Fi", value: "Wi-Fi" },
  { label: "Café da manhã", value: "Café da manhã" },
  { label: "Ar-condicionado", value: "Ar-condicionado" },
  { label: "TV", value: "TV" },
  { label: "Frigobar", value: "Frigobar" },
  { label: "Banheiro privativo", value: "Banheiro privativo" },
  { label: "Recepção 24h", value: "Recepção 24h" },
  { label: "Estacionamento", value: "Estacionamento" },
  { label: "Piscina", value: "Piscina" },
  { label: "Restaurante", value: "Restaurante" },
  { label: "Elevador", value: "Elevador" },
  { label: "Acessível", value: "Acessível" },
  { label: "Pet friendly", value: "Pet friendly" },
  { label: "Transfer", value: "Transfer" },
];

const OPCOES_DIFERENCIAIS_RESTAURANTE: FieldOption[] = [
  { label: "Reservas", value: "Reservas" },
  { label: "Delivery", value: "Delivery" },
  { label: "Retirada no local", value: "Retirada no local" },
  { label: "Espaço climatizado", value: "Espaço climatizado" },
  { label: "Área externa", value: "Área externa" },
  { label: "Acessível", value: "Acessível" },
  { label: "Música ao vivo", value: "Música ao vivo" },
  { label: "Espaço família", value: "Espaço família" },
  { label: "Estacionamento", value: "Estacionamento" },
  { label: "Aceita PIX", value: "Aceita PIX" },
  { label: "Cartão", value: "Cartão" },
  { label: "Wi-Fi", value: "Wi-Fi" },
];

const CAMPO_EMAIL_RESPONSAVEL_PUBLICO: FormFieldDefinition = {
  kind: "text",
  name: "emailResponsavel",
  label: "Email da pessoa responsável",
  section: "Contato da pessoa que está cadastrando",
  placeholder: "voce@empresa.com.br",
  required: true,
};

const OPCOES_CATEGORIAS: Record<CadastroTipoId, FieldOption[]> = {
  pacotes: OPCOES_CATEGORIA_PADRAO,
  eventos: [
    { label: "Religioso", value: "Religioso" },
    { label: "Cultural", value: "Cultural" },
    { label: "Empresarial", value: "Empresarial" },
    { label: "Esportivo", value: "Esportivo" },
  ],
  hoteis: OPCOES_CATEGORIA_HOTEIS,
  negocios: OPCOES_CATEGORIA_PADRAO,
  restaurantes: OPCOES_CATEGORIA_RESTAURANTES,
};

const HORARIOS_EVENTO: FieldOption[] = Array.from({ length: 24 }, (_, index) => {
  const hora = String(index).padStart(2, "0");
  return {
    label: `${hora}h`,
    value: `${hora}h`,
  };
});

const ACAO_RAPIDA_CIDADE_EVENTO = [
  {
    label: "Bom Jesus da Lapa",
    value: "Bom Jesus da Lapa",
    updates: [{ name: "estado", value: "BA" }],
  },
];

const ACAO_RAPIDA_CATEGORIA_NEGOCIOS = [
  { label: "Academia", value: "Academia" },
  { label: "Loja", value: "Loja" },
  { label: "Clínica", value: "Clínica" },
  { label: "Contabilidade", value: "Contabilidade" },
];

const CAMPOS_LOCALIZACAO: FormFieldDefinition[] = [
  {
    kind: "text",
    name: "endereco",
    label: "Endereco",
    section: "Informações do negócio",
    placeholder: "Rua, avenida ou ponto de referência",
    required: true,
  },
  {
    kind: "text",
    name: "numero",
    label: "Numero",
    section: "Informações do negócio",
    placeholder: "123 ou s/n",
  },
  {
    kind: "select",
    name: "estado",
    label: "Estado",
    section: "Informações do negócio",
    placeholder: "Digite ou selecione o estado",
    options: estadosBrasil,
    allowCustom: true,
    required: true,
  },
  {
    kind: "select",
    name: "cidade",
    label: "Cidade",
    section: "Informações do negócio",
    placeholder: "Digite ou selecione a cidade",
    options: cidadesSugeridas,
    allowCustom: true,
    required: true,
  },
  {
    kind: "select",
    name: "bairro",
    label: "Bairro",
    section: "Informações do negócio",
    placeholder: "Digite ou selecione o bairro",
    options: bairrosBomJesusDaLapa,
    allowCustom: true,
    required: true,
  },
];

const CAMPOS_LOCALIZACAO_IGNORADOS_PACOTES = new Set(
  CAMPOS_LOCALIZACAO.map((campo) => campo.name)
);

const CAMPOS_COMUNS_CADASTRO: FormFieldDefinition[] = [
  {
    kind: "text",
    name: "titulo",
    label: "Título",
    section: "Informações do negócio",
    placeholder: "Nome principal do cadastro",
    required: true,
  },
  {
    kind: "select",
    name: "categoria",
    label: "Categoria",
    section: "Informações do negócio",
    placeholder: "Digite ou selecione a categoria",
    allowCustom: true,
    required: true,
  },
  {
    kind: "textarea",
    name: "descricao",
    label: "Descrição completa",
    section: "Informações do negócio",
    placeholder: "Descreva o cadastro com mais contexto, detalhes e diferenciais.",
    rows: 5,
    maxLength: 500,
    required: true,
  },
  {
    kind: "text",
    name: "whatsapp",
    label: "WhatsApp do negócio",
    section: "Informações do negócio",
    placeholder: "(77) 99999-9999",
    required: true,
  },
  {
    kind: "text",
    name: "instagram",
    label: "Instagram do negócio",
    section: "Informações do negócio",
    placeholder: "nomedoperfil",
    description: "Digite apenas o username. Se colar a URL completa, vamos extrair o nome.",
  },
  ...CAMPOS_LOCALIZACAO,
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
    kind: "text",
    name: "nomeContato",
    label: "Nome da pessoa responsável",
    section: "Contato da pessoa que está cadastrando",
    placeholder: "Quem responde por este cadastro",
    required: true,
  },
  {
    kind: "text",
    name: "whatsappResponsavel",
    label: "WhatsApp da pessoa responsável",
    section: "Contato da pessoa que está cadastrando",
    placeholder: "(77) 99999-9999",
    required: true,
  },
  {
    kind: "checkbox",
    name: "aceitaTermos",
    label: "Aceito os termos de uso e a política de privacidade",
    section: "Termos",
    description: "Seu cadastro entra em aprovação antes de ser publicado no portal.",
    required: true,
  },
];

const CAMPOS_EXCLUSIVOS: Record<CadastroTipoId, FormFieldDefinition[]> = {
  pacotes: [
    {
      kind: "date-range",
      name: "dataIda",
      label: "Período do pacote",
      section: "Informações do negócio",
      fullWidth: true,
      startName: "dataIda",
      endName: "dataRetorno",
      startLabel: "Data de ida",
      endLabel: "Data de retorno",
      required: true,
    },
    {
      kind: "select",
      name: "origemCidade",
      label: "Local de saída",
      section: "Informações do negócio",
      placeholder: "Digite ou selecione o local de saída",
      options: cidadesSugeridas,
      allowCustom: true,
      quickActions: [
        {
          label: "Bom Jesus da Lapa",
          value: "Bom Jesus da Lapa",
          updates: [{ name: "origemEstado", value: "BA" }],
        },
      ],
      required: true,
    },
    {
      kind: "select",
      name: "origemEstado",
      label: "UF de saída",
      section: "Informações do negócio",
      placeholder: "BA",
      options: estadosBrasilSiglas,
      allowCustom: true,
      maxLength: 2,
      required: true,
    },
    {
      kind: "select",
      name: "destinoCidade",
      label: "Local de destino",
      section: "Informações do negócio",
      placeholder: "Digite ou selecione o local de destino",
      options: cidadesSugeridas,
      allowCustom: true,
      quickActions: [
        {
          label: "Porto Seguro",
          value: "Porto Seguro",
          updates: [{ name: "destinoEstado", value: "BA" }],
        },
        {
          label: "Ilhéus",
          value: "Ilhéus",
          updates: [{ name: "destinoEstado", value: "BA" }],
        },
        {
          label: "Morro de São Paulo",
          value: "Morro de São Paulo",
          updates: [{ name: "destinoEstado", value: "BA" }],
        },
      ],
      required: true,
    },
    {
      kind: "select",
      name: "destinoEstado",
      label: "UF de destino",
      section: "Informações do negócio",
      placeholder: "BA",
      options: estadosBrasilSiglas,
      allowCustom: true,
      maxLength: 2,
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
      label: "Parcelado total",
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
    {
      kind: "tags",
      name: "comodidades",
      label: "Comodidades",
      section: "Informações do negócio",
      fullWidth: true,
      placeholder: "wifi, transporte, hospedagem, cafe da manha",
      description: "Separe as comodidades por vírgula.",
    },
    {
      kind: "currency",
      name: "valorFinalParcelado",
      label: "Valor final parcelado",
      section: "Valores",
      placeholder: "R$ 0,00",
      description: "Calculado automaticamente com base no total parcelado e na quantidade de parcelas.",
      readOnly: true,
    },
  ],
  eventos: [
    {
      kind: "date-range",
      name: "dataEvento",
      label: "Período do evento",
      section: "Informações do negócio",
      description:
        "Preencha apenas a data inicial se o evento acontecer em um único dia.",
      fullWidth: true,
      startName: "dataEventoInicio",
      endName: "dataEventoFim",
      startLabel: "Data inicial",
      endLabel: "Data final",
      singleDayFieldName: "dataEventoDiaUnico",
      singleDayLabel: "Evento em um único dia",
      required: true,
    },
    {
      kind: "select",
      name: "horariosEvento",
      label: "Horários do evento",
      section: "Informações do negócio",
      description: "Selecione um ou mais horários entre 00h e 23h.",
      options: HORARIOS_EVENTO,
      multiple: true,
      size: 4,
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
      section: "Informações do negócio",
      placeholder: "Ex.: antigo aeroporto, avenida principal, bar di maria",
      description: "Informe o nome do espaço, ponto de referência ou estabelecimento.",
      required: true,
    },
    {
      kind: "tags",
      name: "extrasEvento",
      label: "Extras do evento",
      section: "Informações do negócio",
      fullWidth: true,
      placeholder: "open bar, abada, area vip, seguranca reforcada",
      description:
        "Adicione diferenciais ou itens extras separados por vírgula. Ex.: open bar, abadá, área VIP, segurança reforçada.",
    },
  ],
  hoteis: [
    {
      kind: "text",
      name: "checkIn",
      label: "Check-in",
      section: "Informações do negócio",
      placeholder: "14h",
      required: true,
    },
    {
      kind: "text",
      name: "checkOut",
      label: "Check-out",
      section: "Informações do negócio",
      placeholder: "12h",
      required: true,
    },
    {
      kind: "checkbox-group",
      name: "comodidades",
      label: "Comodidades da hospedagem",
      section: "Informações do negócio",
      fullWidth: true,
      description: "Selecione as comodidades que ajudam o visitante a decidir a reserva.",
      options: OPCOES_COMODIDADES_HOTEL,
      required: true,
    },
    {
      kind: "tags",
      name: "diferenciais",
      label: "Diferenciais",
      section: "Informações do negócio",
      fullWidth: true,
      placeholder: "perto do santuario, ambiente familiar, ideal para romarias",
      description: "Separe os diferenciais por vírgula.",
    },
  ],
  negocios: [
    {
      kind: "text",
      name: "subcategoria",
      label: "Subcategoria",
      section: "Informações do negócio",
      placeholder: "Odonto, Estética, etc",
      description: "A subcategoria ajuda a classificar melhor seu negócio.",
      required: true,
    },
    {
      kind: "text",
      name: "username",
      label: "Username",
      section: "Informações do negócio",
      placeholder: "nomedaempresa",
      description:
        "Até 20 caracteres com letras, números e underscore para a URL curta do portal.",
      required: true,
      maxLength: 20,
    },
    {
      kind: "text-array",
      name: "especialidades",
      label: "Serviços",
      section: "Informações do negócio",
      placeholder: "Nome do serviço",
      description: "Adicione os principais serviços oferecidos pelo seu negócio.",
      required: true,
    },
    {
      kind: "text-array",
      name: "diferenciais",
      label: "Diferenciais",
      section: "Informações do negócio",
      placeholder: "Diferencial do negócio",
      description: "Adicione os diferenciais (ex: Estacionamento, Wi-fi, Atendimento 24h).",
      required: true,
    },
  ],
  restaurantes: [
    {
      kind: "text",
      name: "funcionamento",
      label: "Funcionamento",
      section: "Informações do negócio",
      placeholder: "Seg a dom, 11h as 23h",
      required: true,
    },
    {
      kind: "tags",
      name: "especialidades",
      label: "Especialidades",
      section: "Informações do negócio",
      fullWidth: true,
      placeholder: "comida regional, peixe, churrasco, pizzas, cafe da manha",
      description: "Liste os pratos, estilos ou destaques do cardápio separados por vírgula.",
      required: true,
    },
    {
      kind: "checkbox-group",
      name: "diferenciais",
      label: "Diferenciais do restaurante",
      section: "Informações do negócio",
      fullWidth: true,
      description: "Selecione os serviços e facilidades que mais ajudam o visitante a decidir.",
      options: OPCOES_DIFERENCIAIS_RESTAURANTE,
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
      { label: "Pacotes", value: "Pacotes" },
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
    kind: "image-single",
    name: "capa",
    label: "Imagem de capa",
    section: "Mídia",
    description: "Opcional. Formato 16:10 com recorte ajustável para hero e cards do blog.",
    aspectRatio: "16:10",
    maxFiles: 1,
    buttonLabel: "Selecionar capa",
    placeholderSrc: assetsEstaticos.placeholders.cardPadrao,
  },
  {
    kind: "image-gallery",
    name: "galeria",
    label: "Galeria do artigo",
    section: "Mídia",
    description: "Opcional. Adicione imagens complementares para exibir na página do post.",
    aspectRatio: "16:10",
    maxFiles: 12,
    buttonLabel: "Adicionar imagens",
    placeholderSrc: assetsEstaticos.placeholders.cardPadrao,
  },
  {
    kind: "rich-text",
    name: "conteudo",
    label: "Conteúdo",
    section: "Conteúdo",
    description:
      "Escreva com formatação rica, links, listas e citações. A galeria cadastrada será exibida no artigo.",
    required: true,
    fullWidth: true,
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
  {
    kind: "switch",
    name: "publicado",
    label: "Publicar este artigo",
    section: "Publicação",
  },
];

export function listarTiposCadastroPublico() {
  return TIPOS_CADASTRO;
}

export function obterTipoCadastroPublico(tipo: string) {
  return TIPOS_CADASTRO.find((item) => item.id === tipo);
}

export function moduloEhTipoCadastro(modulo: string): modulo is CadastroTipoId {
  return TIPOS_CADASTRO.some((item) => item.id === modulo);
}

export function obterRotuloTipoCadastro(tipo: CadastroTipoId) {
  return ROTULOS_TIPO_CADASTRO[tipo];
}

export function listarTiposCadastroDashboard(): FieldOption[] {
  return Object.entries(ROTULOS_TIPO_CADASTRO).map(([value, label]) => ({
    value,
    label,
  }));
}

export function listarOpcoesCategoriaPadrao(tipo: CadastroTipoId) {
  return OPCOES_CATEGORIAS[tipo];
}

export function obterCamposCadastro(tipo: CadastroTipoId) {
  const exclusivos = [...(CAMPOS_EXCLUSIVOS[tipo] || [])];

  const comuns = CAMPOS_COMUNS_CADASTRO.filter((campo) =>
    tipo === "pacotes" ? !CAMPOS_LOCALIZACAO_IGNORADOS_PACOTES.has(campo.name) : true
  ).map((campo) => {
    if (campo.name === "categoria") {
      if (tipo === "negocios") {
        return {
          ...campo,
          kind: "text" as const,
          options: undefined,
          allowCustom: undefined,
          quickActions: ACAO_RAPIDA_CATEGORIA_NEGOCIOS,
        };
      }
      return {
        ...campo,
        options: OPCOES_CATEGORIAS[tipo],
      };
    }

    if (tipo === "eventos" && campo.name === "cidade") {
      return {
        ...campo,
        quickActions: ACAO_RAPIDA_CIDADE_EVENTO,
      };
    }

    return campo;
  });

  if (tipo === "negocios") {
    const subIdx = exclusivos.findIndex((c) => c.name === "subcategoria");
    if (subIdx !== -1) {
      const [campoSub] = exclusivos.splice(subIdx, 1);
      const catIdx = comuns.findIndex((c) => c.name === "categoria");
      if (catIdx !== -1) {
        comuns.splice(catIdx + 1, 0, campoSub);
      } else {
        comuns.push(campoSub);
      }
    }
  }

  return comuns.concat(exclusivos);
}

export function obterCamposCadastroPublico(tipo: CadastroTipoId) {
  const campos = obterCamposCadastro(tipo);
  const indiceWhatsappResponsavel = campos.findIndex(
    (campo) => campo.name === "whatsappResponsavel"
  );

  if (indiceWhatsappResponsavel === -1) {
    return [...campos, CAMPO_EMAIL_RESPONSAVEL_PUBLICO];
  }

  return [
    ...campos.slice(0, indiceWhatsappResponsavel + 1),
    CAMPO_EMAIL_RESPONSAVEL_PUBLICO,
    ...campos.slice(indiceWhatsappResponsavel + 1),
  ];
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
      const startName = campo.startName ?? `${campo.name}Inicio`;
      const endName = campo.endName ?? `${campo.name}Fim`;
      const startValue = seed?.[startName] ?? "";
      const endValue = seed?.[endName] ?? "";

      acc[startName] = startValue;
      acc[endName] = endValue;

      if (campo.singleDayFieldName) {
        const valorDiaUnico = seed?.[campo.singleDayFieldName];
        acc[campo.singleDayFieldName] =
          typeof valorDiaUnico === "boolean"
            ? valorDiaUnico
            : Boolean(startValue) && (!endValue || startValue === endValue);
      }
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

export function campoPreenchido(field: FormFieldDefinition, values: FormValues) {
  if (field.readOnly) {
    return true;
  }

  if (field.name === "valorIngresso" && values.eventoGratuito === true) {
    return true;
  }

  if (field.kind === "switch" || field.kind === "checkbox") {
    return Boolean(values[field.name]);
  }

  if (field.kind === "date-range") {
    const startName = field.startName ?? `${field.name}Inicio`;
    const endName = field.endName ?? `${field.name}Fim`;
    const isSingleDay = field.singleDayFieldName
      ? values[field.singleDayFieldName] === true
      : false;

    return isSingleDay
      ? Boolean(values[startName])
      : Boolean(values[startName] && values[endName]);
  }

  if (field.kind === "image-single" || field.kind === "image-gallery") {
    const fieldValue = values[field.name];
    return Array.isArray(fieldValue) && fieldValue.length > 0;
  }

  if (field.kind === "rich-text") {
    return extrairTextoHtmlBlog(values[field.name]).trim().length > 0;
  }

  return String(values[field.name] ?? "").trim().length > 0;
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
      const isSingleDay = campo.singleDayFieldName
        ? values[campo.singleDayFieldName] === true
        : false;

      if (!values[startName]) {
        errors[startName] = "Preencha a data inicial.";
      }

      if (!isSingleDay && !values[endName]) {
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

    if (campo.kind === "rich-text") {
      const value = extrairTextoHtmlBlog(values[campo.name]).trim();

      if (!value) {
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
