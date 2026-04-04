import {
  bairrosDashboard,
  categoriasDashboard,
  cidadesDashboard,
  conteudosDashboard,
  paginasDashboard,
  pacotesDashboard,
  tagsDashboard,
} from "@/dados/dashboard";
import { buscarPostPorSlug, listarBlog } from "@/servicos/blog";
import { buscarEventoPorSlug, listarEventos } from "@/servicos/eventos";
import { buscarHotelPorSlug, listarHoteis } from "@/servicos/hoteis";
import { buscarNegocioPorSlug, listarNegocios } from "@/servicos/negocios";
import { buscarRestaurantePorSlug, listarRestaurantes } from "@/servicos/restaurantes";
import { buscarTurismoPorSlug, listarTurismo } from "@/servicos/turismo";
import {
  CadastroTipoId,
  DashboardModuleConfig,
  DashboardModuloId,
  DashboardStat,
  FormFieldDefinition,
  FormValues,
} from "@/tipos/plataforma";
import { criarValoresIniciais, obterCamposBlog, obterCamposCadastro } from "./cadastros";

const MODULOS_DASHBOARD: DashboardModuleConfig[] = [
  {
    id: "paginas",
    label: "Páginas",
    descricao: "Gerencie páginas institucionais e estáticas do portal.",
    href: "/dashboard/paginas",
    acaoLabel: "Nova página",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "conteudos",
    label: "Conteúdos",
    descricao: "Controle blocos, seções e conteúdos auxiliares.",
    href: "/dashboard/conteudos",
    acaoLabel: "Novo conteúdo",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "pacotes",
    label: "Pacotes",
    descricao: "Cadastros públicos e internos de pacotes turísticos.",
    href: "/dashboard/pacotes",
    acaoLabel: "Novo pacote",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "eventos",
    label: "Eventos",
    descricao: "Gerencie eventos publicados e pendentes de aprovação.",
    href: "/dashboard/eventos",
    acaoLabel: "Novo evento",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "hoteis",
    label: "Hotéis",
    descricao: "Administre hospedagens e seus dados de publicação.",
    href: "/dashboard/hoteis",
    acaoLabel: "Novo hotel",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "negocios",
    label: "Negócios",
    descricao: "Acompanhe empresas, serviços e usernames públicos.",
    href: "/dashboard/negocios",
    acaoLabel: "Novo negócio",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "restaurantes",
    label: "Restaurantes",
    descricao: "Organize restaurantes, tipos de comida e publicações.",
    href: "/dashboard/restaurantes",
    acaoLabel: "Novo restaurante",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "turismo",
    label: "Turismo",
    descricao: "Gerencie experiências, roteiros e passeios.",
    href: "/dashboard/turismo",
    acaoLabel: "Nova experiência",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "blog",
    label: "Blog",
    descricao: "Escreva, edite e publique conteúdos editoriais.",
    href: "/dashboard/blog",
    acaoLabel: "Novo post",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "categorias",
    label: "Categorias",
    descricao: "Agrupe conteúdos e entidades do portal.",
    href: "/dashboard/categorias",
    acaoLabel: "Nova categoria",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "tags",
    label: "Tags",
    descricao: "Aplique taxonomias complementares ao conteúdo.",
    href: "/dashboard/tags",
    acaoLabel: "Nova tag",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "cidades",
    label: "Cidades",
    descricao: "Administre localidades usadas nos cadastros.",
    href: "/dashboard/cidades",
    acaoLabel: "Nova cidade",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "bairros",
    label: "Bairros",
    descricao: "Padronize bairros e regiões de referência.",
    href: "/dashboard/bairros",
    acaoLabel: "Novo bairro",
    supportsCreate: true,
    supportsEdit: true,
  },
  {
    id: "contatos",
    label: "Contatos",
    descricao: "Monitore mensagens recebidas pelo portal.",
    href: "/dashboard/contatos",
    supportsCreate: false,
    supportsEdit: true,
  },
];

