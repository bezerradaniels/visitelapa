export type Evento = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  data: string;
  local: string;
  contato: string;
  sobre: string[];
  programacao: string[];
  destaques: string[];
  destaqueListagem: string;
};

export const eventos: Evento[] = [];
