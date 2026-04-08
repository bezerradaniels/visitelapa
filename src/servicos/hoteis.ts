import { Hotel } from "@/dados/hoteis";
import { buscarRegistroAdminPorSlug, criarServico, listarRegistrosAdmin } from "./utils";

export type HotelAdminRow = {
  slug: string;
  categoria: string | null;
  titulo: string | null;
  descricao: string | null;
  imagem: string | null;
  logo?: string | null;
  whatsapp: string | null;
  instagram: string | null;
  localizacao: string | null;
  check_in: string | null;
  check_out: string | null;
  contato: string | null;
  sobre: string[] | null;
  comodidades: string[] | null;
  diferenciais: string[] | null;
  destaque_listagem: string | null;
  status: string | null;
  updated_at?: string | null;
  atualizado_em?: string | null;
};

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
export const listarHoteisAdmin = () =>
  listarRegistrosAdmin<HotelAdminRow>("hoteis", {
    coluna: "atualizado_em",
  });
export const buscarHotelPorSlugAdmin = (slug: string) =>
  buscarRegistroAdminPorSlug<HotelAdminRow>("hoteis", slug);