export function listarModulosDashboard() {
  return MODULOS_DASHBOARD;
}

export function obterModuloDashboard(modulo: string) {
  return MODULOS_DASHBOARD.find((item) => item.id === modulo);
}

export async function listarEstatisticasDashboard(): Promise<DashboardStat[]> {
  const { supabase } = await import("@/lib/supabase");

  const [negocios, hoteis, restaurantes, turismo, eventos, blog, pendentes, contatos] =
    await Promise.all([
      supabase.from("negocios").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("hoteis").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("restaurantes").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("turismo").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("eventos").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("solicitacoes_publicas").select("id", { count: "exact", head: true }).eq("status", "pendente_aprovacao"),
      supabase.from("contatos").select("id", { count: "exact", head: true }),
    ]);

  const totalPublicados =
    (negocios.count ?? 0) +
    (hoteis.count ?? 0) +
    (restaurantes.count ?? 0) +
    (turismo.count ?? 0) +
    (eventos.count ?? 0) +
    (blog.count ?? 0);

  return [
    {
      id: "publicados",
      label: "Itens publicados",
      valor: `${totalPublicados}`,
      descricao: "Entradas públicas já visíveis no portal.",
    },
    {
      id: "pendentes",
      label: "Aguardando aprovação",
      valor: `${pendentes.count ?? 0}`,
      descricao: "Solicitações públicas aguardando análise.",
    },
    {
      id: "contatos",
      label: "Mensagens recebidas",
      valor: `${contatos.count ?? 0}`,
      descricao: "Mensagens registradas no módulo de contatos.",
    },
    {
      id: "modulos",
      label: "Módulos ativos",
      valor: `${MODULOS_DASHBOARD.length}`,
      descricao: "Áreas administrativas já previstas no dashboard.",
    },
  ];
}

export async function listarSolicitacoesPendentes() {
  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase
    .from("solicitacoes_publicas")
    .select("*")
    .eq("status", "pendente_aprovacao")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    tipo: row.tipo,
    titulo: row.titulo,
    responsavel: row.responsavel,
    contatoEmail: row.contato_email,
    status: row.status,
    criadoEm: row.criado_em,
  }));
}

export async function listarLinhasModulo(modulo: DashboardModuloId) {
  switch (modulo) {
    case "paginas":
      return paginasDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Sem categoria",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/paginas/${item.slug}`,
      }));
    case "conteudos":
      return conteudosDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Conteúdo",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/conteudos/${item.slug}`,
      }));
    case "pacotes":
      return pacotesDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/pacotes/${item.slug}`,
      }));
    case "eventos": {
      const itens = await listarEventos();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.data,
        href: `/dashboard/eventos/${item.slug}`,
      }));
    }
    case "hoteis": {
      const itens = await listarHoteis();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.checkIn,
        href: `/dashboard/hoteis/${item.slug}`,
      }));
    }
    case "negocios": {
      const itens = await listarNegocios();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.atendimento,
        href: `/dashboard/negocios/${item.slug}`,
      }));
    }
    case "restaurantes": {
      const itens = await listarRestaurantes();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.funcionamento,
        href: `/dashboard/restaurantes/${item.slug}`,
      }));
    }
    case "turismo": {
      const itens = await listarTurismo();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.duracao,
        href: `/dashboard/turismo/${item.slug}`,
      }));
    }
    case "blog": {
      const itens = await listarBlog();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: "publicado" as const,
        atualizado: item.publicadoEm,
        href: `/dashboard/blog/${item.slug}`,
      }));
    }
    case "categorias":
      return categoriasDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Categoria",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/categorias/${item.slug}`,
      }));
    case "tags":
      return tagsDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Tag",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/tags/${item.slug}`,
      }));
    case "cidades":
      return cidadesDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Cidade",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/cidades/${item.slug}`,
      }));
    case "bairros":
      return bairrosDashboard.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria ?? "Bairro",
        status: item.status,
        atualizado: item.atualizadoEm,
        href: `/dashboard/bairros/${item.slug}`,
      }));
    case "contatos": {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from("contatos")
        .select("*")
        .order("recebido_em", { ascending: false });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data ?? []).map((row: any) => ({
        id: row.id,
        titulo: row.nome,
        categoria: row.assunto,
        status: row.status,
        atualizado: row.recebido_em,
        href: `/dashboard/contatos/${row.id}`,
      }));
    }
    default:
      return [];
  }
}

