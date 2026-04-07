import { Hotel } from "@/dados/hoteis";
import { criarServico } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Hotel {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    localizacao: row.localizacao,
    checkIn: row.check_in,
    checkOut: row.check_out,
    contato: row.contato,
    sobre: row.sobre ?? [],
    comodidades: row.comodidades ?? [],
    diferenciais: row.diferenciais ?? [],
    destaqueListagem:
      row.destaque_listagem ||
      row.diferenciais?.[0] ||
      row.comodidades?.[0] ||
      row.categoria,
  };
}

const servico = criarServico<Hotel>({
  tabela: "hoteis",
  ordem: { coluna: "atualizado_em" },
  mapRow,
});

export const listarHoteis = servico.listar;
export const buscarHotelPorSlug = servico.buscarPorSlug;
export const listarFiltrosHoteis = servico.listarFiltros;
