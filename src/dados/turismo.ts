export type RoteiroTuristico = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  duracao: string;
  formato: string;
  contato: string;
  sobre: string[];
  inclui: string[];
  diferenciais: string[];
  destaqueListagem: string;
};

export const roteirosTuristicos: RoteiroTuristico[] = [];