export function listarColunasModulo(modulo: DashboardModuloId) {
  if (modulo === "contatos") {
    return [
      { key: "titulo", label: "Contato" },
      { key: "categoria", label: "Assunto" },
      { key: "status", label: "Status" },
      { key: "atualizado", label: "Recebido em" },
    ];
  }

  return [
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "status", label: "Status" },
    { key: "atualizado", label: "Atualizado" },
  ];
}

function camposBasicosSimples(secao = "Conteúdo"): FormFieldDefinition[] {
  return [
    { kind: "text", name: "titulo", label: "Título", section: secao, required: true },
    { kind: "text", name: "slug", label: "Slug", section: secao, required: true },
    {
      kind: "textarea",
      name: "descricao",
      label: "Descrição",
      section: secao,
      rows: 4,
      required: true,
    },
    {
      kind: "switch",
      name: "publicado",
      label: "Marcar como publicado",
      section: "Publicação",
    },
  ];
}

export function obterCamposModulo(modulo: DashboardModuloId): FormFieldDefinition[] {
  if (
    ["pacotes", "eventos", "hoteis", "negocios", "restaurantes", "turismo"].includes(
      modulo
    )
  ) {
    return obterCamposCadastro(modulo as CadastroTipoId);
  }

  switch (modulo) {
    case "blog":
      return obterCamposBlog();
    case "paginas":
      return camposBasicosSimples("Página");
    case "conteudos":
      return camposBasicosSimples("Conteúdo");
    case "categorias":
    case "tags":
    case "cidades":
    case "bairros":
      return [
        {
          kind: "text",
          name: "titulo",
          label: "Nome",
          section: "Cadastro",
          required: true,
        },
        {
          kind: "text",
          name: "slug",
          label: "Slug",
          section: "Cadastro",
          required: true,
        },
        {
          kind: "textarea",
          name: "descricao",
          label: "Descrição",
          section: "Cadastro",
          rows: 3,
        },
      ];
    case "contatos":
      return [
        {
          kind: "text",
          name: "nome",
          label: "Nome",
          section: "Contato",
          required: true,
        },
        {
          kind: "text",
          name: "whatsapp",
          label: "WhatsApp",
          section: "Contato",
        },
        {
          kind: "text",
          name: "assunto",
          label: "Assunto",
          section: "Contato",
          required: true,
        },
        {
          kind: "select",
          name: "status",
          label: "Status",
          section: "Atendimento",
          required: true,
          options: [
            { label: "Novo", value: "novo" },
            { label: "Lido", value: "lido" },
            { label: "Respondido", value: "respondido" },
            { label: "Arquivado", value: "arquivado" },
          ],
        },
        {
          kind: "text",
          name: "email",
          label: "Email",
          section: "Contato",
          required: true,
        },
        {
          kind: "textarea",
          name: "mensagem",
          label: "Mensagem",
          section: "Contato",
          rows: 5,
          required: true,
        },
      ];
    default:
      return [];
  }
}

