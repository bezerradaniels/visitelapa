import { Evento } from "@/dados/eventos";
import { buscarRegistroAdminPorSlug, criarServico, listarRegistrosAdmin } from "./utils";

export type EventoAdminRow = {
  slug: string;
  categoria: string | null;
  titulo: string | null;
  descricao: string | null;
  imagem: string | null;
  whatsapp: string | null;
  instagram: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  local: string | null;
  contato: string | null;
  programacao: string[] | null;
  destaques: string[] | null;
  destaque_listagem: string | null;
  valor_ingresso: number | null;
  gratuito: boolean | null;
  status: string | null;
  updated_at?: string | null;
  atualizado_em?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Evento {
  return {
    slug: row.slug,
    categoria: row.categoria,
    titulo: row.titulo,
    descricao: row.descricao,
    imagem: row.imagem,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    data: row.data_inicio ?? "",
    local: row.local,
    contato: row.contato,
    sobre: row.sobre ?? [],
    programacao: row.programacao ?? [],
    destaques: row.destaques ?? [],
    destaqueListagem: row.destaque_listagem,
  };
}

const servico = criarServico<Evento>({
  tabela: "eventos",
  ordem: { coluna: "data_inicio", ascendente: true },
  mapRow,
});

export const listarEventos = servico.listar;
export const buscarEventoPorSlug = servico.buscarPorSlug;
export const listarFiltrosEventos = servico.listarFiltros;
export const listarEventosAdmin = () =>
  listarRegistrosAdmin<EventoAdminRow>("eventos", {
    coluna: "data_inicio",
    ascendente: true,
  });
export const buscarEventoPorSlugAdmin = (slug: string) =>
  buscarRegistroAdminPorSlug<EventoAdminRow>("eventos", slug);
