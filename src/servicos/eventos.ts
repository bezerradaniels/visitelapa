import { Evento } from "@/dados/eventos";
import { criarServico } from "./utils";

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
