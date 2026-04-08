import { Restaurante } from "@/dados/restaurantes";
import { buscarRegistroAdminPorSlug, criarServico, listarRegistrosAdmin } from "./utils";

export type RestauranteAdminRow = {
  slug: string;
  categoria: string | null;
  titulo: string | null;
  descricao: string | null;
  logo: string | null;
  imagem: string | null;
  whatsapp: string | null;
  instagram: string | null;
  endereco: string | null;
  funcionamento: string | null;
  contato: string | null;
  sobre: string[] | null;
  especialidades: string[] | null;
  diferenciais: string[] | null;
  destaque_listagem: string | null;
  status: string | null;
  updated_at?: string | null;
  atualizado_em?: string | null;
};

function sanitizarArrayStrings(valor: unknown): string[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Restaurante {
  const sobre = sanitizarArrayStrings(row.sobre);
  const especialidades = sanitizarArrayStrings(row.especialidades);
  const diferenciais = sanitizarArrayStrings(row.diferenciais);

  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    logo: row.logo ?? row.imagem ?? "",
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    endereco: row.endereco,
    funcionamento: row.funcionamento,
    contato: row.contato,
    sobre,
    especialidades,
    diferenciais,
    destaqueListagem: row.destaque_listagem || especialidades[0] || row.categoria,
  };
}

const servico = criarServico<Restaurante>({
  tabela: "restaurantes",
  ordem: { coluna: "atualizado_em" },
  mapRow,
});

export const listarRestaurantes = servico.listar;
export const buscarRestaurantePorSlug = servico.buscarPorSlug;
export const listarFiltrosRestaurantes = servico.listarFiltros;
export const listarRestaurantesAdmin = () =>
  listarRegistrosAdmin<RestauranteAdminRow>("restaurantes", {
    coluna: "atualizado_em",
  });
export const buscarRestaurantePorSlugAdmin = (slug: string) =>
  buscarRegistroAdminPorSlug<RestauranteAdminRow>("restaurantes", slug);
