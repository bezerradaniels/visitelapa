import {
  bairrosDashboard,
  categoriasDashboard,
  cidadesDashboard,
  conteudosDashboard,
  paginasDashboard,
  pacotesDashboard,
  tagsDashboard,
} from "@/dados/dashboard";
import {
  buscarPostPorSlugAdmin,
  listarBlogAdmin,
} from "@/servicos/blog";
import {
  criarValorInicialImagemBlog,
  montarHtmlLegadoBlog,
  normalizarGaleriaBlog,
} from "@/servicos/blog-conteudo";
import { formatarMoedaBrlPorNumero } from "@/servicos/formulario-formatacao";
import {
  buscarEventoPorSlugAdmin,
  listarEventosAdmin,
} from "@/servicos/eventos";
import {
  buscarHotelPorSlugAdmin,
  listarHoteisAdmin,
} from "@/servicos/hoteis";
import {
  buscarNegocioPorSlugAdminRaw,
  listarNegociosAdmin,
} from "@/servicos/negocios";
import {
  buscarRestaurantePorSlugAdmin,
  listarRestaurantesAdmin,
} from "@/servicos/restaurantes";
import {
  CadastroTipoId,
  DashboardModuleConfig,
  DashboardModuloId,
  DashboardStat,
  FormFieldDefinition,
  FormValues,
  ImageFieldValue,
} from "@/tipos/plataforma";
import {
  criarValoresIniciais,
  listarTiposCadastroDashboard,
  obterCamposBlog,
  obterCamposCadastro,
  obterRotuloTipoCadastro,
} from "./cadastros";
import { listarCategoriasCadastro, obterCategoriaCadastro } from "./categorias-cadastro";
import {
  contarSolicitacoesPendentes,
  listarSolicitacoesPendentes as listarSolicitacoesPendentesPublicas,
} from "./solicitacoes-publicas";

type PacoteAdminRow = {
  slug: string;
  categoria: string | null;
  titulo: string | null;
  descricao: string | null;
  imagem: string | null;
  logo?: string | null;
  whatsapp: string | null;
  instagram: string | null;
  origem_cidade: string | null;
  origem_estado: string | null;
  destino_cidade: string | null;
  destino_estado: string | null;
  data_ida: string | null;
  data_retorno: string | null;
  valor_vista: number | null;
  valor_parcelado: number | null;
  parcelas: number | null;
  comodidades: string[] | null;
  valor_final_parcelado: number | null;
  status: string | null;
  updated_at?: string | null;
  atualizado_em?: string | null;
};

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

