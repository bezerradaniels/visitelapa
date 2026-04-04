export type Hotel = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  localizacao: string;
  checkIn: string;
  checkOut: string;
  contato: string;
  sobre: string[];
  comodidades: string[];
  diferenciais: string[];
  destaqueListagem: string;
};

export const hoteis: Hotel[] = [];