export async function obterValoresModulo(
  modulo: DashboardModuloId,
  slug?: string
): Promise<FormValues> {
  const campos = obterCamposModulo(modulo);
  const seedBase: FormValues = {
    nomeContato: "",
    emailContato: "",
    whatsapp: "",
    instagram: "",
    aceitaTermos: true,
    autor: "",
    conteudo: "",
    seoDescricao: "",
  };

  const linhas = await listarLinhasModulo(modulo);
  const registro = slug ? linhas.find((item) => item.id === slug) : undefined;

  if (!slug || !registro) {
    return criarValoresIniciais(campos, {
      ...seedBase,
      titulo: "",
      slug: "",
      categoria: "",
      descricao: "",
      publicado: false,
      seoTitulo: "",
      username: "",
    });
  }

  switch (modulo) {
    case "paginas":
    case "conteudos":
    case "categorias":
    case "tags":
    case "cidades":
    case "bairros": {
      const colecao = {
        paginas: paginasDashboard,
        conteudos: conteudosDashboard,
        categorias: categoriasDashboard,
        tags: tagsDashboard,
        cidades: cidadesDashboard,
        bairros: bairrosDashboard,
      }[modulo];

      const item = colecao.find((entry) => entry.slug === slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: "",
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
      });
    }
    case "pacotes": {
      const item = pacotesDashboard.find((entry) => entry.slug === slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        dataIda: item?.dataIda ?? "",
        dataRetorno: item?.dataRetorno ?? "",
        origem: item?.origem ?? "",
        destino: item?.destino ?? "",
        valorVista: item?.valorVista ?? "",
        valorParcelado: item?.valorParcelado ?? "",
        parcelas: item?.parcelas ?? "",
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
      });
    }
    case "eventos": {
      const item = await buscarEventoPorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        sobre: item?.sobre.join("\n\n") ?? "",
        destaqueListagem: item?.destaqueListagem ?? "",
        localEvento: item?.local ?? "",
        valorIngresso: "",
        eventoGratuito: false,
        publicado: registro.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
      });
    }
    case "hoteis": {
      const item = await buscarHotelPorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        sobre: item?.sobre.join("\n\n") ?? "",
        destaqueListagem: item?.destaqueListagem ?? "",
        checkIn: item?.checkIn ?? "",
        checkOut: item?.checkOut ?? "",
        publicado: registro.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
      });
    }
    case "negocios": {
      const item = await buscarNegocioPorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        sobre: item?.sobre.join("\n\n") ?? "",
        destaqueListagem: item?.destaqueListagem ?? "",
        tipoNegocio: "empresa",
        username: item?.username ?? "",
        publicado: registro.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
      });
    }
    case "restaurantes": {
      const item = await buscarRestaurantePorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        sobre: item?.sobre.join("\n\n") ?? "",
        destaqueListagem: item?.destaqueListagem ?? "",
        tipoComida: item?.categoria ?? "",
        publicado: registro.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
      });
    }
    case "turismo": {
      const item = await buscarTurismoPorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        sobre: item?.sobre.join("\n\n") ?? "",
        destaqueListagem: item?.destaqueListagem ?? "",
        duracao: item?.duracao ?? "",
        formato: item?.formato ?? "",
        publicado: registro.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
      });
    }
    case "blog": {
      const item = await buscarPostPorSlug(slug);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        conteudo: item
          ? [...item.conteudo, ...item.secoes.map((secao) => `${secao.titulo}\n${secao.texto}`), item.fechamento].join(
              "\n\n"
            )
          : seedBase.conteudo,
        autor: item?.autor ?? seedBase.autor,
        tags: item?.categoria.toLowerCase() ?? "",
        seoTitulo: item?.titulo ?? registro.titulo,
      });
    }
    case "contatos": {
      const { supabase } = await import("@/lib/supabase");
      const { data: item } = await supabase
        .from("contatos")
        .select("*")
        .eq("id", slug)
        .maybeSingle();

      return criarValoresIniciais(campos, {
        nome: item?.nome ?? "",
        email: item?.email ?? "",
        whatsapp: item?.whatsapp ?? "",
        assunto: item?.assunto ?? "",
        status: item?.status ?? "novo",
        mensagem: item?.mensagem ?? "",
      });
    }
    default:
      return criarValoresIniciais(campos, seedBase);
  }
}