function obterAtualizacaoRegistro(
  row: { updated_at?: string | null; atualizado_em?: string | null },
  fallback = ""
) {
  return row.updated_at ?? row.atualizado_em ?? fallback;
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

async function listarPacotesAdmin() {
  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase
    .from("pacotes")
    .select("*")
    .order("data_ida", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PacoteAdminRow[];
}

async function buscarPacotePorSlugAdmin(slug: string) {
  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase
    .from("pacotes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as PacoteAdminRow | null) ?? undefined;
}

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
    descricao: "Cadastros públicos e internos de pacotes de viagem e romaria.",
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
    descricao: "Cadastre categorias específicas para pacotes, eventos, hotéis, negócios e restaurantes.",
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

  const [negocios, hoteis, restaurantes, eventos, pacotes, blog, pendentes, contatos] =
    await Promise.all([
      supabase.from("negocios").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("hoteis").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("restaurantes").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("eventos").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("pacotes").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "publicado"),
      contarSolicitacoesPendentes(),
      supabase.from("contatos").select("id", { count: "exact", head: true }),
    ]);

  const totalPublicados =
    (negocios.count ?? 0) +
    (hoteis.count ?? 0) +
    (restaurantes.count ?? 0) +
    (eventos.count ?? 0) +
    (pacotes.count ?? 0) +
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
      valor: `${pendentes}`,
      descricao: "Cadastros finais aguardando análise editorial.",
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
  return listarSolicitacoesPendentesPublicas();
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
      try {
        const itens = await listarPacotesAdmin();
        return itens.map((row) => ({
          id: row.slug,
          titulo: row.titulo ?? "",
          categoria: row.categoria ?? "Pacote",
          status: row.status ?? "rascunho",
          atualizado: obterAtualizacaoRegistro(row, row.data_ida ?? ""),
          href: `/dashboard/pacotes/${row.slug}`,
          actions: [
            { type: "edit" as const, href: `/dashboard/pacotes/${row.slug}` },
            {
              type: "pause" as const,
              actionPath: `/api/dashboard/pacotes/${row.slug}`,
              confirmMessage: "Pausar este pacote? Ele ficará arquivado e fora do portal.",
            },
            {
              type: "delete" as const,
              actionPath: `/api/dashboard/pacotes/${row.slug}`,
              confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
            },
          ],
        }));
      } catch {
        return pacotesDashboard.map((item) => ({
          id: item.slug,
          titulo: item.titulo,
          categoria: item.categoria,
          status: item.status,
          atualizado: item.atualizadoEm,
          href: `/dashboard/pacotes/${item.slug}`,
        }));
      }
    case "eventos": {
      const itens = await listarEventosAdmin();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo ?? "",
        categoria: item.categoria ?? "Evento",
        status: item.status ?? "rascunho",
        atualizado: obterAtualizacaoRegistro(item, item.data_inicio ?? ""),
        href: `/dashboard/eventos/${item.slug}`,
        actions: [
          { type: "view" as const, href: `/eventos/${item.slug}` },
          { type: "edit" as const, href: `/dashboard/eventos/${item.slug}` },
          {
            type: "pause" as const,
            actionPath: `/api/dashboard/eventos/${item.slug}`,
            confirmMessage: "Pausar este evento? Ele ficará arquivado e fora do portal.",
          },
          {
            type: "delete" as const,
            actionPath: `/api/dashboard/eventos/${item.slug}`,
            confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
          },
        ],
      }));
    }
    case "hoteis": {
      const itens = await listarHoteisAdmin();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo ?? "",
        categoria: item.categoria ?? "Hotel",
        status: item.status ?? "rascunho",
        atualizado: obterAtualizacaoRegistro(item, item.check_in ?? ""),
        href: `/dashboard/hoteis/${item.slug}`,
        actions: [
          { type: "view" as const, href: `/hoteis/${item.slug}` },
          { type: "edit" as const, href: `/dashboard/hoteis/${item.slug}` },
          {
            type: "pause" as const,
            actionPath: `/api/dashboard/hoteis/${item.slug}`,
            confirmMessage: "Pausar este hotel? Ele ficará arquivado e fora do portal.",
          },
          {
            type: "delete" as const,
            actionPath: `/api/dashboard/hoteis/${item.slug}`,
            confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
          },
        ],
      }));
    }
    case "negocios": {
      const itens = await listarNegociosAdmin();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo ?? "",
        categoria: item.categoria ?? "Negócio",
        status: item.status ?? "rascunho",
        atualizado: obterAtualizacaoRegistro(item, item.atendimento ?? ""),
        href: `/dashboard/negocios/${item.slug}`,
        actions: [
          { type: "view" as const, href: `/negocios/${item.slug}` },
          { type: "edit" as const, href: `/dashboard/negocios/${item.slug}` },
          {
            type: "pause" as const,
            actionPath: `/api/dashboard/negocios/${item.slug}`,
            confirmMessage: "Pausar este negócio? Ele ficará arquivado e fora do portal.",
          },
          {
            type: "delete" as const,
            actionPath: `/api/dashboard/negocios/${item.slug}`,
            confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
          },
        ],
      }));
    }
    case "restaurantes": {
      const itens = await listarRestaurantesAdmin();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo ?? "",
        categoria: item.categoria ?? "Restaurante",
        status: item.status ?? "rascunho",
        atualizado: obterAtualizacaoRegistro(item, item.funcionamento ?? ""),
        href: `/dashboard/restaurantes/${item.slug}`,
        actions: [
          { type: "view" as const, href: `/restaurantes/${item.slug}` },
          { type: "edit" as const, href: `/dashboard/restaurantes/${item.slug}` },
          {
            type: "pause" as const,
            actionPath: `/api/dashboard/restaurantes/${item.slug}`,
            confirmMessage: "Pausar este restaurante? Ele ficará arquivado e fora do portal.",
          },
          {
            type: "delete" as const,
            actionPath: `/api/dashboard/restaurantes/${item.slug}`,
            confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
          },
        ],
      }));
    }
    case "blog": {
      const itens = await listarBlogAdmin();
      return itens.map((item) => ({
        id: item.slug,
        titulo: item.titulo,
        categoria: item.categoria,
        status: item.status,
        atualizado: item.publicadoEm || "Sem publicação",
        href: `/dashboard/blog/${item.slug}`,
        actions: [
          { type: "view" as const, href: `/blog/${item.slug}` },
          { type: "edit" as const, href: `/dashboard/blog/${item.slug}` },
          {
            type: "pause" as const,
            actionPath: `/api/dashboard/blog/${item.slug}`,
            confirmMessage: "Pausar este post? Ele ficará arquivado e fora do portal.",
          },
          {
            type: "delete" as const,
            actionPath: `/api/dashboard/blog/${item.slug}`,
            confirmMessage: "Excluir permanentemente? Esta ação não pode ser desfeita.",
          },
        ],
      }));
    }
    case "categorias":
      try {
        const itens = await listarCategoriasCadastro();
        return itens.map((item) => ({
          id: item.id,
          titulo: item.nome,
          categoria: obterRotuloTipoCadastro(item.tipo),
          status: item.status,
          atualizado: item.atualizadoEm,
          href: `/dashboard/categorias/${item.id}`,
        }));
      } catch {
        return categoriasDashboard.map((item) => ({
          id: item.slug,
          titulo: item.titulo,
          categoria: item.categoria ?? "Categoria",
          status: item.status,
          atualizado: item.atualizadoEm,
          href: `/dashboard/categorias/${item.slug}`,
        }));
      }
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
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("cidades")
          .select("slug, nome, status, updated_at")
          .order("ordem", { ascending: true })
          .order("nome", { ascending: true });
        if (error) throw error;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data ?? []).map((row: any) => ({
          id: row.slug,
          titulo: row.nome,
          categoria: "Cidade",
          status: row.status ?? "publicado",
          atualizado: row.updated_at ?? "",
          href: `/dashboard/cidades/${row.slug}`,
        }));
      } catch {
        return cidadesDashboard.map((item) => ({
          id: item.slug,
          titulo: item.titulo,
          categoria: item.categoria ?? "Cidade",
          status: item.status,
          atualizado: item.atualizadoEm,
          href: `/dashboard/cidades/${item.slug}`,
        }));
      }
    case "bairros":
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("bairros")
          .select("slug, nome, status, updated_at, cidades(nome)")
          .order("ordem", { ascending: true })
          .order("nome", { ascending: true });
        if (error) throw error;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data ?? []).map((row: any) => ({
          id: row.slug,
          titulo: row.nome,
          categoria: row.cidades?.nome ?? "Bairro",
          status: row.status ?? "publicado",
          atualizado: row.updated_at ?? "",
          href: `/dashboard/bairros/${row.slug}`,
        }));
      } catch {
        return bairrosDashboard.map((item) => ({
          id: item.slug,
          titulo: item.titulo,
          categoria: item.categoria ?? "Bairro",
          status: item.status,
          atualizado: item.atualizadoEm,
          href: `/dashboard/bairros/${item.slug}`,
        }));
      }
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
  if (modulo === "categorias") {
    return [
      { key: "titulo", label: "Categoria" },
      { key: "categoria", label: "Cadastro" },
      { key: "status", label: "Status" },
      { key: "atualizado", label: "Atualizado" },
    ];
  }

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
    ["pacotes", "eventos", "hoteis", "negocios", "restaurantes"].includes(
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
      return [
        {
          kind: "select",
          name: "tipoCadastro",
          label: "Cadastro",
          section: "Categoria",
          options: listarTiposCadastroDashboard(),
          required: true,
        },
        {
          kind: "text",
          name: "titulo",
          label: "Nome",
          section: "Categoria",
          required: true,
        },
        {
          kind: "text",
          name: "slug",
          label: "Slug",
          section: "Categoria",
          required: true,
        },
        {
          kind: "textarea",
          name: "descricao",
          label: "Descrição",
          section: "Categoria",
          rows: 3,
        },
      ];
    case "tags":
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
        {
          kind: "number",
          name: "ordem",
          label: "Ordem",
          section: "Cadastro",
          min: 1,
          step: 1,
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
    autor: "",
    conteudo: "",
    seoDescricao: "",
    tipoCadastro: "",
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
    case "tags":
    case "cidades":
    case "bairros": {
      if (modulo === "cidades" || modulo === "bairros") {
        const { supabase } = await import("@/lib/supabase");
        const tabela = modulo;
        const { data: item } = await supabase
          .from(tabela)
          .select("nome, slug, descricao, ordem, status")
          .eq("slug", slug)
          .maybeSingle();

        return criarValoresIniciais(campos, {
          ...seedBase,
          titulo: item?.nome ?? registro.titulo,
          slug: item?.slug ?? registro.id,
          descricao: item?.descricao ?? "",
          ordem: item?.ordem ?? "",
          publicado: item?.status === "publicado",
          seoTitulo: item?.nome ?? registro.titulo,
        });
      }

      const colecao = {
        paginas: paginasDashboard,
        conteudos: conteudosDashboard,
        tags: tagsDashboard,
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
    case "categorias": {
      const item = slug ? await obterCategoriaCadastro(slug) : null;

      return criarValoresIniciais(campos, {
        ...seedBase,
        tipoCadastro: item?.tipo ?? "",
        titulo: item?.nome ?? registro.titulo,
        slug: item?.slug ?? "",
        descricao: item?.descricao ?? "",
        seoTitulo: item?.nome ?? registro.titulo,
      });
    }
    case "pacotes": {
      try {
        const item = await buscarPacotePorSlugAdmin(slug);

        return criarValoresIniciais(campos, {
          ...seedBase,
          titulo: item?.titulo ?? registro.titulo,
          slug: item?.slug ?? registro.id,
          categoria: item?.categoria ?? registro.categoria,
          descricao: item?.descricao ?? "",
          logo: criarValorInicialImagem(item?.logo ?? "", "Logo atual"),
          capa: criarValorInicialImagem(item?.imagem ?? item?.logo ?? "", "Capa atual"),
          dataIda: item?.data_ida ?? "",
          dataRetorno: item?.data_retorno ?? "",
          origemCidade: item?.origem_cidade ?? "",
          origemEstado: item?.origem_estado ?? "",
          destinoCidade: item?.destino_cidade ?? "",
          destinoEstado: item?.destino_estado ?? "",
          valorVista: formatarMoedaInicial(item?.valor_vista),
          valorParcelado: formatarMoedaInicial(item?.valor_parcelado),
          parcelas: item?.parcelas ? String(item.parcelas) : "",
          comodidades: formatarListaStrings(item?.comodidades),
          valorFinalParcelado: formatarMoedaInicial(item?.valor_final_parcelado),
          publicado: item?.status === "publicado",
          seoTitulo: item?.titulo ?? registro.titulo,
          whatsapp: item?.whatsapp ?? seedBase.whatsapp,
          instagram: item?.instagram ?? seedBase.instagram,
        });
      } catch {
        const item = pacotesDashboard.find((entry) => entry.slug === slug);

        return criarValoresIniciais(campos, {
          ...seedBase,
          titulo: item?.titulo ?? registro.titulo,
          slug: item?.slug ?? registro.id,
          categoria: item?.categoria ?? registro.categoria,
          descricao: item?.descricao ?? "",
          dataIda: item?.dataIda ?? "",
          dataRetorno: item?.dataRetorno ?? "",
          origemCidade: item?.origem ?? "",
          origemEstado: "",
          destinoCidade: item?.destino ?? "",
          destinoEstado: "",
          valorVista: item?.valorVista ?? "",
          valorParcelado: item?.valorParcelado ?? "",
          parcelas: item?.parcelas ?? "",
          valorFinalParcelado: "",
          publicado: item?.status === "publicado",
          seoTitulo: item?.titulo ?? registro.titulo,
        });
      }
    }
    case "eventos": {
      const item = await buscarEventoPorSlugAdmin(slug);
      const localizacaoEvento = decomporLocalEvento(item?.local);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        capa: criarValorInicialImagem(item?.imagem ?? "", "Capa atual"),
        destaqueListagem: item?.destaque_listagem ?? "",
        localEvento: localizacaoEvento.localEvento,
        endereco: localizacaoEvento.endereco,
        numero: localizacaoEvento.numero,
        bairro: localizacaoEvento.bairro,
        cidade: localizacaoEvento.cidade,
        estado: localizacaoEvento.estado,
        dataEventoInicio: item?.data_inicio ?? "",
        dataEventoFim: item?.data_fim ?? item?.data_inicio ?? "",
        dataEventoDiaUnico:
          Boolean(item?.data_inicio) &&
          (!item?.data_fim || item.data_inicio === item.data_fim),
        horariosEvento: formatarListaStrings(item?.programacao),
        extrasEvento: formatarListaStrings(item?.destaques),
        valorIngresso: formatarMoedaInicial(item?.valor_ingresso),
        eventoGratuito: item?.gratuito === true,
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
        whatsappResponsavel: item?.contato ?? seedBase.whatsappResponsavel,
      });
    }
    case "hoteis": {
      const item = await buscarHotelPorSlugAdmin(slug);
      const localizacaoHotel = decomporEndereco(item?.localizacao);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        logo: criarValorInicialImagem(item?.logo ?? "", "Logo atual"),
        capa: criarValorInicialImagem(item?.imagem ?? item?.logo ?? "", "Capa atual"),
        comodidades: formatarListaStrings(item?.comodidades),
        diferenciais: formatarListaStrings(item?.diferenciais),
        destaqueListagem:
          item?.destaque_listagem ??
          normalizarListaStrings(item?.diferenciais)[0] ??
          normalizarListaStrings(item?.comodidades)[0] ??
          "",
        checkIn: item?.check_in ?? "",
        checkOut: item?.check_out ?? "",
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
        whatsappResponsavel: item?.contato ?? seedBase.whatsappResponsavel,
        endereco: localizacaoHotel.endereco,
        numero: localizacaoHotel.numero,
        bairro: localizacaoHotel.bairro,
        cidade: localizacaoHotel.cidade,
        estado: localizacaoHotel.estado,
      });
    }
    case "negocios": {
      const item = await buscarNegocioPorSlugAdminRaw(slug);
      const localizacaoNegocio = decomporEndereco(item?.endereco);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        logo: criarValorInicialImagem(item?.logo ?? "", "Logo atual"),
        capa: criarValorInicialImagem(item?.imagem ?? item?.logo ?? "", "Capa atual"),
        destaqueListagem: item?.destaque_listagem ?? "",
        subcategoria: item?.destaque_listagem ?? "",
        tipoNegocio: "empresa",
        username: item?.username ?? "",
        especialidades: normalizarListaStrings(item?.especialidades),
        diferenciais: normalizarListaStrings(item?.diferenciais),
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
        whatsappResponsavel: item?.contato ?? seedBase.whatsappResponsavel,
        endereco: localizacaoNegocio.endereco,
        numero: localizacaoNegocio.numero,
        bairro: localizacaoNegocio.bairro,
        cidade: localizacaoNegocio.cidade,
        estado: localizacaoNegocio.estado,
      });
    }
    case "restaurantes": {
      const item = await buscarRestaurantePorSlugAdmin(slug);
      const localizacaoRestaurante = decomporEndereco(item?.endereco);

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        logo: criarValorInicialImagem(item?.logo ?? "", "Logo atual"),
        capa: criarValorInicialImagem(item?.imagem ?? item?.logo ?? "", "Capa atual"),
        destaqueListagem:
          item?.destaque_listagem ??
          normalizarListaStrings(item?.especialidades)[0] ??
          "",
        funcionamento: item?.funcionamento ?? "",
        especialidades: formatarListaStrings(item?.especialidades),
        diferenciais: formatarListaStrings(item?.diferenciais),
        publicado: item?.status === "publicado",
        seoTitulo: item?.titulo ?? registro.titulo,
        whatsapp: item?.whatsapp ?? seedBase.whatsapp,
        instagram: item?.instagram ?? seedBase.instagram,
        whatsappResponsavel: item?.contato ?? seedBase.whatsappResponsavel,
        endereco: localizacaoRestaurante.endereco,
        numero: localizacaoRestaurante.numero,
        bairro: localizacaoRestaurante.bairro,
        cidade: localizacaoRestaurante.cidade,
        estado: localizacaoRestaurante.estado,
      });
    }
    case "blog": {
      const item = await buscarPostPorSlugAdmin(slug);
      const conteudoHtml = item?.conteudoHtml
        ? item.conteudoHtml
        : item
          ? montarHtmlLegadoBlog(item.conteudo, item.secoes, item.fechamento)
          : seedBase.conteudo;

      return criarValoresIniciais(campos, {
        ...seedBase,
        titulo: item?.titulo ?? registro.titulo,
        slug: item?.slug ?? registro.id,
        categoria: item?.categoria ?? registro.categoria,
        descricao: item?.descricao ?? "",
        imagem: item?.imagem ?? "",
        capa: criarValorInicialImagemBlog(item?.imagem, "Capa atual"),
        galeria: normalizarGaleriaBlog(item?.galeria),
        conteudo: conteudoHtml,
        autor: item?.autor ?? seedBase.autor,
        tags: item?.categoria.toLowerCase() ?? "",
        seoTitulo: item?.titulo ?? registro.titulo,
        publicado: item?.status === "publicado" || registro.status === "publicado",
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
