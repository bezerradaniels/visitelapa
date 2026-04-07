import { Restaurante } from "@/dados/restaurantes";
import { criarServico } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Restaurante {
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
    sobre: row.sobre ?? [],
    especialidades: row.especialidades ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem: row.destaque_listagem || row.especialidades?.[0] || row.categoria,
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
