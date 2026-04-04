export type Restaurante = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  endereco: string;
  funcionamento: string;
  contato: string;
  sobre: string[];
  especialidades: string[];
  diferenciais: string[];
  destaqueListagem: string;
};

export const restaurantes: Restaurante[] = [];
